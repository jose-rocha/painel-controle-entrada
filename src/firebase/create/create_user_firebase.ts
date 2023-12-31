import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  doc, getDoc, serverTimestamp, setDoc,
} from 'firebase/firestore';
import { auth, db } from '../connect_db';

export const createUserFirebase = async (
  nome: string,
  cargo: string,
  email: string,
  password: string,
) => {
  // console.log(
  //   nome,
  //   cargo,
  //   email,
  //   password,
  // );

  try {
    const create = await createUserWithEmailAndPassword(auth, email, password);

    const { user } = create;
    const userDocRef = doc(db, 'Users', user.uid);
    const docSnapshot = await getDoc(userDocRef);

    const useUidRouterGuard = doc(db, 'use_uid_router_guard', user.uid);
    const docSnapshotRouterGuard = await getDoc(useUidRouterGuard);

    if (!docSnapshot.exists()) {
      await setDoc(userDocRef, {
        avatar: null,
        data_criacao: serverTimestamp(),
        email_usuario: email,
        user_id: user.uid,
        nome,
        cargo,
      });

      await setDoc(useUidRouterGuard, {
        email_usuario: email,
        user_id: user.uid,
      });
    }

    // if (!docSnapshotRouterGuard.exists()) {
    //   await setDoc(useUidRouterGuard, {
    //     email_usuario: email,
    //     user_id: user.uid,
    //   });
    // }
    // console.log('Dados atrelado com sucesso!');

    // console.log(user.uid);
  } catch (error: any) {//eslint-disable-line
    const errorCode = error.code;
    // const errorMessage = error.message;

    // console.log(errorCode);
    throw new Error(errorCode);
  }
};
