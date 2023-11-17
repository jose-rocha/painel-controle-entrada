import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../connect_db';

export const resetPasswordFirebase = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('sucesso');
  } catch (error) {
    console.log(error);
  }

  // return reset;
};
