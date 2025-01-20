// models/category.model.ts
import mongoose, { Schema } from "mongoose";
import { ICategory, ICategoryPopulated } from "@/types/category.types";

const categorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Prevent circular parent categories
categorySchema.pre('save', async function (next) {
    if (this.parentCategory) {
        let parent: any = await this.model('Category').findById(this.parentCategory);
        while (parent) {
            if (parent._id.toString() === this._id.toString()) {
                throw new Error('Circular category reference detected');
            }
            parent = await this.model('Category').findById(parent.parentCategory);
        }
    }
    next();
});

export const Category = mongoose.model<ICategory>('Category', categorySchema);