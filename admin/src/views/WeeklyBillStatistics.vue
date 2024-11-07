<template>
  <div class="container-statistic">
    <div>
      <h4>Thống kê doanh thu theo ngày</h4>
      <div class="container-input">
        <div style="margin-right: 50px">
          <p class="label">Chọn ngày bắt đầu</p>
          <q-input
            filled
            type="date"
            v-model="startDate"
            label="Từ ngày"
            style="width: 250px"
          />
        </div>
        <div>
          <p class="label">Chọn ngày kết thúc</p>
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
import { useToast } from "vue-toastification";

// Register necessary components for the Line chart
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

const toast = useToast();
const startDate = ref();
const endDate = ref();
const loaded = ref();
const showNotData = ref(true);

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
  return differenceInTime / (1000 * 3600 * 24) + 1;
}

watch([startDate, endDate], async () => {
  loaded.value = false;
  if (startDate.value && endDate.value) {
    const daysDifference = calculateDaysDifference(
      startDate.value,
      endDate.value
    );
    console.log(daysDifference);
    // if (daysDifference > 7) {
    //   toast.error("Không được chọn quá 7 ngày");
    // } else {
    //   if (daysDifference <= 0) {
    //     toast.error("Ngày bắt đầu không được sau ngày kết thúc");
    //   } else {
        
    //   }
    // }
    const res = await statisticsService.revenueByDayFromBills(
          startDate.value,
          endDate.value
        );
        console.log(res);
        chartData.labels = [...res.labels];
        chartData.datasets[0].data = [...res.datasets[0].data];
        console.log(chartData);
        showNotData.value = false;
        loaded.value = true;
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