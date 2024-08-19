<template>
  <div class="container">
    <div class="header-login">
      <h2 class="header">Đăng nhập</h2>
      <p class="header-child">Đăng nhập vào hệ thống GYM</p>
    </div>

    <form>
      <div class="form-group">
        <label class="label" for="email">Email</label>
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="Nhập email"
          name="email"
        />
      </div>
      <div class="form-group">
        <label class="label" for="pwd">Mật khẩu</label>
        <input
          type="password"
          class="form-control"
          id="pwd"
          placeholder="Nhập mật khẩu"
          name="pswd"
        />
      </div>
      <div>
        <q-btn label="Đăng nhập" clo type="submit" class="btn btn-submit" />
      </div>
    </form>
  </div>
</template>

<script>
export default {};
</script>

<style>
.container {
  width: 40%;
  margin-top: 50px;
  margin-left: 5%;
  padding: 20px;
  border-radius: 10px;
}

.header-login{
  margin-top: 0;
    margin-bottom: 15%;
}

body {
  background-image: url("../../public/assets/images/backgroundLogin.jpg");
  height: 550px;
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
  margin-top: 0;}

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
