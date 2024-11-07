<template>
  <div class="page-container">
    <div class="container">
      <div class="header-login">
        <p class="header">Đăng nhập</p>
        <p class="header-child">Đăng nhập vào hệ thống GYM</p>
      </div>

      <form>
        <div class="form-container">
          <div class="form-group">
            <label class="label" for="email">Email</label>
            <input
              type="email"
              class="form-control"
              placeholder="Nhập email"
              v-model="userInfo.email"
            />
          </div>
          <div class="form-group">
            <label class="label" for="pwd">Mật khẩu</label>
            <input
              type="password"
              class="form-control"
              placeholder="Nhập mật khẩu"
              v-model="userInfo.password"
            />
          </div>
          <div class="btn-container">
            <q-btn
              @click="handleLogin"
              label="Đăng nhập"
              class="btn btn-submit"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import authService from "../services/auth.service";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";
import { useQuasar } from "quasar";

export default {
  setup() {
    const router = useRouter();
    const userInfo = reactive({ email: "", password: "" });
    const $q = useQuasar();
    const handleLogin = async () => {
      try {
        if (userInfo.email === "" || userInfo.password === "") {
          $q.notify({
            position: "top",
            color: "negative",
            message: "Email hoặc mật khẩu không được để trống",
          });
          // alert("Email or password is empty");
        }

        const response = await authService.login(
          userInfo.email,
          userInfo.password
        );
        const payload = jwtDecode(response.access_token);
        localStorage.setItem("role", payload.role);
        localStorage.setItem("id", payload.id);

        $q.notify({
          message: "Đăng nhập thành công",
          color: "positive",
          position: "top",
        });
        // alert("Login successfully");
        router.push({ path: "/admins/blogs" });
      } catch (error) {
        $q.notify({
          position: "top",
          color: "negative",
          message: "Kiểm tra lại thông tin đăng nhập",
        });
        // alert("Login fail");
        console.log(error);
      }
    };

    return { userInfo, handleLogin };
  },
};
</script>

<style scoped>
.page-container {
  width: 100%;
  height: 100vh;
  background-image: url("https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgp4t1dUltum1JCxEbULx1yEqH4kSxP8IPShyp-GUb8ZOSlEqg9TuPjxvTBCKwFuUgiakUCoel5DA6C4rr1NjCtTcEl8jopwkPVSR-dVMDnttSxzRlbo0SdYCHmPSo73eaRNx1a4UdwqNIM/s1600-rw/MInimalist-landscape-wallpaper-night-moon-desktop-hd.png");
  background-repeat: no-repeat;
  background-size: cover;
}
.container {
  background: white;
  position: absolute;
  top: 40px;
  left: 120px;
  width: 40%;
  padding: 20px;
  border-radius: 10px;
}

.header {
  font-size: 50px;
  text-align: center;
}

.header-child {
  font-size: 25px;
  text-align: center;
}

.form-container{
  margin: auto;
  width: 90%;
}
.label {
  font-size: 25px;
  display: block;
  text-align: left;
}

.form-control {
  width: 80%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #f6f1f1;
  box-sizing: border-box;
}

.btn-container{
  display: flex ;
  justify-content: center;
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
