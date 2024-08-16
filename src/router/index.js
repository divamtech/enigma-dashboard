import { createRouter, createWebHistory } from 'vue-router'
import Signin from '../views/Signin.vue'
import Signup from '../views/Signup.vue'
import baseRoutes from './baseRoutes.js'
import NodeExplorer from '../views/NodeExplorer.vue'
// import { useStore } from 'vuex'

const routes = [
  {
    path: '/',
    name: '/',
    redirect: '/Signin',
    meta: { requiresAuth: true },
    children: baseRoutes,
  },
  {
    path: '/Signin',
    name: 'Signin',
    component: Signin,
  },
  {
    path: '/Signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/node-explorer/:folderId?/:fileId?',
    name: 'Folders',
    component: NodeExplorer,
    props: true,
  },
  // {
  //   path: '/virtual-reality/:fileId',
  //   name: 'Virtual Reality',
  //   component: VirtualReality, // Replace with your component
  // },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
})

// router.beforeEach((to, from, next) => {
//   const store = useStore()
//   const authenticated = store.state.authenticated

//   try {
//     if (to.meta.requiresAuth && authenticated == false) {
//       next('/Signin')
//     } else {
//       next()
//     }
//   } catch (error) {
//     console.error('Router guard error:', error)
//     next('/Signin') // Redirect to a fallback route if there’s an error
//   }
// })
export default router
