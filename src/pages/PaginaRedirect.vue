<script lang="ts" setup>
import { useUidRouterGuardFirebase } from 'src/firebase/read/get_data_use_uid_router_guard';
import { useDataStore } from 'src/stores/data-store';
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const storeUId = useDataStore();

onBeforeMount(async () => {
  const dataRouteIdFirebase = await useUidRouterGuardFirebase(storeUId.idUser);
  if (!dataRouteIdFirebase) {
    await router.replace({ name: 'login' });
    // window.history.pushState({}, '', '#camera');

    return;
  }
  await router.replace({ name: 'home' });
});
</script>

<template>
  <q-page class="flex column items-center"> </q-page>
</template>
