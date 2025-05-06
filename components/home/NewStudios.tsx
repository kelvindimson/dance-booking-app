"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const newStudios = [
  {
    id: 1,
    name: "Urban Dance Studio",
    location: "Sydney, Sydney",
    rating: 5.0,
    reviews: 6,
    type: "Dance Studio",
    image: "/dance-flow-example-001.jpg"
  },
  {
    id: 2,
    name: "Flow Academy",
    location: "Haymarket, Sydney",
    rating: 5.0,
    reviews: 97,
    type: "Dance Studio",
    image: "/dance-flow-example-002.jpg"
  },
  {
    id: 3,
    name: "Dance Workshop",
    location: "Stanmore, Sydney",
    rating: 5.0,
    reviews: 43,
    type: "Dance Studio",
    image: "/dance-flow-example-001.jpg"
  },
  {
    id: 4,
    name: "Groove Center",
    location: "Mosman, Sydney",
    rating: 5.0,
    reviews: 269,
    type: "Dance Studio",
    image: "/dance-flow-example-003.jpg"
  },
];

export function NewStudios() {
  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-6">New to Dance Flow</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {newStudios.map((studio) => (
          <Card key={studio.id} className="overflow-hidden">
            <div className="aspect-[4/3] relative">
              <Image
                src={studio.image}
                alt={studio.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{studio.name}</h3>
                  <p className="text-sm text-gray-500">{studio.location}</p>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span className="ml-1 text-sm">
                    {studio.rating} ({studio.reviews})
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{studio.type}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}