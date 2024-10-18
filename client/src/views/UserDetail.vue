<template>
  <div>
    <div class="container" v-if="user">

      <div class="header">
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar.png">
        </q-avatar>

        <p>Xin chào <span>{{ user.fullName }}</span></p>

        <q-icon name="settings" class="update" @click="handleOpenDialog">
        </q-icon>
        <q-icon name="key" class="changePass" @click="handleChangePassword"> </q-icon>

      </div>
    </div>

    <div class="info" v-if="user">
      <table v-if="user" class="table-user">
        <thead>
          <tr>
            <th>Thông tin</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Họ và tên:</td>
            <td class="detail">{{ user.fullName }}</td>
          </tr>
          <tr>
            <td>Số điện thoại:</td>
            <td class="detail">{{ user.phoneNumber || 'Chưa có thông tin' }}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td class="detail">{{ user.email || 'Chưa có thông tin' }}</td>
          </tr>
          <tr>
            <td>Giới tính:</td>
            <td class="detail">{{ user.gender ? 'Nam' : 'Nữ' || 'Chưa có thông tin' }}</td>
          </tr>
          <tr>
            <td>Ngày sinh:</td>
            <td class="detail">{{ formatDateDDMMYYY(new Date(user.dateBirth)) || 'Chưa có thông tin' }}</td>
          </tr>
          <tr>
            <td>Mã mời:</td>
            <td class="detail">{{ user.referralCode || 'Chưa có thông tin' }}</td>
          </tr>
        </tbody>
      </table>


      <div class="info" v-if="user">
        <div class="user-info">
          <div class="title">
            <p class="info-header">Họ và tên: </p>
            <p class="info-header">Số điện thoại: </p>
            <p class="info-header">Email: </p>
            <p class="info-header">Giới tính: </p>
            <p class="info-header">Ngày sinh: </p>
            <p class="info-header">Mã mời: </p>
          </div>

          <div>
            <p>{{ user.fullName }}</p>
            <p>{{ user.phoneNumber || 'Chưa có thông tin' }}</p>
            <p>{{ user.email || 'Chưa có thông tin' }}</p>
            <p>{{ user.gender ? 'Nam' : 'Nữ' || 'Chưa có thông tin' }}</p>
            <p>{{ formatDateDDMMYYY(new Date(user.dateBirth)) || 'Chưa có thông tin' }}</p>
            <p>{{ user.referralCode || 'Chưa có thông tin' }}</p>
          </div>
        </div>

        <q-dialog v-model="openDialog">
          <q-card class="card" v-if="userUpdated">
            <q-card-section class="title-card">Cập nhật thông tin</q-card-section>
            <q-card-section>
              <q-input v-model="userUpdated.fullName" label="Họ và tên"></q-input>
              <q-input v-model="userUpdated.phoneNumber" label="Số điện thoại"></q-input>
              <q-input v-model="userUpdated.email" label="Email"></q-input>
              <q-select v-model="userUpdated.gender" label="Giới tính" :options="genderSelect" map-options emit-value
                option-label="text" option-value="value"></q-select>
              <q-input v-model="userUpdated.dateBirth" label="Ngày sinh" type="date" />
              <q-btn class="btn" @click="handleUpdate">Cập nhật</q-btn>
            </q-card-section>
          </q-card>
        </q-dialog>

        <q-dialog v-model="openChangePassword">
          <q-card class="card">
            <q-card-section class="title-card">Đổi mật khẩu</q-card-section>
            <q-card-section>
              <q-input v-model="password" label="Mật khẩu cũ" type="password"></q-input>
              <q-input v-model="newPassword" label="Mật khẩu mới" type="password"></q-input>
              <q-input v-model="confirmPassword" label="Nhập lại mật khẩu mới" type="password"></q-input>
              <q-btn class="btn" @click="changePassword">Đổi mật khẩu</q-btn>
            </q-card-section>

          </q-card>
        </q-dialog>
      </div>
    </div>
</template>


<script setup>
  import { formatDateDDMMYYY } from '../shared/formatDate'
  import userService from '../services/user.service';
  import { onBeforeMount, ref } from 'vue';
  import { useQuasar } from 'quasar'

  const userId = localStorage.getItem('userId');
  const user = ref()
  const userUpdated = ref({})
  const openDialog = ref()
  const openChangePassword = ref(false)

  const password = ref('')
  const newPassword = ref('');

  const confirmPassword = ref('');


  const $q = useQuasar();


  const handleChangePassword = () => {
    openChangePassword.value = true;
  }

  const changePassword = async () => {
    try {
      if (newPassword.value !== confirmPassword.value) {
        $q.notify({ position: 'top', color: 'negative', message: 'Mật khẩu xác nhận không khớp' });
        return;
      }
      if (newPassword.value.length < 6) {
        $q.notify({ position: 'top', color: 'negative', message: 'Mật khẩu phải có ít nhất 6 ký tự' });
        return;
      }
      if (password.value === '') {
        $q.notify({ position: 'top', color: 'negative', message: 'Vui lòng nhập mật khẩu cũ' });
        return;
      }
      await userService.changePassword(userId, password.value, newPassword.value);
      $q.notify({ position: 'top', color: 'positive', message: 'Đổi mật khẩu thành công' });
      openChangePassword.value = false;
      password.value = '';
      newPassword.value = '';

    } catch (error) {
      console.error(error)
      $q.notify({
        color: 'negative',
        position: 'top',
        message: error.response.data.message
      })

    }
  }

  const genderSelect = ref([{
    text: 'Nam',
    value: true
  }, {
    text: 'Nữ',
    value: false
  }])

  onBeforeMount(async () => {
    user.value = await userService.getUserById(userId);
    // password.value = user.value.password;
  })

  const handleUpdate = async () => {
    try {
      const res = await userService.updateUser(userId, userUpdated.value);
      Object.assign(user.value, res);
      openDialog.value = false;
    } catch (error) {
      console.error(error)
    }
  }

  const handleOpenDialog = () => {
    Object.assign(userUpdated.value, user.value)
    openDialog.value = true;

  }

</script>

<style scoped>
  .container {
    padding: 20px;
    background-color: #EDF2F4;
    margin: 0 auto;
  }

  <<<<<<< HEAD table {
    width: 100%;
  }

  td {
    font-size: 16px;
  }

  .header {
    display: flex;
    align-items: center;
  }

  =======.header {
    display: flex;
    align-items: center;
  }

  >>>>>>>33dcea1dc642e8b8e3cf3ce49fa1ef8e83888ae9 p {
    margin: 0;
    margin-left: 20px;
    font-size: 18px;
    margin-top: 10px;
  }

  span {
    text-transform: uppercase;
  }

  <<<<<<< HEAD .table-user {
    padding: 10px;
  }

  .update {
    margin-left: 100px;
    font-size: 24px;
  }

  =======.update {
    margin-left: 100px;
    font-size: 24px;
  }

  >>>>>>>33dcea1dc642e8b8e3cf3ce49fa1ef8e83888ae9 .changePass {
    margin-left: 20px;
    font-size: 24px;
  }

  .user-info {
    display: flex;
  }

  .title {
    width: 50%;
  }

  .info {
    width: 95%;
    margin: 0 auto;
    background-color: #EDF2F4;
    margin-top: 10px;
    border-radius: 10px;
  }

  .info-header {
    font-weight: bold;
  }

  <<<<<<< HEAD .card {
    width: 90vw;
  }

  .detail {
    margin-left: 20px;
  }

  .btn {
    display: flex;
    margin: 0 auto;
    margin-top: 20px;
    padding: 0 50px;
    background-color: #2B2D42;
    color: white;
  }

  =======.title-card {
    font-size: 18px;
  }

  >>>>>>>33dcea1dc642e8b8e3cf3ce49fa1ef8e83888ae9 .card {
    width: 90vw;
  }

  .btn {
    display: flex;
    margin: 0 auto;
    margin-top: 20px;
    padding: 0 50px;
    background-color: #2B2D42;
    color: white;
  }
</style>