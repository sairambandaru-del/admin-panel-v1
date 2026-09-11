"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MessageSquare, Download, Clock, CheckCircle2, User } from 'lucide-react';
import GuestCommunicationModal, { BookingCommsData } from '@/components/common/GuestCommunicationModal';

interface DashboardBooking {
  id: string;
  guestName: string;
  guestEmail: string;
  unitName: string;
  category: string;
  dates: string;
  status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  totalAmount: string;
}

const mockDashboardBookings: DashboardBooking[] = [
  {
    id: "BK-9021",
    guestName: "Alexander Wright",
    guestEmail: "a.wright@techcorp.com",
    unitName: "Downtown Luxury Suite 402",
    category: "Short Term Rentals",
    dates: "May 20 - May 25, 2024",
    status: "In Progress",
    totalAmount: "AED 4,250"
  },
  {
    id: "BK-9022",
    guestName: "Sarah Jenkins",
    guestEmail: "s.jenkins@innovate.io",
    unitName: "Marina Bay Penthouse 12B",
    category: "Short Term Rentals",
    dates: "May 22 - May 28, 2024",
    status: "Confirmed",
    totalAmount: "AED 8,900"
  },
  {
    id: "BK-9023",
    guestName: "Michael Chen",
    guestEmail: "m.chen@globalfinance.com",
    unitName: "Palm Jumeirah Villa 05",
    category: "Short Term Rentals",
    dates: "May 15 - May 18, 2024",
    status: "Completed",
    totalAmount: "AED 12,500"
  },
  {
    id: "BK-9024",
    guestName: "Emma Watson",
    guestEmail: "e.watson@creative.co",
    unitName: "Executive Chauffeur - S Class",
    category: "Car Rentals",
    dates: "May 21, 2024",
    status: "Confirmed",
    totalAmount: "AED 1,800"
  },
  {
    id: "BK-9027",
    guestName: "Robert Taylor",
    guestEmail: "rtaylor@apex.com",
    unitName: "Private Chef Dinner Service",
    category: "In House Catering",
    dates: "May 23, 2024",
    status: "Confirmed",
    totalAmount: "AED 2,400"
  }
];

const BookingsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBookingForComms, setSelectedBookingForComms] = useState<BookingCommsData | null>(null);
  const [isCommsOpen, setIsCommsOpen] = useState(false);

  const filteredBookings = mockDashboardBookings.filter(b => 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.unitName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenComms = (booking: DashboardBooking) => {
    setSelectedBookingForComms({
      id: booking.id,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      propertyName: booking.unitName,
      serviceCategory: booking.category,
      dates: booking.dates,
            status: booking.status,
      totalAmount: booking.totalAmount
    });
    setIsCommsOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Dashboard Bookings Overview</CardTitle>
              <CardDescription>
                Overview of recent reservations. Click any booking or "View Chat" to see the full guest communication history.
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search booking ID, guest..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Unit / Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Communications</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow 
                  key={booking.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleOpenComms(booking)}
                >
                  <TableCell className="font-bold text-xs font-mono">{booking.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-xs">{booking.guestName}</p>
                      <p className="text-[10px] text-muted-foreground">{booking.guestEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium">{booking.unitName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                      {booking.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{booking.dates}</TableCell>
                  <TableCell>
                    <Badge variant={
                      booking.status === 'Completed' ? 'default' :
                      booking.status === 'Confirmed' ? 'secondary' :
                      booking.status === 'In Progress' ? 'outline' : 'destructive'
                    }>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-xs">{booking.totalAmount}</TableCell>
                  <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => handleOpenComms(booking)}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>View Chat</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Guest Communication Modal */}
      <GuestCommunicationModal 
        isOpen={isCommsOpen} 
        onClose={() => setIsCommsOpen(false)} 
        booking={selectedBookingForComms} 
      />
    </div>
  );
};

export default BookingsTable;
