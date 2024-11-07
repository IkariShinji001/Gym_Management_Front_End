<template>
  <div class="container-statistic">
    <div>
      <h4>Thống kê doanh thu theo năm</h4>
      <div class="container-input">
        <div>
          <p class="label">Chọn năm</p>
          <q-select
            filled
            class="select"
            v-model="yearIsSelected"
            :options="years"
            label="Năm"
            style="width: 250px"
            @click="viewStatistics"
          />
        </div>
      </div>
      <div v-if="showNotData">
        <h5>Không có dữ liệu thống kê</h5>
      </div>
      <div>
        <Line
          style="height: 450px"
          v-if="loaded"
          :data="chartData"
          :options="chartOptions"
        />
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, reactive, computed, watch } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import statisticsService from "../services/statistics.service";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels // Đăng ký plugin
);

const yearIsSelected = ref("");
const years = ref([]);
const loaded = ref(false);
const showNotData = ref(true);

const startYear = 2020;
const endYear = 2030;

for (let year = startYear; year <= endYear; year++) {
  years.value.push(year);
}

const chartData = reactive({
  labels: [],
  datasets: [
    {
      label: "Doanh thu tháng",
      backgroundColor: "#FF0000",
      borderColor: "#FF0000", // Màu của đường biểu đồ
      data: [],
      fill: true, // Bật tính năng tô màu dưới đường
      tension: 0.3, // Độ cong cho đường biểu đồ
    },
  ],
});

// Hàm xem thống kê
const viewStatistics = computed(async () => {
  loaded.value = false;
  if (yearIsSelected.value) {
    const response = await statisticsService.revenueByYearFromBills(
      yearIsSelected.value
    );
    chartData.labels = [...response.labels];
    chartData.datasets[0].data = [...response.datasets[0].data];
    showNotData.value = false;
    loaded.value = true;
  }
});

// Tùy chọn biểu đồ
const chartOptions = ref({
  responsive: true,
  scales: {
    x: {
      title: {
        display: true,
        text: "Năm " + yearIsSelected.value, // Ban đầu hiển thị giá trị trống
      },
    },
    y: {
      title: {
        display: true,
        text: "Doanh thu tháng",
      },

      min: 0, // Đặt giá trị tối thiểu của trục y là 0 để không hiển thị các giá trị âm
    },
  },
  plugins: {
    datalabels: {
      anchor: "end", // Đặt vị trí của nhãn
      align: "end", // Căn chỉnh với cột
      color: "#000", // Màu của nhãn
      font: {
        weight: "bold",
      },
      formatter: (value) => {
        return Number(value).toLocaleString("en-US"); // Hiển thị giá trị của cột có dấu phẩy
      },
    },
  },
});

// Cập nhật title mỗi khi giá trị yearIsSelected thay đổi
watch(yearIsSelected, (newValue) => {
  chartOptions.value.scales.x.title.text = "Năm " + newValue;
});
</script>

<style scoped>
.container-statistic {
  display: flex;
  justify-content: center;
  margin-left: 20px;
  margin-right: 20px;
}
h4 {
  text-align: center;
  margin: 15px;
  color: var(--icon-color);
}
.container-input {
  display: flex;
  justify-content: center;
}
.label {
  text-align: center;
  margin-bottom: 5px;
  font-size: 18px;
  color: var(--icon-color);
}
h5 {
  border: 1px solid black;
  text-align: center;
}
</style>