<template>
  <div class="backgroud-container">
    <div id="app">
    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/moon2.png" alt />
      <div class="stars"></div>
      <div class="twinkling"></div>
      <div class="clouds"></div>
      <div class="container" v-if="isNotJoinedRoom">
        <div class="col-md-12 offset-md-1">
          <h1 class="text-center mb-4">
            현주가 좋아하는
            <br />마피아 게임!!
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
          <button type="button" class="btn btn-danger btn-lg" @click.prevent="roomConnect">
            <b>접속</b>
          </button>
        </div>
        <p>{{ temp }}</p>
      </div>
      <div class="container" v-else-if="!isStartGame">
        <h1>
          <b>방에 접속하셨습니다!</b>
        </h1>
        <div>
          <div class="blink">사람들 기다리는 중인가 뭐시기</div>
          <br />
          <br />
          {{members.length}} /
          <b>{{roomSize}}</b>
          <br />
        </div>
        <br />
        <br />
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
            class="buttonWithTransparent"
            v-for="member in members"
            v-bind:key="member.name"
          >{{member.name}}</button>
        </div>
        <br />
      </div>
      <div class="container" v-if="isStartGame">
        {{name}}님!
        <br />!게임 시작!
        <br />
        당신의 역할 : {{role}}
        <div class="list-group" v-if="!isNowSelect && !isDeciding">
          <!-- <button
            type="button"
            class="list-group-item list-group-item-action list-group-item-dark"
            v-for="member in members"
            v-bind:key="member.name"
            disabled
          >{{member.name}}</button>-->
          <li
            class="buttonWithTransparent"
            v-for="member in members"
            v-bind:key="member.name"
          >{{member.name}}</li>
          <li
            class="buttonWithTransparent"
            v-for="member in deadMember"
            v-bind:key="member.name"
          >{{member.name}}</li>
          <ul class="list-group" v-if="false">
            <template v-for="member in deadMember">
              <!-- <li
                class="list-group-item d-flex justify-content-between align-items-center"
                v-bind:key="member.name"
              >
                <a href="#" class="list-group-item list-group-item-dark">{{member.name}}</a>
              </li>-->
              <li
                class="list-group-item list-group-item-danger align-items-center"
                v-bind:key="member.name"
              >{{member.name}}</li>
              <!-- <button class="buttonWithTransparent" v-bind:key="member.name">{{member.name}}</button> -->
            </template>
          </ul>
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
                class="list-group-item list-group-item-action list-group-item-danger"
                @click.prevent="decide($event, member.name)"
                v-if="false"
              >{{member.name}}</button>
              <button
                href="http://test.naver.com"
                type="button"
                class="contact-button"
                @click.prevent="decide($event, member.name)"
              >
                {{member.name}}
                <!-- <img src="./13230195.png" class="icon icon-paperplane"> -->
              </button>
              <span class="badge badge-primary badge-pill">{{badge[member.name]}}</span>
            </li>
            <div class="list-group" v-bind:key="member.name" v-if="false">
              <a href="#" class="list-group-item list-group-item-action" style="width:95%;">
                {{member.name}}
                <button
                  type="button"
                  @click.prevent="decide($event, member.name)"
                  style="display:none"
                ></button>
                <strong>{{badge[member.name]}}</strong>
              </a>
            </div>
          </template>
          <template v-for="member in deadMember">
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
              v-bind:key="member.name"
              v-if="false"
            >
              <a href="#" class="list-group-item list-group-item-dark">{{member.name}}</a>
            </li>
            <li
              class="list-group-item list-group-item-dark align-items-center"
              v-bind:key="member.name"
            >{{member.name}}</li>
          </template>
        </ul>
        <ul class="list-group" v-else-if="isDeciding">
          <template v-for="member in members">
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
              v-bind:key="member.name"
              v-if="true"
            >
              <button
                type="button"
                class="list-group-item list-group-item-action list-group-item-dark"
                @click.prevent="decide($event, member.name)"
                disabled
              >{{member.name}}</button>
              <span class="badge badge-primary badge-pill">{{badge[member.name]}}</span>
            </li>
            <div class="list-group" v-bind:key="member.name" v-if="false">
              <a href="#" class="list-group-item list-group-item-action">
                {{member.name}}
                <button
                  type="button"
                  @click.prevent="decide($event, member.name)"
                  style="display:none"
                  disabled
                ></button>
              </a>
            </div>
          </template>
          <template v-for="member in deadMember">
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
              v-bind:key="member.name"
              v-if="true"
            >
              <a href="#" class="list-group-item list-group-item-dark">{{member.name}}</a>
            </li>
            <li
              class="list-group-item list-group-item-danger align-items-center"
              v-bind:key="member.name"
              v-if="false"
            >{{member.name}}</li>
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
        <p
          class="announce"
          style="overflow:scroll;height:300px; padding:10px; white-space:pre"
        >{{tempAnnounce}}</p>
      </div>
      <button
        type="button"
        class="btn btn-danger"
        @click="isNotJoinedRoom = !isNotJoinedRoom"
        v-if="!isNotJoinedRoom"
      >나가기!</button>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  name: "app",
  data() {
    return {
      roomID: "",
      socket: io(),
      name: "",
      roomSize: 0,
      temp: "",
      warnNoName: false,
      isNotJoinedRoom: true,
      isStartGame: false,
      memberObject: [],
      members: [],
      deadMember: [],
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
      this.room = io();
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
      // this.tempAnnounce += `${message}\n`;
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
      this.members.forEach(o => {
        this.badge[o.name] = 0;
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
      // this.tempAnnounce += "암살 명령 받음!!!!!!!!!!!!!!!!!!!!!!!!!!!!1\n";
      this.isNowSelect = true;
      this.isDeciding = true;
    });
    this.socket.on("INVESTIGATION", () => {
      // this.tempAnnounce += "경찰 명령 받음!!!!!!!!!!!!!!!!!!!!!!!!!!!!1\n";
      this.isNowSelect = true;
      this.isDeciding = true;
    });
    this.socket.on("TREATMENT", () => {
      // this.tempAnnounce += "의사 명령 받음!!!!!!!!!!!!!!!!!!!!!!!!!!!!1\n";
      this.isNowSelect = true;
      this.isDeciding = true;
    });
    this.socket.on("VOTE", () => {
      // this.tempAnnounce += "제발 투표하세요!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1\n";
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
      // this.tempAnnounce +=
      //   "경찰 결과 왔다 받아라~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n";
      if (data.role == "시민") {
        this.tempAnnounce += data.name + "님은" + "마피아가 아닙니다.\n";
      } else {
        this.tempAnnounce += data.name + "님은 " + data.role + "입니다.\n";
      }
      // this.isNowSelect = true;
    });
    this.socket.on("END_DECIDE", () => {
      // this.tempAnnounce += "END_DICIDEEEEEE"
      Object.keys(this.badge).forEach(o => (this.badge[o] = 0));
      this.isDeciding = false;
      this.isVoting = false;
      this.isNowSelect = false;
    });

    this.socket.on("DECIDE_BADGE", data => {
      if (!this.isVoting) {
        this.badge[data]++;
      }
    });
    this.socket.on("VOTE_BADGE", data => {
      if (this.isVoting) {
        this.badge[data]++;
      }
    });
    this.socket.on("UPDATE_LIST", data => {
      this.memberObject = data;
      this.members = this.memberObject
        .filter(o => o.isAlive === true)
        .map(o => o);
      this.deadMember = this.memberObject
        .filter(o => o.isAlive === false)
        .map(o => {
          o.name += "  ";
          return o;
        });
    });
  }
};
</script>

<style>
body {
  background-color: black;
}
.list-group {
  background-color: transparent;
}

@keyframes move-background {
  from {
    -webkit-transform: translate3d(0px, 0px, 0px);
  }
  to {
    -webkit-transform: translate3d(1000px, 0px, 0px);
  }
}
@-webkit-keyframes move-background {
  from {
    -webkit-transform: translate3d(0px, 0px, 0px);
  }
  to {
    -webkit-transform: translate3d(1000px, 0px, 0px);
  }
}

@-moz-keyframes move-background {
  from {
    -webkit-transform: translate3d(0px, 0px, 0px);
  }
  to {
    -webkit-transform: translate3d(1000px, 0px, 0px);
  }
}

@-webkit-keyframes move-background {
  from {
    -webkit-transform: translate3d(0px, 0px, 0px);
  }
  to {
    -webkit-transform: translate3d(1000px, 0px, 0px);
  }
}

.background-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.stars {
  background: black
    url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png) repeat;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: block;
  z-index: -5;
}

.twinkling {
  width: 10000px;
  height: 100%;
  background: transparent
    url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/twinkling.png")
    repeat;
  background-size: 1000px 1000px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -3;

  -moz-animation: move-background 70s linear infinite;
  -ms-animation: move-background 70s linear infinite;
  -o-animation: move-background 70s linear infinite;
  -webkit-animation: move-background 70s linear infinite;
  animation: move-background 70s linear infinite;
}

* {
  z-index: 30;
}

.clouds {
  width: 10000px;
  height: 100%;
  background: transparent
    url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/clouds_repeat.png")
    repeat;
  opacity: 0.5;
  background-size: 1000px 1000px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -2;

  -moz-animation: move-background 150s linear infinite;
  -ms-animation: move-background 150s linear infinite;
  -o-animation: move-background 150s linear infinite;
  -webkit-animation: move-background 150s linear infinite;
  animation: move-background 150s linear infinite;
}
img {
  height: 20vh;
  width: 20vh;
  position: absolute;
  z-index: -2;
  right: 20px;
  top: 100px;
}

@import url(https://fonts.googleapis.com/css?family=Raleway:400, 300, 500, 700);

html {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: transparent;
  -webkit-font-smoothing: antialiased;
  font-size: 18px;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: currentColor;
}

.icon-paperplane {
  font-size: 1em;
  color: white;
  margin-left: 1px;
  margin-top: 5px;
}

span.contact-button {
  text-transform: none;
  position: absolute;
  color: #ee283e;
  top: 20px;
  left: 30px;
  opacity: 0;
  transition: all 0s ease 0s;
}

.contact-button:hover {
  transition: 0.3s ease-in-out;
  border: 2px solid white;
  border-radius: 50px;
  background-color: white;
  color: black;
}

.contact-button > span {
  opacity: 1;
  transition: all 0.25s ease-in-out 0.1s;
}

.contact-button:hover:before {
  transition: 0.3s ease-in-out;
  background-color: #ee283e;
}

.contact-button:before,
.contact-button:after {
  content: "";
  position: absolute;
  top: -14px;
  left: -12px;
  width: 132px;
  height: 25px;
}
.contact-button:before {
  border: 2px solid #ee283e;
  background-color: #ee283e;
  transform: skew(-25deg);
  transition: 0.3s ease-in-out;
}
.contact-button:after {
  content: "뱃지";
  font-size: 0.6em;
  top: -10px;
  left: 0px;
  color: white;
}

.contact-button {
  position: relative;
  -webkit-perspective: 1000;
  -webkit-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  color: white;
  background-color: transparent;
  text-decoration: none;
  text-transform: uppercase;
  font-family: "Raleway", sans-serif;
  font-weight: 500;
  font-size: 1.2em;
  border: 2px solid white;
  border-radius: 4px;
  padding: 20px 60px 20px 55px;
  transition: 0.3s ease-in-out;
  z-index: 300;
}

.inspiration {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  color: lighten(#1f3944, 25%);
  font-family: "Raleway", sans-serif;
  font-weight: 700;
  font-size: 1em;
}

.buttonWithTransparent {
  display: inline-block;
  padding: 0.35em 1.2em;
  border: 0.1em solid #ffffff;
  margin: 0 0.3em 0.3em 0;
  border-radius: 0.12em;
  box-sizing: border-box;
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  color: #ffffff;
  background-color: transparent;
  text-align: center;
  transition: all 0.2s;
}
.buttonWithTransparent:hover {
  color: #000000;
  background-color: transparent;
}
#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
  font-family: "나눔고딕", "Malgun Gothic", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* background-color: black; */
  /* color: #2c3e50; */
  color: white;
  margin-top: 60px;
}
.blink {
  -webkit-animation: fadeOut 1.5s 1s infinite linear alternate;
  -moz-animation: fadeOut 1.5s 1s infinite linear alternate;
  -ms-animation: fadeOut 1.5s 1s infinite linear alternate;
  -o-animation: fadeOut 1.5s 1s infinite linear alternate;
  animation: fadeOut 1.5s 1s infinite linear alternate;
}
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-webkit-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-moz-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-ms-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-o-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
