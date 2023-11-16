export const errosFNHelper = (err: any, $q: any) => {
  if (err.message === 'Requested device not found') {
    // console.log(err.message);
    $q.dialog({
      title: 'Ops!',
      message: 'Dispositivo de câmera não existe.',
    });
  } else if (err.message === 'Permission denied') {
    $q.dialog({
      title: 'Opsss!',
      message: 'Você não permitiu o acesso a câmera.',
    });
  } else if (err.message === 'Could not start video source') {
    $q.dialog({
      title: 'Opsss!',
      message: 'Não foi possível iniciar a fonte de vídeo, tente novamente.',
    });
  } else {
    $q.dialog({
      title: 'Opsss!',
      message: err.message,
    });
  }
};
