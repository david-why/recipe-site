<script setup lang="ts">
import SearchField from '@/components/SearchField.vue'
import { getRecipes } from '@/service'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Recipe } from '../../shared/types'
const router = useRouter()

// state
const loadingRecentRecipes = ref(false)
const recentRecipes = ref<Recipe[]>([])

// functions

async function updateRecentRecipes() {
  loadingRecentRecipes.value = true
  try {
    recentRecipes.value = await getRecipes()
    console.log(recentRecipes.value)
  } finally {
    loadingRecentRecipes.value = false
  }
}

// events

function onSearchSubmit(query: string) {
  router.push({ name: 'search', query: { q: query } })
}

onMounted(async () => {
  updateRecentRecipes()
})
</script>

<template>
  <div>
    <SearchField @submit="onSearchSubmit" />
    <h3>Newest recipes</h3>
  </div>
</template>
