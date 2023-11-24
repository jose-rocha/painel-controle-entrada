import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  collection, getDocs, query, where,
} from 'firebase/firestore';
import { useDataStore } from 'src/stores/data-store';
import { auth, db } from '../connect_db';

const store = useDataStore();

type $qObjetType = {
  dialog: (data: object) => void;
};

const loginFirebase = async (email: string, password: string, $q: $qObjetType) => {
  try {
    const sign = await signInWithEmailAndPassword(auth, email, password);
    const { user } = sign;

    const usersColection = collection(db, 'Users');
    const userVerify = query(usersColection, where('email_usuario', '==', user.email));
    const getUsers = await getDocs(userVerify);

    const verifyJobUser = await getUsers.docs.filter(async (snapshot) => {
      const cargo = await snapshot.data().cargo;

      if (cargo === 'administrador') {
        store.accessToken = user.accessToken;
        store.isLogged = true;

        return;
      }

      $q.dialog({
        title: 'Ops!',
        message: 'Esse usuário não tem permissão para fazer login!',
        persistent: true,
      }).onOk(() => {
        store.idUser = '';
      });
    });

    return { verifyJobUser, user };
  } catch (error: any) {		// eslint-disable-line
    store.isLogged = false;

    throw new Error(error);
  }
};

export { loginFirebase };
