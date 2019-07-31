function parse(str) { //변수에 변수를 포함하는 문자열을 넣기 위한 함수
    var args = [].slice.call(arguments, 1)
    var i = 0;

    return str.replace(/%s/g, function () {
        return args[i++];
    });
}


//가능 플레이어수는 min 3, max 10
//역할 분배 시 인원이 5명 이상일 경우 의사와 경찰의 합친 수는 같되 그 둘의 개수는 랜덤으로 후에 바꿔도 좋음. 예를 들어 6명이 플레이 할 시 의사 1명, 경찰 1명이 아닌 맞의, 맞경일수도 있다는 말.

//shuffle(roleArray[numOfPlayer - 3]).map((role, index) => afterList[playerNameList[index]] = role);
//console.log(afterList);

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

//////*마피아 게임에서 사용되는 전역변수 선언구간*///////

// var numOfPlayer;
// var checkRange = 0; //입력한 플레이어의 명수값이 숫자가 아닌 다른값인지, 혹은 min과 max값을 벗어났는지 확인하는 변수
// //var playerNameList = {"이현주":"마피아", "윤종원":"시민", "최형규":"시민", "김현주":"시민", "신석경":"마피아", "김혜성":"의사", "강민우":"경찰"};
// //var initialPlayerNameList = JSON.parse(JSON.stringify(playerNameList));
// //var playerNames = Object.playerNames(playerNameList);   //객체 접근을 위한 선언

// var mapiaPick; //마피아가 죽이기 위해 지목한 사람
// var doctorPick; //의사가 살리기 위해 지목한 사람
// var policePick; //경찰이 조사하기 위해 지목한 사람
// var mapiaVSdoctorResult = "None"; //마피아가 이겼는지 의사가 이겼는지를 알려주는 결과값
// var idOfPolicePick = 0; //경찰이 조사한 사람의 정체
// var idOfMapiaPick = 0; //마피아가 암살한 사함의 정체
// var doctorAlive = 0; //살아있는 의사가 있는지 없는지 조사하는 변수
// var policeAlive = 0; //살아있는 경찰이 있는지 없는지 조사하는 변수

/////////////////////////////////////////////////////////////////////////////////


//////*마피아 게임에서 player수에 따라 게임환경을 조성하는 구간*///////

function takePlayerName(playerNum) { //입력한 플레이어 명수만큼 이름을 등록하는 함수
    let playerName = [];
    for (var i = 0; i < playerNum; i++) {
        playerName[i] = prompt(i + 1 + '번 플레이어의 이름을 입력해주세요.');
    }
    return playerName;
}

function allocatePlayerRole(roleArray, playerNameList, memberClass) {
    let afterList = {};
    let numOfPlayer = playerNameList.length;
    shuffle(roleArray[numOfPlayer - 3]).map((role, index) => afterList[playerNameList[index]] = role);
    Object.keys(afterList).map(o => memberClass.setRole(o, afterList[o]));
    return afterList;
    //console.log(afterlist);
}

function allocateSocket(member, playerNameList) {
    let socketList = {};
    for (let k in playerNameList) {
        socketList[k] = member[k].socket;
    }
    return socketList;
    //console.log(afterlist);
}

////////////////////////////////////////////////////////////////////////////////


//////*마피아 게임에서 밤에 시행되는 함수선언구간*///////

function takePlayerNum(playerNum) { //게임 플레이어 명 수를 입력받고 적절한 값인지 판별하는 함수
    let checkRange = 0;
    if (isNaN(playerNum)) {
        checkRange = 0;
    } else if (playerNum < 3 || 10 < playerNum) {
        checkRange = 0;
    } else {
        checkRange = 1;
    }
    return checkRange;
}

function savePlayer(mapiaPick, doctorPick, doctorAlive, afterList) { //의사가 사람을 살리는 함수
    //doctorPick = prompt('의사는 살릴 사람을 선택해주세요.');   //의사가 살릴 사람을 지목
    // TODO: 마피아가 죽이는 사람 없는 경우 처리하기
    let mapiaVSdoctorResult = "None";

    // FIXME: 미파아와 의사가 둘다 아무것도 입력 안해서 아래 if 조직 통과하는 부분 수정해야 함
    if (doctorPick == mapiaPick) {
        mapiaVSdoctorResult = parse('의사가 플레이어를 살렸습니다.');
    } else if (doctorAlive == 0) {
        mapiaVSdoctorResult = parse('의사가 플레이어를 살리지 못했습니다. 마피아가 죽인 플레이어는 %s님 입니다.', mapiaPick);
    } else if (doctorPick != mapiaPick) {
        mapiaVSdoctorResult = parse('의사가 플레이어를 살리지 못했습니다. 마피아가 죽인 플레이어는 %s님 입니다.', mapiaPick);
        delete afterList[mapiaPick];
    } else if (doctorPick == 0) {
        mapiaVSdoctorResult = parse('의사가 플레이어를 살리지 못했습니다. 마피아가 죽인 플레이어는 %s님 입니다.', mapiaPick);
    } else if ((afterList[doctorPick] == undefined)) {
        // alert("잘못 입력하셨습니다. 다시 입력해주세요.");
        mapiaVSdoctorResult = "Error";
    }
    return mapiaVSdoctorResult;
}

function assassinatePlayer(playerName, afterList) { //마피아가 사람을 암살하는 함수
    //mapiaPick = prompt('마피아는 죽일 사람을 선택해주세요.');
    console.log("죽일 이름");
    console.log(playerName);
    console.log("사람 목록");
    console.log(afterList);

    // TODO: 마피아 팀킬 불가능???????????????????????????????????????????????????????
    // FIXME:  마피아가 아무것도 입력하지 않은 경우에 undefined 처리하는 로직 만들어야 함

    let idOfMapiaPick = 0;
    if (afterList[playerName] == '경찰') {
        idOfMapiaPick = '경찰';
    } else if (afterList[playerName] == '의사') {
        idOfMapiaPick = '경찰';
    } else if (afterList[playerName] == '시민') {
        idOfMapiaPick = '경찰';
    } else {
        alert("잘못 입력하셨습니다. 다시 입력해주세요.");
        idOfMapiaPick = 0;
    }
    return idOfMapiaPick;
}

function investigatePlayer(playerName, afterList) { //경찰이 사람을 조사하는 함수
    //policePick = prompt('경찰은 조사할 사람을 선택해주세요');
    let idOfPolicePick = 0;
    // TODO: 경찰 셀프 조사 불가능?????????????????????????????????????????????
    // FIXME:  경찰이 아무것도 입력하지 않은 경우에 undefined 처리하는 로직 만들어야 함
    if (afterList[playerName] == '마피아') {
        idOfPolicePick = '마피아';
    } else if (afterList[playerName] == '의사') {
        idOfPolicePick = '의사';
    } else if (afterList[playerName] == '시민') {
        idOfPolicePick = '시민';
    } else {
        alert("잘못 입력하셨습니다. 다시 입력해주세요.");
        idOfPolicePick = 0;
    }
    return idOfPolicePick;
}

function killPlayer(playerName, afterList) { //아래 함수는 '민중'들이 찬반 투표를 통해 과반수 이상이 나온 사람을 사형대에 보낼 때 시
    // TODO: 투표로 죽이는 사람 없는 경우에????
    //playerNameList.splice(playerNameList.indexOf(playerName),1);
    delete afterList[playerName];
    // alert(playerName + "님이 죽었습니다. 생존자를 공개합니다.");
    return afterList
    // for (var key in afterList) {
    //     document.write("player명 : " + key + "<br />");
    // }
    // return afterList;
}

/////////////////**특수직업군 중 생존한 자가 있는지 없는지 판별하는 함수 구간**///////////////////////////

function isThereAnyDoctor(afterList) {
    let doctorAlive = 1;
    for (let key in afterList) {
        if (afterList[key] == '의사') {
            doctorAlive = 0;
            return doctorAlive;
        }
    }
    return doctorAlive;
}

function isThereAnyPolice(afterList) {
    let policeIsAlive = 1;
    for (let key in afterList) {
        if (afterList[key] == '경찰') {
            policeIsAlive = 0;
            return policeIsAlive;
        }
    }
    return policeIsAlive;
}

function nfcall(f, ...args) {
    return new Promise(function (resolve, reject) {
        f.call(null, ...args, function (err, ...args) {
            if (err) return reject(err);
            resolve(args.length < 2 ? args[0] : args);
        });
    });
}

function ptimeout(delay) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, delay);
    });
}

// function fCallPromise(message, toName, toDo){
//     return new Promise((resolve, reject) => {

//     });
// }



////////////////////////////////////////////////////////////////////////////////////////////
// function *callPrompt(message, toName, toDo){
//     let temp = yield { name : toName, msg : message, do : toDo};
//     return temp;
// }
//////////////////////////////////////////////////////////////////////////////////////////////



// yield {name : prop, role : afterList[prop]};

// function pAlert(str){

// }
////////////////////////////////////**Game Zone**////////////////////////////////////////////

class Members {
    constructor(member){
        this.allMemberNameList = member.map(o => o.name);
        this.memberObj = this.allMemberNameList.map((o) => {
            return {
                name: o,
                role : '',
                isAlive: true
            }
        });
    }
    getLive(){
        return this.memberObj.filter(o => o.isAlive === true).map(o => o.name);
    }
    setLive(name, value){
        this.memberObj.find(k => k.name === name).isAlive = !!value;
    }
    setRole(name, role){
        this.memberObj.find(k => k.name === name).role = role;
    }
    getAfterList(){
        let temp = {};
        for(let k of this.memberObj){
            temp[k.name] = k.role
        }
        return temp;
    }
}

function* mainGame(member) {

    // const Q = require('q');
    // console.log("Member");
    // console.log(member);
    let memberClass = new Members(member);
    // console.log(memberClass);

    var playerNameList = [];

    var afterList = {};
    let socketList = {};

    var roleArray = [
        ["마피아", "시민", "시민"],
        ["마피아", "시민", "시민", "시민"],
        ["마피아", "마피아", "시민", "시민", "경찰"],
        ["마피아", "마피아", "시민", "시민", "의사", "경찰"],
        ["마피아", "마피아", "시민", "시민", "시민", "의사", "경찰"],
        ["마피아", "마피아", "시민", "시민", "시민", "의사", "경찰", "경찰"],
        ["마피아", "마피아", "마피아", "시민", "시민", "시민", "의사", "경찰", "경찰"],
        ["마피아", "마피아", "마피아", "시민", "시민", "시민", "의사", "의사", "경찰", "경찰"]
    ];

    // let nameList = member.map(o => o.name);
    let nameList = memberClass.getLive();
    // console.log("Name List");
    // console.log(nameList);

    var numOfPlayer = nameList.length;
    var checkRange = 0; //입력한 플레이어의 명수값이 숫자가 아닌 다른값인지, 혹은 min과 max값을 벗어났는지 확인하는 변수
    //var playerNameList = {"이현주":"마피아", "윤종원":"시민", "최형규":"시민", "김현주":"시민", "신석경":"마피아", "김혜성":"의사", "강민우":"경찰"};
    //var initialPlayerNameList = JSON.parse(JSON.stringify(playerNameList));
    //var playerNames = Object.playerNames(playerNameList);   //객체 접근을 위한 선언

    var mapiaPick; //마피아가 죽이기 위해 지목한 사람
    var doctorPick; //의사가 살리기 위해 지목한 사람
    var policePick; //경찰이 조사하기 위해 지목한 사람
    var mapiaVSdoctorResult = "None"; //마피아가 이겼는지 의사가 이겼는지를 알려주는 결과값
    var idOfPolicePick = 0; //경찰이 조사한 사람의 정체
    var idOfMapiaPick = 0; //마피아가 암살한 사함의 정체
    var doctorAlive = 1; //살아있는 의사가 있는지 없는지 조사하는 변수
    var policeAlive = 1; //살아있는 경찰이 있는지 없는지 조사하는 변수

    // while (checkRange == 0) {
    //     numOfPlayer = prompt('플레이를 할 플레이어의 명수를 숫자로 입력해주세요. (최소 3명, 최대 10명)');
    //     checkRange = takePlayerNum(numOfPlayer);
    // }

    //역할 할당 코드 삽입하기 
    // playerNameList = takePlayerName(numOfPlayer);

    playerNameList = nameList;
    
    // for (var i = 0; i < playerNameList.length; i++) {
    //     console.log(playerNameList[i] + ' ');
    // }

    afterList = allocatePlayerRole(roleArray, playerNameList, memberClass);
    // console.log("Afterlist 설정 체크");
    // console.log(memberClass);

    for (let prop in afterList) {
        // alert(`${prop} : ${afterList[prop]}`);
        yield {
            name: prop,
            role: afterList[prop],
            do: "AnnounceRole"
        };
    }

    let initialPlayerNameList = JSON.parse(JSON.stringify(afterList));

    // alert("지금부터 역할배정을 시작하겠습니다.");
    yield "지금부터 역할배정을 시작하겠습니다.";
    // alert("밤이 되었습니다. 모든 플레이어들은 고개를 숙여주세요.");
    yield "밤이 되었습니다. 모든 플레이어들은 고개를 숙여주세요.";
    // alert("지금부터 마피아는 고개를 들어 서로의 얼굴을 확인해주세요.");
    yield "지금부터 마피아는 고개를 들어 서로의 얼굴을 확인해주세요.";
    // alert("다시 고개를 숙여주십시오.");
    yield "다시 고개를 숙여주십시오.";
    // alert("지금부터 의사는 고개를 들어 서로의 얼굴을 확인해주세요.");
    yield "지금부터 의사는 고개를 들어 서로의 얼굴을 확인해주세요.";
    // alert("다시 고개를 숙여주십시오.");
    yield "다시 고개를 숙여주십시오.";
    // alert("지금부터 경찰은 고개를 들어 서로의 얼굴을 확인해주세요.");
    yield "지금부터 경찰은 고개를 들어 서로의 얼굴을 확인해주세요.";
    // alert("다시 고개를 숙여주십시오.");
    yield "다시 고개를 숙여주십시오.";
    // alert("첫째날 아침이 밝았습니다. 플레이어들은 모두 고개를 들어주시고 2분 동안 토의를 진행해주세요. 첫번째 아침은 아무도 사형대에 오르지 않습니다.");
    yield "첫째날 아침이 밝았습니다. 플레이어들은 모두 고개를 들어주시고 2분 동안 토의를 진행해주세요. 첫번째 아침은 아무도 사형대에 오르지 않습니다.";

    let loop = Object.keys(afterList).length;
    for (let i = 0; i < loop; i++) {

        // alert("해가 저물고 밤이 되었습니다. 플레이어들은 모두 고개를 숙여주세요.");
        yield "해가 저물고 밤이 되었습니다. 플레이어들은 모두 고개를 숙여주세요.";
        // alert("지금부터 마피아는 고개를 들어 30초간 토의를 하시고 암살할 플레이어를 지목해주세요.");
        yield "지금부터 마피아는 고개를 들어 30초간 토의를 하시고 암살할 플레이어를 지목해주세요.";
        idOfMapiaPick = 0;
        let tempMapiaPick = [];

        while (idOfMapiaPick == 0) {
            tempMapiaPick = yield {
                do: "Assassinate",
                nameList: Object.keys(afterList).filter(o => afterList[o] == "마피아")
            };
            console.log(tempMapiaPick);

            // console.log("Mapia 투표 해결하기");
            const frequency = tempMapiaPick.reduce((a, x) => {
                if (!a[x]) a[x] = 0;
                a[x]++;
                return a;
            }, {});
            // console.log(frequency);
            let max = 0;
            // console.log("Max 찾기");
            const maxF = Object.keys(frequency).map((o, index, object) => {
                if (object[o] < max) {
                } else {
                    max = object[o];
                    return o;
                }
            });
            // console.log(maxF);
            // console.log("maxF 호출 완료");
            if (maxF.length == 1) {
                mapiaPick = maxF[0];
            } else {
                mapiaPick = shuffle(maxF)[0];
            }
            // mapiaPick = prompt('마피아는 죽일 사람을 선택해주세요.');

            idOfMapiaPick = assassinatePlayer(mapiaPick, afterList);
        }

        // alert("다시 고개를 숙여주십시오.");
        yield "다시 고개를 숙여주십시오.";
        // alert("지금부터 의사는 고개를 들어 30초간 토의를 하시고 살릴 플레이어를 지목해주세요.");
        yield "지금부터 의사는 고개를 들어 30초간 토의를 하시고 살릴 플레이어를 지목해주세요.";
        doctorPick = 0;
        let tempDoctorPick = [];

        doctorAlive = isThereAnyDoctor(afterList);
        if (doctorAlive == 0) {
            while (mapiaVSdoctorResult == "Error" || mapiaVSdoctorResult == "None") {

                tempDoctorPick = yield {
                    do: "Treatment",
                    nameList: Object.keys(afterList).filter(o => afterList[o] == "의사")
                };
                // console.log(tempDoctorPick);
    
                // console.log("Doctor 투표 해결하기");
                const frequency = tempDoctorPick.reduce((a, x) => {
                    if (!a[x]) a[x] = 0;
                    a[x]++;
                    return a;
                }, {});
                // console.log(frequency);
                let max = 0;
                // console.log("Max 찾기");
                const maxF = Object.keys(frequency).map((o, index, object) => {
                    if (object[o] < max) {
                    } else {
                        max = object[o];
                        return o;
                    }
                });
                // console.log(maxF);
                // console.log("maxF 호출 완료");
                if (maxF.length == 1) {
                    doctorPick = maxF[0];
                } else {
                    doctorPick = shuffle(maxF)[0];
                }

                // doctorPick = prompt('의사는 살릴 사람을 선택해주세요.'); //의사가 살릴 사람을 지목
                mapiaVSdoctorResult = savePlayer(mapiaPick, doctorPick, doctorAlive, afterList);
                // function savePlayer(mapiaPick, doctorPick, doctorAlive, afterList) { 
            }
        }

        // TODO: 마피아가 사람 안죽이는 경우 고려해야함
        mapiaVSdoctorResult = savePlayer(mapiaPick, doctorPick, doctorAlive, afterList);

        // alert("다시 고개를 숙여주십시오.");
        yield "다시 고개를 숙여주십시오.";
        // alert("지금부터 경찰은 고개를 들어 30초간 토의를 하시고 조사할 플레이어를 지목해주세요.");
        yield "지금부터 경찰은 고개를 들어 30초간 토의를 하시고 조사할 플레이어를 지목해주세요.";

        let tempPolicePick = [];
        policeAlive = isThereAnyPolice(afterList);
        if (policeAlive == 0) {
            // console.log("경찰 조건 분기 1");
            while (idOfPolicePick == 0) {
                // console.log("경찰 조건 분기 2");
                tempPolicePick = yield {
                    do: "Investigation",
                    nameList: Object.keys(afterList).filter(o => afterList[o] == "경찰")
                };
                // console.log("경찰 조건 보냄");
                // console.log(tempPolicePick);
    
                // console.log("Mapia 투표 해결하기");
                const frequency = tempPolicePick.reduce((a, x) => {
                    if (!a[x]) a[x] = 0;
                    a[x]++;
                    return a;
                }, {});
                // console.log(frequency);
                let max = 0;
                // console.log("Max 찾기");
                const maxF = Object.keys(frequency).map((o, index, object) => {
                    if (object[o] < max) {
                    } else {
                        max = object[o];
                        return o;
                    }
                });
                // console.log(maxF);
                // console.log("maxF 호출 완료");
                if (maxF.length == 1) {
                    policePick = maxF[0];
                } else {
                    policePick = shuffle(maxF)[0];
                }

                // policePick = prompt('경찰은 조사할 사람을 선택해주세요');


                idOfPolicePick = investigatePlayer(policePick, afterList);
                // console.log(`idOfPolicPick  : ${idOfPolicePick}`);
                if (idOfPolicePick != 0) {
                    // alert("[경찰에게만 보임] " + policePick + "님은 " + idOfPolicePick + "입니다.");
                    yield {
                        name: policePick,
                        nameList: Object.keys(afterList).filter(o => afterList[o] == "경찰"),
                        role: idOfPolicePick,
                        do: "ResultOfInvestigation"
                    };
                }
            }
        }

        // alert("다시 고개를 숙여주십시오.");
        yield "다시 고개를 숙여주십시오.";

        // alert(mapiaVSdoctorResult);
        yield `${mapiaVSdoctorResult}`;

        // TODO: 마피아가 사람 안죽인 경우는 어떻게 할거이이이ㅣ이이이이이이이이이ㅣ이이이이이ㅣ잉ㅁ
        if(mapiaVSdoctorResult.length < 20){ // 사람 살림

        }else{ // 사람 죽음

        }
        // TODO: 사람 죽은거 엄데이트 해서 보내줘야 함


        let count = 0;

        for (var key in afterList) {
            // console.log(key);
            if (afterList[key] === "마피아") {
                count++;
            }
        }

        if (count >= Object.keys(afterList).length / 2) {
            // alert("마피아가 승리하였습니다. 모든 player들의 정체를 공개합니다.");
            yield "마피아가 승리하였습니다. 모든 player들의 정체를 공개합니다.";
            for (key in initialPlayerNameList) {
                // document.write("player명 : " + key + " 역할 : " + initialPlayerNameList[key] + "<br />");
            }
            break;
        } else if (count == 0) {
            // alert("시민이 승리하였습니다.");
            yield "시민이 승리하였습니다.";
            for (key in initialPlayerNameList) {
                // document.write("player명 : " + key + " 역할 : " + initialPlayerNameList[key] + "<br />");
            }
            break;
        }

        // alert("플레이어들은 모두 고개를 들어주시고 3분 동안 토의를 진행하여 사형대에 올릴 플레이어를 골라주십시오.");
        yield "플레이어들은 모두 고개를 들어주시고 3분 동안 토의를 진행하여 사형대에 올릴 플레이어를 골라주십시오.";

        let id;
        let tempId = [];
        tempId = yield {
            do: "Vote",
            nameList: Object.keys(afterList)
        };
        // console.log(tempId);

        // console.log("Doctor 투표 해결하기");
        const frequency = tempId.reduce((a, x) => {
            if (!a[x]) a[x] = 0;
            a[x]++;
            return a;
        }, {});
        // console.log(frequency);
        let max = 0;
        // console.log("Max 찾기");
        const maxF = Object.keys(frequency).map((o, index, object) => {
            if (object[o] < max) {
            } else {
                max = object[o];
                return o;
            }
        });
        // console.log(maxF);
        // console.log("maxF 호출 완료");
        if (maxF.length == 1) {
            id = maxF[0];
        } else {
            id = shuffle(maxF)[0];
        }
        // var id = prompt('죽일 사람을 선택해주세요.');

        // TODO: 투표로 사람 못죽이는 부분 해결해야하ㅏ아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ
        afterList = killPlayer(id, afterList);
        yield `${id}가 투표로 죽었습니다.`
        // TODO: 사람 죽은거 처리해서 업데이트 해야함
        idOfPolicePick = 0; //다음날을 위한 초기화
        mapiaVSdoctorResult = "Error"; //다음날을 위한 초기화 
        count = 0;

        for (let key in afterList) {
            // console.log(key);
            if (afterList[key] === "마피아") {
                count++;
            }
        }

        if (count >= Object.keys(afterList).length / 2) {
            // alert("마피아가 승리하였습니다. 모든 player들의 정체를 공개합니다.");
            yield "마피아가 승리하였습니다. 모든 player들의 정체를 공개합니다.";
            for (key in initialPlayerNameList) {
                // document.write("player명 : " + key + " 역할 : " + initialPlayerNameList[key] + "<br />");
            }
            break;
        } else if (count == 0) {
            // alert("시민이 승리하였습니다.");
            yield "시민이 승리하였습니다.";
            for (key in initialPlayerNameList) {
                // document.write("player명 : " + key + " 역할 : " + initialPlayerNameList[key] + "<br />");
            }
            break;
        }

    }

    // alert("게임이 종료되었습니다. 게임을 다시 시작하시겠습니까?");
    yield "게임이 종료되었습니다. 게임을 다시 시작하시겠습니까?";

}
// mainGame();

module.exports = mainGame;