// app/admin/roles/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Pencil, Trash2, UserPlus, UserMinus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Role {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  users?: Array<{ userId: string; roleId: string }>;
}

interface User {
  id: string;
  name: string | null;
  email: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [selectedUser, setSelectedUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/roles");
      if (!response.ok) throw new Error("Failed to fetch roles");
      const data = await response.json();
      if (data.success) {
        setRoles(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to fetch roles");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
        console.error("Error fetching roles:", error);
      toast.error("Failed to fetch users");
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        setIsCreateOpen(false);
        setFormData({ name: "", description: "" });
        fetchRoles();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
        console.error("Error fetching roles:", error);
      toast.error("Failed to create role");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/roles?id=${selectedRole.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedRole.id,
          title: formData.name, // API expects 'title' even though we store as 'name'
          description: formData.description,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        setIsEditOpen(false);
        setFormData({ name: "", description: "" });
        fetchRoles();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
        console.error("Error fetching roles:", error);
      toast.error("Failed to update role");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/roles?id=${roleId}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchRoles();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
        console.error("Error fetching roles:", error);
      toast.error("Failed to delete role");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !selectedUser) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/roles/${selectedRole.id}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        setIsAssignOpen(false);
        setSelectedUser("");
        fetchRoles();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
        console.error("Error fetching roles:", error);
      toast.error("Failed to assign user to role");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (roleId: string, userId: string) => {
    if (!confirm("Are you sure you want to remove this user from the role?")) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/roles/${roleId}/users`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchRoles();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
        console.error("Error fetching roles:", error);
      toast.error("Failed to remove user from role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Role Management</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button disabled={isLoading}>Create New Role</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Role"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{role.name}</CardTitle>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedRole(role);
                      setFormData({
                        name: role.name,
                        description: role.description || "",
                      });
                      setIsEditOpen(true);
                    }}
                    disabled={isLoading}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedRole(role);
                      setIsAssignOpen(true);
                    }}
                    disabled={isLoading}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                  {!role.isSystem && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteRole(role.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-4">
                <h3 className="font-medium mb-2">Users with this role:</h3>
                <div className="space-y-2">
                  {role.users && role.users.map((userRole) => {
                    const user = users.find(u => u.id === userRole.userId);
                    return user ? (
                      <div
                        key={userRole.userId}
                        className="flex justify-between items-center bg-gray-50 p-2 rounded"
                      >
                        <span>{user.name || user.email}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveUser(role.id, user.id)}
                          disabled={isLoading}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateRole} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Role"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign User Dialog */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign User to Role</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssignUser} className="space-y-4">
            <div>
              <Label htmlFor="user">Select User</Label>
              <select
                id="user"
                className="w-full border rounded p-2"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                required
              >
                <option value="">Select a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Assigning..." : "Assign User"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}