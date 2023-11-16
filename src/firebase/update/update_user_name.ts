import { doc, serverTimestamp, updateDoc } from 'firebase/firestore/lite';
import { useDataStore } from 'src/stores/data-store';
import { db } from '../connect_db';

const store = useDataStore();

const updateUserNameFirebase = async (nomeUserEdit: string) => {
  const usersColection = doc(db, 'Users', store.idUser);

  try {
    const update = await updateDoc(usersColection, {
      nome: nomeUserEdit,
      atualizado_em: serverTimestamp(),
    });
    store.nome = nomeUserEdit;

    return update;
  } catch (error) {
    console.log(error);
  }

  return nomeUserEdit;
};

export { updateUserNameFirebase };
