const app = require(`express`)();
const http = require('http');
// const server = require('http').Server(app);
const static = require('serve-static');
const path = require('path');
const EventEmitter = require('events').EventEmitter;

const Room = require('./room');
const Member = require('./member')
const system = require('./logic');

app.use(static(path.join(__dirname, 'public/dist')));

const server = http.Server(app);
const io = require('socket.io')(server);

server.listen(3000, () => {
    console.log('Server Open 3000');
    createRoom(room, 4);
    createRoom(room, 2);
    createRoom(room, 5);
});


// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/dist/index.html');
// });

// io.on('connection', function (socket) {
//     console.log(socket.id)
//     console.log("Someone connected to server without namespace");
// });
class Countdown extends EventEmitter {
    constructor(seconds, decide) {
        super();
        this.seconds = seconds;
        this.decide = decide;
    }
    go() {
        const countdown = this;
        const timeoutIds = [];
        return new Promise(function (resolve, reject) {
            for (let i = countdown.seconds; i >= 0; i--) {
                timeoutIds.push(setTimeout(function () {
                    if (decide.isEnd()) {
                        console.log("카운트다운 종료");
                        timeoutIds.forEach(clearTimeout);
                        resolve();
                    }

                    // if(i === 13){
                    // 	timeoutIds.forEach(clearTimeout);
                    // 	return reject(new Error("Oh my god!"));
                    // }

                    countdown.emit('tick', countdown.seconds, i);
                    if (i === 0) reject();
                }, (countdown.seconds - i) * 1000));
            }
        });
    }
}

class dMessage {
    constructor() {
        this.count = 0;
        this.decides = [];
        this.num = 0;
    }
    add(data) {
        this.count++;
        this.decides.push(data);

        console.log(this.decides);
        console.log(`num : ${this.num} count = ${this.count}`);
    }
    setNum(n) {
        this.num = n;
    }
    reset() {
        this.count = 0;
        this.decides = [];
        this.num = 0;
    }
    isEnd() {
        return this.num <= this.count;
    }
}

let room = [];
// 방별 객체로 수정해야 함 아래
let decide = new dMessage();
// let decideMessageFunction = (function() {
//     let count = 0;
//     let decides = [];
//     return function(){

//     };
// })();



io.on('connection', (socket) => {
    // console.log("Someone Connected");
    let curRoom;
    socket.on('disconnect', () => {
        // console.log('user disconnected');
    });
    socket.on('ROLE_FEEDBACK', (data) => {
        // curRoom.member[data.name].role = data.role;
        // console.log(curRoom.member);
        let k = Object.keys(curRoom.member).filter(o => o === data.name);
        console.log(k);
        console.log(curRoom.member[k]);
        // curRoom.member[k].role = data.role;
        // Object.keys(curRoom.member).forEach(o => console.log(o));
        console.log("Asdfadsfsdf");
    });
    socket.on("DECIDE", data => {
        // count++;
        // decides.append(data);
        // console.log("DECIDE 옴!!!!");
        // console.log(decides);
        // console.log(`num : ${num} count = ${count}`);
        console.log("DECIDE 옴!!!!");
        decide.add(data.message);
        console.log(`Data 온 직업 : ${data.fromRole}`);
        console.log(curRoom.member);
        let otherPlayer = Object.keys(curRoom.member).filter(o => o.role === data.fromRole); // 같은 직업
        console.log(otherPlayer);
        otherPlayer.forEach((o) => {
            console.log(o.name);
            io.to(o.socket).emit("DECIDE_BADGE", data.message);
        });
    });
    socket.on('ROOM_CONNECT', (data) => {
        if (!room.some(x => x.id == data.room)) {
            console.log(`사용자가 없는 방에 접속 시도 : ${data.room}`);
            io.to(socket.id).emit("WRONG_ROOM");
        } else {
            curRoom = room.find(o => o.id == data.room);
            // console.log(curRoom);
            if (curRoom.size <= curRoom.member.length) {
                io.to(socket.id).emit("FULL_OF_ROOM");
            } else {
                curRoom.member.push(new Member(data.name, socket.id, socket.on));
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
                    console.log("게임 시작");
                    grun(system, curRoom.member, io, `${data.room}`);

                }
            }
        }
    });
});

function grun(g, member, io, room) {
    const it = g(member);
    (function iterate(val) {
        const x = it.next(val);
        if (!x.done) {
            if (x.value instanceof Promise) {
                x.value.then(iterate).catch(err => it.throw(err));
            } else {
                // console.log("Iterator 안에서 프라미스 아닌거");
                // console.log(room);
                if (x.value instanceof Object) {
                    if (x.value.do === "AnnounceRole") {
                        io.to(member.find(o => o.name == x.value.name).socket).emit("ROLE_ALERT", `${x.value.role}`);
                        setTimeout(iterate, 0, x.value);
                    } else if (x.value.do === "ResultOfInvestigation") {
                        io.to(member.find(o => o.name == x.value.name).socket).emit("RESULT_OF_INVESTIGATION", {
                            name: `${x.value.name}`,
                            role: `${x.value.role}`
                        });
                        setTimeout(iterate, 0, x.value);
                    } else if (x.value.do === "Assassinate") {
                        let num = x.value.nameList.length; // 마피아 수
                        decide.reset();
                        decide.setNum(num)
                        const c = new Countdown(30);
                        c.on('tick', (total, i) => {
                            for (let name of x.value.nameList) {
                                let tempSocket = member.find(o => o.name == name);
                                io.to(tempSocket.socket).emit("TICK", total, i);
                            }
                        })
                        console.log("마피아 카운트 다운 시작");
                        for (let name of x.value.nameList) {
                            let tempSocket = member.find(o => o.name == name);
                            io.to(tempSocket.socket).emit("ASSASSINATE");
                        }
                        c.go()
                            .then(() => {
                                io.to(room).emit("END_DECIDE");
                                setTimeout(iterate, 0, decide.decides)
                            })
                            .catch(() => {
                                console.log("마피아 타임아웃");
                                io.to(room).emit("END_DECIDE");
                                setTimeout(iterate, 0, [])
                            });

                    } else if (x.value.do === "Treatment") {
                        let num = x.value.nameList.length; // 의사 수
                        decide.reset();
                        decide.setNum(num)
                        const c = new Countdown(30);
                        c.on('tick', (total, i) => {
                            for (let name of x.value.nameList) {
                                let tempSocket = member.find(o => o.name == name);
                                io.to(tempSocket.socket).emit("TICK", total, i);
                            }
                        })
                        for (let name of x.value.nameList) {
                            let tempSocket = member.find(o => o.name == name);
                            io.to(tempSocket.socket).emit("TREATMENT");
                        }
                        c.go()
                            .then(() => {
                                io.to(room).emit("END_DECIDE");
                                setTimeout(iterate, 0, decide.decides)
                            })
                            .catch(() => {
                                console.log("의사 타임아웃");
                                io.to(room).emit("END_DECIDE");
                                setTimeout(iterate, 0, [])
                            });
                    } else if (x.value.do === "Investigation") {
                        let num = x.value.nameList.length; // 경찰 수
                        console.log("경찰 조사 app 들어옴");
                        decide.reset();
                        decide.setNum(num)
                        console.log(decide.decides);
                        console.log(decide.isEnd());
                        const c = new Countdown(30);
                        c.on('tick', (total, i) => {
                            for (let name of x.value.nameList) {
                                let tempSocket = member.find(o => o.name == name);
                                io.to(tempSocket.socket).emit("TICK", total, i);
                            }
                        })
                        console.log("카운트다운 시작");
                        for (let name of x.value.nameList) {
                            console.log("경찰 for문 안");
                            console.log(`name : ${name}`);
                            let tempSocket = member.find(o => o.name == name);
                            io.to(tempSocket.socket).emit("INVESTIGATION");
                            console.log("경찰한테 소켓 보냄");
                        }
                        c.go()
                            .then(() => {
                                io.to(room).emit("END_DECIDE");
                                setTimeout(iterate, 0, decide.decides)
                            })
                            .catch(() => {
                                console.log("경찰 타임아웃");
                                io.to(room).emit("END_DECIDE");
                                setTimeout(iterate, 0, [])
                            });
                        // c.go()
                        //     .then(() => {
                        //         console.log("카운트 안 resolve");
                        //         console.log(decide.decides);
                        //     })
                        //     .catch(() => console.log("에러"));
                    }
                } else {
                    io.to(room).emit("ALERT", {
                        message: x.value
                    });
                    setTimeout(iterate, 0, x.value);
                }
                // setTimeout(iterate, 0, x.value);
            }
        }
    })();
}

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