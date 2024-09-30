<template>
  <div class="container">
    <div class="back-button">
      <q-btn flat icon="arrow_back" size="md" @click="$router.go(-1)">
      </q-btn>
    </div>
    <h3 class="container-header">Dịch vụ</h3>
    <div class="types">
      <div v-for="(type, index) in types" :key="index">
        <div class="card">
          <router-link class="link" :to="`service-package/${type.id}`">
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
  background-color: #EDF2F4;
  min-height: 120vh;
  padding: 10px;

}

.back {
  width: 100%;
  display: flex;
  justify-content: right;
  position: fixed;
  top: 0px;
  right: 355px;
  text-decoration: none;
}

.back-button {
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 1;
  background-color: #D90429;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 5px;
}

/* 
.back-button {
  background-color: #D90429;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
  /* border-radius: 5px; 
}
 */

.back-button:hover {
  background-color: #B0021F;
}

.container-header {
  text-align: center;
  font-size: 30px !important;
  font-weight: bold;
  padding: 10px;
  margin: 0;
  background-color: #edf2f4;
  color: #D90429;
}



.types {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px 10px;
  text-align: justify;
  background-color: #EDF2F4;
  width: 100%;
  margin: 0 auto;
  border-radius: 5px;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

h5 {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

@media (max-width: 768px) {
  .types {
    grid-template-columns: 1fr;
    grid-gap: 5px;
  }

  .container-header {
    font-size: 24px;
  }

  .card-body h5 {
    font-size: 18px;
  }
}

div.card {
  background-color: #2B2D42;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  margin: 10px;
  padding: 10px;
  text-align: center;
  color: white;
}
</style>
