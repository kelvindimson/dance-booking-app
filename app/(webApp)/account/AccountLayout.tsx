import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { UserProfile } from "./UserProfile";
import { AccountSettings } from "./AccountSettings";
import { BookingHistory } from "./BookingHistory";
import { 
  User, 
  Settings, 
  CalendarDays, 
} from "lucide-react";

interface AccountLayoutProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AccountLayout({ user }: AccountLayoutProps) {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Bookings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <UserProfile user={user} />
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <AccountSettings user={user} />
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card className="p-6">
            <BookingHistory userId={user.id} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}