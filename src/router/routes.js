const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'candidatos', name: 'candidatos', component: () => import('src/pages/CandidatosPage.vue') },
      { path: 'form-Candidatos/:id?', name: 'formCandidatos', component: () => import('pages/formCandidatos.vue') },
      { path: 'concursos', name: 'concursos', component: () => import('src/pages/ConcursosPage.vue') },
      { path: 'form-Concursos/:id?', name: 'formConcursos', component: () => import('pages/formConcursos.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
