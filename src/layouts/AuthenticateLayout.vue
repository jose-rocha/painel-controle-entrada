<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useDataStore } from 'src/stores/data-store';
import { useThemeStore } from 'src/stores/theme-store';
import { useRouter } from 'vue-router';

import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';

import { logoutFirebase } from 'src/firebase/connect_db';
import { getDataUserAuth } from 'src/firebase/read/get_data_user_auth';
import { useListImgagesStore } from 'src/stores/lista-imgs-store';

const $q = useQuasar();
const router = useRouter();
const store = useDataStore();
const storeTheme = useThemeStore();
const storeListImgs = useListImgagesStore();

watch(storeTheme, () => {
  $q.dark.set(storeTheme.theme);
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

const logout = () => {
  logoutFirebase();

  router.push({ name: 'login' });
  store.accessToken = '';
  store.idUser = '';
  store.nome = '';
  store.emailUser = '';

  store.series = [];
  storeListImgs.dadosImagens = [];
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-secondary">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="q-gutter-x-md flex items-center">
          <b v-if="$q.screen.gt.xs">Painel Administrativo </b>
          <!-- <div class="bg-white q-pa-xs cursor-pointer" @click="() => router.push('/home')">
            <q-img
              src="/Logo-stagio.png"
              spinner-color="white"
              style="width: 8rem;"
            />
          </div> -->
          <!-- <q-icon name="mdi-firebase" size="md" /> -->
        </q-toolbar-title>

        <div>
          <q-toggle v-model="storeTheme.theme" :icon="storeTheme.theme
            ? 'mdi-moon-waxing-crescent'
            : 'mdi-white-balance-sunny'" color="dark" />
        </div>

        <q-btn dense flat icon="mdi-logout" @click="logout">
          <q-tooltip
              anchor="bottom middle" class="bg-primary"
              self="top middle" :offset="[10, 10]"
          >
            <strong>Sair</strong> do <em>sistema</em>
            (<q-icon name="keyboard_arrow_down" />)
          </q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <!-- show-if-above -->
      <q-list>
        <q-item-label header>
          <!-- Páginas -->
          <q-img
              src="/Logo-stagio.png"
              spinner-color="white"
              style="width: 8rem;"
            />
        </q-item-label>

        <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title" v-bind="link"
            :Links="essentialLinks"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
