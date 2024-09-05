<template>
  <h1>Đăng ký vào phòng tập bằng gương mặt</h1>
  <q-linear-progress :value="progress" rounded size="8px" class="progress" v-if="isProgress" />
  <div class="vid-container">
    <video ref="video" class="video" autoplay></video>
  </div>
  <q-btn @click="captureImage" class="btn">Tiến hành đăng ký</q-btn>
  <canvas class="canva" ref="canvas" width="640" height="480"></canvas>

</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { base64ToBlob } from 'base64ToBlob';
  import faceService from '../services/face.service';
  import { useQuasar, QSpinnerCube } from 'quasar'

  const userId = localStorage.getItem('userId');
  const video = ref(null);
  const canvas = ref(null);
  const images = ref([]);
  const isProgress = ref(false);
  const progress = ref(0)
  const $q = useQuasar()

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


  const handleUploadImage = async () => {
    $q.loading.show({
      spinner: QSpinnerCube,
    })
    try {
      console.log(images.value)
      const res = await faceService.createFaceReg(userId, images.value);
      console.log(res);
    } catch (error) {
      console.log(error)
    } finally {
      $q.loading.hide()
    }
  }


  const captureImage = () => {
    if (video.value && canvas.value) {
      isProgress.value = true;
      const context = canvas.value.getContext('2d');
      let imageCount = 0;
      const totalImages = 10;
      const interval = 500;

      const captureInterval = setInterval(async () => {
        if (imageCount < totalImages) {
          progress.value = progress.value + 0.1;
          context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
          canvas.value.toBlob((blob) => {
            const pngFile = new File([blob], `image_${imageCount + 1}.png`, { type: 'image/png' });
            images.value.push(pngFile);
            imageCount++;
          }, 'image/png');
        } else {
          clearInterval(captureInterval);
          handleUploadImage();
        }
      }, interval);
    }
  };


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
    width: 90vw;
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
