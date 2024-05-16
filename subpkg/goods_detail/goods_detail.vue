<template>
  <!-- <view> -->
  <!-- 因为 goods_info 是 {}，当加载的时候，所渲染的属性有可能会有闪缩（undefined），所以用 v-if -->
  <view class="goods-detail-container" v-if="goods_info.goods_name">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, index) in goods_info.pics" :key="item.pics_id">
        <image :src="item.pics_big" @click="priview(index)"></image>
      </swiper-item>
    </swiper>

    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">
        ￥ {{ goods_info.goods_price }}
      </view>

      <view class="goods-info-body">
        <!-- 左 -->
        <view class="goods-name">
          {{ goods_info.goods_name }}
        </view>
        <!-- 右 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>

      <!-- 运费 -->
      <view class="freight">
        <text>快递：免运费</text>
      </view>
    </view>

    <!-- 商品详情 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>

    <!-- 商品导航 -->
    <view class="goods-nav">
      <uni-goods-nav :options="options" :fill="true" :button-group="buttonGroup" @click="onClick"
        @buttonClick="buttonClick" />
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        goods_info: {}, // 商品详情
        // 左侧店铺、购物车图标
        options: [{
          icon: 'shop',
          text: '店铺',
          infoBackgroundColor: '#007aff',
          infoColor: "#f5f5f5"
        }, {
          icon: 'cart',
          text: '购物车',
          info: 2
        }],
        // 右侧加入购物车、立即购买图标
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: 'linear-gradient(90deg, #FFCD1E, #FF8A18)',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
            color: '#fff'
          }
        ]
      };
    },
    onLoad(options) {
      // console.log(options);
      const goods_id = options.goods_id
      this.getGoodsDetail(goods_id)
    },
    methods: {
      async getGoodsDetail(goods_id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id
        })
        console.log(res);
        if (res.meta.status !== 200) return uni.$showMsg()

        // 商品详情区域的图片下方有空白 使用 display: block;
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display: block;"')
          .replace(/webp/g, 'jpg')

        this.goods_info = res.message
      },
      // 轮播图预览
      priview(index) {
        uni.previewImage({
          current: index,
          // urls 是多张轮播图 url 地址组成的数组 ['https://xxx', 'https://yyy', 'https://zzz', ...]
          urls: this.goods_info.pics.map(item => item.pics_big)
        })
      },
      // 左侧店铺、购物车图标的点击事件
      onClick (e) {
        console.log(e);
        if (e.content.text === '购物车') {
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      // 右侧加入购物车、立即购买图标的点击事件
      buttonClick (e) {
        
      }
    }
  }
</script>

<style lang="less">
  page {
    background-color: #fff;
  }
  
  .goods-detail-container {
    padding-bottom: 50px;
  }

  swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  // 商品信息区域
  .goods-info-box {
    padding: 10px;
    padding-right: 0;

    // 商品价格
    .price {
      font-size: 18px;
      color: #C00000;
      margin: 10px 0;
    }

    // 主体
    .goods-info-body {
      display: flex;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
        margin-right: 10px;
      }

      .favi {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-left: 1px solid #efefef;
        width: 120px;
        font-size: 12px;
        color: gray;

      }
    }

    // 运费
    .freight {
      font-size: 12px;
      color: gray;
      margin: 10px 0;
    }
  }
  
  // 商品导航
  .goods-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>