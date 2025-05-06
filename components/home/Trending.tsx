"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const trendingClasses = [
  {
    id: 1,
    name: "Hip Hop Beginners",
    studio: "Urban Dance Studio",
    location: "Surry Hills, Sydney",
    rating: 4.9,
    reviews: 167,
    price: "$25",
    duration: "60 mins",
    nextClass: "Today at 6:00 PM",
    image: "/dance-flow-example-002.jpg",
    tags: ["Trending", "Popular"]
  },
  {
    id: 2,
    name: "Contemporary Flow",
    studio: "Dance Hub",
    location: "Woollahra, Sydney",
    rating: 4.8,
    reviews: 243,
    price: "$30",
    duration: "75 mins",
    nextClass: "Tomorrow at 10:00 AM",
    image: "/dance-flow-example-001.jpg",
    tags: ["New", "Featured"]
  },
  {
    id: 3,
    name: "Ballet Foundations",
    studio: "Royal Dance Academy",
    location: "Paddington, Sydney",
    rating: 5.0,
    reviews: 189,
    price: "$35",
    duration: "90 mins",
    nextClass: "Today at 7:30 PM",
    image: "/dance-flow-example-004.jpg",
    tags: ["Bestseller"]
  },
  {
    id: 4,
    name: "Jazz Advanced",
    studio: "Step Up Studio",
    location: "Newtown, Sydney",
    rating: 4.9,
    reviews: 156,
    price: "$28",
    duration: "60 mins",
    nextClass: "Tomorrow at 5:00 PM",
    image: "/dance-flow-example-006.jpg",
    tags: ["Advanced"]
  },
];

export function Trending() {
  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-6">Trending Classes</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex space-x-6 pb-4">
          {trendingClasses.map((class_) => (
            <Card key={class_.id} className="w-[300px] flex-none py-0">
              <div className="aspect-[4/3] relative">
                <Image
                  src={class_.image}
                  alt={class_.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  {class_.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-white/80">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">{class_.name}</h3>
                    <p className="text-sm text-gray-500">{class_.studio}</p>
                    <p className="text-sm text-gray-500">{class_.location}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="ml-1 text-sm">
                        {class_.rating} ({class_.reviews})
                      </span>
                    </div>
                    <p className="font-semibold">{class_.price}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{class_.duration}</span>
                  </div>
                  <p className="text-sm font-medium">{class_.nextClass}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}