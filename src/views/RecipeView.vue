<script setup lang="ts">
import LoadingIcon from '@/components/LoadingIcon.vue'
import DurationText from '@/components/text/DurationText.vue'
import RecipeDurationsText from '@/components/text/RecipeDurationsText.vue'
import { getRecipeById } from '@/service'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Recipe } from '~/shared/types'
const route = useRoute()

const recipeId = route.params.recipeId as string

// state

const recipe = ref<Recipe | null>(null)

// functions

const updateRecipe = async () => {
  recipe.value = await getRecipeById(recipeId)
}

// events

onMounted(async () => {
  updateRecipe()
})
</script>

<template>
  <div v-if="!recipe">
    <LoadingIcon />
  </div>
  <div v-else>
    <div class="row">
      <div class="col-12 col-lg-6">
        <img class="img-fluid rounded" :src="recipe.images[0]" />
      </div>
      <div class="col-12 col-lg-6">
        <h1>{{ recipe.title }}</h1>
        <ul class="list-unstyled d-flex flex-column gap-2 mt-4">
          <li v-if="recipe.active_time">
            <i class="bi bi-fork-knife"></i> Preparation time:
            <DurationText :time="recipe.active_time" />
          </li>
          <li v-if="recipe.total_time">
            <i class="bi bi-hourglass-split"></i> Total time:
            <DurationText :time="recipe.total_time" />
          </li>
          <li>
            <i class="bi bi-egg-fried"></i> {{ recipe.serving_size }} {{ recipe.serving_unit }}
          </li>
        </ul>
      </div>
    </div>

    <!-- <textarea
      class="form-control"
      style="height: 20rem"
      :value="JSON.stringify(recipe, null, 4)"
    ></textarea> -->
  </div>
</template>
