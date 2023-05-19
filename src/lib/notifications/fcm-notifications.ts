import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

export interface Notification {
    title: string;
    body: string;
    data?: Record<string, any>;
}

const FcmNotifications = {
    Init() {
        initializeApp({
            credential: admin.credential.applicationDefault(),
        });
    },

    async Push(token: string, notification: Notification) {
        await getMessaging().send({
            token,
            notification: {
                title: notification.title,
                body: notification.body,
            },
            data: notification.data,
        });
    },

    async PushToMultiple(tokens: string[], notification: Notification) {
        await getMessaging().sendEachForMulticast({
            tokens,
            notification: {
                title: notification.title,
                body: notification.body,
            },
            data: notification.data,
        });
    },
};

export { FcmNotifications };
