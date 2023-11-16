import { doc, serverTimestamp, updateDoc } from 'firebase/firestore/lite';
import { useDataStore } from 'src/stores/data-store';
import { db } from '../connect_db';

const store = useDataStore();
// const idDoc = store.dataEditSerieStore.idDocumentoSerie;

export const updateSerieFirebase = async (
  idDocParams: string,
  anoLancamentoSerie: string,
  paisSerieParams: string,
  resumoSerieParams: string,
  tituloSerieParams: string,
) => {
  const usersColection = doc(db, 'Series', idDocParams);

  try {
    const update = await updateDoc(usersColection, {
      ano_lancamento_serie: anoLancamentoSerie,
      pais_serie: paisSerieParams,
      resumo_serie: resumoSerieParams,
      titulo_serie: tituloSerieParams,
      atualizado_em: serverTimestamp(),
    });

    console.log('Atualização concluída com sucesso'); // eslint-disable-line

    return update;
  } catch (error) {
    console.log(error); // eslint-disable-line
  }

  return true;
};
