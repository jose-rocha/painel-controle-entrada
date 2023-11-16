import {
  collection, addDoc, getDocs, serverTimestamp,
} from 'firebase/firestore/lite';

import { useDataStore } from 'src/stores/data-store';
import { db } from '../connect_db';

const store = useDataStore();

const registerSerieFirebase = async (
  tituloParams: string,
  resumoParams: string,
  anoLancamentoParams: string,
  paisParams: string,
) => {
  try {
    // console.log(tituloParams);
    if (tituloParams === '') {
      return;
    }

    const docRef = await addDoc(collection(db, 'Series'), {
      id_usuario: store.idUser,
      nome_usuario_responsavel: store.nome,
      email_usuario_responsavel: store.emailUser,
      titulo_serie: tituloParams,
      resumo_serie: resumoParams,
      ano_lancamento_serie: anoLancamentoParams,
      pais_serie: paisParams,
      data_cadastro: serverTimestamp(),
    });

    // console.log(docRef);

    // console.log('Document written with ID: ', docRef);
  } catch (e) {
    console.error('Error adding document: ', e);

    throw new Error('Um erro aconteceu');
  }
};

export { registerSerieFirebase };
