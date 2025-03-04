
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/utils/activityLogging";

interface ShareSSSPProps {
  ssspId: string;
  onShare?: () => void;
  children: React.ReactNode;
}

export function ShareSSSP({ ssspId, onShare, children }: ShareSSSPProps) {
  const [email, setEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState("view");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.functions.invoke('send-invitation', {
        body: {
          ssspId,
          recipientEmail: email,
          accessLevel
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Invitation sent to ${email}`,
      });

      setEmail("");
      setIsOpen(false);
      onShare?.();
    } catch (error) {
      console.error('Share error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invitation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share SSSP</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Enter email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Select
              value={accessLevel}
              onValueChange={setAccessLevel}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View</SelectItem>
                <SelectItem value="edit">Edit</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleShare} disabled={!email || isLoading}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite
            </Button>
          </div>

          <div className="rounded-md border p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h4 className="font-medium">Shared with</h4>
            </div>
            <div className="mt-2">
              {/* We'll implement the shared users list in the next iteration */}
              <p className="text-sm text-muted-foreground">
                No users have access to this SSSP yet
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
