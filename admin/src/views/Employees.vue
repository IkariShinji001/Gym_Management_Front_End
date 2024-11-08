<template>
  <section>
    <h1>Quản lý nhân viên</h1>
    <div class="input-search">
      <q-input class="input" outlined v-model="search" label="Tìm kiếm nhân viên" />
      <q-btn class="add" color="primary" @click="handleOpenCreateDialog">Thêm nhân viên</q-btn>
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
          <q-icon class="icons" @click="handleOpenUpdateDialog(employee.id)" name="update"></q-icon><q-icon
            class="icons" @click="handleOpenDeleteDialog(employee.id)" name="delete"></q-icon>
        </td>
      </tr>
      <q-pagination v-model="currentPage" :max="totalPages" :rows-per-page="rowsPerPage"
        @update:model-value="updatePage" />
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
            <q-input class="dia-input" v-model="employeeInput.profile.fullName" label="Họ và tên" outlined
              :rules="[val => !!val || 'Họ và tên không được để trống']" />
            <q-input class="dia-input" v-model="employeeInput.profile.email" label="Email" outlined
              :rules="[val => !!val || 'Email không được để trống', validateEmail]" />
            <q-input class="dia-input" v-model="employeeInput.profile.password" label="Password" outlined
              :rules="[val => !!val || 'Password không được để trống']" type="password" />
            <q-input class="dia-input" v-model="employeeInput.profile.phoneNumber" label="Số điện thoại" outlined
              maxlength="10" :rules="[validatePhoneNumber]" />
            <q-input class="dia-input" v-model="employeeInput.position" label="Vị trí" outlined
              :rules="[val => !!val || 'Vị trí không được để trống']" />
            <q-input class="dia-input" v-model="employeeInput.hireDate" label="Ngày vào làm" type="date" outlined
              :rules="[validateHireDate]" />

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
            <q-input class="dia-input" v-model="employeeUpdate.profile.fullName" label="Họ và tên" outlined />
            <q-input class="dia-input" v-model="employeeUpdate.profile.email" label="Email" outlined
              :rules="[val => !!val || 'Email không được để trống', validateEmail]" />
            <q-input class="dia-input" v-model="employeeUpdate.profile.phoneNumber" label="Số điện thoại" outlined
              :rules="[validatePhoneNumber]" />
            <q-input class="dia-input" v-model="employeeUpdate.position" label="Vị trí" outlined />
            <q-input class="dia-input" v-model="employeeUpdate.hireDate" label="Ngày vào làm" type="date"
              :rules="[validateHireDate]" outlined />
          </q-card-section>
        </q-card-section>
        <q-card-actions class="action">
          <q-btn class="btn" color="primary" label="Lưu" @click="handleUpdate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="openDeleteDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Bạn có chắc chắn muốn xóa nhân viên này không?</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Huỷ" v-close-popup />
          <q-btn color="negative" label="Xoá" @click="confirmDelete" />
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
import { useQuasar, QSpinnerCube } from "quasar";


const $q = useQuasar();
const search = ref("");
const openCreateDialog = ref(false);
const openUpdateDialog = ref(false);
const employees = ref([]);
const updateId = ref("");
const confirmDeleteDialog = ref(false); // Quản lý trạng thái của dialog xác nhận
const deleteId = ref(null); // Lưu id nhân viên cần xóa
const openDeleteDialog = ref(false);
const profileId = localStorage.getItem("id");


const employeeInput = ref({
  profile: {
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  },
  position: "",
  hireDate: "",
  managerId: "",
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
  managerId: "",
});

const currentPage = ref(1);
const rowsPerPage = ref(10);



const validateEmail = (email) => {
  const regex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

  return regex.test(email) || "Email không hợp lệ";
};

const validatePhoneNumber = (phoneNumber) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phoneNumber) || "Số điện thoại không hợp lệ";
};

const validateHireDate = (date) => {
  const today = new Date().toISOString().split('T')[0];
  return date <= today || "Ngày vào làm không được lớn hơn ngày hiện tại";
};


const handleOpenCreateDialog = () => {
  openCreateDialog.value = true;
};
const handleOpenUpdateDialog = (id) => {
  openUpdateDialog.value = true;
  const index = employees.value.findIndex((employee) => employee.id === id);
  Object.assign(employeeUpdate.value, employees.value[index]);
  employeeUpdate.value.hireDate = new Date(employees.value[index].hireDate).toISOString().slice(0, 10);

  updateId.value = id;
};
const handleUpdate = async () => {
  $q.loading.show({
    spinner: QSpinnerCube,
    message: "Đang cập nhật...",
  });
  if (employeeUpdate.value.profile.fullName === "" || employeeUpdate.value.profile.email === "" || employeeUpdate.value.profile.phoneNumber === "" || employeeUpdate.value.position === "" || employeeUpdate.value.hireDate === "") {
    $q.notify({ position: 'top', color: 'negative', message: 'Vui lòng nhập đầy đủ thông tin' });
    return;
  }
  try {
    const payloadProfile = {
      fullName: employeeUpdate.value.profile.fullName,
      email: employeeUpdate.value.profile.email,
      phoneNumber: employeeUpdate.value.profile.phoneNumber,
    };
    const payloadEmployee = {
      position: employeeUpdate.value.position,
      hireDate: employeeUpdate.value.hireDate,
      manager: {
        id: manager.value.id,
      },
    };
    await employeesService.updateEmployee(updateId.value, payloadEmployee);
    await profileService.updatedProfile(
      employeeUpdate.value.profile.id,
      payloadProfile
    );
    // Cập nhật hireDate trực tiếp trên employee
    const index = employees.value.findIndex(employee => employee.id === updateId.value);
    if (index !== -1) {
      employees.value[index].hireDate = employeeUpdate.value.hireDate;
    }
    // cập nhật vị trí trực tiếp trên employee
    employees.value[index].position = employeeUpdate.value.position;
    $q.notify({ position: 'top', color: 'positive', message: 'Cập nhật thành công' });
    openUpdateDialog.value = false;
  } catch (error) {
    $q.notify({ position: 'top', color: 'negative', message: `Lỗi: ${error.response.data.message || 'Không thể tạo thành viên mới'}` });
    console.log(error);
  } finally {
    $q.loading.hide();
  }
};
const manager = ref({});
onBeforeMount(async () => {
  manager.value = await managersService.findByProfile(profileId);
  employees.value = await managersService.getEmployeesByManagerId(manager.value.id);

});

const formatDate = (date) => {
  date = new Date(date);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
  const day = date.getDate().toString().padStart(2, "0");
  return `${day}-${month}-${year}`;
};
const formatDateTime = (Date) => {
  return formatDate(Date);
};
const handleAdd = async () => {
  $q.loading.show({
    spinner: QSpinnerCube,
    message: "Đang tạo thành viên mới...",
  });
  try {
    if (employeeInput.value.profile.fullName === "" || employeeInput.value.profile.email === "" || employeeInput.value.profile.password === "" || employeeInput.value.profile.phoneNumber === "" || employeeInput.value.position === "" || employeeInput.value.hireDate === "" || manager.value.id === "") {
      $q.notify({ position: 'top', color: 'negative', message: 'Vui lòng nhập đầy đủ thông tin' });
      return;
    }
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
        managerId: manager.value.id,
      },
    };
    const res = await employeesService.createEmployee(payload);
    employees.value.push(res);
    employeeInput.value = {
      profile: {
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
      },
      position: "",
      hireDate: "",
      managerId: "",
    };
    $q.notify({ position: 'top', color: 'positive', message: 'Tạo thành công' });
    openCreateDialog.value = false;
  } catch (error) {
    $q.notify({ position: 'top', color: 'negative', message: `Lỗi: ${error.response.data.message || 'Không thể tạo thành viên mới'}` });
    console.log(error);
  } finally {
    $q.loading.hide();
  }
};

const filteredEmployees = computed(() => {
  if (!search.value) return employees.value;
  const searchValue = search.value.toLowerCase();

  return employees.value.filter((employee) => {
    return (
      employee.profile.fullName.toLowerCase().includes(searchValue) ||
      employee.profile.email.toLowerCase().includes(searchValue) ||
      employee.profile.phoneNumber.toLowerCase().includes(searchValue)
    );
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

// Hàm mở hộp thoại xác nhận xóa
const handleOpenDeleteDialog = (id) => {
  deleteId.value = id;
  openDeleteDialog.value = true; // Mở hộp thoại xác nhận
};


// Hàm thực hiện xóa sau khi người dùng xác nhận
const confirmDelete = async () => {
  $q.loading.show({
    spinner: QSpinnerCube,
    message: "Đang xóa...",
  });

  try {
    await employeesService.deleteEmployee(deleteId.value);
    employees.value = employees.value.filter((employee) => employee.id !== deleteId.value);
    openDeleteDialog.value = false; // Đóng hộp thoại xác nhận sau khi xóa
    $q.notify({ position: 'top', color: 'positive', message: 'Xóa thành công' });
  } catch (error) {
    console.log(error);
  } finally {
    $q.loading.hide();
  }
};
</script>

<style scoped>
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
