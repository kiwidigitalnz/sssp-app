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

    const { data: sssp, error: ssspError } = await supabase
      .from('sssps')
      .select('*')
      .eq('id', ssspId)
      .single();

    if (ssspError) {
      throw ssspError;
    }

    const doc = new jsPDF();
    let y = 20;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const maxWidth = pageWidth - 2 * margin;

    const addHeader = (text: string, level = 1) => {
      if (y > doc.internal.pageSize.height - 40) {
        doc.addPage();
        y = 20;
      }

      if (level === 1) {
        doc.setFillColor(50, 50, 50);
        doc.rect(margin, y - 5, maxWidth, 12, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.text(text.toUpperCase(), margin + 4, y + 2);
        y += 20;
      } else {
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, y - 5, maxWidth, 10, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(text, margin + 2, y + 2);
        y += 15;
      }
    };

    const addContent = (text: string | null | undefined, indent = 0) => {
      if (!text) return;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const lines = doc.splitTextToSize(text, maxWidth - (indent * 10));
      
      if (y + (lines.length * 7) > doc.internal.pageSize.height - margin) {
        doc.addPage();
        y = 20;
      }
      
      doc.text(lines, margin + (indent * 10), y);
      y += lines.length * 7 + 10;
    };

    const addSimpleTable = (data: Array<[string, string]>, shaded = true) => {
      const rowHeight = 8;
      const cellPadding = 3;
      
      data.forEach((row, index) => {
        if (y + rowHeight > doc.internal.pageSize.height - margin) {
          doc.addPage();
          y = 20;
        }

        if (shaded && index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(margin, y - 5, maxWidth, rowHeight + 6, 'F');
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(row[0], margin + cellPadding, y);
        
        doc.setFont('helvetica', 'normal');
        const valueLines = doc.splitTextToSize(row[1], maxWidth - 80);
        doc.text(valueLines, margin + 80, y);
        
        y += Math.max(valueLines.length * 7, rowHeight) + 3;
      });
      y += 5;
    };

    doc.addFileToVFS('Helvetica-Bold', 'Helvetica-Bold');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(50, 50, 50);
    doc.text('SITE SPECIFIC', pageWidth / 2, 80, { align: 'center' });
    doc.text('SAFETY PLAN', pageWidth / 2, 100, { align: 'center' });
    
    doc.setDrawColor(50, 50, 50);
    doc.setLineWidth(1);
    doc.line(margin, 120, pageWidth - margin, 120);
    
    doc.setFontSize(20);
    doc.text(sssp.title, pageWidth / 2, 140, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(sssp.company_name, pageWidth / 2, 160, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Version ${sssp.version}`, pageWidth / 2, 180, { align: 'center' });
    doc.text(formatDate(sssp.created_at), pageWidth / 2, 190, { align: 'center' });

    const addPageNumbers = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        if (i > 1) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(
            `Page ${i} of ${pageCount}`,
            pageWidth - margin,
            doc.internal.pageSize.height - 10,
            { align: 'right' }
          );
        }
      }
    };

    doc.addPage();
    y = 20;

    addHeader('Document Information', 1);
    addSimpleTable([
      ['Status:', sssp.status || 'Not specified'],
      ['Created:', formatDate(sssp.created_at)],
      ['Updated:', formatDate(sssp.updated_at)],
      ['Valid From:', formatDate(sssp.start_date)],
      ['Valid To:', formatDate(sssp.end_date)]
    ]);

    addHeader('Company Information');
    addSimpleTable([
      ['Company:', sssp.company_name],
      ['Address:', sssp.company_address || 'Not specified'],
      ['Contact:', sssp.company_contact_name || 'Not specified'],
      ['Email:', sssp.company_contact_email || 'Not specified'],
      ['Phone:', sssp.company_contact_phone || 'Not specified']
    ]);

    addHeader('Project Overview');
    addContent(sssp.description);

    addHeader('Scope of Work');
    addContent(sssp.services);
    addContent(`Locations: ${sssp.locations}`);
    addContent(`Considerations: ${sssp.considerations}`);

    addHeader('Roles and Responsibilities');
    addContent(`PCBU Duties:\n${sssp.pcbu_duties}`);
    addContent(`Site Supervisor Duties:\n${sssp.site_supervisor_duties}`);
    addContent(`Worker Duties:\n${sssp.worker_duties}`);
    addContent(`Contractor Duties:\n${sssp.contractor_duties}`);

    addHeader('Emergency Procedures');
    addContent(`Emergency Plan:\n${sssp.emergency_plan}`);
    addContent(`Assembly Points:\n${sssp.assembly_points}`);
    addContent(`Emergency Equipment:\n${sssp.emergency_equipment}`);
    addContent(`Incident Reporting:\n${sssp.incident_reporting}`);

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

    addHeader('Health and Safety');
    addContent(`Drug and Alcohol Policy:\n${sssp.drug_and_alcohol}`);
    addContent(`Fatigue Management:\n${sssp.fatigue_management}`);
    addContent(`PPE Requirements:\n${sssp.ppe}`);
    addContent(`Mobile Phone Usage:\n${sssp.mobile_phone}`);

    addHeader('Site Safety Rules');
    addContent(`Entry/Exit Procedures:\n${sssp.entry_exit_procedures}`);
    addContent(`Speed Limits:\n${sssp.speed_limits}`);
    addContent(`Parking Rules:\n${sssp.parking_rules}`);
    addContent(`Site-Specific PPE:\n${sssp.site_specific_ppe}`);

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

    addHeader('Communication');
    addContent(`Methods:\n${sssp.communication_methods}`);
    addContent(`Toolbox Meetings:\n${sssp.toolbox_meetings}`);
    addContent(`Reporting Procedures:\n${sssp.reporting_procedures}`);
    addContent(`Protocols:\n${sssp.communication_protocols}`);
    addContent(`Visitor Rules:\n${sssp.visitor_rules}`);

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

    addPageNumbers();

    console.log('Saving PDF');
    const pdfBytes = doc.output('arraybuffer');
    const safeTitle = sssp.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${safeTitle}-${Date.now()}.pdf`;

    console.log('Creating storage bucket if not exists');
    await supabase.storage.createBucket('sssp_pdfs', {
      public: true,
      fileSizeLimit: 5242880
    });

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
