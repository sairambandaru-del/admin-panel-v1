"use client";

import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  Palmtree, 
  Car, 
  Eraser, 
  Waves, 
  UtensilsCrossed, 
  Pizza, 
  Stethoscope, 
  Bus, 
  Laptop, 
  HeartPulse, 
  ShoppingBasket, 
  ChefHat, 
  ConciergeBell 
} from 'lucide-react';

const categories = [
  { title: "Short term rentals", icon: Home, color: "bg-blue-500" },
  { title: "Leisure activities", icon: Palmtree, color: "bg-green-500" },
  { title: "Car rentals", icon: Car, color: "bg-orange-500" },
  { title: "House keeping", icon: Eraser, color: "bg-purple-500" },
  { title: "Laundry", icon: Waves, color: "bg-cyan-500" },
  { title: "Food delivery", icon: Pizza, color: "bg-red-500" },
  { title: "Dining", icon: UtensilsCrossed, color: "bg-rose-500" },
  { title: "Doctor on call", icon: Stethoscope, color: "bg-emerald-500" },
  { title: "Transportation", icon: Bus, color: "bg-indigo-500" },
  { title: "Co-working spaces", icon: Laptop, color: "bg-slate-500" },
  { title: "Wellness", icon: HeartPulse, color: "bg-pink-500" },
  { title: "Grocery", icon: ShoppingBasket, color: "bg-amber-500" },
  { title: "Chef on call", icon: ChefHat, color: "bg-orange-600" },
  { title: "In house catering", icon: ConciergeBell, color: "bg-violet-500" },
];

const VendorServices = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vendor Services</h2>
          <p className="text-muted-foreground">
            Select a service category to manage vendors and offerings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card key={category.title} className="group hover:shadow-md transition-all cursor-pointer border-muted/60">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                  <category.icon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">Manage providers</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default VendorServices;