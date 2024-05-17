<template>
  <view>
    <!-- 搜索 -->
    <view class="search-box">
      <my-search @click="gotoSearch"></my-search>
    </view>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="item in swiperList" :key="item.goods_id">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>

    <!-- 分类导航区域 -->
    <view class="nav-list">
      <view class="nav-item" v-for="item in navList" :key="item.navigator_url" @click="navClickHandler(item)">
        <image class="nav-img" :src="item.image_src" mode=""></image>
      </view>
    </view>

    <!-- 楼层区域 -->
    <view class="floor-list">
      <!-- 楼层 item -->
      <view class="floor-item" v-for="item in floorList" :key="item.floor_title.name">
        <!-- 楼层标题 -->
        <image class="floor-title" :src="item.floor_title.image_src" mode=""></image>
        <!-- 楼层图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}"
              mode="widthFix"></image>
          </navigator>
          <!-- 右侧 -->
          <view class="right-img-box">
            <navigator class="right-img-item" v-for="(item2, index) in item.product_list" :key="item2.name"
              :url="item2.url">
              <view v-if="index !== 0">
                <image :src="item2.image_src" :style="{width: item2.image_width + 'rpx'}" mode="widthFix"></image>
              </view>
            </navigator>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        swiperList: [], // 轮播图数据列表
        navList: [], // 分类导航数据列表
        floorList: [] // 楼层数据列表
      };
    },
    onLoad() {
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    methods: {
      // 轮播图数据
      async getSwiperList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')
        // console.log(res);
        // 请求失败
        // toast 弹窗已经定义在 main.js中
        // if (res.meta.status !== 200) {
        //   return uni.showToast({
        //     title: '数据请求失败！',
        //     duration: 1500,
        //     icon: 'none'
        //   })
        // }
        // 
        if (res.meta.status !== 200) return uni.$showMsg()
        // 请求成功
        this.swiperList = res.message
      },
      // 导航栏数据
      async getNavList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')
        // console.log(res);
        if (res.meta.status !== 200) return uni.$showMsg()
        this.navList = res.message
      },
      // 楼层数据
      async getFloorList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata')
        // console.log(res);
        if (res.meta.status !== 200) return uni.$showMsg()

        // 先对返回的数据进行处理（因为返回的数据中路径与自己定义的不同
        // 以自己定义的为准进行拼接
        res.message.forEach(floor => {
          floor.product_list.forEach(item => {
            // 给每一个条目添加 url 属性，用自定义的 url 属性取代
            // 返回的 navigator_url
            item.url = '/subpkg/goods_list/goods_list?' + item.navigator_url.split('?')[1]
          })
        })

        this.floorList = res.message
      },
      navClickHandler(item) {
        console.log(item);
        if (item.name === '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      gotoSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    }

  }
</script>

<style lang="less">
  // 搜索
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  // 分类导航
  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15rpx 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  // 楼层区域
  .floor-title {
    height: 60rpx;
    width: 100%;
  }

  .floor-img-box {
    display: flex;
    padding-left: 10rpx;

    .right-img-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
  }
</style>