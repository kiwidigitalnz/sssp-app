import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmailUpdateDialog } from "./EmailUpdateDialog";
import { PasswordUpdateDialog } from "./PasswordUpdateDialog";
import { KeyRound, Mail } from "lucide-react";

export function SecuritySettings() {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Security Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your email and password settings
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-4">
            <Mail className="h-6 w-6 text-muted-foreground" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Email Address</h4>
              <p className="text-sm text-muted-foreground">
                Update your email address
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setIsEmailDialogOpen(true)}
            >
              Update Email
            </Button>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-4">
            <KeyRound className="h-6 w-6 text-muted-foreground" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Password</h4>
              <p className="text-sm text-muted-foreground">
                Change your password
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setIsPasswordDialogOpen(true)}
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>

      <EmailUpdateDialog
        isOpen={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
      />
      
      <PasswordUpdateDialog
        isOpen={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      />
    </div>
  );
}