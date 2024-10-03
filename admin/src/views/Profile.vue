  <template>
    <div class="container">
      <h2 class="container-header">Thông tin cá nhân</h2>
      <div class="edit">
        <q-btn class="btn" flat icon="edit" size="md" @click="handleOpenUpdateDialog">
          <q-tooltip>Chỉnh sửa</q-tooltip>
        </q-btn>
        <q-btn class="btn" flat icon="key" size="md" @click="handleOpenUpdatePassword">
          <q-tooltip>Đổi mật khẩu</q-tooltip>
        </q-btn>
      </div>
      <!-- Profile Information -->
      <div class="container-body">
        <!-- Quasar Carousel for images -->
        <q-card class="card-img">
          <div v-if="profilePt.images?.length" class="carousel-container">
            <q-carousel animated v-model="slide" arrows infinite swipeable thumbnails>
              <q-carousel-slide v-for="(image, index) in profilePt.images" :key="image.id" :name="index"
                :img-src="image?.imageUrl" img-class="carousel-image">
                <q-icon v-if="image?.id" class="delete-icon" name="delete" color="red" size="md"
                  @click="handleDeleteImage(image.id)" />
              </q-carousel-slide>
            </q-carousel>
          </div>
        </q-card>
        <div class="profile-details">
          <p><strong>Họ và tên:</strong> {{ profilePt?.profile?.fullName }}</p>
          <p><strong>Email:</strong> {{ profilePt.profile?.email }}</p>
          <p><strong>Số điện thoại:</strong> {{ profilePt.profile?.phoneNumber }}</p>
          <p><strong>Cân nặng:</strong> {{ profilePt.weight }} kg</p>
          <p><strong>Chiều cao:</strong> {{ profilePt.height }} cm</p>
          <p><strong>Vòng 1:</strong> {{ profilePt.bust }} cm</p>
          <p><strong>Vòng 2:</strong> {{ profilePt.waist }} cm</p>
          <p><strong>Vòng 3:</strong> {{ profilePt.hips }} cm</p>
          <strong>Link facebook: </strong>
          <a :href="profilePt.fbLink">{{ profilePt.fbLink }}</a>
        </div>
      </div>

      <q-dialog v-model="openUpdateDialog">
        <q-card>
          <q-card-section>
            <q-card-title>
              <h4>Chỉnh sửa thông tin cá nhân</h4>
            </q-card-title>
            <q-card-section>
              <q-form @submit="handleUpdateProfile">
                <q-input v-model="profilePt.profile.fullName" label="Họ và tên" />
                <q-input v-model="profilePt.profile.email" label="Email" />
                <q-input v-model="profilePt.profile.phoneNumber" label="Số điện thoại" />
                <q-btn type="submit" label="Update" color="primary" />
              </q-form>
              <q-form @submit="handleUpdatePt">
                <q-input v-model="profilePt.weight" label="Cân nặng" />
                <q-input v-model="profilePt.height" label="Chiều cao" />
                <q-input v-model="profilePt.bust" label="Vòng 1" />
                <q-input v-model="profilePt.waist" label="Vòng 2" />
                <q-input v-model="profilePt.hips" label="Vòng 3" />
                <q-input v-model="profilePt.fbLink" label="Link Facebook" />
                <q-btn type="submit" label="Update" color="primary" />
              </q-form>
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="openUpdatePasswordDialog">
        <q-card>
          <q-card-section>
            <q-card-title>
              <h4>Đổi mật khẩu</h4>
            </q-card-title>
            <q-card-section>
              <q-form @submit="handleUpdatePassword">
                <q-input v-model="oldPassword" label="Mật khẩu cũ" type="password" />
                <q-input v-model="newPassword" label="Mật khẩu mới" type="password" />
                <q-input v-model="confirmPassword" label="Xác nhận mật khẩu" type="password" />
                <q-btn type="submit" label="Update" color="primary" />
              </q-form>
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-dialog>

    </div>
  </template>

<script setup>
import { useQuasar } from 'quasar';
import { onBeforeMount, ref } from 'vue';
import profilesService from '../services/profiles.service';
import ptsService from '../services/pts.service';
import uploadFileService from '../services/uploadFile.service';
import ptImagesService from '../services/ptImages.service';

const profilePt = ref({});
const id = localStorage.getItem('id');
const role = localStorage.getItem('role');
const slide = ref(0);
const openUpdateDialog = ref(false);
const openUpdatePasswordDialog = ref(false);
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const originalProfile = ref({}); // lưu trữ bản sao của profile ban đầu

const $q = useQuasar();


onBeforeMount(async () => {
  try {
    if (role === 'pt') {
      const ptData = await ptsService.findByProfile(id);
      profilePt.value = ptData;
      originalProfile.value = JSON.parse(JSON.stringify(ptData)); // Lưu bản sao gốc
    }
  } catch (error) {
    console.log(error);
  }
});
const handleOpenUpdateDialog = () => {
  openUpdateDialog.value = true;
};
const handleOpenUpdatePassword = () => {
  openUpdatePasswordDialog.value = true;
};
const handleUpdatePt = async () => {
  try {
    const updatedPt = {
      weight: profilePt.value.weight,
      height: profilePt.value.height,
      bust: profilePt.value.bust,
      waist: profilePt.value.waist,
      hips: profilePt.value.hips,
      fbLink: profilePt.value.fbLink,
    };
    await ptsService.update(profilePt.value.id, updatedPt);
    openUpdateDialog.value = false;
  } catch (error) {
    console.log(error);
    sole.log("2131");

  }
};
const handleUpdateProfile = async () => {
  try {
    const updatedProfile = {};
    // So sánh từng trường và chỉ thêm những trường thay đổi vào updatedProfile
    if (profilePt.value.profile.fullName !== originalProfile.value.profile.fullName) {
      updatedProfile.fullName = profilePt.value.profile.fullName;
    }
    if (profilePt.value.profile.email !== originalProfile.value.profile.email) {
      updatedProfile.email = profilePt.value.profile.email;
    }
    if (profilePt.value.profile.phoneNumber !== originalProfile.value.profile.phoneNumber) {
      updatedProfile.phoneNumber = profilePt.value.profile.phoneNumber;
    }

    // Kiểm tra nếu có thay đổi thì mới gọi API
    if (Object.keys(updatedProfile).length > 0) {
      await profilesService.updatedProfile(profilePt.value.profile.id, updatedProfile);
      openUpdateDialog.value = false;
      originalProfile.value = JSON.parse(JSON.stringify(profilePt.value)); // Cập nhật lại bản sao gốc
    } else {
      alert('Không có thay đổi nào để cập nhật');
    }
  } catch (error) {
    $q.notify({ position: 'top', color: 'negative', message: 'Vui lòng kiểm tra lại thông tin cập nhật' });
    console.log(error);
  }
};
const handleUpdatePassword = async () => {
  try {

    if (newPassword.value !== confirmPassword.value) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }
    if (newPassword.value.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (oldPassword.value === '') {
      alert('Vui lòng nhập mật khẩu cũ');
      return;
    }
    await profilesService.updatePassword(profilePt.value.profile.id, oldPassword.value, newPassword.value);
    openUpdatePasswordDialog.value = false;
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteImage = async (imageId) => {
  try {
    await uploadFileService.deleteFile(imageId);
    await ptImagesService.deleteImage(imageId);
    profilePt.value.images = profilePt.value.images.filter((image) => image.id !== imageId);
  } catch (error) {
    console.log(error);
  }
};


</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 10px auto;
}

h2 {
  text-align: center;
  font-size: 30px;
  margin-bottom: 10px;
}

.edit {
  position: absolute;
  top: 100px;
  right: 80px;
  z-index: 1;
  background-color: #D90429;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 5px;
}


.btn:hover {
  background-color: #FFC300;
}

.container-header {
  text-align: center;
  margin-bottom: 5px;
}

.carousel-container {
  margin-bottom: 20px;
}

.carousel-image {
  object-fit: contain;
  object-position: top;
  height: 400px;
  width: 100%;
}

.profile-details p {
  margin: 10px 0;
}


.carousel-container {
  position: relative;
}

.carousel-image {
  width: 100%;
  height: auto;
}

.delete-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.carousel-container:hover .delete-icon {
  display: block;
}

.add-image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
</style>
