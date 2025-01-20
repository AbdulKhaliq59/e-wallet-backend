import express from "express";
import cors from 'cors';
import { config } from "./config/config";
import { connectDB } from "./config/database"
import logger from "./utils/logger";
import authRoutes from "./routes/auth.routes";
import { transactionRoutes } from "./routes/transaction.routes";
import { reportRoutes } from "./routes/report.routes";
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes)
const startServer = async (): Promise<void> => {
    try {
        await connectDB();
        app.listen(config.port, () => {
            logger.info(`Server is running on port ${config.port}`);
        });
    } catch (error) {
        logger.error(`Error starting server: ${error}`);
        process.exit(1);
    }
};

startServer();