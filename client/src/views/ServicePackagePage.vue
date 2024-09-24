<template>
  <div class="container">
    <div class="back-button">
      <q-btn flat icon="arrow_back" size="md" @click="$router.go(-1)">
      </q-btn>
    </div>
    <h3 class="container-header">Gói tập</h3>
    <div class="cards">
      <div v-for="(fitnessPackage, index) in fitnessPackages" :key="index">
        <q-card class="my-card">
          <router-link :to="`types/${typeId}/fitness-package/${fitnessPackage.id}`">
            <q-img :src="fitnessPackage.coverImageUrl">
              <div class="absolute-bottom text-h5 text-center">
                {{ fitnessPackage.servicePackage.name }}
              </div>
            </q-img>
          </router-link>
          <q-card-section>
            {{ fitnessPackage.servicePackage.description }}
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import FitnessPackageService from "../services/fitnessPackage.service";

const fitnessPackages = ref([]);
const route = useRoute();
const typeId = ref(route.params.typeId);
onBeforeMount(async () => {
  fitnessPackages.value = await FitnessPackageService.getByType(typeId.value);
});
</script>

<style scoped>
.container {
  background-color: #EDF2F4;
  min-height: 120vh;
  padding: 10px;
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

.container-header {
  text-align: center;
  font-size: 35px !important;
  font-weight: bold;
  padding-top: 20px;
  margin: 0;
  color: #D90429;
}

.my-card {
  background-color: #2B2D42;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  margin: 10px;
  color: white;
  max-width: 300px;
  text-align: center;
}

.my-card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.3);
}

.q-img {
  border-radius: 5px 5px 0 0;
  height: 200px;
  object-fit: cover;
}

.q-card-section {
  padding: 15px;
  font-size: 16px;
  line-height: 1.5;
  text-align: justify;
  color: #000 !important;
}

.text-h6 {
  font-size: 20px;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 10px;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .my-card {
    max-width: 100%;
    margin: 10px 0;
  }

  .q-card-section {
    font-size: 14px;
  }

  .text-h6 {
    font-size: 18px;
  }
}
</style>
