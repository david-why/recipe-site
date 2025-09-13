<script setup lang="ts">
defineProps<{ time: number }>()
</script>

<template>
  <span>
    <span class="comp" v-if="time >= 3600">{{ Math.floor(time / 3600) }}h</span>
    <span class="comp" v-if="time % 3600 >= 60"> {{ Math.floor((time % 3600) / 60) }}m</span>
    <span class="comp" v-if="time % 60 > 0"> {{ Math.floor(time % 60) }}s</span>
  </span>
</template>

<style scoped>
.comp:not(:first-child)::before {
  content: ' ';
}
</style>
