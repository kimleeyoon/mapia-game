<template>
  <div id="app">
    <div class="container" v-if="isNotJoinedRoom">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center mb-4">
          현주가 좋아하는
          <br />마피아 게임!
        </h1>
        <!-- <input type="text" class="form-control" v-model="roomID" />
        <input type="text" class="form-control" v-model="name" />-->

        <div class="form-group">
          <!-- <label for="name">Name</label> -->
          <input
            type="text"
            class="form-control"
            id="name"
            aria-describedby="nameHelp"
            placeholder="Enter Name"
            v-model="name"
            @keyup.enter.prevent="roomConnect"
          />
          <small id="nameHelp" class="form-text text-muted">게임 내에서 사용할 이름을 입력하세요</small>
        </div>
        <div class="alert alert-primary" role="alert" v-if="warnNoName">이름으으으으을 입력하세요오오</div>
        <div class="form-group">
          <!-- <label for="name">Name</label> -->
          <input
            type="text"
            class="form-control"
            id="name"
            aria-describedby="roomIdHelp"
            placeholder="Enter RoomID"
            v-model="roomID"
            @keyup.enter.prevent="roomConnect"
          />
          <small id="roomIdHelp" class="form-text text-muted">NUGU가 알려준 방 ID를 입력하세요</small>
        </div>
        <button type="button" class="btn btn-primary btn-lg" @click.prevent="roomConnect">
          <b>접속</b>
        </button>
      </div>
      <p>{{ temp }}</p>
    </div>
    <div class="container" v-else-if="!isStartGame">
      방에 접속하셨습니다!
      <div>
        <h1 class="display-4">사람들 기다리는 중인가 뭐시기</h1>
        <h6>{{members.length}} / {{roomSize}}</h6>
      </div>
      <!-- <ul class="list-group">
        <li
          class="list-group-item"
          v-for="member in members"
          v-bind:key="member.name"
        ><button class="list-group-item">{{member.name}}</button></li>
      </ul>-->
      <div class="list-group">
        <button
          type="button"
          class="list-group-item list-group-item-action"
          v-for="member in members"
          v-bind:key="member.name"
        >{{member.name}}</button>
      </div>
      <br />
    </div>
    <div class="container" v-if="isStartGame">
      게임 시작!
      <br />
      당신의 역할 : {{role}}
      <div class="list-group" v-if="!isNowSelect && !isDeciding">
        <button
          type="button"
          class="list-group-item list-group-item-action"
          v-for="member in members"
          v-bind:key="member.name"
          disabled
        >{{member.name}}</button>
      </div>
      <div class="progress" v-if="isNowSelect || isDeciding">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          aria-valuenow="75"
          aria-valuemin="0"
          aria-valuemax="100"
          :style="barStyle"
        ></div>
      </div>
      <ul class="list-group" v-if="isNowSelect">
        <template v-for="member in members">
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
            v-bind:key="member.name"
          >
            <button
              type="button"
              class="list-group-item list-group-item-action"
              @click.prevent="decide($event, member.name)"
            >{{member.name}}</button>
            <span class="badge badge-primary badge-pill">{{badge[member.name]}}</span>
          </li>
        </template>
      </ul>
      <ul class="list-group" v-else-if="isDeciding">
        <template v-for="member in members">
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
            v-bind:key="member.name"
          >
            <button
              type="button"
              class="list-group-item list-group-item-action"
              @click.prevent="decide($event, member.name)"
              disabled
            >{{member.name}}</button>
            <span class="badge badge-primary badge-pill">{{badge[member.name]}}</span>
          </li>
        </template>
      </ul>
      <div class="list-group" v-if="false">
        <button
          type="button"
          class="list-group-item list-group-item-action"
          v-for="member in members"
          v-bind:key="member.name"
          @click.prevent="decide($event, member.name)"
        >
          {{member.name}}
          <span v-if="isDeciding">
            <span class="badge badge-primary badge-pill">{{badge[member.name]}}</span>
          </span>
        </button>
      </div>
      <p style="white-space:pre">{{tempAnnounce}}</p>
    </div>
    <button
      type="button"
      class="btn btn-primary btn-lg"
      @click="isNotJoinedRoom = !isNotJoinedRoom"
      v-if="!isNotJoinedRoom"
    >나가기!</button>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  name: "app",
  data() {
    return {
      roomID: "",
      socket: io("192.168.0.13:3000"),
      name: "",
      roomSize: 0,
      temp: "",
      warnNoName: false,
      isNotJoinedRoom: true,
      isStartGame: false,
      members: [],
      tempAnnounce: "메시지",
      role: "",
      isNowSelect: false,
      time: 0,
      barStyle: "",
      badge: {},
      isDeciding: false,
      isVoting: false
    };
  },
  methods: {
    roomConnect(e) {
      // 이름 입력했는지 확인
      if (this.name.trim().length == 0) {
        this.warnNoName = true;
        return;
      }

      this.warnNoName = false;
      this.room = io("192.168.0.13:3000");
      e.preventDefault();
      this.socket.emit("ROOM_CONNECT", {
        name: this.name,
        room: this.roomID
      });
    },
    sendMessage(e) {
      e.preventDefault();
      this.socket.emit("SEND_MESSAGE", {
        user: this.user,
        message: this.message
      });
    },
    exitGame() {
      this.isNotJoinedRoom = !this.isNotJoinedRoom;
      this.isStartGame = !this.isStartGame;
    },
    decide(e, message) {
      e.preventDefault();
      this.tempAnnounce += `${message}\n`;
      this.socket.emit("DECIDE", {
        message: `${message}`,
        fromRole: `${this.role}`
      });
      this.isNowSelect = false;
    }
  },
  components: {},
  mounted() {
    this.socket.on("ROOM_CONNECT", data => {
      // this.socket = [...this.messages, data];
      this.temp += `${data.name}가 ${data.room}번 방에 들어왔습니다.`;
      this.members = data.member;
      this.roomSize = data.size;
    });
    this.socket.on("WRONG_ROOM", () => {
      this.temp += `${this.roomID}는 존재하지 않는 방입니다.`;
    });
    this.socket.on("ENTER_ROOM", () => {
      this.isNotJoinedRoom = !this.isNotJoinedRoom;
      this.isStartGame = false;
      this.temp = "";
    });
    this.socket.on("FULL_OF_ROOM", () => {
      this.temp += `${this.roomID}번 방은 자리가 없어여어엉`;
    });
    this.socket.on("START_GAME", data => {
      this.isStartGame = true;
      this.members = data.member;
      this.roomSize = data.size;
      // for (let i = 0; i < this.roomSize; i++) {
      //   this.badge[i] = 0;
      // }
      // Object.keys(this.badge).forEach((o, i, ob) => ob[o] = 0);
      // Object.keys(this.members).forEach((o, i, ob) => this.badge[ob[o].name] = 0);
      this.members.forEach(o => {
        this.badge[o.name] = 0;
        // this.tempAnnounce += `${o.name}\n`;
      });
    });
    this.socket.on("ROLE_ALERT", data => {
      this.role = data;
      this.socket.emit("ROLE_FEEDBACK", { name: this.name, role: data });
    });
    this.socket.on("ALERT", data => {
      this.tempAnnounce += `${data.message}\n`;
    });
    this.socket.on("ASSASSINATE", () => {
      this.tempAnnounce += "암살 명령 받음!!!!!!!!!!!!!!!!!!!!!!!!!!!!1\n";
      this.isNowSelect = true;
      this.isDeciding = true;
    });
    this.socket.on("INVESTIGATION", () => {
      this.tempAnnounce += "경찰 명령 받음!!!!!!!!!!!!!!!!!!!!!!!!!!!!1\n";
      this.isNowSelect = true;
      this.isDeciding = true;
    });
    this.socket.on("TREATMENT", () => {
      this.tempAnnounce += "의사 명령 받음!!!!!!!!!!!!!!!!!!!!!!!!!!!!1\n";
      this.isNowSelect = true;
      this.isDeciding = true;
    });
    this.socket.on("VOTE", () => {
      this.tempAnnounce += "제발 투표하세요!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1\n";
      this.isNowSelect = true;
      this.isDeciding = true;
      this.isVoting = true;
    });
    this.socket.on("TICK", (total, cur) => {
      this.time = total;
      this.barStyle = `width: ${(cur / total) * 100}%`;
      // "width: 75%"
    });
    this.socket.on("RESULT_OF_INVESTIGATION", data => {
      this.tempAnnounce +=
        "경찰 결과 왔다 받아라~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n";
      this.tempAnnounce += data.name + "님은 " + data.role + "입니다.\n";
      this.isNowSelect = true;
    });
    this.socket.on("END_DECIDE", () => {
      // for (let i = 0; i < this.roomSize; i++) {
      //   this.badge[i] = 0;
      // }
      Object.keys(this.badge).forEach((o)=> (this.badge[o] = 0));
      this.isDeciding = false;
      this.isVoting = false;
      this.isNowSelect =false;
    });

    this.socket.on("DECIDE_BADGE", data => {
      // this.tempAnnounce += "다른 사람 선택하하하아아아마암1\n";
      // this.tempAnnounce += "온 데이터 선택하하하아아아마암1\n" + data;
      this.badge[data]++;
    });
    this.socket.on("VOTE_BADGE", data => {
      // this.tempAnnounce += "다른 사람 선택하하하아아아마암1\n";
      // this.tempAnnounce += "온 데이터 선택하하하아아아마암1\n" + data;
      if(this.isVoting){
        this.badge[data]++;
      }
    });
  }
};
</script>

<style>
#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
  font-family: "나눔고딕", "Malgun Gothic", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
