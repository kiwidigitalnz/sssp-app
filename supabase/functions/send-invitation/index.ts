
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@2.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InvitationRequest {
  ssspId: string;
  recipientEmail: string;
  accessLevel: 'view' | 'edit';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { ssspId, recipientEmail, accessLevel }: InvitationRequest = await req.json();
    
    // Get the current user's ID from the authorization header
    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!authHeader) throw new Error('No authorization header');

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    if (userError || !user) throw new Error('Unauthorized');

    // Generate a secure token
    const token = crypto.randomUUID();

    // Check if an invitation already exists
    const { data: existingInvite } = await supabase
      .from('sssp_invitations')
      .select('id, status')
      .eq('sssp_id', ssspId)
      .eq('email', recipientEmail)
      .single();

    if (existingInvite) {
      if (existingInvite.status === 'pending') {
        throw new Error('An invitation is already pending for this email');
      }
      // If expired or accepted, we'll create a new one
      await supabase
        .from('sssp_invitations')
        .delete()
        .eq('id', existingInvite.id);
    }

    // Get the SSSP details for the email
    const { data: sssp } = await supabase
      .from('sssps')
      .select('title')
      .eq('id', ssspId)
      .single();

    if (!sssp) throw new Error('SSSP not found');

    // Create the invitation record
    const { error: inviteError } = await supabase
      .from('sssp_invitations')
      .insert({
        sssp_id: ssspId,
        email: recipientEmail,
        access_level: accessLevel,
        invited_by: user.id,
        token
      });

    if (inviteError) throw inviteError;

    // Send the invitation email
    const { error: emailError } = await resend.emails.send({
      from: 'SSSP <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: `You've been invited to collaborate on ${sssp.title}`,
      html: `
        <h1>You've been invited to collaborate!</h1>
        <p>You've been invited to collaborate on the SSSP "${sssp.title}" with ${accessLevel} access.</p>
        <p>Click the link below to accept the invitation:</p>
        <a href="${supabaseUrl}/auth/accept-invitation?token=${token}">
          Accept Invitation
        </a>
        <p>This invitation will expire in 7 days.</p>
      `,
    });

    if (emailError) throw emailError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in send-invitation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
