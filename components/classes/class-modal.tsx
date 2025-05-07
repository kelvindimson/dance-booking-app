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
import { useClasses } from "@/hooks/use-classes";
import { useStudios } from "@/hooks/use-studios";
import { useRooms } from "@/hooks/use-rooms";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { classStatusEnum } from "@/db/schema";
import { classStatusEnum, Room, Studio } from "@/global";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from 'uuid';

interface ClassModalProps {
  classData?: any;
  isOpen: boolean;
  onClose: () => void;
}

const getInitialFormState = (classData?: any) => {
    if (classData) {
        const getFormattedDateTime = (dateTime: any, addHours = 0) => {
          try {
            if (dateTime) {
              return DateTime.fromISO(dateTime.toString())
                .toISO({ includeOffset: false })
                ?.slice(0, 16) || 
                DateTime.now()
                  .startOf('hour')
                  .plus({ hours: addHours })
                  .toISO({ includeOffset: false })
                  .slice(0, 16);
            }
          } catch (error) {
            console.error('Error parsing datetime:', error);
          }
          return DateTime.now()
            .startOf('hour')
            .plus({ hours: addHours })
            .toISO({ includeOffset: false })
            .slice(0, 16);
        };
      
        return {
          studioId: classData.studioId || "",
          roomId: classData.roomId || "",
          name: classData.name || "",
          description: classData.description || "",
          type: classData.type || "",
          level: classData.level || "",
          capacity: classData.capacity || 0,
          price: classData.price || 0,
          duration: classData.duration || 60,
          startTime: getFormattedDateTime(classData.startTime),
          endTime: getFormattedDateTime(classData.endTime, 1),
          recurring: classData.recurring || false,
          recurrencePattern: classData.recurrencePattern || "",
          status: classData.status || "scheduled" as classStatusEnum,
        };
      }

  return {
    studioId: "",
    roomId: "",
    name: "",
    description: "",
    type: "",
    level: "",
    capacity: 0,
    price: 0,
    duration: 60,
    startTime: DateTime.now().startOf('hour').toISO({ includeOffset: false }).slice(0, 16),
    endTime: DateTime.now().startOf('hour').plus({ hours: 1 }).toISO({ includeOffset: false }).slice(0, 16),
    recurring: false,
    recurrencePattern: "",
    status: "scheduled" as classStatusEnum,
  };
};

export const ClassModal = ({ classData, isOpen, onClose }: ClassModalProps) => {
  const { createClass, updateClass } = useClasses();
  const { studios } = useStudios();
  const [formData, setFormData] = useState(getInitialFormState(classData));
  const [isLoading, setIsLoading] = useState(false);

  // Get rooms for selected studio
  const { rooms } = useRooms(formData.studioId);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData(getInitialFormState());
      setIsLoading(false);
    }
  }, [isOpen]);

  // Update form when classData changes
  useEffect(() => {
    if (isOpen && classData) {
      setFormData(getInitialFormState(classData));
    }
  }, [classData, isOpen]);

  // Reset roomId when studio changes
  useEffect(() => {
    if (formData.roomId && !rooms?.some((room: Room) => room.id === formData.roomId)) {
      setFormData(prev => ({ ...prev, roomId: "" }));
    }
  }, [formData.studioId, rooms, formData.roomId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        capacity: Number(formData.capacity),
        price: Number(formData.price),
        duration: Number(formData.duration),
        startTime: DateTime.fromISO(formData.startTime).toJSDate(),
        endTime: DateTime.fromISO(formData.endTime).toJSDate(),
        // For now, we'll use a dummy instructor ID
        primaryInstructorId: uuidv4(),
      };

      if (classData) {
        await updateClass.mutateAsync({
          id: classData.id,
          ...submitData,
        });
      } else {
        await createClass.mutateAsync(submitData);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save class:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRoom = rooms?.find((room: Room) => room.id === formData.roomId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {classData ? "Edit Class" : "Create New Class"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label>Room</Label>
              <Select
                value={formData.roomId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, roomId: value }))}
                disabled={isLoading || !formData.studioId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.studioId ? "Select room" : "Select studio first"} />
                </SelectTrigger>
                <SelectContent>
                  {rooms?.map((room: Room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name} (Capacity: {room.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Input
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Level</Label>
              <Input
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Capacity</Label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.valueAsNumber }))}
                disabled={isLoading}
                required
                min={1}
                max={selectedRoom?.capacity}
              />
              {selectedRoom && (
                <p className="text-sm text-muted-foreground">
                  Room capacity: {selectedRoom.capacity}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.valueAsNumber }))}
                disabled={isLoading}
                required
                min={0}
                step={0.01}
              />
            </div>

            <div className="space-y-2">
              <Label>Duration (mins)</Label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.valueAsNumber }))}
                disabled={isLoading}
                required
                min={1}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as classStatusEnum }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="postponed">Postponed</SelectItem>
              </SelectContent>
            </Select>
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
              disabled={isLoading || !formData.name || !formData.studioId || !formData.roomId}
            >
              {classData ? "Save Changes" : "Create Class"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};