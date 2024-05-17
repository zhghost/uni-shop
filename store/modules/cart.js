export default {
  namespaced: true,
  // state: () => ({}) // 两种写法都可以
  state() {
    return {
      // 每个商品信息对象，都包含如下 6 个属性
      // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
      cart: JSON.parse(uni.getStorageSync('cart') || '[]')
    }
  },
  mutations: {
    // 添加商品到购物车
    addToCart(state, goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)

      if (!findResult) {
        state.cart.push(goods)
      } else {
        findResult.goods_count++
      }

      this.commit('cart/saveToStorage')
    },
    // 本地持久化存储
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新购物车商品选中状态
    updateGoodsState(state, goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_state = goods.goods_state
        // 持久化
        this.commit('cart/saveToStorage')
      }
    },
    // 更新购物车中商品数量
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_count = goods.goods_count
        // 持久化
        this.commit('cart/saveToStorage')
      }
    },
    // 根据 id 删除购物车中对应的商品
    removeGoodsById(state, goods_id) {
      state.cart = state.cart.filter(item => item.goods_id !== goods_id)
      // 持久化
      this.commit('cart/saveToStorage')
    },
    // 点击全选按钮实现购物车按钮的全选和全不选
    updateAllGoodsState(state, newState) {
      state.cart.forEach(item => item.goods_state = newState)
      // 持久化
      this.commit('cart/saveToStorage')
    }
  },
  getters: {
    // 商品总数量
    total(state) {
      return state.cart.reduce((sum, item) => sum + item.goods_count, 0)
    },
    // 选中商品的总数量
    checkedCount(state) {
      return state.cart.filter(item => item.goods_state).reduce((sum, i) => sum + i.goods_count, 0)
    },
    // 选中商品的总价格
    checkGoodsAmount(state) {
      return state.cart.filter(item => item.goods_state).reduce((sum, i) => sum + i.goods_price * i.goods_count, 0).toFixed(2)
    }
  }
}