<template>
  <div v-if="isLaptopView" class="page-container-laptopview">
    <div class="post-container-laptopview">
      <div class="logo-container-laptopview">
        <router-link class="routerlink-homepage" to="/"> GYM4 </router-link>

        <div class="created-at-laptopview">{{ postDetail.createdAt }}</div>
      </div>
      <div class="post-header-laptopview" :class="postDetail.headerClass">
        <div class="post-img-container-laptopview">
          <img
            class="post-img-laptopview"
            :src="postDetail.cover_image"
            @load="handlerAdjustImageSize($event, index)"
            :class="postDetail.imgClass"
          />
        </div>
        <div class="post-title-laptopview">{{ postDetail.title }}</div>
      </div>
      <div v-html="postDetail.content"></div>
    </div>
  </div>
  <div v-else class="page-container-phoneview">
    <div class="post-container-phoneview">
      <router-link class="routerlink-homepage" to="/"> GYM4 </router-link>

      <div class="create-at-phoneview">
        {{ postDetail.createdAt }}
      </div>
      <div class="post-header-phoneview">
        <div class="post-img-container-phoneview">
          <img class="post-img-phoneview" :src="postDetail.cover_image" />
        </div>
        <div class="post-title-phoneview">{{ postDetail.title }}</div>
      </div>
      <div class="post-content-phoneview" v-html="postDetail.content"></div>
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
    const isLaptopView = ref(window.innerWidth >= 1024);
    const postDetail = ref({});

    function handleResizeWindowWidth() {
      isLaptopView.value = window.innerWidth >= 1024;
    }
    window.addEventListener("resize", handleResizeWindowWidth);
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

      isLaptopView,

      handlerAdjustImageSize,
    };
  },
};
</script>

<style scoped>
/* STYLE FOR LAPTOP */
/* STYLE FOR LAPTOP */
.page-container-laptopview {
  display: flex;
  justify-content: center;

  .post-container-laptopview {
    margin-top: 20px;
    flex-basis: 65%;

    .logo-container-laptopview {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;

      .routerlink-homepage {
        text-decoration: none;
        color: rgba(60, 60, 60, 0.9);
        font-size: 50px;
        font-weight: bold;
      }

      .created-at-laptopview {
        display: flex;
        align-items: end;
        font-size: 20px;
        font-style: italic;
        font-weight: 400;
        color: rgba(60, 60, 60, 0.7);
      }
    }

    .post-header-laptopview {
      .post-img-container-laptopview {
        flex-basis: 40%;

        .post-img-laptopview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .tall-img {
          height: 400px;
        }
      }
      .post-title-laptopview {
        margin-top: 20px;
        flex-basis: 60%;
        font-size: 45px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.page-container-laptopview .post-container-laptopview .flex-header {
  display: flex;
  gap: 20px;
}

/* STYLE FOR PHONE */
/* STYLE FOR PHONE */
.page-container-phoneview {
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;

  .post-container-phoneview {
    margin-top: 10px;
    width: 100%;
  }
}

.page-container-phoneview .post-container-phoneview {
  .routerlink-homepage {
    text-decoration: none;
    color: rgba(60, 60, 60, 0.8);
    text-align: center;
    font-size: 25px;
    font-weight: bold;
    text-align: center;
    padding: 10px 0;
  }
  .create-at-phoneview {
    font-size: 14px;
    font-style: italic;
    text-align: right;
    margin-right: 15px;
    margin-bottom: 10px;
  }
}

.page-container-phoneview .post-container-phoneview .post-header-phoneview {
  text-align: start;
  .post-img-container-phoneview {
    width: 100%;

    .post-img-phoneview {
      width: 100%;
      height: auto;
      object-fit: cover;
    }
  }
  .post-title-phoneview {
    font-size: 24px;
    font-weight: bold;
    padding: 20px;
  }
}

.page-container-phoneview .post-container-phoneview {
  .post-content-phoneview {
    padding: 0 20px;
    width: 100%;
    text-align: start;
  }

  .post-content-phoneview ::v-deep img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }
}
</style>
