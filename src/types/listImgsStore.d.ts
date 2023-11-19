interface DataImgInterface {
  doc:
  {
  data_criacao: { seconds: number | string; nanoseconds: number | string },
  email_usuario_responsavel: string,
  id_usuario: string,
  nome_imagem: string,
  nome_responsavel_portaria: string,
  url_download: string,
  nome_responsavel_aluno: string,
  parentesco_do_aluno: string,
  },
  id_doc: string,
}

export interface DataImagesArryInterface {
  dadosImagens: DataImgInterface[]
}
