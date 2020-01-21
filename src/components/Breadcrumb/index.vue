<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <!-- 不需要导航的使用span包裹，需要导航的 a包裹 -->
        <!-- index==levelList.length-1，最后一个不需要导航 -->
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        // 以/redirect开头的重定向路由，不需要更新面包屑
        if (route.path.startsWith('/redirect/')) {
          return
        }
        this.getBreadcrumb() // 路由发生变化重新生成面包屑
      },
      immediate: true
    }
  },

  methods: {
    // 生成面包屑
    getBreadcrumb() {
      // 过滤路由匹配到的所有路由记录中不包含 title 的项，生成新的面包屑导航数组
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]
      // 取出第一项，判断不是 dashboard 就把 dashboard 加入 matched
      // 这样即使后面的路由没有title即不能生成面包屑，也会有一个Dashboard
      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
      }

      // 路由 meta的breadcrumb为 false 不会加入面包屑导航
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // 动态路由加入面包屑导航 https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
