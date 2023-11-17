interface dataEditSerieStoreType {
  idDocumentoSerie: string,
  titulo_serie: string;
  resumo_serie: string;
  pais_serie: string;
  ano_lancamento_serie: string;
}

interface dataSerieStoreType {
  id_usuario: string;
  titulo_serie: string;
  resumo_serie: string;
  pais_serie: string;
  ano_lancamento_serie: string;
}

export interface dataStoreInterface {
  isLogged: boolean;
  showLoginOrResetPass: boolean;
  accessToken: string;
  idUser: string;
  emailUser: string;
  nome: string;
  series: {
    doc: dataSerieStoreType;
    id_documento: string;
  }[];
  dataEditSerieStore: dataEditSerieStoreType;
}
