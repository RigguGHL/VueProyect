<template>
    
    <div>
        <h1>Registro candidatos</h1>
        <form class="form-entrevistador">
            <p>Tipo de usuario</p>
            <select class="field-entrevistador" name="nivel-candidato" v-model="userType" >
                <!-- Opciones de la lista -->
                <option hidden selected value="default">Selecciona un tipo de usuario</option>
                <option value="entrevistador">Entrevistador</option>
                <option value="rrhh">Recursos Humanos</option>
            </select>
            <p>Nombre</p>
            <input class="field-entrevistador" type="text" v-model="name" placeholder="Nombre">
            <p>Correo</p>
            <input class="field-entrevistador" type="text" v-model="email" placeholder="Correo">

            <br><br>
            <button class= "btn-color-blue btn-guardar" type="button" @click="uploadData" > Guardar</button>
        </form>
    </div>
</template>

<script>

import { ref } from 'vue'
import { useRouter } from "vue-router";
import { auth, db } from '@/utils/firebase';
import Swal from 'sweetalert2'

export default {
  setup() {
    const userType = ref("default")
    const name = ref("")
    const email = ref("")

    const router = useRouter();

    // Funcion que crea un nuevo usuario y guarda sus datos (por ahora la contraseña la manda en consola pero deberia mandar un email con ella)
    const uploadData = async () => {

        if (userType.value == "default" || name.value == "" || email.value == ""){
            Swal.fire(
                'Campos invalidos',
                'Completa todos los campos antes de enviar',
                'warning'
            )
            return
        }

        const pass = Math.random().toString(36).slice(2, 8)

        const data = {
            email: email.value,
            name: name.value,
            userType: userType.value
        }

        
        try {
            const originalUser = auth.currentUser
            const res = await auth.createUserWithEmailAndPassword(email.value, pass)
            await auth.updateCurrentUser(originalUser)
            console.log(pass)
            await db.uploadData("usuarios", data, res.user.uid)
            Swal.fire(
                'Usuario agregado',
                'Se ha agregado el usuario correctamente.',
                'success'
            ).then(() => {
                router.push('/admin');
            });
        } catch (error) {
            console.error( error);
            Swal.fire(
                'Error al agregar',
                'A ocurrido un error, intenta de nuevo mas tarde.',
                'error'
            )
        }
    }

    return {
        userType,
        name,
        email,
        uploadData
    }
  }
}

</script>