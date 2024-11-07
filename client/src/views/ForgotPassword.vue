<template>
  <div class="container">
    <q-card class="form">
      <h1>Quên mật khẩu</h1>
      <q-card-section>
        <!-- <q-input label="Email" outlined class="input" v-model="email" type="email"></q-input> -->
        <q-input v-model="email" outlined label="Email" :rules="[
          val => !!val || 'Email không được để trống', validateEmail]" />
        <q-btn class="btn" @click="handleForgetPassword">Gửi yêu cầu</q-btn>
        <router-link class="register" to="/login">Quay lại đăng nhập</router-link>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar, QSpinnerCube } from 'quasar';
import userService from '../services/user.service';

const email = ref('');
const $q = useQuasar();

const handleForgetPassword = async () => {
  $q.loading.show({
    spinner: QSpinnerCube,
  })
  try {
    if (!email.value) {
      $q.notify({ position: 'top', color: 'negative', message: 'Email không được để trống' });
      return;
    }
    if(!validateEmail(email.value)){
      $q.notify({ position: 'top', color: 'negative', message: 'Email không hợp lệ' });
      return;
    }
    const exitedEmail = await userService.findOneByEmail(email.value);
    if (!exitedEmail) {
      $q.notify({ position: 'top', color: 'negative', message: 'Email không tồn tại' });
      return;
    }
    await userService.forgetPassword(email.value);
    $q.notify({ position: 'top', color: 'positive', message: 'Yêu cầu đã được gửi, vui lòng kiểm tra email của bạn' });
  } catch (error) {
    $q.notify({ position: 'top', color: 'negative', message: 'Có lỗi xảy ra, vui lòng thử lại' });
  } finally {
    $q.loading.hide();
  }

}
const validateEmail = (email) => {
  const regex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  return regex.test(email) || "Email không hợp lệ";
};
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