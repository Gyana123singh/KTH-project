const nodemailer = require('nodemailer');

/**
 * Creates a Nodemailer transporter configured via environment variables.
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback test transport
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'ethereal.user@ethereal.email',
      pass: 'ethereal_pass',
    },
  });
};

/**
 * Sends a real-time OTP email to candidate email address.
 * @param {String} recipientEmail - Target email address
 * @param {String} otpCode - 6-digit OTP code (e.g. 849204)
 * @returns {Promise<Boolean>} True if sent successfully
 */
const sendOTPEmail = async (recipientEmail, otpCode) => {
  try {
    const transporter = createTransporter();

    const fromAddress = process.env.FROM_EMAIL || '"Kitchen Talent Hub (KTH)" <no-reply@kitchentalenthub.com>';

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        <div style="background: #0f172a; padding: 28px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Kitchen Talent Hub</h1>
          <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px;">Professional Identity Layer for Kitchen Professionals</p>
        </div>
        
        <div style="padding: 32px 28px; text-align: center;">
          <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">Verification Code</h2>
          <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
            Use the 6-digit OTP code below to verify your email address and continue building your KTH profile:
          </p>
          
          <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; display: inline-block; margin: 10px 0 24px 0;">
            <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #ea580c;">${otpCode}</span>
          </div>

          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            This OTP code will expire in <strong>10 minutes</strong>. Do not share this code with anyone.
          </p>
        </div>

        <div style="background: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px; margin: 0;">© 2026 Kitchen Talent Hub (KTH). All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: fromAddress,
      to: recipientEmail,
      subject: `${otpCode} is your Kitchen Talent Hub (KTH) OTP Code`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] OTP Email sent to ${recipientEmail} | Message ID: ${info.messageId || 'sent'}`);
    return true;
  } catch (error) {
    console.error('[Email Service Error]:', error);
    // Don't crash auth flow if SMTP fails in local test mode
    return false;
  }
};

module.exports = {
  sendOTPEmail,
};
