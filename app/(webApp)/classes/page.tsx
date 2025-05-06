"use client";

// import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, Star, Clock, MapPin, Users } from "lucide-react";
import { danceClasses } from "./danceClasses";

export default function ClassesPage() {
  return (
    <div className="min-h-screen mt-36">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search classes..." 
                  className="pl-10 w-full"
                />
              </div>
            </div>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dance Classes</h1>
          <p className="text-gray-600">{danceClasses.length} classes available</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {danceClasses.map((class_) => (
            <Link href={`/classes/${class_.id}`} key={class_.id}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow py-0">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={class_.image}
                    alt={class_.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{class_.name}</h3>
                      <p className="text-sm text-gray-500">{class_.studio}</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="ml-1 text-sm">
                        {class_.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {class_.location}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {class_.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {class_.capacity}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <p className="font-semibold">${class_.price}</p>
                    <p className="text-sm text-gray-600">{class_.nextClass}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}