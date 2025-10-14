require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 't415S3cr3tC0d3',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  nodeEnv: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
};