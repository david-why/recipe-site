<script setup lang="ts">
import type { Recipe } from '~/shared/types'
import DurationText from './DurationText.vue'

defineProps<{ recipe: Recipe }>()
</script>

<template>
  <span v-if="recipe.active_time">
    <i class="bi bi-fork-knife"></i>
    <DurationText :time="recipe.active_time"></DurationText>
  </span>
  <template v-if="recipe.active_time && recipe.total_time"> · </template>
  <span v-if="recipe.total_time">
    <i class="bi bi-hourglass-split"></i>
    <DurationText :time="recipe.total_time"></DurationText>
  </span>
</template>
