// @ts-nocheck
import Joi from 'joi';

export const crearLibroSchema = Joi.object({
  titulo: Joi.string().max(300).required().messages({
    'string.max': 'El título no puede superar los 300 caracteres',
    'any.required': 'El título es obligatorio',
  }),

  isbn: Joi.string().max(20).optional().messages({
    'string.max': 'El ISBN no puede superar los 20 caracteres',
  }),

  editorialId: Joi.string().uuid().required().messages({
    'string.uuid': 'El editorialId debe ser un UUID válido',
    'any.required': 'El editorialId es obligatorio',
  }),

  anioPublicacion: Joi.number().integer().min(1000).max(2100).optional(),

  idioma: Joi.string().max(50).optional(),

  publicado: Joi.boolean().optional(),

  descripcion: Joi.string().optional(),

  fotoUrl: Joi.string().uri().optional(),

  autorIds: Joi.array().items(Joi.string().uuid()).optional(),

  categoriaIds: Joi.array().items(Joi.string().uuid()).optional(),

  recursosDigitales: Joi.array().items(
    Joi.object({
      tipo: Joi.string().required(),
      url: Joi.string().uri().required(),
      formato: Joi.string().optional(),
    })
  ).optional(),
});

export const actualizarLibroSchema = Joi.object({
  titulo: Joi.string().max(300).optional(),

  isbn: Joi.string().max(20).optional(),

  editorialId: Joi.string().uuid().optional(),

  anioPublicacion: Joi.number().integer().min(1000).max(2100).optional(),

  idioma: Joi.string().max(50).optional(),

  publicado: Joi.boolean().optional(),

  descripcion: Joi.string().optional(),

  fotoUrl: Joi.string().uri().optional(),

  autorIds: Joi.array().items(Joi.string().uuid()).optional(),

  categoriaIds: Joi.array().items(Joi.string().uuid()).optional(),

  recursosDigitales: Joi.array().items(
    Joi.object({
      tipo: Joi.string().required(),
      url: Joi.string().uri().required(),
      formato: Joi.string().optional(),
    })
  ).optional(),
}).min(1);

export const filtroLibroSchema = Joi.object({
  titulo: Joi.string().max(300).optional(),
  isbn: Joi.string().max(20).optional(),
  editorialId: Joi.string().uuid().optional(),
  autorId: Joi.string().uuid().optional(),
  categoriaId: Joi.string().uuid().optional(),
  publicado: Joi.boolean().optional(),
  anioPublicacion: Joi.number().integer().optional(),
});
