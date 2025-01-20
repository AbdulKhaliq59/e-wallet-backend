import express from 'express';
import { authController } from '@/controllers/auth.controller';
import { loginValidation, registerValidation, validate } from '@/middlewares/auth.validation';

const router = express.Router();

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);

export default router;