<template>
  <section>
    <h1>Quản lý nhân viên</h1>
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
        <th>Ngày bắt đầu làm việc</th>
        <th>Chức năng</th>
      </tr>
      <tr v-for="(employee, index) in paginatedEmployees" :key="employee.id">
        <td>{{ index + 1 + (currentPage - 1) * rowsPerPage }}</td>
        <td>{{ employee.profile.fullName }}</td>
        <td>{{ employee.profile.email }}</td>
        <td>{{ employee.profile.phoneNumber }}</td>
        <td>{{ employee.position }}</td>
        <td>{{ formatDate(employee.hireDate) }}</td>
        <td class="function">
          <q-icon
            class="icons"
            @click="handleOpenUpdateDialog(employee.id)"
            name="update"
          ></q-icon
          ><q-icon
            class="icons"
            @click="handleDelete(employee.id)"
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
              class="dia-input"
              v-model="employeeInput.profile.fullName"
              label="Họ và tên"
              outlined
            />
            <q-input
              class="dia-input"
              v-model="employeeInput.profile.email"
              label="Email"
              outlined
            />
            <q-input
              class="dia-input"
              v-model="employeeInput.profile.password"
              label="Password"
              outlined
            />
            <q-input
              class="dia-input"
              v-model="employeeInput.profile.phoneNumber"
              label="Số điện thoại"
              outlined
            />
            <q-input
              class="dia-input"
              v-model="employeeInput.position"
              label="Vị trí"
              outlined
            />
            <q-input
              class="dia-input"
              v-model="employeeInput.hireDate"
              label="Ngày vào làm"
              type="date"
              outlined
            />
            <q-select
              v-model="employeeInput.managerId"
              :options="managersOptions"
              label="Quản lý"
              dense
            />
          </q-card-section>
        </q-card-section>
        <q-card-actions class="action">
          <q-btn class="btn" color="primary" label="Lưu" @click="handleAdd" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog cho cập nhật nhân viên -->
    <q-dialog v-model="openUpdateDialog">
      <q-card class="modal">
        <q-card-section>
          <q-card-title>
            <q-icon name="update"></q-icon>
            <span>Cập nhật nhân viên</span>
          </q-card-title>
          <q-card-section>
            <q-input
              class="dia-input"
              v-model="employeeUpdate.profile.fullName"
              label="Họ và tên"
              outlined
            />
            <q-input
              class="dia-input"
              v-model="employeeUpdate.profile.email"
              label="Email"
              outlined
            />
            <q-input
              class="dia-input"
              v-model="employeeUpdate.profile.phoneNumber"
              label="Số điện thoại"
              outlined
            />
            <q-input
              class="dia-input"
              v-model="employeeUpdate.position"
              label="Vị trí"
              outlined
            />
            <q-input
              class="dia-input"
              v-model="employeeUpdate.hireDate"
              label="Ngày vào làm"
              type="date"
              outlined
            />
            <q-select
              v-model="employeeUpdate.managerId"
              :options="managersOptions"
              label="Quản lý"
              dense
            />
          </q-card-section>
        </q-card-section>
        <q-card-actions class="action">
          <q-btn
            class="btn"
            color="primary"
            label="Lưu"
            @click="handleUpdate"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { ref, onBeforeMount, computed } from "vue";
import employeesService from "../services/employee.service";
import managersService from "../services/managers.service";
import profileService from "../services/profiles.service";
import { format } from "date-fns";

const search = ref("");
const openCreateDialog = ref(false);
const openUpdateDialog = ref(false);
const employees = ref([]);
const managers = ref([]);
const managersOptions = ref([]);
const updateId = ref("");
const employeeInput = ref({
  profile: {
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  },
  position: "",
  hireDate: "",
  managerId: {
    label: "",
    managerId: "",
  },
});
const employeeUpdate = ref({
  id: "",
  profile: {
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  },
  position: "",
  hireDate: "",
  managerId: {
    label: "",
    managerId: "",
  },
});
const currentPage = ref(1);
const rowsPerPage = ref(10);

const handleOpenCreateDialog = () => {
  openCreateDialog.value = true;
};
const handleOpenUpdateDialog = (id) => {
  openUpdateDialog.value = true;
  const index = employees.value.findIndex((employee) => employee.id === id);
  Object.assign(employeeUpdate.value, employees.value[index]);
  updateId.value = id;
};
const handleUpdate = async () => {
  try {
    const payloadProfile = {
      fullName: employeeUpdate.value.profile.fullName,
      email: employeeUpdate.value.profile.email,
      phoneNumber: employeeUpdate.value.profile.phoneNumber,
    };
    const payloadEmployee = {
      position: employeeUpdate.value.position,
      hireDate: employeeUpdate.value.hireDate,
      manager: employeeUpdate.value.managerId.managerId,
    };
    await employeesService.updateEmployee(updateId.value, payloadEmployee);
    await profileService.updatedProfile(
      employeeUpdate.value.profile.id,
      payloadProfile
    );
    openUpdateDialog.value = false;
  } catch (error) {
    console.log(error);
  }
};

onBeforeMount(async () => {
  employees.value = await employeesService.getAllEmployee();
  managers.value = await managersService.getAllManager();
  managersOptions.value = await managers.value.map((manager) => {
    return {
      label: manager.profile.fullName,
      managerId: manager.id,
    };
  });
});

const formatDate = (date) => {
  return format(new Date(date), "dd/MM/yyyy");
};  
const formatDateTime = (Date) => {
  return formatDate(Date);
};
const handleAdd = async () => {
  const payload = {
    createProfileDto: {
      fullName: employeeInput.value.profile.fullName,
      email: employeeInput.value.profile.email,
      password: employeeInput.value.profile.password,
      phoneNumber: employeeInput.value.profile.phoneNumber,
      role: "employee",
    },
    createEmployeeDto: {
      position: employeeInput.value.position,
      hireDate: employeeInput.value.hireDate,
      managerId: employeeInput.value.managerId.managerId,
    },
  };
  console.log(payload);
  const res = await employeesService.createEmployee(payload);
  employees.value.push(res);
  openCreateDialog.value = false;
};
const handleDelete = async (id) => {
  await employeesService.deleteEmployee(id);
  employees.value = employees.value.filter((employee) => employee.id !== id);
};
// const handleOpenDetailDialog = (id) => {
//   openDetailDialog.value = true;
//   const index = employees.value.findIndex((employee) => employee.id === id);
//   Object.assign(employeeDetail.value, employees.value[index]);
// };

const filteredEmployees = computed(() => {
  if (!search.value) return employees.value;
  const searchValue = search.value.toLowerCase();
  return employees.value.filter((employee) => {
    return employee.profile.fullName.includes(searchValue);
  });
});
const totalPages = computed(() => {
  return Math.ceil(filteredEmployees.value.length / rowsPerPage.value);
});

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return filteredEmployees.value.slice(start, end);
});

const updatePage = (page) => {
  currentPage.value = page;
};
</script>

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
