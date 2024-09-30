<template>
  <div>
    <div style="display: flex">
      <div style="margin-right: 50px">
        <q-input
          filled
          type="date"
          v-model="startDate"
          label="Từ ngày"
          style="width: 250px"
        />
      </div>
      <div style="margin-right: 50px">
        <q-input
          filled
          type="date"
          v-model="endDate"
          label="Đến ngày"
          style="width: 250px"
          @click="viewStatistics"
        />
      </div>
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
import { ref, reactive, computed } from "vue";
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
import { useToast } from "vue-toastification";

// Register necessary components for the Line chart
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const toast = useToast();
const startDate = ref();
const endDate = ref();
const loaded = ref();

const chartData = reactive({
  labels: [],
  datasets: [
    {
      label: "Thống kê doanh thu theo ngày",
      backgroundColor: "#FF0000",
      borderColor: "#FF0000", // Màu của đường kẻ
      data: [],
      fill: true, // Bật tính năng tô màu dưới đường
      tension: 0.3, // Độ cong cho đường biểu đồ
    },
  ],
});

// Hàm tính số ngày giữa hai ngày
function calculateDaysDifference(start, end) {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const differenceInTime = endTime - startTime;
  return differenceInTime / (1000 * 3600 * 24);
}

const viewStatistics = computed(async () => {
  loaded.value = false;
  if (startDate.value && endDate.value) {
    const daysDifference = calculateDaysDifference(
      startDate.value,
      endDate.value
    );
    if (daysDifference > 6) {
      toast.error("Không được chọn quá 7 ngày");
    } else {
      const res = await statisticsService.revenueByDayFromBills(
        startDate.value,
        endDate.value
      );
      console.log(res);
      chartData.labels = [...res.labels];
      chartData.datasets[0].data = [...res.datasets[0].data];
      console.log(chartData);
      loaded.value = true;
      // return chartData;
    }
  }
});

const chartOptions = ref({
  responsive: true,
  scales: {
    x: {
      title: {
        display: true,
        text: "Ngày",
      },
    },
    y: {
      title: {
        display: true,
        text: "Doanh thu theo ngày",
      },

      min: 0, // Đặt giá trị tối thiểu của trục y là 0 để không hiển thị các giá trị âm
    },
  },
});
</script>