<template>
  <div v-if="isLaptop" class="post-list-container">
    <div class="post-item-container-column-laptop">
      <router-link
        class="post-item-router"
        :to="{ name: 'postDetails', params: { id: post.id } }"
        v-for="(post, index) in postList1"
        :key="index + post.title"
      >
        <div class="post-item-content-container-laptop">
          <img
            class="post-img-laptop"
            :src="post.cover_image"
            alt=""
            @load="handlerAdjustImageSize($event, index, 1)"
            :class="postList[index * 3]?.imgClass"
          />
          <div class="post-title">{{ post.title }}</div>
        </div>
      </router-link>
    </div>
    <div class="post-item-container-column-laptop column2">
      <router-link
        class="post-item-router"
        :to="{ name: 'postDetails', params: { id: post.id } }"
        v-for="(post, index) in postList2"
        :key="index + post.title"
      >
        <div class="post-item-content-container-laptop">
          <img
            class="post-img-laptop"
            :src="post.cover_image"
            alt=""
            @load="handlerAdjustImageSize($event, index, 2)"
            :class="postList[index * 3 + 1]?.imgClass"
          />
          <div class="post-title">{{ post.title }}</div>
        </div>
      </router-link>
    </div>
    <div class="post-item-container-column-laptop column3">
      <router-link
        class="post-item-router"
        :to="{ name: 'postDetails', params: { id: post.id } }"
        v-for="(post, index) in postList3"
        :key="index + post.title"
      >
        <div class="post-item-content-container-laptop">
          <img
            class="post-img-laptop"
            :src="post.cover_image"
            alt=""
            @load="handlerAdjustImageSize($event, index, 3)"
            :class="postList[index * 3 + 2]?.imgClass"
          />
          <div class="post-title">{{ post.title }}</div>
        </div>
      </router-link>
    </div>
  </div>

  <div v-else class="post-list-container">
    <router-link
      class="post-item-router"
      :to="{ name: 'postDetails', params: { id: post.id } }"
      v-for="(post, index) in postList"
      :key="index + post.title"
    >
      <div class="post-item-content-container">
        <img
          class="post-img"
          :src="post.cover_image"
          alt=""
          @load="handlerAdjustImageSize($event, index)"
          :class="postList[index]?.imgClass"
        />
        <div class="post-title">{{ post.title }}</div>
      </div>
      <chatbotcom />
    </router-link>
  </div>
</template>

<script>
import { ref, onBeforeMount, computed } from "vue";
import blogService from "../../../admin/src/services/blog.service";
import chatbotcom from '../components/chatbotcom.vue';

export default {
  components: { chatbotcom },
  setup() {
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

    const isLaptop = ref(window.innerWidth >= 1024);

    const handleResize = () => {
      isLaptop.value = window.innerWidth >= 1024;
    };

    window.addEventListener("resize", handleResize);

    onBeforeMount(async () => {
      postList.value = await blogService.getAll();
    });

    const handlerAdjustImageSize = (event, index, listType = null) => {
      const img = event.target;
      const height = img.naturalHeight;

      let realIndex;
      if (listType === 1) {
        realIndex = index * 3;
      } else if (listType === 2) {
        realIndex = index * 3 + 1;
      } else if (listType === 3) {
        realIndex = index * 3 + 2;
      } else {
        realIndex = index;
      }

      if (height <= 500) {
        postList.value[realIndex].imgClass = "height-200-img";
      } else {
        postList.value[realIndex].imgClass = "height-400-img";
      }
    };

    return {
      postList,
      postList1,
      postList2,
      postList3,
      isLaptop,
      handlerAdjustImageSize,
    };
  },
};
</script>

<style scoped>
/* Styles for All*/
.post-list-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 10px;
}
.post-item-router {
  text-decoration: none;
  flex-basis: 100%;
}
.post-title {
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 10px;
  color: black;
}

/* Styles for PHONE*/
.post-item-content-container {
  width: 100%;
  margin-top: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  background-color: rgba(214, 214, 214, 0.15);
  padding: 12px;
  border-radius: 8px;
}
.post-item-container-column {
  max-width: fit-content;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s;
  background-color: rgba(220, 220, 220, 0.15);
  padding: 12px;
  border-radius: 8px;
}
.post-img {
  border-radius: 8px;
  width: 100%;
  object-fit: cover;
  height: auto;
}

/* ===== Style for Laptop */
.post-list-container .post-item-container-column-laptop {
  max-width: fit-content;
  flex: 1;
}
.post-list-container .post-item-container-column-laptop .post-item-router {
  text-decoration: none;
}
.post-list-container
  .post-item-container-column-laptop
  .post-item-router
  .column2 {
  margin-top: 25px;
}
.post-list-container
  .post-item-container-column-laptop
  .post-item-router
  .column3 {
  margin-top: 10px;
}

.post-item-container-column-laptop .post-item-content-container-laptop {
  max-width: fit-content;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s;
  background-color: rgba(220, 220, 220, 0.15);
  padding: 12px;
  border-radius: 8px;
}

.post-item-container-column-laptop .post-item-content-container-laptop:hover {
  transform: translateY(-10px);
}
.post-item-content-container-laptop .post-img-laptop {
  border-radius: 8px;
  margin: 0 0;
  width: 100%;
  object-fit: cover;
}
.post-item-content-container-laptop .height-200-img {
  height: 350px;
}
.post-item-content-container-laptop .height-400-img {
  height: 400px;
}

/* Laptop layout */
@media (min-width: 1024px) {
  .post-item-container-column-laptop {
    flex: 1;
    max-width: fit-content;
  }
  .column2 {
    margin-top: 25px;
  }
  .column3 {
    margin-top: 10px;
  }
}

/* Mobile layout */
@media (max-width: 1023px) {
  .post-item-router {
    flex-basis: 100%;
  }
}
</style>
