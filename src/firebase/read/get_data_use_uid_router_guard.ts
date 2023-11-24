import { collection, getDocs } from 'firebase/firestore';
import { db } from '../connect_db';

const useUidRouterGuardFirebase = async (id: string) => {
  const docsRef = collection(db, 'use_uid_router_guard');
  const list = await getDocs(docsRef);

  return list.docs.some(
    (data) => (data.id === id),
  );
};

export { useUidRouterGuardFirebase };
