<template>
  <h1>Lịch sử tập luyện</h1>

  <div class="date-input">
    <q-input class="input" v-model="startDate" type="date" outlined label="Từ ngày"></q-input>
    <q-input class="input" v-model="endDate" type="date" outlined label="Đến ngày"></q-input>
  </div>
  <q-btn class="btn" @Click="getEntryTime">XEM THÔNG TIN</q-btn>


  <table>
    <thead>
      <tr>
        <th class="stt">STT</th>
        <th class="hour">Thời gian vào cửa</th>
        <th class="date">Ngày vào cửa</th>
      </tr>
    </thead>

    <tbody class="tbody" v-if="listEntryTimes.length > 0">
      <tr v-for="(time, index) in listEntryTimes">
        <td class="stt">{{ index + 1 }}</td>
        <td class="hour">{{ getHour(time.entry_time) }}</td>
        <td class="date">{{ getDate(time.entry_time) }}</td>
      </tr>
    </tbody>
  </table>


</template>

<script setup>
  import { onBeforeMount, ref } from 'vue';
  import { formatDate } from '../shared/formatDate';
  import { getDate, getHour } from '../shared/formatTime';
  import userService from '../services/user.service';
  const username = localStorage.getItem('username');
  const now = new Date(Date.now());
  let userId;
  now.setMonth(now.getMonth() - 1);
  const endDate = ref(formatDate(new Date(Date.now())));
  const startDate = ref(formatDate(now));
  const listEntryTimes = ref([]);



  const getEntryTime = async () => {
    try {
      listEntryTimes.value = await userService.getAllEntryTime(userId, startDate.value, endDate.value);
    } catch (error) {
      console.error(error);
    }
  }


  onBeforeMount(async () => {
    const res = await userService.getUserByUsername(username);
    userId = res.id;
    listEntryTimes.value = await userService.getAllEntryTime(res.id, startDate.value, endDate.value);
  })
</script>


<style scoped>
  h1 {
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    margin: 0;
  }

  .date-input {
    display: flex;
    justify-content: space-around;
  }

  .input {
    width: 45%;
  }

  .btn {
    background-color: #2b2d42;
    color: white;
    width: 95%;
    display: flex;
    margin: 0 auto;
    margin-top: 10px;
    padding: 5px 0;
  }

  table {
    width: 90%;
    margin: 0 auto;
    margin-top: 20px;
    border-collapse: collapse;
  }

  th {
    font-size: 16px;
    text-align: left;
  }

  tr:nth-child(even) {
    background-color: aliceblue;
    border-radius: 4px;
  }

  .stt {
    width: 20%;
  }

  .hour {
    width: 40%;
  }

  .date {
    width: 40%;
  }

  .tbody {
    display: block;
    max-height: 300px;
    /* Thiết lập chiều cao tối đa của tbody */
    overflow-y: scroll;
    /* Cho phép cuộn theo chiều dọc */
  }

  .tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
    /* Đảm bảo rằng các cột sẽ có kích thước cố định */
  }

  thead {
    display: table;
    width: 100%;
    table-layout: fixed;
  }


</style>