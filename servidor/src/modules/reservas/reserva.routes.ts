// @ts-nocheck
import { Router } from 'express';
import { reservaControlador } from './reserva.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearReservaSchema, actualizarReservaSchema, filtroReservaSchema } from './reserva.validator';

const router = Router();
router.use(middlewareAutenticacion);

router.get('/', middlewareRol(['admin', 'bibliotecario']), validar(filtroReservaSchema, 'query'), reservaControlador.obtenerTodos);
router.get('/mis-reservas', middlewareRol(['admin', 'bibliotecario', 'docente', 'estudiante']), reservaControlador.misReservas);
router.get('/:id', middlewareRol(['admin', 'bibliotecario']), reservaControlador.obtenerPorId);
router.post('/', middlewareRol(['admin', 'bibliotecario', 'docente', 'estudiante']), validar(crearReservaSchema), reservaControlador.crear);
router.patch('/:id', middlewareRol(['admin', 'bibliotecario']), validar(actualizarReservaSchema), reservaControlador.actualizar);
router.delete('/:id', middlewareRol(['admin', 'bibliotecario']), reservaControlador.eliminar);

export default router;
