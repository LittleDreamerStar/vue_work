import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/LoginView.vue'
import SingUpView from '../views/SingUpView.vue'
import TodoListView from '../views/ToDoListView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: SingUpView
    },
    {
      path: '/todoList',
      name: 'todoList',
      component: TodoListView
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView }
  ]
})

export default router
