"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Download, Filter, Calendar, User, Mail, Phone, Tag, Clock, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { showSuccess } from '@/utils/toast';

interface Booking {
  id: string;
  status: 'Completed' | 'Confirmed' | 'In Progress' | 'Cancelled';
  startDate: string; // Start date and time stamp
  endDate: string; // End date and time stamp
  bookingDate: string; // Booking date
  guestName: string;
  contactNumber: string;
  emailId: string;
  serviceCategory: string;
  amount: number;
  unit: string;
}

const initialBookings: Booking[] = [
  {
    id: 'BK-5501',
    status: 'Completed',
    startDate: '2024-05-02 14:00',
    endDate: '2024-05-05 11:00',
    bookingDate: '2024-04-15',
    guestName: 'Robert Fox',
    contactNumber: '+1 (555) 234-5678',
    emailId: 'robert.fox@gmail.com',
    serviceCategory: 'Short Term Rentals',
    amount: 750.00,
    unit: 'Skyline Suite 101'
  },
  {
    id: 'BK-5502',
    status: 'Confirmed',
    startDate: '2024-05-05 15:00',
    endDate: '2024-05-10 10:00',
    bookingDate: '2024-04-20',
    guestName: 'Jane Cooper',
    contactNumber: '+1 (555) 876-5432',
    emailId: 'jane.cooper@yahoo.com',
    serviceCategory: 'Short Term Rentals',
    amount: 1250.00,
    unit: 'Ocean View 102'
  },
  {
    id: 'BK-5503',
    status: 'Confirmed',
    startDate: '2024-05-01 09:00',
    endDate: '2024-05-08 18:00',
    bookingDate: '2024-04-10',
    guestName: 'Cody Fisher',
    contactNumber: '+1 (555) 345-6789',
    emailId: 'cody.fisher@techcorp.com',
    serviceCategory: 'Car Rentals',
    amount: 500.00,
    unit: 'Tesla Model 3'
  },
  {
    id: 'BK-5504',
    status: 'In Progress',
    startDate: '2024-05-08 12:00',
    endDate: '2024-05-14 12:00',
    bookingDate: '2024-04-25',
    guestName: 'Esther Howard',
    contactNumber: '+1 (555) 987-6543',
    emailId: 'esther.h@globallogistics.com',
    serviceCategory: 'Co-working Spaces',
    amount: 300.00,
    unit: 'Dedicated Desk A'
  },
  {
    id: 'BK-5505',
    status: 'Completed',
    startDate: '2024-05-12 14:00',
    endDate: '2024-05-18 11:00',
    bookingDate: '2024-05-01',
    guestName: 'Jenny Wilson',
    contactNumber: '+1 (555) 456-7890',
    emailId: 'jenny.w@innovate.com',
    serviceCategory: 'In House Catering',
    amount: 450.00,
    unit: 'Executive Dinner Package'
  },
  {
    id: 'BK-5506',
    status: 'Cancelled',
    startDate: '2024-05-15 10:00',
    endDate: '2024-05-16 16:00',
    bookingDate: '2024-05-02',
    guestName: 'Marcus Aurelius',
    contactNumber: '+1 (555) 111-2222',
    emailId: 'marcus@rome.com',
    serviceCategory: 'Wellness',
    amount: 150.00,
    unit: 'Spa & Massage Session'
  }
];

const BookingReport = () => {
  const [bookings] = useState<Booking[]>(initialBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Smart Search & Filter Logic
  const filteredBookings = bookings.filter((booking) => {
    // Smart Search: check if query matches any field value
    const matchesSearch = searchQuery === '' || [
      booking.id,
      booking.guestName,
      booking.emailId,
      booking.contactNumber,
      booking.serviceCategory,
      booking.unit,
      booking.status,
      booking.startDate,
      booking.endDate,
      booking.bookingDate,
      booking.amount.toString()
    ].some(val => val.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status Filter
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    // Category Filter
    const matchesCategory = categoryFilter === 'all' || booking.serviceCategory === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDownloadInvoice = (booking: Booking) => {
    showSuccess(`Downloading invoice for ${booking.guestName} (${booking.id})...`);
  };

  const uniqueCategories = Array.from(new Set(bookings.map(b => b.serviceCategory)));

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Smart search (name, email, ID, category, dates...)" 
            className="pl-9 h-10 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="w-[150px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="w-[180px]">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Filter Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant="outline" 
            className="h-10 gap-2"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCategoryFilter('all');
              showSuccess("Filters cleared.");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Bookings Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Booking Records</CardTitle>
              <CardDescription>Click on any row to view the detailed booking breakdown and download the invoice.</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Booking ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Service Category</TableHead>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Email ID</TableHead>
                  <TableHead>Start Date & Time</TableHead>
                  <TableHead>End Date & Time</TableHead>
                  <TableHead>Booking Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow 
                    key={booking.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <TableCell className="font-bold text-primary">{booking.id}</TableCell>
                    <TableCell>
                      <Badge variant={
                        booking.status === 'Completed' ? 'default' : 
                        booking.status === 'Confirmed' ? 'secondary' : 
                        booking.status === 'In Progress' ? 'outline' : 'destructive'
                      }>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        {booking.serviceCategory}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{booking.guestName}</TableCell>
                    <TableCell className="text-xs font-mono">{booking.contactNumber}</TableCell>
                    <TableCell className="text-xs">{booking.emailId}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{booking.startDate}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{booking.endDate}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{booking.bookingDate}</TableCell>
                    <TableCell className="text-right font-bold text-primary">AED {booking.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {filteredBookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                      No bookings match your search or filter criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Booking Breakdown Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        {selectedBooking && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <FileText className="w-5 h-5 text-primary" />
                Booking Breakdown & Invoice
              </DialogTitle>
              <DialogDescription>
                Detailed breakdown of booking {selectedBooking.id} including guest details and service items.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Guest Details Section */}
              <div className="bg-muted/30 p-4 rounded-xl border space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                  Guest Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="font-semibold text-foreground">{selectedBooking.guestName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Booking ID</p>
                    <p className="font-semibold text-foreground">{selectedBooking.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email Address</p>
                    <p className="font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      {selectedBooking.emailId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Contact Number</p>
                    <p className="font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      {selectedBooking.contactNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Details Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-primary" />
                  Service & Schedule Breakdown
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm border rounded-xl p-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Service Category</p>
                    <Badge variant="outline" className="mt-1 bg-primary/5 text-primary border-primary/20">
                      {selectedBooking.serviceCategory}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Assigned Unit / Item</p>
                    <p className="font-semibold mt-1">{selectedBooking.unit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date & Time</p>
                    <p className="font-medium flex items-center gap-1.5 mt-1 text-xs">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      {selectedBooking.startDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">End Date & Time</p>
                    <p className="font-medium flex items-center gap-1.5 mt-1 text-xs">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      {selectedBooking.endDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Booking Date</p>
                    <p className="font-medium flex items-center gap-1.5 mt-1 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      {selectedBooking.bookingDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge className="mt-1" variant={
                      selectedBooking.status === 'Completed' ? 'default' : 
                      selectedBooking.status === 'Confirmed' ? 'secondary' : 
                      selectedBooking.status === 'In Progress' ? 'outline' : 'destructive'
                    }>
                      {selectedBooking.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="border-t pt-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">Total Amount Billed</p>
                  <p className="text-2xl font-bold text-primary">AED {selectedBooking.amount.toFixed(2)}</p>
                </div>
                <Button 
                  className="gap-2"
                  onClick={() => handleDownloadInvoice(selectedBooking)}
                >
                  <Download className="w-4 h-4" />
                  Download Invoice
                </Button>
              </div>
            </div>

            <DialogFooter className="sm:justify-end">
              <Button variant="secondary" onClick={() => setSelectedBooking(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default BookingReport;