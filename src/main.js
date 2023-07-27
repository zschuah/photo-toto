import { createApp } from "vue";
import App from "./App.vue";

import "bootstrap";
import "popper.js";
import "jquery";
import "bootstrap/dist/css/bootstrap.css";
import "charts.css";

import BaseModal from "./components/BaseModal.vue";

const app = createApp(App);

app.component("base-modal", BaseModal);

app.mount("#app");
