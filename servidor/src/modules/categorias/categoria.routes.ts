// @ts-nocheck
import { Router } from 'express';
import { categoriaControlador } from './categoria.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearCategoriaSchema, actualizarCategoriaSchema } from './categoria.validator';

const router = Router();

router.get('/', categoriaControlador.obtenerTodos);
router.get('/:id', categoriaControlador.obtenerPorId);

router.use(middlewareAutenticacion);
router.post('/', middlewareRol(['admin', 'bibliotecario']), validar(crearCategoriaSchema), categoriaControlador.crear);
router.patch('/:id', middlewareRol(['admin', 'bibliotecario']), validar(actualizarCategoriaSchema), categoriaControlador.actualizar);
router.delete('/:id', middlewareRol(['admin', 'bibliotecario']), categoriaControlador.eliminar);

export default router;
