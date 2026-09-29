import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      customer_email, 
      customer_name, 
      customer_phone,
      painting_title, 
      edition, 
      size_label, 
      dimensions, 
      price, 
      tax_amount,
      tax_rate,
      shipping_cost,
      total_amount,
      tax_exempt,
      payment_method, 
      payment_id,
      shipping_address,
      shipping_method,
      order_number,
      country,
      order_source
    } = body;

    await resend.emails.send({
      from: "Sylviane Paris Website <onboarding@resend.dev>",
      to: "sylviane.paris_dickson@yahoo.com",
      replyTo: customer_email,
      subject: `New order: ${order_number || painting_title} - ${customer_name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1816;">
          <div style="border-bottom: 1px solid #e8e3da; padding-bottom: 24px; margin-bottom: 24px;">
            <h2 style="font-size: 22px; font-weight: 400; font-style: italic; margin: 0 0 4px;">
              New order received
            </h2>
            <p style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #9a9188; margin: 0;">
              Sylviane Paris — ${order_source === 'studio' ? 'Studio' : 'Website'}
            </p>
            ${order_number ? `<p style="font-size: 12px; color: #6a6560; margin: 4px 0 0;">Order #${order_number}</p>` : ''}
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
            ${customer_phone ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9a9188;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 15px; color: #1a1816;">${customer_phone}</td>
            </tr>
            ` : ''}
            ${painting_title ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9a9188;">Painting</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 15px; color: #1a1816;">${painting_title}</td>
            </tr>
            ` : ''}
            ${edition ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9a9188;">Edition</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 15px; color: #1a1816;">${edition}</td>
            </tr>
            ` : ''}
            ${size_label && dimensions ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9a9188;">Size</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 15px; color: #1a1816;">${size_label} - ${dimensions}</td>
            </tr>
            ` : ''}
          </table>

          <div style="margin: 24px 0; padding: 20px; background: #f8f5ef; border-radius: 4px;">
            <h3 style="font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #9a9188; margin: 0 0 16px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #6a6560;">Product</td>
                <td style="padding: 8px 0; font-size: 15px; color: #1a1816; text-align: right;">$${parseFloat(price).toFixed(2)}</td>
              </tr>
              ${tax_amount > 0 ? `
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #6a6560;">Sales Tax${tax_rate ? ` (${(parseFloat(tax_rate) * 100).toFixed(2)}%)` : ''}</td>
                <td style="padding: 8px 0; font-size: 15px; color: #1a1816; text-align: right;">$${parseFloat(tax_amount).toFixed(2)}</td>
              </tr>
              ` : ''}
              ${tax_exempt ? `
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #16a34a;">Tax Exempt</td>
                <td style="padding: 8px 0; font-size: 15px; color: #16a34a; text-align: right;">Yes</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #6a6560;">Shipping${shipping_method ? ` (${shipping_method})` : ''}</td>
                <td style="padding: 8px 0; font-size: 15px; color: #1a1816; text-align: right;">$${parseFloat(shipping_cost).toFixed(2)}</td>
              </tr>
              <tr style="border-top: 1px solid #e8e3da;">
                <td style="padding: 12px 0 8px; font-size: 14px; font-weight: bold; color: #1a1816;">Total</td>
                <td style="padding: 12px 0 8px; font-size: 18px; font-weight: bold; color: #1a1816; text-align: right;">$${parseFloat(total_amount).toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9a9188;">Payment</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0ede6; font-size: 15px; color: #1a1816;">${payment_method} (${payment_id})</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9a9188; vertical-align: top;">Shipping Address</td>
              <td style="padding: 12px 0; font-size: 15px; color: #1a1816; line-height: 1.7;">${shipping_address}${country && country !== 'US' ? `<br><span style="color: #6a6560; font-size: 13px;">${country}</span>` : ''}</td>
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
