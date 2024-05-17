<template>
  <view>
    <!-- 使用自定义的搜索组件 -->
    <!-- <my-search :bgColor="'pink'" :radius="3"></my-search> -->
    <!-- 自定义组件并未实现 Click 事件，所以这里@click 并不会起作用 -->
    <!-- 自定义组件的最外层是 view， view 实现了 click 事件，在view的click事件方法中 调用this.$emit('自定义事件名')，即可触发这里的自定义事件。例如：click，切记这里的 click 不是平常所用的点击事件，而是自定义的事件，可以任意起名 -->
    <my-search @click="gotoSearch"></my-search>

    <!-- 主体区域 -->
    <view class="scroll-view-container">
      <!-- 左 -->
      <scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh + 'px'}">
        <block v-for="(item, index) in cateList" :key="item.cat_id">
          <!-- 一级分类 -->
          <view :class="['left-scroll-view-item', index === active ? 'active' : '']" @click="activeChange(index)">
            {{ item.cat_name }}</view>
        </block>
      </scroll-view>

      <!-- 右 -->
      <scroll-view scroll-y="true" :style="{height: wh + 'px'}">
        <!-- <scroll-view scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="scrollTop"> -->
        <view class="cate-lv2" v-for="item2 in cateLevel2" :key="item2.cat_id">
          <!-- 二级分类 -->
          <view class="cate-lv2-title">
            /{{ item2.cat_name }}/
          </view>
          <!-- 三级分类 -->
          <view class="cate-lv3-list">
            <!-- 三级分类的 item 项 -->
            <view class="cate-lv3-item" v-for="item3 in item2.children" :key="item2.cat_id"
              @click="gotoGoodsList(item3)">
              <!-- 三级分类的图片 -->
              <image :src="item3.cat_icon"></image>
              <!-- 三级分类的文本 -->
              <text>{{ item3.cat_name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>

    </view>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        wh: 0, // 当前设备可用的高度
        cateList: [],
        active: 0, // cateList 激活项
        cateLevel2: [], // cateList 的 二级分类
        // scrollTop: 0 // 点击左侧的一级分类时，右侧并不一定会滚动到顶部，scroll-view 有 scroll-top（设置竖向滚动条位置） 属性，每次点击左侧的一级分类时，把 :scroll-top="scrollTop" 中的 scrollTop 设置为0即可，但是如果设置为0，但是如果赋值前后scrollTop的值不变，则不会对滚动条位置重置，因此需改变scrollTop的值this.scrollTop = this.scrollTop === 0 ? 1 : 0，1px肉眼分不出来（PS：新组件已经解决了这个 bug，因此不需要设置scrollTop）
      };
    },
    async onLoad() {
      // 获取系统信息，系统信息里有 可使用窗口高度 windowHeight
      const sysInfo = await uni.getSystemInfo()
      this.wh = sysInfo.windowHeight - 50 // 搜索栏高度 50
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        // console.log(res);
        if (res.meta.status !== 200) return uni.$showMsg()

        // 一级分类
        this.cateList = res.message
        // 二级分类（默认）
        this.cateLevel2 = res.message[0].children
      },
      // 改变一级分类
      activeChange(index) {
        this.active = index

        // 重新为二级分类赋值
        this.cateLevel2 = this.cateList[index].children

        // this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      // 跳转到商品列表页面
      gotoGoodsList(item) {
        console.log(item);
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
        })
      },
      gotoSearch() {
        // console.log('cate');
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    }
  }
</script>

<style lang="less">
  page {
    background-color: #fff;
  }

  .scroll-view-container {
    display: flex;

    // 左
    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        background-color: #f7f7f7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;

        &.active {
          position: relative;
          background-color: #fff;

          &::before {
            position: absolute;
            content: '';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #C00000;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
        }
      }
    }

    // 右
    .cate-lv2-title {
      font-size: 12px;
      font-weight: 700;
      text-align: center;
      padding: 15px 0;
    }

    .cate-lv3-list {
      display: flex;
      flex-wrap: wrap;

      .cate-lv3-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 33.33%;
        margin-bottom: 10px;

        image {
          width: 60px;
          height: 60px;
        }

        text {
          font-size: 12px;
        }
      }
    }
  }
</style>