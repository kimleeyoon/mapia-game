function parse(str) { //변수에 변수를 포함하는 문자열을 넣기 위한 함수
    var args = [].slice.call(arguments, 1)
    var i = 0;

    return str.replace(/%s/g, function () {
        return args[i++];
    });
}

var playerNameList = [];
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
//가능 플레이어수는 min 3, max 10
//역할 분배 시 인원이 5명 이상일 경우 의사와 경찰의 합친 수는 같되 그 둘의 개수는 랜덤으로 후에 바꿔도 좋음. 예를 들어 6명이 플레이 할 시 의사 1명, 경찰 1명이 아닌 맞의, 맞경일수도 있다는 말.

var afterList = {};

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

var numOfPlayer;
var checkRange = 0; //입력한 플레이어의 명수값이 숫자가 아닌 다른값인지, 혹은 min과 max값을 벗어났는지 확인하는 변수
//var playerNameList = {"이현주":"마피아", "윤종원":"시민", "최형규":"시민", "김현주":"시민", "신석경":"마피아", "김혜성":"의사", "강민우":"경찰"};
//var initialPlayerNameList = JSON.parse(JSON.stringify(playerNameList));
//var playerNames = Object.playerNames(playerNameList);	//객체 접근을 위한 선언

var mapiaPick; //마피아가 죽이기 위해 지목한 사람
var doctorPick; //의사가 살리기 위해 지목한 사람
var policePick; //경찰이 조사하기 위해 지목한 사람
var mapiaVSdoctorResult = "None"; //마피아가 이겼는지 의사가 이겼는지를 알려주는 결과값
var idOfPolicePick = 0; //경찰이 조사한 사람의 정체
var idOfMapiaPick = 0; //마피아가 암살한 사함의 정체
var doctorAlive = 0; //살아있는 의사가 있는지 없는지 조사하는 변수
var policeAlive = 0; //살아있는 경찰이 있는지 없는지 조사하는 변수

/////////////////////////////////////////////////////////////////////////////////


//////*마피아 게임에서 player수에 따라 게임환경을 조성하는 구간*///////

function takePlayerName(playerNum) { //입력한 플레이어 명수만큼 이름을 등록하는 함수
    let playerName = [];
    for (var i = 0; i < playerNum; i++) {
        playerName[i] = prompt(i + 1 + '번 플레이어의 이름을 입력해주세요.');
    }
    return playerName;
}

function allocatePlayerRole(roleArray) {
    let afterList = {};
    shuffle(roleArray[numOfPlayer - 3]).map((role, index) => afterList[playerNameList[index]] = role);
    return afterList;
    //console.log(afterlist);
}

////////////////////////////////////////////////////////////////////////////////


//////*마피아 게임에서 밤에 시행되는 함수선언구간*///////

function takePlayerNum(playerNum) { //게임 플레이어 명 수를 입력받고 적절한 값인지 판별하는 함수
    let checkRange = 0;
    if (!isNaN(playerNum)) {
        checkRange = 0;
    } else if (playerNum < 3 || 10 < playerNum) {
        checkRange = 0;
    } else {
        checkRange = 1;
    }
    return checkRange;
}

function savePlayer(playerName) { //의사가 사람을 살리는 함수
    //doctorPick = prompt('의사는 살릴 사람을 선택해주세요.');	//의사가 살릴 사람을 지목
    let mapiaVSdoctorResult = "None";
    if (playerName == mapiaPick) {
        mapiaVSdoctorResult = parse('의사가 플레이어를 살렸습니다.');
    } else if (doctorAlive == 0) {
        mapiaVSdoctorResult = parse('의사가 플레이어를 살리지 못했습니다. 마피아가 죽인 플레이어는 %s님 입니다.', mapiaPick);
    } else if (playerName != mapiaPick) {
        mapiaVSdoctorResult = parse('의사가 플레이어를 살리지 못했습니다. 마피아가 죽인 플레이어는 %s님 입니다.', mapiaPick);
        delete afterList[mapiaPick];
    } else if (doctorPick == 0) {
        mapiaVSdoctorResult = parse('의사가 플레이어를 살리지 못했습니다. 마피아가 죽인 플레이어는 %s님 입니다.', mapiaPick);
    } else if ((afterList[playerName] == undefined)) {
        alert("잘못 입력하셨습니다. 다시 입력해주세요.");
        mapiaVSdoctorResult = "Error";
    }
    return mapiaVSdoctorResult;
}

function assassinatePlayer(playerName) { //마피아가 사람을 암살하는 함수
    //mapiaPick = prompt('마피아는 죽일 사람을 선택해주세요.');
    let idOfMapiaPick = 0;
    if (afterList[playerName] == '경찰') {
        idOfMapiaPick = 1;
    } else if (afterList[playerName] == '의사') {
        idOfMapiaPick = 1;
    } else if (afterList[playerName] == '시민') {
        idOfMapiaPick = 1;
    } else {
        alert("잘못 입력하셨습니다. 다시 입력해주세요.");
        idOfMapiaPick = 0;
    }
    return idOfMapiaPick;
}

function investigatePlayer(playerName) { //경찰이 사람을 조사하는 함수
    //policePick = prompt('경찰은 조사할 사람을 선택해주세요');
    let idOfPolicePick = 0;
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

function killPlayer(playerName) { //아래 함수는 '민중'들이 찬반 투표를 통해 과반수 이상이 나온 사람을 사형대에 보낼 때 시행되는 함수
    //playerNameList.splice(playerNameList.indexOf(playerName),1);
    delete afterList[playerName];
    alert(playerName + "님이 죽었습니다. 생존자를 공개합니다.");

    for (var key in afterList) {
        document.write("player명 : " + key + "<br />");
    }
}

/////////////////**특수직업군 중 생존한 자가 있는지 없는지 판별하는 함수 구간**///////////////////////////

function isThereAnyDoctor(doctorIsAlive) {
    for (key in afterList) {
        if (afterList[key] == '의사') {
            doctorIsAlive = 1;
            break;
        }
    }
}

function isThereAnyPolice(policeIsAlive) {
    for (key in afterList) {
        if (afterList[key] == '경찰') {
            policeIsAlive = 1;
            break;
        }
    }
}

////////////////////////////////////**Game Zone**////////////////////////////////////////////

while (checkRange == 0) {
    numOfPlayer = prompt('플레이를 할 플레이어의 명수를 숫자로 입력해주세요. (최소 3명, 최대 10명)');
    checkRange = takePlayerNum(numOfPlayer);
}

//역할 할당 코드 삽입하기 
playerNameList = takePlayerName(numOfPlayer);
afterList = allocatePlayerRole(roleArray);
for (let prop in afterList) {
    alert(`${prop} : ${afterList[prop]}`);
}

var initialPlayerNameList = JSON.parse(JSON.stringify(afterList));

alert("지금부터 역할배정을 시작하겠습니다.");
alert("밤이 되었습니다. 모든 플레이어들은 고개를 숙여주세요.");
alert("지금부터 마피아는 고개를 들어 서로의 얼굴을 확인해주세요.");
alert("다시 고개를 숙여주십시오.");
alert("지금부터 의사는 고개를 들어 서로의 얼굴을 확인해주세요.");
alert("다시 고개를 숙여주십시오.");
alert("지금부터 경찰은 고개를 들어 서로의 얼굴을 확인해주세요.");
alert("다시 고개를 숙여주십시오.");
alert("첫째날 아침이 밝았습니다. 플레이어들은 모두 고개를 들어주시고 2분 동안 토의를 진행해주세요. 첫번째 아침은 아무도 사형대에 오르지 않습니다.")

var roop = Object.keys(afterList).length;
for (var i = 0; i < roop; i++) {

    alert("해가 저물고 밤이 되었습니다. 플레이어들은 모두 고개를 숙여주세요.");
    alert("지금부터 마피아는 고개를 들어 30초간 토의를 하시고 암살할 플레이어를 지목해주세요.");
    idOfMapiaPick = 0;
    while (idOfMapiaPick == 0) {
        mapiaPick = prompt('마피아는 죽일 사람을 선택해주세요.');
        assassinatePlayer(mapiaPick);
    }

    alert("다시 고개를 숙여주십시오.");
    alert("지금부터 의사는 고개를 들어 30초간 토의를 하시고 살릴 플레이어를 지목해주세요.");
    doctorPick = 0;
    isThereAnyDoctor(doctorAlive);
    if (doctorAlive == 0) {
        while (mapiaVSdoctorResult == "Error" || mapiaVSdoctorResult == "None") {
            doctorPick = prompt('의사는 살릴 사람을 선택해주세요.'); //의사가 살릴 사람을 지목
            mapiaVSdoctorResult = savePlayer(doctorPick);
        }
    }
    mapiaVSdoctorResult = savePlayer(doctorPick);

    alert("다시 고개를 숙여주십시오.");
    alert("지금부터 경찰은 고개를 들어 30초간 토의를 하시고 조사할 플레이어를 지목해주세요.");
    isThereAnyPolice(policeAlive);
    if (policeAlive == 0) {
        while (idOfPolicePick == 0) {
            policePick = prompt('경찰은 조사할 사람을 선택해주세요');
            idOfPolicePick = investigatePlayer(policePick);
            alert("[경찰에게만 보임] " + policePick + "님은 " + idOfPolicePick + "입니다.");
        }
    }

    alert("다시 고개를 숙여주십시오.");
    alert(i + 2 + "번째 아침이 밝았습니다.");
    alert(mapiaVSdoctorResult);
    alert("플레이어들은 모두 고개를 들어주시고 3분 동안 토의를 진행하여 사형대에 올릴 플레이어를 골라주십시오.");

    var id = prompt('죽일 사람을 선택해주세요.');
    killPlayer(id);

    var count = 0;
    idOfPolicePick = 0; //다음날을 위한 초기화
    mapiaVSdoctorResult = "Error"; //다음날을 위한 초기화 

    for (var key in afterList) {
        // console.log(key);
        if (afterList[key] === "마피아") {
            count++;
        }
    }

    if (count >= Object.keys(afterList).length / 2) {
        alert("마피아가 승리하였습니다. 모든 player들의 정체를 공개합니다.");
        for (key in initialPlayerNameList) {
            document.write("player명 : " + key + " 역할 : " + initialPlayerNameList[key] + "<br />");
        }
        break;
    } else if (count == 0) {
        alert("시민이 승리하였습니다.");
        for (key in initialPlayerNameList) {
            document.write("player명 : " + key + " 역할 : " + initialPlayerNameList[key] + "<br />");
        }
        break;
    }

}

alert("게임이 종료되었습니다. 게임을 다시 시작하시겠습니까?");

module.exports = {

}