
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvitationRequest {
  to: string;
  ssspTitle: string;
  sssp_id: string;
  accessLevel: string;
  inviterEmail: string;
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, ssspTitle, sssp_id, accessLevel, inviterEmail }: InvitationRequest = await req.json();

    // Validate input
    if (!to || !ssspTitle || !sssp_id || !accessLevel || !inviterEmail) {
      throw new Error('Missing required fields');
    }

    console.log('Sending invitation email:', { to, ssspTitle, sssp_id, accessLevel, inviterEmail });

    // Send the email using Resend
    const { data: emailResponse, error: emailError } = await resend.emails.send({
      from: 'SSSP <onboarding@resend.dev>',
      to: [to],
      subject: `You've been invited to collaborate on ${ssspTitle}`,
      html: `
        <h1>You've been invited to collaborate!</h1>
        <p>${inviterEmail} has invited you to collaborate on the SSSP: ${ssspTitle}</p>
        <p>You have been granted ${accessLevel} access.</p>
        <p>To accept this invitation, please click the link below:</p>
        <p><a href="${Deno.env.get('SUPABASE_URL')}/accept-invitation?sssp_id=${sssp_id}">Accept Invitation</a></p>
        <p>This invitation will expire in 7 days.</p>
      `,
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      throw emailError;
    }

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ message: 'Invitation sent successfully' }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in send-invitation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500,
      },
    );
  }
});
