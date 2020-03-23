<template>
  <div id="app">
    <banner :mydata='bannerdata'></banner>
  </div>
</template>

<script>
import banner from '@/views/mybanner.vue'
import {request} from '@/request/request.js'

export default {
  name: 'App',
  data(){
    return {
      bannerdata:[]
    }
  },
  components:{
    banner
  },
  created(){
    request().then(res=>{
      this.bannerdata = res.data.data.banner.list
    })
  }
}
</script>

<style>

</style>
