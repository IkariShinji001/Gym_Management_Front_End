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
    <q-form class="form-create" @submit="handleCreateFitnessPackage">
      <q-input
        v-model="createServicePackageDto.name"
        required
        filled
        label="Tên gói dịch vụ"
        :rules="[handleCheckPackageName]"
        @blur="handleCheckFitnessPackageNameExists"
      />

      <div class="textarea-description">
        <q-input
          v-model="createServicePackageDto.description"
          style="width: 280px; font-size: 16px"
          filled
          type="textarea"
          label="Mô tả gói dịch vụ"
          required
          :rules="[
            (val) => (val && val.length > 0) || 'Vui lòng điền mô tả gói tập',
          ]"
        />
        <div>
          <q-select
            style="width: 160px"
            filled
            v-model="createServicePackageDto.typeId"
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

      <button class="add-price-btn" @click="handleAddPriceInput">
        <q-icon
          name="add_circle"
          class="add-price-icon"
          size="35px"
          color="blue"
        ></q-icon>
        Thêm ô nhập giá
      </button>
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
          style="width: 140px"
          filled
          v-model="coupleInput.selectedDurationType"
          :options="durationTypeList"
          :option-label="handleFormatDuration"
          label="thời gian"
          class="q-select"
          lazy-rules
          @update:model-value="
            (newVal) => handleUpdateFilteredDuration(index, newVal)
          "
          :rules="[
            (val) => (val !== null && val !== '') || 'Vui lòng chọn loại',
          ]"
        />
        <q-input
          v-model="coupleInput.price"
          style="width: 250px; font-size: 16px"
          filled
          label="Giá gói"
          required
          type="number"
          :rules="[
            (val) => val !== null || 'Vui lòng điền giá',
            (val) => !isNaN(val) || 'Vui lòng nhập một số hợp lệ',
            (val) => val >= 1000 || 'Giá phải lớn hơn 1000 VND',
          ]"
        >
          VND</q-input
        >
      </div>

      <q-file
        required
        filloed
        bottm-slots
        v-model="fileUploaded"
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
        <q-btn label="Thêm gói tập  " type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import uploadFileService from "../services/uploadFile.service";
import fitnessPackageService from "../services/fitnessPackage.service";
import { useQuasar, QSpinnerCube } from "quasar";

export default {
  props: {
    durationList: Array,
    packageTypes: Array,
    fitnessPackageList: Array,
  },
  setup(props, { emit }) {
    const $q = useQuasar();

    const selectedPackageType = ref(null);
    const fileUploaded = ref(null);
    const imageUrl = ref("");
    const selectedDurationType = ref("day");

    const nameExists = ref(false);

    const packageTypeList = ref(props.packageTypes);
    const durationList = ref(props.durationList);
    const fitnessPackageList = ref(props.fitnessPackageList);
    const createPackagePriceDtoList = ref([
      {
        price: "",
        packageDurationId: null,
        selectedDurationType: "",
        filteredDuration: props.durationList,
      },
    ]);
    const durationTypeList = ref(["day", "month", "year"]);

    const createFitnessPackageDto = reactive({
      coverImageUrl: "",
    });
    const createServicePackageDto = reactive({
      name: "",
      description: "",
      typeId: packageTypeList.value[0].id,
    });
    const createAllFitnessDto = ref();

    function handleUpdateFilteredDuration(index, newValue) {
      createPackagePriceDtoList.value[index].filteredDuration =
        durationList.value.filter(
          (duration) => duration.durationType === newValue
        );

      createPackagePriceDtoList.value[index].packageDurationId = null;
    }

    function handleFormatDuration(option) {
      if (option === "year") {
        return "năm";
      } else if (option === "month") {
        return "tháng";
      } else if (option === "day") {
        return "ngày";
      } else {
        return;
      }
    }
    function handleAddPriceInput() {
      createPackagePriceDtoList.value.push({
        price: "",
        packageDurationId: null,
        selectedDurationType: "",
        filteredDuration: props.durationList,
      });
    }

    function handleCheckFitnessPackageNameExists() {
      nameExists.value = fitnessPackageList.value.filter(
        (fitness) =>
          fitness.servicePackage.name === createServicePackageDto.name
      );
    }

    function handleCheckPackageName(val) {
      if (!val || val.length === 0) {
        return "Vui lòng điền tên gói tập";
      }
      if (nameExists.value.length > 0) {
        return "Tên gói dịch vụ đã tồn tại";
      }
      return true;
    }

    function handleFileChange() {
      if (fileUploaded.value) {
        imageUrl.value = URL.createObjectURL(fileUploaded.value);
      }
    }

    async function handleCreateFitnessPackage() {
      $q.loading.show({
        spinner: QSpinnerCube,
        message: "Đang tạo gói tập mới...",
      });
      try {
        const formData = new FormData();
        if (fileUploaded.value) {
          formData.append("file", fileUploaded.value);
          const resUpload = await uploadFileService.uploadFile(formData);
          createFitnessPackageDto.coverImageUrl = resUpload.secure_url;
        }

        createAllFitnessDto.value = {
          createFitnessPackageDto,
          createServicePackageDto,
          createPackagePriceDtoList: createPackagePriceDtoList.value,
        };
        const createdFitness = await fitnessPackageService.create(
          createAllFitnessDto.value
        );

        emit("addCreatedFitness", createdFitness);
        emit("closeForm");
      } catch (e) {
        console.log(e);
      } finally {
        $q.loading.hide();
      }
    }
    return {
      imageUrl,
      fileUploaded,
      selectedPackageType,
      selectedDurationType,
      packageTypeList,
      createPackagePriceDtoList,
      durationTypeList,
      durationList,

      createServicePackageDto,

      handleFormatDuration,
      handleAddPriceInput,
      handleFileChange,
      handleCreateFitnessPackage,
      handleUpdateFilteredDuration,
      handleCheckFitnessPackageNameExists,
      handleCheckPackageName,
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
