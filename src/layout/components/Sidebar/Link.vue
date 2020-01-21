
<template>
  <!-- eslint-disable vue/require-component-is -->
  <!--  动态组件，解析 to 参数，如果包含 http 前缀则变成一个 a 标签，否则变成一个 router-link 组件-->
  <component v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    linkProps(url) {
      // 通过一个正则表达式匹配 http 链接,如果包含 http 前缀则变成一个 a 标签，否则变成一个 router-link 组件
      if (isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    }
  }
}
</script>
