<template>
  <view>
    <!-- 选择收获地址的按钮 -->
    <view class="address-choose-box"  v-if="JSON.stringify(address) === '{}'">
      <button chooseaddress="btnChooseAddress" type="primary" size="mini" @click="chooseAddress">请选择收获地址+</button>
    </view>
    <!-- 收货信息盒子 -->
    <view class="address-info-box" v-else @click="chooseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="username">
            收货人：{{ address.userName }}
          </view>
        </view>
        <view class="row1-right">
          <view class="phone">
            电话：{{ address.telNumber }}
          </view>
          <uni-icons type="right" size="16"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">
          收货地址：
        </view>
        <view class="row2-right">
          {{ addstr }}
        </view>
      </view>
    </view>
    <!-- 底部的边框 -->
    <image class="address-border" src="/static/cart_border@2x.png"></image>
  </view>
</template>

<script>
  import { mapState, mapGetters, mapMutations } from 'vuex'
  export default {
    name:"my-address",
    data() {
      return {
        // address: {} // 收货地址
      };
    },
    methods: {
      ...mapMutations('user', ['updateAddress']),
      async chooseAddress() {
        const res = await uni.chooseAddress().catch(err => err)
        console.log(res)
        if (res.errMsg === 'chooseAddress:ok') {
          // this.address = res
          this.updateAddress(res)
        }
        
        if (res.errMsg === 'chooseAddress:fail auth deny' || res.errMsg === 'chooseAddress:fail authorize no response') {
          // 重新授权
          this.reAuth()
        }
      },
      // 让用户重新授权
      async reAuth() {
        const [err, confirmResult] = await uni.showModal({
          content: '检测到您没打开地址授权，是否去设置打开？',
          confirmText: '确认',
          cancelText: '取消'
        })
        // console.log(res);
        if (err) return
        if (confirmResult.cancel) return uni.$showMsg('您取消了地址授权')
        
        if (confirmResult.confirm) return uni.openSetting({
          success(settingResult) {
            if (settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功，请选择地址')
            if (!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权')
          }
        })
      }
    },
    computed: {
      ...mapState('user', ['address']),
      ...mapGetters('user', ['addstr'])
      // 将 addstr 抽取到 vuex中，方便复用
      // addstr() {
      //   if (!this.address.provinceName) return ''
      //   return this.address.provinceName + '-' + this.address.cityName + '-' + this.address.countyName + '-' + this
      //   .address.detailInfo
      // }
    }
  }
</script>

<style lang="less">
  // 收获地址
  .address-choose-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90px;
    .btnChooseAddress {
      
    }
  }
  
  // 收货信息盒子
  .address-info-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 90px;
    font-size: 12px;
    padding: 0 5px;
    .row1 {
      display: flex;
      justify-content: space-between;
      
      .row1-right {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .row2 {
      display: flex;
      align-items: center;
      margin-top: 10px;
      .row2-left {
        white-space: nowrap;
      }
    }
  }
  
  // 底部的边框
  .address-border {
    display: block;
    width: 100%;
    height: 5px;
  }
</style>