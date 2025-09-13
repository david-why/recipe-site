<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import WebsiteName from './components/WebsiteName.vue'
const route = useRoute()

const pages = computed(() =>
  [{ name: 'Home', path: '/' }].map((page) => ({
    ...page,
    isActive: route.path === page.path,
  })),
)
</script>

<template>
  <nav class="navbar navbar-expand-md bg-body-tertiary">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">
        <img
          class="d-inline-block align-text-top"
          width="24"
          height="24"
          src="@/assets/icon256.png"
        />
        {{ ' ' }}
        <WebsiteName />
      </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item" v-for="page in pages" :key="page.name">
            <RouterLink
              class="nav-link"
              :class="{ active: page.isActive }"
              :to="page.path"
              :aria-current="page.isActive ? 'page' : undefined"
              >{{ page.name }}</RouterLink
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container mt-4 mb-4">
    <RouterView />
  </div>
</template>

<style scoped></style>
