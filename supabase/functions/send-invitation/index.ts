import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from "https://esm.sh/resend@2.0.0";

interface InvitationBody {
  to: string;
  ssspTitle: string;
  sssp_id: string;
  accessLevel: string;
  inviterEmail: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});

const handler = async (req: Request): Promise<Response> => {
  // Set CORS headers for the response
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS pre-flight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const body: InvitationBody = await req.json();

    if (!body.to || !body.ssspTitle || !body.sssp_id || !body.accessLevel || !body.inviterEmail) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: invitation } = await supabase
      .from('sssp_invitations')
      .select('id')
      .eq('sssp_id', body.sssp_id)
      .eq('email', body.to)
      .eq('status', 'pending')
      .single();

    if (!invitation) {
      throw new Error('Invitation not found');
    }

    const siteUrl = Deno.env.get("PUBLIC_SITE_URL") || "http://localhost:5173";
    const inviteUrl = `${siteUrl}/auth?invite=${invitation.id}`;

    const emailResponse = await resend.emails.send({
      from: "SSSP App <onboarding@resend.dev>",
      to: [body.to],
      subject: `Invitation to Collaborate: ${body.ssspTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale:1.0">
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
                  <p style="margin: 8px 0 0 0; color: #0f172a; font-weight: 500;">${body.ssspTitle}</p>
                </div>
                
                <div style="margin-bottom: 24px;">
                  <p style="margin: 0; line-height: 1.6;">
                    <strong style="color: #0f172a;">${body.inviterEmail}</strong> has invited you to collaborate on this SSSP document with <strong style="color: #0f172a;">${body.accessLevel} access</strong>.
                  </p>
                </div>
                
                <div style="text-align: center;">
                  <a href="${inviteUrl}" 
                     style="display: inline-block; background-color: #0091ff; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; margin-bottom: 24px;">
                    View Document
                  </a>
                </div>
                
                <div style="border-top: 1px solid #e2e8f0; margin-top: 24px; padding-top: 24px;">
                  <p style="margin: 0; color: #64748b; font-size: 14px; text-align: center;">
                    If you don't have an account, you'll be able to create one using this email address (${body.to}).
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return new Response(
      JSON.stringify({
        data: emailResponse,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);
