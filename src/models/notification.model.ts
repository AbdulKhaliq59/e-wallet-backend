import { INotification } from "@/types/notification.types";
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema<INotification>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['budget_alert', 'system'],
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for efficient querying of unread notifications
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
