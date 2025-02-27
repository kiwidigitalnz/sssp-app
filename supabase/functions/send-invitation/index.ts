
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'npm:resend@2.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InvitationRequest {
  to: string;
  ssspTitle: string;
  sssp_id: string;
  accessLevel: string;
  inviterEmail: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { to, ssspTitle, sssp_id, accessLevel, inviterEmail }: InvitationRequest = await req.json()
    
    console.log('Received invitation request:', { to, ssspTitle, sssp_id, accessLevel, inviterEmail });

    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: 'SSSP <onboarding@resend.dev>',
      to: [to],
      subject: `You've been invited to collaborate on ${ssspTitle}`,
      html: `
        <h1>You've been invited to collaborate!</h1>
        <p>${inviterEmail} has invited you to collaborate on the SSSP "${ssspTitle}" with ${accessLevel} access.</p>
        <p>Click the link below to accept the invitation:</p>
        <a href="${Deno.env.get('SUPABASE_URL')}/auth/invitation?sssp_id=${sssp_id}&access_level=${accessLevel}">
          Accept Invitation
        </a>
      `,
    });

    console.log('Email sending result:', { emailResult, emailError });

    if (emailError) {
      throw emailError;
    }

    return new Response(JSON.stringify(emailResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in send-invitation function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
