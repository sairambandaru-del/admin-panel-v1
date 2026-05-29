"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, User } from 'lucide-react';

const allBookings = [
  { id: 'BK-1001', guest: 'Robert Fox', unit: 'Skyline Suite 402', checkIn: '2024-05-20', checkOut: '2024-05-25', status: 'Confirmed', period: 'today' },
  { id: 'BK-1002', guest: 'Jane Cooper', unit: 'Ocean View 105', checkIn: '2024-05-21', checkOut: '2024-05-23', status: 'Pending', period: 'tomorrow' },
  { id: 'BK-1003', guest: 'Cody Fisher', unit: 'Garden Villa 12', checkIn: '2024-05-24', checkOut: '2024-05-30', status: 'Confirmed', period: 'next-week' },
  { id: 'BK-1004', guest: 'Esther Howard', unit: 'Urban Loft 88', checkIn: '2024-05-20', checkOut: '2024-05-22', status: 'Checked In', period: 'today' },
  { id: 'BK-1005', guest: 'Jenny Wilson', unit: 'Mountain Cabin 04', checkIn: '2024-05-22', checkOut: '2024-05-28', status: 'Confirmed', period: 'next-week' },
];

const BookingsTable = () => {
  const [filter, setFilter] = useState('today');

  const filteredBookings = allBookings.filter(b => b.period === filter);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="today" onValueChange={setFilter} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
            <TabsTrigger value="next-week">Next Week</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-bold">{booking.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    {booking.guest}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {booking.unit}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3" />
                    {booking.checkIn} to {booking.checkOut}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={booking.status === 'Confirmed' ? 'default' : booking.status === 'Checked In' ? 'secondary' : 'outline'}>
                    {booking.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {filteredBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No bookings found for this period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BookingsTable;