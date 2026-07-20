import {Environment} from './environment.interface';

export const environment: Environment = {
  apiUrl: '/api',


  appName: 'Biblioteca JSA',
  version: '1.0.0',
  defaultLanguage: 'es',

  endpoints: {
    auth: {
      login: '/auth/login',
      registro: '/auth/registro',
      perfil: '/auth/perfil',
    },

    usuarios: {
      listar: '/usuarios',
      obtener: '/usuarios',
      crear: '/usuarios',
      actualizar: '/usuarios',
      eliminar: '/usuarios',
    },

    roles: {
      listar: '/roles',
      obtener: '/roles',
      crear: '/roles',
      actualizar: '/roles',
      eliminar: '/roles',
    },

    autores: {
      listar: '/autores',
      obtener: '/autores',
      crear: '/autores',
      actualizar: '/autores',
      eliminar: '/autores',
    },

    categorias: {
      listar: '/categorias',
      obtener: '/categorias',
      crear: '/categorias',
      actualizar: '/categorias',
      eliminar: '/categorias',
    },

    editoriales: {
      listar: '/editoriales',
      obtener: '/editoriales',
      crear: '/editoriales',
      actualizar: '/editoriales',
      eliminar: '/editoriales',
    },

    libros: {
      listar: '/libros',
      obtener: '/libros',
      crear: '/libros',
      actualizar: '/libros',
      eliminar: '/libros',
    },

    recursosDigitales: {
      listar: '/recursos-digitales',
      obtener: '/recursos-digitales',
      crear: '/recursos-digitales',
      actualizar: '/recursos-digitales',
      eliminar: '/recursos-digitales',
      porLibro: '/recursos-digitales/libro',
    },

    ejemplares: {
      listar: '/ejemplares',
      obtener: '/ejemplares',
      crear: '/ejemplares',
      actualizar: '/ejemplares',
      eliminar: '/ejemplares',
      porLibro: '/ejemplares/libro',
    },

    prestamos: {
      listar: '/prestamos',
      obtener: '/prestamos',
      crear: '/prestamos',
      actualizar: '/prestamos',
      eliminar: '/prestamos',
      misPrestamos: '/prestamos/mis-prestamos',
    },

    multas: {
      listar: '/multas',
      obtener: '/multas',
      crear: '/multas',
      actualizar: '/multas',
      eliminar: '/multas',
      misMultas: '/multas/mis-multas',
    },

    pagosMulta: {
      listar: '/pagos-multa',
      obtener: '/pagos-multa',
      crear: '/pagos-multa',
      actualizar: '/pagos-multa',
      eliminar: '/pagos-multa',
      porMulta: '/pagos-multa/multa',
    },

    reservas: {
      listar: '/reservas',
      obtener: '/reservas',
      crear: '/reservas',
      actualizar: '/reservas',
      eliminar: '/reservas',
      cancelar: '/reservas',
      misReservas: '/reservas/mis-reservas',
    },

    configuracionMulta: {
      listar: '/configuracion-multa',
      obtener: '/configuracion-multa',
      crear: '/configuracion-multa',
      actualizar: '/configuracion-multa',
      eliminar: '/configuracion-multa',
    },

    resenas: {
      listar: '/resenas',
      obtener: '/resenas',
      crear: '/resenas',
      actualizar: '/resenas',
      eliminar: '/resenas',
      porLibro: '/resenas/libro',
      misResenas: '/resenas/mis-resenas',
    },

    historial: {
      listar: '/historial',
      obtener: '/historial',
      crear: '/historial',
    },

    favoritos: {
      misFavoritos: '/favoritos/mis-favoritos',
      obtener: '/favoritos',
      agregar: '/favoritos',
      eliminar: '/favoritos',
    },

    test: {
      all: '/test/all',
      user: '/test/user',
      mod: '/test/mod',
      admin: '/test/admin',
    },
  },
};
