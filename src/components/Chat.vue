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
            <p :class="{'myMsg': item.from === curUsername, 'msg': true}" v-html="changeMsg(item.msg)"></p>
          </div>
        </div>
        <div class="editBox">
          <div class="toolsBar">
            <img class="emojiBtn" :src="require('../../static/img/emoji.png')" alt="" @click="emojiShow = !emojiShow">
            <div class="upLoadImg">
              <img :src="require('../../static/img/picture.png')" alt="">
              <input type="file" ref="upLoadImgBtn" @change="sendImg" accept="image/*" />
            </div>
            <div class="upLoadFile">
              <img :src="require('../../static/img/uploadFile.png')" alt="">
              <input type="file" ref="upLoadFileBtn" @change="sendFile" />
            </div>
            <div class="emojiWrapper" v-show="emojiShow">
              <img v-for="i in emojiTotal" @click="addEmoji(i+1)" :key="i" :src="require('../../static/emoji/'+ (i+1) +'.gif')" alt="">
            </div>
          </div>
          <textarea name="message" class="msgText" @keyup.enter="send" v-if="friends.length>0" v-model="friends[nowChat].textmsg"></textarea>
          <textarea name="message" class="msgText" @keyup.enter="send" v-model="textmsg" v-else></textarea>
        </div>
        <div class="sendBtn" @click="send(friends[nowChat].textmsg)">发送</div>
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
      newMsg: [],
      emojiShow: false,
      emojiTotal: 68
    }
  },
  methods: {
    send (msg) {
      if (this.friends.length > 0) {
        this.$socket.emit('receive', msg, this.curUsername, this.friends[this.nowChat].username)
      } else {
        alert('你还没有好友，先去加好友吧')
      }
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
    getNewsList () {
      this.$axios.post('/getNews', {
        username: this.curUsername
      }).then(res => {
        console.log(res)
        this.newMsg = res.data.data
      }).catch(err => console.log(err))
    },
    addEmoji (index) {
      if (this.friends.length > 0) {
        this.friends[this.nowChat].textmsg += '[emoji:' + index + ']'
      } else {
        this.textmsg += '[emoji:' + index + ']'
      }
      this.emojiShow = false
    },
    changeMsg (msg) {
      let emojiIndex = 0
      let picName = ''
      let fileName = ''
      let result = msg
      let reg = /\[emoji:\d+\]/g
      let picReg = /\[img:.+?\]/g
      let fileReg = /\[file:.+?\]/g
      let match = reg.exec(msg)
      let picMatch = picReg.exec(msg)
      let fileMatch = fileReg.exec(msg)
      let fileType = ''
      while (match) {
        emojiIndex = match[0].slice(7, -1)
        if (emojiIndex > this.emojiTotal) {
          result = result.replace(match[0], '[X]')
        } else {
          result = result.replace(match[0], `<img class="emoji" src="../../static/emoji/${emojiIndex}.gif" />`)
        }
        match = reg.exec(msg)
      }
      while (picMatch) {
        picName = picMatch[0].slice(5, -1)
        result = result.replace(picMatch[0], `<img style="max-width: 200px" src="${picName}" />`)
        picMatch = picReg.exec(msg)
      }
      while (fileMatch) {
        fileName = fileMatch[0].slice(6, -1)
        console.log('111')
        console.log(fileName)
        var index = fileName.lastIndexOf('/')
        var str = fileName.substring(index + 1, fileName.length)
        var strFileName = str.replace(/^.+?\\([^\\]+?)(\.[^.\\]*?)?$/gi, '$1')
        var fileExt = str.replace(/.+\./, '').toLowerCase()
        console.log(fileExt)
        if (fileExt === 'doc') {
          fileType = 'word'
        } else if (fileExt === 'xlsx') {
          fileType = 'excel'
        } else {
          fileType = 'file'
        }
        result = result.replace(fileMatch[0], `<p class="fileMsg"><img src="../../static/img/${fileType}.png" ><span>${strFileName}</span><a href="${fileName}" class="downloadBtn">下载</a></p>`)
        fileMatch = fileReg.exec(msg)
      }
      return result
    },
    emojiWrapperHide () {
      var that = this
      document.body.onclick = function (e) {
        if (e.target.className !== 'emojiWrapper' && e.target.className !== 'emojiBtn') {
          that.emojiShow = false
        }
      }
    },
    sendImg () {
      const file = this.$refs.upLoadImgBtn.files[0]
      let formData = new FormData()
      formData.append('file', file)
      this.$axios.post('/uploadImg', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        if (res.data.status === 200) {
          if (this.friends.length > 0) {
            this.$socket.emit('receive', '[img:' + res.data.data.pictureUrl + ']', this.curUsername, this.friends[this.nowChat].username)
          } else {
            alert('你还没有好友，先去加好友吧')
          }
        }
      })
    },
    sendFile () {
      const file = this.$refs.upLoadFileBtn.files[0]
      let formData = new FormData()
      formData.append('file', file)
      this.$axios.post('/uploadFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        if (res.data.status === 200) {
          if (this.friends.length > 0) {
            this.$socket.emit('receive', '[file:' + res.data.data.pictureUrl + ']', this.curUsername, this.friends[this.nowChat].username)
          } else {
            alert('你还没有好友，先去加好友吧')
          }
        }
      })
    },
    downloadFile (e) {
      let btn = e.target
      if (btn.className === 'downloadBtn') {
        window.open('http://' + location.hostname + ':' + location.port + '/download/' + btn.getAttribute('data-url'), '_self')
      }
    }
  },
  updated: function () {
    this.$nextTick(function () {
      var div = document.getElementById('chatPlace')
      div.scrollTop = div.scrollHeight + 20
    })
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
    this.emojiWrapperHide()
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
<style>
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
  position: relative;
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
  padding: 10px 0 10px 10px;
  border-bottom: 1px solid rgb(230, 228, 228);
  position: absolute;
  top: 0;
  left: 0;
  background: white;
  width: 100%;
  margin: 0;
}
.toolsBar{
  height: 30px;
  border-top: 1px solid rgb(223, 221, 221);
  display: flex;
  flex-direction: row;
  position: relative;
}
.toolsBar img {
  height: 80%;
  margin-left: 10px;
  margin-top: 5px;
  cursor: pointer;
}
.upLoadImg,.upLoadFile{
  position: relative;
  width:35px;
  overflow: hidden;
  cursor: pointer;
}
.upLoadImg input,.upLoadFile input{
  position: absolute;
  left: 10px;
  top: 5px;
  opacity: 0;
  filter: opacity(0);
}
.emojiWrapper{
  position: absolute;
  top: -200px;
  left: 0;
  z-index: 10;
  background: #dededf;
  border-radius: 5px;
}
.emojiWrapper img {
  width: 30px;
  height: 30px;
  margin: 3px 3px;
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
  color: white;
}
.fileMsg{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.fileMsg img {
  width: 50px;
  height: 50px;
}
.fileMsg span{
  margin: 0 5px;
}
.fileMsg span:last-child{
  display: inline-block;
  cursor: pointer;
}
a.downloadBtn{
  text-decoration: none;
  color: black;
}
.myMsg a.downloadBtn{
  text-decoration: none;
  color: white;
}
</style>
