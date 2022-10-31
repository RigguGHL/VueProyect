<template>
    <div>
        <h1 class="nombre-candidato" > Agregar candidato</h1>
        <form class="form-entrevistador">
            <p>Nombre</p>
            <input class="field-rh" type="text" name="nombre" v-model="nombre" placeholder="Nombre">
            <p>Posición</p>
            <input class="field-rh" type="text" name="posicion" v-model="posicion" placeholder="Posición">
            <p>Entrevistador</p>
            <input class="field-rh" type="text" name="entrevistador" v-model="entrevistador" placeholder="Entrevistador">
            <p>Fecha entrevista</p>
            <input class="field-rh" type="text" name="fecha" v-model="fecha" placeholder="Fecha">
            <br>
            <br>
            <label for="file-upload" class="btn-color-blue btn-cv">
                Curriculum Vitae
            </label>
            <input id="file-upload"  type="file" name="file" accept="application/pdf">
            
            <br>
            <br>
            <button class= "btn-color-blue btn-guardar" type="button" @click="uploadData"> Agregar </button>
        </form>
    </div>
</template>

<script>

import { ref } from 'vue'
import { useRouter } from "vue-router";
import { db } from '@/utils/firebase';
import Swal from 'sweetalert2'
import { useStore } from 'vuex';

export default {
  setup() {
    const nombre = ref("")
    const posicion = ref("")
    const entrevistador = ref("")
    const fecha = ref("")

    const router = useRouter();
    const store = useStore()

    // Agrega un candidato con estatus por evaluar asignado al usuario actual (Por ahora asigna un cv default)
    const uploadData = async () => {

        if (nombre.value == "" || posicion.value == "" || entrevistador.value == "" || fecha.value == ""){
            Swal.fire(
                'Campos invalidos',
                'Completa todos los campos antes de enviar',
                'warning'
            )
            return
        }

        let data = {
            nombre: nombre.value,
            estatus: "Por evaluar",
            posicion: posicion.value,
            entrevistador: {nombre: entrevistador.value},
            fecha: fecha.value,
            rh: {
                id: store.getters.user.data.id,
                nombre: store.getters.user.data.name
            },
            cv: "https://drive.google.com/file/d/1YM-2mReeibjY2vzREEQuobDZGSfpSrtK/view?usp=drivesdk"
        }

        
        try {
            await db.uploadData("candidatos", data)
            Swal.fire(
                'Candidato agregado',
                'Se ha agregado el candidato.',
                'success'
            ).then(() => {
                router.push('/rrhh');
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
        nombre,
        posicion,
        entrevistador,
        fecha,
        uploadData
    }
  }
}

</script>