<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useQuasar } from 'quasar';
// import LoginComponent from 'src/components/LoginComponent.vue';
import { getDataCollection } from '../firebase/connect_db.js';

// const searchCep = ref('09792470');
const $q = useQuasar();

interface getCepInterface {
  logradouro: string,
  complemento: string,
  bairro: string,
  localidade: string,
  uf: string,
  cepNaoEncontrado: boolean,
  erro: false,
}
const dadosCep = reactive({
  cep: '',
  logradouro: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  cepNaoEncontrado: false,
});

getDataCollection();

const cepLoading = ref(false);

const searchCep = async () => {
  cepLoading.value = true;
  dadosCep.cepNaoEncontrado = false;

  try {
    const getCep: getCepInterface = await (await fetch(`https://viacep.com.br/ws/${dadosCep.cep}/json/`)).json();

    dadosCep.logradouro = getCep.logradouro;
    dadosCep.complemento = getCep.complemento;
    dadosCep.bairro = getCep.bairro;
    dadosCep.cidade = getCep.localidade;
    dadosCep.uf = getCep.uf;

    const verificaCampoVazios = Object.values(getCep);
    verificaCampoVazios.some((campo) => {
      if (campo === '') dadosCep.cepNaoEncontrado = true;

      return dadosCep.cepNaoEncontrado;
    });

    if (getCep?.erro) {
      $q?.dialog({
        title: 'Ops',
        message: 'Cep não encontrado!',
        persistent: false,
      });
      dadosCep.cepNaoEncontrado = true;
    }

    // console.log(dadosCep.cepNaoEncontrado);
  } catch (error) {
    console.log(error);
  }
  cepLoading.value = false;

  // 09750-420
};

const executeSearchCep = computed(
  () => dadosCep.cep.length >= 8 && searchCep(),
);
// const enableBtn = computed(() => dadosCep.cep.length >= 8);
</script>

<template>
  <q-page class="flex row items-center justify-center">
      <div class="flex justify-center full-width" style="gap: 10px;" >
        <h5 class="q-my-xs text-bold full-width
                  text-center text-primary">
          <q-icon name="mdi-map-marker-path" size="xl"/> <br>
          Pesquise o CEP
        </h5>

        <div class="row justify-center full-width " style="gap: 5px;">
          <q-input v-model="dadosCep.cep" label="Cep" autofocus
                   @update:model-value="() =>  executeSearchCep"
                   :loading="cepLoading"
                   class=" q-pl-sm col-5" mask="#####-###"
                   unmasked-value>
            <template v-slot:append>
                <q-icon name="mdi-map-clock-outline" color="primary" />
            </template>
          </q-input>

          <q-input v-model="dadosCep.logradouro"
                   label="Logradouro" class="q-pl-sm col-5"
                   :disable="!dadosCep.cepNaoEncontrado" >
            <template v-slot:append>
              <q-icon name="mdi-road-variant" color="primary"/>
            </template>
          </q-input>
        </div>

        <div class="row full-width justify-center" style="gap: 5px;">
          <q-input v-model="dadosCep.complemento"
                   label="Complemento" class="q-pl-sm col-5"
                   :disable="!dadosCep.cepNaoEncontrado" >
            <template v-slot:append>
              <q-icon name="mdi-boom-gate" color="primary" />
            </template>
          </q-input>

          <q-input v-model="dadosCep.bairro"
                   label="Bairro" class="q-pl-sm col-5"
                   :disable="!dadosCep.cepNaoEncontrado">
            <template v-slot:append>
              <q-icon name="mdi-home-group" color="primary" />
            </template>
          </q-input>
        </div>

        <div class="row full-width justify-center" style="gap: 5px;">
          <q-input v-model="dadosCep.cidade"
                   label="Cidade" class="q-pl-sm col-5"
                   :disable="!dadosCep.cepNaoEncontrado" >
            <template v-slot:append>
              <q-icon name="mdi-city-variant-outline" color="primary" />
            </template>
          </q-input>

          <q-input v-model="dadosCep.uf"
                   label="UF" class="q-pl-sm col-5"
                   :disable="!dadosCep.cepNaoEncontrado" >
            <template v-slot:append>
              <q-icon name="mdi-city" color="primary" />
            </template>
          </q-input>
        </div>

        <!-- <div class="full-width row justify-center ">
          <q-btn label="Buscar cep" class="bg-secondary q-pa-md"
                 sty disabledle="width: 75.5rem"
                 @click="searchCepBtn" :disable="!enableBtn"/>
        </div> -->
      </div>
  </q-page>
</template>
