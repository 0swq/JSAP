// @ts-nocheck
import Joi from 'joi';

export const crearFavoritoSchema = Joi.object({
  usuarioId: Joi.string().required().messages({
    'any.required': 'El usuarioId es obligatorio',
  }),
  libroId: Joi.string().uuid().required().messages({
    'any.required': 'El libroId es obligatorio',
  }),
});
