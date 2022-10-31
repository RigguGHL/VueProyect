import { createRouter, createWebHistory } from 'vue-router'
import { auth, db } from '@/utils/firebase.js'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
  },

  // Rutas del usuaruio de tipo entrevistador
  {
    path: '/entrevistador',
    name: 'entrevistador',
    component: () => import('../views/entrevistador/TablaView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/entrevistador/evaluar',
    name: 'experiencia',
    component: () => import('../views/entrevistador/FormularioView.vue'),
    meta: {
      requiresAuth: true
    }
  },

  // Rutas del usuaruio de tipo admin
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/TablaView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin/registrar',
    name: 'registro',
    component: () => import('../views/admin/FormularioView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin/candidatos',
    name: 'candidatos',
    component: () => import('../views/entrevistador/TablaView.vue'),
    meta: {
      requiresAuth: true
    }
  },

  // Rutas del usuaruio de tipo recursos humanos
  {
    path: '/rrhh',
    name: 'rh',
    component: () => import('../views/rrhh/TablaView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/rrhh/agregar',
    name: 'agregar',
    component: () => import('../views/rrhh/FormularioView.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Auth guard para verificar si la ruta necesita autenticación y si el usuario esta logueado
// Tambien verifica el tipo de usuario y si puede entrar a la ruta
router.beforeEach(async (to, from, next) => {

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const user = await auth.getCurrentUser()
  
  if (requiresAuth && !user) {
    next('login');

  } else if (user) {
    const userData = await db.getDocData("usuarios",user.uid);

    if (to.path.includes(userData.userType))
      next();
    else 
      next(userData.userType)

  } else {
    next()
  }
});

export default router
