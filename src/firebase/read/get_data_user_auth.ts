import { useDataStore } from 'src/stores/data-store';
import {
  collection, getDocs, query, where,
} from 'firebase/firestore';
import { db } from '../connect_db';

const store = useDataStore();

interface userAuthInteface {
  atualizado_em:{seconds: number, nanoseconds: number},
  avatar: string,
  cargo: string,
  data_criacao: {seconds: number, nanoseconds:number},
  email_usuario: string,
  nome: string,
  path_avatar_storage: string,
  user_id: string,
}

const getDataUserAuth = async () => {
  const usersColection = collection(db, 'Users');
  const queryUserAuth = query(usersColection, where('user_id', '==', store.idUser));

  const getUsers = await getDocs(usersColection);

  getUsers.docs.map((snapshot) => (snapshot.data()));

  const querySnapshot = await getDocs(queryUserAuth);
  const dataUserLoged = querySnapshot.docs.map((snapshot) => {
    /* eslint-disable camelcase */
    const {
      avatar, email_usuario,
      nome, path_avatar_storage,
    } = snapshot.data() as userAuthInteface;

    store.nome = nome;
    store.emailUser = email_usuario;
    store.avatarUrl = avatar;

    // console.log(user);

    store.pathStorageImage = path_avatar_storage;

    return {
      avatar,
      email_usuario,
      nome,
      path_avatar_storage,
    };
  });

  return { dataUserLoged, getUsers };
};

export { getDataUserAuth };
