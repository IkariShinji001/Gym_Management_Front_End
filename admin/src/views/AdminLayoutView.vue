<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="layout text-white">
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

    <q-drawer show-if-above v-model="isLeftDrawerOpen" side="left" bordered class="drawer">
      <q-scroll-area class="fit drawer">
        <q-list style="margin-top: 20px;">
          <template v-for="(menuItem, index) in menuList" :key="index">
            <router-link
              v-if="(menuItem.label !== 'Thống kê doanh thu gói tập') && (menuItem.label !== 'Quản lý nhân sự')"
              :to="basePath + menuItem.path" class="routerlink">
              <q-item clickable :class="{ 'separator-true': menuItem.separator }">
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
            </router-link>
            <div v-else-if="menuItem.label === 'Quản lý nhân sự'" class=" routerlink">
              <q-item :class="{ 'separator-true': menuItem.separator }">
                <q-item-section avatar style="margin: 0 0;">
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section style="margin-left: -25px;">
                  <q-btn-dropdown class="dropdown" unelevated>
                    <template v-slot:label>
                      <div class="text-center">
                        Quản lý nhân sự

                      </div>
                    </template>
                    <q-list>
                      <q-item clickable v-close-popup to="/admins/employees">
                        <q-item-section>
                          <q-item-label>Nhân viên</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item clickable v-close-popup to="/admins/pts">
                        <q-item-section>
                          <q-item-label>Pt</q-item-label>
                        </q-item-section>
                      </q-item>

                    </q-list>
                  </q-btn-dropdown>
                </q-item-section>
              </q-item>
            </div>
            <div v-else class="routerlink">
              <q-item :class="{ 'separator-true': menuItem.separator }">
                <q-item-section avatar style="margin: 0 0;">
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section style="margin-left: -25px;">
                  <q-btn-dropdown class="dropdown" unelevated>
                    <template v-slot:label>
                      <div class="text-center">
                        Thống kê doanh thu <br />
                        gói tập
                      </div>
                    </template>
                    <q-list>
                      <q-item clickable v-close-popup to="/admins/count-maintenances">
                        <q-item-section>
                          <q-item-label>Lịch bảo trì thiết bị</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item clickable v-close-popup to="/admins/daily-bill-statistics">
                        <q-item-section>
                          <q-item-label>doanh thu theo ngày</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup to="/admins/yearly-bill-statistics">
                        <q-item-section>
                          <q-item-label>doanh thu theo năm</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup to="/admins/top-spent-users-statistics-in-month">
                        <q-item-section>
                          <q-item-label>Người mua gói tập nhiều nhất tháng
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup to="/admins/top-purchased-packages-statistics-in-month">
                        <q-item-section>
                          <q-item-label>Gói tập được mua nhiều nhất tháng
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup to="/admins/top-purchased-packages-statistics-in-year">
                        <q-item-section>
                          <q-item-label>Gói tập được mua nhiều nhất tháng
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </q-item-section>
              </q-item>
            </div>
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
          path: "/maintenances",
          role: ["manager", "employee"],
        },
        {
          icon: "trolley",
          label: "Quản lý thiết bị",
          separator: false,
          path: "/facilities",
          role: ["manager", "employee"],
        },
        {
          icon: "fitness_center",
          label: "Gói dịch vụ",
          separator: true,
          path: "/services",
          role: ["manager", "employee"],
        },
        {
          icon: "shopping_bag",
          label: "Sản phẩm hỗ trợ",
          separator: false,
          path: "/supplement-products",
          role: ["manager"],
        },
        {
          icon: "groups",
          label: "Quản lý nhân sự",
          separator: false,
          path: "/employees",
          role: ["manager"],
        },
        {
          icon: "explore",
          label: "Quản lý chi nhánh",
          separator: false,
          path: "/branches",
          role: ["manager"],
        },
        {
          icon: "savings",
          label: "Thống kê doanh thu gói tập",
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

  .separator-true {
    border-bottom: 2px solid white;
    padding-bottom: 30px;
    margin-bottom: 30px;
  }
</style>
