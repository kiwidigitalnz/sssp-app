import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Share2, FileText, Trash2, MoreHorizontal, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SSSP {
  id: string;
  title: string;
  description: string;
  company_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  version: number;
}

interface ShareFormData {
  email: string;
  accessLevel: 'view' | 'edit';
}

interface SSSPTableProps {
  sssps: SSSP[];
  onRefresh: () => void;
}

export function SSSPTable({ sssps, onRefresh }: SSSPTableProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedSSSP, setSelectedSSSP] = useState<SSSP | null>(null);
  const [shareForm, setShareForm] = useState<ShareFormData>({
    email: '',
    accessLevel: 'view'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClone = async (sssp: SSSP) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: originalSSSP, error: fetchError } = await supabase
        .from('sssps')
        .select('*')
        .eq('id', sssp.id)
        .single();

      if (fetchError) throw fetchError;

      const { data: newSSSP, error: insertError } = await supabase
        .from('sssps')
        .insert({
          ...originalSSSP,
          id: undefined,
          title: `${originalSSSP.title} (Copy)`,
          created_by: user.id,
          modified_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1,
          status: 'draft'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "SSSP cloned successfully",
      });

      onRefresh();
    } catch (error) {
      console.error('Clone error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clone SSSP",
      });
    }
  };

  const handleShare = (sssp: SSSP) => {
    setSelectedSSSP(sssp);
    setShareDialogOpen(true);
    setShareForm({ email: '', accessLevel: 'view' });
  };

  const handleShareSubmit = async () => {
    if (!selectedSSSP || !shareForm.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an email address",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to share SSSPs");
      }

      const { data: existingInvite, error: checkError } = await supabase
        .from('sssp_invitations')
        .select('*')
        .eq('sssp_id', selectedSSSP.id)
        .eq('email', shareForm.email)
        .eq('status', 'pending')
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingInvite) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An invitation has already been sent to this email",
        });
        return;
      }

      const { error: inviteError } = await supabase
        .from('sssp_invitations')
        .insert({
          sssp_id: selectedSSSP.id,
          email: shareForm.email,
          access_level: shareForm.accessLevel,
          invited_by: user.id,
          status: 'pending'
        });

      if (inviteError) {
        throw inviteError;
      }

      toast({
        title: "Sending invitation...",
        description: "Please wait while we send the invitation.",
      });

      const { error: functionError } = await supabase.functions.invoke('send-invitation', {
        body: {
          to: shareForm.email,
          ssspTitle: selectedSSSP.title,
          accessLevel: shareForm.accessLevel,
          inviterEmail: user.email,
        },
      });

      if (functionError) {
        throw functionError;
      }

      toast({
        title: "✅ Invitation Sent",
        description: `An invitation has been sent to ${shareForm.email}`,
      });

      setShareDialogOpen(false);
      setShareForm({ email: '', accessLevel: 'view' });
    } catch (error: any) {
      console.error('Share error:', error);
      toast({
        variant: "destructive",
        title: "Error Sending Invitation",
        description: error.message || "There was a problem sending the invitation. Please try again.",
      });

      if (error.message === "Failed to send invitation email") {
        await supabase
          .from('sssp_invitations')
          .delete()
          .eq('sssp_id', selectedSSSP.id)
          .eq('email', shareForm.email);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintToPDF = async (sssp: SSSP) => {
    try {
      window.open(`/sssp/${sssp.id}/print`, '_blank');
      
      toast({
        title: "Success",
        description: "Preparing PDF for download...",
      });
    } catch (error) {
      console.error('PDF error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate PDF",
      });
    }
  };

  const confirmDelete = (sssp: SSSP) => {
    setSelectedSSSP(sssp);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async (sssp: SSSP) => {
    try {
      const { error } = await supabase
        .from('sssps')
        .delete()
        .eq('id', sssp.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "SSSP deleted successfully",
      });

      setDeleteDialogOpen(false);
      setSelectedSSSP(null);
      onRefresh();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete SSSP",
      });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sssps.map((sssp) => (
            <TableRow key={sssp.id} className="cursor-pointer">
              <TableCell onClick={() => navigate(`/sssp/${sssp.id}`)}>{sssp.title}</TableCell>
              <TableCell onClick={() => navigate(`/sssp/${sssp.id}`)}>{sssp.company_name}</TableCell>
              <TableCell onClick={() => navigate(`/sssp/${sssp.id}`)}>{sssp.status}</TableCell>
              <TableCell onClick={() => navigate(`/sssp/${sssp.id}`)}>{sssp.version}</TableCell>
              <TableCell onClick={() => navigate(`/sssp/${sssp.id}`)}>
                {new Date(sssp.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleClone(sssp)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Clone
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare(sssp)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePrintToPDF(sssp)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Print to PDF
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => confirmDelete(sssp)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the SSSP
              "{selectedSSSP?.title}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => selectedSSSP && handleDelete(selectedSSSP)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share SSSP</DialogTitle>
            <DialogDescription>
              Share access to "{selectedSSSP?.title}" with other users.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter recipient's email"
                value={shareForm.email}
                disabled={isSubmitting}
                onChange={(e) => setShareForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="access-level">Access level</Label>
              <Select
                value={shareForm.accessLevel}
                disabled={isSubmitting}
                onValueChange={(value: 'view' | 'edit') => 
                  setShareForm(prev => ({ ...prev, accessLevel: value }))
                }
              >
                <SelectTrigger id="access-level">
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View only</SelectItem>
                  <SelectItem value="edit">Can edit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>The user will receive an email invitation to collaborate on this SSSP.</p>
              {shareForm.accessLevel === 'edit' && (
                <p className="mt-2 text-amber-600">
                  ⚠️ Edit access will allow the user to make changes to this SSSP.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleShareSubmit}
              disabled={!shareForm.email || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Share"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
