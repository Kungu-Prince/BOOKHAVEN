import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home/Home.vue'),
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/Products/Products.vue'),
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/Contact/Contact.vue'),
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/User/UserView.vue'),
  },
  {
    path: '/new',
    name: 'New-Book',
    component: () => import('../views/Products/NewProduct.vue'),
  },
  {
    path: '/book/:id',
    name: 'Book',
    component: () => import('../views/Products/Book.vue'),
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Signup/Signup.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/Login.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
