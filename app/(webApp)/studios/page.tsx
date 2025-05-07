"use client";

import { Card } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { studios } from "./studios";

export default function StudiosPage() {
  return (
    <div className="min-h-screen mt-36">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">Dance Studios</h1>
        <p className="text-muted-foreground text-lg">
          Find the perfect studio for your dance journey
        </p>
      </div>

      {/* Studios Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map((studio) => (
            <Link key={studio.id} href={`/studios/${studio.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow py-0">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={studio.images[0]}
                    alt={studio.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{studio.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                      <span>
                        {studio.rating} · {studio.reviews} reviews
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {studio.location}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {studio.classTypes.map((type) => (
                      <span
                        key={type}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {studio.description}
                  </p>
                  <div className="mt-4 text-sm font-medium">
                    Classes from {studio.priceRange}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}