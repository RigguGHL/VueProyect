<template>
    <div>
        <h1 class="nombre-candidato" > {{name + ', ' + posicion}}</h1>
        <form class="form-entrevistador">
            <p>Experiencia</p>
            <input class="field-entrevistador" type="text" name="experiencia" v-model="experiencia" placeholder="Experiencia">
            <p>Tecnologias</p>
            <input class="field-entrevistador" type="text" name="tecnologias" v-model="tecnologias" placeholder="Tecnologias">
            <p>Nivel del candidato</p>
            <select class="field-entrevistador" name="nivel-candidato" v-model="nivelCandidato" >
                <!-- Opciones de la lista -->
                <option hidden selected value="default">Selecciona un nivel</option> <!-- Opción por defecto -->
                <option value="Junior">Junior</option>
                <option value="Semisenior">Semisenior</option> 
                <option value="Senior">Senior</option>
            </select>
            <p>¿Cumple con la vacante?</p>
            <input checked class="radio-check" type="radio"  v-model="cumpleCheck" value=true>Si
            <input class="radio-check" type="radio" v-model="cumpleCheck" value=false>No
            <p> 
                Observaciones
            </p>
            <textarea class="txtarea-observaciones" name="observaciones" v-model="observaciones" cols="80" rows="8" placeholder="Observaciones y comentarios">
            </textarea>
            <br>    
            <div class="div-resultados">
            <button class= "btn-color-blue-res btn-resultados" type="button" @click="uploadData"> Subir Resultados </button>
            </div>
        </form>
    </div>
</template>

<script>

import { ref } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { db } from '@/utils/firebase';
import Swal from 'sweetalert2'
import { computed } from '@vue/reactivity';

export default {
  setup() {
    const experiencia = ref("")
    const tecnologias = ref("")
    const nivelCandidato = ref("default")
    const cumpleCheck = ref(true)
    const observaciones = ref("")

    const router = useRouter();
    const route = useRoute();

    // Agrega los resultados de entrevista a la base de datos y cambia el estatus del candidato a evaluado
    const uploadData = async () => {

        if (experiencia.value == "" || tecnologias.value == "" || nivelCandidato.value == "default" || observaciones.value == ""){
            Swal.fire(
                'Campos invalidos',
                'Completa todos los campos antes de enviar',
                'warning'
            )
            return
        }

        console.log(route.query)
        let data = {
            experiencia: experiencia.value,
            tecnologias: tecnologias.value,
            nivel: nivelCandidato.value,
            cumple: cumpleCheck.value,
            comentarios: observaciones.value,
            candidato: {id: route.query.id, nombre: route.query.name}
        }

        
        try {
            await db.uploadData("entrevistas", data)
            await db.updateData("candidatos", route.query.id, {estatus: "Evaluado"})
            Swal.fire(
                'Evaluación completada',
                'Se ha evaluado correctamente.',
                'success'
            ).then(() => {
                router.push('/entrevistador');
            });
        } catch (error) {
            console.error( error);
            Swal.fire(
                'Error al evaluar',
                'A ocurrido un error, intenta de nuevo mas tarde.',
                'error'
            )
        }
    }

    return {
        name: computed(() => route.query.name),
        posicion: computed(() => route.query.position),
        experiencia,
        tecnologias,
        nivelCandidato,
        cumpleCheck,
        observaciones,
        uploadData
    }
  }
}

</script>