<template>
  <div>
    <h3>Quản lý thiết bị dụng cụ</h3>
    <div class="equipment-management">
      <h4>Danh sách Thiết bị dụng cụ</h4>
      <div class="search-bar">
        <q-input
          class="input-search"
          v-model="searchQuery"
          label="Tìm kiếm thiết bị"
          filled
        />
        <div class="btn-add q-pa-md q-gutter-sm">
          <q-btn
            style="height: 50px; border-radius: 15px"
            label="Thêm thiết bị"
            icon="add"
            color="primary"
            @click="showAddDialog = true"
          />
        </div>
      </div>
      <div class="table">
        <table style="width: 100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Hình ảnh</th>
              <th>Mô tả</th>
              <th>Chi nhánh</th>
              <th>Ngày mua</th>
              <th>Ngày bắt đầu bảo hành</th>
              <th>Ngày kết thúc bảo hành</th>
              <th>Bảo trì</th>
              <th>Hoạt động</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredFacilities.length === 0">
              <td colspan="11" style="text-align: center; padding: 20px">
                No data available
              </td>
            </tr>
            <tr v-for="(facility, id) in filteredFacilities" :key="facility.id">
              <td width="3%" scope="row">{{ id + 1 }}</td>
              <td>{{ facility.name }}</td>
              <td>
                <img :src="facility.imageUrl" alt="Hình ảnh thiết bị" />
              </td>
              <td>{{ facility.description }}</td>
              <td width="4%">{{ facility.branchId }}</td>
              <td>{{ facility.purchaseDate }}</td>
              <td>{{ facility.warrantyStartDate }}</td>
              <td>{{ facility.warrantyEndDate }}</td>
              <td>
                <q-btn
                  style="border-radius: 15px"
                  icon="add"
                  color="primary"
                  @click="addMaintenance(facility.id)"
                />
              </td>
              <td>
                <div class="q-pa-md">
                  <q-toggle
                    v-model="facility.isActive"
                    color="blue"
                    @update:model-value="updateFacility(facility.id, facility)"
                  />
                </div>
              </td>
              <td width="11%">
                <q-btn
                  class="btn-update"
                  icon="update"
                  @click="editFacility(facility)"
                />
                <q-btn
                  class="btn-delete"
                  icon="delete"
                  @click="deleteFacility(facility.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Thêm thiết bị vào lịch bảo trì -->
      <q-dialog v-model="showAddMaintenance">
        <q-card class="dialog-add-maintenance">
          <q-card-section>
            <h4>Thêm vào lịch bảo trì</h4>
          </q-card-section>
          <q-card-section>
            <q-form @submit="submitAddMaintenance">
              <q-input
                v-model="maintenance.description"
                label="Nhập mô tả bảo trì"
              ></q-input>
              <q-input
                v-model="maintenance.date"
                type="date"
                label="Nhập ngày bảo trì"
              ></q-input>
              <q-btn class="btn-save" icon="save" label="Lưu" type="submit" />
              <q-btn
                class="btn-cancel"
                icon="cancel"
                label="Hủy"
                flat
                @click="showAddMaintenance = false"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- QDialog component thêm thiết bị-->
      <q-dialog v-model="showAddDialog" persistent>
        <q-card class="dialog-add-facility">
          <q-card-section>
            <h4>Thêm thiết bị mới</h4>
          </q-card-section>

          <q-card-section>
            <q-form @submit="addFacility">
              <q-input v-model="facility.name" label="Tên thiết bị" />
              <q-input v-model="facility.imageUrl" label="URL hình ảnh" />
              <q-input v-model="facility.description" label="Mô tả" />
              <q-input v-model="facility.branchId" label="Chi nhánh" />
              <q-input
                type="date"
                v-model="facility.purchaseDate"
                label="Ngày mua"
              />
              <q-input
                type="date"
                v-model="facility.warrantyStartDate"
                label="Ngày bắt đầu bảo hành"
              />
              <q-input
                type="date"
                v-model="facility.warrantyEndDate"
                label="Ngày kết thúc bảo hành"
              />
              <q-btn class="btn-save" icon="save" label="Lưu" type="submit" />
              <q-btn
                class="btn-cancel"
                icon="cancel"
                label="Hủy"
                flat
                @click="showAddDialog = false"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- QDialog component sửa thiết bị-->
      <q-dialog v-model="showEditDialog" persistent>
        <q-card class="dialog-update-facility">
          <q-card-section>
            <h4>Sửa thông tin thiết bị</h4>
          </q-card-section>

          <q-card-section>
            <q-form @submit="updateFacility(facilityToEdit.id, facilityToEdit)">
              <q-input v-model="facilityToEdit.name" label="Tên thiết bị" />
              <q-input v-model="facilityToEdit.imageUrl" label="URL hình ảnh" />
              <q-input v-model="facilityToEdit.description" label="Mô tả" />
              <q-input v-model="facilityToEdit.branchId" label="Chi nhánh" />
              <q-input
                type="date"
                v-model="facilityToEdit.purchaseDate"
                label="Ngày mua"
              />
              <q-input
                type="date"
                v-model="facilityToEdit.warrantyStartDate"
                label="Ngày bắt đầu bảo hành"
              />
              <q-input
                type="date"
                v-model="facilityToEdit.warrantyEndDate"
                label="Ngày kết thúc bảo hành"
              />

              <q-btn class="btn-save" icon="save" label="Lưu" type="submit" />
              <q-btn
                class="btn-cancel"
                icon="cancel"
                label="Hủy"
                flat
                @click="showEditDialog = false"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onBeforeMount, computed } from "vue";
import facilitiesService from "../service/facilities.service";
import maintenancesService from "../service/maintenance.service";

export default {
  setup() {
    const facilities = ref([]);
    const searchQuery = ref("");
    const showAddMaintenance = ref(false);
    const showAddDialog = ref(false);
    const showEditDialog = ref(false);

    const facility = reactive({
      name: "",
      description: "",
      imageUrl: "",
      branchId: "",
      purchaseDate: "",
      warrantyStartDate: "",
      warrantyEndDate: "",
    });

    const facilityToEdit = reactive({
      name: "",
      description: "",
      imageUrl: "",
      branchId: "",
      purchaseDate: "",
      warrantyStartDate: "",
      warrantyEndDate: "",
      isActive: "",
    });

    const maintenance = reactive({
      facilityIds: [],
      date: "",
      description: "",
    });

    onBeforeMount(async () => {
      try {
        facilities.value = await facilitiesService.findAll();
        console.log(facilities.value);
      } catch (error) {
        console.log(error);
      }
    });

    // Use computed to filter facilities based on searchQuery
    const filteredFacilities = computed(() => {
      if (searchQuery.value.trim() === "") {
        return facilities.value; // Show all facilities when search is empty
      } else {
        return facilities.value.filter((facility) =>
          facility.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }
    });

    const addFacility = async () => {
      try {
        await facilitiesService.create(facility);
        // await fetchFacilities(); // Refresh the list after adding
        // await resetFacility();
        showAddDialog.value = false;
        window.location.reload();
      } catch (error) {
        console.error("Error adding facility:", error);
      }
    };

    const addMaintenance = (id) => {
      maintenance.facilityIds.push(id);
      showAddMaintenance.value = true;
    };

    const submitAddMaintenance = async () => {
      try {
        console.log(maintenance.value);
        const id = maintenance.facilityIds[0];
        console.log(id);
        const facility = await facilitiesService.checkFacilityIsFinishedIsFalse(
          id
        );
        if (!facility) {
          await maintenancesService.create(maintenance);
          showAddDialog.value = false;
          window.location.reload();
        } else {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error adding maintenance:", error);
      }
    };

    const editFacility = (facility) => {
      facilityToEdit.id = facility.id;
      facilityToEdit.name = facility.name;
      facilityToEdit.description = facility.description;
      facilityToEdit.imageUrl = facility.imageUrl;
      facilityToEdit.branchId = facility.branchId;
      facilityToEdit.purchaseDate = facility.purchaseDate;
      facilityToEdit.warrantyStartDate = facility.warrantyStartDate;
      facilityToEdit.warrantyEndDate = facility.warrantyEndDate;
      facilityToEdit.isActive = facility.isActive;
      showEditDialog.value = true;
    };

    const updateFacility = async (id, facilityToEdit) => {
      try {
        await facilitiesService.update(id, facilityToEdit);
        window.location.reload();
        showEditDialog.value = false;
      } catch (error) {
        console.error("Error updating facility:", error);
      }
    };

    const deleteFacility = async (id) => {
      try {
        await facilitiesService.delete(id);
        window.location.reload();
        // await fetchFacilities(); // Refresh the list after deleting
      } catch (error) {
        console.error("Error deleting facility:", error);
      }
    };

    return {
      facilities,
      searchQuery,
      maintenance,
      showAddMaintenance,
      showAddDialog,
      showEditDialog,
      facility,
      facilityToEdit,
      addFacility,
      addMaintenance,
      submitAddMaintenance,
      editFacility,
      updateFacility,
      deleteFacility,
      filteredFacilities,
    };
  },
};
</script>

<style>
.equipment-management {
  margin: 20px;
  padding-bottom: 20px;
  /* background: #d5d5d6; */
}
h3 {
  margin: 0px;
  padding: 15px;
  margin: 20px;
  background: #0c66ec;
}
h4 {
  margin: 20px 20px 0px 20px;
  padding: 20px;
}
.table {
  margin-left: 40px !important;
  width: 94.5% !important;
  table-layout: auto;
  overflow-y: auto;
  height: 370px;
  border: 1px solid #959599;
}
.search-bar {
  margin: 0px 0px 10px 40px;
  width: 94%;
  display: flex;
}
.input-search {
  background: white;
  width: 70%;
  padding: 0px !important;
}
.dialog-add-maintenance {
  width: 500px;
}
.dialog-add-facility {
  width: 500px;
}
.dialog-update-facility {
  width: 500px;
}
.btn-add {
  margin: auto;
  padding: 0px !important;
}
.btn-update {
  margin-right: 5px;
  background: rgb(241, 241, 37) !important;
  color: black !important;
  border-radius: 15px;
}
.btn-delete {
  margin-left: 5px;
  background: red;
  border-radius: 15px;
}
.btn-save {
  margin-top: 10px;
  margin-right: 20px;
  background: rgb(40, 40, 241);
}
.btn-cancel {
  margin-top: 10px;
}
th {
  padding: 5px;
  text-align: center;
  border-bottom: 1px solid #959599;
  border-right: 1px solid #959599;
}
td {
  border-bottom: 1px solid #959599;
  border-right: 1px solid #959599;
  padding: 5px;
  text-align: center;
}
tr {
  transition: background-color 0.3s;
}
tr:hover {
  background: #e4dfdf;
}
</style>