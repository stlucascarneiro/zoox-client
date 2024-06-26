import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import BooksView from '../views/CustomerView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'books',
    component: BooksView
  },
  {
    path: '/history',
    name: 'history',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/HistoryView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
