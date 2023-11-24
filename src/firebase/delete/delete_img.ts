import { doc, deleteDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from '../connect_db';

const deleImgStorage = async (pathImg: string) => {
  try {
    const storagePathRef = ref(storage, pathImg);

    deleteObject(storagePathRef);
  } catch (error) {
    throw new Error('Houve um erro na tentativa de exclusão da imagem do storage');
  }
};

const deleteImgFirestore = async (idImg: string, pathImagem: string) => {
  try {
    // deletando da collection ListaDeImagens
    await deleteDoc(doc(db, 'ListaDeVisitantes', idImg));

    await deleImgStorage(pathImagem);
  } catch (erro: any) { // eslint-disable-line
    throw new Error('Houve um erro na tentativa de exclusão do doc da collection');
  }
};

export { deleteImgFirestore };
