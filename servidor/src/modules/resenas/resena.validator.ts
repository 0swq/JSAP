// @ts-nocheck
import Joi from 'joi';

export const crearResenaSchema = Joi.object({
  usuarioId: Joi.string().optional(),
  libroId: Joi.string().uuid().required().messages({
    'any.required': 'El libroId es obligatorio',
  }),
  puntuacion: Joi.number().integer().min(1).max(5).optional(),
  comentario: Joi.string().max(2000).optional(),
});

export const actualizarResenaSchema = Joi.object({
  puntuacion: Joi.number().integer().min(1).max(5).optional(),
  comentario: Joi.string().max(2000).optional(),
}).min(1);
