<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useDataStore } from '../stores/data-store';

import { createUserFirebase } from '../firebase/create/create_user_firebase';

const store = useDataStore();
const $q = useQuasar();

const nome = ref('');
const email = ref('');
const senha = ref('');
// const accept = ref(false);

const cargo = ref<string>('');
const opcoes = [
  {
    label: 'Administrador',
    value: 'administrador',
  },
  {
    label: 'Porteiro',
    value: 'porteiro',
  },
];

const emailRegex = new RegExp('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:'
  + '[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0'
  + '-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25'
  + '[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\['
  + '\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])');

const signUp = async () => {
  // if (accept.value !== true) {
  //   $q.notify({
  //     color: 'red-5',
  //     textColor: 'white',
  //     icon: 'warning',
  //     message: 'Você precisa aceitar os termos',
  //   });

  //   return;
  // }

  try {
    await createUserFirebase(
      nome.value,
      cargo.value,
      email.value,
      senha.value,
    );

    setTimeout(() => {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        html: true,
        message: `
        Cadastro concluído com sucesso. <br>
        você será redirecionado para fazer o login.
        `,
      });
    }, 1500);

    setTimeout(() => { store.showLoginOrSignUp = false; }, 2000);
  } catch (error: any) {
    if (String(error).includes('auth/email-already-in-use')) {
      $q?.dialog({
        title: 'Ops',
        message: 'Este email já está em uso!',
        persistent: true,
      });
    } else if (String(error).includes('auth/invalid-email')) {
      $q?.dialog({
        title: 'Ops',
        message: 'Este tipo de email inválido!',
        persistent: true,
      });
    } else if (String(error).includes('auth/weak-password')) {
      $q?.dialog({
        title: 'Ops',
        message: 'Esta  senha é fraca!',
        persistent: true,
      });
    }
  }
  // console.log(loginFirebase(email.value, senha.value));
};

const showPassword = ref<boolean>(false);
</script>

<template>
  <div class="q-pa-sm full-width flex justify-center">
    <!-- @reset="onReset"> -->
    <q-form @submit="signUp" class="q-gutter-xs row justify-center"
            :style="$q.screen.gt.sm && 'max-width: 50%;'">
      <!-- <h5 class="q-my-xs text-bold full-width
                 text-center text-secondary">
        <q-icon name="mdi-map-marker-path" size="xl" /> <br>
        CADASTRO
      </h5> -->
      <div class="q-pa-xl">
          <q-img
              src="/Logo-stagio.png"
              spinner-color="white"
              style="width: 15rem;"
            />
        </div>

      <q-input  autofocus v-model="nome"
                filled class="col-10 col-xs-11"
                label-slot input-class="q-pl-xs " lazy-rules
        :rules="[val => val && val.length > 0 || 'Por favor digite um nome']">
        <template v-slot:label>
          <span class="q-pl-xs">Digite seu Nome *</span>
        </template>
      </q-input>

      <q-input v-model="email"
               filled class="col-10 col-xs-11"
               label-slot input-class="q-pl-xs " lazy-rules
               :rules="[val => val && val.length > 0 || 'Por favor digite um email',
                        val => (emailRegex.test(val))
                        || 'Digite um email válido! ex: fulano.ciclano@gmail.com']">
        <template v-slot:label>
          <span class="q-pl-xs">Seu email *</span>
        </template>
      </q-input>

      <q-input v-model="senha" filled
               :type="showPassword ? 'text' : 'password'"
               class="col-10 col-xs-11" label-slot
        input-class="q-pl-xs " lazy-rules :rules="[
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

      <div class="col-10 row col-xs-11 items-center q-py-sm" >
        <!-- <q-toggle v-model="accept" label="Aceite os termos" /> -->
        <h6 class="no-margin" >Cargo:</h6>
        <q-option-group
          v-model="cargo"
          :options="opcoes"
          color="primary"
          inline
        />
      </div>
      {{ cargo }}

      <q-btn label="Fazer o Cadastro"
             class="col-10 col-xs-11 q-py-md q-mb-md"
             type="submit" color="primary" no-caps />

      <div class="full-width row justify-center">
        <!-- <router-link to="/"
                     class="text-bold text-secondary"
                     @click="store.showLoginOrSignUp = false" >
          Ir para login
        </router-link> -->
      </div>

    </q-form>

  </div>
</template>
