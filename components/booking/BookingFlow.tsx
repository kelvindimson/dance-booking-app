/* eslint-disable @typescript-eslint/no-explicit-any */
// components/booking/BookingFlow.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";

interface BookingFlowProps {
  classDetails: {
    id: string;
    name: string;
    price: number;
    image: string;
    studio: string;
    rating: number;
    reviews: number;
  };
  onClose?: () => void;
}

export function BookingFlow({ classDetails, onClose }: BookingFlowProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("full");

  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    spots: "1",
    paymentMethod: "full",
    country: "+61",
    phone: "",
  });

  const serviceFee = 2.00;
  const total = (classDetails.price * parseInt(bookingDetails.spots)) + serviceFee;

  const handleContinue = async () => {
    if (step === 1) {
      setStep(2);
    } else {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
      toast.success("Booking confirmed! We'll send you the details via email.");
      onClose?.();
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center">
          {step === 2 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(1)}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <CardTitle>Request to book</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Class Summary */}
        <div className="flex gap-4 pb-4">
          <Image
            src={classDetails.image}
            alt={classDetails.name}
            width={100}
            height={100}
            className="rounded-lg object-cover"
          />
          <div>
            <h3 className="font-semibold">{classDetails.name}</h3>
            <p className="text-sm text-gray-500">{classDetails.studio}</p>
            <div className="flex items-center text-sm mt-1">
              <span>★ {classDetails.rating}</span>
              <span className="mx-1">·</span>
              <span>{classDetails.reviews} reviews</span>
            </div>
          </div>
        </div>

        <Separator />

        {step === 1 ? (
          /* Step 1: Select Date and Spots */
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={bookingDetails.date}
                onChange={(e) => 
                  setBookingDetails({ ...bookingDetails, date: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Number of spots</Label>
              <Select
                value={bookingDetails.spots}
                onValueChange={(value: any) => 
                  setBookingDetails({ ...bookingDetails, spots: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select spots" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'person' : 'people'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          /* Step 2: Payment Details */
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Payment method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-3">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full">
                    Pay ${total.toFixed(2)} AUD now
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3">
                  <RadioGroupItem value="split" id="split" />
                  <Label htmlFor="split">
                    Pay in 4 payments of ${(total / 4).toFixed(2)} AUD
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Phone number</Label>
              <div className="flex gap-2">
                <Select
                  value={bookingDetails.country}
                  onValueChange={(value: any) => 
                    setBookingDetails({ ...bookingDetails, country: value })
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+61">AU +61</SelectItem>
                    <SelectItem value="+1">US +1</SelectItem>
                    <SelectItem value="+44">UK +44</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={bookingDetails.phone}
                  onChange={(e) => 
                    setBookingDetails({ ...bookingDetails, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Price Details */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>${classDetails.price} × {bookingDetails.spots} spot(s)</span>
            <span>${classDetails.price * parseInt(bookingDetails.spots)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>${serviceFee.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)} AUD</span>
          </div>
        </div>

        <Button 
          className="w-full" 
          size="lg"
          onClick={handleContinue}
          disabled={isLoading || !bookingDetails.date || !bookingDetails.spots}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirming booking...
            </>
          ) : (
            step === 1 ? "Continue" : "Confirm and pay"
          )}
        </Button>

        <p className="text-center text-sm text-gray-500">
          You won&apos;t be charged yet
        </p>
      </CardContent>
    </Card>
  );
}