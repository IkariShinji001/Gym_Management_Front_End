<template>
  <div class="btn-container">
    <button class="btn-open-dialog" @click="handlerOpenDialog">
      <q-icon size="40px" name="add"></q-icon>
    </button>
  </div>
  <div class="post-list-container">
    <div class="post-item-container-column">
      <router-link
        class="post-item-router"
        :to="{ name: 'postDetails', params: { id: post.id } }"
        v-for="(post, index) in postList1"
        :key="index + post.title"
      >
        <div class="post-item-container">
          <img
            class="post-img"
            :src="post.cover_image"
            alt=""
            @load="handlerAdjustImageSize($event, index, 1)"
            :class="postList[index * 3].imgClass"
          />
          <div class="post-title">{{ post.title }}</div>
        </div>
      </router-link>
    </div>
    <div class="post-item-container-column column2">
      <router-link
        class="post-item-router"
        :to="{ name: 'postDetails', params: { id: post.id } }"
        v-for="(post, index) in postList2"
        :key="index + post.title"
      >
        <div class="post-item-container">
          <img
            class="post-img"
            :src="post.cover_image"
            alt=""
            @load="handlerAdjustImageSize($event, index, 2)"
            :class="postList[index * 3 + 1].imgClass"
          />
          <div class="post-title">{{ post.title }}</div>
        </div>
      </router-link>
    </div>
    <div class="post-item-container-column column3">
      <router-link
        class="post-item-router"
        :to="{ name: 'postDetails', params: { id: post.id } }"
        v-for="(post, index) in postList3"
        :key="index + post.title"
      >
        <div class="post-item-container">
          <img
            class="post-img"
            :src="post.cover_image"
            alt=""
            @load="handlerAdjustImageSize($event, index, 3)"
            :class="postList[index * 3 + 2].imgClass"
          />
          <div class="post-title">{{ post.title }}</div>
        </div>
      </router-link>
    </div>
  </div>

  <q-dialog v-model="isShowEditorDialog" @hide="handlerDestroyEditorDialog">
    <q-card>
      <q-card-section>
        <div>
          Chủ đề:
          <q-input v-model="post.title" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="upload-img-container">
          <div class="upload-img-lable">Ảnh bìa:</div>
          <div class="upload-img-div">
            <q-file color="orange" filled v-model="imgUploaded">
              <template v-slot:prepend>
                <q-icon name="cloud_upload" />
              </template>
            </q-file>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div v-if="isShowEditorDialog" ref="editor" class="quill-editor"></div>
      </q-card-section>
      <q-card-actions>
        <q-btn @click="handlerCreatePost" label="Submit" color="primary" />
        <q-btn @click="handlerCloseDialog" label="Close" color="secondary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import Quill from "quill";
import "quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module";
Quill.register("modules/imageResize", ImageResize);

import { ref, onBeforeMount, reactive, nextTick, computed } from "vue";
import blogService from "../services/blog.service";
import uploadFileService from "../services/uploadFile.service";

export default {
  name: "MyQuillEditor",
  setup() {
    const isShowEditorDialog = ref(false);
    const editor = ref(null);
    let quill = null;
    const imgUploaded = ref(null);

    const post = reactive({
      title: "",
      content: "",
      cover_image: null,
    });
    const postList = ref([]);

    const postList1 = computed(() =>
      postList.value.filter((_, index) => index % 3 === 0)
    );
    const postList2 = computed(() =>
      postList.value.filter((_, index) => index % 3 === 1)
    );
    const postList3 = computed(() =>
      postList.value.filter((_, index) => index % 3 === 2)
    );

    onBeforeMount(async () => {
      postList.value = await blogService.getAll();
    });

    const handlerAdjustImageSize = (event, index, listType) => {
      const img = event.target;
      const height = img.naturalHeight;

      let realIndex;
      if (listType === 1) {
        realIndex = index * 3;
      } else if (listType === 2) {
        realIndex = index * 3 + 1;
      } else {
        realIndex = index * 3 + 2;
      }

      if (height <= 500) {
        postList.value[realIndex].imgClass = "height-200-img";
      } else {
        postList.value[realIndex].imgClass = "height-400-img";
      }
    };

    const handlerOpenDialog = () => {
      console.log(postList1);
      console.log(postList2);
      isShowEditorDialog.value = true;
      nextTick(() => {
        quill = new Quill(editor.value, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, 4, 5] }],
              [{ size: ["small", false, "large", "huge"] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["image", "video"],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
            ],
            imageResize: {
              modules: ["Resize", "DisplaySize", "Toolbar"],
            },
          },
        });
      }, 100);
    };

    const handlerDestroyEditorDialog = () => {
      if (quill) {
        quill = null;
      }
    };

    async function handlerCreatePost() {
      try {
        const formData = new FormData();
        formData.append("file", imgUploaded.value);
        const res = await uploadFileService.uploadFile(formData);
        post.cover_image = res.secure_url;

        post.content = quill.root.innerHTML;

        const imgTags = post.content.match(
          /<img [^>]*src="data:image\/[^">]+"[^>]*>/g
        );
        if (imgTags && imgTags.length > 0) {
          for (let imgTag of imgTags) {
            const base64Data = imgTag.match(/src="(data:image\/[^">]+)"/)[1];

            const blob = await fetch(base64Data).then((res) => res.blob());

            const formData = new FormData();
            formData.append("file", blob);

            const res = await uploadFileService.uploadFile(formData);
            const secureUrl = res.secure_url;

            post.content = post.content.replace(base64Data, secureUrl);
          }
        }

        const createdPost = blogService.createPost(post);
        postList.value.push(createdPost);
        handlerCloseDialog();
      } catch (e) {
        console.error(e);
      }
    }

    const handlerCloseDialog = () => {
      isShowEditorDialog.value = false;
      handlerDestroyEditorDialog();
    };

    return {
      isShowEditorDialog,

      imgUploaded,
      post,

      postList,
      postList1,
      postList2,
      postList3,

      editor,

      handlerAdjustImageSize,
      handlerOpenDialog,
      handlerDestroyEditorDialog,
      handlerCreatePost,
      handlerCloseDialog,
    };
  },
};
</script>

<style scoped>
.btn-container .btn-open-dialog {
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  background: var(--icon-color);
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.5) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  z-index: 99;
}

.btn-container .btn-open-dialog:hover {
  width: 58px;
  height: 58px;
  background: rgb(255, 153, 0);
  box-shadow: rgba(170, 170, 170, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}

.upload-img-container {
  display: flex;
}
.upload-img-container .upload-img-lable {
  flex-basis: 20%;
}
.upload-img-container .upload-img-div {
  flex-basis: 70%;
}

.quill-editor {
  height: 400px;
}

/* <=== POST LIST ===>*/
/* <=== POST LIST ===>*/
.post-list-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.post-item-container-column {
  max-width: fit-content;
  flex: 1;
}
.post-list-container .column2 {
  margin-top: 25px;
}
.post-list-container .column3 {
  margin-top: 10px;
}
.post-item-container-column .post-item-router {
  text-decoration: none;
}

.post-item-container-column .post-item-container {
  max-width: fit-content;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s;
  background-color: rgba(220, 220, 220, 0.15);
  padding: 12px;
  border-radius: 8px;
}

.post-item-container-column .post-item-container:hover {
  transform: translateY(-10px);
}
.post-item-container .post-img {
  border-radius: 8px;
  margin: 0 0;
  width: 100%;
  object-fit: cover;
}
.post-item-container .height-200-img {
  height: 350px;
}
.post-item-container .height-400-img {
  height: 400px;
}
.post-item-container .post-title {
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 10px;
  text-decoration: none;
  color: black;
}
</style>
