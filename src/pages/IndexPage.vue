<script setup lang="ts">
// import { reactive, computed, ref } from 'vue';

import LoginComponent from 'src/components/LoginComponent.vue';
import ResetPasswordComponent from 'src/components/ResetPasswordComponent.vue';
import { useDataStore } from '../stores/data-store';

const store = useDataStore();

// const enableBtn = computed(() => dadosCep.cep.length >= 8);
</script>

<template>
  <q-page class="flex row items-center justify-center">
    <login-component v-if="!store.showLoginOrResetPass" />

    <reset-password-component v-else />
  </q-page>
</template>
