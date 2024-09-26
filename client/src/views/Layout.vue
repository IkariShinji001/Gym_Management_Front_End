<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal elevated class="footer">
      <q-toolbar>
        <q-toolbar-title class="tool-bar">

          <div>
            <router-link to="/qr-code">
              <q-icon name=" qr_code_scanner" class="icons"></q-icon>
            </router-link>
          </div>
          <div>
            <router-link to="/fitness-package-type-service">
              <q-icon name="fitness_center" class="icons"></q-icon>
            </router-link>
          </div>
          <div>
            <router-link to="/">
              <q-icon name="home" class="icons"></q-icon>
            </router-link>
          </div>
          <div>
            <q-icon name="schedule" class="icons"></q-icon>
          </div>
          <div>
            <router-link to="/users">
              <q-icon name="account_circle" class="icons"></q-icon>
            </router-link>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<style scoped>
.footer {
  background-color: #2b2d42;
  position: fixed;
  bottom: 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.tool-bar {
  display: flex;
  height: 60px;
  align-items: center;
  justify-content: center;
}

.icons {
  margin: 0 15px;
  font-size: 35px;
}

a {
  color: white;
}
</style>