// @ts-nocheck
import Joi from 'joi';

export const crearRecursoDigitalSchema = Joi.object({
  libroId: Joi.string().uuid().required().messages({
    'string.uuid': 'El libroId debe ser un UUID válido',
    'any.required': 'El libroId es obligatorio',
  }),
  tipo: Joi.string().valid('pdf', 'epub', 'audiolibro', 'video').required().messages({
    'any.required': 'El tipo es obligatorio',
  }),
  url: Joi.string().uri().required().messages({
    'any.required': 'La URL es obligatoria',
  }),
  formato: Joi.string().max(20).optional(),
});

export const actualizarRecursoDigitalSchema = Joi.object({
  libroId: Joi.string().uuid().optional(),
  tipo: Joi.string().valid('pdf', 'epub', 'audiolibro', 'video').optional(),
  url: Joi.string().uri().optional(),
  formato: Joi.string().max(20).optional(),
}).min(1);
