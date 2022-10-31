import { createStore } from 'vuex'
import { auth } from '@/utils/firebase.js'

export default createStore({

  state: {
    user: {
      loggedIn: false,
      data: null
    }
  },

  getters: {
    user(state){
      return state.user
    }
  },

  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    }
  },

  actions: {
    async register(context, { email, password, name}){
      const response = await auth.createUserWithEmailAndPassword(email, password)
      if (response) {
          context.commit('SET_USER', response.user)
          response.user.updateProfile({displayName: name})
      } else {
          throw new Error('Error al registrar usuario')
      }
    },

    async logIn(context, { email, password }){
      const response = await auth.signInWithEmailAndPassword(email, password)
      //const userData = await db.getDocData("users",response.user)
      if (response) {
          context.commit('SET_USER', response.user)
      } else {
          throw new Error('Error al iniciar sesión')
      }
    },

    async logOut(context){
        await auth.signOut()
        context.commit('SET_USER', null)
    },

    async fetchUser(context ,user) {
      context.commit("SET_LOGGED_IN", user !== null);
      context.commit("SET_USER", user);
    }
  },

  modules: {
  }

})
