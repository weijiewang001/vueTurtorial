import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VeeValidatePlugin from './includes/validation';
import { auth } from './includes/firebase';
import Icon from './directives/icon';
import i18n from './includes/i18n';
import { visualizer } from "rollup-plugin-visualizer";

import GlobalComponents from "./includes/_globals";

// 路由切换加载进度条导入
import progressBar from "./includes/progress-bar";

import './assets/tailwind.css';
import './assets/main.css';
import "nprogress/nprogress.css";

let app;

progressBar(router);

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App).use(i18n);

    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(GlobalComponents);
    app.directive('icon',Icon);

    app.mount('#app');
  }
});
