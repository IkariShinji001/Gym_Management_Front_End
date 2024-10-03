<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="layout text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawerHandler" />

        <q-btn flat no-caps no-wrap>
          <q-avatar size="40px">
            <img src="./7 honlam.png" />
          </q-avatar>
          <q-toolbar-title shrink class="text-weight-bold">
            4GYM
          </q-toolbar-title>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="isLeftDrawerOpen"
      side="left"
      bordered
      class="drawer"
    >
      <q-scroll-area class="fit drawer">
        <q-list>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <router-link :to="basePath + menuItem.path" class="routerlink">
              <q-item
                clickable
                :active="menuItem.label === 'Outbox'"
                :class="{ 'separator-true': menuItem.separator }"
              >
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
              <!-- <q-separator :key="'sep' + index" v-if="menuItem.separator" /> -->
            </router-link>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onBeforeMount } from "vue";

export default {
  setup() {
    const isLeftDrawerOpen = ref(false);
    const role = ref("");
    const basePath = ref("/admins");
    const menuList = ref([
      {
        icon: "mail",
        label: "Gửi mail",
        separator: false,
        path: "/emails",
        role: ["manager", "employee"],
      },
      {
        icon: "construction",
        label: "Bảo trì thiết bị",
        separator: false,
        path: "",
        role: ["manager", "employee"],
      },

      {
        icon: "fitness_center",
        label: "Gói dịch vụ",
        separator: false ,
        path: "",
        role: ["manager", "employee"],
      },
      {
        icon: "shopping_bag",
        label: "Sản phẩm hỗ trợ",
        separator: true,
        path: "",
        role: ["manager"],
      },
      {
        icon: "groups",
        label: "Quản lý nhân sự",
        separator: false,
        path: "",
        role: ["manager"],
      },
      {
        icon: "savings",
        label: "Doanh thu",
        separator: false,
        path: "",
        role: ["manager"],
      },
    ]);

    onBeforeMount(() => {
      role.value = localStorage.getItem("role");
      // console.log(role.value);
    });

    function toggleLeftDrawerHandler() {
      isLeftDrawerOpen.value = !isLeftDrawerOpen.value;
    }

    return {
      isLeftDrawerOpen,
      basePath,

      menuList,

      toggleLeftDrawerHandler,
    };
  },
};
</script>

<style scoped>
.layout {
  padding: 6px;
  background: var(--layout-header-bg);
}
.drawer {
  background: var(--drawer-bg);
}
.routerlink {
  color: white;
  text-decoration: none;
  font-size: 18px;
}

.separator-true{
  border-bottom: 2px solid white;
  padding-bottom: 20px;
}
</style>
