// @ts-nocheck
import { Router } from 'express';
import { autorControlador } from './autor.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearAutorSchema, actualizarAutorSchema } from './autor.validator';

const router = Router();

router.get('/', autorControlador.obtenerTodos);
router.get('/:id', autorControlador.obtenerPorId);

router.use(middlewareAutenticacion);
router.post('/', middlewareRol(['admin', 'bibliotecario']), validar(crearAutorSchema), autorControlador.crear);
router.patch('/:id', middlewareRol(['admin', 'bibliotecario']), validar(actualizarAutorSchema), autorControlador.actualizar);
router.delete('/:id', middlewareRol(['admin', 'bibliotecario']), autorControlador.eliminar);

export default router;
