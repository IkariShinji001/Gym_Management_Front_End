<template>
  <div>
    <h3>Quản lý thiết bị dụng cụ</h3>
    <div class="equipment-management">
      <div class="search-bar">
        <q-input
          class="input-search"
          v-model="searchQuery"
          label="Tìm kiếm thiết bị"
          filled
        />
        <q-btn class="btn-all" label="TẤT CẢ" @click="getAllFacilities" />
        <q-select
          class="search-bar-q-select"
          filled
          v-model="branchIdIsSelected"
          :options="branches"
          label="Chọn chi nhánh"
          map-options
          emit-value
          option-value="id"
          option-label="name"
          @update:model-value="filterFacilities"
          @click="updateBranches"
        />
        <q-btn
          class="btn-add"
          label="Thêm thiết bị"
          icon="add"
          color="primary"
          @click="OpenAddDialog"
        />
      </div>

      <div class="table">
        <table style="width: 100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Hình ảnh</th>
              <th>Ngày mua</th>
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
              <td width="4%" scope="row">{{ id + 1 }}</td>
              <td>{{ facility.name }}</td>
              <td style="width: 15%">
                <img
                  :src="facility.imageUrl"
                  alt="Hình ảnh thiết bị"
                  style="width: 150px; height: 100px"
                />
              </td>
              <td width="13%">{{ formatDate(facility.purchaseDate) }}</td>
              <td>
                <q-btn
                  style="border-radius: 10px"
                  icon="add"
                  color="primary"
                  @click="addMaintenance(facility.id)"
                  title="Thêm bảo trì"
                />
              </td>
              <td width="8%">
                <div class="q-pa-md">
                  <q-toggle
                    v-model="facility.isActive"
                    color="blue"
                    @update:model-value="updateFacility(facility.id, facility)"
                    title="Cập nhật trạng thái hoạt động"
                  />
                </div>
              </td>
              <td width="29%">
                <q-btn
                  class="btn-update"
                  icon="visibility"
                  @click="viewFacilityDetails(facility)"
                  title="Xem chi tiết thiết bị"
                /><q-btn
                  class="btn-update"
                  icon="list"
                  @click="viewMaintenanceHistory(facility.id)"
                  title="Xem lịch sử bảo trì"
                />
                <q-btn
                  class="btn-update"
                  icon="update"
                  @click="editFacility(facility)"
                  title="Chỉnh sửa thiết bị"
                />
                <q-btn
                  class="btn-delete"
                  icon="delete"
                  @click="deleteFacility(facility.id)"
                  title="Xóa thiết bị"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Thêm thiết bị vào lịch bảo trì -->
      <q-dialog v-model="showAddMaintenance">
        <q-card class="dialog">
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

      <!-- Xem chi tiết thiết bị -->
      <q-dialog v-model="showFacilityDetails" persistent>
        <q-card class="dialog">
          <q-card-section>
            <h4>Xem chi tiết thông tin thiết bị</h4>
          </q-card-section>
          {{ facilityIsSelected }}
          <q-card-section class="flex justify-center items-center">
            <q-img
              :src="facilityIsSelected.imageUrl"
              alt="Hình ảnh thiết bị"
              style="max-width: 300px; height: 150px"
            />
          </q-card-section>

          <q-card-section>
            <q-form>
              <q-input
                v-model="facilityIsSelected.name"
                label="Tên thiết bị"
                readonly
              />
              <q-input
                v-model="facilityIsSelected.description"
                label="Mô tả"
                readonly
              />
              <q-input
                v-model="facilityIsSelected.branchId"
                label="Chi nhánh"
                readonly
              />
              <q-input
                type="date"
                v-model="facilityIsSelected.purchaseDate"
                label="Ngày mua"
                readonly
              />
              <q-input
                type="date"
                v-model="facilityIsSelected.warrantyStartDate"
                label="Ngày bắt đầu bảo hành"
                readonly
              />
              <q-input
                type="date"
                v-model="facilityIsSelected.warrantyEndDate"
                label="Ngày kết thúc bảo hành"
                readonly
              />
              <q-btn
                class="btn-cancel"
                icon="cancel"
                label="Thoát"
                flat
                @click="showFacilityDetails = false"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Xem lịch sử bảo trì -->
      <q-dialog v-model="showMaintenanceHistory" persistent>
        <q-card style="width: 1000px !important">
          <q-card-section>
            <h4>Lịch sử bảo trì: {{ facility.name }}</h4>
          </q-card-section>
          <q-card-section>
            <div>
              <table style="width: 100%">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mô tả</th>
                    <th>Ngày bảo trì</th>
                    <th>Hoàn thành</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="listMaintenancesOfFacility.length === 0">
                    <td colspan="11" style="text-align: center; padding: 20px">
                      No data available
                    </td>
                  </tr>
                  <tr
                    v-for="(
                      maintenanceOfFacility, id
                    ) in listMaintenancesOfFacility"
                    :key="maintenanceOfFacility.id"
                  >
                    <td width="3%" scope="row">{{ id + 1 }}</td>
                    <td>
                      {{ maintenanceOfFacility.description }}
                    </td>
                    <td>{{ formatDate(maintenanceOfFacility.date) }}</td>
                    <td>
                      <div class="q-pa-md">
                        <q-checkbox
                          v-model="maintenanceOfFacility.isFinished"
                          :disable="maintenanceOfFacility.isFinished"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-card-section>
          <q-card-section>
            <q-btn
              class="btn-cancel"
              icon="cancel"
              label="Thoát"
              flat
              @click="showMaintenanceHistory = false"
            />
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- QDialog component thêm thiết bị-->
      <q-dialog v-model="showAddDialog" persistent>
        <q-card class="dialog">
          <q-card-section>
            <h4>Thêm thiết bị mới</h4>
          </q-card-section>
          <q-card-section>
            <q-form @submit="addFacility">
              <q-input v-model="facility.name" label="Tên thiết bị" />
              <q-file
                class="q-select"
                v-model="facility.imageUrl"
                label="chọn ảnh cho thiết bị"
                filled
                :counter-label="file ? file.name : 'Chưa chọn tệp nào'"
              />
              <q-input v-model="facility.description" label="Mô tả" />
              <div class="q-select q-gutter-md">
                <q-select
                  filled
                  v-model="facility.branchId"
                  :options="branches"
                  label="Chọn chi nhánh"
                  map-options
                  emit-value
                  option-value="id"
                  option-label="name"
                />
              </div>
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
        <q-card class="dialog">
          <q-card-section>
            <h4>Sửa thông tin thiết bị</h4>
          </q-card-section>

          <q-card-section class="flex justify-center items-center">
            <q-img
              :src="facilityIsSelected.imageUrl"
              alt="Hình ảnh thiết bị"
              style="max-width: 300px; height: 150px"
            />
          </q-card-section>

          <q-card-section>
            <q-form
              @submit="
                updateFacility(facilityIsSelected.id, facilityIsSelected)
              "
            >
              <q-input v-model="facilityIsSelected.name" label="Tên thiết bị" />
              <q-file
                v-model="facilityIsSelected.imageUrl"
                label="chọn ảnh cho thiết bị"
                filled
                :counter-label="file ? file.name : 'Chưa chọn tệp nào'"
                class="q-select"
                @update:model-value="updateImg"
              />
              <q-input v-model="facilityIsSelected.description" label="Mô tả" />
              <q-select
                filled
                v-model="facilityIsSelected.branchId"
                :options="branches"
                label="chọn chi nhánh"
                map-options
                emit-value
                option-value="id"
                option-label="name"
              />
              <q-input
                type="date"
                v-model="facilityIsSelected.purchaseDate"
                label="Ngày mua"
              />
              <q-input
                type="date"
                v-model="facilityIsSelected.warrantyStartDate"
                label="Ngày bắt đầu bảo hành"
              />
              <q-input
                type="date"
                v-model="facilityIsSelected.warrantyEndDate"
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

<script setup>
import { ref, reactive, onBeforeMount, computed } from "vue";
import { useToast } from "vue-toastification";
import facilitiesService from "../services/facilities.service";
import branchesService from "../services/branches.service";
import maintenancesService from "../services/maintenance.service";
import uploadFileService from "../services/uploadFile.service";

const toast = useToast();
const facilities = ref([]);
const branches = ref([]);
const searchQuery = ref("");
const showAddMaintenance = ref(false);
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const showFacilityDetails = ref(false);
const showMaintenanceHistory = ref(false);
const listMaintenancesOfFacility = ref([]);
const publicIdOld = ref("");
const branchIdIsSelected = ref("");

const facility = reactive({
  name: "",
  description: "",
  imageUrl: "",
  nameBranch: "",
  branchId: "",
  nameBranch: "",
  purchaseDate: "",
  warrantyStartDate: "",
  warrantyEndDate: "",
});

const facilityIsSelected = reactive({
  name: "",
  description: "",
  imageUrl: "",
  nameBranch: "",
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
    console.log(facilities.value)
    branches.value = await branchesService.findAll();
  } catch (error) {
    console.log(error);
  }
});

// Use computed to filter facilities based on searchQuery
const filteredFacilities = computed(() => {
  // Hàm loại bỏ dấu tiếng Việt
  const removeAccents = (str) => {
    return str
      .normalize("NFD") // Chuyển đổi ký tự có dấu thành các ký tự và dấu tách biệt
      .replace(/[\u0300-\u036f]/g, ""); // Loại bỏ các dấu kết hợp
  };

  // Chuẩn hóa searchQuery để tìm kiếm
  const normalizedQuery = removeAccents(searchQuery.value.trim().toLowerCase());

  if (normalizedQuery === "") {
    return facilities.value; // Hiển thị tất cả cơ sở khi tìm kiếm trống
  }

  return facilities.value.filter((facility) =>
    removeAccents(facility.name.toLowerCase()).includes(normalizedQuery)
  );
});

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

const getAllFacilities = async () => {
  facilities.value = await facilitiesService.findAll();
}

const filterFacilities = async () => {
  facilities.value = await facilitiesService.findFacilitiesByBranchId(branchIdIsSelected.value);
}

const updateBranches = async () => {
  branches.value = await branchesService.findAll();
}

const OpenAddDialog = async () => {
  branches.value = await branchesService.findAll();
  (facility.name = ""),
    (facility.description = ""),
    (facility.imageUrl = ""),
    (facility.branchId = ""),
    (facility.purchaseDate = ""),
    (facility.warrantyStartDate = ""),
    (facility.warrantyEndDate = ""),
    (showAddDialog.value = true);
};

const addFacility = async () => {
  try {
    const formData = new FormData();
    formData.append("file", facility.imageUrl);
    const res = await uploadFileService.uploadFile(formData);
    facility.imageUrl = res.secure_url;
    const newFacility = await facilitiesService.create(facility);
    console.log(newFacility);
    facilities.value.push(newFacility);
    showAddDialog.value = false;
    toast.success("Thêm thiết bị thành công");
  } catch (error) {
    console.error("Error adding facility:", error);
  }
};

const addMaintenance = (id) => {
  maintenance.facilityIds = [];
  maintenance.facilityIds.push(id);
  maintenance.description = "";
  maintenance.date = "";
  showAddMaintenance.value = true;
};

const submitAddMaintenance = async () => {
  try {
    const id = maintenance.facilityIds[0];
    const facility = await facilitiesService.checkFacilityIsFinishedIsFalse(id);
    if (!facility) {
      console.log(maintenance);
      await maintenancesService.create(maintenance);
      showAddMaintenance.value = false;
      toast.success("Thêm bảo trì thành công");
    } else {
      toast.error("Thiết bị đang bảo trì");
    }
  } catch (error) {
    console.error("Error adding maintenance:", error);
  }
};

const viewMaintenanceHistory = async (idFacility) => {
  listMaintenancesOfFacility.value =
    await maintenancesService.maintenanceHistory(idFacility);
  const facilityIsFound = await facilitiesService.findById(idFacility);
  console.log(facilityIsFound);
  facility.name = facilityIsFound.name;
  console.log(listMaintenancesOfFacility.value);
  showMaintenanceHistory.value = true;
};

const viewFacilityDetails = async (facility) => {
  facility.purchaseDate = formatDateInput(facility.purchaseDate);
  facility.warrantyStartDate = formatDateInput(facility.warrantyStartDate);
  facility.warrantyEndDate = formatDateInput(facility.warrantyEndDate);
  Object.assign(facilityIsSelected, facility);
  const nameBranch = await branchesService.findOne(facilityIsSelected.branchId);
  facilityIsSelected.branchId = nameBranch.name;
  showFacilityDetails.value = true;
};

// Lấy PublicId từ chuỗi string của image
const getPublicId = (url) => {
  // Tách chuỗi URL bằng dấu "/"
  const parts = url.split("/");
  // Lấy phần tử cuối trước phần mở rộng file để có public_id
  const publicIdWithExtension = parts[parts.length - 1];
  // Loại bỏ phần mở rộng file (.jpg, .png, v.v.)
  const publicId = publicIdWithExtension.split(".")[0];
  return publicId;
};

const updateImg = async () => {
  if (facilityIsSelected.imageUrl) {
    await uploadFileService.deleteImage(publicIdOld);
    const formData = new FormData();
    formData.append("file", facilityIsSelected.imageUrl);
    const res = await uploadFileService.uploadFile(formData);
    facilityIsSelected.imageUrl = res.secure_url;
    publicIdOld.value = getPublicId(facilityIsSelected.imageUrl);
  }
};

const editFacility = async (facility) => {
  branches.value = await branchesService.findAll()
  facility.purchaseDate = formatDateInput(facility.purchaseDate);
  facility.warrantyStartDate = formatDateInput(facility.warrantyStartDate);
  facility.warrantyEndDate = formatDateInput(facility.warrantyEndDate);
  Object.assign(facilityIsSelected, facility);
  publicIdOld.value = getPublicId(facilityIsSelected.imageUrl);
  showEditDialog.value = true;
};

const updateFacility = async (id, facilityIsSelected) => {
  try {
    // if (facilityIsSelected.imageUrl instanceof File) {
    //   const formData = new FormData();
    //   formData.append("file", facilityIsSelected.imageUrl);
    //   const res = await uploadFileService.uploadFile(formData);
    //   facilityIsSelected.imageUrl = res.secure_url;
    //   await uploadFileService.deleteImage(publicIdOld);
    // } else {
    //   console.log(facilityIsSelected.imageUrl);
    // }

    // Loại bỏ thuộc tính nameBranch
    delete facilityIsSelected.nameBranch;

    const facilityToUpdate = await facilitiesService.update(
      id,
      facilityIsSelected
    );

    const index = facilities.value.findIndex((facility) => facility.id == id);
    Object.assign(facilities.value[index], facilityToUpdate);

    showEditDialog.value = false;
    toast.success("Cập nhật thiết bị thành công");
  } catch (error) {
    console.error("Error updating facility:", error);
  }
};

const deleteFacility = async (id) => {
  try {
    const facilityToUpdate = await facilitiesService.findById(id);
    const publicId = getPublicId(facilityToUpdate.imageUrl);
    await uploadFileService.deleteImage(publicId);
    await facilitiesService.delete(id);
    const index = facilities.value.findIndex((item) => item.id === id);
    facilities.value.splice(index, 1);
    toast.success("Xóa thiết bị thành công");
  } catch (error) {
    console.error("Error deleting facility:", error);
  }
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
}
h4 {
  margin: 20px 20px 0px 20px;
  padding: 20px;
}
.table {
  width: 100% !important;
  table-layout: auto;
  overflow-y: auto;
  height: 370px;
  border: 1px solid #959599;
}
.search-bar {
  margin-bottom: 10px;
  width: 100%;
  display: flex;
}
.input-search {
  background: white;
  width: 50%;
  margin-top: 8px;
}
.btn-all {
  margin: auto;
  height: 53px;
  background: rgb(26, 127, 241);
  color: white;
}
.search-bar-q-select {
  padding: 0px;
  margin: auto;
  width: 250px;
}
.btn-add {
  margin-top: 10px !important;
  margin-left: 50px;
  height: 53px;
  border-radius: 6px;
}
.dialog {
  width: 500px;
}
.btn-update {
  margin-right: 15px;
  background: rgb(241, 241, 37);
  color: black;
  border-radius: 10px;
}
.btn-delete {
  background: red;
  border-radius: 10px;
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
  border: 1px solid #959599;
}
td {
  border: 1px solid #959599;
  padding: 5px;
  text-align: center;
}
tr {
  transition: background-color 0.3s;
}
tr:hover {
  background: #e4dfdf;
}

.q-select {
  margin: 10px 0px 10px 0px;
}
</style>