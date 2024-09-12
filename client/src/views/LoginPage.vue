<template>
  <div class="container">
    <q-card class="form">
      <h1>Đăng nhập</h1>
      <q-card-section>
        <q-input label="Tên đăng nhập" outlined class="input" v-model="user.username"></q-input>
        <q-input label="Mật khẩu" outlined class="input" v-model="user.password"></q-input>

        <q-btn class="btn" @click="handleLogin">ĐĂNG NHẬP</q-btn>
        <!-- <router-link class="register">Chưa có tài khoản?</router-link> -->
      </q-card-section>
    </q-card>
  </div>
</template>


<script setup>
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import authService from '../services/auth.service';
  import { useToast } from "vue-toastification";
  import { useQuasar, QSpinnerCube } from 'quasar'

  const toast = useToast();
  const router = useRouter()
  const user = reactive({
    username: '',
    password: '',
  })

  const $q = useQuasar()


  const handleLogin = async () => {
    $q.loading.show({
      spinner: QSpinnerCube,
    })
    try {
      const res = await authService.login(user);
      localStorage.setItem("user_access_token", res.access_token);
      localStorage.setItem("userId", res.id);
      toast.success("Đăng nhập thành công");
      router.push({ path: '/' })
    } catch (error) {
      toast.error("Xảy ra lỗi trong quá trình đăng nhập");
      console.error(error);
    } finally {
      $q.loading.hide()
    }
  }
</script>

<style scoped>
  .container {
    width: 100vw;
    min-height: 100vh;
    background-color: #2b2d42;
    display: flex;
    justify-content: center;

  }

  .form {
    width: 80vw;
    height: fit-content;
    background-color: #edf2f4;
    margin-top: 25%;
  }

  h1 {
    font-size: 30px;
    text-transform: uppercase;
    text-align: center;
    font-weight: bold;
    margin: 20px 0 0 0;
  }

  .input {
    background-color: white;
    margin: 10px 0;
  }

  .btn {
    margin-top: 20px;
    width: 100%;
    padding: 10px 0;
    background-color: #2b2d42;
    color: white;
    font-size: 16px;
  }

  .register {
    display: block;
    color: #d90429;
    text-decoration: none;
    font-size: 16px;
    text-align: right;
    margin-top: 10px;
  }
</style>