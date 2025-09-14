<script setup lang="ts">
import LoadingIcon from '@/components/LoadingIcon.vue'
import DurationText from '@/components/text/DurationText.vue'
import { getRecipeById } from '@/service'
import { strip } from '@/utils'
import { Carousel } from 'bootstrap'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { FullRecipe } from '~/shared/types'
const route = useRoute()

const recipeId = route.params.recipeId as string

const NUTRITION_TYPES: Record<string, string> = {
  kJ: 'Energy',
  kcal: 'Energy (kcal)',
  protein: 'Proteins',
  carb2: 'Carbohydrates',
  fat: 'Fats',
  saturatedFat: 'Saturated Fats',
  dietaryFibre: 'Dietary Fibre',
  sodium: 'Sodium',
}

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
        preparation: strip(i.preparation, '，, '),
        show_quantity: !!i.quantity_start,
        is_range: i.quantity_start !== i.quantity_end,
      })),
    })),
    nutrition_groups: recipe.value.nutrition_groups.map((ng) => ({
      ...ng,
      nutritions: ng.nutritions.map((n) => ({
        ...n,
        type: NUTRITION_TYPES[n.type] ?? n.type,
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
    <div class="row mb-2 mb-md-4">
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
          <div class="carousel-inner rounded">
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
      <div class="col-12 col-md-7 mt-4 my-md-auto">
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
      <!-- Info sidebar -->
      <div class="col-12 col-lg-4">
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
                      <div class="col-8">
                        {{ ingredient.name
                        }}<template v-if="ingredient.preparation"
                          ><br /><small class="text-secondary">{{
                            ingredient.preparation
                          }}</small></template
                        >
                      </div>
                      <div class="col-4 text-end text-secondary">
                        <template v-if="ingredient.show_quantity">
                          {{ ingredient.quantity_start
                          }}<template v-if="ingredient.is_range"
                            >-{{ ingredient.quantity_end }}</template
                          >
                          {{ ingredient.unit_name || '' }}
                        </template>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Dietary info card -->
        <div class="card mb-4" v-for="group in displayRecipe.nutrition_groups" :key="group.id">
          <div class="card-body">
            <h5 class="card-title">
              Nutritions
              <small class="text-secondary fw-normal ms-3"
                >per {{ group.quantity }} {{ group.unit }}</small
              >
            </h5>
            <ul class="list-unstyled d-flex flex-column gap-2 mt-3">
              <li v-for="nutrition in group.nutritions" :key="nutrition.type">
                <div class="row">
                  <div class="col-8">{{ nutrition.type }}</div>
                  <div class="col-4 text-end text-secondary">
                    {{ nutrition.number }} {{ nutrition.unit }}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="col-12 col-lg-8">
        <!-- Steps -->
        <div class="card mb-4" v-for="group in displayRecipe.step_groups" :key="group.id">
          <div class="card-body">
            <h5 class="card-title">{{ group.title || 'Preparation Steps' }}</h5>
            <ol>
              <li class="mb-2" v-for="step in group.steps" :key="step.text" v-html="step.text"></li>
            </ol>
          </div>
        </div>

        <!-- Tips card -->
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Tips</h5>
            <ul>
              <li class="mt-1" v-for="tip in displayRecipe.additional_info" :key="tip">
                {{ tip }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Category list -->
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Categories</h5>
            <div class="card-text">
              <ul class="list-group list-group-flush">
                <li
                  class="list-group-item"
                  v-for="category in recipe.categories"
                  :key="category.id"
                >
                  <RouterLink :to="{ name: 'category', params: { categoryId: category.id } }">
                    {{ category.name }}</RouterLink
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(nobr) {
  padding-inline-start: 0.3em;
  padding-inline-end: 0.3em;
  font-weight: bold;
}
</style>
