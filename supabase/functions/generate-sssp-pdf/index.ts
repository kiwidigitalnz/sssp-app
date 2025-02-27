import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { jsPDF } from 'https://esm.sh/jspdf@2.5.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
  'Vary': 'Origin'
};

const formatDate = (date: string | null | undefined): string => {
  if (!date) return 'Not specified';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

serve(async (req) => {
  console.log('Received request:', req.method);

  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    if (req.method !== 'POST') {
      console.error('Invalid request method:', req.method);
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Starting PDF generation');
    const { ssspId } = await req.json();

    if (!ssspId) {
      console.error('No SSSP ID provided');
      return new Response(
        JSON.stringify({ error: 'No SSSP ID provided' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
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
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const maxWidth = pageWidth - 2 * margin;

    const addHeader = (text: string) => {
      if (y > doc.internal.pageSize.height - 40) {
        doc.addPage();
        y = 20;
      }
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, y - 5, maxWidth, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(text, margin, y);
      y += 15;
    };

    const addContent = (text: string | null | undefined) => {
      if (!text) return;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(text, maxWidth);
      if (y + (lines.length * 7) > doc.internal.pageSize.height - margin) {
        doc.addPage();
        y = 20;
      }
      doc.text(lines, margin, y);
      y += lines.length * 7 + 10;
    };

    const addSimpleTable = (data: Array<[string, string]>) => {
      const rowHeight = 7;
      data.forEach(([label, value]) => {
        if (y + rowHeight > doc.internal.pageSize.height - margin) {
          doc.addPage();
          y = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.text(label, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.text(value, margin + 60, y);
        y += rowHeight + 3;
      });
      y += 5;
    };

    // Title Page
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('SITE SPECIFIC', pageWidth / 2, 100, { align: 'center' });
    doc.text('SAFETY PLAN', pageWidth / 2, 120, { align: 'center' });
    doc.setFontSize(16);
    doc.text(sssp.title, pageWidth / 2, 140, { align: 'center' });
    doc.setFontSize(14);
    doc.text(sssp.company_name, pageWidth / 2, 160, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Version ${sssp.version}`, pageWidth / 2, 180, { align: 'center' });
    
    // New page for content
    doc.addPage();
    y = 20;

    // Document Information
    addHeader('Document Information');
    addSimpleTable([
      ['Status:', sssp.status || 'Not specified'],
      ['Created:', formatDate(sssp.created_at)],
      ['Updated:', formatDate(sssp.updated_at)],
      ['Valid From:', formatDate(sssp.start_date)],
      ['Valid To:', formatDate(sssp.end_date)]
    ]);

    // Company Information
    addHeader('Company Information');
    addSimpleTable([
      ['Company:', sssp.company_name],
      ['Address:', sssp.company_address || 'Not specified'],
      ['Contact:', sssp.company_contact_name || 'Not specified'],
      ['Email:', sssp.company_contact_email || 'Not specified'],
      ['Phone:', sssp.company_contact_phone || 'Not specified']
    ]);

    // Project Overview
    addHeader('Project Overview');
    addContent(sssp.description);

    // Scope of Work
    addHeader('Scope of Work');
    addContent(sssp.services);
    addContent(`Locations: ${sssp.locations}`);
    addContent(`Considerations: ${sssp.considerations}`);

    // Roles and Responsibilities
    addHeader('Roles and Responsibilities');
    addContent(`PCBU Duties:\n${sssp.pcbu_duties}`);
    addContent(`Site Supervisor Duties:\n${sssp.site_supervisor_duties}`);
    addContent(`Worker Duties:\n${sssp.worker_duties}`);
    addContent(`Contractor Duties:\n${sssp.contractor_duties}`);

    // Emergency Procedures
    addHeader('Emergency Procedures');
    addContent(`Emergency Plan:\n${sssp.emergency_plan}`);
    addContent(`Assembly Points:\n${sssp.assembly_points}`);
    addContent(`Emergency Equipment:\n${sssp.emergency_equipment}`);
    addContent(`Incident Reporting:\n${sssp.incident_reporting}`);

    // Emergency Contacts
    if (sssp.emergency_contacts?.length) {
      addHeader('Emergency Contacts');
      sssp.emergency_contacts.forEach((contact: any, index: number) => {
        addContent(`Contact ${index + 1}:`);
        addSimpleTable([
          ['Name:', contact.name || ''],
          ['Role:', contact.role || ''],
          ['Phone:', contact.phone || ''],
          ['Email:', contact.email || '']
        ]);
      });
    }

    // Health and Safety
    addHeader('Health and Safety');
    addContent(`Drug and Alcohol Policy:\n${sssp.drug_and_alcohol}`);
    addContent(`Fatigue Management:\n${sssp.fatigue_management}`);
    addContent(`PPE Requirements:\n${sssp.ppe}`);
    addContent(`Mobile Phone Usage:\n${sssp.mobile_phone}`);

    // Site Safety Rules
    addHeader('Site Safety Rules');
    addContent(`Entry/Exit Procedures:\n${sssp.entry_exit_procedures}`);
    addContent(`Speed Limits:\n${sssp.speed_limits}`);
    addContent(`Parking Rules:\n${sssp.parking_rules}`);
    addContent(`Site-Specific PPE:\n${sssp.site_specific_ppe}`);

    // Hazards
    if (sssp.hazards?.length) {
      addHeader('Hazard Management');
      sssp.hazards.forEach((hazard: any, index: number) => {
        addContent(`Hazard ${index + 1}:`);
        addSimpleTable([
          ['Hazard:', hazard.hazard || ''],
          ['Risk:', hazard.risk || ''],
          ['Risk Level:', hazard.riskLevel || ''],
          ['Controls:', hazard.controlMeasures || '']
        ]);
      });
    }

    // Communication
    addHeader('Communication');
    addContent(`Methods:\n${sssp.communication_methods}`);
    addContent(`Toolbox Meetings:\n${sssp.toolbox_meetings}`);
    addContent(`Reporting Procedures:\n${sssp.reporting_procedures}`);
    addContent(`Protocols:\n${sssp.communication_protocols}`);
    addContent(`Visitor Rules:\n${sssp.visitor_rules}`);

    // Monitoring and Review
    if (sssp.monitoring_review) {
      addHeader('Monitoring and Review');
      if (sssp.monitoring_review.review_schedule) {
        addSimpleTable([
          ['Frequency:', sssp.monitoring_review.review_schedule.frequency || ''],
          ['Last Review:', formatDate(sssp.monitoring_review.review_schedule.last_review)],
          ['Next Review:', formatDate(sssp.monitoring_review.review_schedule.next_review)],
          ['Responsible:', sssp.monitoring_review.review_schedule.responsible_person || '']
        ]);
      }
    }

    console.log('Saving PDF');
    const pdfBytes = doc.output('arraybuffer');
    const safeTitle = sssp.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${safeTitle}-${Date.now()}.pdf`;

    console.log('Creating storage bucket if not exists');
    const { error: bucketError } = await supabase
      .storage
      .createBucket('sssp_pdfs', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });

    console.log('Uploading PDF');
    const { error: uploadError } = await supabase.storage
      .from('sssp_pdfs')
      .upload(filename, new Uint8Array(pdfBytes), {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = await supabase.storage
      .from('sssp_pdfs')
      .getPublicUrl(filename);

    console.log('PDF generation complete');
    return new Response(
      JSON.stringify({ url: publicUrl }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in generate-sssp-pdf:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
