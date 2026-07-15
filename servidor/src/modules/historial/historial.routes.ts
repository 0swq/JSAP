// @ts-nocheck
import { Router } from 'express';
import { historialControlador } from './historial.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearHistorialSchema, filtroHistorialSchema } from './historial.validator';

const router = Router();
router.use(middlewareAutenticacion);

router.get('/', middlewareRol(['admin', 'bibliotecario']), validar(filtroHistorialSchema, 'query'), historialControlador.obtenerTodos);
router.get('/:id', middlewareRol(['admin', 'bibliotecario']), historialControlador.obtenerPorId);
router.post('/', middlewareRol(['admin', 'bibliotecario']), validar(crearHistorialSchema), historialControlador.crear);

export default router;
