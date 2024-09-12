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
    <li class="li">
      <q-icon class="icons" name="account_circle"></q-icon>
      <p>Thông tin cá nhân</p>
    </li>
    <router-link :to="`/entry-times`">
      <li class="li">
        <q-icon class="icons" name="work_history"></q-icon>
        <p>Lịch sử tập gym</p>
      </li>
    </router-link>
    <router-link :to="`/create-face-login`">
      <li class="li">
        <q-icon class="icons" name="sensor_occupied"></q-icon>
        <p>Đăng ký nhận diện khuôn mặt</p>
      </li>
    </router-link>


    <li id="signout">
      <p class="sign-out-btn">Đăng xuất</p>
    </li>
  </ul>

</template>


<script setup>
  import { onBeforeMount, ref } from 'vue';
  import userService from '../services/user.service';
  const user = ref()
  const userId = localStorage.getItem('userId');
  console.log(userId)
  onBeforeMount(async () => {
    user.value = await userService.getUserById(userId)
    console.log(user.value);
  })

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
</style>