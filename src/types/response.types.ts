export interface IApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface IErrorResponse {
    success: boolean;
    error: string;
    details?: any;
}