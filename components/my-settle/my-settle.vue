<template>
  <view class="my-settle-container">
    <!-- 1. 全选 -->
    <label class="radio" @click="changeAllState">
      <radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
    </label>
    <!-- 2. 合计 -->
    <view class="amount-box">
      合计：<text class="amount">￥ {{ checkGoodsAmount }}</text>
    </view>
    <!-- 3. 结算 -->
    <view class="btn-settle">
      结算（{{ checkedCount }}）
    </view>
  </view>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name:"my-settle",
    data() {
      return {
        
      };
    },
    computed: {
      ...mapGetters('cart', ['checkedCount', 'total', 'checkGoodsAmount']),
      isFullCheck() {
        return this.checkedCount === this.total
      }
    },
    methods: {
      ...mapMutations('cart', ['updateAllGoodsState']),
      changeAllState () {
        this.updateAllGoodsState(!this.isFullCheck)
      }
    }
  }
</script>

<style lang="less">
  .my-settle-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 50px;
    width: 100%;
    background-color: white;
    font-size: 14px;
    padding-left: 5px;
    
    .radio {
      display: flex;
      align-items: center;
    }
    .amount-box {
      .amount {
        color: #c00000;
        font-weight: 700;
      }
    }
    .btn-settle {
      background-color: #c00000;
      height: 50px;
      color: white;
      line-height: 50px;
      padding: 0 10px;
      min-width: 100px;
      text-align: center;
    }
  }
</style>