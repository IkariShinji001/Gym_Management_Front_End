<template>
  <div class="q-pa-md form-container">
    <q-btn flat round class="cancel-btn" @click="closeModal">
      <q-icon
        name="cancel"
        class="cancel-icon"
        size="35px"
        color="red"
      ></q-icon>
    </q-btn>
    <q-form class="form-create" @submit="updateProduct">
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
          (val) => (val !== null && val !== '') || 'Vui lòng chọn loại sản phẩm',
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

export default {
  props: {
    productData: Object,
  },
  setup(props, { emit }) {
    const types = ref([]);
    const fileUploaded = ref(null);
    const selectedType = ref(null);
    const product = reactive({ ...props.productData, typeId:0});

    onBeforeMount(async () => {
      try {
        types.value = await typeService.getAllType();
      } catch (error) {
        console.log(error);
      }
    });

    function closeModal() {
      emit("openUpdateProductForm");
    }

    function handleFileChange(event) {
      if (fileUploaded.value) {
        product.imageUrl = URL.createObjectURL(fileUploaded.value);
      }
    }

    async function updateProduct(e) {
      console.log(product.type)
      try {
        const formData = new FormData();
        formData.append("file", fileUploaded.value);
        const res = await uploadFileService.uploadFile(formData);
        product.imageUrl = res.secure_url;
        product.typeId = product.type.id

        const updatedPro = await supplementProductService.updateProduct(product.id, product)
        emit("filterAfterUpdate", updatedPro);
        closeModal()
      } catch (e) {
        console.log(e);
      }
    }
    function onReset() {
      selectedType.value = null;
    }
    return {
      product,
      types,
      selectedType,
      closeModal,
      fileUploaded,
      updateProduct,
      handleFileChange,
      onReset,
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
