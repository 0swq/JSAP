// @ts-nocheck
import { Router } from 'express';
import { pagoMultaControlador } from './pago-multa.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearPagoMultaSchema, actualizarPagoMultaSchema } from './pago-multa.validator';

const router = Router();
router.use(middlewareAutenticacion);
router.use(middlewareRol(['admin', 'bibliotecario']));

router.get('/', pagoMultaControlador.obtenerTodos);
router.get('/multa/:multaId', pagoMultaControlador.obtenerPorMulta);
router.get('/:id', pagoMultaControlador.obtenerPorId);
router.post('/', validar(crearPagoMultaSchema), pagoMultaControlador.crear);
router.patch('/:id', validar(actualizarPagoMultaSchema), pagoMultaControlador.actualizar);

export default router;
