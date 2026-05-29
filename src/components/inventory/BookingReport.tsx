"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Download, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";

const bookings = [
  { id: 'BK-5501', guest: 'Robert Fox', unit: 'Skyline Suite 101', checkIn: '2024-05-02', checkOut: '2024-05-05', amount: 750.00, status: 'Completed' },
  { id: 'BK-5502', guest: 'Jane Cooper', unit: 'Ocean View 102', checkIn: '2024-05-05', checkOut: '2024-05-10', amount: 1250.00, status: 'Confirmed' },
  { id: 'BK-5503', guest: 'Cody Fisher', unit: 'Garden Villa 103', checkIn: '2024-05-01', checkOut: '2024-05-08', amount: 2100.00, status: 'Confirmed' },
  { id: 'BK-5504', guest: 'Esther Howard', unit: 'Urban Loft 104', checkIn: '2024-05-08', checkOut: '2024-05-14', amount: 900.00, status: 'In Progress' },
  { id: 'BK-5505', guest: 'Jenny Wilson', unit: 'Skyline Suite 101', checkIn: '2024-05-12', checkOut: '2024-05-18', amount: 1500.00, status: 'Confirmed' },
];

const BookingReport = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search bookings..." className="h-9" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Guest Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-bold">{booking.id}</TableCell>
                  <TableCell>{booking.guest}</TableCell>
                  <TableCell>{booking.unit}</TableCell>
                  <TableCell>{booking.checkIn}</TableCell>
                  <TableCell>{booking.checkOut}</TableCell>
                  <TableCell>${booking.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={
                      booking.status === 'Completed' ? 'default' : 
                      booking.status === 'Confirmed' ? 'secondary' : 'outline'
                    }>
                      {booking.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingReport;