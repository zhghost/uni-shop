import { createStore } from 'vuex'
import cart from './modules/cart'
import user from './modules/user'

export default createStore({
  modules: {
    cart,
    user
  }
})