
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationEmailRequest {
  to: string;
  ssspTitle: string;
  accessLevel: string;
  inviterEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, ssspTitle, accessLevel, inviterEmail }: InvitationEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "SSSP App <onboarding@resend.dev>",
      to: [to],
      subject: `You've been invited to collaborate on ${ssspTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">SSSP Collaboration Invitation</h1>
          <p>Hello,</p>
          <p>${inviterEmail} has invited you to collaborate on the SSSP document: <strong>${ssspTitle}</strong></p>
          <p>You have been granted <strong>${accessLevel}</strong> access to this document.</p>
          <p>To access the document, please sign in or create an account using this email address.</p>
          <div style="margin: 30px 0;">
            <a href="${Deno.env.get("PUBLIC_SITE_URL")}/auth" 
               style="background: #0091ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Access Document
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If you don't have an account yet, you'll be able to create one using this email address.
          </p>
        </div>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error sending invitation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
