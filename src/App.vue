<template>
  <div id="app">
    <div class="bg">
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
:root {
  --blur: 5px;
}
.bg{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: url("../static/img/bg.jpg") no-repeat;
  background-size: cover;
  filter: blur(var(--blur));
  -webkit-filter:blur(var(--blur));
  -moz-filter:blur(var(--blur));
  -ms-filter:blur(var(--blur));
  -o-filter:blur(var(--blur));
  z-index: -1;
}
</style>
