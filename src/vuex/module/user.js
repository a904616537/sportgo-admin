import * as types  from '../mutation-types'
import Cookie      from 'vue-cookie';

// initial state
const state = {
	isLogin  : Cookie.get('user-token') != null,
	user     : Cookie.get('user'),
	token    : Cookie.get('user-token')
}

const actions = {
	onLogin({commit}, data) {
		commit(types.USER_LOGIN, data);
	},
	Logout({commit}, data) {
		commit(types.USER_LOGOUT, data);
	},
}

// mutations
const mutations = {
	[types.USER_LOGIN] (state, data) {
		state.user     = data.user;
		state.token    = data.token;
		Cookie.set('user-token', data.token)
		Cookie.set('user', JSON.stringify(data.user))
		state.isLogin  = true;
	},
	[types.USER_LOGOUT] (state, data) {
		state.isLogin = false;
		state.token   = '';
		state.user    = {};
		Cookie.delete('user');
		Cookie.delete('user-token');
	}
}

export default {
	state,
	actions,
	mutations
}