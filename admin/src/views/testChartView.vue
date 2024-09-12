<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script>
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
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
import { computed, onBeforeMount, ref } from "vue";
import soldProductService from "../services/soldProduct.service";

export default {
  components: { Bar },
  setup() {
    const testYearly = ref([]);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    
    const chartData = computed(() => {
      return {
        labels: testYearly.value.map((item) => monthNames[item.month - 1]),
        datasets: [
          {
            label: "Thống kê doanh thu năm",
            backgroundColor: "#f87979   ",
            data: testYearly.value.map((item) => item.revenue),
          },
        ],
      };
    });
    const chartOptions = computed(() => ({
      responsive: true,
    }));

    
    onBeforeMount(async () => {
      try {
        testYearly.value = await soldProductService.getYearlyRevenue(2024);
      } catch (e) {
        console.log(e);
      }
    });

    return {
      chartData,
      chartOptions,
    };
  },
};
</script>
