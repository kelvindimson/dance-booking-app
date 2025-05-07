"use client";
import { RolesTable } from "@/components/roles/roles-table";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function RolesPage() {
  const { data: session, status } = useSession();

  // Check if session is loading
  if (status === "loading") {
    return <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      Loading...
      </div>;
  }

  if (!session) {
    return <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      You are not authorized to view this page.</div>;
  }

  if (session && !session?.user?.roles?.includes("Administrator")) {
    return <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      You are not authorized to view this page.
      <Button className="ml-4" onClick={() => window.location.href = "/"}>Go to Home</Button>
      </div>;
  }

  return (
    <div className="p-6">
      <RolesTable />
    </div>
  );
}