import { defineStore } from 'pinia';
import { DataImagesArryInterface } from 'src/types/listImgsStore';

export const useListImgagesStore = defineStore('listImages', {
  state: (): DataImagesArryInterface => ({
    dadosImagens: [],
  }),
  persist: true,
});
