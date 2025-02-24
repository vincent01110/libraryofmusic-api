import { Router } from 'express';
import { AuthController } from '../../../controllers/v1/auth/AuthController';
import { container } from 'tsyringe';

const authRouter = Router();
const authController = container.resolve(AuthController);

authRouter.post('/login', authController.logIn);

export default authRouter;
