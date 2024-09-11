<template>
  <div>
    <div class="service-btns-container">
      <q-btn-dropdown
        flat
        size="22px"
        :label="selectedType || 'Phân loại'"
        class="btn-dropdown-type"
        dropdown-icon="format_list_bulleted"
      >
        <q-list>
          <q-item
            clickable
            v-close-popup
            @click="fileterServicePackageByTypeId(0)"
          >
            <q-item-section>
              <q-item-label class="type-item">Tất cả</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-for="(type, index) in packageTypes"
            clickable
            v-close-popup
            :key="index"
            @click="fileterServicePackageByTypeId(type)"
          >
            <q-item-section>
              <q-item-label class="type-item">{{ type.type }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn-dropdown
        flat
        size="22px"
        label="Cập nhật"
        class="btn-dropdown-update"
        dropdown-icon="settings"
      >
        <q-list>
          <q-item clickable v-close-popup @click="showCreateDuration = true">
            <q-item-section side>
              <q-icon name="date_range" class="update-icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Thêm thời hạn </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            @click="showCreateFitnessPackage = true"
          >
            <q-item-section side>
              <q-icon name="add_circle" class="update-icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Thêm gói</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="showCreatePackageType = true">
            <q-item-section side>
              <q-icon name="add_circle" class="update-icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Thêm loại dịch vụ</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="showUpdatePackageType = true">
            <q-item-section side>
              <q-icon name="build_circle" class="update-icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Cập nhật dịch vụ</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="showUpdateBenefitView = true">
            <q-item-section side>
              <q-icon name="build_circle" class="update-icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <router-link class="login-pw" to="/admins/package-benefits">Danh sách quyền lợi</router-link>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div class="service-cards-container">
      <div
        class="service-card"
        v-for="(fitness, index) in filteredFitnessPackages"
        :key="index"
      >
        <div class="service-tabs">
          <q-tabs v-model="tab[index]" vertical class="q-tabs-icon">
            <q-tab name="titles" icon="info" label="About" />
            <q-tab name="tables" icon="payments" label="Prices" />
          </q-tabs>
        </div>

        <div class="service-content">
          <q-tab-panels
            class="tab-panels"
            v-model="tab[index]"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="titles" class="abouts">
              <img class="about-img" :src="fitness.coverImageUrl" alt="" />
              <div class="text-h5 q-mb-md title">
                {{ fitness.servicePackage.name }}
                <div class="edit-btns">
                  <button class="edit-btn">
                    <q-icon
                      name="edit"
                      size="24px"
                      @click="updateFitnessHandler(fitness)"
                    ></q-icon>
                  </button>
                  <button class="edit-btn">
                    <q-icon
                      name="delete"
                      size="24px"
                      @click="confirmDeleteFitnessHandler(fitness)"
                    ></q-icon>
                  </button>
                </div>
              </div>
              <p>{{ fitness.servicePackage.description }}</p>
            </q-tab-panel>

            <q-tab-panel name="tables" class="table-tab">
              <div class="text-h5 q-mb-md">Giá của gói theo thời gian</div>
              <div>
                <ul class="responsive-table">
                  <li class="table-header">
                    <div class="col col-1">Time</div>
                    <div class="col col-2">Cost</div>
                  </li>
                  <li
                    class="table-row"
                    v-for="packagePrice in fitness.servicePackage
                      .servicePackagePrices"
                    :key="packagePrice.id"
                  >
                    <div class="col col-1">
                      {{ packagePrice.packageDuration.duration }}
                      {{ packagePrice.packageDuration.durationType }}
                    </div>
                    <div class="col col-2">{{ packagePrice.price }} VND</div>
                  </li>
                </ul>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>

    <!-- DIALOG Create Fitness === -->
    <q-dialog v-model="showCreateFitnessPackage">
      <q-card class="update-package-type-card">
        <AddFitnessPackageForm
          :durationList="durationList"
          :packageTypes="packageTypes"
          @addCreatedFitness="addCreatedFitness"
          @closeForm="closeForm"
        ></AddFitnessPackageForm>
      </q-card>
    </q-dialog>

    <!-- DIALOG Update Fitness === -->
    <q-dialog v-model="showUpdateFitnessPackage">
      <q-card class="update-package-type-card">
        <UpdateFitnessPackageForm
          :durationList="durationList"
          :packageTypes="packageTypes"
          :selectedFitness="selectedUpdateFitnessPackage"
          @addCreatedFitness="addCreatedFitness"
          @closeForm="closeForm"
        ></UpdateFitnessPackageForm>
      </q-card>
    </q-dialog>

    <!-- DIALOG Create Type=== -->
    <q-dialog v-model="showCreatePackageType">
      <q-card class="q-card-package-type">
        <q-card-section class="row items-center q-pb-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit="createPackageType" class="q-gutter-md">
            <q-input
              filled
              v-model="packageTypeInput.type"
              label="Package Type *"
              hint="Service package type"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Nhap loai goi dich vu',
              ]"
            />

            <div>
              <q-btn label="Thêm " type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- DIALOG Create Duration=== -->
    <q-dialog v-model="showCreateDuration">
      <q-card class="q-card-package-type">
        <q-card-section class="row items-center q-pb-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit="createDurationHandler" class="q-gutter-md">
            <q-input
              v-model="durationInput.duration"
              filled
              label="Thời hạn *"
              hint="Thời hạn gói tập"
              required
              type="number"
              :rules="[
                (val) => val !== null || 'Vui lòng điền giá',
                (val) => !isNaN(val) || 'Vui lòng nhập một số hợp lệ',
                (val) => val >= 1 || 'Giá phải là số dương',
              ]"
            >
              VND</q-input
            >
            <q-select
              style="width: 160px"
              filled
              v-model="durationInput.durationType"
              :options="durationTypeList"
              label="Chọn thời gian"
              class="q-select"
              map-options
              lazy-rules
              emit-value
              :rules="[
                (val) => (val !== null && val !== '') || 'Vui lòng chọn loại',
              ]"
            />

            <div>
              <q-btn label="Thêm " type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- DIALOG Update Type=== -->
    <q-dialog v-model="showUpdatePackageType">
      <q-card class="update-package-type-card">
        <UpdatePackageTypeForm
          :typeList="packageTypes"
          @deletedType="deletedType"
        ></UpdatePackageTypeForm>
      </q-card>
    </q-dialog>

    <!-- DIALOG Confirm Delete === -->
    <q-dialog v-model="showDeleteConfirmationDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Xác nhận xóa</div>
          <div>Bạn có chắc chắn muốn xóa sản phẩm này không?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Không" color="primary" v-close-popup />
          <q-btn
            flat
            label="Có"
            color="negative"
            @click="deleteFitnessHandler"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { onBeforeMount, ref, watchEffect } from "vue";
import fitnessPackageService from "../services/fitnessPackage.service";
import packageTypeService from "../services/packageType.service";
import UpdatePackageTypeForm from "../components/UpdatePackageTypeForm.vue";
import AddFitnessPackageForm from "../components/AddFitnessPackageForm.vue";
import durationService from "../services/duration.service";
import UpdateFitnessPackageForm from "../components/UpdateFitnessPackageForm.vue";
import { useToast } from "vue-toastification";

export default {
  components: {
    UpdatePackageTypeForm,
    AddFitnessPackageForm,
    UpdateFitnessPackageForm,
  },
  setup() {
    const toast = useToast();
    const fitnessPackages = ref([]);
    const tab = ref([]);
    const showCreatePackageType = ref(false);
    const showCreateDuration = ref(false);
    const showUpdatePackageType = ref(false);
    const showCreateFitnessPackage = ref(false);
    const showUpdateFitnessPackage = ref(false);
    const showDeleteConfirmationDialog = ref(false);
    const showDeleteWarningFitnessPackage = ref(false);
    const packageTypeInput = ref({
      type: "",
    });
    const durationTypeList = ref(["day", "month", "year"]);
    const durationInput = ref({
      duration: 1,
      durationType: "day",
    });
    const packageTypes = ref([]);
    const filteredFitnessPackages = ref([]);
    const selectedType = ref("");
    const selectedUpdateFitnessPackage = ref();
    const selectedDeleteFitnessPackage = ref(null);
    const durationList = ref([]);

    onBeforeMount(async () => {
      try {
        packageTypes.value = await packageTypeService.getAllPackageType();

        fitnessPackages.value = await fitnessPackageService.getAllWithDetail();
        filteredFitnessPackages.value = fitnessPackages.value;
        fitnessPackages.value.forEach(() => {
          tab.value.push("titles");
        });

        durationList.value = await durationService.getAll();
      } catch (e) {
        console.error(e);
      }
    });

    watchEffect(() => {
      filteredFitnessPackages.value.forEach((fitness) => {
        tab.value.push("titles");
      });
    });

    async function fileterServicePackageByTypeId(type) {
      if (type == 0) {
        filteredFitnessPackages.value = fitnessPackages.value;
        selectedType.value = "Phân loại";
      } else {
        selectedType.value = type.type;
        filteredFitnessPackages.value = await fitnessPackageService.getByType(
          type.id
        );
      }
    }
    function addCreatedFitness(updatedFitness) {
      filteredFitnessPackages.value = filteredFitnessPackages.value.filter(
        (fitness) => fitness.id != updatedFitness.id
      );
      filteredFitnessPackages.value.push(updatedFitness);
    }

    function closeForm() {
      showUpdateFitnessPackage.value = false;
      showCreateFitnessPackage.value = false;
    }
    function updateFitnessHandler(selectedFitness) {
      showUpdateFitnessPackage.value = true;
      selectedUpdateFitnessPackage.value = selectedFitness;
    }

    function confirmDeleteFitnessHandler(fitness) {
      showDeleteConfirmationDialog.value = true;
      selectedDeleteFitnessPackage.value = fitness;
    }

    async function deleteFitnessHandler() {
      await fitnessPackageService.delete(selectedDeleteFitnessPackage.value.id);

      filteredFitnessPackages.value = filteredFitnessPackages.value.filter(
        (fitness) => fitness.id != selectedDeleteFitnessPackage.value.id
      );
    }
    async function createDurationHandler() {
      const checkDuplicate = durationList.value.filter(
        (duration) =>
          duration.duration == durationInput.value.duration &&
          duration.durationType == durationInput.value.durationType
      );
      if (checkDuplicate.length > 0) {
        toast.error("Đã tồn tại thời hạn");
      } else {
        const newDuration = await durationService.create(durationInput.value);
        toast.success("Tạo thời hạn thành công");
        durationList.value.push(newDuration);
      }
    }

    async function createPackageType() {
      const newPackageType = await packageTypeService.createPackageType(
        packageTypeInput.value
      );
      packageTypes.value.push(newPackageType);
    }
    function deletedType(id) {
      packageTypes.value = packageTypes.value.filter((type) => type.id !== id);
    }
    return {
      tab,
      fitnessPackages,
      filteredFitnessPackages,
      packageTypeInput,
      packageTypes,
      durationInput,
      durationList,
      durationTypeList,
      selectedType,
      selectedUpdateFitnessPackage,
      showCreatePackageType,
      showUpdatePackageType,
      showCreateDuration,
      showCreateFitnessPackage,
      showUpdateFitnessPackage,
      showDeleteWarningFitnessPackage,
      showDeleteConfirmationDialog,

      createPackageType,
      fileterServicePackageByTypeId,
      deletedType,
      addCreatedFitness,
      closeForm,
      updateFitnessHandler,
      confirmDeleteFitnessHandler,
      deleteFitnessHandler,
      createDurationHandler,
    };
  },
};
</script>

<style scoped>
.service-btns-container {
  display: flex;
  justify-content: space-between;
}
.btn-dropdown-type {
  color: var(--icon-color);
  border-right: 2px solid var(--icon-color);
  border-radius: 0 0;
}
.btn-dropdown-update {
  color: var(--icon-color);
  border-left: 2px solid var(--icon-color);
  border-radius: 0 0;
}

.type-item {
  font-size: 16px;
  font-weight: bold;
}
.update-icon {
  color: var(--table-bg);
}

.service-cards-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.service-card {
  display: flex;
  width: 45%;
  padding: 10px;
}

.service-tabs {
  border-top: 2px solid var(--icon-color);
  flex: 1;
}
.service-content {
  position: relative;
  flex: 5;
}
.service-content .tab-panels .abouts .about-img {
  width: 100%;
  height: 200px;
}
.service-content .tab-panels .abouts .title {
  position: relative;
}

.service-content .edit-btns {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
}
.service-content .edit-btns .edit-btn {
  color: var(--icon-color);
  border: none;
  background: none;
  cursor: pointer;
  width: 37px;
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* border: solid black 1px; */
}
.service-content .edit-btns .edit-btn:hover {
  color: #ffc100;
  border-radius: 50%;
  border: 1px solid #ffc100;
}

.service-tabs .q-tabs-icon {
  color: var(--icon-color);
}

/*======= TABLE  ========*/
.table-tab {
  text-align: center;
}

.responsive-table {
  padding: 0 0;
}
.responsive-table li {
  list-style: none;
  border-radius: 3px;
  padding: 6px 15px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.responsive-table .table-header {
  background: var(--table-bg);
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  padding: 15px;
  color: white;
  letter-spacing: 0.03em;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
}

.responsive-table .table-row {
  background-color: #ffffff;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.2);
}

.responsive-table .col-1 {
  flex-basis: 40%;
}

.responsive-table .col-2 {
  flex-basis: 50%;
}

@media all and (max-width: 767px) {
  .responsive-table .table-header {
    display: none;
  }

  .responsive-table li {
    display: block;
  }

  .responsive-table .col:before {
    color: #6c7a89;
    padding-right: 10px;
    content: attr(data-label);
    flex-basis: 50%;
    text-align: right;
  }
}

/* DIALOG create Package Type */
.q-card-package-type {
  width: 400px;
}

.update-package-type-card {
  border: 2px solid var(--icon-color);
}
</style>
