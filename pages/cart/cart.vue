<template>
  <view class="cart-container" v-if="cart.length !== 0">
    <!-- 收获地址组件 -->
    <my-address></my-address>
    
    <!-- 购物车列表的标题 -->
    <view class="cart-title">
      <!-- 左侧图标 -->
      <uni-icons type="shop" size="18"></uni-icons>
      <!-- 右侧文本 -->
      <text class="cart-title-text">购物车</text>
    </view>

    <!-- 购物车商品信息 -->
    <!-- uni-swipe-action 和 uni-swipe-action-item 实现向左滑动删除 -->
    <!-- options 是删除按钮的配置项 -->
    <uni-swipe-action>
      
      <blcok v-for="goods in cart" :key="goods.goods_id">
        <uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(goods)">
          <my-goods :goods="goods" :showRadio="true" :showNum="true" @radio-change="radioChangeHandler"
            @num-change="numberChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </blcok>

    </uni-swipe-action>
    <!-- <blcok v-for="goods in cart" :key="goods.goods_id">
      <my-goods :goods="goods" :showRadio="true" :showNum="true" @radio-change="radioChangeHandler" @num-change="numberChangeHandler"></my-goods>
    </blcok> -->
    
    <!-- 结算 -->
    <my-settle></my-settle>
    
  </view>
  
  <!-- 空白购物车区域 -->
  <view class="empty-cart" v-else>
    <image class="empty-img" src="/static/cart_empty@2x.png"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        options: [
          {
            text: '删除',
            style:{
              backgroundColor: '#C00000'
            }
          }
        ]
      };
    },
    computed: {
      ...mapState('cart', ['cart'])
    },
    methods: {
      ...mapMutations('cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
      radioChangeHandler(e) {
        console.log(e);
        // const findResult = this.cart.find(item => item.good_id === e.good_id)
        // if (findResult) {
        //   // findResult.goods_state = e.goods_state
        //   // 需要把最新状态更新到 vuex 中

        // }
        this.updateGoodsState(e)
      },
      numberChangeHandler(e) {
        // console.log(e);
        this.updateGoodsCount(e)
      },
      swipeItemClickHandler(goods) {
        // console.log(goods);
        this.removeGoodsById(goods.goods_id)
      }
    }

  }
</script>

<style lang="less">
  page {
    background-color: #fff;
  }
  
  .cart-container {
    padding-bottom: 50px;
  }

  .cart-title {
    display: flex;
    align-items: center;
    height: 40px;
    padding-left: 5px;
    border-bottom: 1px solid #efefef;

    .cart-title-text {
      font-size: 14px;
      margin-left: 10px;
    }
  }
  
  // 空白购物车
  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
    .empty-img {
      width: 90px;
      height: 90px;
    }
    .tip-text {
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>