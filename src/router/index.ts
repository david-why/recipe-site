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
    {
      path: '/collections',
      name: 'collections',
      component: () => import('../views/CollectionsView.vue'),
    },
    {
      path: '/collection/:collectionId',
      name: 'collection',
      component: () => import('../views/CollectionView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
