<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar bg-body-tertiary">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">
        <img
          class="d-inline-block align-text-top"
          width="24"
          height="24"
          src="@/assets/icon256.png"
        />
        {{ ' ' }}
        <span class="gradient-text">Sustenance</span>
      </RouterLink>
    </div>
  </nav>
  <div class="container">
    <h1>You did it!</h1>
    <p>
      Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
      documentation
    </p>
  </div>
</template>

<style scoped></style>
