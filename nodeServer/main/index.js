class Request {
    constructor(httpReq, f, f2) {
        this.context = httpReq.body.context;
        this.action = httpReq.body.action;
        this.func = f;
        this.func2 = f2;
        console.log(`NPKRequest: ${JSON.stringify(this.context)}, ${JSON.stringify(this.action)}`)
    }
    actionRequest(response, sendData) {
        let actionName = this.action.actionName;
        let parameters = this.action.parameters;
        console.log("Action Name");
        console.log(actionName);

        switch (actionName) {
            case "TakePlayerNumAction": {
                if (!!parameters) {
                    let playerNum = parameters.numOfPlayer;
                    if (parameters.length != 0 && playerNum) {
                        playerNum = parseInt(playerNum.value);
                    }

                    if (isNaN(playerNum)) {
                        playerNum = 4;
                    }
                    // const throwResult = throwDice(diceCount);

                    let pin = this.func(playerNum).then(
                        (pin) => {
                            contextId[this.context.session.id] = pin;
                            this.func2(this.context.session.id, pin);
                            response.setParameters({
                                numOfPlayer: playerNum,
                                pinNum: `${pin}`,
                                roomExist: '1',
                            }, sendData);
                        }).catch((error) => console.log("방 생성 실패"));
                    break;
                }
            }

            case "StartAndCheckRoleAction": {
                const number_one = '1';
                response.setParameters({
                    number1: number_one,
                }, sendData);
                break;
            }

            case "BowHeadAction": {
                const number_one = '1';
                response.setParameters({
                    number1: number_one,
                }, sendData);
                break;
            }

            case "CheckMapiaAction": {
                const number_one = '1';
                response.setParameters({
                    number1: number_one,
                }, sendData);
                break;
            }

            case "CheckDoctorAction": {
                const number_one = '1';
                response.setParameters({
                    number1: number_one,
                }, sendData);
                break;
            }

            case "CheckPoliceAction": {
                const number_one = '1';
                response.setParameters({
                    number1: number_one,
                }, sendData);
                break;
            }

            case "DebateAction": {
                const number_one = '1';
                response.setParameters({
                    number1: number_one,
                }, sendData);
                break;
            }

            case "NightComeAction": {
                const number_one = '1';
                response.setParameters({
                    number1: number_one,
                }, sendData);
                break;
            }

            case "LetsStartGameAction": {
                const number_one = '1';
                console.log(outText);
                response.setParameters({
                    number1: number_one,
                    dayOrder: 0
                }, sendData);
                break;
            }

            case 'KillNightAction2':
            case "KillNightAction" || "KillNightAction2": {
                let number_one = '1';
                console.log("KillNight Action 실행함");
                response.setParameters({
                    number1: number_one,
                    dayOrderNum: outText[contextId[this.context.session.id]].day,
                }, sendData);
                break;
            }

            case "LetMeOut1Action2":
            case "LetMeOutAction": {
                let doctor_Vs_Mapia = 0; //지금은 의사가 이긴 상황
                let doctorVsMapiaPrompt = "";
                if (outText[contextId[this.context.session.id]].after === "NoneKill") { // 마피아가 아무도 안죽인 경우
                    doctor_Vs_Mapia = 2;
                    doctorVsMapiaPrompt = "";
                } else {
                    doctor_Vs_Mapia = 0;
                    doctorVsMapiaPrompt = outText[contextId[this.context.session.id]].after;
                }
                const number_one = '1';
                console.log("outtext:");
                console.log(outText[contextId[this.context.session.id]].isCitizenWin);
                let temp = `1`;
                if (outText[contextId[this.context.session.id]].isCitizenWin == '0' || outText[contextId[this.context.session.id]].isCitizenWin == '1') {
                    temp = `0`;
                }
                response.setParameters({
                    number1: number_one,
                    doctorVsMapiaPrompt: doctorVsMapiaPrompt,
                    mapiaOrCitizenWinNum: temp
                }, sendData);
                break;
            }

            case "LetMeOut2Actions2":
            case "LetMeOut2Actions": {
                // 아무도 사형대에 오르지 않는 경우에 moreThanTwoExist : 1
                // 사형대에 오르는 사람이 있으면 moreThanTwoExist : 0
                let moreThanTwoExist = 0; // 사형대에 오르는 사람이 있는 경우
                let deadMan = "";
                let tieVoteExist = "";
                console.log("VOTE TEXt");
                console.log(outText[contextId[this.context.session.id]].text);
                if (outText[contextId[this.context.session.id]].text == "None" || outText[contextId[this.context.session.id]].text == "") { // 사형대에 아무도 오르지 않는 경우
                    moreThanTwoExist = 1;
                    deadMan = 'none';
                } else {
                    moreThanTwoExist = 0;
                    deadMan = outText[contextId[this.context.session.id]].text;
                    // tieVoteExist = `${deadMan}님이 사형대에 올랐습니다.
                    // 1분동안 최후 변론을 진행해주세요. <pause time = "60000"> 최후 변론이 종료되었습니다.
                    // 플레이어들은 10초동안 찬반투표를 진행해주세요. <pause time = "10000">
                    // ${deadMan}님을 죽이시려면 죽이자고, 살리시려면 살리자고 말씀해주세요.`;
                }
                const number_one = '1';
                console.log("outtext:");
                // let temp = `1`;
                // if (outText[contextId[this.context.session.id]].isCitizenWin == '0' || outText[contextId[this.context.session.id]].isCitizenWin == '1') {
                //     temp = `0`;
                // }
                response.setParameters({
                    number1: number_one,
                    tieVoteExist: tieVoteExist, // 죽은 사람이 있으면 말하는 말
                    moreThanTwoExist: moreThanTwoExist
                }, sendData);
                break;
            }

            case "CheckWhoDiedActions2":
            case "CheckWhoDiedActions": {
                let doctor_Vs_Mapia = 0; //지금은 의사가 이긴 상황
                let doctorVsMapiaPrompt = "";
                if (outText[contextId[this.context.session.id]].after === "NoneKill") { // 마피아가 아무도 안죽인 경우
                    doctor_Vs_Mapia = 2;
                    doctorVsMapiaPrompt = "";
                } else {
                    doctor_Vs_Mapia = 0;
                    doctorVsMapiaPrompt = outText[contextId[this.context.session.id]].after;
                }

                const number_one = '1';
                // const doctor_Vs_Mapia = '1'; //지금은 의사가 이긴 상황
                // if (doctor_Vs_Mapia == '0') {
                //   let doctorVsMapiaPrompt = '의사가 플레이어를 살리지 못했습니다. 마피아가 죽인 플레이어는 %s님 입니다.';
                // } else if (doctor_Vs_Mapia == '1') {
                //   let doctorVsMapiaPrompt = '의사가 플레이어를 살렸습니다.';
                // }
                response.setParameters({
                    number1: number_one,
                    doctorVsMapia: doctorVsMapiaPrompt,
                }, sendData);
                break;
            }
            case "NoOneDeadAction2":
            case "NoOneDeadAction": {
                const number_one = '1';
                response.setParameters({
                    number1: number_one,
                    moreThanTwoExist: '1',
                }, sendData);
                break;
            }
            case "FinalArgumentAciton2":
            case "FinalArgumentAction": {
                const number_one = '1';

                let tieVoteExistPrompt = `${outText[contextId[this.context.session.id]].text}님이 사형대에 올랐습니다.
                  1분동안 최후 변론을 진행해주세요. <pause time = "60000"> 최후 변론이 종료되었습니다.
                  플레이어들은 10초동안 찬반투표를 진행해주세요. <pause time = "10000">
                  ${outText[contextId[this.context.session.id]].text}님을 죽이시려면 죽이자고, 살리시려면 살리자고 말씀해주세요.`

                response.setParameters({
                    number1: number_one,
                    tieVoteExist: tieVoteExistPrompt,
                }, sendData);
                break;
            }

            case "MaybeMapiaWinActions2":
            case "MaybeMapiaWinActions": {
                const number_one = '1';
                //   const doctor_Vs_Mapia = '1'; //지금은 의사가 이긴 상황

                let doctor_Vs_Mapia = 0; //지금은 의사가 이긴 상황
                let doctorVsMapiaPrompt = "";
                if (outText[contextId[this.context.session.id]].after === "NoneKill") { // 마피아가 아무도 안죽인 경우
                    doctor_Vs_Mapia = 2;
                    doctorVsMapiaPrompt = "";
                } else {
                    doctor_Vs_Mapia = 0;
                    doctorVsMapiaPrompt = outText[contextId[this.context.session.id]].after;
                }
                //   if (doctor_Vs_Mapia == '0') {
                //     let doctorVsMapiaPrompt = '의사가 플레이어를 살리지 못했습니다. 마피아가 죽인 플레이어는 %s님 입니다.';
                //   } else if (doctor_Vs_Mapia == '1') {
                //     let doctorVsMapiaPrompt = '의사가 플레이어를 살렸습니다.';
                //   }
                const mapia_Or_CitizenWin = outText[contextId[this.context.session.id]].isCitizenWin; //지금은 시민이 이긴 상황
                let mapiaOrCitizenWinPrompt;
                if (mapia_Or_CitizenWin == 0) {
                    mapiaOrCitizenWinPrompt = '마피아가 승리하였습니다. 모든 플레이어들의 정체를 공개합니다.';
                } else if (mapia_Or_CitizenWin == 1) {
                    mapiaOrCitizenWinPrompt = '시민이 승리하였습니다. 모든 플레이어들의 정체를 공개합니다.'
                }
                response.setParameters({
                    number1: number_one,
                    doctorVsMapiaPrompt: doctorVsMapiaPrompt,
                    mapiaOrCitizenWinPrompt: mapiaOrCitizenWinPrompt,
                }, sendData);
                break;
            }
            case "HeIsSavedAction2":
            case "HeIsSavedAction": {
                const number_one = '1';
                let yesOrNoVoteResultPrompt = `${outText[contextId[this.context.session.id]].text}님은 찬반투표에서 과반수 이상이 반대를 하여 최종적으로 사형대에 오르지 않습니다.`
                response.setParameters({
                    number1: number_one,
                    yesOrNoVoteResult: yesOrNoVoteResultPrompt,
                }, sendData);
                break;
            }
            case "HeIsDiedAction2":
            case "HeIsDiedAction": {
                let yesOrNoVoteResultPrompt = `${outText[contextId[this.context.session.id]].text}님은 찬반투표에서 과반수 이상이 찬성을 하여 최종적으로 사형당하셨습니다.`
                const number_one = '1';
                response.setParameters({
                    number1: number_one,
                    yesOrNoVoteResult: yesOrNoVoteResultPrompt,
                }, sendData);
                break;
            }
            case "LetMeOut3Action2":
            case "LetMeOut3Action": {
                const number_one = '1';
                console.log("outtext:");
                console.log(outText[contextId[this.context.session.id]].isCitizenWin);
                // let temp = `1`;
                // if (outText[contextId[this.context.session.id]].isCitizenWin == '0' || outText[contextId[this.context.session.id]].isCitizenWin == '1') {
                //     temp = `0`;
                // }
                response.setParameters({
                    number1: number_one,
                    mapiaOrCitizenWinNum: `${outText[contextId[this.context.session.id]].isCitizenWin}`
                }, sendData);
                break;
            }
            case "GameEndCitizenAction2":
            case "GameEndCitizenAction": {
                const number_one = '1';
                const mapia_Or_CitizenWin = '1'; //지금은 시민이 이긴 상황
                let mapiaOrCitizenWinPrompt = "";
                if (mapia_Or_CitizenWin == '0') {
                    mapiaOrCitizenWinPrompt = '마피아가 승리하였습니다. 모든 플레이어들의 정체를 공개합니다.';
                } else if (mapia_Or_CitizenWin == '1') {
                    mapiaOrCitizenWinPrompt = '시민이 승리하였습니다. 모든 플레이어들의 정체를 공개합니다.'
                }
                response.setParameters({
                    number1: number_one,
                    mapiaOrCitizenWinNum: '1',
                    mapiaOrCitizenWinPrompt: mapiaOrCitizenWinPrompt,
                }, sendData);
                break;
            }
            case "GameEndMapiaAction2":
            case "GameEndMapiaAction": {
                const number_one = '1';
                const mapia_Or_CitizenWin = '0'; //지금은 마피아가 이긴 상황
                let mapiaOrCitizenWinPrompt = "";
                if (mapia_Or_CitizenWin == '0') {
                    mapiaOrCitizenWinPrompt = '마피아가 승리하였습니다. 모든 플레이어들의 정체를 공개합니다.';
                } else if (mapia_Or_CitizenWin == '1') {
                    mapiaOrCitizenWinPrompt = '시민이 승리하였습니다. 모든 플레이어들의 정체를 공개합니다.'
                }
                response.setParameters({
                    number1: number_one,
                    mapiaOrCitizenWinNum: '0',
                    mapiaOrCitizenWinPrompt: mapiaOrCitizenWinPrompt,
                }, sendData);
                break;
            }
            case "TurnBackAction2":
            case "TurnBackAction": {
                const number_one = '1';
                response.setParameters({
                    number1: number_one,
                    moreThanTwoExist: '1',
                }, sendData);
                break;
            }

        }
    }
}

let contextId = {};

let outText = {};

function* getText(id, target) {
    const text = yield;
    if (!outText[id]) {
        outText[id] = {};
    }
    if (target == 'vote') {
        console.log('getText에서 vote 시랳ㅇ함');
        outText[id].text = text;
    } else if (target == 'day') {
        outText[id].day = text;
    } else if (target == 'after') {
        outText[id].after = text.text;
        outText[id].isCitizenWin = text.isCitizenWin;
    } else if (target == 'vote_check') {
        outText[id].vote_check = text.text;
    }
}


class Response {
    constructor() {
        this.version = '2.0';
        this.resultCode = 'OK';
        this.output = {};
        this.directives = [];
    }
    setParameters(result, sendData) {
        console.log("result :");
        console.log(result);
        this.output = {
            numOfPlayer: result.numOfPlayer,
            pinNum: result.pinNum,
            roomExist: result.roomExist,
            number1: result.number1,
            tieVoteExist: result.tieVoteExist,
            yesOrNoVoteResult: result.yesOrNoVoteResult,
            dayOrderNum: result.dayOrderNum,
            doctorVsMapia: result.doctorVsMapiaPrompt,
            mapiaOrCitizenWin: result.mapiaOrCitizenWinPrompt,
            mapiaOrCitizenWinNum: result.mapiaOrCitizenWinNum,
            moreThanTwoExist: result.moreThanTwoExist,
            numOfPlayer2: result.numOfPlayer,
            pinNum2: result.pinNum,
            roomExist2: result.roomExist,
            number12: result.number1,
            tieVoteExist2: result.tieVoteExist,
            yesOrNoVoteResult2: result.yesOrNoVoteResult,
            dayOrderNum2: result.dayOrderNum,
            doctorVsMapia2: result.doctorVsMapiaPrompt,
            mapiaOrCitizenWin2: result.mapiaOrCitizenWinPrompt,
            mapiaOrCitizenWinNum2: result.mapiaOrCitizenWinNum,
            moreThanTwoExist2: result.moreThanTwoExist
        }
        console.log(this.output);

        sendData(this);
    }
}

const reqObject = (f, req, res, f2, next) => {
    response = new Response();
    request = new Request(req, f, f2);
    request.actionRequest(response, (r) => {
        console.log(r);
        res.send(r)
    });
    console.log(`NPKResponse: ${JSON.stringify(response)}`);
};

module.exports = reqObject;
module.exports.getText = getText;