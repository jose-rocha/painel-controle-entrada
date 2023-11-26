<script setup lang="ts">
// import { useQuasar, format } from 'quasar';
import { useQuasar } from 'quasar';
import { useListImgagesStore } from 'src/stores/lista-imgs-store';
import { getListImgStorage } from 'src/firebase/read/get_list_imgs';
import { deleteImgFirestore } from '../firebase/delete/delete_img';

const $q = useQuasar();
const storeListImgs = useListImgagesStore();
// const { humanStorageSize } = format;

// const getListImgs = async () => {
//   storeListImgs.dadosImagens = await getListImgStorage();
// };
// getListImgs();

(async () => getListImgStorage())();

// (async () => {
//   const dt = await teste();

//   console.log(dt);
// })();

const deletImg = async (imagemIdDoc: string, pathImagem: string) => {
  console.log(imagemIdDoc, pathImagem);

  $q.dialog({
    title: 'Atenção!',
    message: 'Tem certeza que quer apagar essa imagem?',
    cancel: 'Cancelar',
  }).onOk(async () => {
    await deleteImgFirestore(imagemIdDoc, pathImagem);

    // await getListImgs();
    await getListImgStorage();
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
      <q-card flat bordered class="my-card full-width">
        <template v-if="!storeListImgs.dadosImagens?.length">
          <q-card-section
            class="justify-center text-center text-bold text-h5"
            style="padding-block: 6.09rem"
          >
            <q-icon name="mdi-alert-circle-outline" size="md" />
            Nenhum Visitante Cadastrado!
          </q-card-section>
        </template>

        <template v-else>
          <q-card-section
            class="flex justify-center text-center text-bold text-h5 full-width no-margin"
          >
            <span class="text-secondary q-mr-md" style="font-size: 2rem">
              Visitantes Cadastrados!
            </span>
            <q-icon name="mdi-account-card" size="md" color="secondary" />
            <div class="full-width">
              <span>Quantidade de Visitantes: </span>
              {{ storeListImgs.dadosImagens.length }}
            </div>
          </q-card-section>

          <q-card-section
            :class="'flex' + ' '
                  + (storeListImgs.dadosImagens.length >= 4 && 'justify-center')
            "
            style="gap: 20px"
          >
            <template
              v-for="dadosImagem in storeListImgs.dadosImagens"
              :key="dadosImagem"
            >
            <div class="flex column">
              <div style="flex: 1; gap: 5px;" class="flex column q-px-md">
                <!-- Responsável Portaria -->
                <div class="flex items-end" style="gap: 5px;">
                  <q-icon name="mdi-boom-gate-up" size="md" color="primary" />
                  <span class="text-bold text-primary">
                    Responsável Portaria:
                  </span>
                  {{ dadosImagem.doc.nome_responsavel_portaria }}
                  <span >
                  </span>
                </div>
                  <!-- Parentesco -->
                <div class="flex items-end" style="gap: 5px;">
                  <q-icon
                    :name="dadosImagem.doc.parentesco_do_aluno === 'Responsavel'
                        ?'mdi-account-group' : 'mdi-account-tie'" size="md"
                    style="margin-left: -0.5rem;"
                    color="secondary"
                  />
                  <span class="text-bold text-secondary">
                    {{ dadosImagem.doc.parentesco_do_aluno === 'Responsavel'
                        ? 'Parentesco:' : 'Visitante ou terceiro:'
                    }}
                  </span>
                    {{ dadosImagem.doc.parentesco_do_aluno === 'Responsavel'
                        ? 'Responsável'
                        : dadosImagem.doc.parentesco_do_aluno
                    }}
                </div>
                <!-- Nome do Visitante ou Responsável -->
                <div class="flex items-end" style="gap: 2px;">
                  <q-icon
                    :name="dadosImagem.doc.parentesco_do_aluno === 'Responsavel'
                      ?'mdi-account-child': 'mdi-account-hard-hat'"
                    size="md"
                    style="margin-left: -0.5rem;"
                    color="secondary"
                  />
                  <span class="text-bold text-secondary q-mr-xs">
                    {{ dadosImagem.doc.parentesco_do_aluno === 'Responsavel'
                        ? ' Nome do Responsável:': 'Nome do Visitante:'
                    }}
                  </span>
                  {{ dadosImagem.doc.nome_responsavel_aluno }}
                </div>
                <!-- Nome do ALuno -->
                <template v-if="dadosImagem.doc.parentesco_do_aluno === 'Responsavel'">
                  <div class="flex items-end" style="gap: 3px;">
                    <q-icon
                      name="mdi-account" size="md"
                      style="margin-left: -0.5rem;"
                      color="secondary"
                    />
                    <span class="text-bold text-secondary">
                      Nome do Aluno:
                    </span>
                    {{ dadosImagem.doc.nome_aluno }}
                  </div>
                </template>

                <!-- Data e hora -->
                <div class="flex items-end" style="gap: 5px">
                  <q-icon
                    name="mdi-calendar-clock" size="md"
                    style="margin-left: -0.3rem;"
                    color="secondary"
                  />
                  <span class="text-bold text-secondary">
                    Data e Hora da Visita:
                  </span>
                  {{ dataCadastroFormatada(dadosImagem) }}
                </div>
              </div>

              <div style="flex: 1;" class="flex items-end q-mt-sm q-px-md">
                <q-img
                  :src="dadosImagem.doc.url_download"
                  style="width: 300px; height: 200px"
                  fit="cover"
                >
                  <div class="absolute-bottom text-subtitle1 text-center">
                    <q-icon
                      name="mdi-delete"
                      @click="deletImg(dadosImagem.id_doc, dadosImagem.doc.url_download)"
                      class="cursor-pointer absolute-top-right q-mt-xs"
                      size="sm"
                    />
                  </div>
                </q-img>
              </div>
              </div>
            </template>
          </q-card-section>
        </template>
      </q-card>
    </div>
  </q-page>
</template>
