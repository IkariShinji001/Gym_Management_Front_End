<template>
  <div class="branch-management">
    <h3>Quản lý Chi Nhánh</h3>

    <div class="header-controls">
      <q-input
        class="search-bar"
        v-model="searchQuery"
        label="Tìm kiếm chi nhánh"
        filled
      />
      <q-btn class="btn-all" label="TẤT CẢ" @click="getAllBranches" />
      <q-select
        filled
        v-model="provinceIsSelectedForFiltering"
        :options="provinces"
        map-options
        emit-value
        label="Chọn thành phố"
        option-value="id"
        option-label="name"
        style="width: 250px"
        @update:model-value="filterBranchesInProvince"
      />
      <q-btn
        label="Thêm chi nhánh"
        icon="add"
        color="primary"
        @click="openAddBranch()"
        class="add-button"
      />
    </div>

    <q-table
      :rows="filteredBranches"
      :columns="columns"
      row-key="id"
      class="branch-table"
      flat
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            style="margin-right: 15px"
            icon="edit"
            color="primary"
            @click="editBranch(props.row)"
            dense
            flat
          />
          <q-btn
            icon="delete"
            color="negative"
            @click="deleteBranch(props.row.id)"
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
          <h4>Thêm chi nhánh</h4>
        </q-card-section>
        <q-card-section>
          <q-form @submit="submitAddBranch">
            <q-input v-model="branch.name" label="Tên chi nhánh" />
            <q-input v-model="branch.address" label="Địa chỉ" />
            <div class="container">
              <div class="input-province-district q-pa-md">
                <q-select
                  filled
                  v-model="provinceIsSelected"
                  :options="provinces"
                  map-options
                  emit-value
                  label="Chọn thành phố"
                  option-value="id"
                  option-label="name"
                  style="width: 300px"
                />
              </div>
              <div class="add-province">
                <q-btn
                  icon="add"
                  dense
                  flat
                  @click="OpenAddProvince"
                  title="Thêm thành phố"
                />
              </div>
              <div>
                <q-btn
                  class="add-province"
                  icon="update"
                  dense
                  flat
                  title="Cập nhật thành phố"
                  @click="showUpDateProvince = true"
                />
              </div>
            </div>
            <div class="container">
              <div class="input-province-district q-pa-md">
                <q-select
                  filled
                  v-model="branch.districtId"
                  :options="districts"
                  @filter="filterDistrictsInAddBranch"
                  map-options
                  emit-value
                  label="Chọn quận"
                  option-value="id"
                  option-label="name"
                  :disable="!provinceIsSelected"
                  style="width: 300px"
                />
              </div>
              <div class="add-province">
                <q-btn
                  icon="add"
                  class="OpenAddDistrict"
                  dense
                  flat
                  @click="OpenAddDistrict"
                />
              </div>
              <div>
                <q-btn
                  class="add-province"
                  icon="update"
                  dense
                  flat
                  title="Cập nhật quận"
                  @click="showUpDateDistrict = true"
                />
              </div>
            </div>
            <q-input v-model="branch.phoneNumber" label="Số địện thoại" />
            <q-input
              type="time"
              v-model="branch.openTime"
              label="Thời gian mở cửa"
            />
            <q-input
              type="time"
              v-model="branch.closedTime"
              label="Thời gian đóng cửa"
            />
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

    <q-dialog v-model="showUpProvince">
      <q-card class="dialog-update">
        <q-card-section>
          <div>
            <h5>Cập nhật thành phố</h5>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Edit Dialog -->
    <q-dialog v-model="showUpdateDialog" persistent>
      <q-card class="dialog-update">
        <q-card-section>
          <div>
            <h4>Cập nhật chi nhánh</h4>
          </div>
        </q-card-section>
        <q-card-section>
          <q-form @submit="updateBranch(branchToEdit.id, branchToEdit)">
            <q-input v-model="branchToEdit.name" label="Tên chi nhánh" />
            <q-input v-model="branchToEdit.address" label="Địa chỉ" />
            <div class="input-province-district q-pa-md">
              <q-select
                filled
                v-model="provinceIsChosen"
                :options="provinces"
                map-options
                emit-value
                label="Chọn thành phố"
                option-value="id"
                option-label="name"
                style="width: 300px"
              />
            </div>
            <div class="input-province-district q-pa-md">
              <q-select
                filled
                v-model="branchToEdit.districtId"
                :options="districts"
                @filter="filterDistrictsInUpdateBranch"
                map-options
                emit-value
                label="Chọn quận"
                option-value="id"
                option-label="name"
                style="width: 300px"
              />
            </div>
            <q-input v-model="branchToEdit.phoneNumber" label="Số địện thoại" />
            <q-input
              type="time"
              v-model="branchToEdit.openTime"
              label="Thời gian mở cửa"
            />
            <q-input
              type="time"
              v-model="branchToEdit.closedTime"
              label="Thời gian đóng cửa"
            />
            <q-btn label="Lưu" icon="save" type="submit" class="btn-save" />
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

    <!-- Thêm thành phố  -->
    <q-dialog v-model="showAddProvince" persistent>
      <q-card>
        <q-card-section>
          <h4>Thêm thành phố</h4>
        </q-card-section>
        <q-card-section>
          <q-form @submit="submitAddProvince">
            <h5>Tên thành phố</h5>
            <q-input v-model="province.name"> </q-input>
            <q-btn label="Lưu" icon="save" type="submit" class="btn-save" />
            <q-btn
              label="Hủy"
              icon="cancel"
              flat
              @click="showAddProvince = false"
              class="btn-cancel"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Cập nhật thành phố -->
    <q-dialog v-model="showUpDateProvince">
      <q-card>
        <div class="dialog-update-province-district">
          <div v-if="provinces.length === 0">
            <h5>Không có thành phố nào</h5>
          </div>
          <div
            v-for="province in provinces"
            :key="province.id"
            class="dialog-update-province-district-item"
          >
            <q-input v-model="province.name" style="font-size: 25px" />
            <q-btn
              icon="update"
              @click="updateProvince(province.id, province.name)"
              style="width: 100%"
              title="Cập nhật thành phố"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- Thêm quận  -->
    <q-dialog v-model="showAddDistrict" persistent>
      <q-card>
        <q-card-section>
          <h4>Thêm quận</h4>
        </q-card-section>
        <q-card-section>
          <q-form @submit="submitAddDistrict">
            <h5>Chọn thành phố</h5>
            <div class="input-province-district q-pa-md">
              <q-select
                filled
                v-model="district.provinceId"
                :options="provinces"
                map-options
                emit-value
                label="Chọn thành phố"
                option-value="id"
                option-label="name"
                style="width: 300px"
              />
            </div>
            <h5>Nhập tên quận</h5>
            <q-input v-model="district.name"> </q-input>
            <q-btn label="Lưu" icon="save" type="submit" class="btn-save" />
            <q-btn
              label="Hủy"
              icon="cancel"
              flat
              @click="showAddDistrict = false"
              class="btn-cancel"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Cập nhật quận -->
    <q-dialog v-model="showUpDateDistrict">
      <q-card>
        <div class="dialog-update-province-district">
          <div v-if="districts.length === 0">
            <h5>Không có quận nào</h5>
          </div>
          <div
            v-for="district in districts"
            :key="district.id"
            class="dialog-update-province-district-item"
          >
            <q-input v-model="district.name" style="font-size: 25px" />

            <q-btn
              icon="update"
              @click="updateDistrict(district.id, district.name)"
              style="width: 100%"
              title="Cập nhật thành phố"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên chi nhánh</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="branch in branches" :key="branch.id">
          <td>{{ branch.id }}</td>
          <td>{{ branch.name }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Nút điều khiển phân trang -->
    <div class="pagination">
      <button @click="changePage(page - 1)" :disabled="page === 1">
        Previous
      </button>

      <span>Page {{ page }} of {{ lastPage }}</span>

      <button @click="changePage(page + 1)" :disabled="page === lastPage">
        Next
      </button>
    </div>
  </div>
</template>
    
    <script setup>
import { ref, reactive, computed, onBeforeMount } from "vue";
import { useToast } from "vue-toastification";
import branchesService from "../services/branches.service.js";
import provincesService from "../services/provinces.service.js";
import districtsService from "../services/districts.service";

const toast = useToast();
const branches = ref([]);
const searchQuery = ref("");
const showAddDialog = ref(false);
const showAddProvince = ref(false);
const showAddDistrict = ref(false);
const showUpProvince = ref(false);
const showUpdateDialog = ref(false);
const provinceIsSelectedForFiltering = ref("");
const provinceIsChosen = ref("");
const provinceIsSelected = ref();
const provinces = ref([]);
const districtsIsSelected = ref();
const districts = ref([]);
const showUpDateProvince = ref(false);
const showUpDateDistrict = ref(false);

const branch = reactive({
  name: "",
  address: "",
  phoneNumber: "",
  openTime: "",
  closedTime: "",
  districtId: "",
});

const branchToEdit = reactive({
  id: "",
  name: "",
  address: "",
  phoneNumber: "",
  openTime: "",
  closedTime: "",
  districtId: "",
});

const province = reactive({
  name: "",
});

const district = reactive({
  name: "",
  provinceId: "",
});

const columns = [
  { name: "id", label: "ID", align: "center", field: "id" },
  {
    name: "name",
    label: "Tên chi nhánh",
    align: "center",
    field: "name",
  },
  {
    name: "address",
    label: "Địa chỉ",
    align: "center",
    field: (row) =>
      row.address +
      ", " +
      row.district.name +
      ", " +
      row.district.province.name,
  },
  {
    name: "phoneNumber",
    label: "Số điện thoại",
    align: "center",
    field: "phoneNumber",
  },
  {
    name: "openTime",
    label: "Thời gian mở cửa",
    align: "center",
    field: "openTime",
  },
  {
    name: "closedTime",
    label: "Thời gian đóng cửa",
    align: "center",
    field: "closedTime",
  },
  { name: "action", label: "Hành Động", align: "center" },
];

const openAddBranch = () => {
  branch.name = "";
  branch.address = "";
  branch.phoneNumber = "";
  branch.districtId = "";
  provinceIsSelected.value = "";
  branch.openTime = "";
  branch.closedTime = "";

  showAddDialog.value = true;
};

const OpenAddProvince = () => {
  province.name = "";
  showAddProvince.value = true;
};

const OpenAddDistrict = () => {
  district.name = "";
  district.provinceId = "";
  showAddDistrict.value = true;
};

const getAllBranches = async () => {
  branches.value = await branchesService.findAll();
};

const filterBranchesInProvince = async () => {
  branches.value = await branchesService.findBranchInProvince(
    provinceIsSelectedForFiltering.value
  );
};

onBeforeMount(async () => {
  try {
    branches.value = await branchesService.findAll();
    provinces.value = await provincesService.findAll();
    districts.value = await districtsService.findAll();
    // const newbranches = branches.value.map((branch) => {
    //   return {
    //     name: branch.name,
    //     address: branch.address,
    //     closedTime: branch.closedTime,
    //     openTime: branch.openTime,
    //     phoneNumber: branch.phoneNumber,
    //     districtName: branch.district.name,
    //     provinceName: branch.district.province.name,
    //   };
    // });
    // console.log(newbranches);
  } catch (error) {
    console.error(error);
  }
});

const filteredBranches = computed(() => {
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const normalizedQuery = removeAccents(searchQuery.value.trim().toLowerCase());

  if (normalizedQuery === "") {
    return branches.value;
  }
  return branches.value.filter((branch) =>
    removeAccents(branch.name.toLowerCase()).includes(normalizedQuery)
  );
});

// const filterProvinces = (valueInput, update) => {
//   update(async () => {
//     provinces.value = await provincesService.findAll();
//     if (valueInput == "") {
//       console.log(provinces.value);
//       return provinces.value;
//     } else {
//       const input = valueInput.toLowerCase();
//       provinces.value = provinces.value.filter(
//         (province) => province.name.toLowerCase().indexOf(input) > -1
//       );
//     }
//   });
// };

const filterDistrictsInAddBranch = (valueInput, update) => {
  update(async () => {
    districts.value = await districtsService.findDistrictsInProvince(
      provinceIsSelected.value
    );
    if (valueInput == "") {
      return districts.value;
    }
  });
};

const filterDistrictsInUpdateBranch = (valueInput, update) => {
  update(async () => {
    districts.value = await districtsService.findDistrictsInProvince(
      provinceIsChosen.value
    );
    if (valueInput == "") {
      return districts.value;
    }
  });
};

const submitAddBranch = async () => {
  try {
    console.log(branch);
    const res = await branchesService.create(branch);
    branches.value.push(res);
    showAddDialog.value = false;
    toast.success("Thêm chi nhánh thành công");
  } catch (error) {
    console.error("Error add maintenance: " + error);
  }
};

const submitAddProvince = async () => {
  try {
    const res = await provincesService.create(province);
    provinces.value.push(res);
    showAddProvince.value = false;
    toast.success("Thêm thành phố thành công");
  } catch (error) {
    console.error("Error add province:" + error);
  }
};

const submitAddDistrict = async () => {
  try {
    const res = await districtsService.create(district);
    districts.value.push(res);
    showAddDistrict.value = false;
    toast.success("Thêm quận thành công");
  } catch (error) {
    console.error("Error add district:" + error);
  }
};

const updateProvince = async (id, nameProvince) => {
  const province = {
    name: nameProvince,
  };
  const res = await provincesService.update(id, province);
  const index = provinces.value.findIndex((province) => province.id == id);
  Object.assign(provinces.value[index], res);
  toast.success("Cập nhật thành phố thành công");
  showUpDateProvince.value = false;
};

const updateDistrict = async (id, nameDistrict) => {
  const district = {
    name: nameDistrict,
  };
  const res = await districtsService.update(id, district);
  const index = districts.value.findIndex((district) => district.id == id);
  Object.assign(districts.value[index], res);
  toast.success("Cập nhật quận thành công");
  showUpDateDistrict.value = false;
};

const editBranch = async (branchData) => {
  provinceIsChosen.value = branchData.district.province.id;
  branchToEdit.id = branchData.id;
  branchToEdit.name = branchData.name;
  branchToEdit.address = branchData.address;
  branchToEdit.phoneNumber = branchData.phoneNumber;
  branchToEdit.openTime = branchData.openTime;
  branchToEdit.closedTime = branchData.closedTime;
  branchToEdit.districtId = branchData.district.name;
  showUpdateDialog.value = true;
};

const updateBranch = async (id, branchToEdit) => {
  try {
    const nameIndex = branches.value.findIndex(
      (brand) => brand.district.name == branchToEdit.districtId
    );
    console.log(branches.value);
    console.log(nameIndex);
    if (nameIndex >= 0) {
      branchToEdit.districtId = branches.value[nameIndex].district.id;
    } else {
      branchToEdit.districtId = branchToEdit.districtId;
    }
    console.log(branchToEdit.districtId);
    const res = await branchesService.update(id, branchToEdit);
    console.log(res);
    const index = branches.value.findIndex((branch) => branch.id == id);
    Object.assign(branches.value[index], res);
    showUpdateDialog.value = false;
    toast.success("Cập nhật chi nhánh thành công");
  } catch (error) {
    console.error("Error update maintenance: " + error);
  }
};

const deleteBranch = async (id) => {
  try {
    await branchesService.delete(id);
    const index = branches.value.findIndex((item) => item.id === id);
    branches.value.splice(index, 1);
    toast.success("Xóa chi nhánh thành công");
  } catch (error) {
    console.error("Error deleting maintenance:", error);
  }
};
</script>
    
    <style scoped>
.branch-management {
  padding: 20px;
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  width: 50%;
}

.btn-all {
  margin: auto;
  height: 53px;
  background: rgb(26, 127, 241);
  color: white;
}

h4 {
  margin: 20px;
}

h5 {
  margin: 0px;
}

.add-button {
  margin-left: 47px;
  height: 52px;
  border-radius: 10px;
}

.branch-table {
  height: 400px;
  width: 100%;
  overflow-y: auto;
}

.container {
  display: flex;
  align-items: center;
}

.input-province-district {
  padding: 0px;
  margin-bottom: 15px;
  margin-top: 15px;
}

.add-province {
  background: #284df1;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 5px;
  margin-left: 10px;
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
  width: 520px;
}

.dialog-update {
  width: 520px;
}
.dialog-update-province-district {
  display: grid;
  grid-template-columns: repeat(4, auto);
  max-width: 900px;
  padding: 5px;
}
.dialog-update-province-district-item {
  border: 1px solid black;
  margin: 3px !important;
  padding: 5px;
}
</style>