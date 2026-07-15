// @ts-nocheck
import { Router } from 'express';
import { prestamoControlador } from './prestamo.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearPrestamoSchema, actualizarPrestamoSchema, filtroPrestamoSchema } from './prestamo.validator';

const router = Router();
router.use(middlewareAutenticacion);

router.get('/', middlewareRol(['admin', 'bibliotecario']), validar(filtroPrestamoSchema, 'query'), prestamoControlador.obtenerTodos);
router.get('/mis-prestamos', middlewareRol(['admin', 'bibliotecario', 'docente', 'estudiante']), prestamoControlador.misPrestamos);
router.get('/:id', middlewareRol(['admin', 'bibliotecario']), prestamoControlador.obtenerPorId);
router.post('/', middlewareRol(['admin', 'bibliotecario', 'docente', 'estudiante']), validar(crearPrestamoSchema), prestamoControlador.crear);
router.patch('/:id', middlewareRol(['admin', 'bibliotecario']), validar(actualizarPrestamoSchema), prestamoControlador.actualizar);

export default router;
