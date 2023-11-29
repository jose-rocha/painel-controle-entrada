<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useDataStore } from 'src/stores/data-store';
import { useThemeStore } from 'src/stores/theme-store';
import { useRouter } from 'vue-router';

import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';

import { logoutFirebase } from 'src/firebase/read/logout_firebase';
import { getDataUserAuth } from 'src/firebase/read/get_data_user_auth';
import { useListImgagesStore } from 'src/stores/lista-imgs-store';
import { useUidRouterGuardFirebase } from 'src/firebase/read/get_data_use_uid_router_guard';

const $q = useQuasar();
const router = useRouter();
const store = useDataStore();
const storeTheme = useThemeStore();
const storeListImgs = useListImgagesStore();
const redirect = ref(false);

watch(storeTheme, () => {
  $q.dark.set(storeTheme.theme);
});

onBeforeMount(async () => {
  redirect.value = true;
  const dataRouteIdFirebase = await useUidRouterGuardFirebase(store.idUser);

  if (!dataRouteIdFirebase) {
    await router.replace({ name: 'login' });
    redirect.value = false;
    // window.history.pushState({}, '', '#camera');

    return;
  }
  redirect.value = false;
});

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Home',
    caption: '',
    icon: 'home',
    link: '/home',
  },
  {
    title: 'Cadastrar Usuário',
    caption: '',
    icon: 'mdi-content-save-edit-outline',
    link: '/cadastrar_usuario',
  },
  {
    title: 'Gerenciar Conta',
    caption: '',
    icon: 'mdi-account-cog',
    link: '/gerenciar_conta',
  },
  //  {
  //   title: 'Lista de Séries',
  //   caption: '',
  //   icon: 'mdi-format-list-numbered',
  //   link: '/lista_series',
  // },
  // {
  //   title: 'Cadastrar imagens',
  //   caption: '',
  //   icon: 'cloud_upload',
  //   link: '/enviar_img',
  // },
];

getDataUserAuth();

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const logout = async () => {
  await logoutFirebase();

  await router.push({ name: 'login' });
  store.accessToken = '';
  store.idUser = '';
  store.nome = '';
  store.emailUser = '';
  store.avatarUrl = '';
  store.pathStorageImage = '';

  store.series = [];
  storeListImgs.dadosImagens = [];

  storeListImgs.unsubscribe(); // Pra para remover o listener do OnSnapShot
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-secondary">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="q-gutter-x-md flex items-center">
          <b>Painel Administrativo </b>
          <!-- <div class="bg-white q-pa-xs cursor-pointer" @click="() => router.push('/home')">
            <q-img
              src="/Logo-stagio.png"
              spinner-color="white"
              style="width: 8rem;"
            />
          </div> -->
          <!-- <q-icon name="mdi-firebase" size="md" /> -->
        </q-toolbar-title>

        <q-btn dense flat icon="mdi-logout" @click="logout">
          <q-tooltip
            anchor="bottom middle"
            class="bg-primary"
            self="top middle"
            :offset="[10, 10]"
          >
            <strong>Sair</strong> do <em>sistema</em> (<q-icon
              name="keyboard_arrow_down"
            />)
          </q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          <!-- Páginas -->
          <q-img src="/Logo-stagio.png" spinner-color="white" style="width: 8rem" />
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          :Links="essentialLinks"
        />
      </q-list>

      <div style="position: absolute; bottom: 0; left: 1rem">
        <span>
          Mudar o Tema para
          <b>{{ storeTheme.theme ? 'Claro' : 'Escuro' }}</b>
        </span>

        <q-toggle
          v-model="storeTheme.theme"
          :icon="
            storeTheme.theme ? 'mdi-moon-waxing-crescent' : 'mdi-white-balance-sunny'
          "
          color="secondary"
        />
      </div>
    </q-drawer>

    <template v-if="redirect">
      <div
        class="bg-secondary full-width"
        style="position: absolute; z-index: 10000; height: 100dvh"
      >
        <q-inner-loading
          showing
          label="Aguarde..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </div>
    </template>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
