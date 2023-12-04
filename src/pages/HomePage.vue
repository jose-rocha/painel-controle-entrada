<script setup lang="ts">
// import { useQuasar, format } from 'quasar';
import { useQuasar } from 'quasar';
import { useListImgagesStore } from 'src/stores/lista-imgs-store';
import { getListImgStorage } from 'src/firebase/read/get_list_imgs';
import { computed, ref } from 'vue';
import { deleteImgFirestore } from '../firebase/delete/delete_img';

const $q = useQuasar();
const storeListImgs = useListImgagesStore();

const dateJS = new Date();
const dayJS = dateJS.getDate();
const monthJS = dateJS.getMonth() + 1;
const yearJS = dateJS.getFullYear();

const dateInitial = ref(`${String(dayJS).padStart(2, '0')}/${String(monthJS).padStart(2, '0')}/${yearJS}`);
const dateEnd = ref(`${String(dayJS).padStart(2, '0')}/${String(monthJS).padStart(2, '0')}/${yearJS}`);
// const date = computed(() => dateUtils.formatDate(dateRef.value, 'MM.DD.YY'));

// console.log(dateInitial.value);

(async () => getListImgStorage(dateInitial.value))();

const deletImg = async (imagemIdDoc: string, pathImagem: string) => {
  // console.log(imagemIdDoc, pathImagem);

  $q.dialog({
    title: 'Atenção!',
    message: 'Tem certeza que quer apagar essa imagem?',
    cancel: 'Cancelar',
  }).onOk(async () => {
    await deleteImgFirestore(imagemIdDoc, pathImagem);

    // await getListImgs();
    // await getListImgStorage();
  });
};

const dataCadastroFormatada = (dataImg: object) => {
  const { nanoseconds, seconds } = dataImg.doc.data_criacao;
  const data = {
    nanoseconds,
    seconds,
  };

  // console.log(data.nanoseconds);

  const date = new Date(data.seconds * 1000 + data.nanoseconds / 1000000);
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');
  const ano = date.getFullYear();
  const horas = String(date.getHours()).padStart(2, '0');
  const minutos = String(date.getMinutes()).padStart(2, '0');
  const dataFormatada = `${dia}/${mes}/${ano} ${horas}:${minutos}`;

  return dataFormatada;
};

const myLocale = {
  /* starting with Sunday */
  days: 'Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
  daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
  months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julio_Agosto_Setembr_Outubro_Novembro_Dezembro'.split('_'),
  monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
  firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
  format24h: true,
  pluralDay: 'dias',
};

const dateParse = (dateParams: string) => {
  const partesData = String(dateParams).split('/');
  const day = partesData[0];
  const month = partesData[1];
  const year = partesData[2];

  const dataAmericana = `${month}/${day}/${year}`;

  return dataAmericana;
};

const filteredDateCardsImgs = computed(() => (
  storeListImgs?.dadosImagens.filter((data) => {
    const { nanoseconds, seconds } = data.doc.data_criacao;

    const dataTime = {
      nanoseconds,
      seconds,
    };

    const date = new Date(dataTime.seconds * 1000 + dataTime.nanoseconds / 1000000);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const ano = date.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;
    const dataFormatadaAmericana = dateParse(dataFormatada);

    const dateInitialAmericana = dateParse(dateInitial.value);
    const dateEndAmericana = dateParse(dateEnd.value);

    return dateInitial.value === dateEnd.value
      ? (dataFormatada >= dateInitial.value && dataFormatada <= dateEnd.value)
      : (
        dataFormatadaAmericana >= dateInitialAmericana
        && dataFormatadaAmericana <= dateEndAmericana
      );
  })
));
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
            class="flex justify-center text-center text-bold text-h5 full-width column no-margin"
          >
            <span class="text-secondary q-mr-md" style="font-size: 2rem">
              <q-icon name="mdi-account-card" size="md" color="secondary" />
              Quantidade de  Visitantes Cadastrados! <br>
              <span class="text-white">{{ storeListImgs.dadosImagens.length }}</span>
            </span>
            <div class="full-width">
            </div>

             <!-- Calendários -->
             <!-- {{ filteredDateCardsImgs }} -->
             <div class="flex justify-center q-ma-md" style="gap: 2rem" >
              <div>
                <span>Data Inicial</span>
                <q-input filled v-model="dateInitial" mask="##/##/####" >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date mask="DD/MM/YYYY" v-model="dateInitial" :locale="myLocale" >
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="OK" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div>
                <span>Data Final</span>
                <q-input filled v-model="dateEnd" mask="##/##/####" >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date mask="DD/MM/YYYY" v-model="dateEnd" >
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Ok" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <!-- Calendários -->
            <template v-if="dateInitial !== dateEnd">
              <span>Quantidade de Visitantes nas Datas Selecionadas:
                {{ filteredDateCardsImgs.length }}
              </span>
            </template>
          </q-card-section>

          <q-card-section
            :class="
              'flex' + ' ' + (storeListImgs.dadosImagens.length >= 4 && 'justify-center')
            "
            style="gap: 20px"
          >
            <template
              v-for="dadosImagem in filteredDateCardsImgs"
              :key="dadosImagem"
            >
              <q-card class="flex column q-py-md q-px-sm">
                <div style="flex: 1" class="flex items-end q-mt-sm q-px-md">
                  <q-img
                    :src="dadosImagem.doc.url_download"
                    style="width: 300px; height: 200px"
                    fit="cover"
                  >
                    <div class="absolute-bottom text-subtitle1 text-center">
                      <q-icon
                        name="mdi-delete"
                        @click="
                          deletImg(dadosImagem.id_doc, dadosImagem.doc.url_download)
                        "
                        class="cursor-pointer absolute-top-right q-mt-xs"
                        size="sm"
                      />
                    </div>
                  </q-img>
                </div>
                <div style="flex: 1; gap: 5px" class="flex column q-px-md q-mt-md">
                  <!-- Responsável Portaria -->
                  <div class="flex items-end" style="gap: 5px">
                    <q-icon name="mdi-boom-gate-up" size="md" color="primary" />
                    <span class="text-bold text-primary"> Responsável Portaria: </span>
                    {{ dadosImagem.doc.nome_responsavel_portaria }}
                    <span> </span>
                  </div>
                  <!-- Parentesco -->
                  <div class="flex items-end" style="gap: 15px">
                    <q-card-section class="text-white no-padding">
                      <div>
                        <q-icon
                          :name="
                            dadosImagem.doc.parentesco_do_aluno === 'Responsavel'
                              ? 'mdi-account-group'
                              : 'mdi-account-tie'
                          "
                          size="45px"
                          :style="
                            dadosImagem.doc.parentesco_do_aluno !== 'Responsavel' &&
                            'margin-left: -0.7rem'
                          "
                          color="secondary"
                        />
                        <span
                          class="text-bold text-secondary"
                          :style="
                            dadosImagem.doc.parentesco_do_aluno === 'Responsavel'
                              ? 'position: absolute; top: 5px; right: 6px'
                              : 'position: absolute; top: 0px; width: 150px'
                          "
                        >
                          {{
                            dadosImagem.doc.parentesco_do_aluno === 'Responsavel'
                              ? ' Parentesco:'
                              : 'Visitante ou terceiro:'
                          }}
                        </span>
                      </div>

                      <div
                        class="text-subtitle2"
                        style="dadosImagem.doc.parentesco_do_aluno === 'Responsavel' ?
                          margin-left: 2.7rem;
                          line-height: 5px;
                          position: relative;
                          top: -12px;
                        "
                        :style="
                          dadosImagem.doc.parentesco_do_aluno === 'Responsavel'
                            ? `margin-left: 3.5rem;
                               line-height: 5px;
                               position: relative;
                               top: -14px;
                               `
                            : `margin-left: 2.3rem;
                               line-height: 5px;
                               position: relative;
                               top: -14px;
                               `
                        "
                      >
                        {{
                          dadosImagem.doc.parentesco_do_aluno === 'Responsavel'
                            ? ' Responsável'
                            : dadosImagem.doc.parentesco_do_aluno
                        }}
                      </div>
                    </q-card-section>
                  </div>

                  <!-- Nome do Visitante ou Responsável -->
                  <q-card-section class="text-white no-padding">
                    <div>
                      <q-icon
                        :name="
                          dadosImagem.doc.parentesco_do_aluno === 'Responsavel'
                            ? 'mdi-account-child'
                            : 'mdi-account-hard-hat'
                        "
                        size="lg"
                        style="margin-left: -0.5rem"
                        color="secondary"
                      />
                      <span
                        class="text-bold text-secondary q-mr-xs"
                        style="position: absolute"
                      >
                        {{
                          dadosImagem.doc.parentesco_do_aluno === 'Responsavel'
                            ? ' Nome do Responsável:'
                            : ' Nome do Visitante:'
                        }}
                      </span>
                    </div>

                    <div
                      class="text-subtitle2"
                      style="
                        margin-left: 1.9rem;
                        line-height: 5px;
                        position: relative;
                        top: -12px;
                      "
                    >
                      {{ dadosImagem.doc.nome_responsavel_aluno }}
                    </div>
                  </q-card-section>
                  <!-- Nome do ALuno -->
                  <template v-if="dadosImagem.doc.parentesco_do_aluno === 'Responsavel'">
                    <q-card-section class="text-white no-padding">
                      <div>
                        <q-icon
                          name="mdi-account"
                          size="lg"
                          style="margin-left: -0.5rem"
                          color="secondary"
                        />
                        <span
                          class="text-bold text-secondary q-mr-xs"
                          style="position: absolute"
                        >
                          Nome do Aluno:
                        </span>
                      </div>
                      <div
                        class="text-subtitle2"
                        style="
                          margin-left: 1.9rem;
                          line-height: 5px;
                          position: relative;
                          top: -12px;
                        "
                      >
                        {{ dadosImagem.doc.nome_aluno }}
                      </div>
                    </q-card-section>
                  </template>

                  <!-- Data e hora -->
                  <div class="flex items-end" style="gap: 5px">
                    <q-icon
                      name="mdi-calendar-clock"
                      size="md"
                      style="margin-left: -0.4rem"
                      color="secondary"
                    />
                    <span class="text-bold text-secondary"> Data e Hora da Visita:  </span>
                    {{ dataCadastroFormatada(dadosImagem) }}
                  </div>
                </div>
              </q-card>
            </template>
          </q-card-section>
        </template>
      </q-card>
    </div>
  </q-page>
</template>
