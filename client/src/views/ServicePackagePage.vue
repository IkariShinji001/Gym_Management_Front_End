<template>
  <div class="container">
    <div v-for="(fitnessPackage, index) in fitnessPackages" :key="index">
      <q-card class="my-card">
          <router-link :to="`types/${typeId}/fitness-package/${fitnessPackage.id}`">
          <q-img :src="fitnessPackage.coverImageUrl">
            <div class="absolute-bottom text-h6 text-center">
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

<style>
.container {
  background-color: #edf2f4;
  min-height: 150vh;
  margin: 0;

}
</style>
