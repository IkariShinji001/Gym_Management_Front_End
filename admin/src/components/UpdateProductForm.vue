<template>
  <div class="q-pa-md dialog-container">
    <q-btn flat round class="cancel-btn" v-close-popup>
      <q-icon
        name="cancel"
        class="cancel-icon"
        size="35px"
        color="red"
      ></q-icon>
    </q-btn>
    <q-form class="form-update-container" @submit="updateProduct">
      <q-input
        required
        filled
        v-model="product.name"
        label="Tên sản phẩm"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Vui lòng điền tên sản phẩm',
        ]"
      />
      <q-input
        type="number"
        required
        filled
        v-model="product.price"
        label="Giá thành sản phẩm (số)"
        lazy-rules
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
        v-model="product.type"
        :options="types"
        option-value="id"
        option-label="name"
        label="Loại sản phẩm"
        class="q-select"
        :rules="[
          (val) =>
            (val !== null && val !== '') || 'Vui lòng chọn loại sản phẩm',
        ]"
      />

      <q-file
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

      <div v-if="newImage" class="image-preview">
        <img :src="newImage" alt="Image preview" class="preview-img" />
      </div>

      <div class="btn">
        <q-btn label="Cập nhật sản phẩm" type="submit" color="primary" />
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
  props: {
    productData: Object,
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const types = ref([]);
    const fileUploaded = ref();
    const selectedType = ref(null);
    const product = reactive({ ...props.productData, typeId: 0 });
    const newImage = ref("");

    onBeforeMount(async () => {
      try {
        types.value = await typeService.getAllType();
        newImage.value = product.imageUrl;
      } catch (error) {
        console.log(error);
      }
    });

    function handleFileChange() {
      if (fileUploaded.value) {
        newImage.value = URL.createObjectURL(fileUploaded.value);
      }
    }

    async function updateProduct() {
      try {
        $q.loading.show({
          spinner: QSpinnerCube,
          message: "Đang cập nhật sản phẩm...",
        });
        const formData = new FormData();
        if (fileUploaded.value) {
          formData.append("file", fileUploaded.value);
          const res = await uploadFileService.uploadFile(formData);
          product.imageUrl = res.secure_url;
        }

        product.typeId = product.type.id;
        const updatedPro = await supplementProductService.updateProduct(
          product.id,
          product
        );

        emit("filterAfterUpdate", updatedPro);
      } catch (e) {
        console.log(e);
      } finally {
        $q.loading.hide();
      }
    }

    return {
      product,
      types,
      selectedType,
      fileUploaded,
      updateProduct,
      handleFileChange,
      newImage,
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

.dialog-container {
  width: fit-content;
  height: fit-content;
  padding: 30px 40px;
}
.form-update-container {
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
