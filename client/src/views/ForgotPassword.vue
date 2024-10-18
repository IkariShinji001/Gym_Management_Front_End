<template>
    <div class="container">
      <q-card class="form">
        <h1>Quên mật khẩu</h1>
        <q-card-section>
          <q-input label="Email" outlined class="input" v-model="email" type="email"></q-input>
          <q-btn class="btn" @click="handleForgetPassword">Gửi yêu cầu</q-btn>
          <router-link class="register" to="/login">Quay lại đăng nhập</router-link>
        </q-card-section>
      </q-card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useQuasar } from 'quasar';
  import userService from '../services/user.service';
  
  const email = ref('');
  const $q = useQuasar();
  
  const handleForgetPassword = async () => {
    try {
      if (!email.value) {
        $q.notify({ position: 'top', color: 'negative', message: 'Email không được để trống' });
        return;
      }
      await userService.forgetPassword(email.value);
      $q.notify({ position: 'top', color: 'positive', message: 'Yêu cầu đã được gửi, vui lòng kiểm tra email' });
      email.value = '';
    } catch (error) {
      $q.notify({ position: 'top', color: 'negative', message: 'Có lỗi xảy ra, vui lòng thử lại' });
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
  