<template>
  <div class="container-statistic">
    <div>
      <h4>Thống kê số lần bảo trì của thiết bị trong năm</h4>
      <div class="container-input">
        <div style="margin-right: 50px">
          <p class="label">Chọn thiết bị</p>
          <q-select
            filled
            v-model="facilityIsSelected"
            :options="facilities"
            map-options
            emit-value
            label="Thiết bị"
            option-value="id"
            option-label="name"
            style="width: 250px"
          />
        </div>
        <div>
          <p class="label">Chọn năm</p>
          <q-select
            filled
            class="select"
            v-model="yearIsSelected"
            :options="years"
            map-options
            emit-value
            label="Năm"
            option-value="id"
            option-label="name"
            style="width: 250px"
            @click="viewStatistics"
          />
        </div>
      </div>
      <div v-if="showNotData">
        <h5>Không có dữ liệu thống kê</h5>
      </div>
      <div>
        <Bar
          style="height: 450px"
          v-if="loaded"
          :data="chartData"
          :options="chartOptions"
          plugins="[ChartDataLabels]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, reactive, computed, watch } from "vue";
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
import facilitiesService from "../services/facilities.service";
import maintenancesService from "../services/maintenance.service";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels // Đăng ký plugin
);

const facilityIsSelected = ref("");
const facilities = ref([]);
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
      label: "Số lần bảo trì của thiết bị",
      backgroundColor: "#f87979",
      data: [],
    },
  ],
});

// Tải danh sách thiết bị
onBeforeMount(async () => {
  facilities.value = await facilitiesService.findAll();
});

// Hàm xem thống kê
const viewStatistics = computed(async () => {
  loaded.value = false;
  if (facilityIsSelected.value && yearIsSelected.value) {
    const response = await maintenancesService.countMaintenancesByMonth(
      facilityIsSelected.value,
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
        text: "Năm " + yearIsSelected.value,
      },
    },
    y: {
      title: {
        display: true,
        text: "Số lần bảo trì",
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