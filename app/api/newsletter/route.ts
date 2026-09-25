import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://edpbkxlcapjmynahvgth.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcGJreGxjYXBqbXluYWh2Z3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDMyODAsImV4cCI6MjEwNTYxOTI4MH0.fmAKxg61vLsPqh4tBVVbJ6mgSEvtyiV76rC5rWcQZ4w';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    // Insert into Supabase
    const { error: dbError } = await supabase
      .from('newsletter_subscribers')
      .insert({ email });
    
    if (dbError && dbError.code !== '23505') {
      // 23505 is duplicate key error, which is fine
      console.error('Database error:', dbError);
    }

    // Send email notification
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
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
