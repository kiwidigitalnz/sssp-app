
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const formatSection = (title: string, content: string | null | undefined): string => {
  if (!content) return '';
  return `
${title}
${'='.repeat(title.length)}
${content}

`;
}

const formatArraySection = (title: string, items: any[] | null | undefined): string => {
  if (!items || items.length === 0) return '';
  return `
${title}
${'='.repeat(title.length)}
${items.map((item, index) => `${index + 1}. ${JSON.stringify(item, null, 2)}`).join('\n')}

`;
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

    const pdfContent = `
SITE SPECIFIC SAFETY PLAN (SSSP)
===============================

Document Information
------------------
Title: ${sssp.title}
Company: ${sssp.company_name}
Status: ${sssp.status}
Version: ${sssp.version}
Created: ${formatDate(sssp.created_at)}
Last Updated: ${formatDate(sssp.updated_at)}
Valid From: ${formatDate(sssp.start_date)} to ${formatDate(sssp.end_date)}

Company Information
-----------------
Address: ${sssp.company_address || 'Not specified'}
Contact Person: ${sssp.company_contact_name || 'Not specified'}
Contact Email: ${sssp.company_contact_email || 'Not specified'}
Contact Phone: ${sssp.company_contact_phone || 'Not specified'}

Project Overview
--------------
${sssp.description || 'No description provided'}

${formatSection('Scope of Work', sssp.services)}
${formatSection('Key Locations and Routes', sssp.locations)}
${formatSection('Special Considerations', sssp.considerations)}

Roles and Responsibilities
------------------------
${formatSection('PCBU Duties', sssp.pcbu_duties)}
${formatSection('Site Supervisor Duties', sssp.site_supervisor_duties)}
${formatSection('Worker Duties', sssp.worker_duties)}
${formatSection('Contractor Duties', sssp.contractor_duties)}

Emergency Procedures
------------------
${formatSection('Emergency Response Plan', sssp.emergency_plan)}
${formatSection('Assembly Points', sssp.assembly_points)}
${formatSection('Emergency Equipment', sssp.emergency_equipment)}
${formatSection('Incident Reporting', sssp.incident_reporting)}
${formatArraySection('Emergency Contacts', sssp.emergency_contacts)}

Training and Competency
----------------------
${formatSection('Competency Requirements', sssp.competency_requirements)}
${formatSection('Training Records', sssp.training_records)}
${formatArraySection('Required Training', sssp.required_training)}

Health and Safety Policies
------------------------
${formatSection('Drug and Alcohol Policy', sssp.drug_and_alcohol)}
${formatSection('Fatigue Management', sssp.fatigue_management)}
${formatSection('PPE Requirements', sssp.ppe)}
${formatSection('Mobile Phone Usage', sssp.mobile_phone)}

Site Safety Rules
---------------
${formatSection('Entry/Exit Procedures', sssp.entry_exit_procedures)}
${formatSection('Speed Limits', sssp.speed_limits)}
${formatSection('Parking Rules', sssp.parking_rules)}
${formatSection('Site-Specific PPE', sssp.site_specific_ppe)}

Communication
-----------
${formatSection('Communication Methods', sssp.communication_methods)}
${formatSection('Toolbox Meetings', sssp.toolbox_meetings)}
${formatSection('Reporting Procedures', sssp.reporting_procedures)}
${formatSection('Communication Protocols', sssp.communication_protocols)}
${formatSection('Visitor Rules', sssp.visitor_rules)}
${formatArraySection('Meetings Schedule', sssp.meetings_schedule)}

Hazard Management
---------------
${formatArraySection('Identified Hazards', sssp.hazards)}

Monitoring and Review
-------------------
Review Schedule: ${sssp.monitoring_review?.review_schedule?.frequency || 'Not specified'}
Last Review: ${formatDate(sssp.monitoring_review?.review_schedule?.last_review)}
Next Review: ${formatDate(sssp.monitoring_review?.review_schedule?.next_review)}
Responsible Person: ${sssp.monitoring_review?.review_schedule?.responsible_person || 'Not specified'}

${formatArraySection('KPIs', sssp.monitoring_review?.kpis)}
${formatSection('Corrective Actions Process', sssp.monitoring_review?.corrective_actions?.process)}
${formatSection('Tracking Method', sssp.monitoring_review?.corrective_actions?.tracking_method)}
${formatArraySection('Audits', sssp.monitoring_review?.audits)}

Worker Consultation
-----------------
Method: ${sssp.monitoring_review?.worker_consultation?.method || 'Not specified'}
Frequency: ${sssp.monitoring_review?.worker_consultation?.frequency || 'Not specified'}
Last Consultation: ${formatDate(sssp.monitoring_review?.worker_consultation?.last_consultation)}

Documentation
------------
Storage Location: ${sssp.monitoring_review?.documentation?.storage_location || 'Not specified'}
Retention Period: ${sssp.monitoring_review?.documentation?.retention_period || 'Not specified'}
Access Details: ${sssp.monitoring_review?.documentation?.access_details || 'Not specified'}
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
