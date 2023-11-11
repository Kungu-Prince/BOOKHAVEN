import './assets/sass/index.scss'
import './assets/js/firebase.js'
import { updateGlobalOptions, toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from './store/store';

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(updateGlobalOptions({
  autoClose: 2500,
  position: toast.POSITION.TOP_CENTER,
  transition: toast.TRANSITIONS.SLIDE,
  hideProgressBar: true,
}))
// app.component('EasyDataTable', Vue3EasyDataTable);

router.isReady().then(() => {
  app.mount("#app");
});

