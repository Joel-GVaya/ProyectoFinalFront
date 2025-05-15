<script setup>
import NavBar from './components/NavBar.vue'
import { onMounted } from 'vue'
import { useUserStore } from '@/store/store.js'

const userStore = useUserStore()

onMounted(() => {
  userStore.populateEstilos()
})
</script>

<template>
  <div id="app">
    <NavBar />
    <router-view />
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
