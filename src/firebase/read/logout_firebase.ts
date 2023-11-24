import { signOut } from 'firebase/auth';
import { useDataStore } from 'src/stores/data-store';
import { auth } from '../connect_db';

const store = useDataStore();

const logoutFirebase = () => {
  signOut(auth).then(() => {
    store.isLogged = false;
  // Sign-out successful.
  }).catch((error) => {
    console.log(error);
    store.isLogged = true;
  // An error happened.
  });
};

export { logoutFirebase };
