import { IBudget, BudgetPeriod } from "@/types/budget.types";
import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema<IBudget>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        validate: {
            validator: function (value: number) {
                return value > 0;
            },
            message: 'Budget amount must be greater than 0'
        }
    },
    period: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    currentSpending: {
        type: Number,
        default: 0,
        validate: {
            validator: function (value: number) {
                return value >= 0;
            },
            message: 'Current spending cannot be negative'
        }
    }
}, {
    timestamps: true
});

// Ensure only one active budget per category
budgetSchema.index(
    {
        userId: 1,
        category: 1,
        startDate: 1,
        endDate: 1
    },
    {
        unique: true,
        partialFilterExpression: {
            $or: [
                { endDate: { $exists: false } },
                { endDate: { $gt: new Date() } }
            ]
        }
    }
);

export const Budget = mongoose.model<IBudget>('Budget', budgetSchema);
