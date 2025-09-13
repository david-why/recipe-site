<script setup lang="ts">
import type { Collection } from '~/shared/types'

withDefaults(
  defineProps<{
    collection: Collection
    hideDescription?: boolean
  }>(),
  {
    hideDescription: false,
  },
)

const emit = defineEmits<{
  (e: 'click'): void
}>()

// events

function onClick() {
  emit('click')
}
</script>

<template>
  <div class="card">
    <img
      class="card-img-top"
      role="button"
      :src="collection.image"
      :alt="collection.title"
      @click="onClick"
      v-if="collection.image"
    />
    <img
      class="card-img-top"
      role="button"
      src="@/assets/placeholder.png"
      :alt="collection.title"
      @click="onClick"
      v-else
    />
    <div class="card-body">
      <h5 class="card-title">{{ collection.title }}</h5>
      <p class="card-text" v-if="!hideDescription">{{ collection.description }}</p>
    </div>
  </div>
</template>
