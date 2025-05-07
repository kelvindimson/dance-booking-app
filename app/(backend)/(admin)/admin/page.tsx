"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  ShieldCheck,
  Home,
  DoorOpen,
  Calendar,
  ExternalLink,
  Loader2
} from "lucide-react";

const AdminDashboard = () => {
  const { data: counts, isLoading } = useQuery({
    queryKey: ["dashboard-counts"],
    queryFn: async () => {
      const [users, roles, studios, rooms, classes] = await Promise.all([
        axios.get("/api/users").then(res => res.data.data?.length || 0),
        axios.get("/api/roles").then(res => res.data.data?.length || 0),
        axios.get("/api/studios").then(res => res.data.data?.length || 0),
        axios.get("/api/rooms").then(res => res.data.data?.length || 0),
        axios.get("/api/classes").then(res => res.data.data?.length || 0),
      ]);
      return { users, roles, studios, rooms, classes };
    },
  });

  const dashboardItems = [
    {
      title: "Users",
      description: "Manage user accounts and permissions",
      icon: Users,
      count: counts?.users || 0,
      href: "/admin/users",
      color: "text-blue-600",
    },
    {
      title: "Roles",
      description: "Configure user roles and access levels",
      icon: ShieldCheck,
      count: counts?.roles || 0,
      href: "/admin/roles",
      color: "text-purple-600",
    },
    {
      title: "Studios",
      description: "Manage dance studios and locations",
      icon: Home,
      count: counts?.studios || 0,
      href: "/admin/studios",
      color: "text-green-600",
    },
    {
      title: "Rooms",
      description: "Configure studio rooms and capacities",
      icon: DoorOpen,
      count: counts?.rooms || 0,
      href: "/admin/rooms",
      color: "text-orange-600",
    },
    {
      title: "Classes",
      description: "Manage dance classes and schedules",
      icon: Calendar,
      count: counts?.classes || 0,
      href: "/admin/classes",
      color: "text-red-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your application settings and data
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            View Client Site
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item) => (
            <Link key={item.title} href={item.href}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      {item.title}
                    </CardTitle>
                    <span className="text-2xl font-bold">{item.count}</span>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Click to manage {item.title.toLowerCase()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;