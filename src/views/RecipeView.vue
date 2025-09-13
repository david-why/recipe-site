<script setup lang="ts">
import LoadingIcon from '@/components/LoadingIcon.vue'
import DurationText from '@/components/text/DurationText.vue'
import { getRecipeById } from '@/service'
import { Carousel } from 'bootstrap'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { FullRecipe } from '~/shared/types'
const route = useRoute()

const recipeId = route.params.recipeId as string

// state

const carouselEl = ref<HTMLElement>()
const carousel = ref<Carousel>()

const recipe = ref<FullRecipe | null>(null)

// computed state

const displayRecipe = computed(() => {
  if (!recipe.value) return null
  return {
    ...recipe.value,
    difficulty: recipe.value.difficulty.charAt(0).toUpperCase() + recipe.value.difficulty.slice(1),
    ingredient_groups: recipe.value.ingredient_groups.map((ig) => ({
      ...ig,
      ingredients: ig.ingredients.map((i) => ({
        ...i,
        show_quantity: !!i.quantity_start,
        is_range: i.quantity_start !== i.quantity_end,
      })),
    })),
  }
})

// functions

const updateRecipe = async () => {
  recipe.value = await getRecipeById(recipeId)
}

// events

onMounted(async () => {
  updateRecipe()
  if (carouselEl.value) {
    carousel.value = new Carousel(carouselEl.value)
  }
})

onBeforeUnmount(() => {
  if (carousel.value) {
    carousel.value.dispose()
  }
})
</script>

<template>
  <div v-if="!recipe || !displayRecipe">
    <LoadingIcon />
  </div>
  <div v-else>
    <div class="row mb-4">
      <div class="col-12 col-md-5">
        <div class="carousel slide" id="recipeCarousel" ref="carouselEl">
          <div class="carousel-indicators">
            <button
              type="button"
              data-bs-target="#recipeCarousel"
              :data-bs-slide-to="index"
              :class="{ active: index === 0 }"
              aria-current="true"
              :aria-label="`Image ${index + 1}`"
              v-for="(url, index) in recipe.images"
              :key="url"
            ></button>
          </div>
          <div class="carousel-inner">
            <div
              class="carousel-item"
              :class="{ active: index === 0 }"
              v-for="(url, index) in recipe.images"
              :key="url"
            >
              <img :src="url" class="d-block w-100" :alt="`Image ${index + 1}`" />
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#recipeCarousel"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#recipeCarousel"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div class="col-12 col-md-7 my-auto">
        <h1>{{ recipe.title }}</h1>
        <ul class="list-unstyled d-flex flex-column gap-3 mt-4">
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
          <li><i class="bi bi-gear"></i> Difficulty: {{ displayRecipe.difficulty }}</li>
        </ul>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md-4">
        <!-- Ingredients card -->
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Ingredients</h5>
            <div class="card-text">
              <div v-for="group in displayRecipe.ingredient_groups" :key="group.id">
                <h6 v-if="group.title">{{ group.title }}</h6>
                <ul class="list-unstyled d-flex flex-column gap-2 mt-3">
                  <li v-for="ingredient in group.ingredients" :key="ingredient.id">
                    <div class="row">
                      <div class="col-8">{{ ingredient.name }}</div>
                      <div class="col-4 text-end text-secondary">
                        <template v-if="ingredient.show_quantity">
                          {{ ingredient.quantity_start
                          }}<template v-if="ingredient.is_range"
                            >-{{ ingredient.quantity_end }}</template
                          >
                          {{ ingredient.unit_name || '' }}
                        </template>
                        {{ ingredient.preparation || '' }}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <textarea
      class="form-control mt-5"
      style="height: 20rem"
      :value="JSON.stringify(recipe, null, 4)"
    ></textarea>
  </div>
</template>
