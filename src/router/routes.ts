import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ name: 'login', path: '', component: () => import('pages/IndexPage.vue') }],
  },

  {
    path: '/logado',
    component: () => import('layouts/AuthenticateLayout.vue'),
    children: [
      { name: 'home', path: '/home', component: () => import('pages/HomePage.vue') },
      {
        name: 'cadastrar_usuario',
        path: '/cadastrar_usuario',
        component: () => import('pages/RegisterUserPage.vue'),
      },
      {
        name: 'gerenciar_conta',
        path: '/gerenciar_conta',
        component: () => import('pages/ManagerAccountPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
