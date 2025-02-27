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

// Colors for the PDF - removed light backgrounds
const colors = {
  primary: [41, 63, 82], // Dark blue
  secondary: [70, 123, 163], // Muted blue
  text: [51, 51, 51], // Dark gray
  subtext: [102, 102, 102], // Medium gray
  accent: [70, 123, 163], // Muted blue
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

    // Enhanced styling functions with removed backgrounds
    const addHeader = (text: string, level = 1) => {
      if (y > doc.internal.pageSize.height - 40) {
        doc.addPage();
        y = 20;
      }

      if (level === 1) {
        // H1 Style - kept the dark background for main sections
        doc.setFillColor(...colors.primary);
        doc.rect(margin, y - 4, maxWidth, 10, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.text(text.toUpperCase(), margin + 3, y + 2);
        y += 16;
      } else {
        // H2 Style - removed background, using just color
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(...colors.secondary);
        doc.text(text, margin + 2, y);
        y += 14;
      }
    };

    const addContent = (text: string | null | undefined, indent = 0) => {
      if (!text) return;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...colors.text);
      const lines = doc.splitTextToSize(text, maxWidth - (indent * 10));
      
      if (y + (lines.length * 6) > doc.internal.pageSize.height - margin) {
        doc.addPage();
        y = 20;
      }
      
      doc.text(lines, margin + (indent * 10), y);
      y += lines.length * 6 + 8;
    };

    const addSimpleTable = (data: Array<[string, string]>) => {
      const rowHeight = 7;
      const cellPadding = 2;
      
      data.forEach((row) => {
        if (y + rowHeight > doc.internal.pageSize.height - margin) {
          doc.addPage();
          y = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...colors.text);
        doc.text(row[0], margin + cellPadding, y);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.subtext);
        const valueLines = doc.splitTextToSize(row[1], maxWidth - 70);
        doc.text(valueLines, margin + 70, y);
        
        y += Math.max(valueLines.length * 6, rowHeight) + 2;
      });
      y += 4;
    };

    // Title page with refined styling
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(...colors.primary);
    doc.text('SITE SPECIFIC', pageWidth / 2, 80, { align: 'center' });
    doc.text('SAFETY PLAN', pageWidth / 2, 100, { align: 'center' });
    
    // Decorative elements
    doc.setDrawColor(...colors.accent);
    doc.setLineWidth(0.5);
    doc.line(margin, 120, pageWidth - margin, 120);
    
    doc.setFontSize(18);
    doc.text(sssp.title, pageWidth / 2, 140, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(...colors.subtext);
    doc.text(sssp.company_name, pageWidth / 2, 160, { align: 'center' });
    
    doc.setFontSize(11);
    doc.text(`Version ${sssp.version}`, pageWidth / 2, 180, { align: 'center' });
    doc.text(formatDate(sssp.created_at), pageWidth / 2, 190, { align: 'center' });

    // Footer with page numbers
    const addPageNumbers = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        if (i > 1) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(...colors.subtext);
          doc.text(
            `Page ${i} of ${pageCount}`,
            pageWidth - margin,
            doc.internal.pageSize.height - 10,
            { align: 'right' }
          );
        }
      }
    };

    // Content pages
    doc.addPage();
    y = 20;

    // Document Information
    addHeader('Document Information', 1);
    addSimpleTable([
      ['Status:', sssp.status || 'Not specified'],
      ['Created:', formatDate(sssp.created_at)],
      ['Updated:', formatDate(sssp.updated_at)],
      ['Valid From:', formatDate(sssp.start_date)],
      ['Valid To:', formatDate(sssp.end_date)]
    ]);

    // Company Information
    addHeader('Company Information', 1);
    addSimpleTable([
      ['Company:', sssp.company_name],
      ['Address:', sssp.company_address || 'Not specified'],
      ['Contact:', sssp.company_contact_name || 'Not specified'],
      ['Email:', sssp.company_contact_email || 'Not specified'],
      ['Phone:', sssp.company_contact_phone || 'Not specified']
    ]);

    // Project Overview
    addHeader('Project Overview', 1);
    addContent(sssp.description);

    // Scope of Work
    addHeader('Scope of Work', 1);
    addContent(sssp.services);
    addHeader('Locations', 2);
    addContent(sssp.locations);
    addHeader('Considerations', 2);
    addContent(sssp.considerations);

    // Roles and Responsibilities
    addHeader('Roles and Responsibilities', 1);
    addHeader('PCBU Duties', 2);
    addContent(sssp.pcbu_duties);
    addHeader('Site Supervisor Duties', 2);
    addContent(sssp.site_supervisor_duties);
    addHeader('Worker Duties', 2);
    addContent(sssp.worker_duties);
    addHeader('Contractor Duties', 2);
    addContent(sssp.contractor_duties);

    // Emergency Procedures
    addHeader('Emergency Procedures', 1);
    addHeader('Emergency Plan', 2);
    addContent(sssp.emergency_plan);
    addHeader('Assembly Points', 2);
    addContent(sssp.assembly_points);
    addHeader('Emergency Equipment', 2);
    addContent(sssp.emergency_equipment);
    addHeader('Incident Reporting', 2);
    addContent(sssp.incident_reporting);

    // Emergency Contacts
    if (sssp.emergency_contacts?.length) {
      addHeader('Emergency Contacts', 1);
      sssp.emergency_contacts.forEach((contact: any, index: number) => {
        addHeader(`Contact ${index + 1}`, 2);
        addSimpleTable([
          ['Name:', contact.name || ''],
          ['Role:', contact.role || ''],
          ['Phone:', contact.phone || ''],
          ['Email:', contact.email || '']
        ]);
      });
    }

    // Health and Safety
    addHeader('Health and Safety', 1);
    addHeader('Drug and Alcohol Policy', 2);
    addContent(sssp.drug_and_alcohol);
    addHeader('Fatigue Management', 2);
    addContent(sssp.fatigue_management);
    addHeader('PPE Requirements', 2);
    addContent(sssp.ppe);
    addHeader('Mobile Phone Usage', 2);
    addContent(sssp.mobile_phone);

    // Site Safety Rules
    addHeader('Site Safety Rules', 1);
    addHeader('Entry/Exit Procedures', 2);
    addContent(sssp.entry_exit_procedures);
    addHeader('Speed Limits', 2);
    addContent(sssp.speed_limits);
    addHeader('Parking Rules', 2);
    addContent(sssp.parking_rules);
    addHeader('Site-Specific PPE', 2);
    addContent(sssp.site_specific_ppe);

    // Hazards
    if (sssp.hazards?.length) {
      addHeader('Hazard Management', 1);
      sssp.hazards.forEach((hazard: any, index: number) => {
        addHeader(`Hazard ${index + 1}`, 2);
        addSimpleTable([
          ['Hazard:', hazard.hazard || ''],
          ['Risk:', hazard.risk || ''],
          ['Risk Level:', hazard.riskLevel || ''],
          ['Controls:', hazard.controlMeasures || '']
        ]);
      });
    }

    // Communication
    addHeader('Communication', 1);
    addHeader('Methods', 2);
    addContent(sssp.communication_methods);
    addHeader('Toolbox Meetings', 2);
    addContent(sssp.toolbox_meetings);
    addHeader('Reporting Procedures', 2);
    addContent(sssp.reporting_procedures);
    addHeader('Communication Protocols', 2);
    addContent(sssp.communication_protocols);
    addHeader('Visitor Rules', 2);
    addContent(sssp.visitor_rules);

    // Monitoring and Review
    if (sssp.monitoring_review) {
      addHeader('Monitoring and Review', 1);
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
