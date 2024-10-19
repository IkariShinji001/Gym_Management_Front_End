<template>
  <div class="container">
    <q-card class="form">
      <h1>Đăng ký</h1>
      <q-card-section>
        <q-input label="Họ và tên" outlined class="input" v-model="user.fullName"></q-input>
        <q-input label="Email" outlined class="input" v-model="user.email"></q-input>
        <q-input label="Số điện thoại" outlined class="input" v-model="user.phoneNumber"></q-input>
        <q-select v-model="user.gender" label="Giới tính" :options="genderSelect" map-options emit-value
        option-label="text" outlined option-value="value"></q-select>
        <q-input label="Ngày sinh" outlined class="input" v-model="user.dateBirth" type="date"></q-input>
        <q-input label="Tên đăng nhập" outlined class="input" v-model="user.username"></q-input>
        <!-- <q-input label="Mật khẩu" password outlined class="input" v-model="user.password" type="password"></q-input> -->
        <q-input label="Mật khẩu" outlined class="input" v-model="user.password"
          :type="showPassword ? 'text' : 'password'">
          <!-- Nút để ẩn/hiện mật khẩu -->
          <template v-slot:append>
            <q-btn flat dense :icon="showPassword ? 'visibility_off' : 'visibility'"
              @click="togglePasswordVisibility"></q-btn>
          </template>
        </q-input>

        <!-- <q-input label="Nhập lại mật khẩu" outlined class="input" v-model="rePassword" type="password"></q-input> -->
        <q-input label="Nhập lại mật khẩu" outlined class="input" v-model="rePassword"
          :type="showPassword ? 'text' : 'password'">
          <!-- Nút để ẩn/hiện mật khẩu -->
          <template v-slot:append>
            <q-btn flat dense :icon="showPassword ? 'visibility_off' : 'visibility'"
              @click="togglePasswordVisibility"></q-btn>
          </template>
        </q-input>
        <q-btn class="btn" @click="handleRegister">ĐĂNG KÝ</q-btn>
        <router-link class="register" to="/login">Đã có tài khoản? Đăng nhập</router-link>
        <router-link class="register" to="/forgot-password">Quên mật khẩu?</router-link>
      </q-card-section>
    </q-card>
  </div>
</template>


<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
import { useQuasar, QSpinnerCube, date } from 'quasar'
import userService from '../services/user.service';

const toast = useToast();
const router = useRouter()
const user = ref({});
const rePassword = ref();
const $q = useQuasar()
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const sex = ref(true);

const genderSelect = ref([{
  text: 'Nam',
  value: true
}, {
  text: 'Nữ',
  value: false
}])

const isMatchedPassword = () => {
  return rePassword.value === user.value.password;
}


const handleRegister = async () => {
  $q.loading.show({ spinner: QSpinnerCube });

  if (!isMatchedPassword()) {
    toast.error("Mật khẩu nhập không trùng");
    return;
  }

  try {
    user.value.dateBirth = new Date(user.value.dateBirth);
    const res = await userService.register(user.value);
    toast.success("Đăng ký thành công");
    router.push({ path: '/login' });
    console.log(res);
  } catch (error) {
    toast.error("Xảy ra lỗi trong quá trình đăng ký");
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
  margin-top: 10%;
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