import { defineStore } from 'pinia';
import { dataStoreInterface } from 'src/types/dataStore';

export const useDataStore = defineStore('data', {
  state: () : dataStoreInterface => ({
    isLogged: false,
    showLoginOrResetPass: false,
    accessToken: '',
    idUser: '',
    emailUser: '',
    nome: '',
    series: [{
      doc: {
        id_usuario: '',
        titulo_serie: '',
        resumo_serie: '',
        pais_serie: '',
        ano_lancamento_serie: '',
      },
      id_documento: '',
    },
    ],
    dataEditSerieStore: {
      titulo_serie: '',
      resumo_serie: '',
      pais_serie: '',
      ano_lancamento_serie: '',
      idDocumentoSerie: '',
    },
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2,
  // },
  // actions: {
  //   increment() {
  //     this.counter += 1;
  //   },
  // },
  persist: true,
});
