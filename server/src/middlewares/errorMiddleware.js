/**
 * Global error handling middleware
 */
const errorMiddleware = (err, req, res, next) => {
  console.error("Backend Error:", err);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(statusCode).json({
    message: err.message,
    // Provide stack trace only in development
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = errorMiddleware;
