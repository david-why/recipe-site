<script setup lang="ts">
import type { Recipe } from '~/shared/types'
import RecipeDurationsText from './text/RecipeDurationsText.vue'

defineProps<{
  recipe: Recipe
}>()
</script>

<template>
  <div class="card">
    <RouterLink :to="{ name: 'recipe', params: { recipeId: recipe.id } }"
      ><img class="card-img-top" :src="recipe.images[0]"
    /></RouterLink>
    <div class="card-body">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <div class="card-text">
        <p>
          <RecipeDurationsText :recipe="recipe" />
        </p>
      </div>
    </div>
  </div>
</template>
