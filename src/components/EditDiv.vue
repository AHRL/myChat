<template>
  <pre contenteditable="true" ref="editDiv" v-html="innerText" @keyup.enter="sendMsg"
  @input="changeTxt" @focus="lock=true" @blur="lock=false"></pre>
</template>
<script>
export default {
  props: {
    child: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      innerText: this.child,
      lock: false
    }
  },
  watch: {
    child: {
      handler (newValue, oldValue) {
        if (!this.lock) {
          this.innerText = this.child
        }
      },
      deep: true
    }
  },
  methods: {
    changeTxt () {
      this.$emit('updateMsg', this.$refs.editDiv.innerHTML)
    },
    blur () {
      this.lock = false
    },
    setInnerText () {
      this.$refs.editDiv.innerHTML = ''
      this.innerText = this.child
    },
    sendMsg () {
      this.$emit('send')
    }
  }
}
</script>
<style scoped>
pre{
  width: calc(100% + 25px);
  height: 100%;
  font-size: 16px;
  border: none;
  outline: none;
  padding-top: 5px;
  margin: 0;
  overflow-y: scroll;
  white-space: normal;
}
</style>
