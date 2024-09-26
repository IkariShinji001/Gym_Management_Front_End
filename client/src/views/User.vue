<template>
  <div class="container" v-if="user">
    <div class="header">
      <q-avatar>
        <img src="https://cdn.quasar.dev/img/avatar.png">
      </q-avatar>
      <p>Xin chào <span>{{ user.fullName }}</span></p>
    </div>
  </div>

  <ul>
    <router-link :to="`/users/detail`">
      <li class="li">
        <q-icon class="icons" name="account_circle"></q-icon>
        <p>Thông tin cá nhân</p>
      </li>
    </router-link>
    <router-link :to="`/entry-times`">
      <li class="li">
        <q-icon class="icons" name="work_history"></q-icon>
        <p>Lịch sử tập gym</p>
      </li>
    </router-link>
    <!-- <router-link :to="`/create-face-login`">
      <li class="li">
        <q-icon class="icons" name="sensor_occupied"></q-icon>
        <p>Đăng ký nhận diện khuôn mặt</p>
      </li>
    </router-link> -->
    <li class="li" @click="handleOpen">
      <q-icon class="icons" name="sensor_occupied"></q-icon>
      <p>Đăng ký nhận diện khuôn mặt</p>
    </li>
    <router-link :to="`/active-package`">
      <li class="li">
        <q-icon class="icons" name="exercise"></q-icon>
        <p>Gói tập của tôi</p>
      </li>
    </router-link>


    <li id="signout">
      <p class="sign-out-btn">Đăng xuất</p>
    </li>
  </ul>


  <q-dialog v-model="openDialog">
    <q-card class="dialog">
      <q-card-section>
        <q-input class="input" v-model="passwordAccessFace" outlined :type="isPwd ? 'password' : 'text'"
          hint="Nhập mật khẩu để tiếp tục">
          <template v-slot:append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
          </template>
        </q-input>
        <q-btn class="btn" @click="verifyFaceAcess">XÁC NHẬN</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>


</template>


<script setup>
  import { onBeforeMount, ref } from 'vue';
  import userService from '../services/user.service';
  import authService from '../services/auth.service';
  import { useRouter } from 'vue-router'
  import { useQuasar, QSpinnerCube } from 'quasar'
  import { useToast } from "vue-toastification";
  const toast = useToast();

  const $q = useQuasar()

  const router = useRouter();
  const user = ref();
  const openDialog = ref();
  const passwordAccessFace = ref();
  const isPwd = ref(true);
  const userId = localStorage.getItem('userId');
  onBeforeMount(async () => {
    user.value = await userService.getUserById(userId);
  })

  const handleOpen = () => {
    openDialog.value = true;
  }

  const verifyFaceAcess = async () => {
    $q.loading.show({
      spinner: QSpinnerCube,
    })
    try {
      const res = await authService.verifyAccessFace(user.value.username, passwordAccessFace.value)
      if (res) {
        toast.success("Xác thực thành công!");
        router.push('/create-face-login')
      }
    } catch (error) {
      toast.error("Vui lòng nhập đúng mật khẩu!");
      console.error(error);
    } finally {
      $q.loading.hide();
    }
  }

</script>

<style scoped>
  .container {
    padding: 20px;
    background-color: #EDF2F4;
  }

  .header {
    display: flex;
    align-items: center;
  }

  p {
    margin: 0;
    margin-left: 20px;
    font-size: 18px;
  }

  span {
    text-transform: uppercase;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    background-color: #EDF2F4;
    margin: 10px auto;
    padding: 15px 0;
    border-radius: 8px;
    width: 90%;
  }

  .icons {
    font-size: 30px;
    margin-left: 10px;
  }

  .li {
    display: flex;
  }

  #signout {
    background-color: #a4161a !important;
    color: white;
    font-weight: 500;
  }

  .sign-out-btn {
    margin: 0 auto;
    text-align: center;
  }

  a {
    color: black;
    text-decoration: none;
  }

  .dialog {
    width: 80vw;
    height: 25vh;
    margin-bottom: 300px;
  }

  .btn {
    margin-top: 20px;
    width: 100%;
    background-color: #a4161a;
    color: white;
  }

  .input {
    margin-top: 40px;
  }
</style>