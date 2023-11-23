import { useDataStore } from 'src/stores/data-store';
import {
  collection, getDocs, query, where,
} from 'firebase/firestore';
import { db } from '../connect_db';

const store = useDataStore();

const getDataUserAuth = async () => {
  const usersColection = collection(db, 'Users');
  const queryUserAuth = query(usersColection, where('user_id', '==', store.idUser));

  const getUsers = await getDocs(usersColection);

  getUsers.docs.map((snapshot) => (snapshot.data()));

  const querySnapshot = await getDocs(queryUserAuth);
  const dataUserLoged = querySnapshot.docs.map((snapshot) => {
    const user = snapshot.data();

    store.nome = user.nome;
    store.emailUser = user.email_usuario;
    store.avatarUrl = user.avatar;

    // console.log(user);

    store.pathStorageImage = user.path_avatar_storage;

    return user;
  });

  return { dataUserLoged, getUsers };
};

export { getDataUserAuth };
