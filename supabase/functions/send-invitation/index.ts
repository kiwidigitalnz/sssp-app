
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

interface EmailRequest {
  to: string;
  ssspTitle: string;
  accessLevel: 'view' | 'edit';
  inviterEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log(`[${new Date().toISOString()}] Received ${req.method} request`);

  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    if (req.method !== "POST") {
      throw new Error(`HTTP method ${req.method} is not allowed`);
    }

    const body: EmailRequest = await req.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    const { to, ssspTitle, accessLevel, inviterEmail } = body;

    const validationErrors = [];
    if (!to) validationErrors.push("Email recipient is required");
    if (!ssspTitle) validationErrors.push("SSSP title is required");
    if (!accessLevel) validationErrors.push("Access level is required");
    if (!inviterEmail) validationErrors.push("Inviter email is required");

    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
    }

    const emailResponse = await resend.emails.send({
      from: "SSSP App <onboarding@resend.dev>",
      to: [to],
      subject: `Invitation to Collaborate: ${ssspTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; color: #1a1a1a;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="background-color: white; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 32px;">
                <div style="text-align: center; margin-bottom: 32px;">
                  <h1 style="color: #0f172a; font-size: 24px; font-weight: 600; margin: 0;">You've Been Invited</h1>
                  <p style="color: #64748b; margin-top: 8px;">to collaborate on a Site Specific Safety Plan</p>
                </div>
                
                <div style="background-color: #f8fafc; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                  <p style="margin: 0; color: #64748b;">Document Title</p>
                  <p style="margin: 8px 0 0 0; color: #0f172a; font-weight: 500;">${ssspTitle}</p>
                </div>
                
                <div style="margin-bottom: 24px;">
                  <p style="margin: 0; line-height: 1.6;">
                    <strong style="color: #0f172a;">${inviterEmail}</strong> has invited you to collaborate on this SSSP document with <strong style="color: #0f172a;">${accessLevel} access</strong>.
                  </p>
                </div>
                
                <div style="text-align: center;">
                  <a href="${Deno.env.get("PUBLIC_SITE_URL") || "http://localhost:5173"}/auth" 
                     style="display: inline-block; background-color: #0091ff; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; margin-bottom: 24px;">
                    View Document
                  </a>
                </div>
                
                <div style="border-top: 1px solid #e2e8f0; margin-top: 24px; padding-top: 24px;">
                  <p style="margin: 0; color: #64748b; font-size: 14px; text-align: center;">
                    If you don't have an account, you'll be able to create one using this email address (${to}).
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        data: emailResponse,
        metadata: {
          sentAt: new Date().toISOString(),
          recipient: to,
          documentTitle: ssspTitle,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error in send-invitation function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An error occurred while sending the invitation",
        timestamp: new Date().toISOString(),
      }),
      {
        status: error.message.includes("Validation failed") ? 400 : 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
