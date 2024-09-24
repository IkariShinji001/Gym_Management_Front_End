<template>
  <div class="container">
    <div class="back-button">
      <q-btn flat icon="arrow_back" size="md" @click="$router.go(-1)">
      </q-btn>
    </div>
    <h4 class="container-header">Gói huấn luyện viên cá nhân</h4>
    <div class="packages" v-if="allPtPackages.length > 0">
      <div class="package-item" v-for="(ptPackage, index) in allPtPackages" :key="index">
        <div class="card">
          <div v-if="ptPackage.pt.images.length > 0">
            <router-link class="link" :to="`${priceId}/pt-packages/${ptPackage.id}`">
              <img :src="ptPackage.pt.images[0].imageUrl" alt="ptPackage.name" class="package-img" />
            </router-link>
            <div class="card-body">
              <h5>{{ ptPackage.pt.profile.fullName }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="next">
      <router-link class="next" to="/">
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

onBeforeMount(async () => {
  allPtPackages.value = await ptPackageService.getAll();
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
  font-size: 28px !important;
  font-weight: bold;
  padding-top: 20px;
  margin: 0;
  color: #D90429;
}

/* Grid layout for packages */
.packages {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px 10px;
  text-align: justify;
  background-color: #EDF2F4;
  width: 100%;
  margin: 0 auto;
  border-radius: 5px;
}

/* Package image styling */
.package-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;
}

.package-img:hover {
  transform: scale(1.05);
}

h5 {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

/* Package item styling */
.package-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: #2B2D42;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  color: white;
}

.package-item:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

/* Link styling */
.link {
  text-decoration: none;
  color: #2b2d42;
}

.link h5 {
  margin-top: 10px;
  font-size: 18px;
  text-align: center;
  color: #2b2d42;
}

/* Button for "Bỏ qua" */
.next {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  position: fixed;
  bottom: 60px;
  right: 20px;
  text-decoration: none;
}

/* Icon button for "Bỏ qua" */
.icon {
  width: 180px;
  height: 60px;
  font-size: 24px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d90429;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
}

.icon:hover {
  background-color: #ef233c;
}

.icon-text {
  margin-left: 10px;
  font-size: 18px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .packages {
    grid-template-columns: 1fr;
  }

  .package-item {
    width: 100%;
  }

  .icon {
    width: 150px;
    height: 50px;
  }
}
</style>
