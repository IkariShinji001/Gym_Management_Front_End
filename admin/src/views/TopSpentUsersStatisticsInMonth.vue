<template>
  <div>
    <div style="display: flex">
      <div style="margin-right: 50px">
        <q-select
          filled
          class="select"
          v-model="monthIsSelected"
          :options="months"
          label="Chọn tháng"
          style="width: 250px"
        />
      </div>
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
    </div>
    <div>
      <h4 v-if="showNotData">Không có dữ liệu thống kê</h4>
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
import statisticsService from "../services/statistics.service";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels // Đăng ký plugin
);

const monthIsSelected = ref("");
const yearIsSelected = ref("");
const months = ref([]);
const years = ref([]);
const loaded = ref();
const showNotData = ref();

const startMonth = 1;
const endMonth = 12;

const startYear = 2020;
const endYear = 2030;

for (let month = startMonth; month <= endMonth; month++) {
  months.value.push(month);
}

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
  if (monthIsSelected.value && yearIsSelected.value) {
    const response = await statisticsService.getTop10UsersBySpendingOfMonth(
      monthIsSelected.value,
      yearIsSelected.value
    );

    if (response.data === 0) {
      showNotData.value = true;
    } else {
      chartData.labels = [...response.data.labels];
      chartData.datasets[0].data = [...response.data.datasets[0].data];
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
        // text: "Khách hàng" + yearIsSelected.value,
      },
    },
    y: {
      title: {
        display: true,
        text: "Số tiền mua của khách",
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
        return Number(value).toLocaleString("en-US"); // Hiển thị giá trị của cột có dấu phẩy
      },
    },
  },
});

// Cập nhật title mỗi khi giá trị yearIsSelected thay đổi
watch([monthIsSelected, yearIsSelected], ([newMonthValue, newYearValue]) => {
  chartOptions.value.scales.x.title.text =
    "Tháng " + newMonthValue + " Năm " + newYearValue;
});
</script>