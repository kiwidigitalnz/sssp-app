
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Share2, Copy, Printer, Trash2, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SSSP } from "@/types/sssp";
import { ShareSSSP } from "@/components/SSSPForm/ShareSSSP";
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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SSSPTableProps {
  ssspList: SSSP[];
}

export function SSSPTable({ ssspList }: SSSPTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ssspToDelete, setSsspToDelete] = useState<string | null>(null);
  const [ssspToClone, setSsspToClone] = useState<SSSP | null>(null);

  const { data: sharingInfo, refetch: refetchSharing } = useQuery({
    queryKey: ['sssp-sharing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sssp_access')
        .select('sssp_id, user_id');
      
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data.forEach(access => {
        counts[access.sssp_id] = (counts[access.sssp_id] || 0) + 1;
      });
      
      return counts;
    }
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sssps')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "SSSP deleted",
        description: "The SSSP has been successfully deleted",
      });

      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete SSSP",
      });
    }
    setSsspToDelete(null);
  };

  const handleClone = async (sssp: SSSP) => {
    try {
      const clonedSSSP = {
        ...sssp,
        id: undefined,
        title: `CLONE - ${sssp.title}`,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('sssps')
        .insert([clonedSSSP])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "SSSP cloned",
        description: "A new copy of the SSSP has been created",
      });

      // Navigate to the new SSSP
      navigate(`/edit-sssp/${data.id}`);
    } catch (error) {
      console.error('Clone error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clone SSSP",
      });
    }
    setSsspToClone(null);
  };

  const handleExportPDF = async (sssp: SSSP) => {
    toast({
      title: "Generating PDF",
      description: "Your PDF is being prepared for download",
    });
    
    // TODO: Implement PDF generation
    // For now, show a message that this feature is coming soon
    toast({
      title: "Coming Soon",
      description: "PDF export functionality will be available in the next update",
    });
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Site-Specific Safety Plans</CardTitle>
        <Button 
          onClick={() => navigate("/create-sssp")}
          className="transition-all hover:scale-105"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create New SSSP
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="min-w-[200px] font-semibold">Title</TableHead>
                    <TableHead className="hidden sm:table-cell font-semibold">Created Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="hidden sm:table-cell font-semibold">Shared With</TableHead>
                    <TableHead className="hidden sm:table-cell font-semibold">Last Modified</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ssspList.map((sssp) => (
                    <TableRow 
                      key={sssp.id} 
                      className="transition-colors hover:bg-muted/50 border-t cursor-pointer"
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('.action-buttons')) {
                          e.stopPropagation();
                          return;
                        }
                        navigate(`/edit-sssp/${sssp.id}`);
                      }}
                    >
                      <TableCell className="font-medium">
                        {sssp.title}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {new Date(sssp.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            sssp.status === "draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {sssp.status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {sharingInfo && sharingInfo[sssp.id] ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{sharingInfo[sssp.id]} users</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not shared</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {new Date(sssp.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right action-buttons">
                        <TooltipProvider>
                          <div className="flex items-center justify-end space-x-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {}}
                                  className="h-8 w-8"
                                >
                                  <ShareSSSP 
                                    ssspId={sssp.id} 
                                    onShare={() => refetchSharing()} 
                                  >
                                    <Share2 className="h-4 w-4" />
                                  </ShareSSSP>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Share SSSP</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setSsspToClone(sssp)}
                                  className="h-8 w-8"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Clone SSSP</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleExportPDF(sssp)}
                                  className="h-8 w-8"
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Export as PDF</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setSsspToDelete(sssp.id)}
                                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete SSSP</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!ssspToDelete} onOpenChange={() => setSsspToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the SSSP.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => ssspToDelete && handleDelete(ssspToDelete)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clone Confirmation Dialog */}
      <AlertDialog open={!!ssspToClone} onOpenChange={() => setSsspToClone(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clone SSSP</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a new copy of the SSSP with all its data. The new SSSP will be in draft status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => ssspToClone && handleClone(ssspToClone)}
            >
              Clone
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
