// @ts-nocheck
import { Router } from 'express';
import { favoritoControlador } from './favorito.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearFavoritoSchema } from './favorito.validator';

const router = Router();
router.use(middlewareAutenticacion);

router.get('/mis-favoritos', middlewareRol(['admin', 'bibliotecario', 'docente', 'estudiante']), favoritoControlador.misFavoritos);
router.get('/:id', middlewareRol(['admin', 'bibliotecario', 'docente', 'estudiante']), favoritoControlador.obtenerPorId);
router.post('/', middlewareRol(['admin', 'bibliotecario', 'docente', 'estudiante']), validar(crearFavoritoSchema), favoritoControlador.crear);
router.delete('/:id', middlewareRol(['admin', 'bibliotecario', 'docente', 'estudiante']), favoritoControlador.eliminar);

export default router;
