import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDataStore } from 'src/stores/data-store';
import { auth } from '../connect_db';

const store = useDataStore();

const loginFirebase = async (email: string, password: string) => {
  try {
    const sign = await signInWithEmailAndPassword(auth, email, password);

    const { user } = sign;

    if (user.accessToken) {
      store.accessToken = user.accessToken;
      store.isLogged = true;
    }

    return user;
  } catch (error: any) {
    store.isLogged = false;

    throw new Error(error);
  }
};

export { loginFirebase };
