<template>
  <div class="BannerItem" ref='libox'>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name:'BannerItem'
  }
</script>
<style lang="stylus" scoped>
  .bannerli
    height 100%
    list-style none
    float left
    img
      width 100%
</style>