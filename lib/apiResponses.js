export const errorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    error: message
  });
}

export const successResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    success: true,
    data
  });
}