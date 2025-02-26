
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

  // Handle CORS preflight requests
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

    // Input validation
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
      subject: `Collaboration Invitation: ${ssspTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h1 style="color: #1a1a1a; margin-bottom: 16px;">SSSP Collaboration Invitation</h1>
              <p style="margin-bottom: 12px;">Hello,</p>
              <p style="margin-bottom: 12px;"><strong>${inviterEmail}</strong> has invited you to collaborate on the SSSP document:</p>
              <p style="background-color: #e9ecef; padding: 12px; border-radius: 4px; margin-bottom: 16px;"><strong>${ssspTitle}</strong></p>
              <p style="margin-bottom: 16px;">You have been granted <strong>${accessLevel}</strong> access to this document.</p>
              
              <div style="margin: 24px 0; text-align: center;">
                <a href="${Deno.env.get("PUBLIC_SITE_URL") || "http://localhost:5173"}/auth" 
                   style="background: #0091ff; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
                  Access Document
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #dee2e6;">
                If you don't have an account yet, you'll be able to create one using this email address.
              </p>
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
    console.error("Error in send-invitation function:", {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
    });
    
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
