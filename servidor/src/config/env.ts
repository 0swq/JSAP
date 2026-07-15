import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/biblioteca',
  JWT_SECRET: process.env.JWT_SECRET || 'cambio-esta-clave-en-produccion',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
