import { createStore } from 'vuex'

// Create a new store instance.
const storeClient = createStore({
  state: {
    userData: {
    }
  },
  mutations: {
    setUserData(state, userData) {
      state.userData = userData;
    }
  },
  actions: {
    setUserData({ commit }, userData) {
      commit('setUserData', userData);
    }
  }
});

export default storeClient;
