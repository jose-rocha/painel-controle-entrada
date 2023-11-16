interface DataImgInterface {
  doc:
    {
      data_criação: { seconds: number | string, nanoseconds: number | string },
      email_usuario_responsavel: string,
      id_usuario: string,
      nome_imagem: string,
      nome_usuario_responsavel: string,
      path_imagem: string,
      url_download: string,
    },
    id_doc: string,

}

export interface DataImagesArryInterface {
  dadosImagens: DataImgInterface[]
}
