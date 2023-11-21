<script setup lang="ts">
import { ref } from 'vue';
import { getDataUserAuth } from 'src/firebase/read/get_data_user_auth';
import { updateUserNameFirebase } from 'src/firebase/update/update_user_name';
import { deleteAvatarFirebase } from 'src/firebase/delete/delete_avatar';

import { useQuasar } from 'quasar';
import { useDataStore } from '../stores/data-store';

import { errosFNHelper } from '../helpers/possiveiErrosAoClicarCamera';
import SeletorCamera from '../components/SeletorCamera.vue';

const store = useDataStore();

const $q = useQuasar();
const dialog = ref(false);
const nomeUserEdit = ref('');

const openDialogUser = async () => {
  dialog.value = true;
  const dataNameFirebase = await getDataUserAuth();

  nomeUserEdit.value = dataNameFirebase[0]?.nome;
};

const updateName = async () => {
  await updateUserNameFirebase(nomeUserEdit.value);
  dialog.value = false;
};

const videoStream = ref();
const cameraIsActive = ref();
const imgCamera = ref();
const showModalCamera = ref(false);

const larguraTela = ref(window.innerWidth);
const alturaTela = ref(window.innerHeight);

const constraints = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440,
    },
    facingMode: 'environment',
  },
};

const openCamera = async () => {
  if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    // console.log('ok, o navegador tem suporte a API de câmera'); // eslint-disable-line
    $q.loading.show({
      message: 'Carregando a câmera...',
    });

    try {
      videoStream.value = await navigator.mediaDevices.getUserMedia(constraints);
      cameraIsActive.value = videoStream.value.active;

      showModalCamera.value = true;
      if (showModalCamera.value === true) {
        setTimeout(() => {
          imgCamera.value.srcObject = videoStream.value;
          window.history.pushState({}, '', '#camera');
          $q.loading.hide();
        });
      }
    } catch (err: any) { // eslint-disable-line
      $q.loading.hide();
      errosFNHelper(err, $q);
    }
  } else {
    $q.dialog({
      title: 'Ops!',
      message: 'A API de mídia não é suportada neste navegador.',
    });
  }
};

const disableCamera = async (paramsStatus: any) => {// eslint-disable-line
  // cardCamera.value = false;
  showModalCamera.value = false;
  const tracks = await imgCamera.value?.srcObject.getTracks();

  await tracks?.forEach(async (track: any) => track.stop()); // eslint-disable-line
  if (paramsStatus === 1) window.history.back();
};

const mudaCamera = async () => {
  const tracks = imgCamera.value.srcObject.getTracks(); // eslint-disable-next-line
  tracks.forEach((track: any) => track.stop());

  if (constraints.video.facingMode === 'environment') {
    constraints.video.facingMode = 'user';
  } else {
    constraints.video.facingMode = 'environment';
  }

  videoStream.value = await navigator.mediaDevices.getUserMedia(constraints);
  cameraIsActive.value = videoStream.value.active;
  setTimeout(() => {
    imgCamera.value.srcObject = videoStream.value;
  });
};

const rotateScreen = async () => {
  videoStream.value = await navigator.mediaDevices.getUserMedia(constraints);
  cameraIsActive.value = videoStream.value.active;

  larguraTela.value = window.innerWidth;
  alturaTela.value = window.innerHeight;
  imgCamera.value.srcObject = videoStream.value;
};

const deleteAvatar = () => {
  $q.dialog({
    title: 'Ops!',
    message: 'Você tem certeza que quer excluir a foto do perfil?',
    cancel: 'Cancelar',
  }).onOk(async () => {
    try {
      await deleteAvatarFirebase(store.avatarUrl, store.pathStorageImage, store.idUser);
    } catch (error) {
      $q.dialog({
        title: 'Ops!',
        message: `${error}`,
      });
    }
    // store.avatarUrl = null;
  });
};
</script>

<template>
  <q-page class="flex row items-center justify-center">
    <q-card
      class="my-card" flat bordered
      :style="$q.screen.lt.sm ?
        'max-width: 80vw;' :
        'width: 50vw; max-width: 50vw;'"
    >
      <q-item
        class="flex column items-center justify-center q-pa-xl"
        style="gap: 2rem; "
      >
        <q-item-section avatar>
          <q-avatar class="cursor-pointer " style="height: 7rem; width: 7rem;">
            <template v-if="store.avatarUrl" >
              <img :src="store.avatarUrl">
            </template>

            <q-icon v-else name="mdi-account" size="140px" color="secondary" />
          </q-avatar>

          <div class="bg-transparent flex justify-center
                     items-end cursor-pointer "
                style="position: absolute;
                       height: 7rem; width: 7rem;
                       border-radius: 50%;
                       padding-inline: 4px;
                      "
          >
          <div class="trocarFoto full-width flex justify-center q-pt-sm"
               style="border-bottom-left-radius: 95px;
                      border-bottom-right-radius: 95px;
                     "
              @click="openCamera"
          >
            <q-icon name="mdi-camera" size="md" class="q-mb-xs" />
            <q-tooltip>Editar Foto</q-tooltip>
          </div>
          </div>
        </q-item-section>

        <q-item-section class="flex items-center">
          <q-item-label style="font-size: 20pt;">
            {{ store.nome }}

            <q-icon name="mdi-account-edit"
                    size="lg" class="cursor-pointer"
                    color="secondary"
                    style="position: relative; bottom: 5px"
                    @click="openDialogUser"
            >
              <q-tooltip>Editar Nome</q-tooltip>
            </q-icon>
          </q-item-label>
          <q-item-label caption>
            {{ store.emailUser }}
          </q-item-label>

          <template v-if="store.avatarUrl">
            <q-chip
              outline color="primary"
              text-color="white"
              icon-right="mdi-trash-can"
              class="q-mt-md"
              clickable
            @click="deleteAvatar"
            >
              Excluir a foto
            </q-chip>
          </template>

        </q-item-section>
      </q-item>
    </q-card>

    <template v-if="dialog">
      <div class="q-pa-md" style="position: absolute;">
        <q-dialog v-model="dialog" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="white" /> -->
              <q-input v-model="nomeUserEdit"
                       autofocus label="Editando Nome do Usuário"
                       class="q-pl-sm"
                       @keypress.enter="updateName">
                <template v-slot:append>
                  <q-icon name="mdi-map-clock-outline" color="primary" />
                </template>
              </q-input>
            </q-card-section>

            <!-- <q-card-section class="row items-center">
              <q-toggle v-model="cancelEnabled" label="Cancel button enabled" />
            </q-card-section> -->

            <!-- Notice v-close-popup -->
            <q-card-actions align="right">
              <q-btn flat no-caps label="Cancelar" color="primary" v-close-popup />
              <q-btn flat no-caps
                      label="Salvar"
                      icon-right="mdi-content-save-edit" color="primary" v-close-popup
                @click="updateName" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </template>

    <template v-if="showModalCamera">
      <seletor-camera :showModalCamera="showModalCamera"
                      :idUser="store.idUser"
                      @update:show-modal-camera="disableCamera"
                      :imgCamera="imgCamera"
                      @is-front-or-back="mudaCamera"
                      @rotate-screen="rotateScreen"
      >
        <!-- <video autoplay controls="false"
                ref="imgCamera"
                :width="larguraTela"
                :height="alturaTela"
                style="object-fit: fill;"/> -->
                <video autoplay controls="false"
                       ref="imgCamera"
                       style="object-fit: fill; display: none;"/>
      </seletor-camera>
    </template>

  </q-page>
</template>

<style lscoped>
.trocarFoto {
  opacity: 0;
}

.trocarFoto:hover {
  /* background-color: rgb(216, 202, 202); */
  opacity: 1;
}

</style>
