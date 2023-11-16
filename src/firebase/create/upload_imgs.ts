import {
  getDownloadURL, listAll, ref, uploadBytes,
} from 'firebase/storage';
import {
  addDoc, collection, serverTimestamp,
} from 'firebase/firestore/lite';
import { useDataStore } from 'src/stores/data-store';
import { useListImgagesStore } from 'src/stores/lista-imgs-store';
import { db, storage } from '../connect_db';

const store = useDataStore();
const storeListImgs = useListImgagesStore();

const uploadImg = async (img: Blob, $q: any) => {
  try {
    const listImgs = ref(storage, 'lista_de_imagens');
    const listImg = (await listAll(listImgs)).items;
    const existImg = listImg.some((data) => data.name === img?.name);

    if (existImg) {
      $q.dialog({
        title: 'Ops!',
        message: 'Já existe uma imagem com esse mesmo nome!',
      });
      return;
    }
    // console.log('Não existe ');
    const metadata = {
      contentType: 'image/png',
    };

    const spaceRef = ref(storage, `lista_de_imagens_vistantes/${img.name}`);
    const upload = await uploadBytes(spaceRef, img, metadata);
    const urlDownload = await getDownloadURL(spaceRef);

    const dataImageFirebase = {
      id_usuario: store.idUser,
      nome_usuario_responsavel: store.nome,
      email_usuario_responsavel: store.emailUser,
      nome_imagem: spaceRef.name,
      path_imagem: spaceRef.fullPath,
      url_download: urlDownload,
      data_criacao: serverTimestamp(),
    };

    await addDoc(collection(db, 'ListaDeVisitantes'), dataImageFirebase);

    storeListImgs.dadosImagens.push(dataImageFirebase);
  } catch (error: any) {
    // console.log(error);
    throw new Error('Algo deu errado', error);
  }
};

export { uploadImg };
