<template>
  <section>
    <h1>Quản lý PT</h1>
    <div class="input-search">
      <q-input
        class="input"
        outlined
        v-model="search"
        label="Tìm kiếm PT"
      />
      <q-btn class="add" color="primary" @click="handleOpenCreateDialog"
        >Thêm PT</q-btn
      >
    </div>

    <table>
      <tr class="heading-table">
        <th>STT</th>
        <th>Họ và tên</th>
        <th>Email</th>
        <th>Số điện thoại</th>
        <th>Vai trò</th>
        <th>Chức năng</th>
      </tr>
      <tr v-for="(pt, index) in filteredPts" :key="pt.id">
        <td>{{ index + 1 }}</td>
        <td>{{ pt.profile.fullName }}</td>
        <td>{{ pt.profile.email }}</td>
        <td>{{ pt.profile.phoneNumber }}</td>
        <td>{{ pt.profile.role }}</td>
        <td class="function">
          <q-icon
            class="icons"
            @click="handleOpenUpdateDialog(pt.id)"
            name="update"
          ></q-icon
          ><q-icon
            class="icons"
            @click="handleDelete(pt.id)"
            name="delete"
          ></q-icon>
          <q-icon
            class="icons"
            @click="handleOpenDetailDialog(pt.id)"
            name="visibility"
          ></q-icon>
        </td>
      </tr>
    </table>

    <!-- Dialog cho thêm PT -->
    <q-dialog v-model="openCreateDialog">
      <q-card class="modal">
        <q-card-section>
          <q-card-title>
            <q-icon name="add"></q-icon>
            <span>Thêm PT</span>
          </q-card-title>
          <q-card-section>
            <q-input
              v-model="ptInput.profile.fullName"
              label="Họ và tên"
              outlined
            />
            <q-input v-model="ptInput.profile.email" label="Email" outlined />
            <q-input
              v-model="ptInput.profile.password"
              label="Password"
              outlined
            />
            <q-input
              v-model="ptInput.profile.phoneNumber"
              label="Số điện thoại"
              outlined
            />
            <q-input v-model="ptInput.profile.role" label="Vai trò" outlined />
            <q-input v-model="ptInput.weight" label="Cân nặng" outlined />
            <q-input v-model="ptInput.height" label="Chiều cao" outlined />
            <q-input v-model="ptInput.bust" label="Vòng 1" outlined />
            <q-input v-model="ptInput.waist" label="Vòng 2" outlined />
            <q-input v-model="ptInput.hips" label="Vòng 3" outlined />
          </q-card-section>
        </q-card-section>
        <q-card-actions class="action">
          <q-btn class="btn" color="primary" label="Lưu" @click="handleAdd" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog cho cập nhật PT -->
    <q-dialog v-model="openUpdateDialog">
      <q-card class="modal">
        <q-card-section>
          <q-card-title>
            <q-icon name="edit"></q-icon>
            <span>Cập nhật PT</span>
          </q-card-title>
          <q-card-section>
            <q-input v-model="pt.weight" label="Cân nặng" outlined />
            <q-input v-model="pt.height" label="Chiều cao" outlined />
            <q-input v-model="pt.bust" label="Vòng 1" outlined />
            <q-input v-model="pt.waist" label="Vòng 2" outlined />
            <q-input v-model="pt.hips" label="Vòng 3" outlined />
          </q-card-section>
        </q-card-section>
        <q-card-actions class="action">
          <q-btn
            class="btn"
            color="primary"
            label="Lưu"
            @click="handleUpdate(pt.id)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog cho xem chi tiết thông tin -->
    <q-dialog v-model="openDetailDialog">
      <q-card>
        <img v-if="pt.images.length" :src="pt.images[0].imageUrl"  class="card-img"/>
        <q-tab-panel class="panel" >
              <q-item class="item">
                <q-item-section>
                  <q-item-label>Tên</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ pt.profile.fullName }}</q-item-label>
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
                  <q-item-label caption>{{ pt.profile.email }}</q-item-label>
                </q-item-section>
              </q-item>

             
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
        </q-tab-panel>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { computed, onBeforeMount, reactive, ref } from "vue";
import ptsServices from "../services/pts.service";

const pts = ref([]);
const search = ref();
const openCreateDialog = ref(false);
const openUpdateDialog = ref(false);
const openDetailDialog = ref(false);
const updateId = ref("");

const pt = reactive({
  weight: "",
  height: "",
  bust: "",
  waist: "",
  hips: "",
  profile: {
    email: "",
    password: "",
    phoneNumber: "",
    fullName: "",
    role: "",
  },
});

const ptInput = reactive({
  weight: "",
  height: "",
  bust: "",
  waist: "",
  hips: "",
  profile: {
    email: "",
    password: "",
    phoneNumber: "",
    fullName: "",
    role: "",
  },
});

const handleOpenCreateDialog = () => {
  ptInput.profile.email = "";
  ptInput.profile.password = "";
  ptInput.profile.phoneNumber = "";
  ptInput.profile.fullName = "";
  ptInput.profile.role = "";
  ptInput.weight = "";
  ptInput.height = "";
  ptInput.bust = "";
  ptInput.waist = "";
  ptInput.hips = "";
  openCreateDialog.value = true;
};

const handleOpenUpdateDialog = async (id) => {
  openUpdateDialog.value = true;
  const index = pts.value.findIndex((pt) => pt.id === id);
  Object.assign(pt, pts.value[index]);
  updateId.value = index;
  updateId.value = id;
};

const handleAdd = async () => {
  try {
    const payload = {
      createProfileDto: {
        email: ptInput.profile.email,
        password: ptInput.profile.password,
        phoneNumber: ptInput.profile.phoneNumber,
        fullName: ptInput.profile.fullName,
        role: "pt",
      },
      createPtDto: {
        weight: ptInput.weight,
        height: ptInput.height,
        bust: ptInput.bust,
        waist: ptInput.waist,
        hips: ptInput.hips,
      },
    };
    const res = await ptsServices.create(payload);
    openCreateDialog.value = false;
    pts.value.push(res);
  } catch (error) {
    console.log(error);
  }
};

const handleUpdate = async (id) => {
  try {
    const payload = {
      weight: pt.weight,
      height: pt.height,
      bust: pt.bust,
      waist: pt.waist,
      hips: pt.hips,
    };
    const res = await ptsServices.update(id, payload);
    const index = pts.value.findIndex((pt) => pt.id === id);
    Object.assign(pts.value[index], res);
    openUpdateDialog.value = false;
  } catch (error) {
    console.log(error);
  }
};

const filteredPts = computed(() => {
  if (!search.value) return pts.value;

  const searchName = search.value.toLowerCase();
  return pts.value.filter((pt) => pt.profile.fullName.includes(searchName));
});
const handleDelete = async (id) => {
  try {
    await ptsServices.delete(id);
    pts.value = pts.value.filter((pt) => pt.id !== id);
  } catch (error) {
    console.log(error);
  }
};

onBeforeMount(async () => {
  pts.value = await ptsServices.getAll();
});
const handleOpenDetailDialog = (id) => {
  openDetailDialog.value = true;
  const index = pts.value.findIndex((pt) => pt.id === id);
  Object.assign(pt, pts.value[index]);
};
</script>

<style>
h1 {
  text-align: center;
  font-size: 30px;
  margin-bottom: 20px;
}
.input-search {
  display: flex;
  margin: 0 50px;
  justify-content: space-around;
}
.input {
  width: 70%;
  font-size: 22px;
}
.add {
  width: 20%;
}

table {
  width: 85%;
  margin-top: 20px;
  margin-left: 20px;
}
tr:nth-child(even) {
  background-color: aliceblue;
}

.modal {
  min-width: 700px;
}

.icons {
  margin: 0 20px;
  cursor: pointer;
}
th {
  font-size: 20px;
  padding: 0 10px;
}
td {
  font-size: 18px;
  padding: 0 10px;
  padding: 10px;
}
.action {
  display: flex;
  justify-content: center;
}
.btn {
  display: flex;
  margin: 0 auto;
  padding: 10px 60px;
  margin-top: 20px;
}
td {
  text-align: center;
}

.avatar {
  height: 180px;
  width: 100%;
}
.card-img{
  height: 180px;
  width: 100%;
}
.panel {
  height: 450px;
  width: 700px;
}
</style>
