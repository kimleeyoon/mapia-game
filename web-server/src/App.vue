<template>
  <div id="app">
    <div class="container" v-if="isNotJoinedRoom">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center mb-4">현주가 좋아하는 <br>마피아 게임</h1>
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
          />
          <small id="nameHelp" class="form-text text-muted">게임 내에서 사용할 이름을 입력하세요</small>
        </div>
        <div class="form-group">
          <!-- <label for="name">Name</label> -->
          <input
            type="text"
            class="form-control"
            id="name"
            aria-describedby="roomIdHelp"
            placeholder="Enter RoomID"
            v-model="roomID"
          />
          <small id="roomIdHelp" class="form-text text-muted">NUGU가 알려준 방 ID를 입력하세요</small>
        </div>
        <button type="button" class="btn btn-primary btn-lg" @click.prevent="roomConnect">접속</button>
      </div>
      <p>{{ roomID }}</p>
      <p>{{ temp }}</p>
    </div>
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
      socket: io("192.168.0.13:3000"),
      name: "",
      temp: "",
      isNotJoinedRoom: true
    };
  },
  methods: {
    roomConnect(e) {
      this.room = io("192.168.0.13:3000");
      // this.temp += "roomConnect 누름\n\n";
      e.preventDefault();
      this.socket.emit("ROOM_CONNECT", {
        name: this.name,
        room: this.roomID
      });
      // this.namespace = io("/namespace" + this.roomID);
      // this.namespace = io("localhost:8080")

      // console.log("namespace" + this.roomID);
      // news라는 이벤트를 받을 시 콘솔에 data.hello를 출력
      // namespace.on('announce', (data) => {
      //     console.log("announce 이벤트 발생");
      //     console.log(data);
      //     text += `${data}\n`;
      //     document.getElementById("alert").value = text;
      // });
    },
    sendMessage(e) {
      e.preventDefault();

      this.socket.emit("SEND_MESSAGE", {
        user: this.user,
        message: this.message
      });
      // this.message = "";
    }
  },
  components: {},
  mounted() {
    this.socket.on("ROOM_CONNECT", data => {
      // this.socket = [...this.messages, data];
      this.temp += `${data.name}가 ${data.room}번 방에 들어왔습니다.<br>`
      // you can also do this.messages.push(data)
    });
    this.socket.on("WRONG_ROOM", data => {
      this.temp += `${this.roomID}는 존재하지 않는 방입니다..<br>`
    })
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
