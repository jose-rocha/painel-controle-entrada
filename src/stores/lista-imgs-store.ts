import { defineStore } from 'pinia';
import { DataImagesArryInterface } from 'src/types/listImgsStore';

export const useListImgagesStore = defineStore('listImages', {
  state: (): DataImagesArryInterface => ({
    dadosImagens: [],
  }),
  persist: true,
});

// {
//   data_criação: { seconds: '', nanoseconds: '' },
//   email_usuario_responsavel: '',
//   id_usuario: '',
//   nome_imagem: '',
//   nome_usuario_responsavel: '',
//   path_imagem: '',
//   url_download: '',
// },
