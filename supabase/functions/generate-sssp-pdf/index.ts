
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { jsPDF } from 'https://esm.sh/jspdf@2.5.1'
import { autoTable } from 'https://esm.sh/jspdf-autotable@3.5.28'

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
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const maxWidth = pageWidth - 2 * margin;

    const addHeader = (text: string) => {
      // Check if we need a new page
      if (y > doc.internal.pageSize.height - 40) {
        doc.addPage();
        y = 20;
      }
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, y - 5, maxWidth, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
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

    const addTable = (headers: string[], data: any[][]) => {
      if (y > doc.internal.pageSize.height - 40) {
        doc.addPage();
        y = 20;
      }
      autoTable(doc, {
        startY: y,
        head: [headers],
        body: data,
        margin: { left: margin, right: margin },
        headStyles: { fillColor: [70, 70, 70] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
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
    doc.addPage();
    y = 20;

    // Document Information
    addHeader('Document Information');
    const docInfo = [
      ['Status:', sssp.status],
      ['Created:', formatDate(sssp.created_at)],
      ['Last Updated:', formatDate(sssp.updated_at)],
      ['Valid From:', formatDate(sssp.start_date)],
      ['Valid To:', formatDate(sssp.end_date)]
    ];
    addTable(['Field', 'Value'], docInfo);

    // Company Information
    addHeader('Company Information');
    const companyInfo = [
      ['Company Name:', sssp.company_name],
      ['Address:', sssp.company_address || 'Not specified'],
      ['Contact Person:', sssp.company_contact_name || 'Not specified'],
      ['Contact Email:', sssp.company_contact_email || 'Not specified'],
      ['Contact Phone:', sssp.company_contact_phone || 'Not specified']
    ];
    addTable(['Field', 'Value'], companyInfo);

    // Project Overview
    addHeader('Project Overview');
    addContent(sssp.description);

    // Scope of Work
    addHeader('Scope of Work');
    addContent(sssp.services);
    addContent(sssp.locations);
    addContent(sssp.considerations);

    // Roles and Responsibilities
    addHeader('Roles and Responsibilities');
    addContent(`PCBU Duties:\n${sssp.pcbu_duties}`);
    addContent(`Site Supervisor Duties:\n${sssp.site_supervisor_duties}`);
    addContent(`Worker Duties:\n${sssp.worker_duties}`);
    addContent(`Contractor Duties:\n${sssp.contractor_duties}`);

    // Emergency Procedures
    addHeader('Emergency Procedures');
    addContent(`Emergency Response Plan:\n${sssp.emergency_plan}`);
    addContent(`Assembly Points:\n${sssp.assembly_points}`);
    addContent(`Emergency Equipment:\n${sssp.emergency_equipment}`);
    addContent(`Incident Reporting:\n${sssp.incident_reporting}`);

    // Emergency Contacts
    if (sssp.emergency_contacts && sssp.emergency_contacts.length > 0) {
      addHeader('Emergency Contacts');
      const contactsData = sssp.emergency_contacts.map(contact => [
        contact.name || '',
        contact.role || '',
        contact.phone || '',
        contact.email || ''
      ]);
      addTable(['Name', 'Role', 'Phone', 'Email'], contactsData);
    }

    // Training Requirements
    addHeader('Training and Competency');
    addContent(`Competency Requirements:\n${sssp.competency_requirements}`);
    addContent(`Training Records:\n${sssp.training_records}`);

    if (sssp.required_training && sssp.required_training.length > 0) {
      const trainingData = sssp.required_training.map(training => [
        training.requirement || '',
        training.description || '',
        training.frequency || ''
      ]);
      addTable(['Requirement', 'Description', 'Frequency'], trainingData);
    }

    // Health and Safety Policies
    addHeader('Health and Safety Policies');
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
    if (sssp.hazards && sssp.hazards.length > 0) {
      addHeader('Hazard Management');
      const hazardsData = sssp.hazards.map(hazard => [
        hazard.hazard || '',
        hazard.risk || '',
        hazard.riskLevel || '',
        hazard.controlMeasures || ''
      ]);
      addTable(['Hazard', 'Risk', 'Risk Level', 'Control Measures'], hazardsData);
    }

    // Communication
    addHeader('Communication');
    addContent(`Communication Methods:\n${sssp.communication_methods}`);
    addContent(`Toolbox Meetings:\n${sssp.toolbox_meetings}`);
    addContent(`Reporting Procedures:\n${sssp.reporting_procedures}`);
    addContent(`Communication Protocols:\n${sssp.communication_protocols}`);
    addContent(`Visitor Rules:\n${sssp.visitor_rules}`);

    // Monitoring and Review
    if (sssp.monitoring_review) {
      addHeader('Monitoring and Review');
      const reviewInfo = [
        ['Review Frequency:', sssp.monitoring_review.review_schedule?.frequency || 'Not specified'],
        ['Last Review:', formatDate(sssp.monitoring_review.review_schedule?.last_review)],
        ['Next Review:', formatDate(sssp.monitoring_review.review_schedule?.next_review)],
        ['Responsible Person:', sssp.monitoring_review.review_schedule?.responsible_person || 'Not specified']
      ];
      addTable(['Field', 'Value'], reviewInfo);

      // Worker Consultation
      if (sssp.monitoring_review.worker_consultation) {
        addHeader('Worker Consultation');
        const consultationInfo = [
          ['Method:', sssp.monitoring_review.worker_consultation.method || 'Not specified'],
          ['Frequency:', sssp.monitoring_review.worker_consultation.frequency || 'Not specified'],
          ['Last Consultation:', formatDate(sssp.monitoring_review.worker_consultation.last_consultation)]
        ];
        addTable(['Field', 'Value'], consultationInfo);
      }

      // Documentation
      if (sssp.monitoring_review.documentation) {
        addHeader('Documentation');
        const docInfo = [
          ['Storage Location:', sssp.monitoring_review.documentation.storage_location || 'Not specified'],
          ['Retention Period:', sssp.monitoring_review.documentation.retention_period || 'Not specified'],
          ['Access Details:', sssp.monitoring_review.documentation.access_details || 'Not specified']
        ];
        addTable(['Field', 'Value'], docInfo);
      }
    }

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
