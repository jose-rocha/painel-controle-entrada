import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { serverTimestamp, doc, updateDoc } from 'firebase/firestore/lite';
import { useDataStore } from 'src/stores/data-store';
import { db, storage } from '../connect_db';

type $qObjetType = {
  dialog: (data: object) => void;
};

const store = useDataStore();

export const updateAvatarFirebase = async (img: Blob, idUser: string, $q: $qObjetType) => {
  const dirAvatar = ref(storage, `avatar_perfil/${idUser}/avatar.png`);
  const upload = await uploadBytes(dirAvatar, img);
  const urlDownload = await getDownloadURL(dirAvatar);

  // console.log(dirAvatar.fullPath.replace('avatar_perfil/', ''));

  const docUser = doc(db, 'Users', idUser);

  try {
    await updateDoc(docUser, {
      avatar: urlDownload,
      atualizado_em: serverTimestamp(),
      path_avatar_storage: dirAvatar.fullPath,
    });

    store.avatarUrl = urlDownload;
    store.pathStorageImage = dirAvatar.fullPath;
  } catch (error) {
    $q.dialog({
      title: 'Ops!',
      message: `Ocorreu um erro ao tentar modificar o avatar: ${error}`,
    });
  }
};
