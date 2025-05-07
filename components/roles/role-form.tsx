import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRoles } from "@/hooks/use-roles";

interface RoleFormProps {
  roleId?: string;
  initialData?: {
    name: string;
    description?: string;
  };
}

export const RoleForm = ({ roleId, initialData }: RoleFormProps) => {
  const router = useRouter();
  const { createRole, updateRole } = useRoles();
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (roleId) {
        await updateRole.mutateAsync({ id: roleId, name, description });
      } else {
        await createRole.mutateAsync({ name, description });
      }
      router.push("/admin/roles");
    } catch (error) {
      console.error("Failed to save role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Role name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div>
        <Textarea
          placeholder="Role description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading}
        >
          {roleId ? "Update Role" : "Create Role"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/roles")}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};