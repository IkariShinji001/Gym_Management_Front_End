<template>
  <div>
    <h3>Quản lý nhân viên Phòng Gym</h3>
    <div>
      <h4>Danh sách nhân viên</h4>
      <div class="search-bar">
        <q-input
          class="input-search"
          v-model="searchQuery"
          label="Tìm kiếm nhân viên"
        />
        <div class="btn-add q-pa-md q-gutter-sm">
          <q-btn
            label="Thêm nhân viên"
            icon="add"
            color="primary"
            @click="showAddDialog = true"
          />
        </div>
      </div>
      <div class="card-grid" v-if="pts">
        
          <q-card class="my-card" flat bordered v-for="pt in pts" :key="pt.id">

            <img v-if="pt.images.length" :src="pt.images[0].imageUrl"  class="card-img"/>

            <q-tabs v-model="tab" class="text-teal">
              <q-tab label="profile" name="one"></q-tab>
              <q-tab label="body" name="two"></q-tab>
            </q-tabs>

            <q-separator></q-separator>

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="one" class="panel">
                <q-list>
                  <q-list>
                    <q-item class="item">
                      <q-item-section>
                        <q-item-label>Tên</q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption>{{
                          pt.profile.fullName
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item class="item">
                      <q-item-section>
                        <q-item-label>Số điện thoại</q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption>{{
                          pt.profile.phoneNumber
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item class="item">
                      <q-item-section>
                        <q-item-label>Email</q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption>{{
                          pt.profile.email
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item class="item">
                      <q-item-section>
                        <q-item-label>Vai trò</q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption>{{
                          pt.profile.role
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-list>
              </q-tab-panel>

              <q-tab-panel name="two" class="panel">
                <q-list>
                  <q-list>
                    <q-item class="item">
                      <q-item-section>
                        <q-item-label>Chiều cao</q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption>{{ pt.height }} cm</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item class="item">
                      <q-item-section>
                        <q-item-label>Cân nặng</q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption>{{ pt.weight }} kg</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item class="item">
                      <q-item-section>
                        <q-item-label>Vòng 1</q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption>{{ pt.bust }} cm</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item class="item">
                      <q-item-section>
                        <q-item-label>Vòng 2</q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption>{{ pt.waist }} cm</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item class="item">
                      <q-item-section>
                        <q-item-label>Vòng 3</q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label caption>{{ pt.hips }} cm</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-list>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        



        <q-dialog v-model="showAddDialog" persistent>
          <q-card class="dialog-add">
            <q-card-section>
              <div class="text-h6">Thêm nhân viên mới</div>
            </q-card-section>

            <q-card-section>
              <q-form @submit="addPt">
                <q-input v-model="pt.profile.fullName" label="Họ và tên" />
                <q-input v-model="pt.profile.email" label="Email" />
                <q-input
                  v-model="pt.profile.phoneNumber"
                  label="Số điện thoại"
                />
                <q-input v-model="pt.profile.role" label="Vai trò" />
                <q-input v-model="pt.height" label="Chiều cao" />
                <q-input v-model="pt.weight" label="Cân nặng" />
                <q-input v-model="pt.bust" label="Vòng 1" />
                <q-input v-model="pt.waist" label="Vòng 2" />
                <q-input v-model="pt.hips" label="Vòng 3" />
                <q-btn class="btn-save" icon="save" label="Lưu" type="submit" />
                <q-btn
                  class="btn-cancel"
                  icon="cancel"
                  label="Hủy"
                  flat
                  @click="showAddDialog = false"
                />
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>

  <!-- QDialog component thêm nhân viên-->
</template>

<script>
import { onBeforeMount, reactive, ref, watch } from "vue";
import ptsServices from "../services/pts.service";
export default {
  setup() {
    const tab = ref("all");
    const searchQuery = ref("");
    const showAddDialog = ref(false);
    const pts = ref([]);

    const pt = reactive({
      weight: "",
      height: "",
      bust: "",
      waist: "",
      hips: "",
      profile: {
        email: "",
        phoneNumber: "",
        fullName: "",
        role: "",
      },
      images: [],
    });

    const fetchPts = async () => {
      try {
        pts.value = await ptsServices.findAll();
      } catch (error) {
        console.log(error);
      }
    };
    onBeforeMount(() => {
      fetchPts();
    });

    watch(
      searchQuery,
      (newValue) => {
        if (newValue) {
          pts.value = pts.value.filter((pt) =>
            pt.profile.fullName.toLowerCase().includes(newValue.toLowerCase())
          );
        } else {
          fetchPts();
        }
      },
      { immediate: true }
    );

    const addPt = async () => {
      try {
        await ptsServices.create(pt);
        fetchPts();
        showAddDialog.value = false;
      } catch (error) {
        console.log(error);
      }
    };

    return {
      tab,
      pts,
      pt,
      searchQuery,
      showAddDialog,
      addPt,
    };
  },
};
</script>

<style>
.card-grid {
  display: flex;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 5px;
}

.my-card {
  margin: 10px;
  width: 100%;
  max-width: 250px;
  
}
.avatar {
  height: 180px;
  width: 100%;
}
.card-img{
  height: 180px;
  width: 100%;
}
.item {
  padding: 0 10px;
}
.panel {
  height: 200px;

}
.input-search {
  border: solid 1px rgb(83, 92, 121);
}

.dialog-add {
  width: 400px;
}
</style>
