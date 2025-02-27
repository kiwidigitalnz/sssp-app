import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import * as ReactPDF from '@react-pdf/renderer';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SSSPData {
  id: string;
  title: string;
  company_name: string;
  description?: string;
  status: string;
  hazards?: any[];
  emergency_contacts?: any[];
  // ... other SSSP fields
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { ssspId } = await req.json()
    if (!ssspId) {
      throw new Error('SSSP ID is required')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch SSSP data
    const { data: sssp, error: ssspError } = await supabaseClient
      .from('sssps')
      .select('*')
      .eq('id', ssspId)
      .single()

    if (ssspError || !sssp) {
      throw new Error('Failed to fetch SSSP data')
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(sssp)

    // Upload PDF to Supabase Storage
    const timestamp = new Date().toISOString()
    const filename = `sssp-${ssspId}-${timestamp}.pdf`
    
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('sssp-pdfs')
      .upload(filename, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      throw new Error('Failed to upload PDF')
    }

    // Get public URL for the uploaded PDF
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from('sssp-pdfs')
      .getPublicUrl(filename)

    return new Response(
      JSON.stringify({ url: publicUrl }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error generating PDF:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})

async function generatePDF(sssp: SSSPData) {
  // Define styles for PDF
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 40,
    },
    section: {
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 10,
    },
    text: {
      fontSize: 12,
      marginBottom: 5,
    },
    table: {
      display: 'table',
      width: 'auto',
      marginBottom: 10,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#000',
    },
    tableCell: {
      padding: 5,
    },
  })

  // Create PDF Document
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.title}>{sssp.title}</Text>
          <Text style={styles.subtitle}>{sssp.company_name}</Text>
          <Text style={styles.text}>Status: {sssp.status}</Text>
          <Text style={styles.text}>Generated: {new Date().toLocaleDateString()}</Text>
        </View>

        {/* Project Details */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Project Details</Text>
          <Text style={styles.text}>{sssp.description}</Text>
        </View>

        {/* Hazards Table */}
        {sssp.hazards && sssp.hazards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Hazards</Text>
            <View style={styles.table}>
              {sssp.hazards.map((hazard, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{hazard.hazard}</Text>
                  <Text style={styles.tableCell}>{hazard.risk_level}</Text>
                  <Text style={styles.tableCell}>{hazard.control_measures}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Emergency Contacts */}
        {sssp.emergency_contacts && sssp.emergency_contacts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Emergency Contacts</Text>
            {sssp.emergency_contacts.map((contact, index) => (
              <View key={index}>
                <Text style={styles.text}>{contact.name} - {contact.role}</Text>
                <Text style={styles.text}>{contact.phone}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )

  // Render PDF to buffer
  const pdfBuffer = await ReactPDF.renderToBuffer(<MyDocument />)
  return pdfBuffer
}
