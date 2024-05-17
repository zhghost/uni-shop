import {
  mapGetters
} from 'vuex'

export default {
  computed: {
    // ...mapGetters('cart', ['total'])
    ...mapGetters('cart', ['checkedCount'])
  },
  onShow() {
    this.setBadge()
  },
  watch: {
    // total() {
    //   this.setBadge()
    // }
    checkedCount() {
      this.setBadge()
    }
  },
  methods: {
    setBadge() {
      // if (this.total > 0) {
      //   uni.setTabBarBadge({
      //     index: 2,
      //     text: this.total + '' // text 只能是字符串
      //   })
      // } else {
      //   uni.removeTabBarBadge({
      //     index: 2
      //   })
      // }
      if (this.checkedCount > 0) {
        uni.setTabBarBadge({
          index: 2,
          text: this.checkedCount + '' // text 只能是字符串
        })
      } else {
        uni.removeTabBarBadge({
          index: 2
        })
      }
    }
  }
}