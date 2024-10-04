<template>
  <div>
    <div style="display: flex">
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

      <!-- <div>
        <q-btn
          style="height: 52px"
          icon="search"
          label="Xem thống kê"
          @click="viewStatistics"
        />
      </div> -->
    </div>
    <div>
      <Line
        style="height: 480px"
        v-if="loaded"
        :data="chartData"
        :options="chartOptions"
      />
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
import statisticsService from "../services/statistics.service";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const yearIsSelected = ref("");
const years = ref([]);
const loaded = ref(false);

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
});

// Cập nhật title mỗi khi giá trị yearIsSelected thay đổi
watch(yearIsSelected, (newValue) => {
  chartOptions.value.scales.x.title.text = "Năm " + newValue;
});
</script>