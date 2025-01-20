import { Types } from "mongoose";

export interface INotification {
    _id: string;
    userId: Types.ObjectId;
    title: string;
    message: string;
    type: "budget_alert" | "system";
    details: any;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface INotificationResponse {
    id: string;
    title: string;
    message: string;
    type: "budget_alert" | "system";
    details: any;
    read: boolean;
    createdAt: Date;
}
