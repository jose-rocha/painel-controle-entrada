<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';

import { createUserFirebase } from '../firebase/create/create_user_firebase';
import { getDataUserAuth } from '../firebase/read/get_data_user_auth';

const $q = useQuasar();

const showForm = ref(false);
const nome = ref('');
const email = ref('');
const senha = ref('');
const confirmeSenha = ref('');
const cargo = ref<string>('');

const nomeRef = ref<null>(null);
const emailRef = ref<null>(null);
const senhaRef = ref<null>(null);
const confirmeSenhaRef = ref<null>(null);

type UserType = {
  email_usuario: string;
  user_id: string;
  nome: string;
  avatar: string | null;
  cargo: string;
  data_criacao: { seconds: number; nanoseconds: number };
};

const users = ref<UserType[]>([]);

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

const emailRegex = new RegExp(
  "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:"
    + '[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0'
    + '-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25'
    + '[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\['
    + '\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])',
);

const registerUser = async () => {
  $q.loading.show();
  try {
    await createUserFirebase(nome.value, cargo.value, email.value, senha.value);

    $q.dialog({
      color: 'primary',
      html: true,
      message: `
        Cadastro concluído com sucesso. <br>
        `,
    }).onOk(async () => {
      const usersFirebase = await getDataUserAuth();

      users.value = usersFirebase.getUsers.docs.map((user) => user.data());

      showForm.value = false;
      $q.loading.hide();
      // window.location.href = '/cadastrar_usuario';
    });

    nomeRef.value?.resetValidation();
    emailRef.value?.resetValidation();
    senhaRef.value?.resetValidation();
    confirmeSenhaRef.value?.resetValidation();

    nome.value = '';
    email.value = '';
    senha.value = '';
    confirmeSenha.value = '';
    cargo.value = '';

    // nomeRef?.value.focus()
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
  } finally {
    $q.loading.hide();
  }
};

const showPassword = ref<boolean>(false);
const showConfirmePassword = ref<boolean>(false);

const enableBtnRegister = computed(
  () => nome.value.length >= 3
    && emailRegex.test(email.value)
    && senha.value.length >= 6
    && cargo.value !== ''
    && senha.value === confirmeSenha.value,
);

(async () => {
  const usersFirebase = await getDataUserAuth();

  users.value = usersFirebase.getUsers.docs.map((user) => user.data());
})();
</script>

<template>
  <div class="q-pa-sm full-width flex justify-center">
    <!-- Form @reset="onReset"> -->
    <template v-if="showForm">
      <div class="justify-center flex row">
        <q-form
          @submit="registerUser"
          class="q-gutter-xs row justify-center"
          :style="$q.screen.gt.sm && 'max-width: 50%;'"
        >
          <div class="q-pa-xl">
            <q-img src="/Logo-stagio.png" spinner-color="white" style="width: 15rem" />
          </div>

          <q-input
            autofocus
            v-model="nome"
            filled
            class="col-10 col-xs-11"
            label-slot
            input-class="q-pl-xs "
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Por favor digite um nome']"
            ref="nomeRef"
          >
            <template v-slot:label>
              <span class="q-pl-xs">Digite o Nome *</span>
            </template>
          </q-input>

          <q-input
            v-model="email"
            filled
            class="col-10 col-xs-11"
            label-slot
            input-class="q-pl-xs "
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Por favor digite um email',
              (val) =>
                emailRegex.test(val) ||
                'Digite um email válido! ex: fulano.ciclano@gmail.com',
            ]"
            ref="emailRef"
          >
            <template v-slot:label>
              <span class="q-pl-xs">Digite um email *</span>
            </template>
          </q-input>

          <q-input
            v-model="senha"
            filled
            :type="showPassword ? 'text' : 'password'"
            class="col-10 col-xs-11"
            label-slot
            input-class="q-pl-xs "
            lazy-rules
            :rules="[
              (val) => (val !== null && val !== '') || 'Por favor digite uma senha',
            ]"
            ref="senhaRef"
          >
            <template v-slot:label>
              <span class="q-pl-xs">Digite uma senha *</span>
            </template>

            <template v-slot:append>
              <q-icon
                class="cursor-pointer"
                :name="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-input
            v-model="confirmeSenha"
            filled
            :type="showConfirmePassword ? 'text' : 'password'"
            class="col-10 col-xs-11"
            label-slot
            input-class="q-pl-xs "
            lazy-rules
            :rules="[(val) => (val && val === senha) || 'As senhas não são iguais!']"
            hide-bottom-space
            ref="confirmeSenhaRef"
          >
            <template v-slot:label>
              <span class="q-pl-xs"> Confirme a senha *</span>
            </template>

            <template v-slot:append>
              <q-icon
                class="cursor-pointer"
                :name="showConfirmePassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click="showConfirmePassword = !showConfirmePassword"
              />
            </template>
          </q-input>

          <div class="col-10 row col-xs-11 items-center q-py-sm">
            <h6 class="no-margin text-secondary">Cargo:</h6>
            <q-option-group v-model="cargo" :options="opcoes" color="primary" inline />
          </div>

          <q-btn
            :label="enableBtnRegister ? 'Cadastrar Usuário' : 'Preencha todos os campos!'"
            class="col-10 col-xs-11 q-py-md q-mb-md"
            type="submit"
            color="secondary"
            no-caps
            :disable="!enableBtnRegister"
            :icon-right="
              enableBtnRegister
                ? 'mdi-checkbox-marked-circle-outline'
                : 'mdi-block-helper'
            "
          />

          <q-btn
            label="Cancelar Cadastro"
            class="col-10 col-xs-11 q-py-md q-mb-md"
            icon="mdi-arrow-left"
            no-caps
            color="negative"
            @click="showForm = false"
          />
        </q-form>
      </div>
    </template>

    <!-- Cards -->
    <template v-else>
      <div class="justify-center flex row q-mt-md" style="width: 65rem">
        <q-card class="my-card full-width">
          <q-card-section class="flex column justify-center">
            <div class="flex text-h6 justify-center items-end text-bold text-primary">
              <q-icon name="mdi-format-list-bulleted-square" size="md" class="q-mx-xs" />
              <span style="position: relative; bottom: -4px">Usuários Cadastrados</span>
            </div>
            <template v-if="$q.screen.gt.sm">
              <q-btn
                label="Cadastrar Usuário"
                icon-right="mdi-account-plus-outline"
                no-caps
                color="primary"
                @click="showForm = true"
                style="position: absolute; right: 6px"
              />
            </template>
            <!-- <div class="text-subtitle2 text-center">by John Doe</div> -->
          </q-card-section>

          <q-separator dark />
          <template
            v-for="user in users.sort((item1, item2) =>
              item1.nome.localeCompare(item2.nome),
            )"
            :key="user.id"
          >
            <q-card-section class="flex" style="gap: 10px">
              <div style="flex: 1; gap: 5px" class="flex items-center justify-start">
                <b class="text-secondary">
                  <q-icon name="mdi-account" size="md" />
                  <span style="position: relative; bottom: -7px">Nome:</span>
                </b>
                <span style="position: relative; bottom: -7px">{{ user.nome }}</span>
              </div>
              <div style="flex: 1; gap: 5px" class="flex items-center justify-start">
                <b class="text-secondary">
                  <q-icon name="mdi-email" size="md" class="q-mx-xs" />
                  <span style="position: relative; bottom: -7px">Email:</span>
                </b>
                <span style="position: relative; bottom: -5px">{{
                  user.email_usuario
                }}</span>
              </div>
              <div style="flex: 1; gap: 5px" class="flex items-center justify-start">
                <b class="text-secondary">
                  <q-icon name="mdi-briefcase" size="md" class="q-mx-xs" />
                  <span style="position: relative; bottom: -5px">Cargo:</span>
                </b>
                <span style="position: relative; bottom: -5px">{{ user.cargo }}</span>
              </div>
              <!-- <span><b>Data de cadastro: </b>{{ user.data_criacao }}</span> -->
            </q-card-section>

            <q-separator dark />
          </template>

          <!-- <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions> -->
        </q-card>
      </div>
    </template>
  </div>
</template>
