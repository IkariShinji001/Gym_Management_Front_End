<template>
  <div class="maintenance-management">
    <h3>Quản lý Lịch Bảo Trì Thiết Bị</h3>

    <div class="header-controls">
      <q-input
        class="search-bar"
        v-model="searchQuery"
        label="Tìm kiếm thiết bị"
        filled
      />
      <div>
        <q-select
          filled
          v-model="statusSelected"
          :options="statusOptions"
          @update:model-value="filterMaintenances"
          map-options
          emit-value
          label="Chọn trạng thái bảo trì"
          option-value="value"
          option-label="label"
          style="width: 230px; margin-left: 45px"
        />
      </div>
      <q-btn
        label="Thêm Lịch Bảo Trì"
        icon="add"
        @click="openAddDialog"
        class="add-button"
      />
    </div>

    <q-table
      :rows="filteredMaintenances"
      :columns="columns"
      row-key="id"
      class="maintenance-table"
      flat
    >
      <template v-slot:body-cell-isFinished="props">
        <q-td :props="props">
          <q-checkbox
            v-model="props.row.isFinished"
            :true-value="true"
            :false-value="false"
            :disable="props.row.isFinished"
            @update:model-value="
              (value) => {
                if (value) {
                  props.row.isFinished = true;
                  updateMaintenance(props.row.id, props.row);
                }
              }
            "
          />
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            style="margin-right: 15px"
            icon="edit"
            color="primary"
            @click="editMaintenance(props.row)"
            dense
            flat
          />
          <q-btn
            icon="delete"
            color="negative"
            @click="deleteMaintenance(props.row.id)"
            dense
            flat
          />
        </q-td>
      </template>
    </q-table>

    <!-- Add Dialog -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card class="dialog-add">
        <q-card-section>
          <h4>Thêm lịch Bảo Trì</h4>
        </q-card-section>
        <q-card-section>
          <q-form @submit="addMaintenance">
            <div style="padding: 0px !important" class="q-pa-md">
              <q-select
                filled
                v-model="facilitySelected"
                use-input
                use-chips
                multiple
                :options="filterFacilities"
                @filter="filterFn"
                map-options
                emit-value
                label="Chọn thiết bị"
                option-value="id"
                option-label="name"
                style="width: 300px"
              />
            </div>
            <q-input v-model="maintenance.description" label="Mô tả" />
            <q-input
              v-model="maintenance.date"
              label="Ngày Bảo Trì"
              type="date"
            />
            <!-- <q-input v-model="maintenance.staff" label="Nhân Viên Phụ Trách" /> -->
            <q-btn label="Lưu" icon="save" type="submit" class="btn-save" />
            <q-btn
              label="Hủy"
              icon="cancel"
              flat
              @click="showAddDialog = false"
              class="btn-cancel"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Edit Dialog -->
    <q-dialog v-model="showUpdateDialog" persistent>
      <q-card class="dialog-update">
        <q-card-section>
          <div>
            <h4>Cập nhật lịch bảo trì thiết bị</h4>
          </div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="updateMaintenance(maintenanceToEdit.id, maintenanceToEdit)"
          >
            <!-- <div
              class="q-pa-md"
              style="padding: 0px !important; max-width: 300px"
            >
              <div class="q-gutter-md">
                {{ nameFacilities }}
                <q-select
                  filled
                  v-model="maintenanceToEdit.facilityId"
                  :options="nameFacilities"
                  label="Chọn thiết bị"
                  map-options
                  emit-value
                  option-value="id"
                  option-label="name"
                />
              </div>
            </div> -->
            <q-input v-model="maintenanceToEdit.description" label="Mô tả" />
            <q-input
              v-model="maintenanceToEdit.date"
              label="Ngày Bảo Trì"
              type="date"
            />
            <!-- <q-input v-model="maintenance.staff" label="Nhân Viên Phụ Trách" /> -->
            <q-btn label="Lưu" type="submit" icon="save" class="btn-save" />
            <q-btn
              label="Hủy"
              icon="cancel"
              flat
              @click="showUpdateDialog = false"
              class="btn-cancel"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
  
  <script setup>
import { ref, reactive, computed, onBeforeMount } from "vue";
import { useToast } from "vue-toastification";
import maintenanceService from "../services/maintenance.service.js"; // Adjust the path to your service
import facilitiesService from "../services/facilities.service.js";

const toast = useToast();
const maintenances = ref([]);
const searchQuery = ref("");
const showAddDialog = ref(false);
const showUpdateDialog = ref(false);
const facilities = ref([]);
const filterFacilities = ref([]);
const facilitySelected = ref([]);
const statusSelected = ref("");
const statusOptions = ref([
  { label: "hoàn thành", value: "completed" },
  { label: "chưa hoàn thành", value: "notCompleted" },
]);

const maintenance = reactive({
  description: "",
  date: "",
  // staff: '',
});

const maintenanceToEdit = reactive({
  id: "",
  description: "",
  date: "",
  isFinished: "",
  // staff: '',
});

const columns = [
  { name: "index", label: "STT", align: "center", field: "index" },
  {
    name: "facility.name",
    label: "Tên Thiết Bị",
    align: "center",
    field: (row) => row.facility.name,
  },
  {
    name: "description",
    label: "Mô tả",
    align: "center",
    field: "description",
  },
  {
    name: "scheduleDate",
    label: "Ngày Bảo Trì",
    align: "center",
    field: (row) => formatDate(row.date),
  },
  {
    name: "isFinished",
    label: "Hoàn thành",
    align: "center",
    field: "isFinished",
  },
  // { name: 'staff', label: 'Nhân Viên Phụ Trách', align: 'left', field: 'staff' },
  { name: "action", label: "Hành Động", align: "center" },
];

const openAddDialog = async () => {
  facilities.value = await facilitiesService.findFacilityIsFinishedTrue();
  showAddDialog.value = true;
  facilitySelected.value = [];
  maintenance.description = "";
  maintenance.date = "";
};

onBeforeMount(async () => {
  try {
    const response = await maintenanceService.findMaintenanceIsNotFinished();
    maintenances.value = response.data;
    facilities.value = await facilitiesService.findFacilityIsFinishedTrue();
  } catch (error) {
    console.error(error);
  }
});

const filteredMaintenances = computed(() => {
  // Hàm loại bỏ dấu tiếng Việt
  const removeAccents = (str) => {
    return str
      .normalize("NFD") // Chuyển đổi ký tự có dấu thành các ký tự và dấu tách biệt
      .replace(/[\u0300-\u036f]/g, ""); // Loại bỏ các dấu kết hợp
  };

  // Chuẩn hóa searchQuery để tìm kiếm
  const normalizedQuery = removeAccents(searchQuery.value.trim().toLowerCase());

  // Tạo danh sách với chỉ số tự tăng
  const maintenancesWithIndex = maintenances.value.map(
    (maintenance, index) => ({
      ...maintenance,
      index: index + 1, // Thêm thuộc tính 'index' tự động tăng
    })
  );

  if (normalizedQuery === "") {
    return maintenancesWithIndex;
  }

  console.log(maintenancesWithIndex);

  return maintenances.value.filter((maintenance) =>
    removeAccents(maintenance.facility.name.toLowerCase()).includes(
      normalizedQuery
    )
  );
});

const filterMaintenances = async () => {
  if (statusSelected.value === "completed") {
    const res = await maintenanceService.findMaintenanceIsFinished();
    maintenances.value = res.data;
  } else if (statusSelected.value === "notCompleted") {
    const res = await maintenanceService.findMaintenanceIsNotFinished();
    maintenances.value = res.data;
  }
};

const formatDate = (date) => {
  date = new Date(date);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
  const day = date.getDate().toString().padStart(2, "0");
  return `${day}-${month}-${year}`;
};

const formatDateInput = (date) => {
  date = new Date(date);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const filterFn = (valueInput, update) => {
  update(async () => {
    if (valueInput === "") {
      return (filterFacilities.value = facilities.value);
    } else {
      const needle = valueInput.toLowerCase();
      filterFacilities.value = facilities.value.filter(
        (facility) => facility.name.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};

const addMaintenance = async () => {
  try {
    const newMaintenance = {
      facilityIds: facilitySelected.value,
      ...maintenance,
    };
    const res = await maintenanceService.create(newMaintenance);
    console.log(res);
    res.forEach((element) => {
      maintenances.value.push(element);
    });
    // facilities.value = await facilitiesService.findFacilityIsFinishedTrue();
    showAddDialog.value = false;
    toast.success("thêm bảo trì thành công");
  } catch (error) {
    console.error("Error add maintenance: " + error);
  }
};

const editMaintenance = (maintenanceData) => {
  console.log(maintenanceData);
  maintenanceData.date = formatDateInput(maintenanceData.date);
  Object.assign(maintenanceToEdit, maintenanceData);
  console.log(maintenanceToEdit);
  showUpdateDialog.value = true;
};

const updateMaintenance = async (id, maintenanceToEdit) => {
  try {
    delete maintenanceToEdit.index;
    console.log(maintenanceToEdit);
    // const facilityIds = [];
    // facilityIds.push(maintenanceToEdit.facilityId);
    // const maintenanceToUpdate = {
    //   facilityIds: facilityIds,
    //   ...maintenanceToEdit,
    // };
    // console.log(maintenanceToUpdate);
    const maintenanceIsUpdated = await maintenanceService.update(
      id,
      maintenanceToEdit
    );
    console.log(maintenances.value);
    const indexId = maintenances.value.findIndex(
      (maintenance) => maintenance.id === id
    );
    Object.assign(maintenances.value[indexId], maintenanceIsUpdated);
    // const facilityNew = await facilitiesService.findById(res.facilityId);
    // facilities.value.push(facilityNew);
    // nameFacilities.value = facilities.value.map((obj) => {
    //   return { name: obj.name, id: obj.id };
    // });
    const index = maintenances.value.findIndex(
      (item) => item.isFinished === true
    );
    console.log(index);
    if (index >= 0) {
      maintenances.value.splice(index, 1);
      toast.success("Cập nhật trạng thái bảo trì thành công");
    } else {
      // const indexId = maintenances.value.findIndex(
      //   (maintenance) => maintenance.id == id
      // );
      // Object.assign(maintenances.value[indexId], maintenanceIsUpdated);
      showUpdateDialog.value = false;
      toast.success("Cập nhật lịch bảo trì thành công");
    }
  } catch (error) {
    console.error("Error update maintenance: " + error);
  }
};

const deleteMaintenance = async (id) => {
  try {
    await maintenanceService.delete(id);
    const index = maintenances.value.findIndex((item) => item.id === id);
    maintenances.value.splice(index, 1);
    toast.success("Xóa lịch bảo trì thành công");
  } catch (error) {
    console.error("Error deleting maintenance:", error);
  }
};
</script>
  
  <style scoped>
.maintenance-management {
  padding: 20px;
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  width: 55%;
}

h3 {
  margin: 25px;
}

h4 {
  padding: 0px;
  margin: 0px;
  text-align: center;
}

.add-button {
  margin-left: 40px;
  height: 52px;
  border-radius: 7px;
  background: var(--icon-color) !important;
  color: black;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.5) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}

.maintenance-table {
  height: 400px;
  width: 100%;
  overflow-y: auto;
}

.btn-save {
  margin-top: 10px;
  margin-right: 20px;
  background: rgb(40, 40, 241);
}

.btn-cancel {
  margin-top: 10px;
}

.dialog-add {
  width: 500px;
}

.dialog-update {
  width: 500px;
}
</style>