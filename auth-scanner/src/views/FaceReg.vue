<template>
  <h1>Đăng ký vào phòng tập bằng gương mặt</h1>
  <div class="vid-container">
    <video ref="video" class="video" autoplay></video>
  </div>
  <canvas class="canva" ref="canvas" width="640" height="480"></canvas>
  <p v-if="user">{{ user.fullName }}</p>
  {{ image }}
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import faceService from '../services/face.service';
  import billService from '../services/bill.service';
  import { useQuasar } from 'quasar'

  const video = ref(null);
  const canvas = ref(null);
  const image = ref(null);
  const $q = useQuasar()
  const user = ref({ id: null, fullName: null });

  const initializeCamera = () => {
    if (video.value) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          video.value.srcObject = stream;
        })
        .catch((err) => {
          console.error("Lỗi truy cập camera: ", err);
        });
    }
  };


  const captureImage = async () => {
    if (video.value && canvas.value) {
      const context = canvas.value.getContext('2d');
      context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
      canvas.value.toBlob((blob) => {
        const pngFile = new File([blob], 'captured_image.png', { type: 'image/png' });
        image.value = pngFile;
      }, 'image/png');

      try {
        const res = await faceService.validateFace(image.value);
        console.log(res);
        if (!res.user.id) {
          $q.notify({ position: 'top', message: 'Bạn chưa đăng ký gương mặt trong hệ thống!' });
          return;
        }
        const billActive = await billService.getAllBillActive(res.user.id);

        if (billActive.length === 0) {
          $q.notify({ position: 'top', message: 'Gói tập của bạn đã hết hạn!' });
          return;
        }
        if (user.value.id !== res.user.id) {
          user.value = res.user;
          $q.notify({ position: 'top', message: "Xin chào " + user.value.fullName });
        }
      } catch (error) {
        console.error(error);
        $q.notify({ position: 'top', message: 'Bạn chưa đăng ký gương mặt trong hệ thống!' });
      }

    }
  };

  setTimeout(() => setInterval(captureImage, 2000), 5000);



  onMounted(() => {
    initializeCamera();
  });
</script>

<style scoped>
  h1 {
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    line-height: normal;
  }

  .vid-container {
    display: flex;
    justify-content: center;
  }

  .video {
    width: 90vw !important;
    height: 70vh;
    border-radius: 10px;
  }

  .canva {
    display: none;
  }

  .btn {
    background-color: #2b2d42;
    color: white;
    padding: 10px 30px;
    margin: 0 auto;
    display: flex;
    margin-top: 30px;
  }

  .progress {
    width: 90vw;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
