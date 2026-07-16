"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Download, 
  Filter, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Tag, 
  Clock, 
  FileText, 
  CheckCircle,
  LayoutGrid,
  List,
  ArrowRight,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { showSuccess } from '@/utils/toast';

export interface Booking {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  bookingDate: string;
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
    status: 'Checked out',
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
    id: 'BK-5520',
    status: 'order accepted',
    startDate: '2024-05-21 08:00',
    endDate: '2024-05-23 17:00',
    bookingDate: '2024-05-20',
    guestName: 'Michael Jordan',
    contactNumber: '+1 (555) 230-9944',
    emailId: 'mj23@bulls.com',
    serviceCategory: 'Laundry',
    amount: 180.00,
    unit: 'Premium Dry Cleaning'
  },
  {
    id: 'BK-5521',
    status: 'under processing',
    startDate: '2024-05-20 09:00',
    endDate: '2024-05-22 18:00',
    bookingDate: '2024-05-19',
    guestName: 'Serena Williams',
    contactNumber: '+1 (555) 444-8811',
    emailId: 'serena@tennis.com',
    serviceCategory: 'Laundry',
    amount: 240.00,
    unit: 'Wash & Fold Bulk'
  },
  {
    id: 'BK-5522',
    status: 'exception raised',
    startDate: '2024-05-19 10:00',
    endDate: '2024-05-21 12:00',
    bookingDate: '2024-05-18',
    guestName: 'Tony Stark',
    contactNumber: '+1 (555) 300-4000',
    emailId: 'tony@starkindustries.com',
    serviceCategory: 'Laundry',
    amount: 350.00,
    unit: 'Silk Suit Care'
  },
  {
    id: 'BK-5510',
    status: 'Enquiry',
    startDate: '2024-05-22 09:00',
    endDate: '2024-05-22 12:00',
    bookingDate: '2024-05-18',
    guestName: 'Alice Brown',
    contactNumber: '+1 (555) 019-2834',
    emailId: 'alice.b@gmail.com',
    serviceCategory: 'House Keeping',
    amount: 150.00,
    unit: 'Deep Cleaning Service'
  },
  {
    id: 'BK-5511',
    status: 'Order placed',
    startDate: '2024-05-20 19:00',
    endDate: '2024-05-20 19:45',
    bookingDate: '2024-05-20',
    guestName: 'Mark Wilson',
    contactNumber: '+1 (555) 024-9911',
    emailId: 'mark.w@gmail.com',
    serviceCategory: 'Food Delivery',
    amount: 85.00,
    unit: 'Gourmet Burger Combo'
  },
  {
    id: 'BK-5512',
    status: 'Packing the cart',
    startDate: '2024-05-21 10:00',
    endDate: '2024-05-21 11:30',
    bookingDate: '2024-05-21',
    guestName: 'Sarah Jenkins',
    contactNumber: '+1 (555) 088-1234',
    emailId: 'sarah.j@gmail.com',
    serviceCategory: 'Grocery',
    amount: 220.00,
    unit: 'Weekly Essentials Cart'
  },
  {
    id: 'BK-5513',
    status: 'Consultation active',
    startDate: '2024-05-21 14:00',
    endDate: '2024-05-21 15:00',
    bookingDate: '2024-05-21',
    guestName: 'David Miller',
    contactNumber: '+1 (555) 077-5678',
    emailId: 'david.m@gmail.com',
    serviceCategory: 'Doctor on Call',
    amount: 450.00,
    unit: 'General Practitioner Visit'
  }
];

export const LAUNDRY_STATUSES = [
  'order accepted',
  'rider assigned',
  'picked up',
  'received at facility',
  'under processing',
  'quality check',
  'out for delivery',
  'delivered',
  'exception raised',
  'claim under review'
];

export const getStatusBadge = (status: string) => {
  switch (status) {
    // Laundry Specific
    case 'order accepted':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 font-medium capitalize">Order Accepted</Badge>;
    case 'rider assigned':
      return <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50 font-medium capitalize">Rider Assigned</Badge>;
    case 'picked up':
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 font-medium capitalize">Picked Up</Badge>;
    case 'received at facility':
      return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50 font-medium capitalize">Received at Facility</Badge>;
    case 'under processing':
      return <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50 font-medium capitalize">Under Processing</Badge>;
    case 'quality check':
      return <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-50 font-medium capitalize">Quality Check</Badge>;
    case 'out for delivery':
      return <Badge variant="outline" className="bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-50 font-medium capitalize">Out for Delivery</Badge>;
    case 'delivered':
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-medium capitalize">Delivered</Badge>;
    case 'exception raised':
      return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 font-medium capitalize">Exception Raised</Badge>;
    case 'claim under review':
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50 font-medium capitalize">Claim Under Review</Badge>;

    // General & STR
    case 'Enquiry':
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 font-medium">Enquiry</Badge>;
    case 'Confirmed':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 font-medium">Confirmed</Badge>;
    case 'Checked in':
      return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50 font-medium">Checked In</Badge>;
    case 'Checked out':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50 font-medium">Checked Out</Badge>;
    case 'Cancelled':
      return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 font-medium">Cancelled</Badge>;
    case 'Completed':
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-medium">Completed</Badge>;

    // House Keeping Specific
    case 'Scheduled':
      return <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50 font-medium">Scheduled</Badge>;
    case 'In progressed':
      return <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50 font-medium">In Progressed</Badge>;

    // Food Delivery & Grocery Specific
    case 'Order placed':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 font-medium">Order Placed</Badge>;
    case 'Accepted':
      return <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-50 font-medium">Accepted</Badge>;
    case 'Preparing':
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50 font-medium">Preparing</Badge>;
    case 'Ready for pickup':
      return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50 font-medium">Ready for Pickup</Badge>;
    case 'Packing the cart':
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100 font-medium">Packing Cart</Badge>;

    // Doctor on Call Specific
    case 'Arrived':
      return <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-50 font-medium">Arrived</Badge>;
    case 'Consultation active':
      return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 font-medium">Consultation Active</Badge>;
    case 'treatment & documentation':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50 font-medium">Treatment & Doc</Badge>;
    case 'Follow-up':
      return <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-50 font-medium">Follow-up</Badge>;

    // Chef on Call & In-house Catering Specific
    case 'Menu finalized':
      return <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-50 font-medium">Menu Finalized</Badge>;
    case 'Inprogress':
      return <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50 font-medium">In Progress</Badge>;

    // Car Rental & Transportation Specific
    case 'In progress':
      return <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50 font-medium">In Progress</Badge>;

    default:
      return <Badge>{status}</Badge>;
  }
};

const BookingReport = () => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Reset status filter if it's not valid for the newly selected category
  const handleCategoryChange = (newCategory: string) => {
    setCategoryFilter(newCategory);
    setStatusFilter('all');
  };

  const handleUpdateStatus = (bookingId: string, newStatus: string) => {
    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status: newStatus } : b
    ));
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showSuccess(`Booking ${bookingId} status updated to "${newStatus}".`);
  };

  const handleAdvanceStatus = (bookingId: string, currentStatus: string, statuses: string[]) => {
    const currentIndex = statuses.indexOf(currentStatus);
    if (currentIndex !== -1 && currentIndex < statuses.length - 1) {
      const nextStatus = statuses[currentIndex + 1];
      handleUpdateStatus(bookingId, nextStatus);
    }
  };

  // Smart Search & Filter Logic
  const filteredBookings = bookings.filter((booking) => {
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

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || booking.serviceCategory === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDownloadInvoice = (booking: Booking) => {
    showSuccess(`Downloading invoice for ${booking.guestName} (${booking.id})...`);
  };

  const handleConfirmHousekeeping = (bookingId: string) => {
    handleUpdateStatus(bookingId, 'Confirmed');
    showSuccess(`Housekeeping booking ${bookingId} has been confirmed by the STR company.`);
  };

  const uniqueCategories = Array.from(new Set(bookings.map(b => b.serviceCategory)));

  // Determine available statuses for the selected category
  const getAvailableStatuses = () => {
    if (categoryFilter === 'Short Term Rentals') {
      return ['Enquiry', 'Confirmed', 'Checked in', 'Checked out', 'Cancelled'];
    } else if (categoryFilter === 'House Keeping') {
      return ['Enquiry', 'Confirmed', 'Scheduled', 'In progressed', 'Completed', 'Cancelled'];
    } else if (categoryFilter === 'Food Delivery') {
      return ['Order placed', 'Accepted', 'Preparing', 'Ready for pickup', 'Out for delivery', 'Delivered', 'Cancelled'];
    } else if (categoryFilter === 'Grocery') {
      return ['Order placed', 'Packing the cart', 'Out for delivery', 'Delivered', 'Cancelled'];
    } else if (categoryFilter === 'Doctor on Call') {
      return ['Enquiry', 'Arrived', 'Consultation active', 'treatment & documentation', 'Completed', 'Follow-up', 'Cancelled'];
    } else if (categoryFilter === 'Chef on Call' || categoryFilter === 'In House Catering') {
      return ['Enquiry', 'Confirmed', 'Menu finalized', 'Inprogress', 'Completed', 'Cancelled'];
    } else if (categoryFilter === 'Car Rentals' || categoryFilter === 'Transportation') {
      return ['Enquiry', 'Confirmed', 'In progress', 'Completed', 'Cancelled'];
    } else if (categoryFilter === 'Laundry') {
      return LAUNDRY_STATUSES;
    } else if (categoryFilter !== 'all') {
      return ['Enquiry', 'Confirmed', 'Cancelled', 'Completed'];
    }
    return ['Enquiry', 'Confirmed', 'Checked in', 'Checked out', 'Completed', 'Cancelled', 'Scheduled', 'In progressed', 'Order placed', 'Accepted', 'Preparing', 'Ready for pickup', 'Out for delivery', 'Delivered', 'Packing the cart', 'Arrived', 'Consultation active', 'treatment & documentation', 'Follow-up', ...LAUNDRY_STATUSES];
  };

  const currentStatuses = getAvailableStatuses().filter(s => s !== 'all');

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
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
          {/* View Mode Toggle */}
          <div className="flex bg-muted p-1 rounded-lg border">
            <Button 
              variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('table')}
              className="h-8 px-3 text-xs gap-1.5"
            >
              <List className="w-3.5 h-3.5" /> Table
            </Button>
            <Button 
              variant={viewMode === 'kanban' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('kanban')}
              className="h-8 px-3 text-xs gap-1.5"
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Kanban
            </Button>
          </div>

          {/* Category Filter */}
          <div className="w-[180px]">
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
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

          {/* Status Filter (Dynamic based on Category) */}
          {viewMode === 'table' && (
            <div className="w-[150px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {getAvailableStatuses().map(status => (
                    <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            variant="outline" 
            className="h-10 gap-2"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCategoryFilter('all');
              setViewMode('table');
              showSuccess("Filters cleared.");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
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
                    <TableHead>Update Status</TableHead>
                    <TableHead>Service Category</TableHead>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Contact Number</TableHead>
                    <TableHead>Email ID</TableHead>
                    <TableHead>Start Date & Time</TableHead>
                    <TableHead>End Date & Time</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => {
                    const allowedStatuses = booking.serviceCategory === 'Laundry' ? LAUNDRY_STATUSES : 
                      booking.serviceCategory === 'Short Term Rentals' ? ['Enquiry', 'Confirmed', 'Checked in', 'Checked out', 'Cancelled'] :
                      booking.serviceCategory === 'House Keeping' ? ['Enquiry', 'Confirmed', 'Scheduled', 'In progressed', 'Completed', 'Cancelled'] :
                      booking.serviceCategory === 'Food Delivery' ? ['Order placed', 'Accepted', 'Preparing', 'Ready for pickup', 'Out for delivery', 'Delivered', 'Cancelled'] :
                      booking.serviceCategory === 'Grocery' ? ['Order placed', 'Packing the cart', 'Out for delivery', 'Delivered', 'Cancelled'] :
                      booking.serviceCategory === 'Doctor on Call' ? ['Enquiry', 'Arrived', 'Consultation active', 'treatment & documentation', 'Completed', 'Follow-up', 'Cancelled'] :
                      booking.serviceCategory === 'Chef on Call' || booking.serviceCategory === 'In House Catering' ? ['Enquiry', 'Confirmed', 'Menu finalized', 'Inprogress', 'Completed', 'Cancelled'] :
                      booking.serviceCategory === 'Car Rentals' || booking.serviceCategory === 'Transportation' ? ['Enquiry', 'Confirmed', 'In progress', 'Completed', 'Cancelled'] :
                      ['Enquiry', 'Confirmed', 'Cancelled', 'Completed'];

                    return (
                      <TableRow 
                        key={booking.id} 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <TableCell className="font-bold text-primary">{booking.id}</TableCell>
                        <TableCell>
                          {getStatusBadge(booking.status)}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Select 
                            value={booking.status} 
                            onValueChange={(val) => handleUpdateStatus(booking.id, val)}
                          >
                            <SelectTrigger className="h-8 w-[160px] text-xs capitalize">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {allowedStatuses.map(status => (
                                <SelectItem key={status} value={status} className="capitalize text-xs">
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                        <TableCell className="text-right font-bold text-primary">AED {booking.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
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
      ) : (
        /* Kanban View */
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1200px] h-[calc(100vh-320px)]">
            {currentStatuses.map((status) => {
              const columnBookings = filteredBookings.filter(b => b.status === status);
              return (
                <div key={status} className="flex-1 min-w-[280px] max-w-[320px] bg-muted/30 rounded-xl border flex flex-col h-full">
                  {/* Column Header */}
                  <div className="p-3 border-b bg-card rounded-t-xl flex items-center justify-between">
                    <span className="font-semibold text-xs capitalize truncate pr-2">{status}</span>
                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5 shrink-0">
                      {columnBookings.length}
                    </Badge>
                  </div>

                  {/* Column Cards */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {columnBookings.map((booking) => {
                      const allowedStatuses = booking.serviceCategory === 'Laundry' ? LAUNDRY_STATUSES : 
                        booking.serviceCategory === 'Short Term Rentals' ? ['Enquiry', 'Confirmed', 'Checked in', 'Checked out', 'Cancelled'] :
                        booking.serviceCategory === 'House Keeping' ? ['Enquiry', 'Confirmed', 'Scheduled', 'In progressed', 'Completed', 'Cancelled'] :
                        booking.serviceCategory === 'Food Delivery' ? ['Order placed', 'Accepted', 'Preparing', 'Ready for pickup', 'Out for delivery', 'Delivered', 'Cancelled'] :
                        booking.serviceCategory === 'Grocery' ? ['Order placed', 'Packing the cart', 'Out for delivery', 'Delivered', 'Cancelled'] :
                        booking.serviceCategory === 'Doctor on Call' ? ['Enquiry', 'Arrived', 'Consultation active', 'treatment & documentation', 'Completed', 'Follow-up', 'Cancelled'] :
                        booking.serviceCategory === 'Chef on Call' || booking.serviceCategory === 'In House Catering' ? ['Enquiry', 'Confirmed', 'Menu finalized', 'Inprogress', 'Completed', 'Cancelled'] :
                        booking.serviceCategory === 'Car Rentals' || booking.serviceCategory === 'Transportation' ? ['Enquiry', 'Confirmed', 'In progress', 'Completed', 'Cancelled'] :
                        ['Enquiry', 'Confirmed', 'Cancelled', 'Completed'];

                      const hasNextStatus = allowedStatuses.indexOf(booking.status) < allowedStatuses.length - 1;

                      return (
                        <Card 
                          key={booking.id} 
                          className="shadow-sm hover:border-primary/50 transition-all cursor-pointer bg-card"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <CardContent className="p-3 space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-xs text-primary">{booking.id}</span>
                              <Badge variant="outline" className="text-[9px] py-0 px-1.5 capitalize">
                                {booking.serviceCategory}
                              </Badge>
                            </div>

                            <div className="space-y-1">
                              <p className="font-semibold text-xs text-foreground truncate">{booking.guestName}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{booking.unit}</p>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t">
                              <span className="font-bold text-xs text-primary">AED {booking.amount.toFixed(2)}</span>
                              
                              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                {/* Status Dropdown */}
                                <Select 
                                  value={booking.status} 
                                  onValueChange={(val) => handleUpdateStatus(booking.id, val)}
                                >
                                  <SelectTrigger className="h-7 w-[110px] text-[10px] capitalize px-2">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {allowedStatuses.map(s => (
                                      <SelectItem key={s} value={s} className="capitalize text-[10px]">
                                        {s}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                {/* Advance Status Button */}
                                {hasNextStatus && (
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="h-7 w-7 text-primary hover:bg-primary/10"
                                    title="Advance to Next Status"
                                    onClick={() => handleAdvanceStatus(booking.id, booking.status, allowedStatuses)}
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    {columnBookings.length === 0 && (
                      <div className="h-24 flex items-center justify-center border border-dashed rounded-lg text-[10px] text-muted-foreground">
                        No bookings
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
              {/* Special STR Confirmation Action for Housekeeping */}
              {selectedBooking.serviceCategory === 'House Keeping' && selectedBooking.status === 'Enquiry' && (
                <div className="bg-primary/10 border border-primary/30 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">STR Company Action Required</p>
                    <p className="text-xs text-muted-foreground">This housekeeping booking must be confirmed by the STR company before scheduling.</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="gap-1.5 shrink-0"
                    onClick={() => handleConfirmHousekeeping(selectedBooking.id)}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm Booking (as STR)
                  </Button>
                </div>
              )}

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
                    <div className="mt-1 flex items-center gap-2">
                      {getStatusBadge(selectedBooking.status)}
                      
                      {/* Status Dropdown inside Dialog */}
                      <Select 
                        value={selectedBooking.status} 
                        onValueChange={(val) => handleUpdateStatus(selectedBooking.id, val)}
                      >
                        <SelectTrigger className="h-8 w-[160px] text-xs capitalize">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableStatuses().map(status => (
                            <SelectItem key={status} value={status} className="capitalize text-xs">
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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