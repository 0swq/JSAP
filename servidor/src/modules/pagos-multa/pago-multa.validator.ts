// @ts-nocheck
import Joi from 'joi';

export const crearPagoMultaSchema = Joi.object({
  multaId: Joi.string().uuid().required().messages({
    'any.required': 'El multaId es obligatorio',
  }),
  montoPagado: Joi.number().positive().required().messages({
    'any.required': 'El monto pagado es obligatorio',
  }),
  metodoPago: Joi.string().valid('efectivo', 'transferencia', 'tarjeta').required().messages({
    'any.required': 'El método de pago es obligatorio',
  }),
});

export const actualizarPagoMultaSchema = Joi.object({
  montoPagado: Joi.number().positive().optional(),
  metodoPago: Joi.string().valid('efectivo', 'transferencia', 'tarjeta').optional(),
}).min(1);
