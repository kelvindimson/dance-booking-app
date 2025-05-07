"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RoleForm } from "@/components/roles/role-form";

export default function RoleDetailPage() {
  const params = useParams();
  const roleId = params.id as string;

  const { data: roleData, isLoading } = useQuery({
    queryKey: ["role", roleId],
    queryFn: async () => {
      const response = await axios.get(`/api/roles?id=${roleId}`);
      return response.data.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Role</h1>
      <RoleForm
        roleId={roleId}
        initialData={{
          name: roleData.name,
          description: roleData.description,
        }}
      />
    </div>
  );
}