import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/category/:categoryId',
      name: 'category',
      component: () => import('../views/CategoryView.vue'),
    },
    {
      path: '/recipe/:recipeId',
      name: 'recipe',
      component: () => import('../views/RecipeView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
    },
  ],
})

export default router
