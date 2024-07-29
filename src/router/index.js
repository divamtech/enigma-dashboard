import { createRouter, createWebHistory } from "vue-router";
import Signin from "../views/Signin.vue";
import Signup from "../views/Signup.vue";
import baseRoutes from "./baseRoutes.js";
import { useStore } from "vuex";

const store = useStore();

const routes = [


  {
    path: "/",
    name: "/",
    redirect: "/Signin",
    meta: { requiresAuth: true },
    children:baseRoutes,
    
  },
  {
    path: "/Signin",
    name: "Signin",
    component: Signin,
  
  },
  {
    path: "/Signup",
    name: "Signup",
    component: Signup,
    
  },

  
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
 
  if (to.meta.requiresAuth && store.state.authenticated==false) {
    next('/Signin')
  } else {
    next()
  }

   
   
});
export default router;
