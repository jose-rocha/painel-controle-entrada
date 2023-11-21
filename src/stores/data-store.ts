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
    avatarUrl: '',
    pathStorageImage: '',
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
