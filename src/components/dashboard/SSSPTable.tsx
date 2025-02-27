import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Share2, FileText, Trash2, MoreHorizontal, Loader2, Users, RefreshCw, X } from "lucide-react";
import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import type { SSSP } from "@/types/sssp";

interface ShareFormData {
  email: string;
  accessLevel: 'view' | 'edit';
}

interface SSSPTableProps {
  sssps: SSSP[];
  onRefresh: () => void;
}

interface SharedUser {
  email: string;
  access_level: string;
  status: string;
  is_creator?: boolean;
}

interface SSSPInvitation {
  id: string;
  sssp_id: string;
  email: string;
  access_level: string;
  status: string;
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
  const [sharedUsers, setSharedUsers] = useState<Record<string, SharedUser[]>>({});

  const fetchSharedUsers = async (sssp: SSSP) => {
    try {
      const sharedData: SharedUser[] = [];
      
      const { data: creatorProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', sssp.created_by)
        .maybeSingle();

      if (creatorProfile) {
        sharedData.push({
          email: creatorProfile.email,
          access_level: 'owner',
          status: 'accepted',
          is_creator: true
        });
      }

      const { data: accessUsers } = await supabase
        .from('sssp_access')
        .select('user_id, access_level')
        .eq('sssp_id', sssp.id);

      if (accessUsers) {
        const userEmails = await Promise.all(accessUsers.map(async (record) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', record.user_id)
            .maybeSingle();
          
          if (profile) {
            return {
              email: profile.email,
              access_level: record.access_level,
              status: 'accepted'
            };
          }
          return null;
        }));

        sharedData.push(...userEmails.filter((user): user is SharedUser => user !== null));
      }

      const { data: invitations } = await supabase
        .from('sssp_invitations')
        .select('email, access_level, status')
        .eq('sssp_id', sssp.id)
        .eq('status', 'pending');

      if (invitations) {
        sharedData.push(...invitations);
      }

      return sharedData;
    } catch (error) {
      console.error('Error fetching shared users:', error);
      return [];
    }
  };

  useEffect(() => {
    if (shareDialogOpen && selectedSSSP) {
      fetchSharedUsers(selectedSSSP).then(users => {
        setSharedUsers(prev => ({
          ...prev,
          [selectedSSSP.id]: users
        }));
      });
    }
  }, [shareDialogOpen, selectedSSSP]);

  const handleShare = async (sssp: SSSP) => {
    setSelectedSSSP(sssp);
    setShareDialogOpen(true);
    setShareForm({ email: '', accessLevel: 'view' });
    
    const users = await fetchSharedUsers(sssp);
    setSharedUsers(prev => ({
      ...prev,
      [sssp.id]: users
    }));
  };

  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Current auth state:', { user, authError });
      
      if (!user) {
        throw new Error("You must be logged in to share SSSPs");
      }

      if (user.email === shareForm.email) {
        toast({
          variant: "destructive",
          title: "Invalid Invitation",
          description: "You cannot invite yourself",
        });
        setIsSubmitting(false);
        return;
      }

      const { data: existingInvite, error: inviteCheckError } = await supabase
        .from('sssp_invitations')
        .select('*')
        .eq('sssp_id', selectedSSSP.id)
        .eq('email', shareForm.email)
        .eq('status', 'pending')
        .maybeSingle();

      if (inviteCheckError) {
        console.error('Error checking existing invitation:', inviteCheckError);
        throw new Error('Failed to check existing invitations');
      }

      if (existingInvite) {
        toast({
          variant: "destructive",
          title: "Invitation Exists",
          description: "An invitation has already been sent to this email",
        });
        setIsSubmitting(false);
        return;
      }

      const { data: invitation, error: inviteError } = await supabase
        .from('sssp_invitations')
        .insert({
          sssp_id: selectedSSSP.id,
          email: shareForm.email,
          access_level: shareForm.accessLevel,
          invited_by: user.id,
          status: 'pending'
        })
        .select()
        .single();

      console.log('Invitation creation result:', { invitation, inviteError });

      if (inviteError) {
        console.error('Failed to create invitation:', inviteError);
        throw new Error('Failed to create invitation');
      }

      const { error: functionError } = await supabase.functions.invoke('send-invitation', {
        body: {
          to: shareForm.email,
          ssspTitle: selectedSSSP.title,
          sssp_id: selectedSSSP.id,
          accessLevel: shareForm.accessLevel,
          inviterEmail: user.email,
        },
      });

      if (functionError) {
        console.error('Failed to send invitation email:', functionError);
        if (invitation) {
          await supabase
            .from('sssp_invitations')
            .delete()
            .eq('id', invitation.id);
        }
        throw new Error('Failed to send invitation email');
      }

      const updatedUsers = await fetchSharedUsers(selectedSSSP);
      setSharedUsers(prev => ({
        ...prev,
        [selectedSSSP.id]: updatedUsers
      }));

      toast({
        title: "Success",
        description: `Invitation sent to ${shareForm.email}`,
      });

      setShareForm({ email: '', accessLevel: 'view' });
    } catch (error: any) {
      console.error('Share error:', error);
      toast({
        variant: "destructive",
        title: "Error Sharing SSSP",
        description: error.message || "Failed to share SSSP. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleResendInvite = async (ssspId: string, email: string) => {
    try {
      const { data: invitation } = await supabase
        .from('sssp_invitations')
        .select('*')
        .eq('sssp_id', ssspId)
        .eq('email', email)
        .eq('status', 'pending')
        .single();

      if (!invitation) {
        throw new Error('Invitation not found');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: functionError } = await supabase.functions.invoke('send-invitation', {
        body: {
          to: email,
          ssspTitle: selectedSSSP?.title || '',
          sssp_id: ssspId,
          accessLevel: invitation.access_level,
          inviterEmail: user.email,
        },
      });

      if (functionError) throw functionError;

      toast({
        title: "Invitation Resent",
        description: `A new invitation has been sent to ${email}`,
      });
    } catch (error: any) {
      console.error('Resend error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resend invitation",
      });
    }
  };

  const handleRevokeAccess = async (ssspId: string, email: string) => {
    try {
      await supabase
        .from('sssp_invitations')
        .delete()
        .eq('sssp_id', ssspId)
        .eq('email', email);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: userToRevoke } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (userToRevoke) {
        await supabase
          .from('sssp_access')
          .delete()
          .eq('sssp_id', ssspId)
          .eq('user_id', userToRevoke.id);
      }

      if (selectedSSSP) {
        const updatedUsers = await fetchSharedUsers(selectedSSSP);
        setSharedUsers(prev => ({
          ...prev,
          [ssspId]: updatedUsers
        }));
      }

      toast({
        title: "Access Revoked",
        description: `Access has been revoked for ${email}`,
      });
    } catch (error: any) {
      console.error('Revoke error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to revoke access",
      });
    }
  };

  const getRoleLabel = (user: SharedUser) => {
    if (user.is_creator) return "Owner";
    return user.access_level === "edit" ? "Editor" : "Viewer";
  };

  const handleModalClose = () => {
    setShareDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelectedSSSP(null);
    setShareForm({ email: '', accessLevel: 'view' });
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
            <TableHead>Shared With</TableHead>
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
              <TableCell>
                {sharedUsers[sssp.id]?.length > 0 ? (
                  <div className="flex gap-1 items-center">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {sharedUsers[sssp.id].length} user{sharedUsers[sssp.id].length !== 1 ? 's' : ''}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Not shared</span>
                )}
              </TableCell>
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
                    <DropdownMenuItem onClick={() => {
                      handleClone(sssp);
                    }}>
                      <Copy className="mr-2 h-4 w-4" />
                      Clone
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      handleShare(sssp);
                    }}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      handlePrintToPDF(sssp);
                    }}>
                      <FileText className="mr-2 h-4 w-4" />
                      Print to PDF
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        confirmDelete(sssp);
                      }}
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

      <Dialog open={shareDialogOpen} onOpenChange={(open) => {
        if (!open) {
          handleModalClose();
        }
        setShareDialogOpen(open);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share SSSP</DialogTitle>
            <DialogDescription>
              Share access to "{selectedSSSP?.title}" with other users.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <form onSubmit={handleShareSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter recipient's email"
                      value={shareForm.email}
                      disabled={isSubmitting}
                      onChange={(e) => setShareForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="w-full md:w-48 space-y-2">
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
                  <div className="flex items-end">
                    <Button
                      type="submit"
                      disabled={!shareForm.email || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sharing...
                        </>
                      ) : (
                        "Share"
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Shared with</Label>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedSSSP && sharedUsers[selectedSSSP.id]?.map((user, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              <span className="font-medium">{user.email}</span>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={user.is_creator ? "default" : "outline"}
                                className="capitalize"
                              >
                                {getRoleLabel(user)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === 'pending' ? 'secondary' : 'default'}>
                                {user.status === 'pending' ? 'Pending' : 'Accepted'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {!user.is_creator && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {user.status === 'pending' && (
                                      <DropdownMenuItem onClick={() => handleResendInvite(selectedSSSP.id, user.email)}>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Resend Invitation
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleRevokeAccess(selectedSSSP.id, user.email)}
                                    >
                                      <X className="mr-2 h-4 w-4" />
                                      Revoke Access
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        {selectedSSSP && (!sharedUsers[selectedSSSP.id] || sharedUsers[selectedSSSP.id].length === 0) && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                              No users shared yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShareDialogOpen(false)} 
                  disabled={isSubmitting}
                >
                  Close
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => {
        if (!open) {
          handleModalClose();
        }
        setDeleteDialogOpen(open);
      }}>
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
    </>
  );
}
