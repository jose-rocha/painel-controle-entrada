<script setup lang="ts">
// import { useQuasar, format } from 'quasar';
import { useQuasar } from 'quasar';
import { useListImgagesStore } from 'src/stores/lista-imgs-store';
import { getListImgStorage } from 'src/firebase/read/get_list_imgs';
import { deleteImgFirestore } from '../firebase/delete/delete_img';

const $q = useQuasar();
const storeListImgs = useListImgagesStore();
// const { humanStorageSize } = format;

const getListImgs = async () => {
  storeListImgs.dadosImagens = await getListImgStorage();
};
getListImgs();

const deletImg = (imagemIdDoc: string, pathImagem: string) => {
  $q.dialog({
    title: 'Atenção!',
    message: 'Tem certeza que quer apagar essa imagem?',
    cancel: 'Cancelar',
  }).onOk(async () => {
    await deleteImgFirestore(imagemIdDoc, pathImagem);

    await getListImgs();
  });
};

const dataCadastroFormatada = (dataImg: object) => {
  const data = {
    nanoseconds: dataImg.doc?.data_criacao?.nanoseconds,
    seconds: dataImg.doc?.data_criacao?.seconds,
  };

  const date = new Date(data.seconds * 1000 + data.nanoseconds / 1000000);
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');
  const ano = date.getFullYear();
  const horas = String(date.getHours()).padStart(2, '0');
  const minutos = String(date.getMinutes()).padStart(2, '0');
  const dataFormatada = `${dia}/${mes}/${ano} ${horas}:${minutos}`;

  return dataFormatada;
};
</script>

<template>
  <q-page class="flex column items-center">
    <div class="flex items-center q-mt-md full-width q-px-md">
      <q-card flat bordered class="my-card full-width " >
        <template v-if="!storeListImgs.dadosImagens.length">
          <q-card-section
            class="justify-center text-center
                   text-bold text-h5"
            style="padding-block: 6.09rem ;"
          >
              <q-icon
                name="mdi-alert-circle-outline"
                size="md"
              />
              Nenhum Visitante Cadastrado!
          </q-card-section>
        </template>

        <template v-else>
          <q-card-section
            class="flex justify-center  text-center
                   text-bold text-h5 full-width no-margin"
          >
            <span
              class="text-secondary q-mr-md"
              style="font-size: 2rem;"
              >
              Visitantes Cadastrados!
            </span>
            <q-icon name="mdi-account-card"
                    size="md" color="secondary"
            />
            <div class="full-width">
              <span>Quantidade de Visitantes: </span>
              {{ storeListImgs.dadosImagens.length }}
            </div>
          </q-card-section>

          <q-card-section
            :class="('flex')+ ' '
            +(storeListImgs.dadosImagens.length >= 4 && 'justify-center')"
            style="gap: 20px;"
          >
            <template v-for="dadosImagem in storeListImgs.dadosImagens" :key="dadosImagem">
              <div class="flex column">
                <div class="flex column justify-center items-center">
                <span class="text-bold text-secondary">Responsável Portaria:</span>
                {{ dadosImagem.doc.nome_responsavel_portaria}}
                </div>

                <div class="flex column justify-center items-center">
                <span class="text-bold text-secondary">Data e hora da visita:</span>
                {{dataCadastroFormatada(dadosImagem)}}
                </div>

                <q-img
                  :src="dadosImagem.doc.url_download"
                  style="width: 300px; height: 200px; "
                  fit="contain"
              >
              <div class="absolute-bottom text-subtitle1 text-center">
                  <q-icon name="mdi-delete"
                          @click="deletImg( dadosImagem.id_doc, dadosImagem.doc.url_download)"
                          class="cursor-pointer absolute-top-right q-mt-xs"
                          size="sm"
                  />
                </div>
              </q-img>

              </div>
            </template>
          </q-card-section>
        </template>
      </q-card>
    </div>
  </q-page>
</template>
