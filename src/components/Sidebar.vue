<template>
  <div class="sidenav hide-bar" id="sidenav">

    <div class="usuario">
      <img src="@/assets/img/user.png" alt="user">
      <h3> ¡Bienvenido {{ name }}!</h3>
      <label> {{ userType }}</label>
    </div>

    <nav v-if="userType=='entrevistador'">
      <router-link to="/entrevistador" class="selected">Lista de candidatos</router-link>
      <router-link to="#">Opciones</router-link>
      <router-link to="#" @click="signOut" class="logout">Cerrar sesión <img src="@/assets/img/logout.png" alt="logout"></router-link>
    </nav>

    <nav v-if="userType=='rrhh'">
      <router-link to="/rrhh" class="selected">Lista de candidatos</router-link>
      <router-link to="/rrhh/agregar">Agregar candidato</router-link>
      <router-link to="#" @click="signOut" class="logout">Cerrar sesión <img src="@/assets/img/logout.png" alt="logout"></router-link>
    </nav>

    <nav v-if="userType=='admin'">
      <div class="accordion">
        <div>
          <input type="checkbox" id="section1" class="accordion__input">
          <label for="section1" class="accordion__label"> <img class="arrow arrow-right" src="@/assets/img/flecha.png" id="section1-arrow"> ADMIN</label>
          <div class="accordion__content">
            <router-link to="/admin"> <img class="flecha" src="@/assets/img/dashboard.png" id="dashboard">  Dashboard</router-link>
            <router-link to="#"><img src="@/assets/img/grafico.png" id="grafico"> Gráfico</router-link>
          </div>
        </div>
        <div>
          <input type="checkbox" id="section2" class="accordion__input">
          <label for="section2" class="accordion__label"> <img class="arrow arrow-right" src="@/assets/img/flecha.png" id="section2-arrow"> RH</label>
          <div class="accordion__content">
            <router-link to="/admin/candidatos"> <img src="@/assets/img/dashboard.png" id="dashboard2"> Lista de candidatos</router-link>
          </div>
        </div>
      </div>
      <router-link to="#" @click="signOut" class="logout">Cerrar sesión <img src="@/assets/img/logout.png" alt="logout"></router-link>
    </nav>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'SidebarVue',
  props: {
    name: String,
    userType: String
  },
  setup() {

    const store = useStore()
    const router = useRouter()

    const signOut = async () => {
      await store.dispatch('logOut')
      router.push('/login')
    }

    return {
      signOut
    }
  }
}
</script>