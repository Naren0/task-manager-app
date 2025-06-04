const sgMail = require('@sendgrid/mail');
const sendgridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gorantla04@outlook.com',
        subject: 'Welcome to Task Manager',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gorantla04@outlook.com',
        subject: 'Sorry to see you go',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`,
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}