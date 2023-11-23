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
  console.log(
    nome,
    cargo,
    email,
    password,
  );

  try {
    const create = await createUserWithEmailAndPassword(auth, email, password);

    const { user } = create;
    const userDocRef = doc(db, 'Users', user.uid);
    const docSnapshot = await getDoc(userDocRef);

    if (!docSnapshot.exists()) {
      await setDoc(userDocRef, {
        avatar: null,
        data_criacao: serverTimestamp(),
        email_usuario: email,
        user_id: user.uid,
        nome,
        cargo,
      });

      console.log('Dados atrelado com sucesso!');
    }

    // console.log(user.uid);
  } catch (error: any) {
    const errorCode = error.code;
    // const errorMessage = error.message;

    // console.log(errorCode);
    throw new Error(errorCode);
  }
};
