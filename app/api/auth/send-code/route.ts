import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, checkUserExists } = await request.json();

    const cleanEmail = email ? email.trim().toLowerCase() : '';
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (!checkUserExists && !cleanEmail.endsWith('@gmail.com')) {
      return NextResponse.json(
        {
          error:
            'Only @gmail.com email addresses are allowed for registration. For assistance or alternative domain approval, please contact support: +91 6304218064, +91 6309917327 or events.studentforge@gmail.com',
        },
        { status: 400 }
      );
    }

    if (checkUserExists) {
      const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (!user) {
        return NextResponse.json(
          { error: 'No account found with this email address' },
          { status: 404 }
        );
      }
    }

    // Generate a random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Configure Resend API Client
    const resendApiKey = process.env.RESEND_API_KEY || 're_xxxxxxxxx';
    const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@app.redlix.co.in';
    const resend = new Resend(resendApiKey);

    const mailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirm Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fafbfc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #24292e;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fafbfc; width: 100%; min-height: 100%; padding: 40px 20px;">
          <tr>
            <td align="center" valign="top">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 460px; background-color: #ffffff; border: 1px solid #e1e4e8; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(27,31,35,0.04);">
                <tr>
                  <td style="padding: 32px 32px 24px 32px; text-align: center;">
                    <div style="margin-bottom: 20px;">
                      <img src="https://ik.imagekit.io/dypkhqxip/sf-events-svg?updatedAt=1787505496001" alt="Student Forge" height="32" style="height: 32px; width: auto; display: inline-block; border: 0; filter: grayscale(100%); -webkit-filter: grayscale(100%); opacity: 0.9;" />
                    </div>
                    <h2 style="margin: 0 0 12px 0; color: #111827; font-size: 22px; font-weight: 600; letter-spacing: -0.5px;">Confirm your email address</h2>
                    <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      Use the 6-digit verification code below to authorize your Student Forge account:
                    </p>
                    
                    <div style="background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 18px 0; margin: 0 0 24px 0;">
                      <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 36px; font-weight: 700; letter-spacing: 6px; color: #111827; display: block;">${code}</span>
                    </div>

                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      This code will expire in 10 minutes. If you did not request this, please ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Always log code to terminal for easy development testing
    console.log('\n\x1b[43m\x1b[30m%s\x1b[0m', ` [SANDBOX MODE] VERIFICATION CODE FOR ${cleanEmail}: ${code} `);

    let deliverySuccess = false;

    // 1. Attempt delivery via Resend
    if (resendApiKey && !resendApiKey.startsWith('re_xxxx')) {
      try {
        const sendResult = await resend.emails.send({
          from: `Student Forge <${resendFromEmail}>`,
          to: cleanEmail,
          subject: 'Confirm Your Email - Student Forge',
          text: `Your verification code is: ${code}`,
          html: mailHtml,
        });

        if (sendResult.data?.id) {
          deliverySuccess = true;
          console.log(`[Resend Success] OTP sent to ${cleanEmail} (ID: ${sendResult.data.id})`);
        } else if (sendResult.error) {
          console.warn('[Resend Error] Primary delivery failed:', sendResult.error.message);
        }
      } catch (mailError: any) {
        console.warn('[Resend Exception] Mail delivery error:', mailError.message);
      }
    }

    // 2. Fallback to Nodemailer Gmail SMTP
    if (!deliverySuccess && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        console.log(`[Gmail SMTP Fallback] Sending verification code to ${cleanEmail} via Gmail SMTP...`);
        const nodemailerModule = await import('nodemailer');
        const transporter = nodemailerModule.default.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const info = await transporter.sendMail({
          from: `"Student Forge" <${process.env.EMAIL_USER}>`,
          to: cleanEmail,
          subject: 'Confirm Your Email - Student Forge',
          text: `Your verification code is: ${code}`,
          html: mailHtml,
        });
        deliverySuccess = true;
        console.log(`[Gmail SMTP Success] OTP sent successfully to ${cleanEmail} (ID: ${info.messageId})`);
      } catch (smtpErr: any) {
        console.error('[Gmail SMTP Error] Failed to send verification code:', smtpErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      code,
      deliverySuccess,
      message: `Verification code sent to ${cleanEmail}`
    });
  } catch (error: any) {
    console.error('Send code API error:', error);
    return NextResponse.json({ error: 'Failed to process verification: ' + error.message }, { status: 500 });
  }
}
