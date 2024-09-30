<template>
  <section>
    <h1>Quản lý PT</h1>
    <div class="input-search">
      <q-input class="input" outlined v-model="search" label="Tìm kiếm PT" />
      <q-btn class="add" color="primary" @click="handleOpenCreateDialog">Thêm PT</q-btn>
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
      <tr v-for="(pt, index) in paginatedPts" :key="pt.id">
        <td>{{ index + 1 }}</td>
        <td>{{ pt.profile.fullName }}</td>
        <td>{{ pt.profile.email }}</td>
        <td>{{ pt.profile.phoneNumber }}</td>
        <td>{{ pt.profile.role }}</td>
        <td class="function">
          <q-icon class="icons" @click="handleOpenUpdateDialog(pt.id)" name="update"></q-icon><q-icon class="icons"
            @click="handleDelete(pt.id)" name="delete"></q-icon>
          <q-icon class="icons" @click="handleOpenDetailDialog(pt.id)" name="visibility"></q-icon>
        </td>
      </tr>
      <q-pagination v-model="currentPage" :max="totalPages" :rows-per-page="rowsPerPage"
        @update:model-value="updatePage" />
    </table>

    <!-- Dialog cho thêm PT -->
    <q-dialog v-model="openCreateDialog">
      <q-card class="modal">
        <q-card-section>
          <div class="header-card-title">
            <q-card-title class="card-title">
              <q-icon name="add"></q-icon>
              <h5>Thêm PT</h5>
            </q-card-title>
          </div>
          
          <q-card-section>
            <q-input class="dia-input" v-model="ptInput.profile.fullName" label="Họ và tên" outlined />
            <q-input class="dia-input" v-model="ptInput.profile.email" label="Email" outlined />
            <q-input class="dia-input" v-model="ptInput.profile.password" label="Password" outlined />
            <q-input class="dia-input" v-model="ptInput.profile.phoneNumber" label="Số điện thoại" outlined />
            <q-input class="dia-input" v-model="ptInput.profile.role" label="Vai trò" outlined />
            <q-input class="dia-input" v-model="ptInput.weight" label="Cân nặng" outlined />
            <q-input class="dia-input" v-model="ptInput.height" label="Chiều cao" outlined />
            <q-input class="dia-input" v-model="ptInput.bust" label="Vòng 1" outlined />
            <q-input class="dia-input" v-model="ptInput.waist" label="Vòng 2" outlined />
            <q-input class="dia-input" v-model="ptInput.hips" label="Vòng 3" outlined />
            <q-input class="dia-input" v-model="ptInput.fbLink" label="Link Facebook" outlined />
            <q-file required filled bottom-slots multiple v-model="fileUploaded" label="Hình ảnh" accept="image/*"
              @update:model-value="handleFileChange">
              <template v-slot:prepend>
                <q-icon name="cloud_upload" />
              </template>
            </q-file>
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
          <div class="header-card-title">
            <q-card-title class="card-title">
              <q-icon name="edit"></q-icon>
              <h5>Cập nhật Hình ảnh </h5>
            </q-card-title>
          </div>

          <q-card-section>
            <div class="list-image">
              <div v-for="(image) in pt.images" :key="image.id" class="image-item">
                <div class="image-container">
                  <img :src="image.imageUrl" alt="Image" class="image-preview" />
                  <!-- Nút xoá, hiển thị khi hover -->
                  <q-icon v-if="image.id" class="delete-icon" name="delete" color="red" size="md"
                    @click="handleDeleteImage(image.id)" />
                </div>
              </div>
              <div class="add-image">
                <!-- <q-icon name="add" padding="lg" color="primary" size="md" @click="handleAddImage" /> -->
                <q-file required filled bottom-slots multiple v-model="fileUploaded" label="Hình ảnh" accept="image/*"
                  >
                  <!-- @update:model-value="handleFileChange" -->
                  <template v-slot:prepend>
                    <q-icon name="cloud_upload" />
                  </template>
                </q-file>
                <q-icon name="check" padding="lg" color="primary" size="md" @click="handleAddImage(pt.id)" />
              </div>
            </div>
            <div class="header-card-title">
            <q-card-title class="card-title">
              <q-icon name="edit"></q-icon>
              <h5>Cập nhật thông tin </h5>
            </q-card-title>
          </div>
            <q-input class="dia-input" v-model="pt.weight" label="Cân nặng" outlined>
              <template v-slot:append>
                <h6>kg</h6>
              </template>
            </q-input>
            <q-input class="dia-input" v-model="pt.height" label="Chiều cao" outlined>
              <template v-slot:append>
                <h6>cm</h6>
              </template>
            </q-input>
            <q-input class="dia-input" v-model="pt.bust" label="Vòng 1" outlined>
              <template v-slot:append>
                <h6>cm</h6>
              </template>
            </q-input>
            <q-input class="dia-input" v-model="pt.waist" label="Vòng 2" outlined>
              <template v-slot:append>
                <h6>cm</h6>
              </template>
            </q-input>
            <q-input class="dia-input" v-model="pt.hips" label="Vòng 3" outlined>
              <template v-slot:append>
                <h6>cm</h6>
              </template>
            </q-input>
            <q-input class="dia-input" v-model="pt.fbLink" label="Link Facebook" outlined>
            </q-input>
          </q-card-section>
        </q-card-section>
        <q-card-actions class="action">
          <q-btn class="btn" color="primary" label="Lưu" @click="handleUpdate(pt.id)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog cho xem chi tiết thông tin -->
    <q-dialog v-model="openDetailDialog">
      <q-card>
        <!-- <img v-if="pt.images.length" :src="pt.images[0].imageUrl" class="card-img" /> -->
        <div v-if="pt.images.length">
          <q-carousel animated v-model="slide" arrows infinite swipeable thumbnails>
            <q-carousel-slide v-for="(image, index) in pt.images" :key="image.id" :name="index + 1"
              :img-src="image.imageUrl" />
          </q-carousel>
        </div>

        <q-tab-panel class="panel">
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
              <q-item-label caption>{{ pt.profile.phoneNumber }}</q-item-label>
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
          <q-item class="item">
            <q-item-section>
              <q-item-label>Link Facebook</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ pt.fbLink }}</q-item-label>
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
import uploadFileService from "../services/uploadFile.service";
import ptImagesService from "../services/ptImages.service"

const pts = ref([]);
const search = ref();
const openCreateDialog = ref(false);
const openUpdateDialog = ref(false);
const openDetailDialog = ref(false);
const updateId = ref("");
const currentPage = ref(1);
const rowsPerPage = ref(10);
const fileUploaded = ref([]);
const secure_urlList = ref([]);
const slide = ref(1);
const selectedImgId = ref(0);

const pt = reactive({
  weight: "",
  height: "",
  bust: "",
  waist: "",
  hips: "",
  fbLink: "",
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
  fbLink: "",
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
    for (var i = 0; i < fileUploaded.value.length; i++) {
      const formData = new FormData();
      formData.append("file", fileUploaded.value[i]);
      const fileRes = await uploadFileService.uploadFile(formData);
      secure_urlList.value.push(
        { imageUrl: fileRes.secure_url });
    }
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
        fbLink: ptInput.fbLink,
      },
      createImagesDto: secure_urlList.value,
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
      fbLink: pt.fbLink,
    };
    const res = await ptsServices.update(id, payload);
    const index = pts.value.findIndex((pt) => pt.id === id);
    Object.assign(pts.value[index], res);
    openUpdateDialog.value = false;
  } catch (error) {
    console.log(error);
  }
};

const handleAddImage = async (id) => {
  try {
    secure_urlList.value = []; // reset danh sách ảnh
    for (var i = 0; i < fileUploaded.value.length; i++) {
      const formData = new FormData();
      formData.append("file", fileUploaded.value[i]);
      const fileRes = await uploadFileService.uploadFile(formData);
      secure_urlList.value.push(
        { imageUrl: fileRes.secure_url });
    }

    for (var i = 0; i < secure_urlList.value.length; i++) {
      const newImage = await ptImagesService.createImage(secure_urlList.value[i].imageUrl, id);
      // pt.images.push(secure_urlList.value[i]);
      const ptIndex = pts.value.findIndex(pt => pt.id === id);
      pts.value[ptIndex].images.push(newImage); // cập nhật vào danh sách ảnh của PT
    }
    fileUploaded.value = []; // Làm trống danh sách file sau khi xử lý
    secure_urlList.value = []; // Làm trống danh sách URL sau khi xử

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
  // console.log(pts.value);
});
const handleOpenDetailDialog = (id) => {
  openDetailDialog.value = true;
  const index = pts.value.findIndex((pt) => pt.id === id);
  Object.assign(pt, pts.value[index]);
};
const totalPages = computed(() => {
  return Math.ceil(filteredPts.value.length / rowsPerPage.value);
});

const paginatedPts = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return filteredPts.value.slice(start, end);
});

const updatePage = (page) => {
  currentPage.value = page;
};

const handleDeleteImage = async (imageId) => {
  try {
    await uploadFileService.deleteFile(imageId);
    await ptImagesService.deleteImage(imageId);

    pt.images = pt.images.filter((image) => image.id !== imageId);
  } catch (error) {
    console.log(error);
  }
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
  margin: 30px auto;
  border-collapse: collapse;
}

.heading-table th {
  background-color: #f5f5f5;
  padding: 10px;
  text-align: center;
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
  border-bottom: 1px solid #ddd;
}

td {
  font-size: 18px;
  padding: 0 10px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
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

.card-img {
  height: 180px;
  width: 100%;
}

.panel {
  height: 450px;
  width: 700px;
}

.dia-input {
  margin: 5px;
}

.list-image {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.add-image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.image-container {
  position: relative;
  display: inline-block;
}

.image-preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
  transition: filter 0.3s ease;
  /* Hiệu ứng mờ khi hover */
}

.image-container:hover .image-preview {
  filter: grayscale(100%);
  /* Chuyển ảnh sang xám khi hover */
}

.delete-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  /* Ẩn nút xoá */
  transition: opacity 0.3s ease;
  /* Hiệu ứng mượt khi hover */
}

.image-container:hover .delete-icon {
  opacity: 1;
  /* Hiển thị nút xoá khi hover */
}

.card-title {
  display: flex;
  align-items: center;
  text-align: center;
  height: 40px;
  
}
.header-card-title {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
