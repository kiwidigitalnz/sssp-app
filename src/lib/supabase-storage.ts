import { supabase } from "@/integrations/supabase/client";

export async function getCompanyLogoUrl(filePath: string): Promise<string> {
  try {
    const { data } = await supabase.storage
      .from("company-logos")
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error("Error getting company logo URL:", error);
    return "";
  }
}