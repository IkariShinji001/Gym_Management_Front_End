<template>
  <div>
    <div class="header">
      <div class="header-left-side">
        <q-btn-dropdown
          flat
          size="22px"
          :label="selectedType || 'Phân loại'"
          class="btn-dropdown-type"
          dropdown-icon="format_list_bulleted"
        >
          <q-list>
            <q-item
              v-for="(type, index) in packageTypeList"
              clickable
              v-close-popup
              :key="index"
              @click="fileterFitnessPackageByTypeIdHanler(type)"
            >
              <q-item-section>
                <q-item-label class="type-item">{{ type.type }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <div class="header-right-side">
        <q-form @submit="handleCreateNewBenefit" class="textarea-input">
          <q-input
            class="create-benefit-input"
            dense
            filled
            v-model="createBenefitDto.description"
            label="Quyền lợi..."
            lazy-rules
            autogrow
            hide-bottom-space
            :rules="[(val) => (val && val.length > 0) || 'Nhập quyền lợi']"
          />

          <button class="add-btn">
            <q-icon name="add_circle" size="24px"></q-icon>
            Thêm quyền lợi
          </button>
        </q-form>
        <div class="save-btn-container">
          <button class="save-btn" @click="updateBenefitForFitness">
            <q-icon name="save" size="24px"></q-icon>
            Lưu
          </button>
        </div>
      </div>
    </div>

    <ul class="responsive-table">
      <li class="table-header">
        <div class="col col-1">Mô tả</div>
        <div class="col col-2">
          <div
            class="col checkbox-col"
            v-for="fitness in filteredFitnessPackageList"
            :key="fitness.id"
          >
            {{ fitness.servicePackage.name }}
          </div>
        </div>
      </li>
      <q-scroll-area style="height: 400px">
        <li class="table-row" v-for="benefit in benefitList" :key="benefit.id">
          <div class="col col-1 col-description-deleteBtn">
            <div>
              <q-input
                filled
                class="update-benefit-input"
                v-if="isEditing(benefit)"
                type="textarea"
                v-model="benefit.description"
              />
              <div v-else class="update-benefit-span">
                {{ benefit.description }}
              </div>
            </div>
            <div class="btns-container">
              <button class="edit-btn" @click="toggleEdit(benefit)">
                <q-icon name="edit" size="19px"></q-icon>
              </button>
              <button
                class="edit-btn"
                v-if="!isEditing(benefit)"
                @click="confirmDeleteFitnessHandler(benefit)"
              >
                <q-icon name="delete" size="19px"></q-icon>
              </button>
            </div>
          </div>
          <div class="col col-2">
            <div
              class="col checkbox-col"
              v-for="fitness in filteredFitnessPackageList"
              :key="fitness.id"
            >
              <div class="checkbox-wrapper-18">
                <div class="round">
                  <input
                    type="checkbox"
                    :id="'checkbox-' + benefit.id + '-' + fitness.id"
                    :checked="isBenefitChecked(fitness.id, benefit.id)"
                    @change="handleCheckboxChange(fitness, benefit, $event)"
                  />
                  <label
                    :for="'checkbox-' + benefit.id + '-' + fitness.id"
                  ></label>
                </div>
              </div>
            </div>
          </div>
        </li>
      </q-scroll-area>
    </ul>

    <q-dialog v-model="showDeleteConfirmDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Xác nhận xóa</div>
          <div>Bạn có chắc chắn muốn xóa quyền lợi này không?</div>
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
import { onBeforeMount, ref } from "vue";
import benefitService from "../services/benefit.service";
import fitnessPackageService from "../services/fitnessPackage.service";
import fitnessBenefitService from "../services/fitnessBenefit.service";
import packageTypeService from "../services/packageType.service";
import { useToast } from "vue-toastification";

export default {
  setup() {
    const toast = useToast();
    const showDeleteConfirmDialog = ref(false);
    const selectedDeleteBenefitId = ref();
    const selectedType = ref();
    const createBenefitDto = ref({
      description: "",
    });
    const packageTypeList = ref([]);
    const benefitList = ref([]);
    const filteredFitnessPackageList = ref([]);
    const fitnessPackageList = ref([]);
    const fitnessBenefitList = ref([]);
    const deleteList = ref([]);
    const postList = ref([]);
    const isEditingMap = ref({});

    onBeforeMount(async () => {
      benefitList.value = await benefitService.getAll();
      fitnessPackageList.value = await fitnessPackageService.getAll();
      fitnessBenefitList.value = await fitnessBenefitService.getAll();
      packageTypeList.value = await packageTypeService.getAllPackageType();
      filteredFitnessPackageList.value = await fitnessPackageService.getByType(
        packageTypeList.value[0].id
      );
    });

    async function fileterFitnessPackageByTypeIdHanler(type) {
      selectedType.value = type.type;
      filteredFitnessPackageList.value = await fitnessPackageService.getByType(
        type.id
      );
    }
    const handleCheckboxChange = (fitnessPackage, packageBenefit, event) => {
      const isChecked = event.target.checked;
      const fitnessPackageId = fitnessPackage.id;
      const packageBenefitId = packageBenefit.id;

      if (isChecked) {
        postList.value.push({ fitnessPackage, packageBenefit });
        deleteList.value = deleteList.value.filter(
          (fb) =>
            fb.fitnessPackageId !== fitnessPackageId ||
            fb.packageBenefitId !== packageBenefitId
        );
      } else {
        deleteList.value.push({ fitnessPackageId, packageBenefitId });
        postList.value = postList.value.filter(
          (fb) =>
            fb.fitnessPackage.id !== fitnessPackageId ||
            fb.packageBenefit.id !== packageBenefitId
        );
      }
    };

    function isBenefitChecked(fitnessId, benefitId) {
      return fitnessBenefitList.value.some(
        (fitnessBenefit) =>
          fitnessBenefit.fitnessPackage.id === fitnessId &&
          fitnessBenefit.packageBenefit.id === benefitId
      );
    }

    function filterDuplicateElements() {
      return postList.value.filter((postItem) => {
        return !fitnessBenefitList.value.some(
          (fb) =>
            fb.fitnessPackage.id === postItem.fitnessPackage.id &&
            fb.packageBenefit.id === postItem.packageBenefit.id
        );
      });
    }

    async function updateDescription(benefit) {
      const updateDes = await benefitService.update(benefit.id, benefit);
    }
    function toggleEdit(benefit) {
      isEditingMap.value[benefit.id] = !isEditingMap.value[benefit.id];
      if (isEditingMap.value[benefit.id] === false) updateDescription(benefit);
    }

    function isEditing(benefit) {
      return isEditingMap.value[benefit.id];
    }

    async function confirmDeleteFitnessHandler(benefit) {
      selectedDeleteBenefitId.value = benefit.id;
      showDeleteConfirmDialog.value = true;
    }

    async function deleteFitnessHandler() {
      benefitList.value = benefitList.value.filter(
        (benefit) => benefit.id !== selectedDeleteBenefitId.value
      );
      await benefitService.delete(selectedDeleteBenefitId.value);
    }
    async function handleCreateNewBenefit() {
      try {
        const savedFB = await benefitService.create(createBenefitDto.value);
        benefitList.value.push(savedFB);
      } catch (e) {
        console.log(e);
      }
    }

    async function updateBenefitForFitness() {
      try {
        const newPostList = filterDuplicateElements();
        const savedFBList = await fitnessBenefitService.createList(newPostList);
        await fitnessBenefitService.deleteList(deleteList.value);
        toast.success("Đã lưu thành công!", {
          timeout: 2000,
        });
      } catch (e) {
        console.log(e);
      }
    }

    return {
      showDeleteConfirmDialog,
      selectedType,
      createBenefitDto,
      benefitList,
      fitnessPackageList,
      isBenefitChecked,
      fitnessBenefitList,
      packageTypeList,
      filteredFitnessPackageList,

      handleCheckboxChange,
      updateBenefitForFitness,
      handleCreateNewBenefit,
      confirmDeleteFitnessHandler,
      deleteFitnessHandler,
      fileterFitnessPackageByTypeIdHanler,
      toggleEdit,
      isEditing,
    };
  },
};
</script>

<style>
/* =========> CSS header<===========*/
.header {
  display: flex;
  justify-content: space-between;
  padding: 0 0;
  margin: 0 0;
}
.header-left-side {
  flex: 30%;
}
.header-left-side .btn-dropdown-type {
  border-radius: 0;
  cursor: pointer;
  border: none;
  background: none;
  color: var(--icon-color);
  border-right: 2px solid var(--icon-color);
}
.header-right-side {
  flex: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.textarea-input {
  display: flex;
  flex: 50%;
  align-items: center;
}

.textarea-input .add-btn {
  cursor: pointer;
  border: none;
  background: none;
  color: var(--icon-color);
  border-left: 2px solid var(--icon-color);
  height: 40px;
  margin-left: 20px;
  width: 200px;
  font-size: 18px;
}

.save-btn-container {
  flex: 30%;
  display: flex;
  justify-content: center;
}
.save-btn {
  cursor: pointer;
  border: none;
  background: none;
  color: var(--icon-color);
  border-left: 2px solid var(--icon-color);
  width: 80px;
  height: 40px;
  text-align: center;
  font-size: 19px;
}
/* =========> CSS TABLE <===========*/
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
  flex-basis: 30%;
}
.responsive-table .col-description-deleteBtn {
  display: flex;
  justify-content: space-between;
}

.responsive-table .col-2 {
  flex-basis: 65%;
  display: flex;
  margin-bottom: 5px;
}
.responsive-table .checkbox-col {
  display: flex;
  justify-content: center;
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

.col-description-deleteBtn .update-benefit-input {
  width: 250px;
}

.col-description-deleteBtn .update-benefit-span {
  width: 250px;
}
.btns-container {
  display: flex;
  flex-direction: column;
}

.create-benefit-input {
  width: 300px;
}

/* =========> CSS Checkbox <===========*/
.checkbox-wrapper-18 .round {
  position: relative;
}

.checkbox-wrapper-18 .round label {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  cursor: pointer;
  height: 28px;
  width: 28px;
  display: block;
}

.checkbox-wrapper-18 .round label:after {
  border: 2px solid #fff;
  border-top: none;
  border-right: none;
  content: "";
  height: 6px;
  left: 8px;
  opacity: 0;
  position: absolute;
  top: 9px;
  transform: rotate(-45deg);
  width: 12px;
}

.checkbox-wrapper-18 .round input[type="checkbox"] {
  visibility: hidden;
  display: none;
  opacity: 0;
}

.checkbox-wrapper-18 .round input[type="checkbox"]:checked + label {
  background-color: #66bb6a;
  border-color: #66bb6a;
}

.checkbox-wrapper-18 .round input[type="checkbox"]:checked + label:after {
  opacity: 1;
}

/* =========> CSS Button<===========*/

.edit-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  margin-top: 2px;
  background: var(--icon-color);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.edit-btn:hover {
  background: rgb(255, 168, 7);
  border: 1px solid rgb(211, 137, 0);
}
</style>
