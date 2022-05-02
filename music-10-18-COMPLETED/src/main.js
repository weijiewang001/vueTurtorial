import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VeeValidatePlugin from './includes/validation';
import { auth } from './assets/tailwind.css';
import './assets/main.css';
import './includes/firebase';


let app;

//callback function
//check if the user is authenticated when the application starts/initialise.
auth.onAuthStateChanaged(()=> {
    //check if the app has been initialized
    if (!app){
        app = createApp(App);

        app.use(store);
        app.use(router);
        app.use(VeeValidatePlugin);

        app.mount('#app');
    }
});


