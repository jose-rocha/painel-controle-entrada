import { useDataStore } from 'src/stores/data-store';
import {
  collection, getDocs, query, where,
} from 'firebase/firestore/lite';
import { db } from '../connect_db';

const store = useDataStore();

const getDataUserAuth = async () => {
  const usersColection = collection(db, 'Users');
  const queryUserAuth = query(usersColection, where('user_id', '==', store.idUser));

  const querySnapshot = await getDocs(queryUserAuth);
  const dataUserLoged = querySnapshot.docs.map((snapshot) => {
    const user = snapshot.data();

    store.nome = user.nome;
    store.emailUser = user.email_usuario;

    return user;
  });

  return dataUserLoged;
};

export { getDataUserAuth };
