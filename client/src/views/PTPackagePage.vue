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
  const selectPriceId = ref(0);
  const slide = ref(1);
  const route = useRoute();
  const priceId = route.params.priceId;



  const formatDurationType = (durationType) => {
    switch (durationType) {
      case "month": return "Tháng";
      case "week": return "Tuần";
      case "day": return "Ngày";
      case "year": return "Năm";
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Lấy dữ liệu từ API và thiết lập slide mặc định là 1
  onBeforeMount(async () => {
    allPtPackages.value = await ptPackageService.getAll();

  });
</script>

<style scoped>
  .container {
    background-color: #edf2f4;
    min-height: 150vh;
  }

  .package-img {
    width: 180px;
    height: 200px;
    object-fit: cover;
  }

  .package {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-gap: 10px;
  }

  .package-item {
    margin: 10px;
    width: 95%;
    margin: 0 auto;
    padding: 10px;
    background-color: #edf2f4;
  }

  .link {
    text-decoration: none;
    color: black;
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
</style>
