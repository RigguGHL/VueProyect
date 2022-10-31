<template>
  <table style="width: 100%;">
    <tr>
      <td>
        <h1 class="h1-su">Vista general</h1>
        <router-link class="btn-table hide-mobile" to="/admin/registrar" > <img class="button-icon" src="@/assets/img/add.png" id="add" style="width: 18px;"> &nbsp;Agregar </router-link>
        <br class='show-mobile'>
      </td>
      <td class=""><input @input="search()" v-model="searchString" class="search-bar" placeholder="Buscar candidatos..."></td>
    </tr>
  </table>
  <table class="table">
    <thead>
      <tr>
        <th @click="sort('rh',$event)" class="hide-mobile">RH <img src="@/assets/img/arrow.png" class="arrow toggle-up"></th>
        <th @click="sort('fecha',$event)" class="hide-mobile">fecha <img src="@/assets/img/arrow.png" class="arrow toggle-up"></th>
        <th @click="sort('nombre',$event)">Nombre <img src="@/assets/img/arrow.png" class="arrow toggle-up"></th>
        <th @click="sort('especialidad',$event)" class="hide-mobile">Especialidad <img src="@/assets/img/arrow.png" class="arrow toggle-up"></th>
        <th @click="sort('experiencia',$event)" class="hide-mobile">Experiencia <img src="@/assets/img/arrow.png" class="arrow toggle-up"></th>
        <th @click="sort('encargado',$event)">Encargado <img src="@/assets/img/arrow.png" class="arrow toggle-up"></th>
        <th @click="sort('cv',$event)" class="hide-mobile">CV <img src="@/assets/img/arrow.png" class="arrow toggle-up"></th>
        <th class="hide-mobile">Opciones </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data" :key="item.id">
        <td class='hide-mobile'> {{item.rh.nombre}} </td>
        <td class='hide-mobile'> {{item.fecha}} </td>
        <td> {{item.nombre}} </td>
        <td class='hide-mobile'> {{item.especialidad || 'N/A'}} </td>
        <td class='hide-mobile'> {{item.experiencia || 'N/A'}} </td>
        <td> {{item.entrevistador.nombre}} </td>
        <td  class='hide-mobile'> <a :href="item.cv" target="_blank"> File </a> </td>
        <td>
          <router-link to="#" class='btn-table' @click="deleteData(item.id)"> 
            <img class="button-icon" src="@/assets/img/delete.png" id="Borrar">
          </router-link>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>

import { db } from '@/utils/firebase';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';

export default {

  setup() {
    const data = ref([])
    const originalData = ref([])
    const searchString = ref("")

    //Mostrar los datos de la tabla al montar la vista
    onMounted( async () => {
      data.value = await db.getCollData("candidatos");
      originalData.value = data.value;
    })

    //Funcion para ordenar los datos de la tabla por orden alfabetico
    const sort = (property, e) => {
      const element = e.target.firstElementChild || e.target
      let sortedData = originalData.value;
      if (element.classList.contains('toggle-up')){
        element.classList.replace('toggle-up', 'toggle-down');
        sortedData.sort((a,b) => (a[property] > b[property]) ? 1 : ((b[property] > a[property]) ? -1 : 0));
      }
      else {
        element.classList.replace('toggle-down', 'toggle-up');
        sortedData.sort((a,b) => (b[property] > a[property]) ? 1 : ((a[property] > b[property]) ? -1 : 0));
      }
      data.value = sortedData;
    }

    //Funcion para buscar algun campo dentro de la tabla
    const search = () => {
      const filterData = originalData.value.filter(item => (
          item.nombre.toLowerCase().includes(searchString.value.toLowerCase()) ||
          item.posicion.toLowerCase().includes(searchString.value.toLowerCase()) ||
          item.fecha.toLowerCase().includes(searchString.value.toLowerCase()) ||
          item.estatus.toLowerCase().includes(searchString.value.toLowerCase())
      ));
      data.value = filterData;
    }

    const deleteData = (id) => {
      Swal.fire({
        title: 'Eliminar candidato?',
        text: "No se podrá recuperar el registro",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          db.deleteData("candidatos", id).then(() => {
            Swal.fire(
              'Eliminado!',
              'Canidato eliminado con exito.',
              'success'
            )
          }).catch( err => {
            Swal.fire(
              'Error!',
              'Error al elimnar candidato, intente de nuevo mas tarde.',
              'error'
            )
            console.error(err)
          });
        }
      })
    }

    return {
      data,
      searchString,
      sort,
      search,
      deleteData
    }
  }
}

</script>
