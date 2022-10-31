<template>
    <div class="body-color">

        <img class="logo-bbva" src="@/assets/img/bbva-logo.png" alt="Logo banco">
        <h1 class="login">Login</h1>

        <div  class="main-login">
            <div class="form-login">
                <div class="img-user">
                    <img src="@/assets/img/Vector.png" alt="icono usuario">
                </div>
                <form class="formulario" id="formulario">
                    
                    <h2>Email</h2>

                    <input type="text" name="email" v-model="email" placeholder="Email" class="field">
                    <h2>Password</h2>

                    <input type="password" name="password" v-model="pass" placeholder="Password" class="field">
                    <input class="btn-ingresar" type="button" @click="login" value="Ingresar">
                </form>
                
            </div>
            <div class="img-main">
                <img src="@/assets/img/login.png" alt="">
            </div>
        </div>
        <div id="error"> {{error}}</div>
    </div>
</template>

<script>

import { ref } from 'vue'
import { useStore} from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref("")
    const pass = ref("")
    const error = ref("")

    const store = useStore()
    const router = useRouter()

    const login = async () => {
      try {
        await store.dispatch('logIn', {
          email: email.value,
          password: pass.value
        })
        router.push('/entrevistador')
      }
      catch (err) {
        error.value = err.message
      }
    }

    return {
        email,
        pass,
        error,
        login
    }
  },
}

</script>
