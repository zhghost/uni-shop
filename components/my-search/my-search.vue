<template>
  <view class="my-search-container" :style="{ 'background-color': bgColor }" @click="searchBoxHandler">
    <view class="my-search-box" :style="{ 'border-radius': radius + 'px' }">
      <uni-icons type="search" size="17s"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-search",
    data() {
      return {
        
      };
    },
    props: {
      bgColor: {
        type: String,
        default: '#C00000'
      },
      // 圆角尺寸
      radius: {
        type: Number,
        default: 18 // px
      }
    },
    methods: {
      searchBoxHandler () {
        // console.log('my-search');
        this.$emit('click')
      }
    }
  }
</script>

<style lang="less">
  .my-search-container {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 10px;
    // background-color: #C00000;
    
    .my-search-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 36px;
      background-color: #fff;
      // border-radius: 18px;
      .placeholder {
        font-size: 15px;
        margin-left: 5px;
      }
    }
  }
</style>