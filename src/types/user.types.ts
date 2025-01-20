export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IRegisterRequest extends ILoginRequest {
    name: string;
    confirmPassword: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    }
}