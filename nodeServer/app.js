const app = require(`express`)();
const http = require('http');
// const server = require('http').Server(app);
const static = require('serve-static');
const path = require('path');

const Room = require('./room');
const Member = require('./member')

app.use(static(path.join(__dirname, 'public')));
console.log(path.join(__dirname, 'public'));

const server = http.Server(app);
const io = require('socket.io')(server);

server.listen(3000, () => {
    console.log('Server Open 3000');
    createRoom(room, 4);
    createRoom(room, 2);
    createRoom(room, 5);
});


// app.get('/', (req, res) => {
//     // res.sendFile(__dirname + './public/index.html');
//     console.log("Someone connected to server without namespace");
// });

// io.on('connection', function (socket) {
//     console.log(socket.id)
//     console.log("Someone connected to server without namespace");
// });

let room = [];

io.on('connection', (socket) => {
    // console.log("Someone Connected");
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('ROOM_CONNECT', (data) => {
        if (!room.some(x => x.id == data.room)) {
            console.log(`사용자가 없는 방에 접속 시도 : ${data.room}`);
            io.to(socket.id).emit("WRONG_ROOM");
        } else {
            let curRoom = room.find(o => o.id == data.room);
            console.log(curRoom);
            if (curRoom.size <= curRoom.member.length) {
                io.to(socket.id).emit("FULL_OF_ROOM");
            } else {
                curRoom.member.push(new Member(data.name, socket.id));
                socket.join(`${data.room}`, () => {
                    console.log(`${data.name}이 방(${data.room})에 들어옴`);
                    data.member = curRoom.member;
                    data.size = curRoom.size;
                    io.to(`${data.room}`).emit('ROOM_CONNECT', data);
                });
                io.to(socket.id).emit("ENTER_ROOM", {
                    none: "여기에는 무슨 말을 써야할까요?"
                });
                if (curRoom.size === curRoom.member.length) {
                    io.to(`${data.room}`).emit('START_GAME');
                }
            }
        }
    });
})

function createRoom(room, size) {
    let id = -1;
    do {
        id = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    } while (room.some(x => x.id === id));
    room.push(new Room(id, size));
    console.log(`Id : ${id}`);
    createSocket(room, room.length - 1);
}

function createSocket(rooms, index) {
    // nameSpaces[index].io = io.of(`/namespace${nameSpaces[index].id}`);
    // console.log(`${nameSpaces[index].id} namespace 생성`);
    console.log(`${rooms[index].id} room 생성`);
    console.log(rooms);

    // nameSpaces[index].io.on('connection', (socket) => {
    //     console.log("Someone Connected");
    //     // nameSpaces[index].io.emit('connect', {hello: `Someone connected at id : ${nameSpaces[index].id}`});
    //     nameSpaces[index].io.emit('announce', "");
    //     socket.on('message', (data) => {
    //         console.log(data);
    //         nameSpaces[index].io.emit('announce', `${data}`);
    //     });
    // });
}



// // NameSpace 1번
// const namespace1 = io.of('/namespace1');
// // connection을 받으면, news 이벤트에 hello 객체를 담아 보낸다
// namespace1.on('connection', (socket) => {
//     namespace1.emit('news', { hello: "Someone connected at namespace1"});
// });
// // NameSpace 2번
// const namespace2 = io.of('/namespace2');
// // connection을 받으면, news 이벤트에 hello 객체를 담아 보낸다
// namespace2.on('connection', (socket) => {
//     namespace2.emit('news', { hello: "Someone connected at Namespace2"});
// });