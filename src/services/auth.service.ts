import { config } from '@/config/config'
import { User } from '@/models/user.model';
import { AuthResponse, ILoginRequest, IRegisterRequest } from '@/types/user.types';
import jwt from 'jsonwebtoken'

class AuthService {
    private generateToken(userId: string): string {
        return jwt.sign({ id: userId }, config.jwtSecret, {
            expiresIn: '24h'
        });
    }
    async register(userData: IRegisterRequest): Promise<AuthResponse> {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const user = await User.create({
            name: userData.name,
            email: userData.email,
            password: userData.password
        });
        const token = this.generateToken(user.id);

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    }

    async login(credentials: ILoginRequest): Promise<AuthResponse> {
        const user: any = await User.findOne({ email: credentials.email });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isValidPassword = await user.comparePassword(credentials.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user._id);

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };

    }
    async validateToken(token: string): Promise<{ id: string }> {
        try {
            return jwt.verify(token, config.jwtSecret) as { id: string };
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}

export const authService = new AuthService();