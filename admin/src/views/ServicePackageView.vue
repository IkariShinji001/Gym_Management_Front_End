<template>
  <div>
    <div class="service-btns-container">
      <q-btn-dropdown
        flat
        size="22px"
        label="Cập nhật"
        class="btn-dropdown-icon"
        dropdown-icon="settings"
      >
        <q-list>
          <q-item clickable v-close-popup @click="">
            <q-item-section side>
              <q-icon name="add_circle" class="update-icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Thêm gói</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="showCreatePackageType = true">
            <q-item-section side>
              <q-icon name="add_circle" class="update-icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Thêm loại dịch vụ</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="removeType">
            <q-item-section side>
              <q-icon name="build_circle" class="update-icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Cập nhật dịch vụ</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div class="service-cards-container">
      <div
        class="service-card"
        v-for="(fitness, index) in fitnessPackages"
        :key="index"
      >
        <div class="service-tabs">
          <q-tabs v-model="tab[index]" vertical class="q-tabs-icon">
            <q-tab name="titles" icon="info" label="About" />
            <q-tab name="tables" icon="payments" label="Prices" />
          </q-tabs>
        </div>

        <div class="service-content">
          <q-tab-panels
            v-model="tab[index]"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="titles">
              <div class="text-h5 q-mb-md">
                {{ fitness.servicePackage.name }}
              </div>
              <p>{{ fitness.servicePackage.description }}</p>
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
                    v-for="packagePrice in fitness.servicePackage
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

    <!-- DIALOG Create Type=== -->
    <q-dialog v-model="showCreatePackageType">
      <q-card class="q-card-package-type">
        <q-card-section class="row items-center q-pb-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit="" class="q-gutter-md">
            <q-input
              filled
              v-model="packageTypeInput"
              label="Package Type *"
              hint="Name and surname"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Nhap loai goi dich vu',
              ]"
            />

            <div>
              <q-btn label="Submit" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { onBeforeMount, ref } from "vue";
import fitnessPackageService from "../services/fitnessPackage.service";
export default {
  setup() {
    const fitnessPackages = ref([]);
    const tab = ref([]);
    const showCreatePackageType = ref(false);
    const packageTypeInput = ref()
    const packageTypes = ref([])
    onBeforeMount(async () => {
      try {
        // packageTypes.value = await

        fitnessPackages.value = await fitnessPackageService.getAllWithDetail();
        fitnessPackages.value.forEach(() => {
          tab.value.push("titles");
        });


        console.log(fitnessPackages.value);
      } catch (e) {
        console.error(e);
      }
    });

    function createPackageType() {}
    return {
      tab,
      splitterModel,
      fitnessPackages,
      showCreatePackageType,
      packageTypeInput
    };
  },
};
</script>

<style scoped>
.service-btns-container {
  display: flex;
  justify-content: end;
}
.btn-dropdown-icon {
  color: var(--icon-color);
  border-left: 2px solid var(--icon-color);
  border-radius: 0 0;
}
.update-icon {
  color: var(--table-bg);
}

.service-cards-container {
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
.service-content {
  flex: 5;
}
.service-tabs .q-tabs-icon {
  color: var(--icon-color);
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

/* DIALOG create Package Type */
.q-card-package-type {
  width: 400px;
}
</style>
