// app/page.tsx
"use client";

// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Clock } from "lucide-react";
import { CategoryFilter } from "@/components/home/CategoryFilter";
import { RecommendedStudios } from "@/components/home/RecommendedStudios";
import { NewStudios } from "@/components/home/NewStudios";
import { Trending } from "@/components/home/Trending";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen mt-36">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="absolute inset-0 bg-black/5" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Book local dance classes 
              <br />
              and studios
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find and book amazing dance experiences near you
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-2 rounded-xl shadow-lg flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 rounded-lg">
                <Search className="h-5 w-5 text-gray-400" />
                <Input 
                  type="text"
                  placeholder="All classes and venues"
                  className="border-0 focus-visible:ring-0"
                />
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-400" />
                <Input 
                  type="text"
                  placeholder="Current location"
                  className="border-0 focus-visible:ring-0"
                />
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-400" />
                <Input 
                  type="text"
                  placeholder="Any date"
                  className="border-0 focus-visible:ring-0"
                />
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 rounded-lg">
                <Clock className="h-5 w-5 text-gray-400" />
                <Input 
                  type="text"
                  placeholder="Any time"
                  className="border-0 focus-visible:ring-0"
                />
              </div>
              <Button size="lg" className="md:w-auto w-full">
                Search
              </Button>
            </div>
          </div>

          {/* Booking Counter */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-black">182,213</span> classes booked today
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <CategoryFilter />
        <RecommendedStudios />
        <NewStudios />
        <Trending />
      </main>
    </div>
  );
}