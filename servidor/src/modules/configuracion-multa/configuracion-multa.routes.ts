// @ts-nocheck
import { Router } from 'express';
import { configuracionMultaControlador } from './configuracion-multa.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearConfiguracionMultaSchema, actualizarConfiguracionMultaSchema } from './configuracion-multa.validator';

const router = Router();
router.use(middlewareAutenticacion);

router.get('/', middlewareRol(['admin', 'bibliotecario']), configuracionMultaControlador.obtener);
router.get('/:id', middlewareRol(['admin', 'bibliotecario']), configuracionMultaControlador.obtenerPorId);
router.post('/', middlewareRol(['admin']), validar(crearConfiguracionMultaSchema), configuracionMultaControlador.crear);
router.patch('/:id', middlewareRol(['admin']), validar(actualizarConfiguracionMultaSchema), configuracionMultaControlador.actualizar);

export default router;
