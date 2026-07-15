import {Routes} from '@angular/router';
import {AuthGuard} from './_helpers/auth.guard';
import {RoleGuard} from './_helpers/role.guard';

import {InicioComponent} from './modulos/inicio.component';
import {LoginComponent} from './modulos/auth/login.component';
import {RegisterComponent} from './modulos/auth/register.component';
import {CatalogoListadoComponent} from './modulos/libros-publico/catalogo-listado.component';
import {LibroDetalleComponent} from './modulos/libros-publico/libro-detalle.component';
import {MapaComponent} from './modulos/libros-publico/mapa';
import {LibroInformacionComponent} from './modulos/libros-publico/libro-informacion.component';

import {ProfileComponent} from './modulos/usuario/perfil.component';
import {RealizarReservaComponent} from './modulos/usuario/realizar-reserva';
import {RealizarPrestamoComponent} from './modulos/usuario/realizar-prestamo';
import {MisPrestamosComponent} from './modulos/usuario/mis-prestamos.component';
import {MisMultasComponent} from './modulos/usuario/mis-multas.component';
import {MisReservasComponent} from './modulos/usuario/mis-reservas.component';
import {MisFavoritosComponent} from './modulos/usuario/mis-favoritos.component';
import {MisResenasComponent} from './modulos/usuario/mis-resenas.component';
import {DashboardComponent} from './modulos/admin/dashboard.component';
import {AdminUsuariosComponent} from './modulos/admin/usuarios.component';
import {AdminRolesComponent} from './modulos/admin/roles.component';
import {ConfiguracionMultaComponent} from './modulos/admin/configuracion-multa.component';
import {AdminLibrosComponent} from './modulos/admin/libros.component';
import {CrearLibroComponent} from './modulos/admin/crear-libro.component';
import {EditarLibroComponent} from "./modulos/admin/editar-libro.component";

import {AdminEjemplaresComponent} from './modulos/admin/ejemplares.component';
import {AdminPrestamosComponent} from './modulos/admin/prestamos.component';
import {DevolverLibroComponent} from './modulos/admin/devolver-libro.component';
import {AdminMultasComponent} from './modulos/admin/multas.component';
import {DetalleMultaComponent} from './modulos/admin/detalle-multa.component';
import {PagarMultaComponent} from './modulos/admin/pagar-multa.component';
import {AdminPagosComponent} from './modulos/admin/pagos.component';
import {AdminReservasComponent} from './modulos/admin/reservas.component';
import {AdminAutoresComponent} from './modulos/admin/autores.component';
import {CrearAutorComponent} from './modulos/admin/crear-autor.component';
import {EditarAutorComponent} from './modulos/admin/editar-autor.component';
import {AdminCategoriasComponent} from './modulos/admin/categorias.component';
import {CrearCategoriaComponent} from './modulos/admin/crear-categoria.component';
import {EditarCategoriaComponent} from './modulos/admin/editar-categoria.component';
import {AdminEditorialesComponent} from './modulos/admin/editoriales.component';
import {CrearEditorialComponent} from './modulos/admin/crear-editorial.component';
import {EditarEditorialComponent} from './modulos/admin/editar-editorial.component';
import {AdminRecursosDigitalesComponent} from './modulos/admin/recursos-digitales.component';
import {AdminHistorialComponent} from './modulos/admin/historial.component';
import {AgregarEjemplarComponent} from './modulos/admin/agregar-ejemplar.component';
const routes: Routes = [
  {path: 'inicio', component: InicioComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'catalogo', component: CatalogoListadoComponent},
  {path: 'catalogo/:id', component: LibroDetalleComponent},
  {path: 'mapa', component: MapaComponent},

  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'realizar-reserva/:id', component: RealizarReservaComponent, canActivate: [AuthGuard]},
  {path: 'realizar-reserva', component: RealizarReservaComponent, canActivate: [AuthGuard]},
  {path: 'realizar-prestamo/:id', component: RealizarPrestamoComponent, canActivate: [AuthGuard]},
  {path: 'realizar-prestamo', component: RealizarPrestamoComponent, canActivate: [AuthGuard]},
  {path: 'mis-prestamos', component: MisPrestamosComponent, canActivate: [AuthGuard]},
  {path: 'mis-multas', component: MisMultasComponent, canActivate: [AuthGuard]},
  {path: 'mis-reservas', component: MisReservasComponent, canActivate: [AuthGuard]},
  {path: 'mis-favoritos', component: MisFavoritosComponent, canActivate: [AuthGuard]},
  {path: 'mis-resenas', component: MisResenasComponent, canActivate: [AuthGuard]},
  {path: 'informacion-libro', component: LibroInformacionComponent, canActivate: [AuthGuard]},

  {path: 'admin/libros', component: AdminLibrosComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/libros/crear', component: CrearLibroComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/libros/editar/:id', component: EditarLibroComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/libros/:id/agregar-ejemplar', component: AgregarEjemplarComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/ejemplares', component: AdminEjemplaresComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/prestamos', component: AdminPrestamosComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/prestamos/devolver', component: DevolverLibroComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/prestamos/devolver/:id', component: DevolverLibroComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/multas', component: AdminMultasComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/multas/detalle/:id', component: DetalleMultaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/multas/pagar/:id', component: PagarMultaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/pagos', component: AdminPagosComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/reservas', component: AdminReservasComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/autores', component: AdminAutoresComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/autores/crear', component: CrearAutorComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/autores/editar/:id', component: EditarAutorComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/categorias', component: AdminCategoriasComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/categorias/crear', component: CrearCategoriaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/categorias/editar/:id', component: EditarCategoriaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/editoriales', component: AdminEditorialesComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/editoriales/crear', component: CrearEditorialComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/editoriales/editar/:id', component: EditarEditorialComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/recursos-digitales', component: AdminRecursosDigitalesComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/historial', component: AdminHistorialComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},

  {path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin']}},
  {path: 'admin/usuarios', component: AdminUsuariosComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin']}},
  {path: 'admin/roles', component: AdminRolesComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin']}},
  {path: 'admin/configuracion-multa', component: ConfiguracionMultaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin']}},

  {path: '', redirectTo: 'inicio', pathMatch: 'full'},
];

export default routes;
