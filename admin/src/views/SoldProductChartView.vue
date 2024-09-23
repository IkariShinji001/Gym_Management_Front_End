<template>
  <div>
    <div class="select-container">
      <div class="date-container">
        <div class="date-label">Thống kê theo ngày:</div>
        <div class="date-input-container">
          <q-input
            class="date-input"
            outlined
            v-model="dateInput"
            mask="##/##/####"
            label="Chọn ngày"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="date-icon">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="dateInput"
                    mask="DD/MM/YYYY"
                    @input="formatDate"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Chọn" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <button class="btn-class" @click="handleGetBillOfDate">
            Thống kê
          </button>
        </div>
      </div>
      <div class="month-year-container">
        <div class="month-year-label">Thống kê theo ngày:</div>
        <div class="month-year-select-container">
          <q-select
            class="month-select"
            filled
            color="purple-12"
            v-model="selectedMonth"
            :options="monthList"
            label="Label"
          >
            <template v-slot:prepend>
              <q-icon class="month-year-icon" name="event" />
            </template>
          </q-select>
          <q-select
            class="year-select"
            filled
            color="purple-12"
            v-model="selectedYear"
            :options="yearList"
            label="Label"
          >
            <template v-slot:prepend>
              <q-icon class="month-year-icon" name="event" />
            </template>
          </q-select>
          <button class="btn-class" @click="handleGetRevenueStatsByMonthYear">
            Thống kê
          </button>
        </div>
      </div>
    </div>
    <div class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <q-dialog v-model="showBillOfDate">
      <q-card class="dialog-card">
        <q-card-section>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div class="one-sold-product-container bill-header">
            <p class="product-name">Tên sản phẩm</p>
            <p class="product-quantity">Số lượng</p>
            <p class="product-price">Tổng giá (VND)</p>
          </div>
          <div v-for="product in soldProductOnDateList">
            <div class="one-sold-product-container">
              <p class="product-name">{{ product.supplementproductname }}</p>
              <p class="product-quantity">{{ product.totalquantity }}</p>
              <p class="product-price">{{ product.totalprice }}</p>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="bill-footer">
           Tổng hóa đơn: {{ dateRevenue }} VND
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
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

import { computed, onBeforeMount, ref } from "vue";
import soldProductService from "../services/soldProduct.service";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);
export default {
  components: { Bar },
  setup() {
    const dateInput = ref();
    const dateRevenue = ref();
    const allDayOfMonthRevenue = ref([]);
    const currentYear = ref(new Date().getFullYear());
    const selectedMonth = ref(new Date().getMonth() + 1);
    const selectedYear = ref(new Date().getFullYear());
    const startYear = 2010;
    const showBillOfDate = ref(false);

    const monthList = Array.from({ length: 13 }, (_, index) => index);
    const yearList = Array.from(
      { length: currentYear - startYear + 1 },
      (_, index) => startYear + index
    );
    const allMonthOfYearRevenue = ref([]);
    const soldProductOnDateList = ref([]);
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
      if (allDayOfMonthRevenue.value.length) {
        return {
          labels: allDayOfMonthRevenue.value.map((item) => item.day),
          datasets: [
            {
              label: "Thống kê doanh thu tháng",
              backgroundColor: "#16423C",
              data: allDayOfMonthRevenue.value.map((item) => item.revenue),
            },
          ],
        };
      } else {
        return {
          labels: allMonthOfYearRevenue.value.map(
            (item) => monthNames[item.month - 1]
          ),
          datasets: [
            {
              label: "Thống kê doanh thu năm",
              backgroundColor: "#16423C",
              data: allMonthOfYearRevenue.value.map((item) => item.revenue),
            },
          ],
        };
      }
    });

    const chartOptions = computed(() => {
      if (allDayOfMonthRevenue.value.length) {
        return {
          responsive: true,
          plugins: {
            datalabels: {
              anchor: "end",
              align: "top",
              color: "#33372C",
              formatter: (value) => `${value}`,
              font: {
                weight: "bold",
                size: 10,
                style: "italic",
              },
              rotation: -70,
            },
          },
        };
      } else {
        return {
          responsive: true,
          plugins: {
            datalabels: {
              anchor: "end",
              align: "top",
              color: "#33372C",
              formatter: (value) => `${value}`,
              font: {
                weight: "bold",
                size: 11,
              },
            },
          },
        };
      }
    });

    onBeforeMount(async () => {
      try {
        allMonthOfYearRevenue.value = await soldProductService.getYearlyRevenue(
          selectedYear.value
        );
      } catch (e) {
        console.log(e);
      }
    });

    const formatDate = (date) => {
      if (date) {
        const [year, month, day] = date.split("-");
        dateInput.value = `${day}/${month}/${year}`;
      }
    };

    async function hanleGetAllDayOfMonthRevenue() {
      try {
        allDayOfMonthRevenue.value =
          await soldProductService.getAllDayOfMonthRevenue(
            selectedMonth.value,
            selectedYear.value
          );
        console.log(allDayOfMonthRevenue.value);
      } catch (e) {
        console.log(e);
      }
    }

    async function handleSelectedYearRevenue() {
      try {
        allMonthOfYearRevenue.value = await soldProductService.getYearlyRevenue(
          selectedYear.value
        );
        console.log(allMonthOfYearRevenue.value);
        allDayOfMonthRevenue.value = [];
      } catch (e) {
        console.log(e);
      }
    }

    async function handleGetRevenueStatsByMonthYear() {
      if (selectedMonth.value === 0) {
        handleSelectedYearRevenue();
      } else {
        hanleGetAllDayOfMonthRevenue();
      }
    }

    async function handleGetBillOfDate() {
      try {
        if (dateInput.value) {
          dateRevenue.value = await soldProductService.getRevenueByDate(
            dateInput.value
          );

          soldProductOnDateList.value =
            await soldProductService.getAllSoldProductOnDate(dateInput.value);
          console.log(soldProductOnDateList.value);
          console.log(dateRevenue.value);
          showBillOfDate.value = true;
        }
      } catch (e) {
        console.log(e);
      }
    }

    return {
      chartData,
      chartOptions,
      selectedMonth,
      selectedYear,
      dateInput,
      dateRevenue,
      showBillOfDate,

      monthList,
      yearList,
      soldProductOnDateList,

      formatDate,
      handleGetBillOfDate,
      handleSelectedYearRevenue,
      hanleGetAllDayOfMonthRevenue,
      handleGetRevenueStatsByMonthYear,
    };
  },
};
</script>

<style scoped>
/* <==== Date--Month-Year-Choosen ====> */
.select-container {
  display: flex;
  justify-content: space-between;
  padding: 0 100px;
}

.select-container .date-container .date-label {
  font-size: 18px;
  color: var(--icon-color);
}
.select-container .date-container .date-input-container {
  display: flex;
  gap: 10px;
}
.select-container .date-container .date-input .date-icon {
  color: var(--icon-color);
}

.select-container .month-year-container {
  /* border: 1px solid black; */
  margin-right: 20px;
}
.select-container .month-year-container .month-year-label {
  font-size: 18px;
  color: var(--icon-color);
}
.select-container .month-year-container .month-year-icon {
  color: var(--icon-color);
}
.select-container .month-year-container .month-year-select-container {
  /* border: 1px solid black; */
  display: flex;
  gap: 10px;
}
.select-container
  .month-year-container
  .month-year-select-container
  .month-select,
.year-select {
  width: 150px;
}
.btn-class {
  cursor: pointer;
  width: 80px;
  border: none;
  background: none;
  border-left: 2px solid var(--icon-color);
  color: var(--icon-color);

  font-size: 16px;
}

/* <==== Chart ====> */
.chart-container {
  min-height: 300px;
  max-height: 470px;
}

/* <==== Dialog ====> */
.dialog-card {
  min-width: 400px;
}

.dialog-card .bill-header{
  font-weight: bold;
  font-size: 16px;
}
.dialog-card .one-sold-product-container {
  display: flex;
}

.dialog-card .one-sold-product-container .product-name, .product-price {
  flex-basis: 40%;
  display: flex;
  justify-content: center;
}


.dialog-card .one-sold-product-container .product-quantity {
  flex-basis: 20%;
  display: flex;
  justify-content: center;
}         

.dialog-card .bill-footer{
  font-size: 16px;
  color: rgb(65, 65, 65);
  display: flex;
  justify-content: end;
  padding: 0 30px;
}
</style>
