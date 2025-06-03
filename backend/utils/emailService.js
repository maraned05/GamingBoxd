const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendVerificationEmail = async (email, code) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your 2FA Verification Code',
        html: `
            <h1>Two-Factor Authentication</h1>
            <p>Your verification code is: <strong>${code}</strong></p>
            <p>This code will expire in 10 minutes.</p>
        `
    };

    try {
        console.log('Sending email with options:', mailOptions);
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = {
    sendVerificationEmail
}; 