import { collection, getDocs } from 'firebase/firestore/lite';
import { useListImgagesStore } from 'src/stores/lista-imgs-store';
import { db } from '../connect_db';

const getListImgStorage = async () => {
  const listImgs = await getDocs(collection(db, 'ListaDeVisitantes'));

  try {
    return listImgs.docs.map(
      (data) => ({ doc: data.data(), id_doc: data.id }),
    );
  } catch (erro: any) { // eslint-disable-line
    console.log(erro); // eslint-disable-line
  }

  return listImgs;
};

export { getListImgStorage };
