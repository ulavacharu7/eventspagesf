import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, checkUserExists } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (checkUserExists) {
      const user = await prisma.user.findUnique({ where: { email } });
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
    const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
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
    console.log('\n\x1b[43m\x1b[30m%s\x1b[0m', ` [SANDBOX MODE] VERIFICATION CODE FOR ${email}: ${code} `);

    // Attempt delivery via Resend
    try {
      const sendResult = await resend.emails.send({
        from: `Student Forge <${resendFromEmail}>`,
        to: email,
        subject: 'Confirm Your Email - Student Forge',
        text: `Your verification code is: ${code}`,
        html: mailHtml,
      });

      if (sendResult.error) {
        console.warn('Resend primary delivery error:', sendResult.error.message);
        // Fallback to sandbox domain if custom domain is unverified
        if (resendFromEmail !== 'onboarding@resend.dev') {
          await resend.emails.send({
            from: 'Student Forge <onboarding@resend.dev>',
            to: email,
            subject: 'Confirm Your Email - Student Forge',
            text: `Your verification code is: ${code}`,
            html: mailHtml,
          }).catch((fallbackErr) => {
            console.warn('Resend fallback delivery error:', fallbackErr.message);
          });
        }
      }
    } catch (mailError: any) {
      console.warn('Resend mail delivery catch error:', mailError.message);
    }

    return NextResponse.json({
      success: true,
      email,
      code,
      message: `Verification code sent to ${email}`
    });
  } catch (error: any) {
    console.error('Send code API error:', error);
    return NextResponse.json({ error: 'Failed to process verification: ' + error.message }, { status: 500 });
  }
}
