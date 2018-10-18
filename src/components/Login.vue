<template>
  <div id="loginWrapper">
    <div v-if="!isConnect">
      <p id="info">connecting to server...</p>
    </div>
    <div v-else>
      <div id="nickWrapper" v-show="isLoginPage">
        <h3>Login</h3>
        <div class="formItem">
          <label for="LUsername">用户名：</label>
          <input v-model="LUsername" type="text" name="LUsername" placeholder="username">
        </div>
        <div class="formItem">
          <label for="LPassword">密码：</label>
          <input v-model="LPassword" type="password" name="LPassword" placeholder="password">
        </div>
        <div class="formItem">
          <a class="toBtn" href="javascript:;" @click="isLoginPage = !isLoginPage">还没有账号？注册一个吧</a>
          <p id="loginBtn">登录</p>
        </div>
      </div>
      <div id="registWrapper" v-show="!isLoginPage">
        <h3>Register</h3>
        <div class="formItem">
          <label for="RUsername">用户名：</label>
          <input v-model="RUsername" type="text" name="RUsername" placeholder="username">
        </div>
        <div class="formItem">
          <label for="RPassword">密码：</label>
          <input v-model="RPassword" type="password" name="RPassword" placeholder="password">
        </div>
        <div class="formItem">
          <a class="toBtn" href="javascript:;" @click="isLoginPage = !isLoginPage">已有账号，快去登录吧</a>
          <p>注册</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isLoginPage: true,
      isConnect: true,
      LUsername: '',
      LPassword: '',
      RUsername: '',
      RPassword: ''
    }
  }
}
</script>
<style scoped>
#loginWrapper{
  padding-left: 20px;
  padding-right: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  border: 1px solid rgb(233, 230, 230);
  background: rgb(255, 255, 255);
  border-radius: 10px;
}
#nickWrapper,#registWrapper{
  margin-top: 30px;
  margin-bottom: 30px;
}
h3{
  text-align: center;
  color: #71b0c9;
}
.formItem{
  margin: 10px auto;
  overflow: hidden;
}
label{
  display: inline-block;
  width: 70px;
  text-align: right;
}
input{
  width: auto;
  border: 1px solid #71b0c9;
  padding: 5px;
  font-size: 16px;
  border-radius: 3px;
}
.toBtn{
  display: inline-block;
  margin-top: 25px;
  font-size: 14px;
  color: #71b0c9;
}
#nickWrapper p,#registWrapper p{
  padding: 5px 10px;
  background: #71b0c9;
  color: white;
  border: 5px;
  cursor: pointer;
  float:right;
}
</style>
