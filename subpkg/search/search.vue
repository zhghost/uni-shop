<template>
  <view>
    <view class="search-box">
      <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
    </view>

    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResult.length !== 0">
      <view class="sugg-item" v-for="item in searchResult" :key="item.goods_id" @click="gotoDetail(item)">
        <view class="goods-name">
          {{ item.goods_name }}
        </view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>

    <!-- 搜索历史 -->
    <view class="history-box"  v-else>
      <!-- 标题 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean"></uni-icons>
      </view>
      <!-- 列表 -->
      <view class="history-list">
        <uni-tag v-for="(item, index) in histories" :key="index" :text="item" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer: null, // 定时器
        kw: '', // 搜索关键词
        searchResult: [], // 搜索的结果列表
        historyList: [] // 搜索历史
      };
    },
    onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    methods: {
      input(e) {
        clearTimeout(this.timer)
        // 定时器里面回调函数不能用function，而是用箭头函数，因为普通函数和箭头函数的this指向不同，用普通函数的话，this指向的不是vue实例而是定时器本身
        // this.timer = setTimeout(function() {
        this.timer = setTimeout(() => {
          // console.log(e);
          this.kw = e
          this.getSearchList()
        }, 500);
      },
      // 搜索列表
      async getSearchList() {
        // 判断搜索关键词是否为空
        if (this.kw === '') {
          this.searchResult = []
          return
        }
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        console.log(res);
        if (res.meta.status !== 200) return uni.$showMsg()
        this.searchResult = res.message
        
        // 执行搜索列表函数，说明已经输入搜索项，把输入的搜索项存入搜索历史中
        this.saveSearchHistory()
      },
      // 去详情页
      gotoDetail(item) {
        console.log(item);
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      // 搜索历史
      saveSearchHistory () {
        // this.historyList.push(this.kw)
        // 为了保证搜索历史的唯一性（即不重复），需要用到 Set集合
        // Set 集合保证数据的唯一性
        const set = new Set(this.historyList)
        // 存入新的 kw 时，先删除已经存在的 kw
        set.delete(this.kw)
        // 再存入
        set.add(this.kw)
        // console.log(set);
        // 将 Set 集合转换为数组
        this.historyList = Array.from(set)
        
        // 把搜搜历史进行持久化存储
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      // 清除历史记录
      clean () {
        this.historyList = []
        uni.setStorageSync('kw', '[]')
      },
      // 点击搜索历史 tag 跳转到对应的商品列表页面
      gotoGoodsList (kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      }
    },
    computed: {
      histories () {
        // 因为 reverse 会改变原数组，所以把原数组展开后，在内存中生成一个新数组，再反转
        return [...this.historyList].reverse()
      }
    }
  }
</script>

<style lang="less">
  page {
    background-color: #fff;
  }

  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  // 搜索建议列表
  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;

      .goods-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  // 搜索历史
  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        display: inline-block;
        margin-top: 5px;
        margin-right: 5px;
        padding-left: 5px;
        padding-right: 5px;
        background-color: #efefef;
        border-color: #efefef;
        color: #000;
      }

    }
  }
</style>