const app = require('./src/app');
const config = require('./src/config/config');

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  if (config.nodeEnv === 'development') {
    console.log(`Frontend: http://localhost:${config.port}`);
    console.log(`API: http://localhost:${config.port}/api`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  }); 
});