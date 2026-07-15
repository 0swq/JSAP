import * as jwt from 'jsonwebtoken';
import { StringValue } from 'ms';
import { env } from './env';

export interface PayloadToken {
    id: string;
    rolId: string;
    correo?: string;
}

export const generarToken = (payload: PayloadToken): string => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as StringValue,
    });
};

export const verificarToken = (token: string): PayloadToken => {
    return jwt.verify(token, env.JWT_SECRET) as PayloadToken;
};