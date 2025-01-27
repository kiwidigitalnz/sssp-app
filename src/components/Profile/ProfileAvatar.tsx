import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  userId: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ProfileAvatar({ avatarUrl, userId }: ProfileAvatarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  async function onAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = event.target.files?.[0];
      if (!file) {
        toast({
          variant: "destructive",
          title: "No file selected",
          description: "Please select an image file to upload.",
        });
        return;
      }

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, or WebP image.",
        });
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
        });
        return;
      }

      setIsUploading(true);

      // Delete old avatar if it exists
      if (avatarUrl) {
        const { error: deleteError } = await supabase.storage
          .from("avatars")
          .remove([avatarUrl]);
        
        if (deleteError) {
          console.error("Error deleting old avatar:", deleteError);
        }
      }

      // Generate a unique filename
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}-${Date.now()}.${fileExt}`;

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: filePath })
        .eq("id", userId);

      if (updateError) throw updateError;

      // Invalidate both profile queries to update UI
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      
      toast({
        title: "Success",
        description: "Your profile picture has been updated.",
      });
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to update profile picture. Please try again.",
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      if (event.target) {
        event.target.value = "";
      }
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-6 p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24 ring-2 ring-primary/10 transition-all hover:ring-primary/30">
          <AvatarImage 
            src={avatarUrl ? supabase.storage.from("avatars").getPublicUrl(avatarUrl).data.publicUrl : undefined} 
            alt="Profile picture"
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/5">
            <User className="h-12 w-12 text-primary/70" />
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight">Profile Picture</h3>
          <p className="text-sm text-muted-foreground">
            Personalize your profile with a custom avatar
          </p>
        </div>
      </div>
      <div className="space-y-4 flex-1">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Input
            type="file"
            accept={ALLOWED_FILE_TYPES.join(",")}
            onChange={onAvatarUpload}
            disabled={isUploading}
            className="max-w-md flex-1"
          />
          {isUploading && (
            <span className="text-sm text-muted-foreground animate-pulse">
              Uploading...
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Maximum file size: 5MB</p>
          <p>Supported formats: JPEG, PNG, WebP</p>
        </div>
      </div>
    </div>
  );
}