import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getCompanyLogoUrl } from "@/lib/supabase-storage";

interface CompanyLogoProps {
  logoUrl: string | null;
  companyId?: string;
  onUploadSuccess: (filePath: string) => void;
  isLoading?: boolean;
}

export function CompanyLogo({ logoUrl, companyId, onUploadSuccess, isLoading }: CompanyLogoProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadLogoUrl = async () => {
      if (logoUrl) {
        try {
          const url = await getCompanyLogoUrl(logoUrl);
          setPreviewUrl(url);
        } catch (error) {
          console.error('Error loading logo URL:', error);
          setPreviewUrl(null);
        }
      } else {
        setPreviewUrl(null);
      }
    };

    loadLogoUrl();
  }, [logoUrl]);

  async function onLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setIsUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${companyId || 'new'}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("company-logos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      onUploadSuccess(filePath);
      
      // Update preview
      const url = await getCompanyLogoUrl(filePath);
      setPreviewUrl(url);

      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Company logo"
            className="h-full w-full object-contain"
          />
        ) : (
          <Building2 className="h-10 w-10 text-gray-400" />
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Company Logo</h3>
        <div className="flex items-center space-x-2">
          <Input
            type="file"
            accept="image/*"
            onChange={onLogoUpload}
            disabled={isLoading || isUploading}
            className="max-w-xs"
          />
          {isUploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
        </div>
      </div>
    </div>
  );
}