import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import  User        from './module/user'

Vue.use(Vuex)

// 创建 store 实例
export default new Vuex.Store({
    actions,
    modules : {
        User
    }
})