<template>
  <div class="q-pa-md form-container">
    <q-btn flat round class="cancel-btn" v-close-popup>
      <q-icon
        name="cancel"
        class="cancel-icon"
        size="35px"
        color="red"
      ></q-icon>
    </q-btn>
    <q-form class="form-create" @submit="updateFitnessPackageHandler">
      <q-input
        v-model="fitnessPackage.servicePackage.name"
        required
        filled
        label="Tên gói dịch vụ"
        :rules="[
          (val) => (val && val.length > 0) || 'Vui lòng điền tên sản phẩm',
        ]"
      />

      <div class="textarea-description">
        <q-input
          v-model="fitnessPackage.servicePackage.description"
          style="width: 280px; font-size: 16px"
          filled
          type="textarea"
          label="Mô tả gói dịch vụ"
          required
          :rules="[
            (val) =>
              (val && val.length > 0) || 'Vui lòng điền mô tả gói dịch vụ',
          ]"
        />
        <div>
          <q-select
            style="width: 160px"
            filled
            v-model="fitnessPackage.servicePackage.serviceType.id"
            :options="packageTypes"
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

      <button class="add-price-btn" @click="addInputAndSelect">
        <q-icon
          name="add_circle"
          class="add-price-icon"
          size="35px"
          color="blue"
        ></q-icon>
        Thêm ô nhập giá
      </button>
      <div
        v-for="(coupleInput, index) in fitnessPackage.servicePackage
          .servicePackagePrices"
        :key="index"
        class="duration-price-div"
      >
        <q-select
          v-if="coupleInput.packageDuration.id != null"
          style="width: 170px"
          filled
          v-model="coupleInput.packageDuration.id"
          :options="durationList"
          option-value="id"
          :option-label="formatDuration"
          label="Chọn thời gian"
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
          style="width: 140px"
          filled
          v-model="coupleInput.packageDuration.durationType"
          :options="durationTypeList"
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
          style="width: 170px"
          filled
          v-model="coupleInput.packageDurationId"
          :options="coupleInput.filteredDuration"
          option-value="id"
          :option-label="formatDuration"
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
          style="width: 140px"
          filled
          v-model="coupleInput.selectedDurationType"
          :options="durationTypeList"
          label="thời gian"
          class="q-select"
          lazy-rules
          @update:model-value="
            (newVal) => updateFilteredDuration(index, newVal)
          "
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
      <q-file
        filled
        bottom-slots
        v-model="checkUpdatedImg"
        label="Hình ảnh"
        accept="image/*"
        @update:model-value="handleFileChange"
      >
        <template v-slot:prepend>
          <q-icon name="cloud_upload" />
        </template>
      </q-file>
      <div v-if="imageUrl" class="image-preview">
        <img :src="imageUrl" alt="Image preview" class="preview-img" />
      </div>
      <div class="btn">
        <q-btn label="Thêm sản phẩm" type="submit" color="primary" />
      </div>
      <div class="btn">
        <q-btn label="Thêm sản phẩm" @click="testFunction" color="red" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { ref, reactive, watch, onBeforeMount } from "vue";
import uploadFileService from "../services/uploadFile.service";
import fitnessPackageService from "../services/fitnessPackage.service";
import { useQuasar, QSpinnerCube } from "quasar";

export default {
  props: {
    durationList: Array,
    packageTypes: Array,
    selectedFitness: Object,
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const imageUrl = ref("");
    const checkUpdatedImg = ref(null);
    const updateAllFitnessDto = ref();
    const fitnessPackage = ref(props.selectedFitness);

    const updateFitnessPackageDto = reactive({
      coverImageUrl: "",
      servicePackageId: 0,
    });
    const updateServicePackageDto = reactive({
      name: "",
      description: "",
      typeId: 0,
    });
    const updatePackagePriceDto = reactive({
      priceId: 0,
      price: 0,
      packageDurationId: 0,
    });
    const updatePackagePriceDtoList = ref([]);
    const strBenefit = ref("");

    const packageTypes = ref(props.packageTypes);
    const durationList = ref(props.durationList);
    const durationTypeList = ref(["day", "month", "year"]);
    const filteredDuration = ref(props.durationList);
    const createPackagePriceDtoList = ref([]);
    onBeforeMount(() => {
      imageUrl.value = fitnessPackage.value.coverImageUrl;
    });

    function updateFilteredDuration(index, newValue) {
      createPackagePriceDtoList.value[index].filteredDuration =
        durationList.value.filter(
          (duration) => duration.durationType === newValue
        );

      createPackagePriceDtoList.value[index].packageDurationId = null;
    }

    function addInputAndSelect() {
      createPackagePriceDtoList.value.push({
        price: "",
        packageDurationId: null,
        selectedDurationType: "",
        filteredDuration: props.durationList,
      });
    }

    function formatDuration(option) {
      return `${option.duration} ${option.durationType}`;
    }

    function handleFileChange() {
      if (checkUpdatedImg.value) {
        imageUrl.value = URL.createObjectURL(checkUpdatedImg.value);
      }
    }

    function assignData() {
      updateFitnessPackageDto.servicePackageId =
        fitnessPackage.value.servicePackage.id;

      updateServicePackageDto.name = fitnessPackage.value.servicePackage.name;
      updateServicePackageDto.description =
        fitnessPackage.value.servicePackage.description;
      updateServicePackageDto.typeId =
        fitnessPackage.value.servicePackage.serviceType.id;

      fitnessPackage.value.servicePackage.servicePackagePrices.forEach(
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
    async function updateFitnessPackageHandler() {
      $q.loading.show({
        spinner: QSpinnerCube,
        message: "Đang tạo gói tập mới...",
      });
      try {
        const formData = new FormData();
        if (
          checkUpdatedImg.value != null &&
          checkUpdatedImg.value != fitnessPackage.value.coverImageUrl
        ) {
          formData.append("file", checkUpdatedImg.value);
          const resUpload = await uploadFileService.uploadFile(formData);
          updateFitnessPackageDto.coverImageUrl = resUpload.secure_url;
        } else {
          updateFitnessPackageDto.coverImageUrl =
            fitnessPackage.value.coverImageUrl;
        }

        assignData();

        updateAllFitnessDto.value = {
          updateFitnessPackageDto,
          updateServicePackageDto,
          updatePackagePriceDtoList: updatePackagePriceDtoList.value,
        };

        const updatedFitness = await fitnessPackageService.update(
          fitnessPackage.value.id,
          updateAllFitnessDto.value
        );

        emit("addCreatedFitness", updatedFitness);
        emit("closeForm");
        $q.loading.hide();
      } catch (e) {
        console.log(e);
      }
    }

    function testFunction() {
      console.log(fitnessPackage.value);

      assignData();
      console.log(updatePackagePriceDtoList.value);
    }
    return {
      imageUrl,
      checkUpdatedImg,
      fitnessPackage,
      packageTypes,
      createPackagePriceDtoList,
      durationTypeList,
      filteredDuration,

      strBenefit,

      durationList,
      formatDuration,

      addInputAndSelect,
      handleFileChange,
      updateFitnessPackageHandler,
      updateFilteredDuration,

      testFunction,
    };
  },
};
</script>
<style scoped>
.cancel-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  cursor: pointer;
}

.cancel-icon:hover {
  color: rgb(206, 32, 32) !important;
}

.add-price-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 5px;
}
.add-price-btn:hover {
  color: rgb(0, 74, 158) !important;

  .add-price-icon {
    color: rgb(0, 74, 158) !important;
  }
}

.form-container {
  width: fit-content;
  height: fit-content;
  padding: 30px 40px;
}
.form-create {
  padding: 0 0;
  margin: 0 0;
  width: 450px;
  height: fit-content;
  margin-top: 40px;
}

.form-create .textarea-description {
  display: flex;
  gap: 10px;
}
.form-create .textarea-benefit {
  display: flex;
  gap: 10px;
}

.form-create .duration-price-div {
  display: flex;
  gap: 10px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview {
  margin: 10px 0;
}

.preview-img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 5px;
}
</style>
