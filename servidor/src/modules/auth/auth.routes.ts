// @ts-nocheck
import {Router} from 'express';
import {usuarioServicio} from '../usuarios/usuario.service';
import {crearUsuarioSchema} from '../usuarios/usuario.validator';
import {validar} from "@middlewares/validate.middleware";
import {middlewareAutenticacion} from "@middlewares/auth.middleware";

const router = Router();

router.post('/login', async (req, res, next) => {
    try {
        const {correo, password} = req.body;
        const result = await usuarioServicio.login(correo, password);
        res.json({success: true, data: result});
    } catch (error) {
        next(error);
    }
});
router.post('/registro', validar(crearUsuarioSchema), async (req, res, next) => {
    try {
        const usuario = await usuarioServicio.crear(req.body);
        res.status(201).json({success: true, data: usuario});
    } catch (error) {
        next(error);
    }
});
router.get('/perfil', middlewareAutenticacion, async (req, res, next) => {
    try {
        const usuario = await usuarioServicio.obtenerPorId((req as any).usuario.id);
        res.json({success: true, data: usuario});
    } catch (error) {
        next(error);
    }
});

export default router;
