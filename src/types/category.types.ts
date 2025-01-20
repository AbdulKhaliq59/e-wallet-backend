import { Types } from "mongoose";

export interface ICategory {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    parentCategory?: Types.ObjectId | null;
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICategoryPopulated extends Omit<ICategory, 'parentCategory'> {
    parentCategory?: ICategory | null;
}

export interface ICreateCategoryRequest {
    name: string;
    description?: string;
    parentCategory?: string;
}

export interface ICategoryResponse {
    id: string;
    name: string;
    description?: string;
    parentCategory?: {
        id: string;
        name: string;
    };
}
