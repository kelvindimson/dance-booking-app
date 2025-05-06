
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Share2,
  Heart,
  Star,
  MapPin,
  Clock,
  Users,
  Calendar,
  Medal,
  Music
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { useState } from "react";

const classDetails = {
  id: "hip-hop-101",
  name: "Hip Hop Fundamentals",
  studio: "Dance Hub Studio",
  location: "Surry Hills, Sydney",
  instructor: {
    name: "Alex Johnson",
    image: "/instructor-avatar.jpg",
    experience: "10+ years teaching",
    rating: 4.98,
    reviews: 132,
  },
  price: 25.00,
  rating: 4.98,
  reviews: 132,
  capacity: "12 spots left",
  duration: "60 mins",
  level: "Beginner",
  nextClass: "Today at 6:00 PM",
  description: "Perfect for beginners wanting to learn hip hop fundamentals. This class focuses on basic moves, rhythm training, and simple choreography combinations.",
  amenities: [
    "Sprung dance floor",
    "Mirrors",
    "Sound system",
    "Changing rooms",
    "Water fountain",
    "Air conditioning"
  ],
  images: [
    "/dance-flow-example-001.jpg",
    "/dance-flow-example-002.jpg",
    "/dance-flow-example-003.jpg",
  ]
};

export default function ClassDetailsPage() {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
  return (
    <>

    <div className="min-h-screen mt-36">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">{classDetails.name}</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span className="ml-1">
                {classDetails.rating} · {classDetails.reviews} reviews
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {classDetails.location}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl overflow-hidden">
          <div className="relative aspect-[16/9]">
            <Image
              src={classDetails.images[0]}
              alt={classDetails.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {classDetails.images.slice(1).map((image, i) => (
              <div key={i} className="relative">
                <Image
                  src={image}
                  alt={`${classDetails.name} ${i + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Instructor Section */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  Class by {classDetails.instructor.name}
                </h2>
                <div className="flex gap-4 text-gray-600">
                  <span>{classDetails.instructor.experience}</span>
                  <span>{classDetails.capacity}</span>
                </div>
              </div>
              <Image
                src={classDetails.instructor.image}
                alt={classDetails.instructor.name}
                width={60}
                height={60}
                className="rounded-full"
              />
            </div>
            <Separator className="my-6" />
          </div>

          {/* Class Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <Clock className="h-6 w-6 mb-2" />
              <h3 className="font-semibold">Duration</h3>
              <p className="text-gray-600">{classDetails.duration}</p>
            </Card>
            <Card className="p-4">
              <Medal className="h-6 w-6 mb-2" />
              <h3 className="font-semibold">Level</h3>
              <p className="text-gray-600">{classDetails.level}</p>
            </Card>
            <Card className="p-4">
              <Music className="h-6 w-6 mb-2" />
              <h3 className="font-semibold">Style</h3>
              <p className="text-gray-600">Hip Hop</p>
            </Card>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-4">About this class</h2>
            <p className="text-gray-600">{classDetails.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-xl font-semibold mb-4">What&apos;s available</h2>
            <div className="grid grid-cols-2 gap-4">
              {classDetails.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-2xl font-bold">${classDetails.price}</p>
                <p className="text-gray-600">per person</p>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <span className="ml-1">
                  {classDetails.rating} · {classDetails.reviews} reviews
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Select date
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    Select time
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Spots</label>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  1 person
                </Button>
              </div>
            </div>

            <Button 
        className="w-full" 
        size="lg"
        onClick={() => setIsBookingOpen(true)}
      >
        Reserve class
      </Button>

            <div className="mt-4 text-center text-sm text-gray-600">
              You won&apos;t be charged yet
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <span>${classDetails.price} × 1 person</span>
                <span>${classDetails.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>$2.00</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${classDetails.price + 2.00}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>

    <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <BookingFlow 
            classDetails={{
              id: classDetails.id,
              name: classDetails.name,
              price: classDetails.price,
              image: classDetails.images[0],
              studio: classDetails.studio,
              rating: classDetails.rating,
              reviews: classDetails.reviews,
            }}
            onClose={() => setIsBookingOpen(false)}
          />
        </DialogContent>
      </Dialog>

    </>
  );
}