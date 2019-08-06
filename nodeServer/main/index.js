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
                    const playerNum = parameters.numOfPlayer;
                    if (parameters.length != 0 && playerNum) {
                        playerNum = parseInt(playerNum.value);
                    }

                    if (isNaN(playerNum)) {
                        playerNum = 4;
                    }

                    // const throwResult = throwDice(diceCount);

                    let pin = f(playerNum).then((pin) => pin).catch((error) => console.log("방 생설 실패"));

                    response.setOutputParameters({
                        numOfPlayer: playerNum,
                        pinNum: `${pin}`,
                    }, sendData);
                    break;
                }
            }
        }

        // getData(parameters.cityName.value)
        // .then((data) => {
        //     console.log("reqObject"); 
        //     let afterData = {
        //         weather : {},
        //         aqi : {},
        //         regionCode : {},
        //         koreaWeather : {},
        //         location : {}
        //     };
        //     [afterData.weather, afterData.aqi, afterData.regionCode, afterData.koreaWeather, afterData.location] = data; // 수정해야함
        //     console.log(afterData);
        //     response.setParameters(afterData, sendData);
        // })
        // .catch(() => {
        //     console.log("getData Promise Error");
        //     response.setParameters(null, sendData);
        // });
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
            numOfPlayer: result.num,
            pinNum: result.pinNum,
        }
        sendData();
    }
}

const reqObject = (f, req, res, next) => {
    response = new Response();
    request = new Request(req, f);
    request.actionRequest(response, () => res.send(response));
};

module.exports = reqObject;