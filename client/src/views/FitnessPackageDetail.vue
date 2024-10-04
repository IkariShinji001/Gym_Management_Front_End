<template>
  <div class="container" v-if="fitnessBenefits && servicePackagePrices && fitnessPackage">
    <div class="back-button">
      <q-btn flat icon="arrow_back" size="md" @click="$router.go(-1)">
      </q-btn>
    </div>

    <div v-if="fitnessPackage.servicePackage.name">
      <h5 class="container-header ">Gói {{ fitnessPackage.servicePackage.name }}</h5>
      <q-card-section>
        <q-img :src="fitnessPackage.coverImageUrl"></q-img>
      </q-card-section>
    </div>
    <div class="duration" v-if="servicePackagePrices.length > 0">
      <div v-for="(servicePackagePrice, index) in servicePackagePrices" :key="index">
        <div class="chossed">
          <q-btn class="button" :class="{ 'selected': selectPriceId === servicePackagePrice.id }"
            @click="getPrice(servicePackagePrice.id)">
            <!-- Hiển thị badge chỉ khi giá trị của nút đó được chọn -->
            <q-badge color="red" floating v-if="selectPriceId === servicePackagePrice.id"></q-badge>
            {{ servicePackagePrice.packageDuration?.duration + " " +
              formatDurationType(servicePackagePrice.packageDuration?.durationType) }}
          </q-btn>
        </div>
      </div>
    </div>

    <div class="price">
      <div> {{ formatPrice(price) }}</div>
    </div>

    <h5 class="container-header">Các đặc quyền của gói tập</h5>
    <div class="container-body" v-for="(benefit, index) in fitnessBenefits" :key="index">
      <q-card class="my-card">
        <q-card-section class="my-card-description">
          {{ benefit.packageBenefit?.description }}
        </q-card-section>
      </q-card>
    </div>

    <div class="buy">
      <q-icon name="sms" class="icon chat"></q-icon>
      <!-- đường dẫn tương đối không có / ở đầu thì nối đuôi đường dẫn cũ ra -->
      <router-link class="buy" :to="`${fitnessPackageId}/prices/${selectPriceId}`">
        <q-icon name="shopping_cart" class="icon">
          <p class="icon-text">Mua gói tập</p>
        </q-icon>
      </router-link>
    </div>
  </div>



</template>

<script setup>
  import { onBeforeMount, ref } from "vue";
  import benefitPackageService from "../services/benefitPackage.service";
  import servicePackagePrice from "../services/servicePackagePrice.service";
  import FitnessPackageService from "../services/fitnessPackage.service";
  import { useRoute } from "vue-router";

  const fitnessPackage = ref();
  const fitnessBenefits = ref([]);
  const servicePackagePrices = ref([1]);
  const route = useRoute();
  const fitnessPackageId = ref(route.params.fitnessPackageId);
  const typeId = ref(route.params.typeId);
  const openBuyDialog = ref(false);
  const selectPriceId = ref(0);
  const price = ref(0);

  const handleOpenBuyDialog = () => {
    openBuyDialog.value = true;
  }

  onBeforeMount(async () => {
    fitnessBenefits.value = await benefitPackageService.findBenefitByFitnessPackageId(fitnessPackageId.value);
    fitnessPackage.value = await FitnessPackageService.getById(fitnessPackageId.value);

    servicePackagePrices.value = await servicePackagePrice.getPackagePriceById(fitnessPackage.value.servicePackage.id);
    // price.value=servicePackagePrices.value[0].price;
    // Đặt mặc định giá trị của selectPriceId và price

    if (servicePackagePrices.value.length > 0) {
      selectPriceId.value = servicePackagePrices.value[0].id;
      price.value = servicePackagePrices.value[0].price;
    }
  });
  const testFunc = () => {
    console.log(selectPriceId.value);
  }
  const getPrice = (id) => {
    selectPriceId.value = id;
    servicePackagePrices.value.forEach((servicePackagePrice) => {
      if (servicePackagePrice.id === selectPriceId.value) {
        price.value = servicePackagePrice.price;
      }
    });
  }
  const formatDurationType = (durationType) => {
    if (durationType === "month") {
      return "Tháng";
    } else if (durationType === "week") {
      return "Tuần";
    } else if (durationType === "day") {
      return "Ngày";
    } else if (durationType === "year") {
      return "Năm";
    }
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }


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
    padding: 10px;
    margin: 0;
    background-color: #edf2f4;
  }

  .duration {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin: 10px;
  }

  .button.selected {
    background-color: #D90429;
    /* Màu nền khi nút được chọn */
    color: white;
    /* Màu chữ khi nút được chọn */
  }

  .button {
    margin: 10px;
    width: 70%;
    height: 50px;
    font-size: 15px;
    color: #D90429;
    border-color: #D90429;
    background-color: white;
    font-weight: bold;
    text-align: center;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.3s;
  }

  .my-card {
    margin: 10px;
    width: 95%;
    margin: 0 auto;
    padding: 10px;
    background-color: #edf2f4;
  }

  .container-body {
    margin: 20px;
  }

  .buy {
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

  .chat {
    background-color: #8D99AE;
    width: 70px;
  }

  .price {
    font-size: 30px;
    color: rgb(197, 38, 38);
    font-weight: bold;
    text-align: center;

  }
</style>
