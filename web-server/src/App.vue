<template>
  <div class="backgroud-container">
    <div id="app">
      <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/moon2.png" alt />
      <div id="night" v-if="isNight">
        <div class="stars"></div>
        <div class="twinkling"></div>
      </div>
      <div id="day" v-else>
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 1200 673.149"
          enable-background="new 0 0 1200 673.149"
          xml:space="preserve"
        >
          <linearGradient
            id="Sky_1_"
            gradientUnits="userSpaceOnUse"
            x1="600"
            y1="357.2764"
            x2="600"
            y2="0"
          >
            <stop offset="0.0034" style="stop-color:#ECABCD" />
            <stop offset="1" style="stop-color:#59AADE" />
          </linearGradient>
          <rect id="Sky" fill="url(#Sky_1_)" width="1200" height="357.276" />
          <radialGradient
            id="Sky_Overlay_1_"
            cx="593.1914"
            cy="353.3618"
            r="587.6592"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" style="stop-color:#FFFFFF" />
            <stop offset="1" style="stop-color:#000000" />
          </radialGradient>
          <rect
            id="Sky_Overlay"
            display="none"
            opacity="0.3"
            fill="url(#Sky_Overlay_1_)"
            width="1200"
            height="357.276"
          />
        </svg>
      </div>
      <div class="clouds"></div>

      <div class="container" v-if="isNotJoinedRoom">
        <div class="col-md-10 offset-md-1">
          <ul class="list-group" v-if="false">
            <li class="list-group-item" style="background-color: transparent;">
              <button
                type="button"
                class="contact-button"
                style="color:white;"
                @click.prevent="decide($event, member.name)"
              >
                test
                <!-- <img src="./13230195.png" class="icon icon-paperplane"> -->
              </button>
            </li>
          </ul>
          <button type="button" class="buttonWithTransparent" v-if="false">test</button>
          <div class="start">
            <h2>Mapia</h2>
            <form>
              <input
                type="text"
                id="email"
                aria-describedby="nameHelp"
                placeholder="Name"
                v-model="name"
                @keyup.enter.prevent="roomConnect"
              />
              <br />
              <input
                type="text"
                id="id"
                aria-describedby="roomIdHelp"
                placeholder="RoomID"
                v-model="roomID"
                @keyup.enter.prevent="roomConnect"
              />
            </form>
            <a href="#" class="link">forgot your password ?</a>
            <br />
            <button class="btnk btn-1-non-border btn-1a" @click.prevent="roomConnect">Connect</button>
            <br />
            <!-- <button class="bttn-minimal bttn-md bttn-danLger" @click.prevent="roomConnect">Connect</button> -->
          </div>
        </div>
        <div class="blockquote-wrapper" v-if="temp.length > 0">
          <div class="blockquote">
            <h1>
              <span style="color:#ffffff">{{temp}}</span>
            </h1>
          </div>
        </div>
      </div>
      <div class="container" v-else-if="!isStartGame">
        <div class="col-md-10 offset-md-1">
          <h1>
            <b>방에 접속하셨습니다!</b>
          </h1>
          <div>
            <div class="blink">Now Loading...</div>
            {{members.length}} /
            <b>{{roomSize}}</b>
            <br />
          </div>
          <br />
          <br />
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
      </div>
      <div class="container" v-if="isStartGame">
        <div class="col-md-10 offset-md-1">
          <div class="nick">
            <div class="edit">{{role}}</div>
            <h6>
              <div class="goo">{{name}}</div>
            </h6>
          </div>
          <input id="card-one" class="hidden letter" type="radio" name="ok-button" checked />
          <input
            id="card-two"
            class="hidden letter"
            type="radio"
            name="ok-button"
            v-on:click="roleView=false;"
          />

          <div class="containers" v-if="roleView">
            <div class="inner inner-one">
              <div class="box">
                <div class="triangle"></div>
                <p class="number"></p>
                <div class="text">
                  <!-- <i class="start-quote fas fa-quote-left"></i> -->
                  <p class="forImage" v-if="role=='시민'">
                    <img src="./assets/citizen.jpeg" class="inLetter" />
                  </p>
                  <!-- <p class="credit">Anthony J. D'Angelo</p> -->
                </div>
                <label class="button" for="card-two">
                  <p>next</p>
                </label>
              </div>
            </div>

            <div class="inner inner-two">
              <div class="box">
                <div class="triangle"></div>
                <p class="number"></p>
                <!-- <i class="start-quote fas fa-quote-left"></i> -->
                <p class="quote">An investment in knowledge pays the best interest.</p>
                <p class="credit">Benjamin Franklin</p>
                <label class="button" for="card-three">
                  <p>next</p>
                </label>
              </div>
            </div>
          </div>
          <div class="list-group" v-if="!isNowSelect && !isDeciding">
            <li
              class="buttonWithTransparent"
              v-for="member in members"
              v-bind:key="member.name"
            >{{member.name}}</li>
            <li
              class="buttonWithTransparent dead"
              v-for="member in deadMember"
              v-bind:key="member.name"
            >{{member.name}}</li>
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
                class="list-group-item"
                style="background-color: transparent; padding: 0px;"
                v-bind:key="member.name"
              >
                <button
                  type="button"
                  class="contact-button"
                  :content="badge[member.name]"
                  @click.prevent="decide($event, member.name)"
                >
                  {{member.name}}
                  <!-- <img src="./13230195.png" class="icon icon-paperplane"> -->
                </button>
                <!-- <span class="badge badge-primary badge-pill">{{badge[member.name]}}</span> -->
              </li>
            </template>
            <template v-for="member in deadMember">
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
                v-bind:key="member.name"
                v-if="false"
              >
                <a href="#" class="list-group-item list-group-item-dark">{{member.name}}</a>
              </li>
              <li class="buttonWithTransparent dead" v-bind:key="member.name">{{member.name}}</li>
            </template>
          </ul>
          <ul class="list-group" v-else-if="isDeciding">
            <template v-for="member in members">
              <li
                v-bind:key="member.name"
                class="list-group-item"
                style="padding:0px; background-color: transparent;"
                disabled
              >
                <button
                  type="button"
                  class="contact-button"
                  style="background-color: white; color: black;"
                  v-bind:content="badge[member.name]"
                  disabled
                >
                  {{member.name}}
                  <!-- <img src="./13230195.png" class="icon icon-paperplane"> -->
                </button>
                <!-- <span class="badge badge-primary badge-pill">{{badge[member.name]}}</span> -->
              </li>
            </template>
            <template v-for="member in deadMember">
              <li class="buttonWithTransparent dead" v-bind:key="member.name">{{member.name}}</li>
            </template>
          </ul>
          <div class="blockquote-wrapper">
            <div class="blockquote">
              <h1>
                <span style="color:#ffffff">{{tempAnnounce}}</span>
              </h1>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-danger"
        @click="isNotJoinedRoom = !isNotJoinedRoom"
        v-if="!isNotJoinedRoom && false"
      >나가기!</button>
    </div>
  </div>
</template>
<script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.4.1.min.js"></script>
      <script src="https://codepen.io/fracturedNight/pen/exgzZg.js"></script>
<script>
import io from "socket.io-client";
import { setTimeout } from "timers";

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
      isVoting: false,
      isNight: true,
      roleView: false,
      onceClick: false
    };
  },
  methods: {
    roomConnect(e) {
      // 이름 입력했는지 확인
      if (this.name.trim().length == 0) {
        this.warnNoName = true;
        return;
      }
      if (this.onceClick == false) {
        this.onceClick = true;
        // setTimeout(() => {
        //   this.onceClick = false;
        // }, 1000);
        this.warnNoName = false;
        this.room = io();
        e.preventDefault();
        this.socket.emit("ROOM_CONNECT", {
          name: this.name,
          room: this.roomID
        });
      }
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
      this.onceClick = false;
    });
    this.socket.on("ENTER_ROOM", () => {
      this.isNotJoinedRoom = !this.isNotJoinedRoom;
      this.isStartGame = false;
      this.temp = "";
      this.onceClick = false;
    });
    this.socket.on("FULL_OF_ROOM", () => {
      this.temp += `${this.roomID}번 방은 자리가 없어여어엉`;
      this.onceClick = false;
    });
    this.socket.on("TURN_DAY", () => {
      this.isNight = !this.isNight;
      // this.tempAnnounce = "";
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
      // this.roleView = true;
    });
    this.socket.on("ALERT", data => {
      this.tempAnnounce = "";
      this.tempAnnounce += `${data.message}\n\n`;
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
      this.tempAnnounce = "";
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
        // $('.contact-button:before').attr('data-before',this.badge[data]);
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
    this.socket.on('REQUEST_NAME', () => {
      if(this.isStartGame){
        this.socket.emit("RESPONSE_NAME", {name: this.name, room: this.roomID});
      }
    });
  }
};
</script>


<style>
@import url("https://fonts.googleapis.com/css?family=Open+Sans&display=swap");
body {
  background-color: black;
  width: 100%;
}
.list-group {
  background-color: transparent;
}

* {
  margin: 0;
  padding: 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.start {
  font-family: "Open Sans", sans-serif;
}

.start {
  position: relative;
  top: 10px;
  display: block;
  margin: 0 auto;
  margin-bottom: 80px;
  width: 270px;
  height: 360px;
  background: #fff;
  border-radius: 5px;
  overflow: hidden;
  z-index: 1;
}

.start h2 {
  padding: 40px;
  padding-bottom: 20px;
  font-weight: lighter;
  text-transform: uppercase;
  color: #414141;
}

.start input {
  display: block;
  height: 55px;
  width: 90%;
  margin: 0 auto;
  border: none;
}
.start input::placeholder {
  -webkit-transform: translateY(0px);
  transform: translateY(0px);
  -webkit-transition: 0.5s;
  transition: 0.5s;
}
.start input:hover,
.start input:focus,
.start input:active:focus {
  color: #ff5722;
  outline: none;
  border-bottom: 1px solid #ff5722;
}
.start input:hover::placeholder,
.start input:focus::placeholder,
.start input:active:focus::placeholder {
  color: #ff5722;
  position: relative;
  -webkit-transform: translateY(-20px);
  transform: translateY(-20px);
}

#email,
#id {
  position: relative;
  z-index: 100;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-left: 20px;
  font-family: "Open Sans", sans-serif;
  text-transform: uppercase;
  color: #858585;
  font-weight: lighter;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}

.link {
  text-decoration: none;
  display: inline-block;
  margin: 27px 10%;
  margin-bottom: 15px;
  text-transform: uppercase;
  color: #858585;
  font-weight: lighter;
  font-size: 0.75em;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}

.bttn,
.bttn-lg,
.bttn-md,
.bttn-sm,
.bttn-xs {
  margin: 0;
  padding: 0;
  border-width: 0;
  border-color: transparent;
  background: transparent;
  font-weight: 400;
  cursor: pointer;
  position: relative;
}

/* Button 1a */
.btn-1a:hover,
.btn-1a:active {
  color: white;
  background: #ff5964;
}

.bttn-lg,
.bttn-md {
  font-family: inherit;
}

.bttn-md {
  font-size: 20px;
  padding: 5px 12px;
}

.bttn-minimal {
  margin: 0;
  padding: 0;
  border-color: transparent;
  font-weight: 400;
  cursor: pointer;
  position: relative;
  font-size: 20px;
  font-family: inherit;
  padding: 5px 12px;
  overflow: hidden;
  border-width: 0;
  border-radius: 4px;
  background: transparent;
  color: #fff;
  -webkit-transition: all 0.5s cubic-bezier(0.02, 0.01, 0.47, 1);
  transition: all 0.5s cubic-bezier(0.02, 0.01, 0.47, 1);
}

.bttn-minimal:after,
.bttn-minimal:before {
  position: absolute;
  bottom: 0;
  left: 10px;
  width: calc(100% - 20px);
  height: 1px;
  background: currentColor;
  content: "";
  opacity: 0.65;
  -webkit-transition: opacity 0.5s cubic-bezier(0.02, 0.01, 0.47, 1),
    -webkit-transform 0.5s cubic-bezier(0.02, 0.01, 0.47, 1);
  transition: opacity 0.5s cubic-bezier(0.02, 0.01, 0.47, 1),
    -webkit-transform 0.5s cubic-bezier(0.02, 0.01, 0.47, 1);
  transition: transform 0.5s cubic-bezier(0.02, 0.01, 0.47, 1),
    opacity 0.5s cubic-bezier(0.02, 0.01, 0.47, 1);
  transition: transform 0.5s cubic-bezier(0.02, 0.01, 0.47, 1),
    opacity 0.5s cubic-bezier(0.02, 0.01, 0.47, 1),
    -webkit-transform 0.5s cubic-bezier(0.02, 0.01, 0.47, 1);
}

.bttn-minimal:focus,
.bttn-minimal:hover {
  opacity: 0.9;
}

.bttn-minimal:focus:after,
.bttn-minimal:hover:after {
  opacity: 1;
  -webkit-transform: translateX(-10px) rotate(0.001deg);
  transform: translateX(-10px) rotate(0.001deg);
}

.bttn-minimal:focus:before,
.bttn-minimal:hover:before {
  opacity: 1;
  -webkit-transform: translateX(10px) rotate(0.001deg);
  transform: translateX(10px) rotate(0.001deg);
}

.bttn-minimal.bttn-xs {
  padding: 3px 8px;
  font-size: 12px;
  font-family: inherit;
}

.bttn-minimal.bttn-sm {
  padding: 4px 10px;
  font-size: 16px;
  font-family: inherit;
}

.bttn-minimal.bttn-md {
  font-size: 20px;
  font-family: inherit;
  padding: 5px 12px;
}

.bttn-minimal.bttn-lg {
  padding: 8px 15px;
  font-size: 24px;
  font-family: inherit;
}

.bttn-minimal.bttn-default {
  color: #fff;
}

.bttn-minimal.bttn-primary {
  color: #1d89ff;
}

.bttn-minimal.bttn-warning {
  color: #feab3a;
}

.bttn-danger {
  color: #ff5964;
}

.bttn-minimal.bttn-danger {
  color: #ff5964;
}

.bttn-minimal.bttn-success {
  color: #28b78d;
}

.bttn-minimal.bttn-royal {
  color: #bd2df5;
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

.btnk {
  border: none;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  background: none;
  cursor: pointer;
  padding: 8px 30px;
  display: inline-block;
  margin: 15px 30px;
  margin-top: 5px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  position: relative;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

.btn-1 {
  border: 3px solid red;
  color: #ff5964;
}
.btn-1-non-border {
  color: #ff5964;
}
/* Button 1d */
.btn-1d {
  overflow: hidden;
}

.btn-1d:after {
  width: 0;
  height: 103%;
  top: 50%;
  left: 50%;
  background: ff5964;
  opacity: 0;
  -webkit-transform: translateX(-50%) translateY(-50%);
  -moz-transform: translateX(-50%) translateY(-50%);
  -ms-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
}

.btn-1d:hover,
.btn-1d:active {
  color: white;
}

.btn-1d:hover:after {
  width: 90%;
  opacity: 1;
}

.btn-1d:active:after {
  width: 101%;
  opacity: 1;
}

.btnk:after {
  content: "";
  position: absolute;
  z-index: -1;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
}

/* Pseudo elements for icons */
.btnk:before,
.icon-heart:after,
.icon-star:after,
.icon-plus:after,
.icon-file:before {
  font-family: "icomoon";
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  position: relative;
  -webkit-font-smoothing: antialiased;
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
  height: 15vh;
  width: 15vh;
  position: absolute;
  z-index: -2;
  right: 20px;
  top: 20px;
}

#woolf {
  height: 15vh;
  width: 15vh;
  position: absolute;
  z-index: -2;
  right: 20px;
  top: 20px;
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
  /* border-radius: 50px; */
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
  content: "0";
  position: absolute;
  top: -14px;
  left: -12px;
  width: 45px;
  height: 25px;
}
.contact-button:before {
  border: 2px solid #ee283e;
  background-color: #ee283e;
  opacity: 0;
  transform: skew(-25deg);
  transition: 0.3s ease-in-out;
}
.contact-button:after {
  content: "0";
  opacity: 0;
  font-size: 0.6em;
  top: -10px;
  left: -12px;
  color: white;
}
@import url("https://fonts.googleapis.com/css?family=Raleway&display=swap");
.contact-button {
  position: relative;
  -webkit-perspective: 1000;
  -webkit-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  color: white;

  background-color: transparent;
  text-decoration: none;
  /* text-transform: uppercase; */
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  /* font-size: 1.2em; */
  border: 2px solid white;
  border-radius: 4px;
  padding: 6.3px 21.6px 6.3px 21.6px;
  transition: 0.3s ease-in-out;
  z-index: 300;
  margin: 0 auto;
  width: 100%;
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
@import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");
.buttonWithTransparent {
  display: inline-block;
  padding: 0.35em 1.2em;
  border: 0.1em solid #ffffff;
  margin: 0 0.3em 0.3em 0;
  border-radius: 0.12em;
  box-sizing: border-box;
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  color: #ffffff;
  background-color: transparent;
  text-align: center;
  transition: all 0.2s;
}
.dead {
  color: red;
}
.buttonWithTransparent:hover {
  color: #000000;
  background-color: white;
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
#Sky_Overlay,
#Water_overlay,
#Ball_Overlay,
#Lighthouse_Overlay,
#Beach_Overlay,
#Bush_Overlay,
#Bush_Overlay_1_ {
  mix-blend-mode: multiply;
}

#lighthouse_reflection {
  mix-blend-mode: soft-light;
}

#Sky_Overlay,
#Water_overlay,
#Sky {
  display: none;
}

#day {
  background: linear-gradient(to top, #fff, #ebabcc 50%, #59a9dd);
  margin: 0;
}

svg {
  width: 100%;
  height: 100%;
}

#day {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 150%;
}

:root {
  --color-bg: #34304c;
  --color-bg2: #534d7a;
  --color-highlight: #fff;
  --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.goo {
  font-size: 1rem;
  line-height: 1.35;
  display: inline;
  box-decoration-break: clone;
  background: var(--color-highlight);
  padding: 4px 25px;
  color: black;
  filter: url("#goo");
}

.goo:focus {
  outline: 0;
}

.edit {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--color-bg2);
  text-transform: uppercase;
  font-size: 0.8rem;
  color: var(--color-highlight);
  border-radius: 1em;
}

.nick {
  padding: 0px 50px 0 50px;
  font-family: var(--font);

  width: 60%;
  height: 50%;
  margin: 0 auto;
  white-space: pre;
  /* background: var(--color-bg); */
}

@import url("https://fonts.googleapis.com/css?family=Dancing+Script|Josefin+Sans:600");

:root {
  --main-color: #643a7a;
  --secondary-color: #741caf;
  --sans: "josefin sans", sans serif;
}

.containers {
  position: absolute;
  top: 32%;
  left: 50%;
  margin-left: -200px;
  margin-top: -200px;
  width: 400px;
  height: 400px;
  border-radius: 5px;
  font-family: "dancing script", cursive;
  overflow: hidden;
  color: rgb(121, 125, 127);
  letter-spacing: 0.5px;
}

.hidden {
  display: none;
}

.inner {
  position: absolute;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: 1s;
  visibility: hidden;
}

.box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 70%;
  height: 60%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.5);
  font-size: 1.3rem;
}

.number::before {
  content: "";
  position: absolute;
  top: -130px;
  right: -30px;
  width: 90px;
  height: 180px;
  background: var(--secondary-color);
  transform: rotate(-45deg);
  z-index: -1;
  box-shadow: 0 0 0.7rem rgba(0, 0, 0, 0.5);
}

.number {
  font-family: var(--sans);
  position: absolute;
  margin: 0;
  top: 15px;
  right: 15px;
  color: fade-out(#fff, 0.3);
  z-index: 50;
}

.quote {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
}
.forImage {
  position: absolute;
  top: -22%;
  left: 54%;
  transform: translate(-50%, -50%);
  width: 80%;
}

.credit {
  position: absolute;
  top: 60%;
  right: 5%;
  font-family: var(--sans);
  font-size: 0.8rem;
  font-weight: 500;
}
.credit::before {
  content: "⸛ ";
  vertical-align: middle;
  font-size: 1.4rem;
}

.fas {
  font-size: 3.5rem;
  position: absolute;
  top: 12%;
  left: 7%;
  color: rgba(100, 58, 122, 0.2);
}

input.letter {
  width: 100%;
  transition: 0.3s;
}

img.inLetter {
  height: 20vh;
  width: 25vh;
  position: absolute;
  z-index: -2;
  right: 20px;
  top: 20px;
}

.button p {
  background: #802bbc;
  text-align: center;
  color: #fff;
  padding: 1rem 0;
  width: 100%;
  font-family: var(--sans);
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 0;
  transition: 0.2s ease-out;
}

.button p:hover {
  background: var(--secondary-color);
  cursor: pointer;
}

#card-one:checked ~ .containers .inner-one,
#card-two:checked ~ .containers .inner-two,
#card-three:checked ~ .containers .inner-three {
  opacity: 1;
  visibility: visible;
}

#card-one:checked ~ .containers .inner-two,
#card-two:checked ~ .containers .inner-three,
#card-three:checked ~ .containers .inner-one {
  transform: scale(0.85);
  transform: scale(1) translate(-20rem);
}

/* center the blockquote in the page */
.blockquote-wrapper {
  display: flex;
  /* height: 100vh; */
  padding: 0 20px;
}

/* Blockquote main style */
.blockquote {
  position: relative;
  font-family: "Barlow Condensed", sans-serif;
  max-width: 620px;
  margin: 80px auto;
  margin-top: 30px;
  align-self: center;
}
@import url("https://fonts.googleapis.com/css?family=Noto+Serif+KR&display=swap");
/* Blockquote header */
.blockquote h1 {
  font-family: "Noto Serif KR", cursive;
  position: relative; /* for pseudos */
  color: white;
  font-size: small;
  font-weight: 600;
  line-height: 1.65;
  margin: 0;
  border-radius: 20px;
  padding: 12.5px 25px;
  background-color: rgb(100, 100, 100);
}

/* increase header size after 600px */
@media all and (min-width: 600px) {
  .blockquote h1 {
    font-size: 1.05rem;
    line-height: 1.2;
  }
}

/* Blockquote subheader */
.blockquote h4 {
  position: relative;
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0;
  padding-top: 15px;
  z-index: 1;
  margin-left: 150px;
  padding-left: 12px;
}

.blockquote h4:first-letter {
  margin-left: -12px;
}
.list-group-item:active {
  border: none;
}
</style>