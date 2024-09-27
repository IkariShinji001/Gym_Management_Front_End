<template>
  <div class="container">
    <div class="header-login">
      <h2 class="header">Đăng nhập</h2>
      <p class="header-child">Đăng nhập vào hệ thống GYM</p>
    </div>

    <form>
      <div class="form-group">
        <label class="label" for="email">Email</label>
        <input type="email" class="form-control" placeholder="Nhập email" v-model="userInfo.email" />
      </div>
      <div class="form-group">
        <label class="label" for="pwd">Mật khẩu</label>
        <input type="password" class="form-control" placeholder="Nhập mật khẩu" v-model="userInfo.password" />
      </div>
      <div>
        <q-btn @click="handleLogin" label="Đăng nhập" class="btn btn-submit" />
      </div>
    </form>
  </div>
</template>

<script>

  import authService from "../services/auth.service";
  import { reactive } from "vue";
  import { useRouter } from "vue-router";
  import { jwtDecode } from "jwt-decode";

  export default {
    setup() {
      const router = useRouter();
      const userInfo = reactive({ email: "", password: "" });
      const handleLogin = async () => {
        try {
          // check null
          if (userInfo.email === "" || userInfo.password === "") {
            alert('Email or password is empty')
          }

          const response = await authService.login(userInfo.email, userInfo.password);
          const payload = jwtDecode(response.access_token);
          localStorage.setItem("role", payload.role)
          console.log(payload)
          alert('Login successfully')
          router.push("/admins");
        } catch (error) {
          alert('Login fail')
          console.log(error);
        }

      };


      return { userInfo, handleLogin };
    },
  };


</script>

<style scoped>
  .container {
    width: 40%;
    /* margin-top: 50px; */
    margin-left: 13%;
    padding: 20px;
    border-radius: 10px;
  }

  .header-login {
    margin-top: 0;
    margin-bottom: 15%;
  }

  body {
    /* background-image: url("../../assets/images/backgroundLogin.jpg"); */
    height: 100vh;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    font-family: "Work Sans", sans-serif;
    font-optical-sizing: auto;
  }

  .header {
    margin-bottom: 15px;
    margin-left: 55px;
    margin-top: 0;
  }

  .header-child {
    font-size: 25px;
    margin-left: 45px;
    margin-top: 0;
  }

  .label {
    font-size: 30px;
    display: block;
    text-align: left;
  }

  .form-control {
    width: 70%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #f6f1f1;
    box-sizing: border-box;
  }

  .btn-submit {
    width: 70%;
    margin-top: 20px;
    font-size: 20px;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: black;
  }
</style>
