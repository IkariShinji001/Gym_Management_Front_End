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
        :options="provincesInFilter"
        map-options
        emit-value
        label="Chọn thành phố"
        option-value="id"
        option-label="name"
        style="width: 240px"
        @update:model-value="filterBranchesInProvince"
      />
      <q-btn
        label="Thêm chi nhánh"
        icon="add"
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
            <div class="input-province-district q-pa-md">
              <q-select
                filled
                v-model="ProvinceIsSelected"
                :options="provinces"
                map-options
                label="Chọn thành phố"
                option-label="name"
                style="width: 300px"
                @update:model-value="
                  saveProvinceIsSelected(
                    ProvinceIsSelected.code,
                    ProvinceIsSelected.name
                  )
                "
              />
            </div>
            <div class="input-province-district q-pa-md">
              <q-select
                filled
                v-model="districtsIsSelected"
                :options="districts"
                @filter="filterDistricts"
                map-options
                emit-value
                label="Chọn quận"
                option-value="name"
                option-label="name"
                :disable="!ProvinceIsSelected"
                style="width: 300px"
              />
            </div>
            <q-input
              v-model="branch.phoneNumber"
              label="Số địện thoại"
              maxlength="10"
            />
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
            <q-input
              style="text-transform: capitalize"
              v-model="branchToEdit.name"
              label="Tên chi nhánh"
            />
            <q-input v-model="branchToEdit.address" label="Địa chỉ" />
            <div class="input-province-district q-pa-md">
              <q-select
                filled
                v-model="ProvinceIsSelected"
                :options="provinces"
                map-options
                label="Chọn thành phố"
                option-label="name"
                style="width: 300px"
                @update:model-value="
                  saveProvinceIsSelected(
                    ProvinceIsSelected.code,
                    ProvinceIsSelected.name
                  )
                "
              />
            </div>
            <div class="input-province-district q-pa-md">
              <q-select
                filled
                v-model="branchToEdit.districtId"
                :options="districts"
                @filter="filterDistricts"
                map-options
                emit-value
                label="Chọn quận"
                option-value="name"
                option-label="name"
                style="width: 300px"
              />
            </div>
            <q-input
              v-model="branchToEdit.phoneNumber"
              label="Số địện thoại"
              maxlength="10"
            />
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
  </div>
</template>
    
    <script setup>
import { ref, reactive, computed, onBeforeMount } from "vue";
import { useToast } from "vue-toastification";
import districtsService from "../services/districts.service.js";
import provincesService from "../services/provinces.service.js";
import branchesService from "../services/branches.service.js";
import locationService from "../services/location.service.js";
import { useQuasar } from "quasar";

const toast = useToast();
const branches = ref([]);
const searchQuery = ref("");
const showAddDialog = ref(false);
const showUpdateDialog = ref(false);
const provinceIsSelectedForFiltering = ref("");
const provinces = ref([]);
const districtsIsSelected = ref();
const districts = ref([]);
const ProvinceIsSelected = ref();
const provincesInFilter = ref([]);
const $q = useQuasar();
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

// const provinceIsSelected = reactive({
//   name: "",
//   code: "",
// });

const province = reactive({
  name: "",
  id_external: "",
});

const district = reactive({
  name: "",
  provinceId: "",
});

const columns = [
  { name: "index", label: "STT", align: "center", field: "index" },
  {
    name: "name",
    label: "Tên chi nhánh",
    align: "center",
    field: "name",
    style: "text-transform: capitalize",
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
  ProvinceIsSelected.value = "";
  districtsIsSelected.value = "";
  branch.openTime = "";
  branch.closedTime = "";
  showAddDialog.value = true;
};

const getAllBranches = async () => {
  provinceIsSelectedForFiltering.value = "";
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
    console.log(branches.value);
    provincesInFilter.value = await provincesService.findAll();
    provinces.value = await locationService.findAllProvinces();
    console.log(provinces.value);
    // console.log(provinces.value);
    // districts.value = await districtsService.findAll();
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

  // Tạo danh sách với chỉ số tự tăng
  const branchesWithIndex = branches.value.map((branch, index) => ({
    ...branch,
    index: index + 1, // Thêm thuộc tính 'index' tự động tăng
  }));

  // Nếu không có truy vấn, trả về toàn bộ danh sách với chỉ số
  if (normalizedQuery === "") {
    return branchesWithIndex;
  }

  // Lọc chi nhánh dựa trên truy vấn tìm kiếm
  return branchesWithIndex.filter((branch) =>
    removeAccents(branch.name.toLowerCase()).includes(normalizedQuery)
  );
});

// computed: {
//   filteredBranches() {
//     return this.branches.map((branch, index) => ({
//       ...branch,
//       index: index + 1, // Thêm thuộc tính 'index' tự động tăng
//     }));
//   }
// };

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

const saveProvinceIsSelected = (codeProvince, nameProvince) => {
  (province.name = nameProvince), (province.id_external = codeProvince);
  console.log(province.name);
  console.log(province.id_external);
};

const filterDistricts = (valueInput, update) => {
  update(async () => {
    const res = await locationService.findAllDistrictsByProvince(
      province.id_external
    );
    console.log(res);
    districts.value = res.districts;

    if (valueInput === "") {
      return districts.value;
    }
  });
};

const submitAddBranch = async () => {
  $q.loading.show();
  try {
    if (
      !branch.name ||
      !branch.phoneNumber ||
      !branch.openTime ||
      !branch.closedTime ||
      !districtsIsSelected.value
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin chi nhánh!");
      return;
    } else {
      const nameBranch = await branchesService.checkNameBranchExisted(
        branch.name,
        9999999999
      );
      if (nameBranch) {
        toast.error("Trùng tên chi nhánh");
      } else {
        // Kiểm tra số điện thoại
        const phoneNumberPattern = /^\d{10}$/; // Chỉ chấp nhận 10 chữ số

        if (!phoneNumberPattern.test(branch.phoneNumber)) {
          toast.error(
            "Số điện thoại phải là 10 chữ số và không chứa ký tự chữ."
          );
          return;
        }
        const newProvince = await provincesService.create(province);
        console.log(newProvince);
        district.name = districtsIsSelected.value;
        district.provinceId = newProvince.id;
        const newDistrict = await districtsService.create(district);
        branch.districtId = newDistrict.id;
        const newBranch = await branchesService.create(branch);
        console.log(newBranch);
        branches.value.push(newBranch);
        provincesInFilter.value = await provincesService.findAll();
        showAddDialog.value = false;
        toast.success("Thêm chi nhánh thành công");
      }
    }
  } catch (error) {
    console.error("Error add branch: " + error);
  } finally {
    $q.loading.hide();
  }
};

const editBranch = async (branchData) => {
  province.id_external = branchData.district.province.id_external;
  ProvinceIsSelected.value = branchData.district.province.name;
  console.log(ProvinceIsSelected.value);
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
    const nameBranch = await branchesService.checkNameBranchExisted(
      branchToEdit.name,
      id
    );
    console.log(nameBranch);
    if (nameBranch) {
      toast.error("Trùng tên chi nhánh");
    } else {
      // Kiểm tra số điện thoại
      const phoneNumberPattern = /^\d{10}$/; // Chỉ chấp nhận 10 chữ số

      if (!phoneNumberPattern.test(branchToEdit.phoneNumber)) {
        toast.error("Số điện thoại phải là 10 chữ số và không chứa ký tự chữ.");
        return;
      }
      const nameProvinceIndex = branches.value.findIndex(
        (branch) => branch.district.province.name === ProvinceIsSelected.value
      );
      console.log(nameProvinceIndex);

      const nameDistrictIndex = branches.value.findIndex(
        (brand) => brand.district.name == branchToEdit.districtId
      );
      console.log(nameDistrictIndex);
      //TH khong chon thanh pho va khong chon quan
      if (nameProvinceIndex >= 0) {
        ProvinceIsSelected.value =
          branches.value[nameProvinceIndex].district.province.id;
        console.log(ProvinceIsSelected.value);
        // province.id_external = branches.value[nameProvinceIndex].district.province.id_external;
        if (nameDistrictIndex >= 0) {
          branchToEdit.districtId =
            branches.value[nameDistrictIndex].district.id;
        } //TH khong chon thanh pho nhung chon quan
        else {
          district.name = branchToEdit.districtId;
          district.provinceId = ProvinceIsSelected.value;
          const newDistrict = await districtsService.create(district);
          console.log(newDistrict);
          branchToEdit.districtId = newDistrict.id;
        }
      } // TH chon thanh pho va chon quan
      else {
        console.log(province.name);
        // console.log()
        const newProvince = await provincesService.create(province);
        console.log(newProvince);
        branchToEdit.districtId = branchToEdit.districtId;
        district.name = branchToEdit.districtId;
        district.provinceId = newProvince.id;
        const newDistrict = await districtsService.create(district);
        console.log(newDistrict);
        branchToEdit.districtId = newDistrict.id;
      }

      const res = await branchesService.update(id, branchToEdit);
      console.log(res);
      const index = branches.value.findIndex((branch) => branch.id == id);
      Object.assign(branches.value[index], res);
      showUpdateDialog.value = false;
      toast.success("Cập nhật chi nhánh thành công");
    }
  } catch (error) {
    console.error("Error update branch: " + error);
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
  margin: auto 50px auto 50px;
  height: 54px;
  background: var(--icon-color) !important;
  color: black;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.5) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
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
  margin-left: 50px;
  height: 52px;
  border-radius: 7px;
  background: var(--icon-color) !important;
  color: black;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.5) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
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