<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useDataStore } from '../stores/data-store';

import { resetPasswordFirebase } from '../firebase/update/reset_password_firebase';

const store = useDataStore();
const $q = useQuasar();

const email = ref('');

const emailRegex = new RegExp('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:'
  + '[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0'
  + '-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25'
  + '[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\['
  + '\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])');

const resetPassword = async () => {
  try {
    $q.loading.show();
    await resetPasswordFirebase(email.value);

    $q.dialog({
      title: 'Atenção!',
      message: `Um link de redefinição de senha foi enviado para o email: ${email.value}`,
      persistent: true,
    }).onOk(() => {
      store.showLoginOrResetPass = false;
    });
    $q.loading.hide();
  } catch (error) {
    console.log(error);

    store.showLoginOrResetPass = false;
    $q.loading.hide();
  }
};
</script>

<template>
  <div class="q-pa-sm full-width flex justify-center">
    <!-- @reset="onReset"> -->
    <q-form @submit="resetPassword" class="q-gutter-xs row justify-center"
            :style="$q.screen.gt.sm && 'max-width: 50%;'"
    >
      <div class="q-pa-xl">
        <q-img
            src="/Logo-stagio.png"
            spinner-color="white"
            style="width: 15rem;"
          />
      </div>

      <q-input v-model="email"
               filled class="col-10 col-xs-11"
               label-slot input-class="q-pl-xs " lazy-rules
               :rules="[
                 val => val && val.length > 0 || 'Por favor digite um email',
                 val => (emailRegex.test(val))
                 || 'Digite um email válido! ex: fulano.ciclano@gmail.com'
                ]"
      >
        <template v-slot:label>
          <span class="q-pl-xs">Seu email *</span>
        </template>
      </q-input>

      <q-btn
        :label="emailRegex.test(email)
          ? 'Enviar link para o email'
          : 'Digite um email para receber o link'"
        class="col-10 col-xs-11 q-py-md q-mb-md"
        type="submit" color="primary" no-caps
        :icon-right="emailRegex.test(email)
          ? 'mdi-email-arrow-right'
          : 'mdi-block-helper'"
        :disable="!emailRegex.test(email)"
      />

      <div class="full-width row justify-center">
          <router-link
              to="/"
              @click="store.showLoginOrResetPass = false"
              class="text-bold text-secondary"
          >
            Voltar para Login
          </router-link>
        </div>

    </q-form>

  </div>
</template>
