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
      <Bar style="height: 480px" v-if="loaded" :data="chartData" />
    </div>
  </div>
</template>
  
  <script setup>
import { onBeforeMount, ref, reactive, computed } from "vue";
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
import facilitiesService from "../services/facilities.service";
import maintenancesService from "../services/maintenance.service";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const facilityIsSelected = ref("");
const facilities = ref([]);
const yearIsSelected = ref("");
const years = ref([]);
const loaded = ref();
const isClick = ref();

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

// Define the chart data using ref for reactivity
// const chartData = ref({
//   labels: ["January", "February", "March"],
//   datasets: [
//     {
//       label: "Data One",
//       backgroundColor: "#f87979",
//       data: [40, 20, 12],
//     },
//   ],
// });

onBeforeMount(async () => {
  facilities.value = await facilitiesService.findAll();
});

// const viewStatistics = async computed(() => {
//   const response = await maintenancesService.countMaintenancesByMonth(
//     facilityIsSelected.value,
//     yearIsSelected.value
//   );
//   console.log(response);
//   chartData.labels = [...response.labels];
//   chartData.datasets[0].data = [...response.datasets[0].data];
//   loaded.value = true;
//   console.log(chartData);
// });

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
    return chartData;
  }
});
</script>

<style scoped>
.select {
  height: 30px;
}
</style>