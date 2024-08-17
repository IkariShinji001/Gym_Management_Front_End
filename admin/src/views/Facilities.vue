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
          debounce="300"
        />
        <div class="btn-add q-pa-md q-gutter-sm">
          <q-btn
            label="Thêm thiết bị"
            icon="add"
            color="primary"
            @click="showAddDialog = true"
          />
        </div>
      </div>
      <div class="table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Hình ảnh</th>
              <th>Mô tả</th>
              <th>Ngày bảo trì</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(facility,id) in displayedFacilities" :key="facility.id">
              <th scope="row">{{ id+1 }}</th>
              <td>{{ facility.name }}</td>
              <td><img :src="facility.imageUrl" alt="Hình ảnh thiết bị" /></td>
              <td>{{ facility.description }}</td>
              <td>{{ facility.maintenanceDate }}</td>
              <td>
                <q-btn
                  class="btn-update"
                  icon="update"
                  color="primary"
                  @click="editFacility(facility)"
                />
                <q-btn
                  class="btn-delete"
                  icon="delete"
                  color="negative"
                  @click="deleteFacility(facility.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- QDialog component thêm thiết bị-->
      <q-dialog v-model="showAddDialog" persistent>
        <q-card class="dialog-add">
          <q-card-section>
            <div class="text-h6">Thêm thiết bị mới</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="addFacility">
              <q-input v-model="facility.name" label="Tên thiết bị" />
              <q-input v-model="facility.imageUrl" label="URL hình ảnh" />
              <q-input v-model="facility.description" label="Mô tả" />
              <q-input
                v-model="facility.maintenanceDate"
                label="Ngày bảo trì"
              />
              <q-btn class="btn-save" icon="save" label="Lưu" type="submit" />
              <q-btn class="btn-cancel" icon="cancel" label="Hủy" flat @click="showAddDialog = false" />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- QDialog component sửa thiết bị-->
      <q-dialog v-model="showEditDialog" persistent>
        <q-card class="dialog-update">
          <q-card-section>
            <div class="text-h6">Sửa thông tin thiết bị</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="updateFacility">
              <q-input v-model="facilityToEdit.name" label="Tên thiết bị" />
              <q-input v-model="facilityToEdit.imageUrl" label="URL hình ảnh" />
              <q-input v-model="facilityToEdit.description" label="Mô tả" />
              <q-input
                v-model="facilityToEdit.maintenanceDate"
                label="Ngày bảo trì"
              /> 
              <q-btn class="btn-save" icon="save" label="Lưu" type="submit" />
              <q-btn class="btn-cancel" icon="cancel" label="Hủy" flat @click="showEditDialog = false" />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onBeforeMount, watch } from "vue";
import facilitiesService from "../service/facilities.service";

export default {
  setup() {
    const facilities = ref([]);
    const searchQuery = ref("");
    const showAddDialog = ref(false);
    const showEditDialog = ref(false);

    const facility = reactive({
      name: "",
      maintenanceDate: "",
      description: "",
      imageUrl: "",
    });

    const facilityToEdit = reactive({
      id: null,
      name: "",
      maintenanceDate: "",
      description: "",
      imageUrl: "",
    });

    const displayedFacilities = ref([]);

    const fetchFacilities = async () => {
      try {
        facilities.value = await facilitiesService.findAll();
        displayedFacilities.value = facilities.value; // Initialize displayedFacilities
      } catch (error) {
        console.log(error);
      }
    };

    onBeforeMount(() => {
      fetchFacilities();
    });

    watch(
      searchQuery,
      (newValue) => {
        if (newValue.trim() === "") {
          displayedFacilities.value = facilities.value; // Show all facilities when search is empty
        } else {
          displayedFacilities.value = facilities.value.filter((facility) =>
            facility.name.toLowerCase().includes(newValue.toLowerCase())
          );
        }
      },
      { immediate: true }
    );

    const addFacility = async () => {
      try {
        await facilitiesService.create(facility);
        await fetchFacilities(); // Refresh the list after adding
        showAddDialog.value = false;
      } catch (error) {
        console.error("Error adding facility:", error);
      }
    };

    const editFacility = (facility) => {
      facilityToEdit.id = facility.id;
      facilityToEdit.name = facility.name;
      facilityToEdit.maintenanceDate = facility.maintenanceDate;
      facilityToEdit.description = facility.description;
      facilityToEdit.imageUrl = facility.imageUrl;
      showEditDialog.value = true;
    };

    const updateFacility = async () => {
      try {
        await facilitiesService.update(facilityToEdit.id, facilityToEdit);
        await fetchFacilities(); // Refresh the list after updating
        showEditDialog.value = false;
      } catch (error) {
        console.error("Error updating facility:", error);
      }
    };

    const deleteFacility = async (id) => {
      try {
        await facilitiesService.delete(id);
        await fetchFacilities(); // Refresh the list after deleting
      } catch (error) {
        console.error("Error deleting facility:", error);
      }
    };

    return {
      facilities,
      searchQuery,
      showAddDialog,
      showEditDialog,
      facility,
      facilityToEdit,
      displayedFacilities,
      addFacility,
      editFacility,
      updateFacility,
      deleteFacility,
    };
  },
};
</script>

<style>
.equipment-management {
  margin: 20px;
  padding-bottom: 20px;
  background: #d5d5d6;
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
  margin: 0px 20px;
  padding: 0px 20px;
  background: #d1d1d3;
}
.search-bar {
  margin: 0px 20px;
  padding: 10px 20px;
  display: flex;
}
.input-search {
  background: white;
  width: 70%;
  padding: 0px !important;
}
.dialog-add {
  width: 500px;
}
.dialog-update {
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
}
.btn-delete {
  margin-left: 5px;
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
  padding: 10px;
  text-align: center;
  border: 2px solid #343438;
}
td {
  border: 2px solid #343438;

  padding: 10px;
  text-align: center;
}
</style>