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
  import { useClasses } from "@/hooks/use-classes";
  import { useState } from "react";
  import { DeleteAlert } from "../shared/delete-alert";
  import { ClassModal } from "./class-modal";
  import { Badge } from "@/components/ui/badge";
  import { DateTime } from "luxon";
  import { type Class, type classStatusEnum } from "@/global"
  
  export const ClassesTable = () => {
    const { classes, isLoading, deleteClass } = useClasses();
    const [classToDelete, setClassToDelete] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    const handleDelete = async () => {
      if (classToDelete) {
        await deleteClass.mutateAsync(classToDelete);
        setClassToDelete(null);
      }
    };
  
    const getStatusColor = (status: classStatusEnum) => {
      switch (status) {
        case 'scheduled':
          return 'default';
        case 'active':
          return 'secondary';
        case 'completed':
          return 'secondary';
        case 'cancelled':
          return 'destructive';
        case 'postponed':
          return 'outline';
        default:
          return 'secondary';
      }
    };
  
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Classes</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Class
          </Button>
        </div>
  
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Studio</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes?.map((classItem: Class) => (
              <TableRow key={classItem.id}>
                <TableCell className="font-medium">{classItem.name}</TableCell>
                <TableCell>{classItem.name}</TableCell>
                <TableCell>{classItem.type}</TableCell>
                <TableCell>{classItem.level || '-'}</TableCell>
                <TableCell>{classItem.capacity}</TableCell>
                <TableCell>£{Number(classItem.price).toFixed(2)}</TableCell>
                <TableCell>
                  {DateTime.fromISO(classItem.startTime.toString()).toLocaleString(DateTime.DATETIME_MED)}
                </TableCell>
                <TableCell>{classItem.duration} mins</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(classItem.status)} >
                    {classItem.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedClass(classItem)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => setClassToDelete(classItem.id)}
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
  
        <ClassModal 
          classData={selectedClass}
          isOpen={!!selectedClass}
          onClose={() => setSelectedClass(null)}
        />
  
        <ClassModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
  
        <DeleteAlert 
          isOpen={!!classToDelete}
          onClose={() => setClassToDelete(null)}
          onConfirm={handleDelete}
        />
      </div>
    );
  };