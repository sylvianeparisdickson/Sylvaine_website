import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      customer_email, 
      customer_name, 
      painting_title, 
      edition, 
      size_label, 
      dimensions, 
      price, 
      payment_method, 
      payment_id,
      shipping_address 
    } = body;

    await resend.emails.send({
      from: "Sylviane Paris Website <onboarding@resend.dev>",
      to: "sylviane.paris_dickson@yahoo.com",
      replyTo: customer_email,
      subject: `New order: ${painting_title} - ${customer_name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1816;">
          <div style="border-bottom: 1px solid #e8e3da; padding-bottom: 24px; margin-bottom: 24px;">
            <h2 style="font-size: 22px; font-weight: 400; font-style: italic; margin: 0 0 4px;">
              New order received
            </h2>
            <p style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #9a9188; margin: 0;">
              Sylviane Paris — Website
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9a9188; width: 160px;">Customer</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 15px; color: #1a1816;">${customer_name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9a9188;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 15px; color: #1a1816;">
                <a href="mailto:${customer_email}" style="color: #1a1816;">${customer_email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9a9188;">Painting</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 15px; color: #1a1816;">${painting_title}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9a9188;">Edition</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 15px; color: #1a1816;">${edition}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9a9188;">Size</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 15px; color: #1a1816;">${size_label} - ${dimensions}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9a9188;">Price</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 15px; color: #1a1816;">$${price}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9a9188;">Payment</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 15px; color: #1a1816;">${payment_method} (${payment_id})</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9a9188; vertical-align: top;">Shipping Address</td>
              <td style="padding: 12px 0; font-size: 15px; color: #1a1816; line-height: 1.7;">${shipping_address}</td>
            </tr>
          </table>

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e8e3da;">
            <p style="font-size: 11px; color: #9a9188; margin: 0;">
              Reply directly to this email to contact the customer.
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
