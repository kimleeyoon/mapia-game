const express = require(`express`); // 익스프레스 프레임워크
const http = require('http'); // http
// const server = require('http').Server(app);
const static = require('serve-static'); // 서버 경로 재지정 해주는
const path = require('path'); // OS Path 조정 시 사용
let bodyParser = require('body-parser');
const EventEmitter = require('events').EventEmitter; // 이벤트 on, listener

const Room = require('./room'); // 방 class
const Member = require('./member') // 멤버 class
const system = require('./logic'); // 로직 프로그램
const getT = require('./main/index').getText;

let nugu = require('./main'); // 스피커 서버에서 실행할 프로그램 받아오는 것 -> index.js

const app = express();
let router = express.Router();

app.use('/', static(path.join(__dirname, 'public/dist'))); // public/dist 폴더를 클라이언트가 루트경로로 접근하도록 해줌

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use((err, req, res, next) => next());

// router.route('/speaker/nugu').post((req, res) => {
//     console.log("asdfdasfasfdsafdsaf");
// });
// router.route('/speaker/nugu/TakePlayerNumAction').post((req, res) => {
//     console.log("asdfdasfasfdsafdsaf");
// });

router.route('/speaker/nugu/TakePlayerNumAction').post((req, res, next) => {
    nugu(speakerCreateRoom, req, res, setPin, next);
    console.log("TakePlayerNumAction");
});

router.route('/speaker/nugu/StartAndCheckRoleAction').post((req, res, next) => {
    nugu(speakerCreateRoom, req, res, next);
    console.log("StartAndCheckRoleAction");
});

router.route('/speaker/nugu/BowHeadAction').post((req, res, next) => {
    nugu(speakerCreateRoom, req, res, next);
    console.log("BowHeadAction");
});

router.route('/speaker/nugu/CheckMapiaAction').post((req, res, next) => {
    nugu(speakerCreateRoom, req, res, next);
    console.log("CheckMapiaAction");
});
router.route('/speaker/nugu/CheckDoctorAction').post((req, res, next) => {
    nugu(speakerCreateRoom, req, res, next);
    console.log("CheckDoctorAction");
});
router.route('/speaker/nugu/CheckPoliceAction').post((req, res, next) => {
    nugu(speakerCreateRoom, req, res, next);
    console.log("CheckPoliceAction");
});
router.route('/speaker/nugu/DebateAction').post((req, res, next) => {
    nugu(speakerCreateRoom, req, res, next);
    console.log("DebateAction");
});
router.route('/speaker/nugu/NightCome').post((req, res, next) => {
    nugu(speakerCreateRoom, req, res, next);
    console.log("NightCome");
});

router.route('/speaker/nugu/LetsStartGameAction').post((req, res, next) => { // 게임 시작
    nugu(speakerCreateRoom, req, res, next);
    console.log(gameStartInformation);
    console.log(req.body.context.session.id);
    gameStartInformation[`${contextId[req.body.context.session.id]}`].run();
    console.log("LetsStartGameAction");
});

router.route('/speaker/nugu/KillNightAction').post((req, res, next) => { // 본격적인 활동 시작
    nugu(speakerCreateRoom, req, res, next);
    console.log("KillNightAction");
    gameStartInformation[`${contextId[req.body.context.session.id]}`].first = true;
});
router.route('/speaker/nugu/CheckWhoDiedActions').post((req, res, next) => {
    nugu(speakerCreateRoom, req, res, next);
    console.log("CheckWhoDiedAction");
    gameStartInformation[`${contextId[req.body.context.session.id]}`].first = true;
});
router.route('/speaker/nugu/FinalArgumentActions').post((req, res, next) => {
    nugu(speakerCreateRoom, req, res, next);
    console.log("FinalArgumentAction");
});
router.route('/speaker/nugu/LetMeOutAction').post((req, res, next) => {
    nugu(speakerCreateRoom, req, res, next);
    console.log("LetMeOutAction");
});
router.route('/speaker/nugu/MaybeMapiaWinActions').post((req, res, next) => {
    nugu(speakerCreateRoom, req, res, next);
    console.log("MaybeMapiaWinAction");
});
router.route('/speaker/nugu/HeIsSavedActions').post((req, res, next) => {
    nugu(speakerCreateRoom, req, res, next);
    console.log("HeIsSavedActions");
});
router.route('/speaker/nugu/HeIsDiedActions').post((req, res, next) => {
    nugu(speakerCreateRoom, req, res, next);
    console.log("HeIsDiedActions");
});
router.route('/speaker/nugu/GameEndMapiaActions').post((req, res, next) => {
    nugu(speakerCreateRoom, req, res, next);
    console.log("GameEndMapiaActions");
});
router.route('/speaker/nugu/GameEndCitizenActions').post((req, res, next) => {
    nugu(speakerCreateRoom, req, res, next);
    console.log("GameEndCitizenActions");
});

const server = http.Server(app); // 익스프레스 사용해서 서버 생성 및 할당
const io = require('socket.io')(server); // socket.io 서버 생성

app.use('/', router);

server.listen(3000, () => { // 3000포트에서 서버 열음
    console.log('Server Open 3000');
    // createRoom(room, 4);
    // createRoom(room, 6);
    // createRoom(room, 5);
    // 3개의 방 생성
});


// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/dist/index.html');
// });

// io.on('connection', function (socket) {
//     console.log(socket.id)
//     console.log("Someone connected to server without namespace");
// });
class Countdown extends EventEmitter { // 제한시간 초과시 프라미스 실패내기위한 클래스
    constructor(seconds) {
        super();
        this.seconds = seconds; // 제한 시간
    }
    go(decide) {
        const countdown = this;
        const timeoutIds = [];
        return new Promise(function (resolve, reject) {
            for (let i = countdown.seconds; i >= 0; i -= 0.5) {
                timeoutIds.push(setTimeout(function () {
                    if (decide.isEnd()) { // 사람들로부터 투표 다 받았으면
                        timeoutIds.forEach(clearTimeout); // 지정된 setTimeout 초기화
                        resolve(); // Promise Resolve
                    }

                    countdown.emit('tick', countdown.seconds, i); // 클라이언트 Progress바 표시를 위해 이벤트 발생
                    if (i === 0) reject(); // 시간 다 지나면 Promise Reject
                }, (countdown.seconds - i) * 1000));
            }
        });
    }
}

class dMessage { // decide 관리를 위한 class
    constructor(id) {
        this.count = 0; // 요청온 카운트
        this.decides = []; // 사람들 결정 저장
        this.num = 0; // 총 받아야하는 결정 수
        this.id = id; // 어떤 방의 decide인지를 위한 id
    }
    add(data) { // 사용자로부터 요청이 오면
        this.count++;
        this.decides.push(data);
        // count 증가 후 decides에 응답 온 결정 추가

        console.log(this.decides);
        console.log(`num : ${this.num} count = ${this.count}`);
    }
    setNum(n) {
        this.num = n; //  받아야하는 결정 수 설정
    }
    reset() { // 초기화 함수
        this.count = 0;
        this.decides = [];
        this.num = 0;
    }
    isEnd() { // 결정 다 받았는지 확인하는 함수
        // return this.num <= this.count;
        return false;
    }
}

class gameStartInformationClass {
    constructor(system, member, io, room, curDecide, getT, data) {
        this.system = system;
        this.member = member;
        this.io = io;
        this.room = room;
        this.decide = curDecide;
        this.getT = getT;
        this.data = data;
        this.first = false;
        this.mapiaDo = false;
        this.doctorDo = false;
        this.policeDo = false;
    }
    run() {
        io.to(`${this.room}`).emit('START_GAME', this.data);
        grun(this.system, this.member, this.io, this.room, this.decide, this.getT);
    }
}


let room = [];

let decides = [];

let gameStartInformation = {};

let contextId = {};

function setPin(session, pin) {
    contextId[session] = `${pin}`;
}


io.on('connection', (socket) => { // 사용자 접속 오면

    let curRoom; // 소켓이 접속중인 방
    let curDecide; // 소켓이 접속중인 방을 관리할 decide
    socket.on('disconnect', () => { // 접속 끊기면

    });
    socket.on('ROLE_FEEDBACK', (data) => { // 사용자가 역할 할당받고 다시 서버에 보내준거 받는 프로토콜

        curRoom.member[curRoom.member.findIndex(o => o.name == data.name)].role = data.role; // curRoom 멤버에서 해당 멤버 찾아서 역할 저장

    });
    socket.on("DECIDE", data => { // 사용자가 결정하면

        curDecide.add(data.message); // curDecide에 온 결정 추가

        curRoom.member.filter(o => o.role === data.fromRole).forEach((o) => { // 같은 역할을 가진 다른 플레이어들에게 결정 공유
            io.to(o.socket).emit("DECIDE_BADGE", data.message);
        });

        curRoom.member.forEach((o) => { // 투표하는 경우 모든 플레이어에게 투표 결과 공유
            io.to(o.socket).emit("VOTE_BADGE", data.message);
        });
    });

    socket.on('ROOM_CONNECT', (data) => { // 사용자가 방에 들어오면
        if (!room.some(x => x.id == data.room)) { // 없는 방이라면
            console.log(`사용자가 없는 방에 접속 시도 : ${data.room}`);
            io.to(socket.id).emit("WRONG_ROOM");
        } else { // 맞는 방이라면
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            curRoom = room.find(o => o.id == data.room); // 사용자가 접속중인 현재 방
            curDecide = decides.find(o => `${o.id}` === `${data.room}`); // 사용자가 접속중인 방의 decide
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if (curRoom.size <= curRoom.member.length) { // 방 꽉차면
                io.to(socket.id).emit("FULL_OF_ROOM");
            } else { // 방 비어있으면
                curRoom.member.push(new Member(data.name, socket.id, socket.on)); // 해당 방에 접속한 멤버 추가
                socket.join(`${data.room}`, () => { // 해당 방에 유저를 추가
                    console.log(`${data.name}이 방(${data.room})에 들어옴`);
                    data.member = curRoom.member;
                    data.size = curRoom.size;
                    // 해당 방에 접속중인 멤버와 사람 수 설정 후 방에 있는 모든 사용자에게 유저가 접속했음을 알림
                    io.to(`${data.room}`).emit('ROOM_CONNECT', data);
                });

                io.to(socket.id).emit("ENTER_ROOM", { // 사용자가 방에 접속하는데 성공했음을 알림
                    none: "여기에는 무슨 말을 써야할까요?"
                });

                if (curRoom.size === curRoom.member.length) { // 방에 사람 다 들어왔다면
                    data.member = curRoom.member;
                    data.size = curRoom.size;
                    // io.to(`${data.room}`).emit('START_GAME', data);
                    console.log("게임 시작");
                    // 해당 방 정보 재설정 후 게임이 시작함을 방에 있는 모든 유저들에게 알림
                    gameStartInformation[`${data.room}`] = new gameStartInformationClass(system, curRoom.member, io, `${data.room}`, curDecide, getT, data);
                    // grun(system, curRoom.member, io, `${data.room}`, curDecide, getT);

                    // 게임 메인 프로토콜 실행
                }
            }
        }
    });
});

function grun(g, member, io, room, curDecide, getText) {
    // 게임 메인 로직을 실행하기위한 제너레이터 실행 함수
    // 마피아 게임은 이 위에서 돌아감

    const it = g(member); // 제너레이터로부터 이터레이터를 얻음

    (function iterate(val) {
        const x = it.next(val);
        if (!x.done) { // 제너레이터 아직 안끝났다면
            if (x.value instanceof Promise) { // 프라미스 종류라면
                x.value.then(iterate).catch(err => it.throw(err)); // 프라미스 완료되면 다음 yield 실행
            } else { // 프라미스가 아니라면

                if (x.value instanceof Object) { // Object가 메시지로 왔다며
                    if (x.value.do === "AnnounceRole") { // 역할 공지라면
                        io.to(member.find(o => o.name == x.value.name).socket).emit("ROLE_ALERT", `${x.value.role}`);
                        console.log("역할 공지 완료");
                        setTimeout(iterate, 0, x.value);
                        // 모든 사용자에게 역할 공지하고 다음 명령 실행
                    } else if (x.value.do === "WAIT_FIRST_NIGHT") {
                        (function k() {
                            if (gameStartInformation[room].first) {
                                gameStartInformation[room].first = false;
                                setTimeout(iterate, 0, x.value);
                            } else {
                                setTimeout(k, 0.5);
                            }
                        })();
                    } else if (x.value.do === "WAIT_CHECK") {
                        (function k() {
                            if (gameStartInformation[room].first) {
                                gameStartInformation[room].first = false;
                                setTimeout(iterate, 0, x.value);
                            } else {
                                setTimeout(k, 0.5);
                            }
                        })();
                    } else if (x.value.do === "WAIT_SECOND") {
                        console.log(`${x.value.time} 기다리기`);
                        setTimeout(iterate, x.value.time * 1000, x.value);
                    } else if (x.value.do === "VOTE_TEXT") {
                        const it = getText(room, 'vote');
                        it.next();
                        if (x.value.isDeath == 0) { // 죽은 사람이 없는 경우
                            it.next('');
                        } else { // 죽은 사람이 있는 경우
                            it.next(x.value.text);
                        }
                        setTimeout(iterate, 0, x.value);
                    } else if (x.value.do === "DAY_TEXT") {
                        console.log("스피커한테 day 보낼 준비 from app.js");
                        const it = getText(room, 'day');
                        console.log("이터레이터 실행");
                        console.log(it);
                        console.log(it.next());
                        it.next(x.value.day);
                        setTimeout(iterate, 0, x.value);
                    } else if (x.value.do === "ResultOfInvestigation") { // 경찰 조사 결과 전송
                        for (let name of x.value.nameList) {
                            io.to(member.find(o => o.name == name).socket).emit("RESULT_OF_INVESTIGATION", {
                                name: `${x.value.name}`,
                                role: `${x.value.role}`
                            });
                        } // 경찰 찾아서 조사 결과 전송
                        setTimeout(iterate, 0, x.value);
                    }else if(x.value.do === "AFTER_TEXT"){
                        console.log("스피커한테 after 보낼 준비 from app.js");
                        const it = getText(room, 'after');
                        console.log("이터레이터 실행");
                        console.log(it);
                        console.log(it.next());
                        it.next({text: x.value.text, isCitizenWin: x.value.win});
                        setTimeout(iterate, 0, x.value);
                    }else if (x.value.do === "DEATH_UPDATE") { // 죽은 사람 업데이트
                        for (let tempMember of x.value.nameList) {
                            let tempSocket = member.find(o => o.name == tempMember.name);
                            io.to(tempSocket.socket).emit("UPDATE_LIST", x.value.nameList);
                        }
                        // 방에 있는 모든 유저에게 살아있는 사람들 목록 전송
                        setTimeout(iterate, 0, x.value);
                    } else if (x.value.do === "Assassinate") { // 암살 명령 오면

                        const c = sendSocket(io, member, x, curDecide) // 해당 명령 보낸 후 Countdown 리턴 받음
                        c.go(curDecide)
                            .then(() => { // 사용자 결정 다 받으면
                                io.to(room).emit("END_DECIDE");
                                setTimeout(iterate, 0, curDecide.decides)
                            })
                            .catch(() => { // 시간 초과
                                io.to(room).emit("END_DECIDE");
                                setTimeout(iterate, 0, curDecide.decides)
                            });

                    } else if (x.value.do === "Treatment") { // 의사 명령

                        const c = sendSocket(io, member, x, curDecide) // 해당 명령 보낸 후 Countdown 리턴 받음
                        c.go(curDecide)
                            .then(() => { // 결정 다 받으면
                                io.to(room).emit("END_DECIDE");
                                setTimeout(iterate, 0, curDecide.decides)
                            })
                            .catch(() => { // 시간 초과
                                io.to(room).emit("END_DECIDE");
                                setTimeout(iterate, 0, curDecide.decides)
                            });
                    } else if (x.value.do === "Investigation") { // 경찰 조사

                        const c = sendSocket(io, member, x, curDecide) // // 해당 명령 보낸 후 Countdown 리턴 받음
                        c.go(curDecide)
                            .then(() => { // 결정 다 받으면
                                io.to(room).emit("END_DECIDE");
                                setTimeout(iterate, 0, curDecide.decides)
                            })
                            .catch(() => {
                                io.to(room).emit("END_DECIDE");
                                setTimeout(iterate, 0, curDecide.decides)
                            });

                    } else if (x.value.do === "Vote") { // 투표 받으면

                        const c = sendSocket(io, member, x, curDecide) // 해당 명령 보낸 후 Countdown 리턴 받음
                        c.go(curDecide)
                            .then(() => { // 다 받으면
                                io.to(room).emit("END_DECIDE");
                                setTimeout(iterate, 0, curDecide.decides)
                            })
                            .catch(() => { // 시간 다됨
                                console.log("투표 타임아웃");
                                io.to(room).emit("END_DECIDE");
                                setTimeout(iterate, 0, curDecide.decides)
                            });
                    }
                } else { // 단순한 메시지 전송용
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

function sendSocket(io, member, x, decide, time) { // 사용자에게 결정 받는 소켓 전송 함수

    let num = x.value.nameList.length; // 보낼 사람 수
    decide.reset();
    decide.setNum(num)
    // 결정 초기화
    const c = new Countdown(20);
    c.on('tick', (total, i) => { // 작업 진행 바 조절을 위한 tick 이벤트 발생
        for (let name of x.value.nameList) {
            let tempSocket = member.find(o => o.name == name);
            io.to(tempSocket.socket).emit("TICK", total, i);
        }
    })
    for (let name of x.value.nameList) {
        let tempSocket = member.find(o => o.name == name);
        io.to(tempSocket.socket).emit(x.value.do.toUpperCase());
    }
    // 사람들한테 소켓 전송
    return c; // Countdown 반환
}

function speakerCreateRoom(size) {
    return new Promise((resolve, reject) => {
        let id = createRoom(room, size);
        if (id == -1) {
            reject();
        } else {
            resolve(id);
        }
    });
    // return createRoom(room, size);
}

function createRoom(rooms, size) { // 특정 사이즈의 방 생성
    let id = -1;
    do {
        id = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    } while (room.some(x => x.id === id));
    // 중복되지 않는 id 할당
    rooms.push(new Room(id, size));
    decides.push(new dMessage(id));
    // rooms와 decide에 할당

    console.log(`${rooms[rooms.length - 1].id} room 생성`);
    console.log(rooms);

    return id;

    // createSocket(rooms, rooms.length - 1);
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

module.exports = speakerCreateRoom;