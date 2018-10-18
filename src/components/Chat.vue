<template>
  <div class="myChat">
    <div class="topSide">
      <img src="../assets/favicon.png" alt="头像">
      <p id="me">AHRLfgdsgfdsgfdsdtretertettrretewrte</p>
      <p id="statu"></p>
    </div>
    <div class="leftSide">
        <ul>
          <li class="activeLi">
            <img src="../assets/favicon.png" alt="party time 聊天室">
            <p>party time</p>
          </li>
        </ul>
    </div>
    <div class="rightSide">
      <div id="chatPlace"></div>
      <div>
        <textarea name="message" id="msgText"></textarea>
      </div>
      <div class="sendBtn">发送</div>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style scoped>
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
}
.leftSide ul {
  padding: 0;
  margin: 5px 0;
}
.leftSide ul li {
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
}
.rightSide #chatPlace{
  width: 100%;
  height: calc(100% - 110px);
  overflow-y: scroll;
}
.rightSide #msgText{
  width: calc(100% - 10px);
  height: 60px;
  font-size: 16px;
  resize: none;
  border: none;
  outline: none;
  border-top: 1px solid rgb(223, 221, 221);
  padding-top: 5px;
}
.sendBtn{
  padding: 5px 10px;
  border-radius: 3px;
  background: #71b0c9;
  color:white;
  float: right;
  margin-right: 5px;
}
</style>
