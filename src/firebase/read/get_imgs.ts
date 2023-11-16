import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../connect_db';

// const storageRef = ref(storage, 'images_teste');

// const listRef = ref(storage, 'lista_de_imagens/netflix.png');

// const getImgStorage = async () => {
//   // try {
//   //   const listImg = (await listAll(listRef)).items;

//   //   return listImg.map((data) => data); // eslint-disable-line)
//   // } catch (error: any) { //eslint-disable-line
//   //   throw new Error('Algo deu errado', error);
//   // }
// };
const getImgStorage = async () => {
  const listImgs = ref(storage, 'lista_de_imagens');
  const listImg = (await listAll(listImgs)).items;

  try {
    return listImg.map(async (data) => {
      const listRef = ref(storage, `lista_de_imagens/${data.name}`);
      // console.log(listRef);

      const getUrl = await getDownloadURL(listRef);

      // console.log(getUrl);

      return getUrl;
    });
  } catch (erro: any) {
    console.log(erro);
  }

  return listImg;
};

export { getImgStorage };
