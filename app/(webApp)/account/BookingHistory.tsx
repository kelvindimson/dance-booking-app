"use client";

// import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";

interface BookingHistoryProps {
  userId: string;
}

// This would come from your API
type Booking = {
  id: string;
  className: string;
  studioName: string;
  date: string;
  time: string;
  status: "confirmed" | "completed" | "cancelled";
};

export function BookingHistory({ 
    // userId TODO: Pass the user prop

}: BookingHistoryProps) {
  // Placeholder data - replace with actual API call
  const bookings: Booking[] = [
    {
      id: "1",
      className: "Hip Hop Dance",
      studioName: "Dance Studio A",
      date: "2024-05-15",
      time: "14:00",
      status: "confirmed",
    },
    {
      id: "2",
      className: "Ballet",
      studioName: "Classical Dance Center",
      date: "2024-05-10",
      time: "16:30",
      status: "completed",
    },
    // Add more bookings as needed
  ];

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-500";
      case "completed":
        return "bg-blue-500/10 text-blue-500";
      case "cancelled":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Booking History</h2>
        <p className="text-muted-foreground">
          View and manage your class bookings.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No bookings yet</h3>
          <p className="text-muted-foreground">
            When you book a class, it will appear here.
          </p>
          <Button className="mt-4">Browse Classes</Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Studio</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.className}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {booking.studioName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {booking.date}
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {booking.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={getStatusColor(booking.status)}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-[100px]"
                    >
                      {booking.status === "confirmed" ? "Cancel" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}