
class Requset {
    constructor(httpReq) {
        // console.log(httpReq.body);
        this.action = httpReq.body.action;
    }
    actionRequest(response, sendData) {
        let actionName = this.action.actionName;
        let parameters = this.action.parameters;

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
        if(result){
            this.output = result;
        }else{
            this.resultCode = "Error";
        }
        sendData();
    }
}

const reqObject = (req, res, next) => {
    response = new Response();
    request = new Requset(req);
    request.actionRequest(response, () => res.send(response));
};

module.exports = reqObject;
