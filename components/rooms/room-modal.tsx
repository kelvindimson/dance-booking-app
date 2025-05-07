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
import { useRooms } from "@/hooks/use-rooms";
import { useStudios } from "@/hooks/use-studios";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Studio } from "@/global";

interface RoomModalProps {
  room?: any;
  isOpen: boolean;
  onClose: () => void;
}

const getInitialFormState = (room?: any) => {
  if (room) {
    return {
      studioId: room.studioId || "",
      name: room.name || "",
      description: room.description || "",
      capacity: room.capacity || 0,
      amenities: room.amenities || "",
    };
  }

  return {
    studioId: "",
    name: "",
    description: "",
    capacity: 0,
    amenities: "",
  };
};

export const RoomModal = ({ room, isOpen, onClose }: RoomModalProps) => {
  const { createRoom, updateRoom } = useRooms();
  const { studios } = useStudios();
  const [formData, setFormData] = useState(getInitialFormState(room));
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData(getInitialFormState());
      setIsLoading(false);
    }
  }, [isOpen]);

  // Update form when room data changes
  useEffect(() => {
    if (isOpen && room) {
      setFormData(getInitialFormState(room));
    }
  }, [room, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        capacity: Number(formData.capacity),
      };

      if (room) {
        await updateRoom.mutateAsync({
          id: room.id,
          ...submitData,
        });
      } else {
        await createRoom.mutateAsync(submitData);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {room ? "Edit Room" : "Create New Room"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Studio</Label>
            <Select
              value={formData.studioId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, studioId: value }))}
              disabled={isLoading}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select studio" />
              </SelectTrigger>
              <SelectContent>
                {studios?.map((studio: Studio) => (
                  <SelectItem key={studio.id} value={studio.id}>
                    {studio.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Capacity</Label>
            <Input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.valueAsNumber }))}
              disabled={isLoading}
              required
              min={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Amenities</Label>
            <Textarea
              value={formData.amenities}
              onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value }))}
              disabled={isLoading}
              placeholder="List amenities (e.g., mirrors, ballet bars, sound system)"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name || !formData.studioId}
            >
              {room ? "Save Changes" : "Create Room"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};