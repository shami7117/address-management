// ====================================
// lib/email.ts - Simply.com Configuration
// ====================================
import nodemailer from "nodemailer";

/**
 * Simply.com SMTP Configuration
 * Based on official Simply.com email settings
 */

// Create transporter with Simply.com settings
export const transporter = nodemailer.createTransport({
  host: "smtp.simply.com",
  port: 587, // STARTTLS port (recommended)
  secure: false, // Use STARTTLS
  auth: {
    user: "support@copark-admin.dk", // Your full email address
    pass: process.env.SMTP_PASSWORD, // Your email password
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false, // Allow self-signed certificates
  },
  connectionTimeout: 15000, // 15 seconds
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

// Alternative configuration using port 465 (SSL)
export const transporterSSL = nodemailer.createTransport({
  host: "smtp.simply.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: "support@copark-admin.dk",
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

// Script SMTP configuration (for programmatic access)
export const transporterScript = nodemailer.createTransport({
  host: "websmtp.simply.com",
  port: 587, // STARTTLS
  secure: false,
  auth: {
    user: "support@copark-admin.dk", // A Simply.com e-mail address
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

// Verify connection on startup
export async function verifyEmailConnection() {
  try {
    console.log("🔍 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully");
    return true;
  } catch (error) {
    console.error("❌ SMTP connection failed:", error);
    
    // Try script SMTP as fallback
    try {
      console.log("🔍 Trying script SMTP (websmtp.simply.com)...");
      await transporterScript.verify();
      console.log("✅ Script SMTP connection verified");
      return true;
    } catch (scriptError) {
      console.error("❌ Script SMTP also failed:", scriptError);
      return false;
    }
  }
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: any;
}

export async function sendWelcomeEmail(
  email: string,
  fullName: string,
  password: string
): Promise<EmailResponse> {
  try {
    // Try primary transporter first
    let info;
    try {
      info = await transporter.sendMail({
        from: '"COPARK Admin" <support@copark-admin.dk>',
        to: email,
        subject: "Welcome to COPARK",
        text: `Hello ${fullName},

Your COPARK account has been created by the Admin.

Email: ${email}
Password: ${password}

You can now log in at: https://copark-admin.dk/login

Regards,
COPARK Admin`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Hello ${fullName},</h2>
            <p>Your COPARK account has been created by the Admin.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
            </div>
            <p>You can now log in at: <a href="https://copark-admin.dk/login">https://copark-admin.dk/login</a></p>
            <p style="margin-top: 30px;">Regards,<br><strong>COPARK Admin</strong></p>
          </div>
        `,
      });
    } catch (primaryError) {
      console.warn("⚠️  Primary SMTP failed, trying script SMTP...", primaryError);
      
      // Fallback to script SMTP
      info = await transporterScript.sendMail({
        from: '"COPARK Admin" <support@copark-admin.dk>',
        to: email,
        subject: "Welcome to COPARK",
        text: `Hello ${fullName},

Your COPARK account has been created by the Admin.

Email: ${email}
Password: ${password}

You can now log in at: https://copark-admin.dk/login

Regards,
COPARK Admin`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Hello ${fullName},</h2>
            <p>Your COPARK account has been created by the Admin.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
            </div>
            <p>You can now log in at: <a href="https://copark-admin.dk/login">https://copark-admin.dk/login</a></p>
            <p style="margin-top: 30px;">Regards,<br><strong>COPARK Admin</strong></p>
          </div>
        `,
      });
    }

    console.log("✅ Welcome email sent successfully to:", email);
    console.log("Message ID:", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);

    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        code: (error as any).code,
        command: (error as any).command,
      });
    }

    return { success: false, error };
  }
}