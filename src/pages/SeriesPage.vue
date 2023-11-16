<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';

import { getDataSeries } from 'src/firebase/read/get_data_series';

import PoupEditSerie from 'src/components/PoupEditSerie.vue';
import { useDataStore } from 'src/stores/data-store';

const store = useDataStore();
const $q = useQuasar();
const dialog = ref(false);

onMounted(() => {
  $q.loading.show();
});

(async () => {
  store.series = await getDataSeries();

  if (store.series.length) $q.loading.hide();
})();

const openDialog = (
  anoLancamentoSerieParams: string,
  idDocumentoSerieParams: string,
  paisSerieParams: string,
  resumoSerieParams: string,
  tituloSerieParams: string,
) => {
  store.dataEditSerieStore.ano_lancamento_serie = anoLancamentoSerieParams;
  store.dataEditSerieStore.idDocumentoSerie = idDocumentoSerieParams;
  store.dataEditSerieStore.titulo_serie = tituloSerieParams;
  store.dataEditSerieStore.pais_serie = paisSerieParams;
  store.dataEditSerieStore.resumo_serie = resumoSerieParams;
  store.dataEditSerieStore.titulo_serie = tituloSerieParams;

  dialog.value = true;
};
</script>

<template>
  <q-page class="flex row items-center justify-center">
    <div class="q-gutter-xs row justify-center"
         :style="$q.screen.lt.md ? 'max-width: 90%;' : 'max-width: 70%;'">
      <q-list :class="$q.screen.lt.md && 'q-mt-xl'">
        <template v-for="(serie) in store.series?.sort((a: any, b: any) =>
                         a.doc.titulo_serie?.localeCompare(b.doc.titulo_serie))"
                         :key="serie.id_documento">
          <q-item>
            <q-item-section
              class="cursor-pointer"
            >
              <q-item-label>Titulo da Série:
                {{ serie.doc?.titulo_serie }} </q-item-label>
              <q-item-label caption lines="15">
                <span class="text-bold"> Resumo da Série:  </span>
                {{ serie.doc.resumo_serie }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label caption>
                <span class="text-bold"> Ano de lançamento: </span>
                 {{ serie.doc.ano_lancamento_serie }}
              </q-item-label>

              <q-item-label
                     class="flex justify-center items-center"
                     style="gap: 10px;"
              >
                  Editar Série
                <q-icon
                    name="mdi-pencil"
                    size="sm"
                    style="position: relative;
                           bottom: 3px;
                           cursor: pointer;"
                    @click="openDialog(
                      serie.doc?.ano_lancamento_serie,
                      serie.id_documento,
                      serie.doc?.pais_serie,
                      serie.doc?.resumo_serie,
                      serie.doc?.titulo_serie,
                      )"
                />

              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced inset />
        </template>
      </q-list>

      <template v-if="dialog">
        <poup-edit-serie
          :isDialog="dialog"
          @cancel="dialog = false"
          @save-data-emit="dialog = false"
        />
      </template>
    </div>
  </q-page>
</template>
