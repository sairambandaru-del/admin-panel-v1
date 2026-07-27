"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Truck, 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Users,
  DollarSign,
  Plus,
  Star,
  MessageSquare,
  Eye
} from 'lucide-react';
import GuestCommunicationModal, { BookingCommsData } from '@/components/common/GuestCommunicationModal';

interface VendorServiceBooking {
  id: string;
  vendorName: string;
  category: string;
  serviceTitle: string;
  guestName: string;
  unitAddress: string;
  dateScheduled: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  cost: string;
}

const mockVendorBookings: VendorServiceBooking[] = [
  {
    id: "VS-8801",
    vendorName: "Apex Luxury Fleet",
    category: "Car Rentals",
    serviceTitle: "Airport Transfer - Chauffeur Service",
    guestName: "Alexander Wright",
    unitAddress: "Terminal 3 -> Downtown Suite 402",
    dateScheduled: "2024-05-20 14:00",
    status: "In Progress",
    cost: "AED 450"
  },
  {
    id: "VS-8802",
    vendorName: "Feast & Fete Catering",
    category: "In House Catering",
    serviceTitle: "3-Course Private Chef Dinner",
    guestName: "Robert Taylor",
    unitAddress: "Palm Jumeirah Villa 05",
    dateScheduled: "2024-05-23 19:30",
    status: "Scheduled",
    cost: "AED 2,400"
  },
  {
    id: "VS-8803",
    vendorName: "Zen Spa & Wellness",
    category: "Wellness",
    serviceTitle: "In-Suite Massage & Aromatherapy",
    guestName: "Sophia Martinez",
    unitAddress: "Marina Bay Penthouse 12B",
    dateScheduled: "2024-05-24 16:00",
    status: "Scheduled",
    cost: "AED 650"
  },
  {
    id: "VS-8804",
    vendorName: "QuickWash Laundry",
    category: "Laundry",
    serviceTitle: "Express Laundry & Dry Clean",
    guestName: "Elena Rostova",
    unitAddress: "Downtown Suite 402",
    dateScheduled: "2024-05-21 10:00",
    status: "Completed",
    cost: "AED 220"
  },
  {
    id: "VS-8805",
    vendorName: "FreshCart Grocery Delivery",
    category: "Grocery",
    serviceTitle: "Organic Breakfast Basket Supply",
    guestName: "Sarah Jenkins",
    unitAddress: "Marina Bay Penthouse 12B",
    dateScheduled: "2024-05-22 08:30",
    status: "Scheduled",
    cost: "AED 310"
  }
];

const VendorServices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBookingForComms, setSelectedBookingForComms] = useState<BookingCommsData | null>(null);
  const [isCommsOpen, setIsCommsOpen] = useState(false);

  const filteredBookings = mockVendorBookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || booking.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenComms = (booking: VendorServiceBooking) => {
    setSelectedBookingForComms({
      id: booking.id,
      guestName: booking.guestName,
      propertyName: booking.unitAddress,
      serviceCategory: booking.category,
      dates: booking.dateScheduled,
      status: booking.status
    });
    setIsCommsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Active Service Orders</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockVendorBookings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled & In Progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockVendorBookings.filter(b => b.status === 'In Progress').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Under execution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Fulfilled Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockVendorBookings.filter(b => b.status === 'Completed').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Total Vendor Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED 4,030</div>
            <p className="text-xs text-muted-foreground mt-1">Service bookings total</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Vendor Bookings List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Vendor Service Bookings</CardTitle>
              <CardDescription>
                Track dispatch, execution, and guest communications for vendor services. Click a booking row to view messages.
              </CardDescription>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendor, service, guest..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px] h-9 text-xs">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Car Rentals">Car Rentals</SelectItem>
                <SelectItem value="In House Catering">In House Catering</SelectItem>
                <SelectItem value="Wellness">Wellness</SelectItem>
                <SelectItem value="Laundry">Laundry</SelectItem>
                <SelectItem value="Grocery">Grocery</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] h-9 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Service Title</TableHead>
                <TableHead>Guest & Unit</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead className="text-right">Guest Communication</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-xs">
                    No vendor service bookings match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow 
                    key={booking.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleOpenComms(booking)}
                  >
                    <TableCell className="font-bold text-xs font-mono">{booking.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-xs">{booking.vendorName}</p>
                        <Badge variant="outline" className="text-[9px] bg-primary/5 text-primary border-primary/20">
                          {booking.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium max-w-[180px] truncate">
                      {booking.serviceTitle}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-xs">{booking.guestName}</p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[160px]">{booking.unitAddress}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono">{booking.dateScheduled}</TableCell>
                    <TableCell>
                      <Badge variant={
                        booking.status === 'Completed' ? 'default' :
                        booking.status === 'Scheduled' ? 'secondary' :
                        booking.status === 'In Progress' ? 'outline' : 'destructive'
                      } className={booking.status === 'In Progress' ? 'bg-amber-100 text-amber-800 border-amber-300' : ''}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-xs">{booking.cost}</TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
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
                ))
              )}
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

export default VendorServices;