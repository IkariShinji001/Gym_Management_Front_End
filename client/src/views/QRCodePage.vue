<template>
  <div class="container">
    <p>Mã QR quét vào cửa</p>
    <QrcodeVue class="qr" :value="QrcodeValue" size="250"></QrcodeVue>
  </div>
</template>

<script setup>
  import QrcodeVue from 'qrcode.vue'
  import { onBeforeMount, ref } from 'vue';
  const QrcodeValue = ref();
  onBeforeMount(() => {
    QrcodeValue.value = localStorage.getItem('user_access_token');
  })

</script>

<style scoped>

  .container {
    width: 100vw;
    min-height: 100vh;
    background-color: #edf2f4;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .qr {
    margin-top: 30%;
  }

  p {
    font-size: 25px;
    font-weight: bold;
    margin-top: 70px;
    margin-bottom: 0;
  }


</style>