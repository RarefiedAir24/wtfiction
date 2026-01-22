import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs'; // Ensure this runs on Node.js runtime

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check for Resend API key (preferred method for shared mailboxes)
    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.SUBSCRIBE_EMAIL || 'subscribe@wtfiction.com';
    const fromEmail = process.env.FROM_EMAIL || 'noreply@wtfiction.com';

    if (resendApiKey) {
      // Use Resend (works with shared mailboxes)
      const resend = new Resend(resendApiKey);

      const { data, error } = await resend.emails.send({
        from: `WTFiction <${fromEmail}>`,
        to: recipientEmail,
        subject: 'New Email Subscription - WTFiction',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3ea6ff;">New Email Subscription</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <hr style="border: none; border-top: 1px solid #272727; margin: 20px 0;">
            <p style="color: #aaaaaa; font-size: 12px;">
              This is an automated notification from the WTFiction website.
            </p>
          </div>
        `,
        text: `New email subscription:\n\nEmail: ${email}\n\nTimestamp: ${new Date().toISOString()}`,
      });

      if (error) {
        console.error('Resend API error:', error);
        return NextResponse.json(
          { error: 'Failed to send email. Please try again later.' },
          { status: 500 }
        );
      }

      console.log('Email sent successfully via Resend:', data?.id);
      return NextResponse.json({ 
        success: true,
        message: 'Subscription received successfully' 
      });
    }

    // Fallback to SMTP (requires regular user account)
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpHost || !smtpUser || !smtpPassword) {
      console.error('Email service not configured. Missing RESEND_API_KEY or SMTP credentials.');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // SMTP fallback (only works with regular user accounts, not shared mailboxes)
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      host: smtpHost,
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
      requireTLS: true,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });

    try {
      await transporter.verify();
    } catch (error: any) {
      console.error('SMTP verification failed:', error);
      // Return more detailed error for debugging
      const errorMessage = error.message || 'Unknown SMTP error';
      return NextResponse.json(
        { 
          error: 'Email service configuration error. Please contact support.',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        },
        { status: 503 }
      );
    }

    const mailOptions = {
      from: `"WTFiction" <${smtpUser}>`,
      to: recipientEmail,
      subject: 'New Email Subscription - WTFiction',
      text: `New email subscription:\n\nEmail: ${email}\n\nTimestamp: ${new Date().toISOString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3ea6ff;">New Email Subscription</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          <hr style="border: none; border-top: 1px solid #272727; margin: 20px 0;">
          <p style="color: #aaaaaa; font-size: 12px;">
            This is an automated notification from the WTFiction website.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully via SMTP:', info.messageId);

    return NextResponse.json({ 
      success: true,
      message: 'Subscription received successfully' 
    });
  } catch (error: any) {
    console.error('Error sending subscription email:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription. Please try again later.' },
      { status: 500 }
    );
  }
}
