<script setup lang="ts">
// props
const searchQuery = defineModel<string>('query', { default: '' })

// emits
const emit = defineEmits<{
  (e: 'search', query: string): void
}>()

// events
function onSearchSubmit() {
  emit('search', searchQuery.value)
}
</script>

<template>
  <div class="card shadow mb-4">
    <div class="card-body">
      <form @submit.prevent="onSearchSubmit">
        <div class="input-group">
          <input class="form-control" placeholder="🔍 Search Sustenance" v-model="searchQuery" />
          <button class="btn btn-primary" type="submit">Search</button>
        </div>
      </form>
    </div>
  </div>
</template>
