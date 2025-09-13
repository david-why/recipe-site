<script setup lang="ts">
import LoadingIcon from '@/components/LoadingIcon.vue'
import { getCategoryById } from '@/service'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Category } from '~/shared/types'
const route = useRoute()

const categoryId = route.params.categoryId as string

// state

const category = ref<Category | null>(null)

// functions

async function updateCategory() {
  if (!categoryId) return
  const updatedCategory = await getCategoryById(categoryId)
  category.value = updatedCategory
}

// events

onMounted(async () => {
  await updateCategory()
})
</script>

<template>
  <div v-if="!category">
    <LoadingIcon />
  </div>
  <div v-else>
    <h2>{{ category.name }}</h2>
  </div>
</template>
