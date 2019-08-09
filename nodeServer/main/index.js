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
              const number_one = '1';
              const tieVote_Exist = '0';
              if (tieVote_Exist == '0'){
                let tieVoteExistPrompt = '이현주님이 사형대에 올랐습니다. 1분동안 최후 변론을 진행해주세요. <pause time = "60000"> 최후 변론이 종료되었습니다. 플레이어들은 10초동안 찬반투표를 진행해주세요. <pause time = "10000">'
              } else if (tieVote_Exist == '1'){
                let tieVoteExistPrompt = '지목된 사람이 두 명을 넘어서 아무도 사형대에 오르지 않았습니다. '
              }
              const yesOrNoVote_Result = '1';
              if (yesOrNoVote_Result == '0'){
                let yesOrNoVoteResultPrompt = '찬반 투표 결과 과반수가 반대하여 사형되지 않았습니다. '
              } else if (yesOrNoVote_Result == '1'){
                let yesOrNoVoteResultPrompt = '찬반 투표 결과 과반수가 동의하여 형장의 이슬이 되었습니다. '
              } else {
                let yesOrNoVote_Result = ' '
              }
              response.setOutputParameters({
                  number1: number_one,
                  tieVoteExist: tieVoteExistPrompt,
                  yesOrNoVoteResult: yesOrNoVoteResultPrompt,
              }, sendData);
              break;
            }

        }
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
        this.output = {
            numOfPlayer: result.numOfPlayer,
            pinNum: result.pinNum,
            roomExist: result.roomExist,
            number1: result.number1,
            tieVoteExist: result.tieVoteExist,
            yesOrNoVoteResult: result.yesOrNoVoteResult,
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
