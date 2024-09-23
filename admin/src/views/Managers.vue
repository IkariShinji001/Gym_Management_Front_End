<template>
  <section>
    <h1>Quản lý Managers</h1>
    <div class="input-search">
      <q-input
        class="input"
        outlined
        v-model="search"
        label="Tìm kiếm nhân viên"
      />
      <q-btn class="add" color="primary" @click="handleOpenCreateDialog"
        >Thêm nhân viên</q-btn
      >
    </div>

    <table>
      <tr class="heading-table">
        <th>STT</th>
        <th>Họ và tên</th>
        <th>Email</th>
        <th>Số điện thoại</th>
        <th>Vị trí</th>
        <th>Chức năng</th>
      </tr>

      <tr v-for="(manager, index) in paginatedManagers" :key="manager.id">
        <td>{{ index + 1 }}</td>
        <td>{{ manager.profile.fullName }}</td>
        <td>{{ manager.profile.email }}</td>
        <td>{{ manager.profile.phoneNumber }}</td>
        <td>{{ manager.profile.role }}</td>
        <td class="function">
          <q-icon
            class="icons"
            @click="handleOpenUpdateDialog(manager.id)"
            name="update"
          ></q-icon
          ><q-icon
            class="icons"
            @click="handleDelete(manager.id)"
            name="delete"
          ></q-icon>
        </td>
      </tr>
      <q-pagination
        v-model="currentPage"
        :max="totalPages"
        :rows-per-page="rowsPerPage"
        @update:model-value="updatePage"
      />
    </table>

    <!-- Dialog cho thêm nhân viên -->
    <q-dialog v-model="openCreateDialog">
      <q-card class="modal">
        <q-card-section>
          <q-card-title>
            <q-icon name="add"></q-icon>
            <span>Thêm nhân viên</span>
          </q-card-title>
          <q-card-section>
            <q-input
              v-model="managerInput.profile.fullName"
              label="Họ và tên"
              outlined
            />
            <q-input
              v-model="managerInput.profile.email"
              label="Email"
              outlined
            />
            <q-input
              v-model="managerInput.profile.phoneNumber"
              label="Số điện thoại"
              outlined
            />

            <q-input
              v-model="managerInput.profile.password"
              label="Mật khẩu"
              outlined
            />
          </q-card-section>
          {{ managerInput }}
          <q-card-actions class="action">
            <q-btn
              class="btn"
              color="primary"
              label="Lưu"
              @click="handleAdd"
            ></q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Dialog cho cap nhat quan ly -->
    <q-dialog v-model="openUpdateDialog">
      <q-card class="modal">
        <q-card-section>
          <q-card-title>
            <q-icon name="update"></q-icon>
            <span>Cập nhật quản lý</span>
          </q-card-title>
          <q-card-section>
            <q-input
              v-model="managerInput.profile.fullName"
              label="Họ và tên"
              outlined
            />
            <q-input
              v-model="managerInput.profile.email"
              label="Email"
              outlined
            />
            <q-input
              v-model="managerInput.profile.phoneNumber"
              label="Số điện thoại"
              outlined
            />
            <q-input
              v-model="managerInput.profile.password"
              label="Mật khẩu"
              outlined
            />
          </q-card-section>
          <q-card-actions class="action">
            <q-btn
              class="btn"
              color="primary"
              label="Lưu"
              @click="handleUpdate"
            ></q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { computed, onBeforeMount, reactive, ref } from "vue";
import managersService from "../services/managers.service";

const search = ref("");
const openCreateDialog = ref(false);
const openUpdateDialog = ref(false);
const currentPage = ref(1);
const rowsPerPage = ref(10);

const managers = ref([]);
const managerInput = ref({
  profile: {
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "manager",
    password: "",
  },
});
const managerUpdate = ref({
  id: "",
  profile: {
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "manager",
  },
});
onBeforeMount(async () => {
  managers.value = await managersService.getAllManager();
});

const handleOpenCreateDialog = () => {
  openCreateDialog.value = true;
};
const handleAdd = async () => {
  await managersService.createManager(managerInput.value.profile);
  managers.value = await managersService.getAllManager();
  openCreateDialog.value = false;
};
const handleOpenUpdateDialog = (id) => {
  console.log(id);
};
const handleUpdate = async () => {};
const handleDelete = async (id) => {
  await managersService.deleteManager(id);
  managers.value = managers.value.filter((manager) => manager.id !== id);
};
const filteredManagers = computed(() => {
  if (!search.value) return managers.value;
  return managers.value.filter((manager) => {
    return manager.profile.fullName
      .toLowerCase()
      .includes(search.value.toLowerCase());
  });
});
const totalPages = computed(() => {
  return Math.ceil(filteredManagers.value.length / rowsPerPage.value);
});

const paginatedManagers = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return filteredManagers.value.slice(start, end);
});

const updatePage = (page) => {
  currentPage.value = page;
};
</script>
<!-- 
<style>
h1 {
  text-align: center;
  font-size: 30px;
  margin-bottom: 20px;
}
.input-search {
  display: flex;
  margin: 0 50px;
  justify-content: space-around;
}
.input {
  width: 70%;
  font-size: 18px;
}
.add {
  width: 18%;
}

table {
  width: 85%;
  margin-top: 20px;
  margin-left: 20px;
}
tr:nth-child(even) {
  background-color: aliceblue;
}

.modal {
  min-width: 700px;
}

.icons {
  margin: 0 10px;
  cursor: pointer;
}
th {
  font-size: 20px;
  padding: 0 10px;
}
td {
  font-size: 18px;
  padding: 0 10px;
  padding: 10px;
}
.action {
  display: flex;
  justify-content: center;
}
.btn {
  display: flex;
  margin: 0 auto;
  padding: 10px 60px;
  margin-top: 20px;
}
td {
  text-align: center;
}

.avatar {
  height: 180px;
  width: 100%;
}
.card-img {
  height: 180px;
  width: 100%;
}
.panel {
  height: 450px;
  width: 700px;
}
</style> -->

<style>
h1 {
  text-align: center;
  font-size: 30px;
  margin-bottom: 20px;
}

.input-search {
  display: flex;
  margin: 0 50px;
  justify-content: space-around;
}
.input {
  width: 70%;
  font-size: 22px;
}
.add {
  width: 18%;
}

table {
  width: 85%;
  margin: 30px auto;
  border-collapse: collapse;
}
tr:nth-child(even) {
  background-color: aliceblue;
}

.modal {
  min-width: 700px;
}

.icons {
  margin: 0 10px;
  cursor: pointer;
}

.heading-table th {
  background-color: #f5f5f5;
  padding: 10px;
  text-align: center;
}
th {
  font-size: 20px;
  padding: 0 10px;
  border-bottom: 1px solid #ddd;
}
td {
  font-size: 18px;
  padding: 0 10px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.action {
  display: flex;
  justify-content: center;
}
.btn {
  display: flex;
  margin: 0 auto;
  padding: 10px 60px;
  margin-top: 20px;
}
td {
  text-align: center;
}

.avatar {
  height: 180px;
  width: 100%;
}
.card-img {
  height: 180px;
  width: 100%;
}
.panel {
  height: 450px;
  width: 700px;
}
.dia-input {
  margin: 5px;
}
</style>
