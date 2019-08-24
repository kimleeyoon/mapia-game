class Member {
    constructor(name, socketId, socket){
        this.name = name;
        this.socket = socketId;
        this.role = ''
        this.socketOn = socket;
        this.countDown;
        this.action = "none";
    }
    setAction(action){
        this.action = action;
    }
    clearAction(){
        this.action = "none";
    }
    setCountdown(c){
        this.countDown = c;
    }
    getAction(){
        return this.action;
    }
}

module.exports = Member;