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
    <q-form class="form-create" @submit="createProduct">
      <q-input
        required
        filled
        v-model="supplementProduct.name"
        label="Tên sản phẩm"
        :rules="[
          (val) => (val && val.length > 0) || 'Vui lòng điền tên sản phẩm',
        ]"
      />
      <q-input
        type="number"
        required
        filled
        v-model="supplementProduct.price"
        label="Giá thành sản phẩm (số)"
        :rules="[
          (val) => val !== null || 'Vui lòng điền giá',
          (val) => !isNaN(val) || 'Vui lòng nhập một số hợp lệ',
          (val) => val >= 0 || 'Giá phải là số dương',
        ]"
        :min="0"
        >VND</q-input
      >
      <q-select
        filled
        v-model="selectedType"
        :options="types"
        option-value="id"
        option-label="name"
        label="Loại sản phẩm"
        class="q-select"
        lazy-rules
        :rules="[
          (val) =>
            (val !== null && val !== '') || 'Vui lòng chọn loại sản phẩm',
        ]"
      />

      <q-file
        required
        filled
        bottom-slots
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
    </q-form>
  </div>
</template>

<script>
import { ref, onBeforeMount, reactive } from "vue";
import typeService from "../services/type.service";
import uploadFileService from "../services/uploadFile.service";
import supplementProductService from "../services/supplementProduct.service";
import { useQuasar, QSpinnerCube } from "quasar";

export default {
  setup(props, { emit }) {
    const $q = useQuasar();

    const fileUploaded = ref(null);
    const imageUrl = ref("");
    const types = ref([]);
    const selectedType = ref(null);

    const supplementProduct = reactive({
      name: "",
      price: 0,
      imageUrl: "",
      typeId: 0,
    });

    onBeforeMount(async () => {
      try {
        types.value = await typeService.getAllType();
      } catch (error) {
        console.log(error);
      }
    });

    function handleFileChange(event) {
      if (fileUploaded.value) {
        imageUrl.value = URL.createObjectURL(fileUploaded.value);
      }
    }

    async function createProduct(e) {
      e.preventDefault();

      try {
        $q.loading.show({
          spinner: QSpinnerCube,
          message: "Đang tạo sản phẩm mới...",
        });
        const formData = new FormData();
        formData.append("file", fileUploaded.value);

        const res = await uploadFileService.uploadFile(formData);

        supplementProduct.imageUrl = res.secure_url;
        supplementProduct.typeId = selectedType.value.id;

        const createdProduct = await supplementProductService.createProduct(
          supplementProduct
        );

        emit("getNewProduct", createdProduct);
      } catch (e) {
        console.log(e);
      } finally {
        $q.loading.hide();
      }
    }
    return {
      supplementProduct,
      imageUrl,
      fileUploaded,
      selectedType,
      types,
      handleFileChange,
      createProduct,
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
.q-select {
  margin-bottom: 20px;
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
