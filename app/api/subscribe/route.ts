import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

    // Check if SMTP is configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const recipientEmail = process.env.SUBSCRIBE_EMAIL || 'subscribe@wtfiction.com';

    if (!smtpHost || !smtpUser || !smtpPassword) {
      console.error('SMTP not configured. Missing environment variables.');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // Create transporter for Microsoft 365 SMTP
    const transporter = nodemailer.createTransport({
      host: smtpHost, // e.g., smtp.office365.com
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false, // For development, set to true in production with proper certs
      },
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
    } catch (error) {
      console.error('SMTP verification failed:', error);
      return NextResponse.json(
        { error: 'Email service configuration error. Please contact support.' },
        { status: 503 }
      );
    }

    // Email content
    const mailOptions = {
      from: smtpUser, // Sender address (must be authenticated user)
      to: recipientEmail, // subscribe@wtfiction.com
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

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

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
