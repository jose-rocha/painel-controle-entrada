<script setup lang="ts">
import { useQuasar } from 'quasar';
import { getDataSeries } from 'src/firebase/read/get_data_series';
import { updateSerieFirebase } from 'src/firebase/update/update_series';

import { useDataStore } from 'src/stores/data-store';
import { useRouter } from 'vue-router';

const store = useDataStore();
const $q = useQuasar();
const router = useRouter();

const props = defineProps({
  isDialog: Boolean,
});
const emits = defineEmits(['saveDataEmit', 'cancel']);
const idDoc = store.dataEditSerieStore.idDocumentoSerie;

const updateSerie = async () => {
  try {
    await updateSerieFirebase(
      idDoc,
      store.dataEditSerieStore.ano_lancamento_serie,
      store.dataEditSerieStore.pais_serie,
      store.dataEditSerieStore.resumo_serie,
      store.dataEditSerieStore.titulo_serie,
    );

    await getDataSeries();
    emits('saveDataEmit');

    store.series?.map((data) => {
      if (data.id_documento === store.dataEditSerieStore.idDocumentoSerie) {
        data.doc.titulo_serie = store.dataEditSerieStore.titulo_serie;
        data.doc.resumo_serie = store.dataEditSerieStore.resumo_serie;
        data.doc.pais_serie = store.dataEditSerieStore.pais_serie;
        data.doc.ano_lancamento_serie = store.dataEditSerieStore.ano_lancamento_serie;
      }

      return store.dataEditSerieStore;
    });

    store.dataEditSerieStore = {
      titulo_serie: '',
      resumo_serie: '',
      pais_serie: '',
      ano_lancamento_serie: '',
      idDocumentoSerie: '',
    };

    router.replace({ path: 'lista_series' });
  } catch (error) {
    console.log(error);

    // const erroMessage = `
    //   FirebaseError: Invalid document reference.
    //   Document references must have an even number of
    //   segments, but Series has 1.
    // `;

    store.dataEditSerieStore = {
      titulo_serie: '',
      resumo_serie: '',
      pais_serie: '',
      ano_lancamento_serie: '',
      idDocumentoSerie: '',
    };

    if (String(error).includes('Invalid document reference')) {
      $q?.dialog({
        title: 'Ops',
        message: `
          Referência de documento inválida.
          As referências de documentos devem ter um número par de segmentos,
          mas a Série tem 1
        `,
        persistent: true,
      });

      return;
    }

    $q?.dialog({
      title: 'Ops',
      message: 'Um erro inesperado aconteceu, tente novamente!',
      persistent: true,
    });
  }
};

const cancelar = () => {
  emits('cancel');

  store.dataEditSerieStore = {
    titulo_serie: '',
    resumo_serie: '',
    pais_serie: '',
    ano_lancamento_serie: '',
    idDocumentoSerie: '',
  };
};

</script>

<template>
  <div class="q-pa-md" style="position: absolute;">
    <q-dialog :model-value="props.isDialog" persistent>
      <q-card style="width: 100%;">
        <h4 class="text-center text-bold text-primary q-my-md">
          Editando Série
          <q-icon name="mdi-movie-edit"
                        color="primary" />
        </h4>

        <q-card-section >
        <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="white" /> -->
          <q-input v-model="store.dataEditSerieStore.titulo_serie"
                    autofocus
                    label="Editando o Título da Série"
                    class="q-pl-sm"
          >
            <template v-slot:append>
                <q-icon name="mdi-movie-edit"
                        color="primary" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section >
          <q-input v-model="store.dataEditSerieStore.ano_lancamento_serie"
                    autofocus
                    label="Editando Ano da Série"
                    class="q-pl-sm"
                    mask="####"
          >
            <template v-slot:append>
                <q-icon name="mdi-calendar"
                        color="primary" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section >
          <q-input v-model="store.dataEditSerieStore.pais_serie"
                    autofocus
                    label="Editando o País da Série"
                    class="q-pl-sm"
          >
            <template v-slot:append>
                <q-icon name="mdi-map-marker-multiple"
                        color="primary" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section >

          <q-input
            v-model="store.dataEditSerieStore.resumo_serie"
            filled
            type="textarea"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat no-caps
                  label="Cancelar"
                  color="primary"
                  v-close-popup
                  @click="cancelar"
          />
          <q-btn flat  no-caps
                  label="Salvar"
                  icon-right="mdi-content-save-edit"
                  color="primary"
                  v-close-popup
                  @click="updateSerie"
          />
                  <!-- @click="updateName" -->
        </q-card-actions>

      </q-card>
    </q-dialog>
  </div>
</template>
