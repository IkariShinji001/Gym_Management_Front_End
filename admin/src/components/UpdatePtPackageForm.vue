<template>
  <div class="q-pa-md form-container">
    <q-btn flat round class="cancel-btn" v-close-popup>
      <q-icon name="cancel" class="cancel-icon" size="35px"></q-icon>
    </q-btn>
    <q-form class="form-create" @submit="handleUpdatePtPackage">
      <div class="selectPt-maxclient-container">
        <div>
          <q-select
            style="width: 280px"
            filled
            v-model="updatePtPackageDto.ptId"
            :options="ptList"
            option-value="id"
            map-options
            emit-value
            option-label="fullname"
            label="Danh sách PT"
            class="q-select"
            lazy-rules
            :rules="[
              (val) => (val !== null && val !== '') || 'Vui lòng chọn PT',
            ]"
          />
        </div>
        <q-input
          v-model="updatePtPackageDto.maxClients"
          style="width: 160px; font-size: 16px"
          filled
          label="Số lượng khách hàng"
          type="number"
          required
          :rules="[
            (val) => val > 0 || 'Số lượng khách hàng phải > 0',
            (val) => val < 20 || 'Số lượng khách hàng không quá 20',
          ]"
        />
      </div>
      <q-input
        v-model="updateServicePackageDto.name"
        required
        filled
        label="Tên gói PT"
        :rules="[
          (val) => (val && val.length > 0) || 'Vui lòng điền tên gói PT',
        ]"
      />

      <div class="textarea-description">
        <q-input
          v-model="updateServicePackageDto.description"
          style="width: 280px; font-size: 16px"
          filled
          type="textarea"
          label="Mô tả gói PT"
          required
          :rules="[
            (val) => (val && val.length > 0) || 'Vui lòng điền mô tả gói PT',
          ]"
        />
        <div>
          <q-select
            style="width: 160px"
            filled
            v-model="updateServicePackageDto.typeId"
            :options="packageTypeList"
            option-value="id"
            map-options
            emit-value
            option-label="type"
            label="Loại dịch vụ"
            class="q-select"
            lazy-rules
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Vui lòng chọn loại dịch vụ',
            ]"
          />
        </div>
      </div>

      <button class="add-price-btn" @click="handleAddNewPriceInput">
        <q-icon name="add_circle" class="add-price-icon" size="35px"></q-icon>
        Thêm ô nhập giá
      </button>
      <div
        v-for="(coupleInput, index) in selectedPtPackage.servicePackage
          .servicePackagePrices"
        :key="index"
        class="duration-price-div"
      >
        <q-select
          v-if="coupleInput.packageDuration.id != null"
          style="width: 150px"
          filled
          v-model="coupleInput.packageDuration.id"
          :options="durationList"
          option-value="id"
          option-label="duration"
          label="thời hạn"
          class="q-select"
          map-options
          lazy-rules
          emit-value
          :rules="[
            (val) => (val !== null && val !== '') || 'Vui lòng chọn loại',
          ]"
        />
        <q-select
          v-if="coupleInput.packageDuration.id != null"
          clickable
          style="width: 160px"
          filled
          v-model="coupleInput.packageDuration.durationType"
          :options="durationTypeList"
          :option-label="handleFormatDurationType"
          label="thời gian"
          class="q-select"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Vui lòng chọn loại',
          ]"
        />
        <q-input
          v-if="coupleInput.packageDuration.id != null"
          v-model="coupleInput.price"
          style="width: 280px; font-size: 16px"
          filled
          label="Giá gói"
          required
          type="number"
          :rules="[
            (val) => val !== null || 'Vui lòng điền giá',
            (val) => !isNaN(val) || 'Vui lòng nhập một số hợp lệ',
            (val) => val >= 0 || 'Giá phải là số dương',
          ]"
        >
          VND</q-input
        >
      </div>

      <div
        v-for="(coupleInput, index) in createPackagePriceDtoList"
        :key="index"
        class="duration-price-div"
      >
        <q-select
          v-if="coupleInput.selectedDurationType"
          style="width: 150px"
          filled
          v-model="coupleInput.packageDurationId"
          :options="coupleInput.filteredDuration"
          option-value="id"
          option-label="duration"
          label="thời hạn"
          class="q-select"
          map-options
          lazy-rules
          emit-value
          :rules="[
            (val) => (val !== null && val !== '') || 'Vui lòng chọn loại',
          ]"
        />
        <q-select
          clickable
          style="width: 160px"
          filled
          v-model="coupleInput.selectedDurationType"
          :options="durationTypeList"
          :option-label="handleFormatDurationType"
          label="thời gian"
          class="q-select"
          lazy-rules
          @update:model-value="(newVal) => handleFilterDuration(index, newVal)"
          :rules="[
            (val) => (val !== null && val !== '') || 'Vui lòng chọn loại',
          ]"
        />
        <q-input
          v-model="coupleInput.price"
          style="width: 280px; font-size: 16px"
          filled
          label="Giá gói"
          required
          type="number"
          :rules="[
            (val) => val !== null || 'Vui lòng điền giá',
            (val) => !isNaN(val) || 'Vui lòng nhập một số hợp lệ',
            (val) => val >= 0 || 'Giá phải là số dương',
          ]"
        >
          VND</q-input
        >
      </div>

      <div class="create-btn-container">
        <q-btn class="create-btn" label="Cập nhật gói PT" type="submit" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { ref, onBeforeMount, reactive } from "vue";
import { useQuasar, QSpinnerCube } from "quasar";
import ptPackageService from "../services/ptPackage.service";
import ptsService from "../services/pts.service";

export default {
  props: {
    durationList: Array,
    packageTypes: Array,
    selectedPtPackage: Object,
  },
  setup(props, { emit }) {
    const $q = useQuasar();

    const selectedPtPackage = ref(props.selectedPtPackage);
    const packageTypeList = ref(props.packageTypes);
    const durationList = ref(props.durationList);
    const ptList = ref([]);
    const durationTypeList = ref(["day", "month", "year"]);
    const createPackagePriceDtoList = ref([]);
    const updatePackagePriceDtoList = ref([]);

    const updatePtPackageDto = reactive({
      maxClients: selectedPtPackage.value.maxClients,
      ptId: selectedPtPackage.value.pt.id,
      servicePackageId: selectedPtPackage.value.servicePackage.id,
    });
    const updateServicePackageDto = reactive({
      name: selectedPtPackage.value.servicePackage.name,
      description: selectedPtPackage.value.servicePackage.description,
      typeId: selectedPtPackage.value.servicePackage.serviceType.id,
    });
    const updatePackagePriceDto = reactive({
      priceId: 0,
      price: 0,
      packageDurationId: 0,
    });
    const updateAllPPDto = reactive({
      updatePtPackageDto: null,
      updateServicePackageDto: null,
      updatePackagePriceDtoList: null,
    });

    // ====== FUNCTION   ============>
    onBeforeMount(async () => {
      ptList.value = await ptsService.getAllPtWithIdAndName();
    });

    function handleFilterDuration(index, newValue) {
      createPackagePriceDtoList.value[index].filteredDuration =
        durationList.value.filter(
          (duration) => duration.durationType === newValue
        );

      createPackagePriceDtoList.value[index].packageDurationId = null;
    }

    function handleAddNewPriceInput() {
      createPackagePriceDtoList.value.push({
        price: "",
        packageDurationId: null,
        selectedDurationType: "",
        filteredDuration: props.durationList,
      });
    }

    function handleFormatDurationType(option) {
      if (option === "year") {
        return "năm";
      } else if (option === "month") {
        return "tháng";
      } else if (option === "day") return "ngày";
      else return "";
    }

    function assignData() {
      selectedPtPackage.value.servicePackage.servicePackagePrices.forEach(
        (priceObj) => {
          updatePackagePriceDto.priceId = priceObj.id;
          updatePackagePriceDto.price = priceObj.price;
          updatePackagePriceDto.packageDurationId = priceObj.packageDuration.id;
          updatePackagePriceDtoList.value.push({ ...updatePackagePriceDto });
        }
      );

      createPackagePriceDtoList.value.forEach((priceObj) => {
        updatePackagePriceDto.priceId = 0;
        updatePackagePriceDto.price = priceObj.price;
        updatePackagePriceDto.packageDurationId = priceObj.packageDurationId;
        updatePackagePriceDtoList.value.push({ ...updatePackagePriceDto });
      });
    }

    async function handleUpdatePtPackage() {
      $q.loading.show({
        spinner: QSpinnerCube,
        message: "Đang tạo gói pt mới...",
      });

      try {
        assignData();
        updateAllPPDto.updatePtPackageDto = updatePtPackageDto;
        updateAllPPDto.updateServicePackageDto = updateServicePackageDto;
        updateAllPPDto.updatePackagePriceDtoList =
          updatePackagePriceDtoList.value;

        const res = await ptPackageService.updatePtPackage(
          selectedPtPackage.value.id,
          updateAllPPDto
        );
        emit("handlePushUpdatedPtPackage", res);
        emit("handleCloseForm");
      } catch (error) {
        console.error("Error in handleUpdatePtPackage:", error);
      } finally {
        $q.loading.hide();
      }
    }

    return {
      selectedPtPackage,

      ptList,
      packageTypeList,
      durationList,
      durationTypeList,
      createPackagePriceDtoList,

      updatePtPackageDto,
      updateServicePackageDto,

      handleAddNewPriceInput,
      handleFormatDurationType,
      handleFilterDuration,
      handleUpdatePtPackage,
      handleFormatDurationType,
    };
  },
};
</script>
<style scoped>
.form-container {
  width: fit-content;
  height: fit-content;
  padding: 30px 40px;
}
.form-container .cancel-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  cursor: pointer;
  color: var(--table-bg);
}
.form-container .cancel-icon:hover {
  color: rgb(255, 0, 0) !important;
}

.form-container .form-create {
  padding: 0 0;
  margin: 0 0;
  width: 450px;
  height: fit-content;
  margin-top: 40px;
}
.form-container .form-create .textarea-description,
.form-container .selectPt-maxclient-container {
  display: flex;
  gap: 10px;
}

.form-container .form-create .duration-price-div {
  display: flex;
  gap: 10px;
}

.form-container .form-create .add-price-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 5px;
}

.form-container .form-create .add-price-btn .add-price-icon {
  color: var(--icon-color);
  box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 4px,
    rgba(0, 0, 0, 0.5) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  border-radius: 50%;
  padding: 0 0;
  margin: 0 0;
}
.form-container .form-create .add-price-btn:hover {
  color: #ff8512;

  .add-price-icon {
    color: #ff8818;
    box-shadow: rgba(100, 100, 100, 0.4) 0px 2px 4px,
      rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
      rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  }
}

.form-container .form-create .create-btn-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-container .form-create .create-btn-container .create-btn {
  font-weight: bold;
  font-size: 15px;
  background-color: var(--icon-color);
  box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 4px,
    rgba(0, 0, 0, 0.5) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}
.form-container .form-create .create-btn-container .create-btn:hover {
  background: #ff8818;
  color: white;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}
</style>
