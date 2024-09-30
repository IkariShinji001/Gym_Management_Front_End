<template>
  <div>
    <div style="display: flex">
      <div style="margin-right: 50px">
        <q-select
          filled
          v-model="facilityIsSelected"
          :options="facilities"
          map-options
          emit-value
          label="Chọn thiết bị"
          option-value="id"
          option-label="name"
          style="width: 250px"
        />
      </div>
      <div style="margin-right: 50px">
        <q-select
          filled
          class="select"
          v-model="yearIsSelected"
          :options="years"
          map-options
          emit-value
          label="Chọn năm"
          option-value="id"
          option-label="name"
          style="width: 250px"
          @click="viewStatistics"
        />
      </div>
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
import ChartDataLabels from 'chartjs-plugin-datalabels';
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
      anchor: 'end', // Đặt vị trí của nhãn
      align: 'end',  // Căn chỉnh với cột
      color: '#000', // Màu của nhãn
      font: {
        weight: 'bold',
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