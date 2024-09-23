<template>
  <div class="container">
    <h1 class="container-header">Fitness Package</h1>
    <div class="types">
      <div v-for="(type, index) in types" :key="index">
        <div class="card">     
          <router-link :to="`service-package/${type.id}`">
            <img src="../assets/gymType.png" class="card-image" />
          </router-link>
          <div class="card-body">
            <h5>{{ type.type }}</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import TypeService from "../services/type.service";

const types = ref([]);

onBeforeMount(async () => {
  types.value = await TypeService.getAllType();
});
</script>

<style scoped>
.container {
  background-color: #edf2f4;
  min-height: 150vh;
 
}
.container-header {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  padding-top: 20px;
  margin: 0;
}

.types {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  text-align: justify;
  background-color: white;
  width: 95%;
  margin: 0 auto;
  border-radius: 10px;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
