<template>
  <div class="update-type-container">
    <q-btn flat round class="cancel-btn" v-close-popup>
      <q-icon
        name="cancel"
        class="cancel-icon"
        size="30px"
        color="red"
      ></q-icon>
    </q-btn>

    <div class="list-type">
      <q-card v-for="type in types" :key="type.id" class="type-card">
        <q-card-section class="type-card-section">
          <div class="type-name">
            <input
              v-if="type.isEditing"
              v-model="type.type"
              @blur="finishEditing(type)"
              @keyup.enter="finishEditing(type)"
              class="edit-input"
            />
            <div v-else>{{ type.type }}</div>
          </div>
          <div class="type-actions">
            <button class="btn-edit" @click="confirmRemove(type.id)">
              <q-icon name="cancel" class="remove-icon" size="20px"></q-icon>
            </button>
            <button class="btn-edit" @click="editType(type)">
              <q-icon name="edit" class="edit-icon" size="20px"></q-icon>
            </button>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="showConfirmDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Xác nhận xóa</div>
          <div>Bạn có chắc chắn muốn xóa loại này không?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Không" color="primary" v-close-popup />
          <q-btn
            flat
            label="Có"
            color="negative"
            @click="removeType"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>


<script>
import { ref, reactive } from "vue";
import packageTypeService from "../services/packageType.service";
import { useToast } from "vue-toastification";

export default {
  props: {
    typeList: Array,
  },
  setup(props, { emit }) {
    const toast = useToast();
    const type = reactive({
      id: 0,
      type: "",
    });
    const types = ref(props.typeList);
    const showConfirmDialog = ref(false);
    const selectedTypeId = ref(null);

    function editType(type) {
      type.isEditing = true;
      setTimeout(() => {
        const input = document.querySelector(".edit-input");
        if (input) {
          input.focus();
        }
      }, 0);
    }

    function finishEditing(type) {
      type.isEditing = false;
      console.log(type)
      updateType(type);
    }

    function closeModal() {
      emit("removeType");
    }

    function confirmRemove(id) {
      selectedTypeId.value = id;
      showConfirmDialog.value = true;
    }

    async function updateType(updatedType) {
      try {
        const res = await packageTypeService.updatePackageType(updatedType.id, updatedType);
      } catch (error) {
        console.error("Failed to update type:", error);
      }
    }
    async function removeType() {
      try {
        await packageTypeService.deletePackageType(selectedTypeId.value);
        toast.success("Đã xóa thành công!", {
          timeout: 2000,
        });
        types.value = types.value.filter(
          (type) => type.id !== selectedTypeId.value
        );
        emit("deletedType", selectedTypeId.value);
      } catch (error) {
        toast.error("Xóa thất bại!", {
          timeout: 2000,
        });
        console.error(error);
      }
    }

    return {
      type,
      types,
      closeModal,
      removeType,
      confirmRemove,
      showConfirmDialog,
      editType,
      finishEditing,
    };
  },
};
</script>
<style scoped>
.update-type-container {
  width: 400px;
  height: 200px;
  padding: 10px;
}

.cancel-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  cursor: pointer;
}

.cancel-icon:hover {
  color: rgb(206, 32, 32) !important;
}

.edit-btn {
  position: absolute;
  bottom: 2px;
  right: 2px;
  cursor: pointer;
}

.list-type {
  margin-top: 40px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0 0;
}
.type-card {
  background: rgb(54, 54, 54);
  box-shadow: none;
  color: white;
}
.type-card-section {
  display: flex;
  align-items: center;
  padding: 10px;
  width: fit-content;
  height: 50px;
}

.type-name {
  flex-grow: 1;
  text-align: left;
  margin-right: 10px;
}

.type-actions {
  display: flex;
  flex-direction: column;
}

.btn-edit {
  background: rgb(54, 54, 54);
  color: white;
  border: none;
  cursor: pointer;
  padding: 0 0;
  margin: 0 0;
}

.edit-icon:hover {
  color: blue !important;
}
.remove-icon:hover {
  color: red !important;
}
</style>
