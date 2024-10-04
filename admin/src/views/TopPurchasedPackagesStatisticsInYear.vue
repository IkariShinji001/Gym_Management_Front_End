<template>
  <div>
    <div style="margin-right: 50px">
      <q-select
        filled
        class="select"
        v-model="yearIsSelected"
        :options="years"
        label="Chọn năm"
        style="width: 250px"
        @click="viewStatistics"
      />
    </div>
    <div v-if="showNotData">
      <h4>Không có dữ liệu thống kê</h4>
    </div>
    <div>
      <Bar
        style="height: 480px"
        v-if="loaded"
        :data="chartData"
        :options="chartOptions"
        plugins="[ChartDataLabels]"
      />
    </div>
  </div>
</template>
  
  <script setup>
import { ref, reactive, computed, watch } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import statisticsServices from "../services/statistics.service";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels // Đăng ký plugin
);
const yearIsSelected = ref("");
const years = ref([]);
const loaded = ref();
const showNotData = ref();
const startYear = 2020;
const endYear = 2030;

for (let year = startYear; year <= endYear; year++) {
  years.value.push(year);
}

const chartData = reactive({
  labels: [],
  datasets: [
    {
      label: "",
      backgroundColor: "#f87979",
      data: [],
    },
  ],
});

// Hàm xem thống kê
const viewStatistics = computed(async () => {
  showNotData.value = false;
  loaded.value = false;
  if (yearIsSelected.value) {
    const response = await statisticsServices.getTopPurchasedPackagesOfYear(
      yearIsSelected.value
    );
    if (response === 0) {
      showNotData.value = true;
    } else {
      chartData.labels = [...response.labels];
      chartData.datasets[0].data = [...response.datasets[0].data];
      loaded.value = true;
    }
  }
});

// Tùy chọn biểu đồ
const chartOptions = ref({
  responsive: true,
  scales: {
    x: {
      title: {
        display: true,
      },
    },
    y: {
      title: {
        display: true,
        text: "Số lượng gói được mua",
      },
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
        return value; // Hiển thị giá trị của cột
      },
    },
  },
});

// Cập nhật title mỗi khi giá trị yearIsSelected thay đổi
watch(yearIsSelected, (newValue) => {
  chartOptions.value.scales.x.title.text = "Năm " + newValue;
});
</script>