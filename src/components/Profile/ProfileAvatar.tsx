import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { User, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

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

  const handleUploadClick = () => {
    hiddenFileInput.current?.click();
  };

  return (
    <div className="flex items-center gap-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative group">
              <Avatar className="h-24 w-24 ring-2 ring-primary/10 transition-all group-hover:ring-primary/30">
                <AvatarImage 
                  src={avatarUrl ? supabase.storage.from("avatars").getPublicUrl(avatarUrl).data.publicUrl : undefined} 
                  alt="Profile picture"
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/5">
                  <User className="h-12 w-12 text-primary/70" />
                </AvatarFallback>
              </Avatar>
              <div 
                className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                onClick={handleUploadClick}
              >
                <Upload className="h-8 w-8 text-white" />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="p-3">
            <div className="space-y-1 text-sm">
              <p>Upload profile picture</p>
              <p className="text-xs text-muted-foreground">Maximum size: 5MB</p>
              <p className="text-xs text-muted-foreground">Formats: JPEG, PNG, WebP</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold tracking-tight">Profile Picture</h3>
        <p className="text-sm text-muted-foreground">
          {isUploading ? (
            <span className="animate-pulse">Uploading...</span>
          ) : (
            "Personalize your profile with a custom avatar"
          )}
        </p>
      </div>
      <Input
        ref={hiddenFileInput}
        type="file"
        accept={ALLOWED_FILE_TYPES.join(",")}
        onChange={onAvatarUpload}
        disabled={isUploading}
        className="hidden"
      />
    </div>
  );
}
