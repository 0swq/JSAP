// @ts-nocheck
import { Router } from 'express';
import { usuarioControlador } from './usuario.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearUsuarioSchema, actualizarUsuarioSchema, filtroUsuarioSchema } from './usuario.validator';

const router = Router();

router.post('/login', validar(crearUsuarioSchema), usuarioControlador.login);
router.use(middlewareAutenticacion);

router.get('/', middlewareRol(['admin', 'bibliotecario']), validar(filtroUsuarioSchema, 'query'), usuarioControlador.obtenerTodos);
router.get('/me', middlewareRol(['admin', 'bibliotecario', 'docente', 'estudiante']), usuarioControlador.perfilPropio);
router.get('/nombre/:id', middlewareRol(['admin', 'bibliotecario', 'docente', 'estudiante']), usuarioControlador.obtenerNombrePorId);
router.get('/:id', middlewareRol(['admin', 'bibliotecario']), usuarioControlador.obtenerPorId);
router.post('/', middlewareRol(['admin']), validar(crearUsuarioSchema), usuarioControlador.crear);
router.patch('/:id', middlewareRol(['admin']), validar(actualizarUsuarioSchema), usuarioControlador.actualizar);
router.delete('/:id', middlewareRol(['admin']), usuarioControlador.eliminar);

export default router;
