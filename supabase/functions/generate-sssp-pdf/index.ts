
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get SSSP ID from request body
    const { ssspId } = await req.json();

    if (!ssspId) {
      throw new Error('No SSSP ID provided');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch SSSP data, selecting only necessary fields
    const { data: sssp, error: ssspError } = await supabase
      .from('sssps')
      .select(`
        title,
        description,
        company_name,
        status,
        created_at,
        updated_at
      `)
      .eq('id', ssspId)
      .single();

    if (ssspError) {
      throw ssspError;
    }

    // Generate minimal content
    const pdfContent = `
SSSP Summary
------------
Title: ${sssp.title}
Company: ${sssp.company_name}
Status: ${sssp.status}
Created: ${new Date(sssp.created_at).toLocaleDateString()}
Last Updated: ${new Date(sssp.updated_at).toLocaleDateString()}

Description:
${sssp.description || 'No description provided'}
    `.trim();

    const safeTitle = sssp.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${safeTitle}-${Date.now()}.txt`;

    const { error: uploadError } = await supabase.storage
      .from('sssp_pdfs')
      .upload(filename, new TextEncoder().encode(pdfContent), {
        contentType: 'text/plain',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = await supabase.storage
      .from('sssp_pdfs')
      .getPublicUrl(filename);

    return new Response(
      JSON.stringify({ url: publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-sssp-pdf:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
