export interface dataStoreInterface {
  isLogged: boolean;
  showLoginOrResetPass: boolean;
  accessToken: string;
  idUser: string;
  emailUser: string;
  nome: string;
  avatarUrl: string | null;
  pathStorageImage: string | null;
}
