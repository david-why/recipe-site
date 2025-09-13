<script setup lang="ts">
import CollectionCard from '@/components/CollectionCard.vue'
import LoadingIcon from '@/components/LoadingIcon.vue'
import { getCollections } from '@/service'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Collection } from '~/shared/types'
const router = useRouter()

// state

const loading = ref(false)
const collections = ref<Collection[]>([])

// functions

async function updateCollections() {
  loading.value = true
  try {
    collections.value = await getCollections()
  } finally {
    loading.value = false
  }
}

// events
onMounted(() => {
  updateCollections()
})

function onClick(id: string) {
  router.push({ name: 'collection', params: { collectionId: id } })
}
</script>

<template>
  <h1>Collections</h1>
  <div v-if="loading">
    <LoadingIcon />
  </div>
  <div class="row" v-else>
    <div class="col-lg-3 mb-4" v-for="collection in collections" :key="collection.id">
      <CollectionCard :collection="collection" hide-description @click="onClick(collection.id)" />
    </div>
  </div>
</template>
