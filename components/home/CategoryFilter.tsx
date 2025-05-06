"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Music, 
//   Ballet, 
  Users, 
  Heart, 
  Sparkles,
  Star,
  Scissors
} from "lucide-react";

const categories = [
  { name: "All Studios", icon: Star },
  { name: "Hip Hop", icon: Music },
  { name: "Ballet", icon: Music },
  { name: "Contemporary", icon: Users },
  { name: "Jazz", icon: Heart },
  { name: "Ballroom", icon: Sparkles },
  { name: "Tap Dance", icon: Scissors },
  // Add more categories as needed
];

export function CategoryFilter() {
  return (
    <div className="my-6">
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-4 p-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.name}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}