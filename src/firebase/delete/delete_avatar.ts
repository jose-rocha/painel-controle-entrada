import {
  doc, deleteDoc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useDataStore } from 'src/stores/data-store';
import { db, storage } from '../connect_db';

const store = useDataStore();

const deleImgStorage = async (pathImg: string) => {
  try {
    const storagePathRef = ref(storage, pathImg);

    deleteObject(storagePathRef);
  } catch (error) {
    throw new Error('Houve um erro na tentativa de exclusão da imagem do storage');
  }
};

const deleteAvatarFirebase = async (idImg: string, pathImagem: string, idUser: string) => {
  try {
    const docUser = await doc(db, 'Users', idUser);

    // atualizando a collection Users referente ao usuário
    await updateDoc(docUser, {
      avatar: null,
      atualizado_em: serverTimestamp(),
      path_avatar_storage: null,
    });

    await deleImgStorage(pathImagem);

    store.avatarUrl = null;
    store.pathStorageImage = null;
  } catch (erro: any) {
		// eslint-disable-line
    throw new Error('Houve um erro na tentativa de exclusão do doc da collection');
  }
};

export { deleteAvatarFirebase };
