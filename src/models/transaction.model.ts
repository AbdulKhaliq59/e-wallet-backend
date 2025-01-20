import { ITransaction, AccountType, TransactionType } from "@/types/transaction.types";
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema<ITransaction>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        validate: {
            validator: function (value: number) {
                return value > 0;
            },
            message: 'Amount must be greater than 0'
        }
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    account: {
        type: String,
        enum: ['bank', 'mobile_money', 'cash'],
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: true
});

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, account: 1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
