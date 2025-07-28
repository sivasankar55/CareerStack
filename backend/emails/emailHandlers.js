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