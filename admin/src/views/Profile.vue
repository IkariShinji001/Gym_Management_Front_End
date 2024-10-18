  <template>
    <div class="container">
      <h2 class="container-header">Thông tin cá nhân</h2>
      <div class="edit">
        <q-btn class="btn" flat icon="edit" size="md" @click="handleOpenUpdateDialog">
          <q-tooltip>Chỉnh sửa</q-tooltip>
        </q-btn>
        <q-btn class="btn" flat icon="key" size="md" @click="handleOpenUpdatePasswordDialog">
          <q-tooltip>Đổi mật khẩu</q-tooltip>
        </q-btn>
      </div>
      <!-- Profile Information -->
      <div class="container-body" v-if="role === 'pt'">
        <!-- Quasar Carousel for images -->
        <q-card class="card-img">
          <div v-if="profilePt.images?.length" class="carousel-container">
            <q-carousel animated v-model="slide" arrows infinite swipeable thumbnails>
              <q-carousel-slide v-for="(image, index) in profilePt.images" :key="image.id" :name="index"
                :img-src="image?.imageUrl" img-class="carousel-image">
                <q-icon v-if="image?.id" class="delete-icon" name="delete" color="red" size="md"
                  @click="handleDeleteImage(image.id)">
                  <q-tooltip>Xoá ảnh</q-tooltip>
                </q-icon>

              </q-carousel-slide> <q-icon v-show="true" class="add-icon" name="upload_file" color="blue" size="md"
                @click="handleAddImageDialog">
                <q-tooltip>Thêm ảnh</q-tooltip>
              </q-icon>

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
      <!-- profile Manager Infomation -->
      <div class="container-body" v-if="role === 'manager'">
        <div class="profile-detail">
          <p><strong>Họ và tên: </strong> {{ profileManager?.fullName }}</p>
          <p><strong>Email: </strong> {{ profileManager?.email }}</p>
          <p><strong>Số điện thoại: </strong> {{ profileManager?.phoneNumber }}</p>
        </div>
      </div>
      <!-- profile Employee Infomation -->
      <div class="container-body" v-if="role === 'employee'">
        <div class="profile-detail">
          <p><strong>Họ và tên: </strong> {{ profileEmployee?.fullName }}</p>
          <p><strong>Email: </strong> {{ profileEmployee?.email }}</p>
          <p><strong>Số điện thoại: </strong> {{ profileEmployee?.phoneNumber }}</p>
        </div>
      </div>
      <q-dialog v-model="openUpdatePtDialog">
        <q-card>
          <q-card-section>
            <q-card-title>
              <h4>Chỉnh sửa thông tin cá nhân</h4>
            </q-card-title>
            <q-card-section>
              <q-form @submit="handleUpdateProfile">
                <q-input v-model="profilePt.profile.fullName" label="Họ và tên" />
                <q-input v-model="profilePt.profile.email" label="Email" :rules="[
                  val => !!val || 'Email không được để trống', validateEmail]" />
                <q-input v-model="profilePt.profile.phoneNumber" label="Số điện thoại" />
                <q-btn type="submit" label="Lưu" color="primary" />
              </q-form>
              <q-form @submit="handleUpdatePt">
                <q-input v-model="profilePt.weight" label="Cân nặng" />
                <q-input v-model="profilePt.height" label="Chiều cao" />
                <q-input v-model="profilePt.bust" label="Vòng 1" />
                <q-input v-model="profilePt.waist" label="Vòng 2" />
                <q-input v-model="profilePt.hips" label="Vòng 3" />
                <q-input v-model="profilePt.fbLink" label="Link Facebook" />
                <div class="submit-button">
                  <q-btn type="submit" label="Lưu" color="primary" />
                </div>

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
                <div class="submit-button">
                  <q-btn type="submit" label="Lưu" color="primary" />
                </div>
              </q-form>
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="openAddImageDialog">
        <q-card>
          <q-card-section>
            <q-card-title>
              <h4>Thêm ảnh</h4>
            </q-card-title>
            <q-card-section>
              <q-form @submit="handleAddImage">
                <q-file required filled bottom-slots multiple v-model="fileUploaded" label="Hình ảnh" accept="image/*"
                  @update:model-value="handleFileChange">
                  <template v-slot:prepend>
                    <q-icon name="cloud_upload" />
                  </template>
                </q-file>
                <div class="submit-button">
                  <q-btn type="submit" label="Thêm ảnh" color="primary" />
                </div>
              </q-form>
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="openUpdateManagerDialog">
        <q-card>
          <q-card-section>
            <q-card-title>
              <h4>Chỉnh sửa thông tin cá nhân</h4>
            </q-card-title>
            <q-card-section>
              <q-form @submit="handleUpdateManagerProfile">
                <q-input v-model="profileManager.fullName" label="Họ và tên" />
                <q-input v-model="profileManager.email" label="Email"
                :rules="[ val => !!val || 'Email không được để trống', validateEmail]" />
                <q-input v-model="profileManager.phoneNumber" label="Số điện thoại" />
                <div class="submit-button">
                  <q-btn type="submit" label="Lưu" color="primary" />
                </div>
              </q-form>
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="openUpdateEmployeeDialog">
        <q-card>
          <q-card-section>
            <q-card-title>
              <h4>Chỉnh sửa thông tin cá nhân</h4>
            </q-card-title>
            <q-card-section>
              <q-form @submit="handleUpdateEmployeeProfile">
                <q-input v-model="profileEmployee.fullName" label="Họ và tên" />
                <q-input v-model="profileEmployee.email" label="Email"
                :rules="[ val => !!val || 'Email không được để trống', validateEmail]" />
                <q-input v-model="profileEmployee.phoneNumber" label="Số điện thoại" />
                <div class="submit-button">
                  <q-btn type="submit" label="Lưu" color="primary" />
                </div>
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
const openUpdatePtDialog = ref(false);
const openUpdatePasswordDialog = ref(false);
const openAddImageDialog = ref(false);
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const originalProfile = ref({}); // lưu trữ bản sao của profile ban đầu
const fileUploaded = ref([]);
const secure_urlList = ref([]);
const profileManager = ref({});
const openUpdateManagerDialog = ref(false);
const openUpdateEmployeeDialog = ref(false);
const profileEmployee = ref({});  

const $q = useQuasar();


onBeforeMount(async () => {
  try {
    if (role === 'pt') {
      const ptData = await ptsService.findByProfile(id);
      profilePt.value = ptData;
      originalProfile.value = JSON.parse(JSON.stringify(ptData)); // Lưu bản sao gốc
    }
    if (role === 'manager') {
      const managerData = await profilesService.getProfile(id);
      profileManager.value = managerData;
    }
    if (role === 'employee') {
      const employeeData = await profilesService.getProfile(id);
      profileEmployee.value = employeeData;
    }
  } catch (error) {
    console.log(error);
  }
});
const handleAddImageDialog = () => {
  openAddImageDialog.value = true;
};
const handleOpenUpdateDialog = () => {
  if (role === 'pt')
    openUpdatePtDialog.value = true;
  else if (role === 'manager') {
    openUpdateManagerDialog.value = true;
  }
  else if (role === 'employee') {
    openUpdateEmployeeDialog.value = true;
  }
};
const handleOpenUpdatePasswordDialog = () => {
  openUpdatePasswordDialog.value = true;
};

const handleFileChange = (files) => {
  fileUploaded.value = files;
};

const handleUpdateEmployeeProfile = async () => {
  try {
    // validate not empty
    if (profileEmployee.value.fullName === '' || profileEmployee.value.email === '' || profileEmployee.value.phoneNumber === '') {
      $q.notify({ position: 'top', color: 'negative', message:'Vui lòng kiểm tra lại thông tin cập nhật' });
      return;
    }
    const updatedEmployeeProfile = {
      fullName: profileEmployee.value.fullName,
      email: profileEmployee.value.email,
      phoneNumber: profileEmployee.value.phoneNumber,
    }
    await profilesService.updatedProfile(id, updatedEmployeeProfile);
    openUpdateEmployeeDialog.value = false;
  }catch (error) {
    $q.notify({ position: 'top', color: 'negative', message: 'Vui lòng kiểm tra lại thông tin cập nhật' });
    console.log(error);
  }
}

const handleUpdateManagerProfile = async () => {
  try {
    // validate not empty
    if (profileManager.value.fullName === '' || profileManager.value.email === '' || profileManager.value.phoneNumber === '') {
      $q.notify({ position: 'top', color: 'negative', message: 'Vui lòng kiểm tra lại thông tin cập nhật' });
      return;
    }
    const updatedManagerProfile = {
      fullName: profileManager.value.fullName,
      email: profileManager.value.email,
      phoneNumber: profileManager.value.phoneNumber,
    };
    await profilesService.updatedProfile(id, updatedManagerProfile);
    openUpdateManagerDialog.value = false;
  } catch (error) {
    $q.notify({ position: 'top', color: 'negative', message: 'Vui lòng kiểm tra lại thông tin cập nhật' });
    console.log(error);
  }
};

const handleAddImage = async () => {
  try {
    secure_urlList.value = [];// reset danh sách ảnh
    for (var i = 0; i < fileUploaded.value.length; i++) {
      const formData = new FormData();
      formData.append("file", fileUploaded.value[i]);
      const fileRes = await uploadFileService.uploadFile(formData);
      secure_urlList.value.push(
        { imageUrl: fileRes.secure_url });
    }
    for (var i = 0; i < secure_urlList.value.length; i++) {
      const newImage = await ptImagesService.createImage(secure_urlList.value[i].imageUrl, profilePt.value.id);
      profilePt.value.images.push(newImage);
    }
    fileUploaded.value = [];
    openAddImageDialog.value = false;
  } catch (error) {
    console.log(error);
  }
}

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
    openUpdatePtDialog.value = false;
  } catch (error) {
    console.log(error);

  }
};
const handleUpdateProfile = async () => {
  try {
    // validate not empty
    if (profilePt.value.profile.fullName === '' || profilePt.value.profile.email === '' || profilePt.value.profile.phoneNumber === '') {
      $q.notify({ position: 'top', color: 'negative', message: 'Vui lòng kiểm tra lại thông tin cập nhật' });
      return;
    }
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
      openUpdatePtDialog.value = false;
      originalProfile.value = JSON.parse(JSON.stringify(profilePt.value)); // Cập nhật lại bản sao gốc
    } else {
      $q.notify({ position: 'top', message: 'Không có thay đổi nào để cập nhật' });


    }
  } catch (error) {
    $q.notify({ position: 'top', color: 'negative', message: 'Vui lòng kiểm tra lại thông tin cập nhật' });
    console.log(error);
  }
};
const handleUpdatePassword = async () => {
  try {
    // validate not empty
    if (oldPassword.value === '' || newPassword.value === '' || confirmPassword.value === '') {
      $q.notify({ position: 'top', color: 'negative', message: 'Vui lòng kiểm tra lại thông tin cập nhật' });
      return;
    }
    if (newPassword.value !== confirmPassword.value) {
      $q.notify({ position: 'top', color: 'negative', message: 'Mật khẩu xác nhận không khớp' });
      return;
    }
    if (newPassword.value.length < 6) {
      $q.notify({ position: 'top', color: 'negative', message: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return;
    }
    if (oldPassword.value === '') {
      $q.notify({ position: 'top', color: 'negative', message: 'Vui lòng nhập mật khẩu cũ' });
      return;
    }
    if (role === 'manager') {
      await profilesService.updatePassword(id, oldPassword.value, newPassword.value);
    } else if (role === 'pt') {
      await profilesService.updatePassword(profilePt.value.profile.id, oldPassword.value, newPassword.value);
    }
    else if (role === 'employee') {
      await profilesService.updatePassword(id, oldPassword.value, newPassword.value);
    }
    // after update password, clear the input fields
    oldPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';

    // await profilesService.updatePassword(profilePt.value.profile.id, oldPassword.value, newPassword.value);
    openUpdatePasswordDialog.value = false;
  } catch (error) {
    $q.notify({ position: 'top', color: 'negative', message: error.response.data.message })
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
// function validateEmail(email) {
//   const regex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

//   return regex.test(email);
// }
const validateEmail = (email) => {
  const regex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  
  return regex.test(email) || "Email không hợp lệ";
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

.add-icon {
  position: absolute;
  top: 60px;
  right: 10px;
  cursor: pointer;
}

.add-icon:hover {
  filter: grayscale(100%);

}

.delete-icon:hover {
  filter: grayscale(100%);
}

.carousel-container:hover .delete-icon .add-icon {
  display: block;
}

.profile-detail p {
  margin: 10px 0;
}

.submit-button {
  text-align: center;
  margin-top: 10px;
}
</style>
