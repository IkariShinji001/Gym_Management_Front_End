<template>
  <div class="container">
    <div class="back-button">
      <q-btn flat icon="arrow_back" size="md" @click="$router.go(-1)">
      </q-btn>
    </div>
    <h3 class="container-header">Gói huấn luyện viên cá nhân</h3>
    <div class="packages" v-if="allPtPackages.length > 0">
      <div v-for="(ptPackage, index) in allPtPackages" :key="index" class="card">
        <div v-if="ptPackage.pt.images.length > 0">
          <router-link class="link" :to="`${priceId}/pt-packages/${ptPackage.id}`">
            <img :src="ptPackage.pt.images[0].imageUrl" alt="ptPackage.name" class="card-image" />
          </router-link>
          <div class="card-body">
            <h5>{{ ptPackage.pt.profile.fullName }}</h5>
          </div>
        </div>
      </div>
    </div>

    <div class="next">
      <router-link class="next" :to="{ path: '/checkout', query: { fitnessPriceId: priceId } }">
        <q-icon name="arrow_forward" class="icon">
          <p class="icon-text">Bỏ qua</p>
        </q-icon>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import ptPackageService from "../services/ptPackage.service";
import { useRoute } from "vue-router";

const allPtPackages = ref([]);
const route = useRoute();
const priceId = route.params.priceId;
const typeId = route.params.typeId;

onBeforeMount(async () => {
  allPtPackages.value = await ptPackageService.getAllByTypeId(typeId);
});
</script>

<style scoped>
.container {
  background-color: #EDF2F4;
  min-height: 150vh;
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
  font-size: 30px;
  font-weight: bold;
  padding: 10px;
  margin: 0;
  background-color: #EDF2F4;
  color: #D90429;
}

.packages {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px 10px;
  background-color: #EDF2F4;
  margin: 0 auto;
  border-radius: 5px;
}

.card {
  background-color: #2B2D42;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  margin: 10px;
  padding: 10px;
  text-align: center;
  color: white;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-body {
  padding: 10px;
}

h5 {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.next {
  width: 100%;
  display: flex;
  justify-content: right;
  position: fixed;
  bottom: 60px;
  text-decoration: none;
}

.icon {
  width: 250px;
  height: 70px;
  font-size: 30px;
  color: white;
  display: flex;
  background-color: #D90429;
  align-items: center;
  text-align: center;
  border-radius: 10px;
}

.icon-text {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .packages {
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
</style>
