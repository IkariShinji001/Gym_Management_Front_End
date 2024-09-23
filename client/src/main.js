// FILE: main.js

import { createApp } from "vue";
import { Quasar, Loading, Dialog } from "quasar";

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from "./App.vue";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import router from "./router";

const myApp = createApp(App);

myApp
  .use(Quasar, {
    plugins: {
      Loading,
      Dialog,
    }, // import Quasar plugins and add here
  })
  .use(router)
  .use(Toast);

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount("#app");
