<template>
  <div>
    <div class="myChat">
      <div class="topSide">
        <img :src="curHeadImg" alt="头像">
        <p id="me">{{ curUsername }}</p>
        <p>{{ onlineNum }} 在线</p>
        <img :src="require('../../static/img/add.png')" @click="isAdd = !isAdd" class="addFriend">
      </div>
      <div class="leftSide">
          <ul>
            <li v-for="(friend,i) in friends" :key="i" :class="{'activeLi': i === nowChat}" @click="nowChat = i">
              <img :src="require('../../static/img/favicon.png')" :alt="friend.username">
              <p>{{ friend.username }}</p>
            </li>
          </ul>
      </div>
      <div class="rightSide">
        <div id="chatPlace">
          <p class="nowChatName">{{ friends.length > 0 ? friends[nowChat].username : '' }}</p>
          <div v-for="(item, i) in newMsg" :key="i" class="msgBox">
            <div>
              <p :style="{ float: item.from === curUsername ? 'right' : 'left'}">{{ item.date }}</p>
            </div>
            <p :class="{'myMsg': item.from === curUsername, 'msg': true}">{{ item.msg }}</p>
          </div>
        </div>
        <div>
          <div class="toolsBar">
            <img :src="require('../../static/img/emoji.png')" alt="">
            <img :src="require('../../static/img/picture.png')" alt="">
          </div>
          <textarea name="message" class="msgText" @keyup.enter="send" v-if="friends.length>0" v-model="friends[nowChat].textmsg"></textarea>
          <textarea name="message" class="msgText" @keyup.enter="send" v-else></textarea>
        </div>
        <div class="sendBtn" @click="send">发送</div>
      </div>
    </div>
    <div class="add" :style="{display: isAdd ? 'block' : 'none'}">
      <label for="friendName">用户名：</label>
      <input type="text" v-model="friend">
      <p  @click="addFriend">添加</p>
      <p  @click="isAdd = !isAdd">关闭</p>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isAdd: false,
      friend: '',
      curUsername: this.$store.state.username,
      curHeadImg: this.$store.state.headImg,
      friends: this.$store.state.friends,
      nowChat: 0,
      id: '',
      onlineNum: 0,
      textmsg: '',
      newMsg: []
    }
  },
  methods: {
    send () {
      this.$socket.emit('receive', this.friends[this.nowChat].textmsg, this.curUsername, this.friends[this.nowChat].username)
    },
    addFriend () {
      this.$axios.post('/addFriend', {
        username: this.curUsername,
        friend: this.friend
      }).then(res => {
        if (res.data.status === 200) {
          this.$store.commit('updateFriends', res.data.data)
          this.friends = res.data.data
          this.$socket.emit('updateFriends', this.curUsername, this.friend)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getCurClientNews () {
      let curNews = this.newMsg.filter((item) => {
        return (item.from === this.friends[this.nowChat].username && item.to === this.curUsername) || (item.from === this.curUsername && item.to === this.friends[this.nowChat].username)
      })
      return curNews
    },
    getNewsList () {
      this.$axios.post('/getNews', {
        username: this.curUsername
      }).then(res => {
        console.log(res)
        this.newMsg = res.data.data
      }).catch(err => console.log(err))
    }
  },
  sockets: { // 不能改
    getOnlineNum: function (num) {
      this.onlineNum = num
    },
    newMsg: function (data) {
      this.newMsg.push(data)
      this.friends[this.nowChat].textmsg = ''
    },
    updateFriends: function (data) {
      this.friends.push({
        username: data,
        textmsg: ''
      })
    },
    offLine () {
      this.$store.commit('LOGIN_OUT')
      this.$router.push('/login')
    }
  },
  mounted () {
    this.getNewsList()
    console.log(this.newMsg)
  },
  beforeRouteLeave (to, from, next) {
    this.$axios.post('/forceUpdateStatus', {
      username: this.$store.state.username,
      status: false
    }).then(res => {
      console.log(res.data)
      if (res.data.status === 200) {
        next()
      }
    })
  }
}
</script>
<style scoped>
.connect{
  padding-left: 20px;
  padding-right: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  border: 1px solid rgb(233, 230, 230);
  background: rgb(89, 158, 175);
  border-radius: 10px;
}
.myChat{
  width: 700px;
  height: 500px;
  margin: 50px auto;
  background: white;
  border-radius: 5px;
}
.topSide,.leftSide,.rightSide{
  float: left;
}
.topSide{
  width: 100%;
  background: rgb(80, 129, 161);
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 5px 5px 0 0;
  position: relative;
}
.topSide img{
  height: 80%;
  border-radius: 100%;
}
.topSide p{
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.leftSide{
  width: 150px;
  height: calc(100% - 60px - 10px);
  background: #f9fafa;
  overflow-y: scroll;
}
.leftSide ul {
  padding: 0;
  margin: 5px 0;
}
.leftSide ul li {
  font-size: 14px;
  width: 100%;
  list-style: none;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.leftSide ul li:hover{
  background: #dededf;
}
.leftSide ul li img{
  height: 80%;
}
.activeLi{
  background: #dededf;
}
.rightSide{
  width: calc(100% - 150px);
  height: calc(100% - 60px);
  overflow-x: hidden;
}
.rightSide #chatPlace{
  width: calc(100% + 20px);
  height: calc(100% - 140px);
  overflow-y: scroll;
  padding-right: 20px;
}
/* #chatPlace::-webkit-scrollbar {
    display: none;
} */
#chatPlace .nowChatName{
  padding-left: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(230, 228, 228);
}
.toolsBar{
  height: 30px;
  border-top: 1px solid rgb(223, 221, 221);
  display: flex;
  flex-direction: row;
}
.toolsBar img {
  height: 80%;
  margin-left: 10px;
  margin-top: 5px;
  cursor: pointer;
}
.rightSide .msgText{
  width: calc(100% - 10px);
  height: 60px;
  font-size: 16px;
  resize: none;
  border: none;
  outline: none;
  padding-top: 5px;
}
.sendBtn{
  padding: 5px 10px;
  border-radius: 3px;
  background: #71b0c9;
  color:white;
  float: right;
  margin-right: 5px;
  cursor: pointer;
}
img.addFriend{
  height: 30px;
  position: absolute;
  right: 10px;
  cursor: pointer;
}
.add{
  padding: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  border: 1px solid rgb(181, 201, 211);
  background: rgb(255, 255, 255);
  border-radius: 10px;
}
.add label{
  display: inline-block;
  width: 70px;
  text-align: right;
}
.add input{
  width: auto;
  border: 1px solid #71b0c9;
  padding: 5px;
  font-size: 16px;
  border-radius: 3px;
}
.add p{
  display: inline-block;
  padding: 5px 10px;
  border-radius: 3px;
  background: #71b0c9;
  color:white;
  margin-right: 5px;
  cursor: pointer;
}
.msgBox,.msgBox div{
  overflow: hidden;
}
.msgBox p {
  max-width: 80%;
  margin: 5px;
}
.msg{
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  float: left;
  margin: 0;
}
.myMsg{
  background: #71b0c9;
  float: right;
}
</style>
