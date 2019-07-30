class Member {
    constructor(name, socketId, socket){
        this.name = name;
        this.socket = socketId;
        this.role = ''
        this.socketOn = socket;
    }
}

module.exports = Member;