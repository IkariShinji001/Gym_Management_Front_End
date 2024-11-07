<template>
  <div>
    <div class="header-btns-container">
      <div class="select-btns-container">
        <q-select
          standout="bg-orange-8 text-white"
          class="header-select-gender"
          v-model="selectedGender"
          :options="genderOptions"
          label="Giới tính"
          option-label="label"
        />

        <div class="cursor-pointer" style="width: 100px">
          <button class="write-email-btn" @click="showEmailWritingForm = true">
            <q-icon name="o_edit" size="30px" />
            <span class="button-text">Viết Email</span>
          </button>
        </div>
      </div>
      <div class="pagination-container">
        <div class="btn-check-desc" v-if="areAllCheckboxOnPageChecked">
          Chọn theo trang
        </div>
        <div class="btn-check-desc" v-if="areAllCheckboxChecked">
          Chọn tất cả
        </div>

        <button
          @click="checkAllCheckboxOnPage"
          :class="['btn-one-check', { checked: areAllCheckboxOnPageChecked }]"
        >
          <q-icon class="icon-one-check" name="check" size="28px" />
        </button>
        <button
          @click="checkAllCheckbox"
          :class="['btn-double-check', { checked: areAllCheckboxChecked }]"
        >
          <q-icon class="icon-double-check" name="done_all" size="28px" />
        </button>
        <q-pagination
          class="pagination"
          v-model="currentPage"
          :max="totalPages"
          input
          size="20px"
        />
      </div>
    </div>

    <div class="email-list-container">
      <ul class="email-list">
        <li class="email-list-header">
          <div class="col col-checkbox"></div>
          <div class="col col-email">Email</div>
          <div class="col col-name">Họ và tên</div>
          <div class="col col-gender">Giới tính</div>
        </li>
        <div class="email-list-body">
          <li v-for="(userInfo, index) in paginatedUsersList">
            <div class="checkbox-wrapper-18 col col-checkbox">
              <div class="round">
                <input
                  type="checkbox"
                  :id="'checkbox-' + index"
                  v-model="userInfo.checked"
                />
                <label :for="'checkbox-' + index"></label>
              </div>
            </div>
            <div class="col col-email">{{ userInfo.email }}</div>
            <div class="col col-name">{{ userInfo.fullName }}</div>
            <div class="col col-gender">
              {{ userInfo.gender ? "Nam" : "Nữ" }}
            </div>
          </li>
        </div>
      </ul>
    </div>
    <div
      v-if="showEmailWritingForm"
      class="q-pa-md email-writing-form-container"
      style="width: 500px"
    >
      <q-form @submit="sendEmail" class="q-gutter-md">
        <div class="header-email-form">
          <button @click="showEmailWritingForm = false">
            <q-icon size="20px" name="close" />
          </button>
        </div>

        <div class="input-email-form-container">
          <div class="title-email-form">Chủ đề:</div>
          <q-input
            hide-bottom-space
            dense
            class="input-email-form"
            v-model="emailPayload.subject"
          />
        </div>

        <div>
          <q-editor
            v-model="emailPayload.html"
            :definitions="{
              upload: {
                tip: 'Upload to cloud',
                icon: 'cloud_upload',
                label: 'Upload',
                handler: openFilePicker,
              },
            }"
            :toolbar="[
              ['bold', 'italic', 'strike', 'underline'],
              ['upload', 'save'],
            ]"
            min-height="5rem"
          />
          <input
            ref="fileInput"
            type="file"
            multiple
            @change="handleFileUpload"
            style="display: none"
          />
        </div>

        <div v-if="emailPayload.files">
          <div v-for="file in emailPayload.files">
            {{ file.name }}
          </div>
        </div>
        <!-- Hidden file input -->

        <div>
          <q-btn label="Gửi" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
import { computed, onBeforeMount, reactive, ref, watchEffect } from "vue";
import { useToast } from "vue-toastification";
import userService from "../services/user.service";
import mailService from "../services/mail.service";
export default {
  setup() {
    const toast = useToast();
    const dataRes = ref(null);
    const fileInput = ref(null);
    const showEmailWritingForm = ref(false);
    const areAllCheckboxOnPageChecked = ref(false);
    const areAllCheckboxChecked = ref(false);

    const searchQuery = ref("");
    const totalPages = ref(1);
    const currentPage = ref(1);
    const itemsPerPage = 8;

    const selectedCheckboxList = new Set();
    const userInfoList = ref([]);
    const emailList = ref([]);
    const filteredUsersByGenderList = ref([]);
    const paginatedUsersList = ref([]);
    const emailListSet = new Set();
    const genderOptions = ref([
      { label: "Tất cả", value: "" },
      { label: "Nam", value: true },
      { label: "Nữ", value: false },
    ]);
    const selectedGender = ref({ label: "Tất cả", value: "" });
    const emailPayload = reactive({
      recipients: [],
      from: {
        name: "4GYM",
        address: "hukhan013@gmail.com",
      },
      subject: "Welcome to 4GYM",
      html: "",
      files: [],
    });

    onBeforeMount(async () => {
      dataRes.value = await userService.getAllUserEmailPerPage(
        currentPage.value,
        itemsPerPage
      );

      totalPages.value = dataRes.value.meta.pageCount;
      // userInfoList.value = dataRes.value.data.map((user) => ({
      //   ...user,
      //   checked: false,
      // }));
    });

    watchEffect(async () => {
      areAllCheckboxOnPageChecked.value = false;

      if (selectedGender.value.value === "") {
        const userInfoRes = await userService.getAllUserEmailPerPage(
          currentPage.value,
          itemsPerPage
        );
        totalPages.value = userInfoRes.meta.pageCount;
        filteredUsersByGenderList.value = userInfoRes.data.map((user) => ({
          ...user,
          checked: false,
        }));
      } else {
        const userInfoRes = await userService.getAllUserEmailPerPageByGender(
          currentPage.value,
          itemsPerPage,
          selectedGender.value.value
        );
        totalPages.value = userInfoRes.meta.pageCount;
        filteredUsersByGenderList.value = userInfoRes.data.map((user) => ({
          ...user,
          checked: false,
        }));
      }
    });

    watchEffect(() => {
      paginatedUsersList.value = filteredUsersByGenderList.value;
    });

    function checkAllCheckboxOnPage() {
      areAllCheckboxOnPageChecked.value = !areAllCheckboxOnPageChecked.value;
      areAllCheckboxChecked.value = false;

      if (areAllCheckboxOnPageChecked.value) {
        paginatedUsersList.value.forEach((userInfo) => {
          userInfo.checked = true;
          // selectedCheckboxList.add(userInfo.email);
        });
      } else {
        paginatedUsersList.value.forEach((userInfo) => {
          userInfo.checked = false;
          // selectedCheckboxList.delete(userInfo.email);
        });
      }
    }

    function checkAllCheckbox() {
      areAllCheckboxChecked.value = !areAllCheckboxChecked.value;
      areAllCheckboxOnPageChecked.value = false;

      filteredUsersByGenderList.value.forEach((userInfo) => {
        userInfo.checked = areAllCheckboxChecked.value;
      });
    }

    function openFilePicker() {
      if (fileInput.value) {
        fileInput.value.click();
      } else {
        console.error("fileInput ref is not available");
      }
    }

    function handleFileUpload(event) {
      const files = event.target.files;

      if (files.length) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          emailPayload.files.push(file);
        }
      }
    }

    async function sendEmail() {
      if (areAllCheckboxChecked.value) {
        toast.success("Đã gửi mail cho tất cả người dùng");
        emailPayload.recipients.length = 0;
        const res = await mailService.sendAllMail(emailPayload);
      } else {
       
        emailPayload.recipients.length = 0;

        filteredUsersByGenderList.value.map((user) => {
          if (user.checked) {
            emailPayload.recipients.push(user.email);
          }
        });
        toast.success(`Đã gửi ${emailPayload.recipients.length} mail`);
        const res = await mailService.sendMail(emailPayload);
      }
    }
    return {
      searchQuery,
      selectedGender,
      currentPage,
      totalPages,
      showEmailWritingForm,
      emailPayload,
      fileInput,
      areAllCheckboxChecked,
      areAllCheckboxOnPageChecked,

      genderOptions,
      filteredUsersByGenderList,
      userInfoList,
      emailList,
      paginatedUsersList,
      sendEmail,
      checkAllCheckboxOnPage,
      checkAllCheckbox,

      openFilePicker,
      handleFileUpload,
    };
  },
};
</script>

<style scoped>
/* <========  CSS-Header-btns  =======> */
/* <========  CSS-Header-btns  =======> */

.header-btns-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 40px;
  justify-content: space-between;
}

.header-btns-container .pagination-container {
  margin-right: 30px;
  position: relative;
}

.header-btns-container .pagination-container .pagination {
  position: absolute;
  top: 0px;
  right: -8px;
}

.header-btns-container .pagination-container .btn-check-desc {
  position: absolute;
  top: -2px;
  right: 300px;
  background: rgb(106, 153, 255);
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 120px;
  padding: 0 0;
  height: 40px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}

/* <========  Header  =======> */
/* <========  CSS-BTN-CheckAll  =======> */

.header-btns-container .pagination-container .btn-one-check,
.btn-double-check {
  position: absolute;
  top: 0px;
  right: 245px;
  background: white;
  color: rgb(17, 92, 255);
  border: none;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 40px;
  padding: 0 0;
  height: 40px;
}
.header-btns-container .pagination-container .btn-double-check {
  right: 200px;
}

.header-btns-container .pagination-container .checked {
  background-color: rgb(17, 92, 255);
  color: white;
}
.header-btns-container .pagination-container .btn-one-check:hover {
  background: rgba(99, 148, 255, 0.3);
}

.header-btns-container .pagination-container .btn-double-check:hover {
  background: rgba(32, 102, 255, 0.5);
}

/* <========  Header  =======> */
/* <========  CSS-Select Gender =======> */
.header-btns-container .select-btns-container {
  display: flex;
}
.header-btns-container .header-select-gender {
  width: 200px;
  margin-right: 20px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}

.header-btns-container .write-email-btn {
  border: none;
  border-radius: 15px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--icon-color);
  cursor: pointer;
  width: 100px;
  height: 56px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}

.header-btns-container .write-email-btn:hover {
  width: 200px;
  margin-right: 10px;
  background: rgb(255, 153, 0);
  box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 2px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.1) 0px -3px 0px inset;
}

.write-email-btn .button-text {
  transition: opacity 1s ease;
  font-size: 16px;
  color: #fff;
}

.write-email-btn:hover .button-text {
  opacity: 1;
  transition-delay: 1s;
  display: inline;
}

/* <========  CSS-EMAIL-List  =======> */
/* <========  CSS-EMAIL-List  =======> */

.email-list .email-list-header {
  background: var(--table-bg);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.email-list li {
  list-style: none;
  border-radius: 2px;
  padding: 6px 15px;
  display: flex;
  margin-bottom: 5px;
  margin-right: 30px;
  border-bottom: 1px solid rgb(212, 212, 212);
  line-height: 25px;
}

.col {
  text-align: center;
  font-size: 16px;
  color: rgb(78, 78, 78);
}

.col-checkbox {
  flex-basis: 10%;
}

.col-email {
  flex-basis: 35%;
  text-align: start;
}

.col-name {
  flex-basis: 35%;
}

.col-gender {
  flex-basis: 20%;
}

.email-list-header .col {
  font-size: 19px;
  font-weight: 500;
  color: white;
  margin: 10px 0;
}

/* <========  CSS-CheckBox  =======> */
/* <========  CSS-CheckBox  =======> */
.checkbox-wrapper-18 {
  display: flex;
  justify-content: center;
}

.checkbox-wrapper-18 .round {
  position: relative;
}

.checkbox-wrapper-18 .round label {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 2px;
  cursor: pointer;
  height: 18px;
  width: 18px;
  display: block;
}

.checkbox-wrapper-18 .round label:after {
  border: 2px solid #fff;
  border-top: none;
  border-right: none;
  content: "";
  height: 6px;
  position: absolute;
  left: 4px;
  opacity: 0;
  top: 5px;
  transform: rotate(-45deg);
  width: 10px;
}

.checkbox-wrapper-18 .round input[type="checkbox"] {
  visibility: hidden;
  display: none;
  opacity: 0;
}

.checkbox-wrapper-18 .round input[type="checkbox"]:checked + label {
  background-color: #5bc060;
  border-color: #5bc060;
}

.checkbox-wrapper-18 .round input[type="checkbox"]:checked + label:after {
  opacity: 1;
}

/* <========  CSS-Email-writing-form-container  =======> */
/* <========  CSS-Email-writing-form-container  =======> */
.email-writing-form-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  transform: none;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 999;
}

.email-writing-form-container .header-email-form button {
  border: none;
  background: none;
  cursor: pointer;
}

.email-writing-form-container .input-email-form-container {
  display: flex;
}
.email-writing-form-container .input-email-form-container .title-email-form {
  width: 60px;
  display: flex;
  align-items: center;
}

.email-writing-form-container .input-email-form-container .input-email-form {
  width: 100%;
}
</style>
