<template>
  <view>
    <view class="goods-list">
      <!-- <block v-for="goods in goodsList" :key="goods.goods_id"> -->
      <!-- block 不支持绑定 @click 事件 -->
      <view v-for="goods in goodsList" :key="goods.goods_id" @click="gotoDetail(goods)">
        <my-goods :goods="goods" ></my-goods>
      </view>
      <!-- </block> -->
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          // 从不同地方跳转到 goods_list 页面携带的参数不同，
          // 从搜索历史、首页楼层处携带 query，cate页面三级分类携带 cid
          query: '', // 查询关键词
          cid: '', // 分类id
          pagenum: 1, // 页数（第几页）
          pagesize: 10 // 每页展示几条数据
        },
        goodsList: [],
        total: 0,
        isloading: false // 节流阀
      };
    },
    onLoad(options) {
      // console.log(options);
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      
      this.getGoodsList()
    },
    methods: {
      async getGoodsList (cb) {
        // 打开节流阀
        this.isloading = true
        const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 请求结束后，关闭节流阀
        this.isloading = false
        // 数据请求完毕后，关闭下拉刷新
        cb && cb()
        
        console.log(res);
        if (res.meta.status !== 200) return uni.$showMsg()
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },
      
      gotoDetail (goods) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
        })
      }
    },
    onReachBottom () {
      // 先判断数据是否加载完毕，再判断节流阀
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
      // 再判断节流阀
      if (this.isloading) return 
      
      // 让页码值自增 1
      this.queryObj.pagenum++
      // 获取下一页数据
      this.getGoodsList()
    },
    onPullDownRefresh() {
      // 1. 重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.isloading = false
      this.goodsList = []
      
      // 2. 重新发起请求
      this.getGoodsList(() => uni.stopPullDownRefresh())
    }
  }
</script>

<style lang="less">
  page {
    background-color: #fff;
  }
  
</style>
