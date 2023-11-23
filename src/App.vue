<script setup lang="ts">
import { onMounted, onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';

import { useThemeStore } from 'src/stores/theme-store';
import { useListImgagesStore } from 'stores/lista-imgs-store';
import { useRouter } from 'vue-router';

const storeTheme = useThemeStore();
const storeListImgs = useListImgagesStore();
const $q = useQuasar();
const router = useRouter();

onMounted(() => $q.dark.set(storeTheme.theme));

onBeforeMount(async () => {
  if (storeListImgs.dadosImagens.length === 0) {
    await router.replace({ name: 'login' });
    // window.history.pushState({}, '', '#camera');
  }
});
</script>

<template>
  <router-view />
</template>
