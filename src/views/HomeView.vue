<script setup lang="ts">
import SearchField from '@/components/SearchField.vue'
import { getCategories } from '@/service'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Category } from '../../shared/types'
import LoadingIcon from '@/components/LoadingIcon.vue'
const router = useRouter()

// state
const loadingCategories = ref(false)
const categories = ref<Category[]>([])

// functions

async function updateCategories() {
  loadingCategories.value = true
  try {
    categories.value = await getCategories()
  } finally {
    loadingCategories.value = false
  }
}

// events

function onSearchSubmit(query: string) {
  router.push({ name: 'search', query: { q: query } })
}

onMounted(async () => {
  updateCategories()
})
</script>

<template>
  <div>
    <SearchField @search="onSearchSubmit" />
    <h3 class="my-4">Explore...</h3>
    <div v-if="loadingCategories">
      <LoadingIcon />
    </div>
    <div class="row">
      <div class="col-6 col-md-4 col-lg-3 mb-3" v-for="category in categories" :key="category.id">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mb-0">
              <RouterLink :to="{ name: 'category', params: { categoryId: category.id } }">{{
                category.name
              }}</RouterLink>
            </h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
