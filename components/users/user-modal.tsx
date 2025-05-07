/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "@/hooks/use-users";
import { useRoles } from "@/hooks/use-roles";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Role } from "@/global";

interface UserModalProps {
  user?: any;
  isOpen: boolean;
  onClose: () => void;
}

const initialFormState = {
  name: "",
  email: "",
  password: "",
  status: "pending",
  roleIds: [] as string[]
};

export const UserModal = ({ user, isOpen, onClose }: UserModalProps) => {
  const { createUser, updateUser } = useUsers();
  const { roles } = useRoles();
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set form data when editing a user
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        status: user.status || "pending",
        roleIds: user.roles || []
      });
    } else {
      // Reset form when creating a new user
      setFormData(initialFormState);
    }
  }, [user, isOpen]); // Added isOpen to dependency array to reset when modal opens/closes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (user) {
        await updateUser.mutateAsync({
          id: user.id,
          ...formData,
          password: formData.password || undefined
        });
      } else {
        await createUser.mutateAsync(formData);
        setFormData(initialFormState); // Reset form after successful creation
      }
      onClose();
    } catch (error) {
      console.error("Failed to save user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormState); // Reset form when modal is closed
    onClose();
  };

  const handleRoleAdd = (roleId: string) => {
    const role = roles?.find((r: { id: string; }) => r.id === roleId);
    if (role && !formData.roleIds.includes(role.id)) {
      setFormData(prev => ({
        ...prev,
        roleIds: [...prev.roleIds, role.id]
      }));
    }
  };

  const handleRoleRemove = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      roleIds: prev.roleIds.filter(id => id !== roleId)
    }));
  };

  const isCreateMode = !user;
  const selectedRoles = roles?.filter((role: Role) => formData.roleIds.includes(role.id)) || [];
  const availableRoles = roles?.filter((role: Role) => !formData.roleIds.includes(role.id)) || [];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isCreateMode ? "Create New User" : "Edit User"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{isCreateMode ? "Password" : "New Password (optional)"}</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              disabled={isLoading}
              required={isCreateMode}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Roles</Label>
            <Select
              disabled={isLoading || !availableRoles.length}
              onValueChange={handleRoleAdd}
              value=""
            >
              <SelectTrigger>
                <SelectValue placeholder="Add role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role: Role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedRoles.map((role: Role) => (
                <Badge
                  key={role.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {role.name}
                  <button
                    type="button"
                    onClick={() => handleRoleRemove(role.id)}
                    className="hover:bg-secondary-foreground/10 rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.email || (isCreateMode && !formData.password)}
            >
              {isCreateMode ? "Create User" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};