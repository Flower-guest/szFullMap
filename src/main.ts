import { createApp } from "vue";
import App from "./App.vue";
import route from "./router";
import "./router/permission";
import pinia from "./store";
import { Lazyload } from "vant";

import "uno.css";
import "./assets/index.css";
import "normalize-css/normalize.css";
import "vant/es/toast/style";
import "vant/es/dialog/style";
import "vant/es/notify/style";
import "vant/es/image-preview/style";

const app = createApp(App);

app.use(route).use(pinia).use(Lazyload).mount("#app");
