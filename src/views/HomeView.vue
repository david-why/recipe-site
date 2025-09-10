<script setup lang="ts">
import SearchField from '@/components/SearchField.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

function onSearchSubmit(query: string) {
  router.push({ name: 'search', query: { q: query } })
}
</script>

<template>
  <div>
    <SearchField @submit="onSearchSubmit" />
    <h3>Newest recipes</h3>
  </div>
</template>
