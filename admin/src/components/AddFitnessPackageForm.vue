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
    <q-form class="form-create" @submit="createFitnessPackage">
      <q-input
        v-model="createServicePackageDto.name"
        required
        filled
        label="Tên gói dịch vụ"
        :rules="[
          (val) => (val && val.length > 0) || 'Vui lòng điền tên sản phẩm',
        ]"
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
            (val) =>
              (val && val.length > 0) || 'Vui lòng điền mô tả gói dịch vụ',
          ]"
        />
        <div>
          <q-select
            style="width: 160px"
            filled
            v-model="createServicePackageDto.typeId"
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
          style="width: 250px; font-size: 16px"
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

      <div class="textarea-benefit">
        <q-input
          v-model="strBenefit"
          style="width: 400px; font-size: 16px"
          filled
          type="textarea"
          label="Quyền lợi gói dịch vụ "
          required
          :rules="[
            (val) =>
              (val && val.length > 0) || 'Vui lòng điền các quyền lợi của gói ',
          ]"
        />
        <div style="font-size: 16px; color: red; font-weight: bold">
          CÁC QUYỀN LỢI CÁCH NHAU BẰNG DẤU CHẤM
        </div>
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
        <q-btn label="Thêm sản phẩm" type="submit" color="primary" />
      </div>
      <div class="btn" style="margin-top: 10px">
        <q-btn label="Test" @click="testFunction" color="red" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { ref, onBeforeMount, reactive, watch } from "vue";
import uploadFileService from "../services/uploadFile.service";
import fitnessPackageService from "../services/fitnessPackage.service";
import { useQuasar, QSpinnerCube } from "quasar";

export default {
  props: {
    durationList: Array,
    packageTypes: Array,
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const fileUploaded = ref(null);
    const imageUrl = ref("");
    const createAllFitnessDto = ref();
    const selectedDurationType = ref("day");
    const createFitnessPackageDto = reactive({
      coverImageUrl: "",
    });
    const createServicePackageDto = reactive({
      name: "",
      description: "",
      typeId: 0,
    });
     const createNewBenefit = ref({
      description: ""
     })
    const createNewBenefitList = ref([])

    const strBenefit = ref("");

    const packageTypes = ref(props.packageTypes);
    const durationList = ref(props.durationList);
    // const filteredDuration = ref(props.durationList);
    const selectedPackageType = ref(null);
    const createPackagePriceDtoList = ref([]);
    const durationTypeList = ref(["day", "month", "year"]);

    function updateFilteredDuration(index, newValue) {
      createPackagePriceDtoList.value[index].filteredDuration =
        durationList.value.filter(
          (duration) => duration.durationType === newValue
        );

      createPackagePriceDtoList.value[index].packageDurationId = null;
    }

    function formatDuration(option) {
      return `${option.duration} ${option.durationType}`;
    }
    function addInputAndSelect() {
      createPackagePriceDtoList.value.push({
        price: "",
        packageDurationId: null,
        selectedDurationType: "",
        filteredDuration: props.durationList,
      });
    }

    function handleFileChange() {
      if (fileUploaded.value) {
        imageUrl.value = URL.createObjectURL(fileUploaded.value);
      }
    }

    async function testFunction() {
      $q.loading.show({
        spinner: QSpinnerCube,
        message: "Đang tạo gói tập mới...",
      });

      try {
        // var cleanString = strBenefit.value.split(".");
        // cleanString = cleanString.map((item) => item.replace(/\n/g, "").trim());
        // const benefitList = cleanString.filter((item) => item !== "");
        // const formData = new FormData();
        // formData.append("file", fileUploaded.value);
        // const resUpload = await uploadFileService.uploadFile(formData);
        // createFitnessPackageDto.coverImageUrl = resUpload.secure_url;
        // createAllFitnessDto.value = {
        //   createFitnessPackageDto,
        //   createServicePackageDto,
        //   createPackagePriceDtoList: createPackagePriceDtoList.value,
        //   createBenefitList: benefitList,
        // };
        // console.log(createAllFitnessDto.value);

        console.log(durationList.value);
        console.log(filteredDuration.value);
      } catch (error) {
        console.error("Error in testFunction:", error);
      } finally {
        $q.loading.hide();
      }
    }

    async function createFitnessPackage() {
      $q.loading.show({
        spinner: QSpinnerCube,
        message: "Đang tạo gói tập mới...",
      });
      try {
        let cleanString = strBenefit.value.split(".");
        cleanString = cleanString.map((item) => item.replace(/\n/g, "").trim());
        const benefitList = cleanString.filter((item) => item !== "");

        benefitList.forEach((benefit) => {
          createNewBenefit.value.description = benefit
          createNewBenefitList.value.push({...createNewBenefit.value})
        })

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
          createNewBenefitList: createNewBenefitList.value
        };
        console.log(createAllFitnessDto.value);
        const createdFitness = await fitnessPackageService.create(
          createAllFitnessDto.value
        );

        emit("addCreatedFitness", createdFitness);
        emit("closeForm");
        $q.loading.hide();
      } catch (e) {
        console.log(e);
      }
    }
    return {
      imageUrl,
      fileUploaded,
      selectedPackageType,
      selectedDurationType,
      packageTypes,
      createPackagePriceDtoList,
      durationTypeList,
      durationList,

      createServicePackageDto,
      strBenefit,

      formatDuration,

      addInputAndSelect,
      handleFileChange,
      createFitnessPackage,
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
