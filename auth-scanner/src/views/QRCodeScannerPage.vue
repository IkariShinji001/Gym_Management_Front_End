<template>
  <h1>Quét mã QR để vào phòng tập</h1>
  <router-link :to="`/face-reg`">Xác thực bằng gương mặt</router-link>
  <QrcodeStream class="qr" @detect="onDetect" :track="paintBoundingBox">
  </QrcodeStream>
  <p v-if="message">{{ message }}</p>
</template>


<script setup>
  import { QrcodeStream } from 'vue-qrcode-reader'
  import { ref } from "vue"
  import authService from '../services/auth.service';
  import entryTimeService from '../services/entryTime.service';
  const message = ref('');
  const paintBoundingBox = (detectedCodes, ctx) => {
    for (const detectedCode of detectedCodes) {
      const {
        boundingBox: { x, y, width, height }
      } = detectedCode

      ctx.lineWidth = 3
      ctx.strokeStyle = '#007bff'
      ctx.strokeRect(x, y, width, height)
    }
  }
  const onDetect = async (detectedCodes) => {
    try {
      const res = await authService.verifyUser(detectedCodes[0].rawValue);
      console.log(res);
      message.value = `Xin chào ${res.username}`
      await entryTimeService.createEntryTime(res.id);
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        message.value = 'Mã QR không hợp lệ'
      }
    }
  }
</script>

<style scoped>
  h1 {
    font-size: 50px;
    padding: 0;
    margin: 0;
    margin-bottom: 10px;
  }

</style>