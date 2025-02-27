
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

    // Fetch SSSP data
    const { data: sssp, error: ssspError } = await supabase
      .from('sssps')
      .select('*')
      .eq('id', ssspId)
      .single();

    if (ssspError) {
      throw ssspError;
    }

    // For now, generate a simple text file as placeholder
    // This should be replaced with actual PDF generation logic
    const pdfContent = `SSSP Details:\n${JSON.stringify(sssp, null, 2)}`;
    const filename = `${sssp.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${Date.now()}.txt`;

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('sssp-pdfs')
      .upload(filename, new Blob([pdfContent], { type: 'text/plain' }));

    if (uploadError) {
      throw uploadError;
    }

    // Get temporary URL for the uploaded file
    const { data: { publicUrl }, error: urlError } = await supabase.storage
      .from('sssp-pdfs')
      .getPublicUrl(filename);

    if (urlError) {
      throw urlError;
    }

    console.log('PDF generated successfully:', { filename, publicUrl });

    return new Response(
      JSON.stringify({ url: publicUrl }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error generating PDF:', error);

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
});
