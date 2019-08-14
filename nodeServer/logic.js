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

function savePlayer(mapiaPick, doctorPick, doctorAlive, afterList, memberClass) { //의사가 사람을 살리는 함수
    //doctorPick = prompt('의사는 살릴 사람을 선택해주세요.');   //의사가 살릴 사람을 지목
    let mapiaVSdoctorResult = "None";

    console.log(`Doctor Pick : ${doctorPick}`);
    console.log(`Mapia Pick : ${mapiaPick}`);

    if (mapiaPick == "None" || !mapiaPick) { // 마피아가 사람을 죽이지 않는 경우
        mapiaVSdoctorResult = "NoneKill";
    } else if (!doctorPick || doctorAlive || doctorPick == "None") { // 의사가 아무도 치료하지 않는 경우
        mapiaVSdoctorResult = parse('의사가 플레이어를 살리지 못했습니다. 마피아가 죽인 플레이어는 %s님 입니다.', mapiaPick);
        memberClass.find(o => o.name === mapiaPick).isAlive = false;
        delete afterList[mapiaPick];
    } else if (mapiaPick == doctorPick) { // 의사가 플레이어를 살린 경우
        mapiaVSdoctorResult = parse('의사가 플레이어를 살렸습니다.');
    } else { // 의사가 틀린 경우
        mapiaVSdoctorResult = parse('의사가 플레이어를 살리지 못했습니다. 마피아가 죽인 플레이어는 %s님 입니다.', mapiaPick);
        memberClass.find(o => o.name === mapiaPick).isAlive = false;
        delete afterList[mapiaPick];
    }
    return mapiaVSdoctorResult;


    // if (doctorPick == mapiaPick) { 
    //     mapiaVSdoctorResult = parse('의사가 플레이어를 살렸습니다.');
    // } else if (doctorAlive == 0) {
    //     mapiaVSdoctorResult = parse('의사가 플레이어를 살리지 못했습니다. 마피아가 죽인 플레이어는 %s님 입니다.', mapiaPick);
    //     memberClass.find(o => o.name === mapiaPick).isAlive = false;
    // } else if (doctorPick != mapiaPick) {
    //     mapiaVSdoctorResult = parse('의사가 플레이어를 살리지 못했습니다. 마피아가 죽인 플레이어는 %s님 입니다.', mapiaPick);
    //     memberClass.find(o => o.name === mapiaPick).isAlive = false;
    //     delete afterList[mapiaPick];
    // } else if (doctorPick == 0) {
    //     mapiaVSdoctorResult = parse('의사가 플레이어를 살리지 못했습니다. 마피아가 죽인 플레이어는 %s님 입니다.', mapiaPick);
    //     memberClass.find(o => o.name === mapiaPick).isAlive = false;
    // } else if ((afterList[doctorPick] == undefined)) {
    //     // alert("잘못 입력하셨습니다. 다시 입력해주세요.");
    //     mapiaVSdoctorResult = "Error";
    // }
    // return mapiaVSdoctorResult;
}

function assassinatePlayer(playerName, afterList) { //마피아가 사람을 암살하는 함수
    //mapiaPick = prompt('마피아는 죽일 사람을 선택해주세요.');
    console.log("죽일 이름");
    console.log(playerName);
    console.log("사람 목록");
    console.log(afterList);

    let idOfMapiaPick = 0;
    if (afterList[playerName] == '경찰') {
        idOfMapiaPick = '경찰';
    } else if (afterList[playerName] == '의사') {
        idOfMapiaPick = '경찰';
    } else if (afterList[playerName] == '시민') {
        idOfMapiaPick = '경찰';
    } else if (afterList[playerName] == '마피아') {
        idOfMapiaPick = '마피아';
    } else {
        // alert("잘못 입력하셨습니다. 다시 입력해주세요.");
        idOfMapiaPick = "None";
    }
    return idOfMapiaPick;
}

function investigatePlayer(playerName, afterList) { //경찰이 사람을 조사하는 함수
    //policePick = prompt('경찰은 조사할 사람을 선택해주세요');
    let idOfPolicePick = 0;
    if (playerName == "None") {
        idOfPolicePick = "None";
    } else if (afterList[playerName] == '경찰') {
        idOfPolicePick = '경찰';
    } else if (afterList[playerName] == '마피아') {
        idOfPolicePick = '마피아';
    } else if (afterList[playerName] == '의사') {
        idOfPolicePick = '의사';
    } else if (afterList[playerName] == '시민') {
        idOfPolicePick = '시민';
    } else {
        // alert("잘못 입력하셨습니다. 다시 입력해주세요.");
        idOfPolicePick = "None";
    }
    return idOfPolicePick;
}

function killPlayer(playerName, afterList, memberClass) { //아래 함수는 '민중'들이 찬반 투표를 통해 과반수 이상이 나온 사람을 사형대에 보낼 때 시

    //playerNameList.splice(playerNameList.indexOf(playerName),1);

    memberClass.find(o => o.name === playerName).isAlive = false;

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

////////////////////////////////////**Game Zone**////////////////////////////////////////////

class Members {
    constructor(member) {
        this.allMemberNameList = member.map(o => o.name);
        this.memberObj = this.allMemberNameList.map((o) => {
            return {
                name: o,
                role: '',
                isAlive: true
            }
        });
    }
    getLiveList() {
        return this.memberObj.filter(o => o.isAlive === true).map(o => o.name);
    }
    setLive(name, value) {
        this.memberObj.find(k => k.name === name).isAlive = !!value;
    }
    setRole(name, role) {
        this.memberObj.find(k => k.name === name).role = role;
    }
    getAfterList() {
        let temp = {};
        for (let k of this.memberObj) {
            temp[k.name] = k.role
        }
        return temp;
    }
    getLiveAfterList() {
        let temp = {};
        for (let k of this.memberObj) {
            if (k.isAlive) {
                temp[k.name] = k.role
            }
        }
        return temp;
    }
}

function handelDecide(tempPick, forceData) {
    let pick;

    const frequency = tempPick.reduce((a, x) => {
        if (!a[x]) a[x] = 0;
        a[x]++;
        return a;
    }, {});
    let max = 0;

    const maxF = Object.keys(frequency).map((o, index, object) => {
        if (object[o] < max) {} else {
            max = object[o];
            return o;
        }
    });
    console.log(`MaxF : ${tempPick.count}`);
    if (!maxF) {
        console.log("항목없음");
        pick = "None";
    } else if (forceData) {
        if (maxF.length == 1) {
            pick = maxF[0];
        } else {
            pick = shuffle(maxF)[0];
        }
    } else {
        if (maxF.length == 1) {
            pick = maxF[0];
        } else {
            pick = "None";
        }
    }
    return pick;
}

function* mainGame(member) {

    let memberClass = new Members(member);

    var afterList = {};

    let dayOrder = 0;

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

    let nameList = memberClass.getLiveList();



    // var numOfPlayer = nameList.length;
    // var checkRange = 0; //입력한 플레이어의 명수값이 숫자가 아닌 다른값인지, 혹은 min과 max값을 벗어났는지 확인하는 변수
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

    // playerNameList = nameList;

    // for (var i = 0; i < playerNameList.length; i++) {
    //     console.log(playerNameList[i] + ' ');
    // }

    afterList = allocatePlayerRole(roleArray, nameList, memberClass); // 사용자 역할 할당 함수


    for (let prop in afterList) {
        // alert(`${prop} : ${afterList[prop]}`);
        yield {
            name: prop,
            role: afterList[prop],
            do: "AnnounceRole"
        };
    }
    // 역할 할당 후 사용자에게 각자 역할 전송

    let initialPlayerNameList = JSON.parse(JSON.stringify(afterList)); // 초기 멤버

    yield {
        do: "DAY_TEXT",
        day: `${dayOrder}`
    };

    console.log("스피커한테 day 보냄");

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

    yield {
        do: "WAIT_FIRST_NIGHT"
    };

    let loop = Object.keys(afterList).length;

    for (let i = 0; i < loop; i++) {
        yield {
            do: "DAY_TEXT",
            day: `${dayOrder}`
        };
        console.log("스피커한테 day 보냄");
        dayOrder++;
        // TODO: 작동할걸?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????

        // yield {
        //     do: "WAIT_SECOND",
        //     time: 21.5
        // };
        yield {
            do: "WAIT_SECOND",
            time: 1
        };
        // alert("해가 저물고 밤이 되었습니다. 플레이어들은 모두 고개를 숙여주세요.");
        yield "해가 저물고 밤이 되었습니다. 플레이어들은 모두 고개를 숙여주세요.";
        // alert("지금부터 마피아는 고개를 들어 30초간 토의를 하시고 암살할 플레이어를 지목해주세요.");
        yield "지금부터 마피아는 고개를 들어 30초간 토의를 하시고 암살할 플레이어를 지목해주세요.";

        idOfMapiaPick = 0;
        let tempMapiaPick = [];

        // while (idOfMapiaPick == 0) {
        tempMapiaPick = yield {
            do: "Assassinate",
            nameList: Object.keys(memberClass.getLiveAfterList()).filter(o => afterList[o] == "마피아")
        }; // 마피아로부터 암살할 사람 고르라고 함

        mapiaPick = handelDecide(tempMapiaPick, true);

        // idOfMapiaPick = assassinatePlayer(mapiaPick, afterList);
        // if(idOfMapiaPick == "None"){
        //     mapiaPick = "None";
        // }
        // }

        // yield {
        //     do: "WAIT_SECOND",
        //     time: 12
        // };
        yield {
            do: "WAIT_SECOND",
            time: 1
        };

        // alert("다시 고개를 숙여주십시오.");
        yield "다시 고개를 숙여주십시오.";
        // alert("지금부터 의사는 고개를 들어 30초간 토의를 하시고 살릴 플레이어를 지목해주세요.");
        yield "지금부터 의사는 고개를 들어 30초간 토의를 하시고 살릴 플레이어를 지목해주세요.";
        doctorPick = "None";
        let tempDoctorPick = [];

        doctorAlive = isThereAnyDoctor(afterList);
        if (doctorAlive == 0) {
            // while (mapiaVSdoctorResult == "Error" || mapiaVSdoctorResult == "None") {
            tempDoctorPick = yield {
                do: "Treatment",
                nameList: Object.keys(memberClass.getLiveAfterList()).filter(o => afterList[o] == "의사")
            };

            doctorPick = handelDecide(tempDoctorPick, true);

            // mapiaVSdoctorResult = savePlayer(mapiaPick, doctorPick, doctorAlive, afterList, memberClass.memberObj);
            // }
        }else{
            yield {
                do: "WAIT_SECOND",
                time: 20
            };
        }

        ///////////////////////////// 경찰이 암살 당하는 경우 미리 죽어서 조사 못하는 현상 해결을 위해 아래로 내림
        // mapiaVSdoctorResult = savePlayer(mapiaPick, doctorPick, doctorAlive, afterList, memberClass.memberObj);
        ///////////////////////////////////

        // yield {
        //     do: "WAIT_SECOND",
        //     time: 10
        // };

        yield {
            do: "WAIT_SECOND",
            time: 1
        };

        // alert("다시 고개를 숙여주십시오.");
        yield "다시 고개를 숙여주십시오.";
        // alert("지금부터 경찰은 고개를 들어 30초간 토의를 하시고 조사할 플레이어를 지목해주세요.");
        yield "지금부터 경찰은 고개를 들어 30초간 토의를 하시고 조사할 플레이어를 지목해주세요.";

        let tempPolicePick = [];
        policeAlive = isThereAnyPolice(afterList);
        if (policeAlive == 0) {
            // while (idOfPolicePick == 0) {
            tempPolicePick = yield {
                do: "Investigation",
                nameList: Object.keys(memberClass.getLiveAfterList()).filter(o => afterList[o] == "경찰")
            };

            policePick = handelDecide(tempPolicePick, true);

            idOfPolicePick = investigatePlayer(policePick, afterList);
            if (idOfPolicePick != "None") { // 경찰이 조사를 하면

                idOfPolicePick = idOfPolicePick == "마피아" ? "마피아" : "시민";
                yield {
                    name: policePick,
                    nameList: Object.keys(memberClass.getLiveAfterList()).filter(o => memberClass.getAfterList()[o] == "경찰"),
                    role: idOfPolicePick,
                    do: "ResultOfInvestigation"
                };
            }
            // }
        }else{
            yield {
                do: "WAIT_SECOND",
                time: 20
            };
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////
        mapiaVSdoctorResult = savePlayer(mapiaPick, doctorPick, doctorAlive, afterList, memberClass.memberObj);
        //////////////////////////////////////////////////////////////////////////////////////////////////////

        
        // alert("다시 고개를 숙여주십시오.");
        yield "다시 고개를 숙여주십시오.";
        
        
        let count = 0;
        for (var key in memberClass.getLiveAfterList()) {
            if (memberClass.getLiveAfterList()[key] === "마피아") {
                count++;
            }
        }
        
        let isCitizenWin = 0;
        
        if (count >= Object.keys(memberClass.getLiveAfterList()).length / 2) {
            isCitizenWin = 0;
        } else if (count == 0) {
            isCitizenWin = 1;
        }else{
            isCitizenWin = 2;
        }
        
        yield {
            do: "AFTER_TEXT",
            text: `${mapiaVSdoctorResult}`,
            win: `${isCitizenWin}`
        };
        
        yield {
            do: "WAIT_CHECK"
        };
        
        // alert(mapiaVSdoctorResult);

        if (mapiaVSdoctorResult == "NoneKill") { // 마피아가 사람을 죽이지 않음
        } else { // 사람 죽음
            yield `${mapiaVSdoctorResult}`;
        }


        yield {
            do: "DEATH_UPDATE",
            nameList: memberClass.memberObj
        };



        if (count >= Object.keys(memberClass.getLiveAfterList()).length / 2) {
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

        yield {
            do: "WAIT_SECOND",
            time: 15
        };
        // yield {
        //     do: "WAIT_SECOND",
        //     time: 180
        // };

        let id;
        let tempId = [];
        tempId = yield {
            do: "Vote",
            nameList: memberClass.getLiveList()
        };


        id = handelDecide(tempId, false);

        console.log(`id : ${id}`);
        if (id == "None") { // 사람이 안죽는 경우
            // yield ``;
            console.log("Logic 아무도 안죽어");
            yield {
                do: "VOTE_TEXT",
                text: 'None',
                isDeath: 0
            };
            yield {
                do: "WAIT_CHECK"
            };
        } else { // 사람이 죽는 경우
            afterList = killPlayer(id, afterList, memberClass.memberObj);
            yield {
                do: "VOTE_TEXT",
                text: `${id}`,
                isDeath: 1
            };
            yield {
                do: "WAIT_CHECK"
            };
            yield `${id}가 투표로 죽었습니다.`
            memberClass.setLive(id, false);
        }

        idOfPolicePick = 0; //다음날을 위한 초기화
        mapiaVSdoctorResult = "Error"; //다음날을 위한 초기화 
        count = 0;

        yield {
            do: "DEATH_UPDATE",
            nameList: memberClass.memberObj
        };

        for (let key in memberClass.getLiveAfterList()) {
            // console.log(key);
            if (memberClass.getLiveAfterList()[key] === "마피아") {
                count++;
            }
        }

        if (count >= Object.keys(memberClass.getLiveAfterList()).length / 2) {
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