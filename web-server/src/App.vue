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
      <ul class="list-group">
        <li class="list-group-item" v-for="member in members" v-bind:key="member.name">
          <button class="list-group-item">{{member.name}}</button>
        </li>
      </ul>
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
// export default {
//     data() {
//         return {
//             user: '',
//             message: '',
//             messages: [],
//             socket : io('localhost:8080')
//         }
//     },
//     methods: {
//         sendMessage(e) {
//             e.preventDefault();

//             this.socket.emit('SEND_MESSAGE', {
//                 user: this.user,
//                 message: this.message
//             });
//             this.message = ''
//         }
//     },
//     mounted() {
//         this.socket.on('MESSAGE', (data) => {
//             this.messages = [...this.messages, data];
//             // you can also do this.messages.push(data)
//         });
//     }
// }

export default {
  name: "app",
  data() {
    return {
      roomID: "",
      socket: io("10.210.24.10:3000"),
      name: "",
      roomSize: 0,
      temp: "",
      warnNoName: false,
      isNotJoinedRoom: true,
      isStartGame: false,
      members: []
    };
  },
  methods: {
    roomConnect(e) {
      if (this.name.trim().length == 0) {
        this.warnNoName = true;
        return;
      }
      this.warnNoName = false;
      this.room = io("10.210.24.10:3000");
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
    this.socket.on("START_GAME", () => {
      this.isStartGame = true;
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
