import {
  collection, getDocs, query, orderBy, onSnapshot,
} from 'firebase/firestore';
import { db } from '../connect_db';

import { useListImgagesStore } from '../../stores/lista-imgs-store';

const storeListImgs = useListImgagesStore();

const getListImgStorage = async () => {
  const docsRef = collection(db, 'ListaDeVisitantes');
  const docOrderBy = query(docsRef, orderBy('data_criacao', 'desc'));

  storeListImgs.unsubscribe = onSnapshot(docOrderBy, (querySnapShot) => {
    storeListImgs.dadosImagens = querySnapShot.docs.map(
      (data) => ({ doc: data.data(), id_doc: data.id }),
    );

    return storeListImgs.dadosImagens;
  });

  try {
    return storeListImgs.unsubscribe;
  } catch (erro: any) { // eslint-disable-line
    console.log(erro); // eslint-disable-line
  }

  return storeListImgs.unsubscribe;
};

export { getListImgStorage };
