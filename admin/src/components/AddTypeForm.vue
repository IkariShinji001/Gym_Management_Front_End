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
    <q-form class="form-create">
      <q-input
        required
        filled
        v-model="type.name"
        label="Loại sản phẩm"
        :rules="[
          (val) => (val && val.length > 0) || 'Vui lòng điền loại sản phẩm',
        ]"
      />

      <div class="btn">
        <q-btn
          label="Thêm loại sản phẩm"
          type="submit"
          color="primary"
          @click="createType"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import typeService from "../services/type.service";

export default {
  props: {
    typeList: Array,
  },
  setup(props, { emit }) {
    const type = reactive({
      name: "",
    });
    const types = ref(props.typeList);

    function closeModal() {
      emit("createType");
    }

    async function createType(e) {
      e.preventDefault();
      try {
        var name = type.name.trim();
        name = name.toLowerCase();

        const existedType = types.value.find(
          (t) => t.name.toLowerCase() === name
        ); 
        if (existedType) {
          console.log("da ton tai: " + name);
          return;
        }

        const createdType = await typeService.createType(type);

        emit("getNewType", createdType);
        closeModal()
      } catch (e) {
        console.log(e);
      }
    }
    return {
      type,
      closeModal,
      createType,
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
