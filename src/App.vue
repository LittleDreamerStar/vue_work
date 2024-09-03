<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import './api/auth.ts'
</script>

<template>
  <RouterView />
  <Toast />
</template>
