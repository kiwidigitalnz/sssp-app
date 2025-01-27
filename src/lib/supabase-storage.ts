import { supabase } from "@/integrations/supabase/client";

export async function getAvatarUrl(path: string | null) {
  if (!path) return null;
  
  try {
    const { data } = await supabase.storage
      .from("avatars")
      .getPublicUrl(path);
    
    return data.publicUrl;
  } catch (error) {
    console.error("Error getting avatar URL:", error);
    return null;
  }
}

export async function getCompanyLogoUrl(path: string | null) {
  if (!path) return null;
  
  try {
    const { data } = await supabase.storage
      .from("company-logos")
      .getPublicUrl(path);
    
    return data.publicUrl;
  } catch (error) {
    console.error("Error getting company logo URL:", error);
    return null;
  }
}