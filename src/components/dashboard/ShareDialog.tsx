
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Loader2, MoreHorizontal, RefreshCw, X, Users } from "lucide-react";
import { useState } from "react";
import type { ShareDialogProps, ShareFormData, SharedUser } from "./types";

export function ShareDialog({
  open,
  onOpenChange,
  selectedSSSP,
  sharedUsers,
  onShare,
  onRevokeAccess,
  onResendInvite
}: ShareDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareForm, setShareForm] = useState<ShareFormData>({
    email: '',
    accessLevel: 'view'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareForm.email) return;

    setIsSubmitting(true);
    try {
      await onShare(shareForm.email, shareForm.accessLevel);
      setShareForm({ email: '', accessLevel: 'view' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleLabel = (user: SharedUser) => {
    if (user.is_creator) return "Owner";
    return user.access_level === "edit" ? "Editor" : "Viewer";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share SSSP</DialogTitle>
          <DialogDescription>
            Share access to "{selectedSSSP?.title}" with other users.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                                    <DropdownMenuItem 
                                      onClick={() => selectedSSSP && onResendInvite(selectedSSSP.id, user.email)}
                                    >
                                      <RefreshCw className="mr-2 h-4 w-4" />
                                      Resend Invitation
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => selectedSSSP && onRevokeAccess(selectedSSSP.id, user.email)}
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
                onClick={() => onOpenChange(false)} 
                disabled={isSubmitting}
              >
                Close
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
