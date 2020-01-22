<template>
  <!--  根据路由的hidden属性进行展示隐藏-->
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <!-- 根据路由meta属性生成元素 -->
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // 父组件传递的路由
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    this.onlyOneChild = null
    return {}
  },
  methods: {
    // 判断是否只有一个可显示的子路由，有则直接显示子路由，不显示父路由
    hasOneShowingChild(children = [], parent) {
      // 获取显示的子路由数组
      const showingChildren = children.filter(item => {
        if (item.hidden) { // 子路由hidden为true 直接返回 false
          return false
        } else {
          // 将子路由赋值给 onlyOneChild，用于只包含一个路由时展示
          this.onlyOneChild = item
          return true
        }
      })

      // 只有一个子路由，则返回true，作为默认路由显示
      if (showingChildren.length === 1) {
        return true
      }

      // 如果没有子路由需要展示，则将 onlyOneChild 的 path 设置空，显示父路由
      // 并添加 noShowingChildren 属性，表示虽然有子路由，但是不需要展示子路由
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }
      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
