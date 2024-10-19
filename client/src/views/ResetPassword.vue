<template>
  <div class="container">
    <q-card class="form">
      <h1>Đặt lại mật khẩu</h1>
      <q-card-section>
        <q-input label="Mật khẩu mới" outlined class="input" v-model="newPassword"
          :type="showNewPassword ? 'text' : 'password'">
          <template v-slot:append>
            <q-btn flat dense :icon="showNewPassword ? 'visibility_off' : 'visibility'"
              @click="toggleNewPasswordVisibility"></q-btn>
          </template>
        </q-input>

        <q-input label="Xác nhận mật khẩu" outlined class="input" v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'">
          <template v-slot:append>
            <q-btn flat dense :icon="showConfirmPassword ? 'visibility_off' : 'visibility'"
              @click="toggleConfirmPasswordVisibility"></q-btn>
          </template>
        </q-input>

        <q-btn class="btn" @click="handleResetPassword">ĐẶT LẠI MẬT KHẨU</q-btn>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useQuasar, QSpinnerCube } from 'quasar';
import userService from '../services/user.service';

const toast = useToast();
const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const newPassword = ref('');
const confirmPassword = ref('');

// Trạng thái để ẩn/hiện mật khẩu mới và xác nhận mật khẩu
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// Hàm để bật/tắt hiển thị mật khẩu mới
const toggleNewPasswordVisibility = () => {
  showNewPassword.value = !showNewPassword.value;
};

// Hàm để bật/tắt hiển thị xác nhận mật khẩu
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const handleResetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.error('Mật khẩu xác nhận không khớp');
    return;
  }

  const token = route.query.token; // Get the token from the query parameters
  if (!token) {
    toast.error('Mã token không hợp lệ');
    return;
  }

  $q.loading.show({
    spinner: QSpinnerCube,
  });

  try {
    console.log(token, newPassword.value);
    await userService.resetPassword(token, newPassword.value);
    toast.success('Mật khẩu đã được đặt lại thành công');
    router.push('/login'); // Redirect to login page
  } catch (error) {
    toast.error('Có lỗi xảy ra, vui lòng thử lại');
    console.error(error);
  } finally {
    $q.loading.hide();
  }
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
</style>