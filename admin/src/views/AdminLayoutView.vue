<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="layout text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawerHandler" />

        <q-btn flat no-caps no-wrap @click="redirectToBlogsHandler">
          <q-avatar size="40px">
            <img src="./4 raica .jpg" />
          </q-avatar>
          <q-toolbar-title shrink class="text-weight-bold">
            4GYM
          </q-toolbar-title>
        </q-btn>

        <q-space />

        <q-btn dense flat no-wrap>
          <q-avatar rounded size="35px">
            <q-icon name="tag_faces" color="white" size="30px" />
          </q-avatar>
          <q-icon name="arrow_drop_down" size="25px" />

          <q-menu auto-close>
            <q-list dense>
              <q-item
                clickable
                class="GL__menu-link"
                @click="redirectToYourProfile"
              >
                <q-item-section> Trang cá nhân </q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable class="GL__menu-link" @click="logoutHandler">
                <q-item-section> Đăng xuất </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
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
        <q-list style="margin-top: 10px">
          <template v-for="(menuItem, index) in menuList" :key="index">
            <router-link
              v-if="
                menuItem.label !== 'Thống kê doanh thu gói tập' &&
                menuItem.label !== 'Quản lý nhân sự' &&
                menuItem.role.includes(role)
              "
              :to="basePath + menuItem.path"
              class="routerlink"
            >
              <q-item
                clickable
                :class="{ 'separator-true': menuItem.separator }"
              >
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
            </router-link>

            <div
              v-else-if="
                menuItem.label === 'Quản lý nhân sự' &&
                menuItem.role.includes(role)
              "
              class="routerlink-dropdown-container"
            >
              <q-item :class="{ 'separator-true': menuItem.separator }">
                <q-item-section avatar style="margin: 0 0">
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  <q-btn-dropdown
                    class="routerlink-dropdown-list"
                    unelevated
                    style="margin-left: -16px; width: fit-content"
                    label="Quản lý nhân sự"
                    no-caps
                  >
                    <q-list>
                      <q-item
                        clickable
                        v-close-popup
                        to="/admins/employees"
                        class="routerlink-dropdown-item"
                      >
                        <q-item-section>
                          <q-item-label>Nhân viên</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item
                        clickable
                        v-close-popup
                        to="/admins/pts"
                        class="routerlink-dropdown-item"
                      >
                        <q-item-section>
                          <q-item-label>Pt</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </q-item-section>
              </q-item>
            </div>

            <div
              v-else-if="
                menuItem.label === 'Thống kê doanh thu gói tập' &&
                menuItem.role.includes(role)
              "
              class="routerlink-dropdown-container"
            >
              <q-item :class="{ 'separator-true': menuItem.separator }">
                <q-item-section avatar style="margin: 0 0">
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section style="margin-left: -20px">
                  <q-btn-dropdown
                    unelevated
                    class="routerlink-dropdown-list"
                    no-caps
                  >
                    <template v-slot:label>
                      <div class="text-center">
                        Thống kê doanh thu <br />
                        gói tập
                      </div>
                    </template>
                    <q-list>
                      <q-item
                        clickable
                        v-close-popup
                        to="/admins/count-maintenances"
                        class="routerlink-dropdown-item"
                      >
                        <q-item-section>
                          <q-item-label
                            >Số lần bảo trì của thiết bị trong năm</q-item-label
                          >
                        </q-item-section>
                      </q-item>

                      <q-item
                        clickable
                        v-close-popup
                        to="/admins/daily-bill-statistics"
                        class="routerlink-dropdown-item"
                      >
                        <q-item-section>
                          <q-item-label>doanh thu theo ngày</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        v-close-popup
                        to="/admins/yearly-bill-statistics"
                        class="routerlink-dropdown-item"
                      >
                        <q-item-section>
                          <q-item-label>doanh thu theo năm</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        v-close-popup
                        to="/admins/top-spent-users-statistics-in-month"
                        class="routerlink-dropdown-item"
                      >
                        <q-item-section>
                          <q-item-label
                            >Người mua gói tập nhiều nhất tháng
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        v-close-popup
                        to="/admins/top-purchased-packages-statistics-in-month"
                        class="routerlink-dropdown-item"
                      >
                        <q-item-section>
                          <q-item-label
                            >Gói tập được mua nhiều nhất tháng
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        v-close-popup
                        to="/admins/top-purchased-packages-statistics-in-year"
                        class="routerlink-dropdown-item"
                      >
                        <q-item-section>
                          <q-item-label
                            >Gói tập được mua nhiều nhất năm
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
import { useRouter } from "vue-router";

export default {
  setup() {
    const isLeftDrawerOpen = ref(false);
    const role = ref("");
    const basePath = ref("/admins");
    const router = useRouter();

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
        label: "Gói tập",
        separator: false,
        path: "/fitness-packages",
        role: ["manager", "employee"],
      },
      {
        icon: "handshake",
        label: "Gói PT",
        separator: true,
        path: "/pt-packages",
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
      console;
    });

    function toggleLeftDrawerHandler() {
      isLeftDrawerOpen.value = !isLeftDrawerOpen.value;
    }

    function redirectToBlogsHandler() {
      router.push("/admins/blogs");
    }
    function redirectToYourProfile() {
      router.push("/admins/profile");
    }

    function logoutHandler() {
      localStorage.clear();
      router.push("/login");
    }
    return {
      isLeftDrawerOpen,
      basePath,
      role,

      menuList,

      toggleLeftDrawerHandler,
      redirectToBlogsHandler,
      redirectToYourProfile,
      logoutHandler,
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

.routerlink,
.routerlink-dropdown-container {
  color: white;
  text-decoration: none;
  font-size: 18px;
}
.routerlink-dropdown-container .routerlink-dropdown-list {
  color: white;
  text-decoration: none;
  font-size: 18px;
}
.routerlink-dropdown-item {
  color: var(--table-bg);
  font-size: 15px;
  font-weight: bold;
}

.separator-true {
  border-bottom: 2px solid white;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
</style>
