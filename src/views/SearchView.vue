<script setup lang="ts">
import LoadingIcon from '@/components/LoadingIcon.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import SearchField from '@/components/SearchField.vue'
import { searchRecipes } from '@/service'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Recipe } from '~/shared/types'
const route = useRoute()
const router = useRouter()

const query = ref(route.query.q as string)

// state

const loading = ref(false)
const recipes = ref<Recipe[]>([])

// functions

async function updateRecipes() {
  recipes.value = []
  loading.value = true
  try {
    recipes.value = await searchRecipes(query.value)
  } finally {
    loading.value = false
  }
}

// events

async function onSearchSubmit() {
  await router.replace({ query: { q: query.value } })
}

watch(
  () => route.query.q,
  (newQ) => {
    query.value = newQ as string
    updateRecipes()
  },
  { deep: true },
)

onMounted(() => {
  updateRecipes()
})
</script>

<template>
  <SearchField @search="onSearchSubmit" v-model:query="query" />
  <div v-if="loading">
    <LoadingIcon />
  </div>
  <div v-else-if="recipes.length === 0">
    <p>No recipes found.</p>
  </div>
  <div v-else>
    <div class="row g-3 align-items-stretch">
      <div class="col-6 col-md-4 col-lg-3" v-for="recipe in recipes" :key="recipe.id">
        <RecipeCard class="h-100" :recipe="recipe" />
      </div>
    </div>
  </div>
</template>
