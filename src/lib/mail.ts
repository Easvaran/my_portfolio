import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // NOTE: For Gmail, use an "App Password" here
  },
});

export const sendOTP = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Your OTP for Admin Access',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Verification Code</h2>
        <p style="font-size: 16px; color: #555;">Hello Administrator,</p>
        <p style="font-size: 16px; color: #555;">You requested a password reset for your admin dashboard. Please use the following One-Time Password (OTP) to proceed:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #777;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="font-size: 12px; color: #aaa; text-align: center;">&copy; ${new Date().getFullYear()} Portfolio Admin Panel</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
};

export const sendPasswordChangedNotification = async (email: string) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Security Alert: Admin Password Changed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #28a745; text-align: center;">Password Changed Successfully</h2>
        <p style="font-size: 16px; color: #555;">Hello Administrator,</p>
        <p style="font-size: 16px; color: #555;">This is a confirmation that your admin dashboard password for <span style="font-weight: bold; color: #000;">${email}</span> has been successfully changed.</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <p style="margin: 0; font-size: 14px; color: #666;">If you performed this action, you can safely ignore this email. No further action is required.</p>
        </div>
        <p style="font-size: 14px; color: #dc3545; font-weight: bold;">If you did NOT change your password, please contact system support immediately as your account may be compromised.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="font-size: 12px; color: #aaa; text-align: center;">&copy; ${new Date().getFullYear()} Portfolio Admin Panel</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password change notification sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
};
