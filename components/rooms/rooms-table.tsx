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
  import { useRooms } from "@/hooks/use-rooms";
  import { useState } from "react";
  import { DeleteAlert } from "../shared/delete-alert";
  import { RoomModal } from "./room-modal";
import { Room } from "@/global";
  
  export const RoomsTable = () => {
    const { rooms, isLoading, deleteRoom } = useRooms();
    const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    const handleDelete = async () => {
      if (roomToDelete) {
        await deleteRoom.mutateAsync(roomToDelete);
        setRoomToDelete(null);
      }
    };
  
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Rooms</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Room
          </Button>
        </div>
  
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Studio</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amenities</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms?.map((room: Room) => (
              <TableRow key={room.id}>
                <TableCell className="font-medium">{room.name}</TableCell>
                <TableCell>{room.studioName}</TableCell>
                <TableCell>{room.capacity}</TableCell>
                <TableCell>{room.description || '-'}</TableCell>
                <TableCell>{room.amenities || '-'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedRoom(room)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => setRoomToDelete(room.id)}
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
  
        <RoomModal 
          room={selectedRoom}
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
  
        <RoomModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
  
        <DeleteAlert 
          isOpen={!!roomToDelete}
          onClose={() => setRoomToDelete(null)}
          onConfirm={handleDelete}
        />
      </div>
    );
  };