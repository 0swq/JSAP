import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: any,
  message = 'OK',
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendPaginated = (
  res: Response,
  items: any[],
  total: number,
  page: number,
  limit: number
) => {
  return res.status(200).json({
    success: true,
    message: 'OK',
    data: items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};
