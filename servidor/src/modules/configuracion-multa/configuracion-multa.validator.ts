// @ts-nocheck
import Joi from 'joi';

export const crearConfiguracionMultaSchema = Joi.object({
  tarifaDiaria: Joi.number().positive().required().messages({
    'any.required': 'La tarifa diaria es obligatoria',
  }),
  diasMaxPrestamo: Joi.number().integer().min(1).required().messages({
    'any.required': 'Los días máximos de préstamo son obligatorios',
  }),
});

export const actualizarConfiguracionMultaSchema = Joi.object({
  tarifaDiaria: Joi.number().positive().optional(),
  diasMaxPrestamo: Joi.number().integer().min(1).optional(),
}).min(1);
