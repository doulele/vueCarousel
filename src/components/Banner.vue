<template>
  <div id="Banner" ref='bannerdom'>
  	<v-touch 
    v-on:panmove='touchmove'
    v-on:panstart='touchstart'
    v-on:panend='touchend'>
        <ul id="BannerBox" ref='bannerboxdom'>
          <slot></slot>>
        </ul>
    </v-touch>
    <banner-point :pointnumber="pintnum" ref='banpon' :witchpoint='index' @poinchangeindex='poinchangeindex' v-if='pointnav'></banner-point>
  </div>
</template>
<script>
  import BannerPoint from './BannerPoint'

  export default {
    name:'Banner',
    components:{
      BannerPoint
    },
    data(){
    	return {
        index:0,
        flg:true,
        bannertimer:null,
        touchstartposition:0
    	}
    },
    props:{
      mydata:{
        type:Array,
        default:[]
      },
      bannerDealy:{
        type:Number,
        default:3000
      },
      transitionDuration:{
        type:Number,
        default:.3
      },
      pointnav:{
        type:Boolean,
        default:true
      }
    },
    mounted(){
    	if (this.mydata.length === 0) {//当有数据传回的时候再开始各种操作
    		let datatimer = setInterval(()=>{
    			if(this.mydata.length !== 0){
    				clearInterval(datatimer);
            setTimeout(()=>{
              this.move()
            },this.bannerDealy);
    			}
    		},20)
    	}
    },
    computed:{
      bannerul:function(){
        return this.$refs.bannerboxdom;
      },
      banner:function(){
        return this.$refs.bannerdom;
      },
      pintnum:function(){//设置导航圆点个数
      	return this.mydata.length
      }
    },
    methods:{
      move(){
        clearTimeout(this.bannertimer);
        let flg = -this.bannerul.offsetLeft <= (this.bannerul.offsetWidth-(this.banner.offsetWidth*2));//ul向右移动的距离是否小于ul本身的宽度;这里复制了第一个li给最后一个做了一个过度;当倒数第二个li到达之后就开
        if (flg) {//动画
          this.bannertimer = setTimeout(this.move,this.bannerDealy);//定时器关键 用setTimer代替的setInterval要在这里将定时器赋值给变量才能清除
          this.bannerul.style.transitionTimingFunction = 'ease';
          this.bannerul.style.transitionDuration = this.transitionDuration + 's';
          this.bannerul.style.left = Math.floor(this.bannerul.offsetLeft - this.banner.offsetWidth) + 'px';
        }else{//到最后一张的时候将动画改成开始时就到达节点 然后将ul位置移到0 立即执行动画
          this.bannerul.style.transitionTimingFunction = 'step-start';
          this.bannerul.style.left = '0px';
          this.move();
        }
        //设置与当前opint对应的下标值index
        this.index = Math.floor(Math.abs(this.bannerul.offsetLeft/this.banner.offsetWidth)+1);
        this.index >= this.mydata.length? this.index = 0:null;
      },
    	poinchangeindex(data){//通过子组件传回的正在点击的值改变轮播图的位置
        clearTimeout(this.bannertimer);//点击清除定时器
        this.index = data;
    		this.$refs.bannerboxdom.style.left = -Math.floor(data * this.$refs.bannerdom.offsetWidth) + 'px';
        this.bannertimer = setTimeout(this.move,this.bannerDealy);//点击结束从新开启定时器
    	},
      touchstart(data){//触摸开始
        clearTimeout(this.bannertimer);//动画开始就先清除定时器
        //记录开始的位置 防止加载不是一整个图片宽度需取整 
        let ceil = Math.ceil((this.bannerul.offsetLeft/this.banner.offsetWidth))*this.banner.offsetWidth;//右划向上取整
        let floor = Math.floor((this.bannerul.offsetLeft/this.banner.offsetWidth))*this.banner.offsetWidth;//左划向下取整
        this.touchstartposition =  data.deltaX>0? ceil : floor;
      },
      touchmove(data){//触摸跟随
        this.bannerul.style.transitionDuration = '0s';//关键：在移动的瞬间应该把动画的事件设置为0 这样才能实时跟着手一起动
        let maxleft = data.deltaX>0&this.touchstartposition>-this.banner.offsetWidth;//判断当向右划且动画开始位置小于一个图片的宽度的时候
        let maxright = data.deltaX<0&(this.touchstartposition)<-this.banner.offsetWidth*(this.mydata.length-1);//当左划且图片到最后一张时
        if (maxleft) { 
          this.touchstartposition = -this.banner.offsetWidth * (this.mydata.length);//将满足条件时ul需跳转的位置保存起来
        };
        if (maxright) {
          this.touchstartposition = 0;//将ul拉回0
        };
        this.bannerul.style.left = this.touchstartposition + data.deltaX +'px';//ul跟随手指滑动
      },
      touchend(data){//触摸结束
        if (Math.abs(data.deltaX)>this.banner.offsetWidth/10) {//手指滑动大于设置的宽度时候切换下一张
          this.bannerul.style.transitionDuration = this.transitionDuration+'s';//恢复动画时间
          if (data.deltaX>0) {//动画结束向右划
            this.touchstartposition +=  this.banner.offsetWidth;//图片位置自增1个单位
            this.index = this.index <= 0? this.mydata.length-1 : this.index-1;//需注意 这里时极限滑动时 指针的位置
          }else{//动画向左划
            this.touchstartposition -=  this.banner.offsetWidth;
            this.index = this.index + 1;//配合下一句也是极限滑动时 指针的位置
            this.index >= this.mydata.length? this.index = 0:null;
          }
        }
        this.bannerul.style.left = this.touchstartposition + 'px';//结束需移动的距离
        this.bannertimer = setTimeout(this.move,this.bannerDealy);//动画结束开启定时器
      }
    }
  }
</script>
<style lang="stylus" scoped>
#Banner
	width 100%
	position relative
	overflow hidden
#BannerBox
	position absolute
	padding 0
	margin 0
	left 0
	transition-property left
</style>