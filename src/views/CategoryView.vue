<script setup lang="ts">
import LoadingIcon from '@/components/LoadingIcon.vue'
import { getCategoryById, getCategoryRecipes } from '@/service'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Recipe, Category } from '~/shared/types'
const route = useRoute()

const categoryId = route.params.categoryId as string

// state

const category = ref<Category | null>(null)
const recipes = ref<Recipe[] | null>(null)

// functions

async function updateCategory() {
  const updatedCategory = await getCategoryById(categoryId)
  category.value = updatedCategory
}

async function updateCategoryRecipes() {
  const updatedRecipes = await getCategoryRecipes(categoryId)
  recipes.value = updatedRecipes
}

// events

onMounted(async () => {
  updateCategory()
  updateCategoryRecipes()
})
</script>

<template>
  <div v-if="!category">
    <LoadingIcon />
  </div>
  <div v-else>
    <h1 class="mb-4">{{ category.name }}</h1>
    <div v-if="!recipes">
      <LoadingIcon />
    </div>
    <div v-else>
      <div class="row g-3">
        <div class="col-6 col-md-4 col-lg-3" v-for="recipe in recipes" :key="recipe.id">
          <div class="card">
            <RouterLink :to="{ name: 'recipe', params: { recipeId: recipe.id } }"
              ><img class="card-img-top" :src="recipe.images[0]"
            /></RouterLink>
            <div class="card-body">
              <h5 class="card-title">{{ recipe.title }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
