(function(t){function e(e){for(var o,a,r=e[0],c=e[1],l=e[2],u=0,d=[];u<r.length;u++)a=r[u],i[a]&&d.push(i[a][0]),i[a]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(t[o]=c[o]);m&&m(e);while(d.length)d.shift()();return s.push.apply(s,l||[]),n()}function n(){for(var t,e=0;e<s.length;e++){for(var n=s[e],o=!0,r=1;r<n.length;r++){var c=n[r];0!==i[c]&&(o=!1)}o&&(s.splice(e--,1),t=a(a.s=n[0]))}return t}var o={},i={app:0},s=[];function a(e){if(o[e])return o[e].exports;var n=o[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=t,a.c=o,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)a.d(n,o,function(e){return t[e]}.bind(null,o));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="/";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],c=r.push.bind(r);r.push=e,r=r.slice();for(var l=0;l<r.length;l++)e(r[l]);var m=c;s.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";var o=n("64a9"),i=n.n(o);i.a},1:function(t,e){},"56d7":function(t,e,n){"use strict";n.r(e);n("cadf"),n("551c"),n("f751"),n("097d");var o=n("2b0e"),i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"backgroud-container"},[n("div",{attrs:{id:"app"}},[n("img",{attrs:{src:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/moon2.png",alt:""}}),n("div",{staticClass:"stars"}),n("div",{staticClass:"twinkling"}),n("div",{staticClass:"clouds"}),t.isNotJoinedRoom?n("div",{staticClass:"container"},[n("div",{staticClass:"col-md-12 offset-md-1"},[n("button",{staticClass:"contact-button",attrs:{href:"http://test.naver.com",type:"button"},on:{click:function(e){return e.preventDefault(),t.decide(e,t.member.name)}}},[t._v("\n          test\n          ")]),t._e(),n("div",{staticClass:"start"},[n("h2",[t._v("Mapia")]),n("form",[n("input",{directives:[{name:"model",rawName:"v-model",value:t.name,expression:"name"}],attrs:{type:"text",id:"email","aria-describedby":"nameHelp",placeholder:"Name"},domProps:{value:t.name},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:(e.preventDefault(),t.roomConnect(e))},input:function(e){e.target.composing||(t.name=e.target.value)}}}),n("br"),n("input",{directives:[{name:"model",rawName:"v-model",value:t.roomID,expression:"roomID"}],attrs:{type:"text",id:"id","aria-describedby":"roomIdHelp",placeholder:"RoomID"},domProps:{value:t.roomID},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:(e.preventDefault(),t.roomConnect(e))},input:function(e){e.target.composing||(t.roomID=e.target.value)}}})]),n("a",{staticClass:"link",attrs:{href:"#"}},[t._v("forgot your password ?")]),n("br"),n("button",{staticClass:"btnk btn-1-non-border btn-1a",on:{click:function(e){return e.preventDefault(),t.roomConnect(e)}}},[t._v("Connect")]),n("br"),n("button",{staticClass:"bttn-minimal bttn-md bttn-danger",on:{click:function(e){return e.preventDefault(),t.roomConnect(e)}}},[t._v("Connect")])]),t._e(),t.warnNoName?n("div",{staticClass:"alert alert-primary",attrs:{role:"alert"}},[t._v("이름으으으으을 입력하세요오오")]):t._e(),t._e(),t._e()]),n("p",[t._v(t._s(t.temp))])]):t.isStartGame?t._e():n("div",{staticClass:"container"},[t._m(0),n("div",[n("div",{staticClass:"blink"},[t._v("사람들 기다리는 중인가 뭐시기")]),t._v("\n        "+t._s(t.members.length)+" /\n        "),n("b",[t._v(t._s(t.roomSize))]),n("br")]),n("br"),n("br"),n("div",{staticClass:"list-group"},t._l(t.members,function(e){return n("button",{key:e.name,staticClass:"buttonWithTransparent",attrs:{type:"button"}},[t._v(t._s(e.name))])}),0),n("br")]),t.isStartGame?n("div",{staticClass:"container"},[t._v("\n      "+t._s(t.name)+"님!\n      "),n("br"),t._v("!게임 시작!\n      "),n("br"),t._v("\n      당신의 역할 : "+t._s(t.role)+"\n      "),t.isNowSelect||t.isDeciding?t._e():n("div",{staticClass:"list-group"},[t._l(t.members,function(e){return n("li",{key:e.name,staticClass:"buttonWithTransparent"},[t._v(t._s(e.name))])}),t._l(t.deadMember,function(e){return n("li",{key:e.name,staticClass:"buttonWithTransparent dead"},[t._v(t._s(e.name))])}),t._e()],2),t.isNowSelect||t.isDeciding?n("div",{staticClass:"progress"},[n("div",{staticClass:"progress-bar progress-bar-striped progress-bar-animated",style:t.barStyle,attrs:{role:"progressbar","aria-valuenow":"75","aria-valuemin":"0","aria-valuemax":"100"}})]):t._e(),t.isNowSelect?n("ul",{staticClass:"list-group"},[t._l(t.members,function(e){return[n("li",{key:e.name,staticClass:"list-group-item d-flex justify-content-between align-items-center"},[t._e(),n("button",{staticClass:"contact-button",attrs:{href:"http://test.naver.com",type:"button",content:t.badge[e.name]},on:{click:function(n){return n.preventDefault(),t.decide(n,e.name)}}},[t._v("\n              "+t._s(e.name)+"\n              ")]),n("span",{staticClass:"badge badge-primary badge-pill"},[t._v(t._s(t.badge[e.name]))])]),t._e()]}),t._l(t.deadMember,function(e){return[t._e(),n("li",{key:e.name,staticClass:"list-group-item list-group-item-dark align-items-center"},[t._v(t._s(e.name))])]})],2):t.isDeciding?n("ul",{staticClass:"list-group"},[t._l(t.members,function(e){return[n("li",{key:e.name,staticClass:"list-group-item d-flex justify-content-between align-items-center"},[n("button",{staticClass:"list-group-item list-group-item-action list-group-item-dark",attrs:{type:"button",disabled:""},on:{click:function(n){return n.preventDefault(),t.decide(n,e.name)}}},[t._v(t._s(e.name))]),n("span",{staticClass:"badge badge-primary badge-pill"},[t._v(t._s(t.badge[e.name]))])]),t._e()]}),t._l(t.deadMember,function(e){return[n("li",{key:e.name,staticClass:"list-group-item d-flex justify-content-between align-items-center"},[n("a",{staticClass:"list-group-item list-group-item-dark",attrs:{href:"#"}},[t._v(t._s(e.name))])]),t._e()]})],2):t._e(),t._e(),n("p",{staticClass:"announce",staticStyle:{overflow:"scroll",height:"300px",padding:"10px","white-space":"pre"}},[t._v(t._s(t.tempAnnounce))])]):t._e(),t.isNotJoinedRoom?t._e():n("button",{staticClass:"btn btn-danger",attrs:{type:"button"},on:{click:function(e){t.isNotJoinedRoom=!t.isNotJoinedRoom}}},[t._v("나가기!")])])])},s=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("h1",[n("b",[t._v("방에 접속하셨습니다!")])])}],a=(n("456d"),n("ac6a"),n("7f7f"),n("30ca")),r=n.n(a),c={name:"app",data:function(){return{roomID:"",socket:r()(),name:"",roomSize:0,temp:"",warnNoName:!1,isNotJoinedRoom:!0,isStartGame:!1,memberObject:[],members:[],deadMember:[],tempAnnounce:"메시지",role:"",isNowSelect:!1,time:0,barStyle:"",badge:{},isDeciding:!1,isVoting:!1}},methods:{roomConnect:function(t){0!=this.name.trim().length?(this.warnNoName=!1,this.room=r()(),t.preventDefault(),this.socket.emit("ROOM_CONNECT",{name:this.name,room:this.roomID})):this.warnNoName=!0},sendMessage:function(t){t.preventDefault(),this.socket.emit("SEND_MESSAGE",{user:this.user,message:this.message})},exitGame:function(){this.isNotJoinedRoom=!this.isNotJoinedRoom,this.isStartGame=!this.isStartGame},decide:function(t,e){t.preventDefault(),this.socket.emit("DECIDE",{message:"".concat(e),fromRole:"".concat(this.role)}),this.isNowSelect=!1}},components:{},mounted:function(){var t=this;this.socket.on("ROOM_CONNECT",function(e){t.temp+="".concat(e.name,"가 ").concat(e.room,"번 방에 들어왔습니다."),t.members=e.member,t.roomSize=e.size}),this.socket.on("WRONG_ROOM",function(){t.temp+="".concat(t.roomID,"는 존재하지 않는 방입니다.")}),this.socket.on("ENTER_ROOM",function(){t.isNotJoinedRoom=!t.isNotJoinedRoom,t.isStartGame=!1,t.temp=""}),this.socket.on("FULL_OF_ROOM",function(){t.temp+="".concat(t.roomID,"번 방은 자리가 없어여어엉")}),this.socket.on("START_GAME",function(e){t.isStartGame=!0,t.members=e.member,t.roomSize=e.size,t.members.forEach(function(e){t.badge[e.name]=0})}),this.socket.on("ROLE_ALERT",function(e){t.role=e,t.socket.emit("ROLE_FEEDBACK",{name:t.name,role:e})}),this.socket.on("ALERT",function(e){t.tempAnnounce+="".concat(e.message,"\n")}),this.socket.on("ASSASSINATE",function(){t.isNowSelect=!0,t.isDeciding=!0}),this.socket.on("INVESTIGATION",function(){t.isNowSelect=!0,t.isDeciding=!0}),this.socket.on("TREATMENT",function(){t.isNowSelect=!0,t.isDeciding=!0}),this.socket.on("VOTE",function(){t.isNowSelect=!0,t.isDeciding=!0,t.isVoting=!0}),this.socket.on("TICK",function(e,n){t.time=e,t.barStyle="width: ".concat(n/e*100,"%")}),this.socket.on("RESULT_OF_INVESTIGATION",function(e){"시민"==e.role?t.tempAnnounce+=e.name+"님은마피아가 아닙니다.\n":t.tempAnnounce+=e.name+"님은 "+e.role+"입니다.\n"}),this.socket.on("END_DECIDE",function(){Object.keys(t.badge).forEach(function(e){return t.badge[e]=0}),t.isDeciding=!1,t.isVoting=!1,t.isNowSelect=!1}),this.socket.on("DECIDE_BADGE",function(e){t.isVoting||t.badge[e]++}),this.socket.on("VOTE_BADGE",function(e){t.isVoting&&t.badge[e]++}),this.socket.on("UPDATE_LIST",function(e){t.memberObject=e,t.members=t.memberObject.filter(function(t){return!0===t.isAlive}).map(function(t){return t}),t.deadMember=t.memberObject.filter(function(t){return!1===t.isAlive}).map(function(t){return t.name+="  ",t})})}},l=c,m=(n("034f"),n("2877")),u=Object(m["a"])(l,i,s,!1,null,null,null),d=u.exports;o["a"].config.productionTip=!1,new o["a"]({render:function(t){return t(d)}}).$mount("#app")},"64a9":function(t,e,n){}});
//# sourceMappingURL=app.f0d3ec3f.js.map