// @ts-nocheck
import Joi from 'joi';

export const crearHistorialSchema = Joi.object({
  nombreAccion: Joi.string().max(100).required().messages({
    'string.max': 'El nombre de la acción no puede superar los 100 caracteres',
    'any.required': 'El nombre de la acción es obligatorio',
  }),

  accion: Joi.string().required().messages({
    'any.required': 'La acción es obligatoria',
  }),

  hechoPorId: Joi.string().required().messages({
    'any.required': 'El ID del usuario es obligatorio',
  }),

  modulo: Joi.string().max(50).optional(),
});

export const filtroHistorialSchema = Joi.object({
  hechoPorId: Joi.string().optional(),
  modulo: Joi.string().max(50).optional(),
  nombreAccion: Joi.string().max(100).optional(),
  accion: Joi.string().optional(),
  buscar: Joi.string().max(200).optional(),
  desde: Joi.date().iso().optional(),
  hasta: Joi.date().iso().optional(),
});
