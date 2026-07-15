// @ts-nocheck
import Joi from 'joi';

export const crearUsuarioSchema = Joi.object({
    rolId: Joi.string().uuid().optional().messages({
        'string.uuid': 'El rolId debe ser un UUID válido',
    }),

    nombre: Joi.string().max(100).optional().messages({
        'string.max': 'El nombre no puede superar los 100 caracteres',
    }),

    apellidos: Joi.string().max(200).optional().messages({
        'string.max': 'Los apellidos no pueden superar los 200 caracteres',
    }),

    dni: Joi.string().length(8).pattern(/^\d+$/).optional().messages({
        'string.length': 'El DNI debe tener exactamente 8 dígitos',
        'string.pattern.base': 'El DNI solo debe contener números',
    }),

    correo: Joi.string().email().optional().messages({
        'string.email': 'El correo no tiene un formato válido',
    }),

    password: Joi.string().min(8).required().messages({
        'string.min': 'La contraseña debe tener al menos 8 caracteres',
        'any.required': 'La contraseña es obligatoria',
    }),
});

export const actualizarUsuarioSchema = Joi.object({
    rolId: Joi.string().uuid().optional().messages({
        'string.uuid': 'El rolId debe ser un UUID válido',
    }),

    nombre: Joi.string().max(100).optional().messages({
        'string.max': 'El nombre no puede superar los 100 caracteres',
    }),

    apellidos: Joi.string().max(200).optional().messages({
        'string.max': 'Los apellidos no pueden superar los 200 caracteres',
    }),

    dni: Joi.string().length(8).pattern(/^\d+$/).optional().messages({
        'string.length': 'El DNI debe tener exactamente 8 dígitos',
        'string.pattern.base': 'El DNI solo debe contener números',
    }),

    correo: Joi.string().email().optional().messages({
        'string.email': 'El correo no tiene un formato válido',
    }),

    password: Joi.string().min(8).optional().messages({
        'string.min': 'La contraseña debe tener al menos 8 caracteres',
    }),
}).min(1);

export const filtroUsuarioSchema = Joi.object({
  nombre: Joi.string().optional(),
  apellidos: Joi.string().optional(),
  correo: Joi.string().optional(),
  rolId: Joi.string().uuid().optional(),
});