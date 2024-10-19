<template>
  <div class="container">
    <h1>Công cụ tính BMI</h1>
    <q-input class="input" v-model="userHeight" label="Chiều cao" outlined type="number">
      <template v-slot:append>
        <span class="label-append">CM</span>
      </template>
    </q-input>
    <q-input class="input" v-model="userWeight" label="Cân nặng" outlined type="number">
      <template v-slot:append>
        <span class="label-append">KG</span>
      </template>
    </q-input>

    <q-btn class="btn" @click="calculateBMI">TÍNH TOÁN</q-btn>
    <div class="result-bmi" v-if="result && bmi">
      <div class="result-bmi">Chỉ số BMI của bạn: <strong>{{ bmi }}</strong></div>
      <div>{{ result.text }}</div>
      <router-link to="/fitness-package-type-service">
        <q-btn class="buy-now">MUA GÓI TẬP NGAY</q-btn>
      </router-link>
    </div>
  </div>
</template>


<script setup>
  import { ref } from 'vue'
  const userHeight = ref();
  const userWeight = ref();
  const bmi = ref();
  const result = ref({});
  const bmiOptions = [{
    minValue: 0,
    maxValue: 18.5,
    text: 'Bạn đang ở mức độ Gầy',
  },
  {
    minValue: 18.51,
    maxValue: 24.99,
    text: 'Bạn đang có chỉ số BMI ở mức BÌNH THƯỜNG. Hãy tiếp tục phát huy!',
  },
  {
    minValue: 25,
    maxValue: 29.99,
    text: 'Bạn đang ở mức độ TĂNG CÂN. Hãy tập thể dục!'
  },
  {
    minValue: 30,
    maxValue: 34.99,
    text: 'Bạn đang ở mức độ BÉO PHÌ 1. Hãy tập thể dục!'
  },
  {
    minValue: 35,
    maxValue: 39.99,
    text: 'Bạn đang ở mức độ BÉO PHÌ 2. Hãy tập thể dục!'
  },
  {
    minValue: 40,
    maxValue: 100,
    text: 'Bạn đang ở mức độ BÉO PHÌ 3. Hãy tập thể dục!'
  }]


  const calculateBMI = () => {
    const heightM = userHeight.value / 100;
    bmi.value = (userWeight.value / (heightM * heightM)).toFixed(2);
    result.value = bmiOptions.find((opt) => bmi.value >= opt.minValue && bmi.value <= opt.maxValue);
  }

</script>

<style scoped>
  h1 {
    font-size: 28px;
    text-align: center;
  }

  .container {
    width: 90%;
    margin: 0 auto;
  }

  .input {
    font-size: 18px;
    margin: 10px 0;
  }

  .label-append {
    font-size: 20px;
  }

  .btn {
    width: 100%;
    padding: 8px 0;
    background-color: #2B2D42;
    color: white;
    font-size: 18px;
  }

  .result-bmi {
    margin-top: 10px;
    font-size: 20px;
  }

  .buy-now {
    background-color: #D90429;
    padding: 10px 40px;
    color: aliceblue;
    margin: 0 auto;
    display: flex;
    margin-top: 10px;
  }

  a {
    text-decoration: none;
  }

</style>