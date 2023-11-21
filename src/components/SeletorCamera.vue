<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, computed } from 'vue';

import { updateAvatarFirebase } from '../firebase/update/update_avatar';

const $q = useQuasar();
const maximizedToggle = ref(true);
const canvas = ref(null);
const status = ref(0);
const showMudarCamera = ref(false);
const larguraTela = ref(window.innerWidth);
const alturaTela = ref(window.innerHeight);
const cameraFront = ref(true);
const modalCanvas = ref(false);

const props = defineProps({
  showModalCamera: Boolean,
  imgCamera: Object,
  idUser: String,
});
const emits = defineEmits(['update:showModalCamera', 'isFrontOrBack', 'rotateScreen', 'enviarImgBase64']);

const dialog = computed({
  get: () => props.showModalCamera,
  set: (val) => emits('update:showModalCamera', val),
});

if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
  // Lista todas as fontes de mídia disponíveis
  (async () => {
    try {
      const midiasDisponiveis = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = midiasDisponiveis.filter((devices) => devices.kind === 'videoinput');

      if (videoDevices.length > 1) showMudarCamera.value = true;
      else showMudarCamera.value = false;
    } catch (error: any) {
      $q.dialog({
        title: 'Ops!',
        message: `Ocorreu um erro ao verificar as fontes de mídia: ${error?.message}`,
      });
    }
  })();
}

window.addEventListener('orientationchange', () => {
  emits('rotateScreen');
});

const drawImageFn = () => {
  const drawerCanvas = () => {
    const drawImageProp = (ctx: any, vid: any) => {
      ctx?.setTransform(-1, 0, 0, 1, larguraTela.value, 0);
      ctx?.drawImage(vid, 0, 0, larguraTela.value, alturaTela.value);
      ctx?.restore();
    };

    const context = canvas.value?.getContext('2d');

    drawImageProp(context, props.imgCamera);
  };

  drawerCanvas();
};

let intervalRenderCanvas = setInterval(drawImageFn, 30.30303030303);

const mudaCamera = () => {
  cameraFront.value = !cameraFront.value;
  emits('isFrontOrBack');
};

const voltar = () => {
  emits('update:showModalCamera', status.value = 1);

  clearInterval(intervalRenderCanvas);
};

const tirarFoto = () => {
  clearInterval(intervalRenderCanvas);
  const drawImageProp = (ctx, vid) => {
    ctx?.setTransform(-1, 0, 0, 1, larguraTela.value, 0);
    ctx?.drawImage(vid, 0, 0, larguraTela.value, alturaTela.value);
    ctx?.restore();
  };

  setTimeout(() => {
    const context = canvas.value?.getContext('2d');
    drawImageProp(context, props.imgCamera);
  });
  modalCanvas.value = true;
};

const enviarImagem = async () => {
  const dadosBlob = await new Promise((resolve) => {
    canvas?.value.toBlob((blob: string) => {
      resolve(blob);
    }, 'image/jpeg');
  });

  const blobImage = await dadosBlob;

  // const fotoCamera = async () => (await fetch(
  //   `${process.env.API_BASE_URL}hitl/midia`,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${hitlChatStore.accessToken}`,
  //       'Content-Type': 'image/jpeg',
  //     },
  //     method: 'POST',
  //     body: blobImage,
  //   },
  // )).json();

  // const retornoImg = await fotoCamera();

  // emits('enviarImgBase64', blobImage, retornoImg?.id_midia, legendaFoto.value);
  emits('enviarImgBase64', blobImage);

  dialog.value = false;
  modalCanvas.value = false;

  await updateAvatarFirebase(blobImage, props.idUser, $q);

  return blobImage;
};

const deleteImg = () => {
  modalCanvas.value = false;

  setTimeout(() => {
    intervalRenderCanvas = setInterval(drawImageFn, 30.30303030303);
  }, 100);
};

window.addEventListener('orientationchange', () => {
  emits('rotateScreen');
});

window.addEventListener('popstate', () => {
  emits('update:showModalCamera');
  dialog.value = false;
});

</script>

<template>
  <div>
    <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-black text-white">
          <q-bar class="bg-black flex items-center q-pt-sm"
                style="position: relative; z-index: 2;">
            <q-btn dense flat icon="mdi-arrow-left" label="Voltar"
                  @click="voltar">
              <q-tooltip class="bg-white text-primary">
                Fechar Câmera
              </q-tooltip>
            </q-btn>
          </q-bar>

          <q-btn size="35px" flat icon="mdi-circle-slice-8"
                  :style="(showMudarCamera ? 'left: 40%;' : 'left: 50%;')+ ' '
                          +($q.platform.is.ios || $q.platform.is.android
                            ? 'position: absolute; bottom: 0rem; z-index: 2; left: 40%;'
                            : 'position: absolute; bottom: 2rem;z-index: 2;'
                            )
                          "
                  @click="tirarFoto"
          >
                  <!-- {{ width !== '' }} -->
              <q-tooltip class="bg-white text-primary">
                Tirar Foto
              </q-tooltip>
            </q-btn>

          <div style="position: fixed; height: 100%; width: 100%;">
            <div style="position: absolute; z-index: 1;
                        top: -2rem;
                        height: 100%; width: 100%;
                        background-position: center;
                        background-size: cover;
                        "
                        class="flex justify-center items-center"
            ></div>
            <!-- background-image: url(../../public/Bg_Camera.svg); -->
            <slot />

            <canvas ref="canvas"
                    :width="larguraTela" :height="alturaTela"
                    :class="cameraFront && 'canvasRevert'"
                    ></canvas>

            <template v-if="$q.platform.is.ios || $q.platform.is.android">
              <q-btn size="25px" flat icon="mdi-orbit-variant"
                    style="position: absolute; bottom: 2.5rem;
                          right: -0.3rem; z-index: 2;"
                    class="rotate" @click="mudaCamera">
                <q-tooltip class="bg-white text-primary">
                  Mudar a Câmera
                </q-tooltip>
              </q-btn>
            </template>
          </div>
      </q-card>

      <template v-if="modalCanvas">
        <q-dialog v-model="modalCanvas" class="bg-black " persistent>
          <q-card class="no-padding"
                  style="overflow: hidden; position: relative; bottom: 1.4rem;"
          >
          <!-- $q.platform.is.ios || $q.platform.is.android -->
            <q-btn dense icon="mdi-delete" color="primary" round
                  style="position: fixed; z-index: 2; left: 5px; top: 5px;"
                  @click="deleteImg" size="13px"/>

              <canvas ref="canvas" :width="larguraTela" :height="alturaTela"
                      style="object-fit: fill; position: fixed; left: 0; top: 0;">
              </canvas>
              <q-card-actions class="flex full-width "
                              :style="$q.platform.is.ios || $q.platform.is.android
                                      ? `position: fixed; bottom: 0.5rem; z-index: 2;
                                          gap: 5px; left: 85%; z - index: 5;
                                        `
                                      : `position: fixed; bottom: 0.5rem; z-index: 2;
                                         gap: 5px; left: 95%; z-index: 5;
                                        `
                                    "
              >
                <!-- <q-input outlined v-model="legendaFoto" class="full-width"
                        input-class="text-black"
                        label="Adiconar texto"
                        style="flex: 9;
                                background-color:rgb(255, 255, 255, 0.5)
                              "
                /> -->
                <q-btn round class="bg-primary"
                      flat icon="mdi-content-save"
                      color="white"
                      @click="enviarImagem"
                />
              </q-card-actions>
          </q-card>
        </q-dialog>
      </template>
    </q-dialog>
  </div>
</template>

<style lang="scss" scoped>
canvas {
  object-fit: fill;
  position: fixed;
  top: 0;
  left: 0;
}
.canvasRevert {
    -moz-transform: scaleX(-1);
    -o-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);
}

</style>
