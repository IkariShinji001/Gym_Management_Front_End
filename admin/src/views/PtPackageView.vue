<template>
  <div>
    <div class="pt-header-btns-container">
      <q-btn-dropdown
        flat
        size="22px"
        :label="selectedTypeLabel || 'Phân loại'"
        class="btn-dropdown-type"
        dropdown-icon="format_list_bulleted"
      >
        <q-list>
          <q-item
            clickable
            v-close-popup
            @click="handleFilterPtPackageByTypeId(0)"
            class="btn-dropdown-update-item"
          >
            <q-item-section>
              <q-item-label class="type-item">Tất cả</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-for="(type, index) in packageTypeList"
            clickable
            v-close-popup
            :key="index"
            @click="handleFilterPtPackageByTypeId(type)"
            class="btn-dropdown-update-item"
          >
            <q-item-section>
              <q-item-label class="type-item">{{ type.type }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn
        size="22px"
        label="Gói PT"
        class="btn-dropdown-update"
        @click="showCreatePtPackage = true"
        icon-right="add_circle"
      >
      </q-btn>
    </div>
    <div class="pt-cards-container">
      <div
        class="service-card"
        v-for="(ptPackage, index) in filteredPtPackageList"
        :key="index"
      >
        <div class="service-tabs">
          <q-tabs v-model="tab[index]" vertical>
            <q-tab name="info" icon="info" label="About" class="q-tabs-icon" />
            <q-tab
              name="tables"
              icon="payments"
              label="Prices"
              class="q-tabs-icon"
            />
          </q-tabs>
        </div>

        <div class="service-content">
          <q-tab-panels
            class="tab-panels"
            v-model="tab[index]"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="info" class="abouts">
              <q-carousel
                class="slide-img-list"
                v-model="slide[index]"
                animate
                arrows
                navigation
                infinite
                control-color="orange"
                control-type="push"
              >
                <q-carousel-slide
                  class="slide-img-item-container"
                  v-for="(img, imgIndex) in ptPackage.pt.images"
                  :name="imgIndex"
                  :key="imgIndex"
                >
                  <img class="slide-img-item" :src="img.imageUrl" alt="" />
                </q-carousel-slide>
              </q-carousel>
              <div class="text-h5 q-mb-md title">
                {{ ptPackage.servicePackage.name }}
                <div class="edit-btns">
                  <button class="edit-btn">
                    <q-icon
                      name="edit"
                      size="24px"
                      @click="handleOpenUpdatePtPackageForm(ptPackage)"
                    ></q-icon>
                  </button>
                  <button class="edit-btn">
                    <q-icon
                      name="delete"
                      size="24px"
                      @click="handleOpenDeleteConfirmationDialog(ptPackage)"
                    ></q-icon>
                  </button>
                </div>
              </div>
              <p>{{ ptPackage.servicePackage.description }}</p>
            </q-tab-panel>

            <q-tab-panel name="tables" class="table-tab">
              <div class="text-h5 q-mb-md">Giá của gói theo thời gian</div>
              <div>
                <ul class="responsive-table">
                  <li class="table-header">
                    <div class="col col-1">Time</div>
                    <div class="col col-2">Cost</div>
                  </li>
                  <li
                    class="table-row"
                    v-for="packagePrice in ptPackage.servicePackage
                      .servicePackagePrices"
                    :key="packagePrice.id"
                  >
                    <div class="col col-1">
                      {{ packagePrice.packageDuration.duration }}
                      {{ packagePrice.packageDuration.durationType }}
                    </div>
                    <div class="col col-2">{{ packagePrice.price }} VND</div>
                  </li>
                </ul>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>

    <!-- DIALOG Create PT PACKAGE === -->
    <q-dialog v-model="showCreatePtPackage">
      <q-card class="update-package-type-card">
        <AddPtPackageForm
          :durationList="durationList"
          :packageTypes="packageTypeList"
          @handlePushNewPtPackage="handlePushNewPtPackage"
          @handleCloseForm="handleCloseForm"
        ></AddPtPackageForm>
      </q-card>
    </q-dialog>

    <!-- DIALOG Update PT PACKAGE === -->
    <q-dialog v-model="showUpdatePtPackage">
      <q-card class="update-package-type-card">
        <UpdatePtPackageForm
          :durationList="durationList"
          :packageTypes="packageTypeList"
          :selectedPtPackage="selectedPtPackageToUpdate"
          @handlePushUpdatedPtPackage="handlePushUpdatedPtPackage"
          @handleCloseForm="handleCloseForm"
        ></UpdatePtPackageForm>
      </q-card>
    </q-dialog>

    <!-- DIALOG Confirm Delete === -->
    <q-dialog v-model="showDeleteConfirmationDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Xác nhận xóa</div>
          <div>Bạn có chắc chắn muốn xóa sản phẩm này không?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Không" color="primary" v-close-popup />
          <q-btn
            flat
            label="Có"
            color="negative"
            @click="handleDeletePtPackage"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { onBeforeMount, ref } from "vue";

import { useToast } from "vue-toastification";
import ptPackageService from "../services/ptPackage.service";
import packageTypeService from "../services/packageType.service";
import durationService from "../services/duration.service";
import AddPtPackageForm from "../components/AddPtPackageForm.vue";
import UpdatePtPackageForm from "../components/UpdatePtPackageForm.vue";

export default {
  components: {
    AddPtPackageForm,
    UpdatePtPackageForm,
  },
  setup() {
    const toast = useToast();

    const selectedTypeLabel = ref("");
    const selectedPtPackageToUpdate = ref();
    const selectedPtPackageToDelete = ref();

    const slide = ref([]);
    const tab = ref([]);
    const ptPackageList = ref([]);
    const filteredPtPackageList = ref([]);
    const packageTypeList = ref([]);
    const durationList = ref([]);

    const showDeleteConfirmationDialog = ref(false);
    const showDeleteWarningPtPackage = ref(false);
    const showCreatePtPackage = ref(false);
    const showUpdatePtPackage = ref(false);

    onBeforeMount(async () => {
      try {
        packageTypeList.value = await packageTypeService.getAllPackageType();
        ptPackageList.value = await ptPackageService.getAll();
        durationList.value = await durationService.getAll();

        filteredPtPackageList.value = ptPackageList.value;

        ptPackageList.value.map((ptPackage) => {
          tab.value.push("info");
          slide.value.push(0);
        });
      } catch (e) {
        console.error(e);
      }
    });

    function handleOpenUpdatePtPackageForm(ptPackage) {
      selectedPtPackageToUpdate.value = ptPackage;
      showUpdatePtPackage.value = true;
    }
    function handleOpenDeleteConfirmationDialog(ptPackage) {
      showDeleteConfirmationDialog.value = true;
      selectedPtPackageToDelete.value = ptPackage;
    }

    function handleDeletePtPackage() {
      filteredPtPackageList.value = filteredPtPackageList.value.filter(
        (ptPackage) => ptPackage.id !== selectedPtPackageToDelete.value.id
      );
      console.log(filteredPtPackageList.value);
      ptPackageService.deletePtPackage(selectedPtPackageToDelete.value.id);
    }

    function handlePushNewPtPackage(newPP) {
      filteredPtPackageList.value.push(newPP);
      handleFilterPtPackageByTypeId(0);
      tab.value.push("info");
      slide.value.push(0);
    }

    function handlePushUpdatedPtPackage(updatedPP) {
      const index = filteredPtPackageList.value.findIndex(
        (ptPackage) => ptPackage.id === updatedPP.id
      );

      if (index !== -1) {
        filteredPtPackageList.value[index] = updatedPP;
      }

      handleFilterPtPackageByTypeId(0);
    }

    function handleCloseForm() {
      showCreatePtPackage.value = false;
      showUpdatePtPackage.value = false;
    }

    function handleFilterPtPackageByTypeId(type) {
      if (type === 0) {
        filteredPtPackageList.value = ptPackageList.value;
        selectedTypeLabel.value = "Phân loại";
      } else {
        filteredPtPackageList.value = ptPackageList.value.filter(
          (ptPackage) => ptPackage.servicePackage.serviceType.type === type.type
        );
        selectedTypeLabel.value = type.type;
      }
    }

    return {
      selectedTypeLabel,
      selectedPtPackageToUpdate,

      slide,
      tab,
      ptPackageList,
      packageTypeList,
      durationList,
      filteredPtPackageList,

      showCreatePtPackage,
      showUpdatePtPackage,
      showDeleteConfirmationDialog,
      showDeleteWarningPtPackage,

      handleFilterPtPackageByTypeId,
      handleCloseForm,
      handlePushNewPtPackage,
      handlePushUpdatedPtPackage,
      handleOpenUpdatePtPackageForm,
      handleOpenDeleteConfirmationDialog,
      handleDeletePtPackage,
    };
  },
};
</script>

<style scoped>
/* <======= CSS DROPDOWN-BTN =======>*/
/* <======= CSS DROPDOWN-BTN =======>*/
.pt-header-btns-container {
  margin-top: 5px;
  margin-right: 5px;
  display: flex;
  justify-content: end;
}
.btn-dropdown-type {
  color: white;
  background-color: var(--icon-color);
  border-radius: 0 0;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.5) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}

.btn-dropdown-update {
  background-color: var(--icon-color);
  color: white;
  margin-left: 3px;
  border-radius: 0 0;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.5) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}
.btn-dropdown-type:hover,
.btn-dropdown-update:hover {
  background: #ff8512;
  box-shadow: rgba(155, 155, 155, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}

.type-item {
  font-size: 16px;
  font-weight: bold;
}
.btn-dropdown-update-item {
  color: var(--icon-color);
}
.btn-dropdown-update-item .router-link-package-benefits {
  text-decoration: none;
  color: inherit;
}
.update-icon {
  color: var(--icon-color);
}

/* <======= CSS Service Card =======>*/
/* <======= CSS Service Card =======>*/
.pt-cards-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.service-card {
  display: flex;
  width: 45%;
  padding: 10px;
}

.service-tabs {
  flex: 1;
}
.service-tabs .q-tabs-icon {
  background: var(--icon-color);
  margin-bottom: 10px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 2px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}
.service-tabs .q-tabs-icon:hover {
  background: #ff7c01;
  box-shadow: rgba(155, 155, 155, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 2px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}
.service-content {
  position: relative;
  flex: 5;
}
.service-content .tab-panels .abouts {
  padding: 0 10px;
}
.service-content .tab-panels .slide-img-list {
  height: fit-content;
}
.service-content .tab-panels .slide-img-list .slide-img-item-container {
  padding: 0 0;
}
.service-content
  .tab-panels
  .slide-img-list
  .slide-img-item-container
  .slide-img-item {
  width: 100%;
  height: 350px;
  object-fit: contain;
}
.service-content .tab-panels .abouts .title {
  position: relative;
  font-weight: bold;
  font-size: 1.2rem;
}

.service-content .edit-btns {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
}
.service-content .edit-btns .edit-btn {
  color: var(--icon-color);
  border: none;
  background: none;
  cursor: pointer;
  width: 37px;
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.service-content .edit-btns .edit-btn:hover {
  color: #ffc100;
  border-radius: 50%;
  border: 1px solid #ffc100;
}

/*======= TABLE  ========*/
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
  flex-basis: 40%;
}

.responsive-table .col-2 {
  flex-basis: 50%;
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
</style>
