<template>
  <h1>Gói tập của bạn</h1>
  <div v-if="activePackages.length > 0">
    <q-card class="card" v-for="(activePackage, index) in activePackages" :key="index">
      <div class="card-container">

        <div>
          <q-card-section class="name">{{ activePackage.package.servicePackageName }}</q-card-section>
          <q-card-section class="duration">{{ activePackage.package.duration }} {{
            getVNMonth(activePackage.package.durationType) }}</q-card-section>
        </div>

        <div>
          <q-card-section>
            <p>Bắt đầu: {{ formatDateDDMMYYY(new Date(activePackage.startEffective)) }}</p>
            <p>Kết thúc: {{ formatDateDDMMYYY(new Date(activePackage.endEffective)) }}</p>
            <p>Thời gian còn lại: {{ daysDiff(activePackage.endEffective) }} ngày</p>
            <q-btn outline class="cancel" @click="confirm(activePackage.id)">HỦY GÓI</q-btn>
          </q-card-section>
        </div>
      </div>
    </q-card>
  </div>
  <div v-else class="no-package"> Bạn chưa có gói tập nào !
    <router-link to="/">Mua ngay</router-link>
  </div>
</template>

<script setup>
  import { onBeforeMount, ref } from 'vue';
  import billService from '../services/bill.service';
  import { formatDateDDMMYYY } from '../shared/formatDate';
  import { useQuasar } from 'quasar';


  const $q = useQuasar()
  const activePackages = ref([]);
  const userId = localStorage.getItem("userId");


  const getVNMonth = (month) => {
    switch (month) {
      case 'month':
        return 'tháng';
      case 'year':
        return 'năm';
      case 'day':
        return 'ngày';
    }
  };


  function confirm(priceId) {
    $q.dialog({
      dark: true,
      title: 'Confirm',
      message: 'Bạn có muốn hủy gói tập này? Không thể hoàn tác!',
      cancel: true,
      persistent: true
    }).onOk(async () => {
      const res = await billService.cancelPackage(priceId);
      console.log(res);
    }).onCancel(() => {
      console.log('>>>> Cancel')
    })
  }

  const daysDiff = (endDate) => {
    const now = new Date(Date.now());
    const endTime = new Date(endDate);
    const timeDiff = endTime - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  }
  onBeforeMount(async () => {
    activePackages.value = await billService.getPackageActice(userId);
    console.log(activePackages.value);
  })
</script>

<style scoped>
  h1 {
    font-size: 2.5em;
    text-align: center;
  }

  .card {
    margin: 10px 0;
    background-color: #003049;
    color: white;
  }

  .card-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .name {
    font-size: 20px;
    text-transform: capitalize;
  }

  .duration {
    text-align: center;
    font-size: 18px;
  }

  .cancel {
    width: 100%;
    background-color: white !important;
    color: brown;
    font-weight: bold;
  }

  .no-package {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 40px;
  }
</style>
