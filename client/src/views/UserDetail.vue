<template>
  <div class="container" v-if="user">

    <div class="header">
      <q-avatar>
        <img src="https://cdn.quasar.dev/img/avatar.png">
      </q-avatar>

      <p>Xin chào <span>{{ user.fullName }}</span></p>

      <q-icon name="settings" class="update" @click="handleOpenDialog">
      </q-icon>

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
  </div>
</template>


<script setup>
  import { formatDateDDMMYYY } from '../shared/formatDate'
  import userService from '../services/user.service';
  import { onBeforeMount, ref } from 'vue';
  const userId = localStorage.getItem('userId');
  const user = ref()
  const userUpdated = ref({})
  const openDialog = ref()

  const genderSelect = ref([{
    text: 'Nam',
    value: true
  }, {
    text: 'Nữ',
    value: false
  }])

  onBeforeMount(async () => {
    user.value = await userService.getUserById(userId);
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

  table {
    width: 100%;
  }

  td {
    font-size: 16px;
  }

  .header {
    display: flex;
    align-items: center;
  }

  p {
    margin: 0;
    margin-left: 20px;
    font-size: 18px;
    margin-top: 10px;
  }

  span {
    text-transform: uppercase;
  }

  .table-user {
    padding: 10px;
  }

  .update {
    margin-left: 100px;
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

  .title-card {
    font-size: 18px;
  }

  .card {
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


</style>