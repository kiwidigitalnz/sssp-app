
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { jsPDF } from 'https://esm.sh/jspdf@2.5.1'

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
    console.log('Starting PDF generation');
    const { ssspId } = await req.json();

    if (!ssspId) {
      throw new Error('No SSSP ID provided');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Fetching SSSP data');
    const { data: sssp, error: ssspError } = await supabase
      .from('sssps')
      .select('*')
      .eq('id', ssspId)
      .single();

    if (ssspError) {
      throw ssspError;
    }

    console.log('Creating PDF document');
    const doc = new jsPDF();
    let y = 20;
    const lineHeight = 7;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const maxWidth = pageWidth - 2 * margin;

    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      
      const lines = doc.splitTextToSize(text, maxWidth);
      
      // Check if we need a new page
      if (y + (lines.length * lineHeight) > doc.internal.pageSize.height - margin) {
        doc.addPage();
        y = margin;
      }
      
      doc.text(lines, margin, y);
      y += lines.length * lineHeight;
      y += 5; // Add some padding after each section
    };

    const addSection = (title: string, content: string | null | undefined) => {
      if (content) {
        addText(title, 14, true);
        addText(content);
      }
    };

    // Title
    addText('SITE SPECIFIC SAFETY PLAN (SSSP)', 24, true);

    // Document Information
    addText('\nDocument Information', 16, true);
    addText(`Title: ${sssp.title}`);
    addText(`Company: ${sssp.company_name}`);
    addText(`Status: ${sssp.status}`);
    addText(`Version: ${sssp.version}`);
    addText(`Created: ${formatDate(sssp.created_at)}`);
    addText(`Last Updated: ${formatDate(sssp.updated_at)}`);
    addText(`Valid From: ${formatDate(sssp.start_date)} to ${formatDate(sssp.end_date)}`);

    // Company Information
    addSection('Company Information', 
      `Address: ${sssp.company_address || 'Not specified'}
Contact Person: ${sssp.company_contact_name || 'Not specified'}
Contact Email: ${sssp.company_contact_email || 'Not specified'}
Contact Phone: ${sssp.company_contact_phone || 'Not specified'}`
    );

    // Project Overview
    addSection('Project Overview', sssp.description);
    addSection('Scope of Work', sssp.services);
    addSection('Key Locations and Routes', sssp.locations);
    addSection('Special Considerations', sssp.considerations);

    // Roles and Responsibilities
    addSection('PCBU Duties', sssp.pcbu_duties);
    addSection('Site Supervisor Duties', sssp.site_supervisor_duties);
    addSection('Worker Duties', sssp.worker_duties);
    addSection('Contractor Duties', sssp.contractor_duties);

    // Emergency Procedures
    addSection('Emergency Response Plan', sssp.emergency_plan);
    addSection('Assembly Points', sssp.assembly_points);
    addSection('Emergency Equipment', sssp.emergency_equipment);
    addSection('Incident Reporting', sssp.incident_reporting);

    // Health and Safety
    addSection('Drug and Alcohol Policy', sssp.drug_and_alcohol);
    addSection('Fatigue Management', sssp.fatigue_management);
    addSection('PPE Requirements', sssp.ppe);
    addSection('Mobile Phone Usage', sssp.mobile_phone);

    // Site Rules
    addSection('Entry/Exit Procedures', sssp.entry_exit_procedures);
    addSection('Speed Limits', sssp.speed_limits);
    addSection('Parking Rules', sssp.parking_rules);
    addSection('Site-Specific PPE', sssp.site_specific_ppe);

    // Communication
    addSection('Communication Methods', sssp.communication_methods);
    addSection('Toolbox Meetings', sssp.toolbox_meetings);
    addSection('Reporting Procedures', sssp.reporting_procedures);
    addSection('Communication Protocols', sssp.communication_protocols);
    addSection('Visitor Rules', sssp.visitor_rules);

    console.log('Saving PDF');
    const pdfBytes = doc.output('arraybuffer');
    const safeTitle = sssp.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${safeTitle}-${Date.now()}.pdf`;

    console.log('Uploading PDF');
    const { error: uploadError } = await supabase.storage
      .from('sssp_pdfs')
      .upload(filename, new Uint8Array(pdfBytes), {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = await supabase.storage
      .from('sssp_pdfs')
      .getPublicUrl(filename);

    console.log('PDF generation complete');
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
