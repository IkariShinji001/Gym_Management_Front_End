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
      <q-btn
        label="Thêm Lịch Bảo Trì"
        icon="add"
        color="primary"
        @click="showAddDialog = true"
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
            <div
              class="q-pa-md"
              style="padding: 0px !important; max-width: 300px"
            >
              <div class="q-gutter-md">
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
            </div>
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
  
  <script>
import { ref, reactive, computed, onBeforeMount } from "vue";
import maintenanceService from "../services/maintenance.service.js"; // Adjust the path to your service
import facilitiesService from "../services/facilities.service.js";

export default {
  setup() {
    const maintenances = ref([]);
    const searchQuery = ref("");
    const showAddDialog = ref(false);
    const showUpdateDialog = ref(false);
    const facilities = ref([]);
    const nameFacilities = ref([]);
    const filterFacilities = ref([]);
    const facilitySelected = ref([]);

    const maintenance = reactive({
      description: "",
      date: "",
      // staff: '',
    });

    const maintenanceToEdit = reactive({
      facilityId: "",
      description: "",
      date: "",
      isFinished: "",
      // staff: '',
    });

    const columns = [
      { name: "id", label: "ID", align: "center", field: "id" },
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
        field: "date",
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

    onBeforeMount(async () => {
      try {
        const response = await maintenanceService.findAll();
        // Lấy dữ liệu từ response
        maintenances.value = response.data;
        facilities.value = await facilitiesService.findFacilityIsFinishedTrue();
        nameFacilities.value = facilities.value.map((obj) => {
          return { name: obj.name, id: obj.id };
        });
        console.log(nameFacilities.value);
        console.log(maintenances.value); // Hiển thị dữ liệu để kiểm tra
      } catch (error) {
        console.error(error);
      }
    });

    const filteredMaintenances = computed(() => {
      if (searchQuery.value.trim() === "") {
        return maintenances.value;
      }
      return maintenances.value.filter((maintenance) =>
        maintenance.facility.name
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      );
    });

    const filterFn = (valueInput, update) => {
      update(async () => {
        if (valueInput === "") {
          console.log(facilities.value);
          return (filterFacilities.value = nameFacilities.value);
        } else {
          const needle = valueInput.toLowerCase();
          filterFacilities.value = nameFacilities.value.filter(
            (facility) => facility.name.toLowerCase().indexOf(needle) > -1
          );
          console.log(filterFacilities.value);
        }
      });
    };

    const addMaintenance = async () => {
      try {
        const newMaintenance = {
          facilityIds: facilitySelected.value,
          ...maintenance,
        };
        console.log(newMaintenance);
        await maintenanceService.create(newMaintenance);
        showAddDialog.value = false;
        window.location.reload();
      } catch (error) {
        console.error("Error add maintenance: " + error);
      }
    };

    const editMaintenance = (maintenanceData) => {
      console.log(maintenanceData);
      Object.assign(maintenanceToEdit, maintenanceData);
      console.log(maintenanceToEdit);
      showUpdateDialog.value = true;
    };

    const updateMaintenance = async (id, maintenanceToEdit) => {
      try {
        const facilityIds = [];
        facilityIds.push(Number(maintenanceToEdit.facilityId));
        console.log(facilityIds);
        const maintenanceToUpdate = {
          facilityIds: facilityIds,
          ...maintenanceToEdit,
        };
        console.log(maintenanceToUpdate);
        await maintenanceService.update(id, maintenanceToUpdate);
        showUpdateDialog.value = false;
        window.location.reload();
      } catch (error) {
        console.error("Error update maintenance: " + error);
      }
    };

    const deleteMaintenance = async (id) => {
      try {
        await maintenanceService.delete(id);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting maintenance:", error);
      }
    };

    return {
      maintenances,
      facilities,
      nameFacilities,
      filterFacilities,
      facilitySelected,
      filterFn,
      searchQuery,
      showAddDialog,
      showUpdateDialog,
      maintenance,
      maintenanceToEdit,
      columns,
      filteredMaintenances,
      addMaintenance,
      editMaintenance,
      updateMaintenance,
      deleteMaintenance,
    };
  },
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
  width: 70%;
}

h4 {
  margin: 20px;
}

.add-button {
  height: 52px;
  border-radius: 15px;
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