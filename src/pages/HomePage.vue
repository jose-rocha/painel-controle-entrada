<script setup lang="ts">
import { useQuasar, format } from 'quasar';
// import { ref } from 'vue';

import { useListImgagesStore } from 'src/stores/lista-imgs-store';
import { getListImgStorage } from 'src/firebase/read/get_list_imgs';
// import { uploadImg } from '../firebase/create/upload_imgs';

import { deleteImgFirestore } from '../firebase/delete/delete_img';

const $q = useQuasar();
// const { humanStorageSize } = format;

// const filesImgs = ref();
// const maxFileSize = ref('990048');
const storeListImgs = useListImgagesStore();
// const listImagesFirebase = ref([]);

const getListImgs = async () => {
  storeListImgs.dadosImagens = await getListImgStorage();
};
getListImgs();

// const onRejected = () => {
//   $q.notify({
//     type: 'negative',
//     message: `O tamanho do arquivo excede o limite permitido que é
//     ${humanStorageSize(Number(maxFileSize.value))}`,
//     icon: 'mdi-file-image-remove-outline',
//     classes: 'text-bold',
//   });
// };

// // Só é aceito arquivos do tipo png ou jpg
// const sendImg = async () => {
//   $q.loading.show();

//   try {
//     await uploadImg(filesImgs.value, $q);

//     // storeListImgs.dadosImagens = await getListImgStorage();
//     await getListImgs();

//     $q.loading.hide();
//   } catch (error: any) {  //eslint-disable-line
//     console.log(error); //eslint-disable-line

//     $q.dialog({
//       title: 'Ops!',
//       message: 'Houve um erro inesperado, tente novamente',
//     });

//     $q.loading.hide();
//   } finally {
//     filesImgs.value = null;
//   }
// };

const deletImg = (imagemIdDoc: string, pathImagem: string) => {
  $q.dialog({
    title: 'Atenção!',
    message: 'Tem certeza que quer apagar essa imagem?',
    cancel: 'Cancelar',
  }).onOk(async () => {
    // storeListImgs.dadosImagens.filter((item, i) => {
    //   if (i === indexParams) {
    //     console.log('é igual');
    //     storeListImgs.dadosImagens.splice(i, 1);
    //   }
    //   return item;
    // });

    await deleteImgFirestore(imagemIdDoc, pathImagem);

    // storeListImgs.dadosImagens = await getListImgStorage();
    await getListImgs();
  });
};

// (async () => {
//   const data = await getImgStorage();

//   data.map(async (img) => listImagesFirebase.value.push(await img));
// })();

// const getImg = async () => getImgStorage();
</script>

<template>
  <q-page class="flex column items-center">
    <!-- <div class="row justify-center q-pt-xl q-px-md q-mb-xl full-width">
      <q-card flat bordered class="my-card col-12 col-lg-5 col-sm-7 col-xs-5" >

        <q-card-section class="flex column justify-center items-center">
          <q-icon name="mdi-image" size="100px"  />
          <div class="text-h6">
            Adicione sua imagem
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none flex column" style="gap: 10px;">
          <q-file
            class="full-width q-mb-xs"
            v-model="filesImgs"
            rounded
            outlined
            label="Imagens suportadas, png e jpeg"
            accept=".jpg, .png, image/*"
            :max-file-size="maxFileSize"
            @rejected="onRejected"
          >
          <template v-if="filesImgs" v-slot:append>
            <q-icon name="mdi-delete"
                    @click.stop.prevent="filesImgs = null"
                    class="cursor-pointer"
            />
          </template>
          </q-file>

          <q-btn
            :label="filesImgs ? 'Enviar imagem' : 'Primeiro Selecione a imagem'"
            no-caps
            color="primary"
            padding="sm"
            rounded
            @click="sendImg"
            :disable="!filesImgs"
            :icon-right=" !filesImgs ? 'mdi-image' : 'cloud_upload'"
          />
        </q-card-section>
      </q-card>
    </div> -->

    <div class="flex items-center q-mt-md full-width q-px-md">
      <q-card flat bordered class="my-card full-width " >
        <template v-if="!storeListImgs.dadosImagens.length">
          <q-card-section
            class="justify-center text-center
                    text-bold text-h5
                  "
                  style="padding-block: 6.09rem ;"
          >
              <q-icon name="mdi-alert-circle-outline"
                      size="md"
              />
              Nenhum Visitante Cadastrado!
          </q-card-section>
        </template>

        <template v-else>
          <q-card-section
            :class="('flex')+' '
            +(storeListImgs.dadosImagens.length >= 4 && 'justify-center')"
            style="gap: 20px;"
          >
            <q-img
              v-for="(imagem) in storeListImgs.dadosImagens"
              :key="imagem?.id_doc"
              :src="imagem.doc?.url_download"
              style="width: 300px; height: 200px; "
              fit="contain"
            >

              <div class="absolute-bottom text-subtitle1 text-center">
                <q-icon name="mdi-delete"
                        @click="deletImg( imagem.id_doc, imagem.doc.path_imagem)"
                        class="cursor-pointer absolute-top-right q-mt-xs"
                        size="sm"
                />
                <!-- {{ imagem }} -->
              </div>
            </q-img>
          </q-card-section>
        </template>
      </q-card>
    </div>
  </q-page>
</template>
