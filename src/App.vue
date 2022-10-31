<template>
  <div class="dark-back" id="dark-back">
  </div>

  <div class="wrapper" v-if="$route.name != 'login'">

    <HeaderVue></HeaderVue>

    <div class="box">
      <SidebarVue :name="user.data?.name" :userType="user.data?.userType" ></SidebarVue>
      <div class="content">
        <router-view/>
      </div>
    </div>

  </div>

  <router-view v-if="$route.name == 'login'"/>
</template>

<script>
import HeaderVue from './components/Header.vue';
import SidebarVue from './components/Sidebar.vue';

import { useStore} from "vuex";
import { computed } from "vue";
import { auth, db } from "@/utils/firebase"

export default {
  setup() {
    const store = useStore()

    auth.onAuthStateChanged(async user => {
      store.dispatch("fetchUser", user ? await db.getDocData("usuarios", user.uid): null);
    });

    return {
      user: computed(() => store.getters.user)
    }

  },

  components: {
    HeaderVue,
    SidebarVue,
  }
}
// Necesario porque SweetAlert cambia este valor con sus librerias
document.body.style.cssText = 'height: 100%!important'
</script>

<style lang="scss">
#app {
  height: 100%;
}

</style>
