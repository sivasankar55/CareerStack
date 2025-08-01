import { mailtrapClient, sender } from "../lib/mailtrap.js";

import {
	createCommentNotificationEmailTemplate,
	createConnectionAcceptedEmailTemplate,
	createWelcomeEmailTemplate,
} from "./emailTemplates.js";

export const sendWelcomeEmail = async (email,name,profileUrl) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from : sender,
            to: recipient,
            subject: "Welcome to LinkedIn",
            html: createWelcomeEmailTemplate(name,profileUrl),
            category: "Welcome",
        });

        console.log("Email sent successfully:", response);
    } catch (error) {
        throw error;
    }
}

export const sendCommentNotificationEmail = async (
    recipientEmail,
    recipientName,
    commenterName,
    postUrl,
    commentContent
) => {
    const recipient = [{email: recipientEmail}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "New Comment on Your Post",
            html: createCommentNotificationEmailTemplate(recipientName,commenterName,postUrl,commentContent),
            category: "comment_notification",
        });
        console.log("Comment Notification Email sent successfully", response);
    } catch (error) {
        throw error;
    }
};

export const sendConnectionAcceptedEmail = async(senderEmail, senderName, recipientEmail, profileUrl) => {
    const recipient = [{email: recipientEmail}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: `${senderName} accepted your connection request`,
            html: createConnectionAcceptedEmailTemplate(senderName,recipientEmail,profileUrl),
            category: "connection_accepted",
        });
    } catch (error) {
        console.error("Error in sendConnectionAcceptedEmail:", error);
        throw error;
    }
};
