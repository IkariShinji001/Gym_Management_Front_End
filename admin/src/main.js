// FILE: main.js

import { createApp } from "vue";
import { Quasar } from "quasar";
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"
// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from "./App.vue";
import router from "./router/index";

const options = {
  timeout: 3000,
};

const myApp = createApp(App);

myApp.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});

myApp.use(router)
myApp.use(Toast, options)


// Assumes you have a <div id="app"></div> in your index.html
myApp.mount("#app");
