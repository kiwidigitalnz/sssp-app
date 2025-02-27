
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

    console.log('Generating PDF for SSSP:', ssspId);

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
      console.error('Error fetching SSSP:', ssspError);
      throw ssspError;
    }

    // Generate PDF content (for now, just a text representation)
    const pdfContent = `SSSP Details:\n${JSON.stringify(sssp, null, 2)}`;
    
    // Create a safe filename
    const safeTitle = sssp.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = Date.now();
    const filename = `${safeTitle}-${timestamp}.txt`;

    // Convert content to Blob
    const blob = new Blob([pdfContent], { type: 'text/plain' });

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('sssp_pdfs')
      .upload(filename, blob, {
        contentType: 'text/plain',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    // Get public URL for the uploaded file
    const { data: { publicUrl }, error: urlError } = await supabase.storage
      .from('sssp_pdfs')
      .getPublicUrl(filename);

    if (urlError) {
      console.error('Error getting public URL:', urlError);
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
