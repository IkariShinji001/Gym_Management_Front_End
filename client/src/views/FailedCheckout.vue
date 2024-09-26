<template>
  <div>
    <div class="circle"><q-icon class="check" name="cancel"></q-icon></div>
    <p>Thanh toán thất bại</p>
  </div>
</template>


<style scoped>
  .check {
    color: brown;
    font-size: 50px;
  }

  .circle {
    width: 100px;
    height: 100px;
    border-radius: 100%;
    border: 3px solid brown;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 50%;
    transform: translateX(-50%);
    margin-top: 200px;
  }

  p {
    text-align: center;
    font-size: 20px;
    margin-top: 10px;
  }



</style>