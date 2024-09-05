<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="layout text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-avatar size="100px" square>
          <img src="./7 honlam.png" />
        </q-avatar>
        <q-toolbar-title>Bờ Lốc</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class="drawer"
    >
      <q-scroll-area class="fit drawer">
        <q-list>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <router-link :to="menuItem.path" class="routerlink">
              <q-item clickable :active="menuItem.label === 'Outbox'">
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
              <q-separator :key="'sep' + index" v-if="menuItem.separator" />
            </router-link>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view :drawerOpen="leftDrawerOpen" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const leftDrawerOpen = ref(false);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      menuList: [
        {
          icon: "post_add",
          label: "Quản lý bài đăng",
          separator: false,
          path: "posts",
        },
        {
          icon: "style",
          label: "Quản lý tags",
          separator: false,
          path: "tags",
        },
      ],
    };
  },
};
</script>

<style scoped>
.layout {
  background: var(--layout-header-bg);
}
.drawer {
  background:var(--drawer-bg);
}
.routerlink {
  color: white;
  text-decoration: none;
  font-size: 18px;
  /* font-weight: bold; */
}
</style>
