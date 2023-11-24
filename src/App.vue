<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';

import { useThemeStore } from 'src/stores/theme-store';

const storeTheme = useThemeStore();
const $q = useQuasar();

onMounted(() => $q.dark.set(storeTheme.theme));
</script>

<template>
  <router-view />
</template>
