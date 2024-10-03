<template>
  <div class="page-container">
    <div class="post-container">
      <div class="created-at">{{ postDetail.createdAt }}</div>
      <div class="post-header" :class="postDetail.headerClass">
        <div class="post-img-container">
          <img
            class="post-img"
            :src="postDetail.cover_image"
            @load="handlerAdjustImageSize($event, index)"
            :class="postDetail.imgClass"
          />
        </div>
        <div class="title">{{ postDetail.title }}</div>
      </div>
      <div v-html="postDetail.content"></div>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import blogService from "../services/blog.service";

export default {
  setup() {
    const route = useRoute();
    const postId = route.params.id;
    const postDetail = ref({});

    onBeforeMount(async () => {
      try {
        postDetail.value = await blogService.getOne(postId);
        console.log(postDetail.value);
      } catch (e) {
        console.error(e);
      }
    });

    function handlerAdjustImageSize(event) {
      const image = event.target;
      const height = image.naturalHeight;
      const width = image.naturalWidth;

      if (height > width && height > 400) {
        postDetail.value.imgClass = "tall-img";
        postDetail.value.headerClass = "flex-header";
      } else if (height < 500) {
        postDetail.value.imgClass = "small-img";
        postDetail.value.headerClass = "";
      } else {
        postDetail.value.imgClass = "large-img";
        postDetail.value.headerClass = "";
      }
    }

    return {
      postDetail,

      handlerAdjustImageSize,
    };
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
}
.page-container .post-container {
  flex-basis: 60%;
}
.page-container .post-container .flex-header {
  display: flex;
  gap: 20px;
}

.page-container .post-container .created-at {
  font-size: 20px;
  font-style: italic;
  font-weight: 400;
  display: flex;
  justify-content: end;
  margin-right: 20px;
}

.page-container .post-container .title {
  flex-basis: 60%;
  font-size: 45px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-container .post-container .post-img-container {
  flex-basis: 40%;
}
.page-container .post-container .post-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.page-container .post-container .tall-img {
  height: 400px ;
}
</style>
