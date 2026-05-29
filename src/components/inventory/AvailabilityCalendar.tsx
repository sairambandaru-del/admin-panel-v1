"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";

const units = [
  { id: '101', name: 'Skyline Suite 101', bookings: [{ start: 2, end: 5, guest: 'John D.' }, { start: 12, end: 18, guest: 'Sarah M.' }] },
  { id: '102', name: 'Ocean View 102', bookings: [{ start: 5, end: 10, guest: 'Mike R.' }, { start: 22, end: 28, guest: 'Emma W.' }] },
  { id: '103', name: 'Garden Villa 103', bookings: [{ start: 1, end: 8, guest: 'Alex K.' }, { start: 15, end: 20, guest: 'James L.' }] },
  { id: '104', name: 'Urban Loft 104', bookings: [{ start: 8, end: 14, guest: 'Maria G.' }, { start: 25, end: 30, guest: 'Robert F.' }] },
];

const days = Array.from({ length: 31 }, (_, i) => i + 1);

const AvailabilityCalendar = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Availability Calendar</CardTitle>
            <p className="text-sm text-muted-foreground">May 2024</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm">Today</Button>
            <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              <div className="grid grid-cols-[200px_repeat(31,1fr)] border-b pb-2 mb-2">
                <div className="font-semibold text-sm">Unit Name</div>
                {days.map(day => (
                  <div key={day} className="text-center text-[10px] font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {units.map(unit => (
                  <div key={unit.id} className="grid grid-cols-[200px_repeat(31,1fr)] items-center group">
                    <div className="text-xs font-medium truncate pr-4">{unit.name}</div>
                    <div className="col-span-31 h-8 bg-muted/30 rounded-md relative">
                      {unit.bookings.map((booking, idx) => (
                        <div
                          key={idx}
                          className="absolute h-6 top-1 bg-primary/80 hover:bg-primary text-[8px] text-primary-foreground flex items-center px-2 rounded cursor-pointer transition-colors truncate"
                          style={{
                            left: `${((booking.start - 1) / 31) * 100}%`,
                            width: `${((booking.end - booking.start) / 31) * 100}%`
                          }}
                          title={`${booking.guest}: ${booking.start} - ${booking.end} May`}
                        >
                          {booking.guest}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-primary rounded" /> Confirmed Booking
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-muted rounded" /> Available
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <Info className="w-3 h-3" /> Click on a booking to view details
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityCalendar;