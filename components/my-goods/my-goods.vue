<template>
  <view class="goods-item">
    <!-- 左 -->
    <view class="goods-item-left">
      <radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler"></radio>
      <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
    </view>
    <!-- 右 -->
    <view class="goods-item-right">
      <view class="goods-name">
        {{ goods.goods_name }}
      </view>
      <view class="goods-info-box">
        <view class="goods-price">
          ￥ {{ (+goods.goods_price).toFixed(2) }}
        </view>
        <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-goods",
    props: {
      goods: {
        type: Object,
        default: () => {
          return {}
        }
      },
      // 是否展示选择框
      showRadio: {
        type: Boolean,
        default: false
      },
      // 是否显示数字框
      showNum: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 默认图片（有些商品的图片有可能失效了，为了不显示空白，用默认图片替代）
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    methods: {
      radioClickHandler() {
        this.$emit('radio-change', {
          goods_id: this.goods.goods_id,
          goods_state: !this.goods.goods_state
        })
      },
      numChangeHandler (val) {
        // console.log(val);
        this.$emit('num-change', {
          goods_id: this.goods.goods_id,
          goods_count: +val
        })
      }
    }
  }
</script>

<style lang="less">
  .goods-item {
    // width: 750rpx;
    // box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #efefef;
    .goods-item-left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .goods-pic {
        display: block;
        width: 100px;
        height: 100px;
        margin-right: 5px;
      }
    }
    .goods-item-right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      .goods-name {
        font-size: 13px;
      }
      .goods-info-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .goods-price {
          color: #C00000;
          font-size: 16px;
        }
      }
    }
  }
</style>