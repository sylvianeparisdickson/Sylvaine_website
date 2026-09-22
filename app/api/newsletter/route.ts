import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    await resend.emails.send({
      from: "Sylviane Paris Website <onboarding@resend.dev>",
      to: "sylviane.paris_dickson@yahoo.com",
      subject: `New newsletter subscription: ${email}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1816;">
          <div style="border-bottom: 1px solid #e8e3da; padding-bottom: 24px; margin-bottom: 24px;">
            <h2 style="font-size: 22px; font-weight: 400; font-style: italic; margin: 0 0 4px;">
              New newsletter subscription
            </h2>
            <p style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #9a9188; margin: 0;">
              Sylviane Paris — Website
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9a9188; width: 130px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 15px; color: #1a1816;">
                <a href="mailto:${email}" style="color: #1a1816;">${email}</a>
              </td>
            </tr>
          </table>

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e8e3da;">
            <p style="font-size: 11px; color: #9a9188; margin: 0;">
              This subscriber has been added to your newsletter list.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
