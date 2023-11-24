import {
  collection, getDocs, query, orderBy,
} from 'firebase/firestore';
import { db } from '../connect_db';

const getListImgStorage = async () => {
  const docsRef = collection(db, 'ListaDeVisitantes');
  const docOrderBy = query(docsRef, orderBy('data_criacao', 'desc'));
  const listImgs = await getDocs(docOrderBy);

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
