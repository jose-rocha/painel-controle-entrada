<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDataStore } from '../stores/data-store';

import { loginFirebase } from '../firebase/read/login_firebase';

const store = useDataStore();
const router = useRouter();
const $q = useQuasar();

const email = ref('josemarlerocha@gmail.com');
const senha = ref('123456');

const emailRegex = new RegExp('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:'
  + '[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0'
  + '-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25'
  + '[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\['
  + '\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])');

const login = async () => {
  $q.loading.show();

  try {
    const dataLogin = await loginFirebase(email.value, senha.value, $q);
    store.idUser = dataLogin.user.uid;

    if (store.isLogged) {
      // await getDataUserAuth(store.nome, store.emailUser);

      await router.push({ name: 'home' });
      $q.loading.hide();
    }
  } catch (error: any) {
    // console.log(error);

    if (String(error).includes('auth/invalid-login-credentials')) {
      $q?.dialog({
        title: 'Ops',
        message: 'Usuário ou senha está incorreto!',
        persistent: true,
      });
    } else if (String(error).includes('auth/wrong-password')) {
      $q?.dialog({
        title: 'Ops',
        message: 'Senha inválida!',
        persistent: true,
      });
    } else if (String(error).includes('auth/user-disabled')) {
      $q?.dialog({
        title: 'Ops',
        message: 'Este usuário encontra-se suspenso, entre em contato com o admin!',
        persistent: true,
      });
    }

    //
  } finally {
    $q.loading.hide();
  }
};

const showPassword = ref<boolean>(false);
</script>

<template>
  <div class="q-pa-sm full-width flex justify-center">
    <!-- @reset="onReset"> -->
    <q-form
        @submit="login"
        class="q-gutter-xs row justify-center"
        :style="$q.screen.gt.sm && 'max-width: 50%;'"
    >
      <!-- <h5 class="q-my-xs text-bold full-width
                 text-center text-primary">
        <q-icon name="mdi-map-marker-path" size="xl" /> <br>

        LOGIN
      </h5> -->
      <div class="q-pa-xl">
        <q-img
            src="/Logo-stagio.png"
            spinner-color="white"
            style="width: 15rem;"
          />
      </div>

      <q-input
        autofocus filled v-model="email"
        class="col-10 col-xs-11"
        label-slot input-class="q-pl-xs "
        lazy-rules
        :rules="[val => val && val.length > 0 || 'Por favor digite um email',
        val => (emailRegex.test(val))
          || 'Digite um email válido! ex: fulano.ciclano@gmail.com']">
        <template v-slot:label>
          <span class="q-pl-xs">Seu email *</span>
        </template>
      </q-input>

      <q-input
        v-model="senha" filled
        :type="showPassword ? 'text' : 'password'"
        class="col-10 col-xs-11 q-mb-md"
        label-slot input-class="q-pl-xs " lazy-rules :rules="[
          val => val !== null && val !== '' || 'Por favor digite uma senha'
        ]" hide-bottom-space>
        <template v-slot:label>
          <span class="q-pl-xs">Sua senha *</span>
        </template>

        <template v-slot:append>
          <q-icon class="cursor-pointer" :name="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click="showPassword = !showPassword" />
        </template>
      </q-input>

      <!-- <q-toggle v-model="accept" label="I accept the license and terms" /> -->

      <q-btn
        label="Login" type="submit"
        class="col-10 col-xs-11 q-py-md q-mb-md text-bold"
        color="secondary" no-caps
        icon-right="mdi-login"
      />

      <div class="full-width row justify-center">
        <router-link
            to="/"
            @click="store.showLoginOrResetPass = true" class="text-bold text-primary"
        >
          Esqueci Minha Senha
        </router-link>
      </div>
    </q-form>

  </div>
</template>
../firebase/read/login_firebase
