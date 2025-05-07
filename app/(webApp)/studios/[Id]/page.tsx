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
  Mail,
  Globe,
  Phone,
  Music,
  Users,
//   Clock
} from "lucide-react";

const studioDetails = {
  id: "dance-hub-studio",
  name: "Dance Hub Studio",
  location: "Surry Hills, Sydney",
  contact: {
    address: "123 Crown Street, Surry Hills, NSW 2010",
    phone: "(02) 9876 5432",
    email: "info@dancehub.com",
    website: "www.dancehub.com"
  },
  rating: 4.98,
  reviews: 232,
  description: "A premier dance studio in the heart of Sydney, offering a wide range of classes from hip-hop to contemporary dance. Our spacious studios and experienced instructors create the perfect environment for dancers of all levels.",
  features: [
    "Multiple Dance Rooms",
    "Professional Sound System",
    "Sprung Floors",
    "Changing Rooms",
    "Air Conditioning",
    "Waiting Area"
  ],
  amenities: [
    "Free Wifi",
    "Water Fountain",
    "Shower Facilities",
    "Lockers",
    "Dance Shop",
    "Parking Available"
  ],
  images: [
    "/dance-flow-example-001.jpg",
    "/dance-flow-example-002.jpg",
    "/dance-flow-example-003.jpg",
  ],
  classTypes: ["Hip Hop", "Contemporary", "Ballet", "Jazz"],
  openingHours: {
    monday: "6:00 AM - 10:00 PM",
    tuesday: "6:00 AM - 10:00 PM",
    wednesday: "6:00 AM - 10:00 PM",
    thursday: "6:00 AM - 10:00 PM",
    friday: "6:00 AM - 9:00 PM",
    saturday: "8:00 AM - 6:00 PM",
    sunday: "8:00 AM - 4:00 PM"
  },
  stats: {
    classes: "20+ Weekly Classes",
    instructors: "12 Expert Instructors",
    established: "Est. 2015"
  }
};

export default function StudioDetailsPage() {
  return (
    <div className="min-h-screen mt-36">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">{studioDetails.name}</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span className="ml-1">
                {studioDetails.rating} · {studioDetails.reviews} reviews
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {studioDetails.location}
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
              src={studioDetails.images[0]}
              alt={studioDetails.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {studioDetails.images.slice(1).map((image, i) => (
              <div key={i} className="relative">
                <Image
                  src={image}
                  alt={`${studioDetails.name} ${i + 2}`}
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
          {/* Studio Stats */}
          <div>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(studioDetails.stats).map(([key, value]) => (
                <Card key={key} className="p-4">
                  <h3 className="font-semibold capitalize">{key}</h3>
                  <p className="text-muted-foreground">{value}</p>
                </Card>
              ))}
            </div>
            <Separator className="my-6" />
          </div>

          {/* Class Types */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Dance Styles Offered</h2>
            <div className="flex flex-wrap gap-2">
              {studioDetails.classTypes.map((type) => (
                <span
                  key={type}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-4">About this studio</h2>
            <p className="text-muted-foreground">{studioDetails.description}</p>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Studio Features</h2>
            <div className="grid grid-cols-2 gap-4">
              {studioDetails.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-xl font-semibold mb-4">What&apos;s available</h2>
            <div className="grid grid-cols-2 gap-4">
              {studioDetails.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Info Card */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-8">
            {/* Contact Information */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-lg">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-muted-foreground">{studioDetails.contact.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-muted-foreground">{studioDetails.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-muted-foreground">{studioDetails.contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-muted-foreground">{studioDetails.contact.website}</span>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Opening Hours */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Opening Hours</h3>
              <div className="space-y-2">
                {Object.entries(studioDetails.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize">{day}</span>
                    <span className="text-muted-foreground">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Call to Action */}
            <Button className="w-full" size="lg">
              <Users className="h-4 w-4 mr-2" />
              View Available Classes
            </Button>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Or call us to schedule a visit
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}