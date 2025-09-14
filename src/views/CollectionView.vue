<script setup lang="ts">
import LoadingIcon from '@/components/LoadingIcon.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import { getCollectionById, getCollectionRecipes } from '@/service'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Recipe, Collection } from '~/shared/types'
const route = useRoute()

const collectionId = route.params.collectionId as string

// state

const collectionLoading = ref(true)
const collection = ref<Collection>({ id: '', title: '', description: '', image: '' })
const recipesLoading = ref(false)
const recipes = ref<{ recipes: Recipe[] }>({
  recipes: [
    {
      id: '',
      title: '',
      tags: [],
      active_time: 0,
      total_time: 0,
      difficulty: 'easy',
      serving_size: 0,
      serving_unit: '',
      images: [],
      additional_info: [],
      created_at: '',
    },
  ],
})

// functions

async function updateCollection() {
  collectionLoading.value = true
  try {
    collection.value = await getCollectionById(collectionId)
  } finally {
    collectionLoading.value = false
  }
}

async function updateRecipes() {
  recipesLoading.value = true
  try {
    recipes.value = { recipes: await getCollectionRecipes(collectionId) }
  } finally {
    recipesLoading.value = false
  }
}

// events

onMounted(() => {
  updateCollection()
  updateRecipes()
})
</script>

<template>
  <div v-if="!collection">
    <LoadingIcon />
  </div>
  <div v-else>
    <h1>{{ collection.title }}</h1>
    <p>{{ collection.description }}</p>
    <div v-if="recipesLoading">
      <LoadingIcon />
    </div>
    <div v-else>
      <div class="row g-3 mt-4 align-items-stretch">
        <div class="col-6 col-md-4 col-lg-3" v-for="recipe in recipes.recipes" :key="recipe.id">
          <RecipeCard class="h-100" :recipe="recipe" />
        </div>
      </div>
      <div v-if="recipes.recipes.length === 0">
        <p>No recipes in this collection.</p>
      </div>
    </div>
  </div>
</template>
