class Request {
    constructor(httpReq, f) {
        this.context = httpReq.body.context;
        this.action = httpReq.body.action;
        this.func = f;
        console.log(`NPKRequest: ${JSON.stringify(this.context)}, ${JSON.stringify(this.action)}`)
    }
    actionRequest(response, sendData) {
        let actionName = this.action.actionName;
        let parameters = this.action.parameters;

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

            case "NightComeAction": {
                const number_one = '1';
                response.setOutputParameters({
                    number1: number_one,
                }, sendData);
                break;
            }

            case "LetStartGameAction": {
                const number_one = '1';
                response.setOutputParameters({
                    number1: number_one,
                }, sendData);
                break;
            }

            case "KillNightAction": {
                let number_one = '1';
                response.setOutputParameters({
                    number1: number_one,
                    dayOrderNum: 아몰라 잠만,
                }, sendData);
                break;
            }

            case "CheckWhoDiedAction": {
                const number_one = '1';
                const doctor_Vs_Mapia = '1'; //지금은 의사가 이긴 상황
                if (doctor_Vs_Mapia == '0') {
                  let doctorVsMapiaPrompt = '의사가 플레이어를 살리지 못했습니다. 마피아가 죽인 플레이어는 %s님 입니다.';
                } else if (doctor_Vs_Mapia == '1') {
                  let doctorVsMapiaPrompt = '의사가 플레이어를 살렸습니다.';
                }
                response.setOutputParameters({
                    number1: number_one,
                    doctorVsMapia: doctorVsMapiaPrompt,
                }, sendData);
                break;
            }

            case "FinalArgumentAction": {
              const number_one = '1';
              let tieVote_Exist = '0';
              if (outText[contextId[this.context.session.id]].length > 0) {
                  tieVote_Exist = '0';
              } else {
                  tieVote_Exist = '1';
              }
              if (tieVote_Exist == '0') {
                  let tieVoteExistPrompt = `${outText[contextId[this.context.session.id]]}님이 사형대에 올랐습니다.
                  1분동안 최후 변론을 진행해주세요. <pause time = "60000"> 최후 변론이 종료되었습니다.
                  플레이어들은 10초동안 찬반투표를 진행해주세요. <pause time = "10000">
                  ${outText[contextId[this.context.session.id]]}님을 죽이시려면 죽이자고, 살리시려면 살리자고 말씀해주세요.`
              } else if (tieVote_Exist == '1') {
                  let tieVoteExistPrompt = `아무도 사형대에 오르지 않았습니다. 다음으로 넘어가시려면 확인이라고 말씀해주세요.`
                  //이거 다음에 '바로 밤이 되었습니다' 액션으로 넘어감.
              }
              response.setOutputParameters({
                  number1: number_one,
                  tieVoteExist: tieVoteExistPrompt,
              }, sendData);
              break;
            }

            case "MaybeMapiaWinAction": {
              const number_one = '1';
              const doctor_Vs_Mapia = '1'; //지금은 의사가 이긴 상황
              if (doctor_Vs_Mapia == '0') {
                let doctorVsMapiaPrompt = '의사가 플레이어를 살리지 못했습니다. 마피아가 죽인 플레이어는 %s님 입니다.';
              } else if (doctor_Vs_Mapia == '1') {
                let doctorVsMapiaPrompt = '의사가 플레이어를 살렸습니다.';
              }
              const mapia_Or_CitizenWin = '1'; //지금은 시민이 이긴 상황
              if (mapia_Or_CitizenWin = '0') {
                let mapiaOrCitizenWinPrompt = '마피아가 승리하였습니다. 모든 플레이어들의 정체를 공개합니다.';
              } else if (mapia_Or_CitizenWin = '1') {
                let mapiaOrCitizenWinPrompt = '시민이 승리하였습니다. 모든 플레이어들의 정체를 공개합니다.'
              }
              response.setOutputParameters({
                  number1: number_one,
                  doctorVsMapia: doctorVsMapiaPrompt,
                  mapiaOrCitizenWin: mapiaOrCitizenWinPrompt,
              }, sendData);
              break;
            }

        }
    }
}

let contextId = {};

let outText = {};

function* getText(id) {
    const text = yield;
    outText[id] = text;
}



class Response {
    constructor() {
        this.version = '2.0';
        this.resultCode = 'OK';
        this.output = {};
        this.directives = [];
    }
    setParameters(result, sendData) {
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
        }
        console.log(this.output);

        sendData(this);
    }
}

const reqObject = (f, req, res, next) => {
    response = new Response();
    request = new Request(req, f);
    request.actionRequest(response, (r) => {
        console.log(r);
        res.send(r)
    });
    console.log(`NPKResponse: ${JSON.stringify(response)}`);
};

module.exports = reqObject;
module.exports.getText = getText;
