import dotenv from 'dotenv';
dotenv.config();


export const config = {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/wallet',
    jwtSecret: process.env.JWT_SECRET || 'my-secret-key',
    environment: process.env.NODE_ENV || 'development'
}