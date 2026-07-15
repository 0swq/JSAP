// @ts-nocheck
import { Router } from 'express';
import { rolControlador } from './rol.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearRolSchema, actualizarRolSchema } from './rol.validator';

const router = Router();
router.use(middlewareAutenticacion);
router.use(middlewareRol(['admin']));

router.get('/', rolControlador.obtenerTodos);
router.get('/:id', rolControlador.obtenerPorId);
router.post('/', validar(crearRolSchema), rolControlador.crear);
router.patch('/:id', validar(actualizarRolSchema), rolControlador.actualizar);
router.delete('/:id', rolControlador.eliminar);

export default router;
