// FILE: main.js

import { createApp } from "vue";
import { Quasar, Notify } from "quasar";
import router from "./router/index";
// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from "./App.vue";

const myApp = createApp(App);

myApp.use(Quasar, {
  plugins: { Notify }, // import Quasar plugins and add here
});

myApp.use(router);

myApp.mount("#app");
