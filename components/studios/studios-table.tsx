/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button";
  import { MoreHorizontal, Plus, Pencil, Trash } from "lucide-react";
  import { useStudios } from "@/hooks/use-studios";
  import { useState } from "react";
  import { DeleteAlert } from "../shared/delete-alert";
  import { StudioModal } from "./studio-modal";
import { Studio } from "@/global";
  
  export const StudiosTable = () => {
    const { studios, isLoading, deleteStudio } = useStudios();
    const [studioToDelete, setStudioToDelete] = useState<string | null>(null);
    const [selectedStudio, setSelectedStudio] = useState<any | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    const handleDelete = async () => {
      if (studioToDelete) {
        await deleteStudio.mutateAsync(studioToDelete);
        setStudioToDelete(null);
      }
    };
  
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Studios</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Studio
          </Button>
        </div>
  
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studios?.map((studio: Studio) => (
              <TableRow key={studio.id}>
                <TableCell className="font-medium">{studio.name}</TableCell>
                <TableCell>{studio.city}</TableCell>
                <TableCell>{studio.state}</TableCell>
                <TableCell>{studio.email || '-'}</TableCell>
                <TableCell>{studio.phone || '-'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedStudio(studio)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => setStudioToDelete(studio.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
  
        <StudioModal 
          studio={selectedStudio}
          isOpen={!!selectedStudio}
          onClose={() => setSelectedStudio(null)}
        />
  
        <StudioModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
  
        <DeleteAlert 
          isOpen={!!studioToDelete}
          onClose={() => setStudioToDelete(null)}
          onConfirm={handleDelete}
        />
      </div>
    );
  };