import { collection, getDocs } from 'firebase/firestore/lite';
import { db } from '../connect_db';

const getDataSeries = async () => {
  const querySnapshot = await getDocs(collection(db, 'Series'));

  const dataSeriesFirebase = querySnapshot.docs.map((docParams) => (
    { doc: docParams.data(), id_documento: docParams.id }
  ));

  // console.log('getDataSeries');

  return dataSeriesFirebase;
};

export { getDataSeries };
