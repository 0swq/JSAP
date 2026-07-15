// @ts-nocheck
import { Router } from 'express';
import { editorialControlador } from './editorial.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearEditorialSchema, actualizarEditorialSchema } from './editorial.validator';

const router = Router();

router.get('/', editorialControlador.obtenerTodos);
router.get('/:id', editorialControlador.obtenerPorId);

router.use(middlewareAutenticacion);
router.post('/', middlewareRol(['admin', 'bibliotecario']), validar(crearEditorialSchema), editorialControlador.crear);
router.patch('/:id', middlewareRol(['admin', 'bibliotecario']), validar(actualizarEditorialSchema), editorialControlador.actualizar);
router.delete('/:id', middlewareRol(['admin', 'bibliotecario']), editorialControlador.eliminar);

export default router;
