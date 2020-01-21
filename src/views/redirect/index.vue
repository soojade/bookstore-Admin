<script>
export default {
  created() {
    const { params, query } = this.$route
    const { path } = params // redirect后面的路径
    this.$router.replace({ path: '/' + path, query }) // replace 跳转到指定路径，但不会向history里面添加新的记录
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
