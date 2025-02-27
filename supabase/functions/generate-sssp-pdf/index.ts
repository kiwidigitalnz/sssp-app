
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as pdf from 'https://esm.sh/pdfkit@0.13.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const formatDate = (date: string | null | undefined): string => {
  if (!date) return 'Not specified';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ssspId } = await req.json();

    if (!ssspId) {
      throw new Error('No SSSP ID provided');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: sssp, error: ssspError } = await supabase
      .from('sssps')
      .select('*')
      .eq('id', ssspId)
      .single();

    if (ssspError) {
      throw ssspError;
    }

    // Create a new PDF document
    const doc = new pdf();
    const chunks: Uint8Array[] = [];

    // Collect PDF data chunks
    doc.on('data', (chunk) => chunks.push(chunk));

    // Header
    doc.fontSize(24).text('SITE SPECIFIC SAFETY PLAN (SSSP)', { align: 'center' });
    doc.moveDown();

    // Document Information
    doc.fontSize(16).text('Document Information');
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Title: ${sssp.title}`);
    doc.text(`Company: ${sssp.company_name}`);
    doc.text(`Status: ${sssp.status}`);
    doc.text(`Version: ${sssp.version}`);
    doc.text(`Created: ${formatDate(sssp.created_at)}`);
    doc.text(`Last Updated: ${formatDate(sssp.updated_at)}`);
    doc.text(`Valid From: ${formatDate(sssp.start_date)} to ${formatDate(sssp.end_date)}`);
    doc.moveDown();

    // Company Information
    doc.fontSize(16).text('Company Information');
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Address: ${sssp.company_address || 'Not specified'}`);
    doc.text(`Contact Person: ${sssp.company_contact_name || 'Not specified'}`);
    doc.text(`Contact Email: ${sssp.company_contact_email || 'Not specified'}`);
    doc.text(`Contact Phone: ${sssp.company_contact_phone || 'Not specified'}`);
    doc.moveDown();

    // Project Overview
    doc.fontSize(16).text('Project Overview');
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(sssp.description || 'No description provided');
    doc.moveDown();

    // Scope of Work
    if (sssp.services) {
      doc.fontSize(16).text('Scope of Work');
      doc.moveDown(0.5);
      doc.fontSize(12);
      doc.text(sssp.services);
      doc.moveDown();
    }

    // Add all other sections with proper formatting
    const addSection = (title: string, content: string | null | undefined) => {
      if (content) {
        doc.fontSize(16).text(title);
        doc.moveDown(0.5);
        doc.fontSize(12);
        doc.text(content);
        doc.moveDown();
      }
    };

    const addArraySection = (title: string, items: any[] | null | undefined) => {
      if (items?.length) {
        doc.fontSize(16).text(title);
        doc.moveDown(0.5);
        doc.fontSize(12);
        items.forEach((item, index) => {
          doc.text(`${index + 1}. ${JSON.stringify(item, null, 2)}`);
        });
        doc.moveDown();
      }
    };

    // Add remaining sections
    addSection('Key Locations and Routes', sssp.locations);
    addSection('Special Considerations', sssp.considerations);
    addSection('PCBU Duties', sssp.pcbu_duties);
    addSection('Site Supervisor Duties', sssp.site_supervisor_duties);
    addSection('Worker Duties', sssp.worker_duties);
    addSection('Contractor Duties', sssp.contractor_duties);
    addSection('Emergency Response Plan', sssp.emergency_plan);
    addSection('Assembly Points', sssp.assembly_points);
    addSection('Emergency Equipment', sssp.emergency_equipment);
    addSection('Incident Reporting', sssp.incident_reporting);
    
    addArraySection('Emergency Contacts', sssp.emergency_contacts);
    addArraySection('Required Training', sssp.required_training);
    addArraySection('Hazards', sssp.hazards);
    addArraySection('Meetings Schedule', sssp.meetings_schedule);

    // Monitoring and Review
    if (sssp.monitoring_review) {
      doc.fontSize(16).text('Monitoring and Review');
      doc.moveDown(0.5);
      doc.fontSize(12);
      doc.text(`Review Schedule: ${sssp.monitoring_review.review_schedule?.frequency || 'Not specified'}`);
      doc.text(`Last Review: ${formatDate(sssp.monitoring_review.review_schedule?.last_review)}`);
      doc.text(`Next Review: ${formatDate(sssp.monitoring_review.review_schedule?.next_review)}`);
      doc.text(`Responsible Person: ${sssp.monitoring_review.review_schedule?.responsible_person || 'Not specified'}`);
      doc.moveDown();
    }

    // End the document
    doc.end();

    // Combine chunks into a single Uint8Array
    const pdfData = new Uint8Array(Buffer.concat(chunks));

    const safeTitle = sssp.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${safeTitle}-${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('sssp_pdfs')
      .upload(filename, pdfData, {
        contentType: 'application/pdf',
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
