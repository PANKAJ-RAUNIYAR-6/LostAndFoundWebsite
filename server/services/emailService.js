import nodemailer from 'nodemailer';

let transporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
    console.log('[EmailService] SMTP transporter configured for', process.env.SMTP_HOST);
  } catch (err) {
    console.warn('[EmailService] Failed to initialize SMTP transporter:', err.message);
  }
}

export const sendEmail = async ({ to, subject, html, text }) => {
  const from = process.env.SMTP_FROM || '"FindIt Lost & Found" <no-reply@findit.org>';

  if (transporter) {
    try {
      const info = await transporter.sendMail({ from, to, subject, text, html });
      console.log(`[EmailService] Email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error(`[EmailService] SMTP send error: ${err.message}`);
    }
  }

  // Graceful simulation fallback
  console.log(`\n======================================================`);
  console.log(`[EmailService: Simulated Outbox]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${text || html}`);
  console.log(`======================================================\n`);
  return { success: true, simulated: true };
};

export const sendOTPEmail = async (email, otpCode) => {
  const subject = `Your FindIt Verification Code: ${otpCode}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #2563eb; margin-bottom: 8px;">FindIt - Lost & Found Portal</h2>
      <p style="color: #475569; font-size: 15px;">Use the 6-digit verification code below to verify your account or complete your security request:</p>
      <div style="background-color: #eff6ff; border: 1px dashed #3b82f6; border-radius: 6px; padding: 16px; text-align: center; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1e40af;">${otpCode}</span>
      </div>
      <p style="color: #64748b; font-size: 13px;">This code will expire in 10 minutes. If you did not request this verification, you can safely ignore this email.</p>
    </div>
  `;
  return await sendEmail({ to: email, subject, html, text: `Your FindIt OTP is: ${otpCode}` });
};

export const sendClaimNotificationEmail = async (email, itemName, claimantName) => {
  const subject = `New Claim Request for "${itemName}"`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #2563eb;">FindIt Claim Alert</h2>
      <p>Hello,</p>
      <p><strong>${claimantName}</strong> has submitted an ownership claim on your reported item <strong>"${itemName}"</strong>.</p>
      <p>Please log in to your FindIt dashboard to inspect the proof submitted and accept or decline the claim.</p>
    </div>
  `;
  return await sendEmail({ to: email, subject, html, text: `New claim on "${itemName}" by ${claimantName}` });
};
