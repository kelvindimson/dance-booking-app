"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bell, Shield } from "lucide-react";

interface AccountSettingsProps {
  user: {
    id: string;
    email?: string | null;
  };
}

export function AccountSettings({ 
    // user TODO: pass the user prop

}: AccountSettingsProps) {
  const handleSettingChange = (setting: string, value: boolean) => {
    // Add your settings update logic here
    toast.success(`${setting} ${value ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account preferences and notifications.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch
                id="email-notifications"
                onCheckedChange={(checked) => 
                  handleSettingChange('Email notifications', checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing-emails">Marketing Emails</Label>
              <Switch
                id="marketing-emails"
                onCheckedChange={(checked) => 
                  handleSettingChange('Marketing emails', checked)
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy
          </h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-public">Public Profile</Label>
              <Switch
                id="profile-public"
                onCheckedChange={(checked) => 
                  handleSettingChange('Public profile', checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-activity">Show Activity Status</Label>
              <Switch
                id="show-activity"
                onCheckedChange={(checked) => 
                  handleSettingChange('Activity status', checked)
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Permanently delete your account and all of your content.
          </p>
          <Button 
            variant="destructive" 
            className="mt-4"
            onClick={() => toast.error("Account deletion is not implemented yet")}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}