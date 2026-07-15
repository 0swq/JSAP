export interface Environment {
  apiUrl: string;
  appName: string;
  version: string;
  defaultLanguage: string;
  endpoints: EndpointsConfig;
}

export interface EndpointsConfig {
  auth: AuthEndpoints;
  usuarios: CrudEndpoints;
  roles: CrudEndpoints;
  autores: CrudEndpoints;
  categorias: CrudEndpoints;
  editoriales: CrudEndpoints;
  libros: CrudEndpoints;
  recursosDigitales: RecursosDigitalesEndpoints;
  ejemplares: EjemplaresEndpoints;
  prestamos: PrestamosEndpoints;
  multas: MultasEndpoints;
  pagosMulta: PagosMultaEndpoints;
  reservas: ReservasEndpoints;
  configuracionMulta: CrudEndpoints;
  resenas: ResenasEndpoints;
  historial: HistorialEndpoints;
  favoritos: FavoritosEndpoints;
  test: TestEndpoints;
}

export interface AuthEndpoints {
  login: string;
  registro: string;
  perfil: string;
}

export interface CrudEndpoints {
  listar: string;
  obtener: string;
  crear: string;
  actualizar: string;
  eliminar: string;
}

export interface RecursosDigitalesEndpoints extends CrudEndpoints {
  porLibro: string;
}

export interface EjemplaresEndpoints extends CrudEndpoints {
  porLibro: string;
}

export interface PrestamosEndpoints extends CrudEndpoints {
  misPrestamos: string;
}

export interface MultasEndpoints extends CrudEndpoints {
  misMultas: string;
}

export interface PagosMultaEndpoints extends CrudEndpoints {
  porMulta: string;
}

export interface ReservasEndpoints extends CrudEndpoints {
  misReservas: string;
  cancelar: string;
}

export interface ResenasEndpoints extends CrudEndpoints {
  porLibro: string;
  misResenas: string;
}

export interface HistorialEndpoints {
  listar: string;
  obtener: string;
  crear: string;
}

export interface FavoritosEndpoints {
  misFavoritos: string;
  obtener: string;
  agregar: string;
  eliminar: string;
}

export interface TestEndpoints {
  all: string;
  user: string;
  mod: string;
  admin: string;
}
