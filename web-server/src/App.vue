<template>
  <div id="app">
    <div class="container" v-if="isNotJoinedRoom">
      <div class="col-md-8 offset-md-2">
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
      <h1 class="display-4">
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
          class="list-group-item list-group-item-action list-group-item-dark"
          v-for="member in members"
          v-bind:key="member.name"
          disabled
        >{{member.name}}</button>
        <ul class="list-group">
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
            >{{member.name}}</button>
            <span class="badge badge-primary badge-pill">{{badge[member.name]}}</span>
          </li>
        </template>
        <template v-for="member in deadMember">
          <!-- <li
            class="list-group-item d-flex justify-content-between align-items-center"
            v-bind:key="member.name"
          >
            <a href="#" class="list-group-item list-group-item-dark">{{member.name}}</a>
          </li>-->
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
          >
            <button
              type="button"
              class="list-group-item list-group-item-action list-group-item-dark"
              @click.prevent="decide($event, member.name)"
              disabled
            >{{member.name}}</button>
            <span class="badge badge-primary badge-pill">{{badge[member.name]}}</span>
          </li>
        </template>
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
  background-color: #31353D;
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
