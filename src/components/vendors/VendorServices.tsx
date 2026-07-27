"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Truck, 
  Search, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  MessageSquare, 
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Kanban,
  List,
  Receipt,
  User,
  MapPin,
  Calendar
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import GuestCommunicationModal, { BookingCommsData, ServiceException } from '@/components/common/GuestCommunicationModal';

interface VendorServiceBooking {
  id: string;
  vendorName: string;
  category: string;
  serviceTitle: string;
  guestName: string;
  unitAddress: string;
  dateScheduled: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Exception Raised' | 'Price Updated';
  costNumeric: number;
  costDisplay: string;
  pendingException?: ServiceException | null;
}

const initialVendorBookings: VendorServiceBooking[] = [
  {
    id: "VS-8804",
    vendorName: "QuickWash Laundry",
    category: "Laundry",
    serviceTitle: "Express Laundry & Dry Clean",
    guestName: "Elena Rostova",
    unitAddress: "Downtown Suite 402",
    dateScheduled: "2024-05-21 10:00",
    status: "In Progress",
    costNumeric: 220,
    costDisplay: "AED 220.00"
  },
  {
    id: "VS-8801",
    vendorName: "Apex Luxury Fleet",
    category: "Car Rentals",
    serviceTitle: "Airport Transfer - Chauffeur Service",
    guestName: "Alexander Wright",
    unitAddress: "Terminal 3 -> Downtown Suite 402",
    dateScheduled: "2024-05-20 14:00",
    status: "In Progress",
    costNumeric: 450,
    costDisplay: "AED 450.00"
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
    costNumeric: 2400,
    costDisplay: "AED 2,400.00"
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
    costNumeric: 650,
    costDisplay: "AED 650.00"
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
    costNumeric: 310,
    costDisplay: "AED 310.00"
  }
];

const KANBAN_STATUSES: Array<{ id: VendorServiceBooking['status']; title: string; color: string }> = [
  { id: 'Scheduled', title: 'Scheduled', color: 'border-blue-400 bg-blue-50/50' },
  { id: 'In Progress', title: 'In Progress', color: 'border-amber-400 bg-amber-50/50' },
  { id: 'Exception Raised', title: 'Exception Raised', color: 'border-rose-400 bg-rose-50/50' },
  { id: 'Price Updated', title: 'Price Updated', color: 'border-emerald-400 bg-emerald-50/50' },
  { id: 'Completed', title: 'Completed', color: 'border-slate-300 bg-slate-50/50' },
];

const VendorServices = () => {
  const [bookings, setBookings] = useState<VendorServiceBooking[]>(initialVendorBookings);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Guest Chat & Invoice Modal State
  const [selectedBookingForComms, setSelectedBookingForComms] = useState<BookingCommsData | null>(null);
  const [isCommsOpen, setIsCommsOpen] = useState(false);

  // Exception Dialog State
  const [isExceptionDialogOpen, setIsExceptionDialogOpen] = useState(false);
  const [exceptionBooking, setExceptionBooking] = useState<VendorServiceBooking | null>(null);
  const [exceptionReason, setExceptionReason] = useState('Extra garments found requiring dry clean');
  const [exceptionDetails, setExceptionDetails] = useState('');
  const [proposedPrice, setProposedPrice] = useState<string>('');

  const filteredBookings = bookings.filter(booking => {
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
      status: booking.status,
      totalAmount: booking.costDisplay,
      pendingException: booking.pendingException || null,
      onApproveException: (bId, newCost) => {
        setBookings(prev => prev.map(b => {
          if (b.id === bId) {
            return {
              ...b,
              costNumeric: newCost,
              costDisplay: `AED ${newCost.toFixed(2)}`,
              status: 'Price Updated',
              pendingException: b.pendingException ? {
                ...b.pendingException,
                status: 'Approved'
              } : null
            };
          }
          return b;
        }));
      },
      onDeclineException: (bId) => {
        setBookings(prev => prev.map(b => {
          if (b.id === bId) {
            return {
              ...b,
              pendingException: b.pendingException ? {
                ...b.pendingException,
                status: 'Declined'
              } : null
            };
          }
          return b;
        }));
      }
    });
    setIsCommsOpen(true);
  };

  const handleOpenRaiseException = (booking: VendorServiceBooking, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExceptionBooking(booking);
    setProposedPrice((booking.costNumeric + 90).toString());
    setExceptionDetails(
      booking.category === 'Laundry' 
        ? "Bag contained 3 additional delicate silk items requiring specialized dry cleaning."
        : "Additional service scope requested upon inspection."
    );
    setIsExceptionDialogOpen(true);
  };

  const handleSubmitException = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exceptionBooking) return;

    const parsedPrice = parseFloat(proposedPrice);
    if (isNaN(parsedPrice) || parsedPrice <= exceptionBooking.costNumeric) {
      showError("Proposed price must be greater than current booking price.");
      return;
    }

    const newException: ServiceException = {
      id: `EXC-${Date.now().toString().slice(-4)}`,
      reason: exceptionReason,
      details: exceptionDetails,
      originalCost: exceptionBooking.costNumeric,
      proposedCost: parsedPrice,
      status: 'Pending Guest Approval',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setBookings(prev => prev.map(b => {
      if (b.id === exceptionBooking.id) {
        return {
          ...b,
          status: 'Exception Raised',
          pendingException: newException
        };
      }
      return b;
    }));

    setIsExceptionDialogOpen(false);
    showSuccess(`Exception raised for ${exceptionBooking.id}. Notification sent to guest in mobile app!`);

    handleOpenComms({
      ...exceptionBooking,
      status: 'Exception Raised',
      pendingException: newException
    });
  };

  const handleUpdateStatus = (bookingId: string, newStatus: VendorServiceBooking['status']) => {
    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status: newStatus } : b
    ));
    showSuccess(`Order ${bookingId} status updated to ${newStatus}.`);
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
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled & In Progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Exceptions Pending Guest</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {bookings.filter(b => b.pendingException?.status === 'Pending Guest Approval').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting price revision approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Fulfilled Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.filter(b => b.status === 'Completed').length}
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
            <div className="text-2xl font-bold">
              AED {bookings.reduce((sum, b) => sum + b.costNumeric, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Live service volume</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Vendor Bookings Header & Switcher */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Vendor Service Dispatch & Kanban</CardTitle>
              <CardDescription>
                Manage service execution in Table or Kanban view. Raise exceptions with price revisions and inspect guest invoices.
              </CardDescription>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border w-fit">
              <Button
                variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 gap-1.5 text-xs font-medium"
                onClick={() => setViewMode('kanban')}
              >
                <Kanban className="w-3.5 h-3.5" />
                Kanban View
              </Button>
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 gap-1.5 text-xs font-medium"
                onClick={() => setViewMode('table')}
              >
                <List className="w-3.5 h-3.5" />
                Table View
              </Button>
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
                <SelectItem value="Laundry">Laundry Services</SelectItem>
                <SelectItem value="Car Rentals">Car Rentals</SelectItem>
                <SelectItem value="In House Catering">In House Catering</SelectItem>
                <SelectItem value="Wellness">Wellness</SelectItem>
                <SelectItem value="Grocery">Grocery</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] h-9 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Exception Raised">Exception Raised</SelectItem>
                <SelectItem value="Price Updated">Price Updated</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {viewMode === 'kanban' ? (
            /* KANBAN BOARD VIEW */
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
              {KANBAN_STATUSES.map(col => {
                const columnBookings = filteredBookings.filter(b => b.status === col.id);

                return (
                  <div key={col.id} className="flex flex-col rounded-xl border bg-muted/20 min-w-[240px]">
                    <div className={`p-3 border-b rounded-t-xl flex justify-between items-center ${col.color}`}>
                      <h4 className="font-bold text-xs tracking-tight">{col.title}</h4>
                      <Badge variant="outline" className="text-[10px] bg-background font-mono">
                        {columnBookings.length}
                      </Badge>
                    </div>

                    <div className="p-2 space-y-3 flex-1 overflow-y-auto max-h-[620px]">
                      {columnBookings.length === 0 ? (
                        <div className="h-24 flex items-center justify-center text-[11px] text-muted-foreground border border-dashed rounded-lg">
                          No orders
                        </div>
                      ) : (
                        columnBookings.map(b => (
                          <Card 
                            key={b.id} 
                            className="p-3 space-y-2 cursor-pointer hover:border-primary/60 transition-all shadow-2xs group bg-card"
                            onClick={() => handleOpenComms(b)}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-mono font-bold text-[11px]">{b.id}</span>
                              <Badge variant="outline" className="text-[9px] px-1 py-0 bg-primary/5 text-primary border-primary/20">
                                {b.category}
                              </Badge>
                            </div>

                            <div>
                              <p className="font-bold text-xs text-foreground group-hover:text-primary transition-colors leading-tight">
                                {b.serviceTitle}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{b.vendorName}</p>
                            </div>

                            <div className="space-y-1 text-[11px] border-t border-b py-2 text-muted-foreground">
                              <div className="flex items-center gap-1 text-foreground font-medium">
                                <User className="w-3 h-3 text-primary shrink-0" />
                                <span className="truncate">{b.guestName}</span>
                              </div>
                              <div className="flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                                <span className="truncate">{b.unitAddress}</span>
                              </div>
                              <div className="flex items-center gap-1 font-mono text-[10px]">
                                <Calendar className="w-3 h-3 text-muted-foreground shrink-0" />
                                <span>{b.dateScheduled}</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-1">
                              <span className="font-bold text-xs text-primary">{b.costDisplay}</span>
                              
                              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 text-amber-700 hover:bg-amber-50"
                                  title="Raise Exception & Price Revision"
                                  onClick={(e) => handleOpenRaiseException(b, e)}
                                >
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 text-primary hover:bg-primary/10"
                                  title="View Guest Chat & Invoice"
                                  onClick={() => handleOpenComms(b)}
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>

                            {/* Status advance button */}
                            {b.status === 'Scheduled' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full text-[10px] h-7 mt-1 border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(b.id, 'In Progress');
                                }}
                              >
                                Start Order
                              </Button>
                            )}

                            {b.status === 'In Progress' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full text-[10px] h-7 mt-1 border-emerald-300 text-emerald-900 bg-emerald-50 hover:bg-emerald-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(b.id, 'Completed');
                                }}
                              >
                                Mark Completed
                              </Button>
                            )}
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* TABLE VIEW */
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Service Title</TableHead>
                    <TableHead>Guest & Unit</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions & Guest Sync</TableHead>
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
                    filteredBookings.map((booking) => {
                      const hasPendingException = booking.pendingException?.status === 'Pending Guest Approval';
                      const isLaundry = booking.category === 'Laundry';

                      return (
                        <TableRow 
                          key={booking.id} 
                          className={`cursor-pointer hover:bg-muted/50 transition-colors ${hasPendingException ? 'bg-amber-50/40' : ''}`}
                          onClick={() => handleOpenComms(booking)}
                        >
                          <TableCell className="font-bold text-xs font-mono">{booking.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-semibold text-xs">{booking.vendorName}</p>
                              <Badge variant="outline" className={`text-[9px] ${isLaundry ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-primary/5 text-primary border-primary/20'}`}>
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
                              booking.status === 'Exception Raised' ? 'destructive' :
                              booking.status === 'Price Updated' ? 'default' : 'outline'
                            } className={
                              booking.status === 'In Progress' ? 'bg-amber-100 text-amber-800 border-amber-300' : 
                              booking.status === 'Price Updated' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : ''
                            }>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-bold text-xs">
                              {booking.costDisplay}
                              {booking.pendingException?.status === 'Approved' && (
                                <span className="block text-[9px] text-emerald-600 font-semibold">Approved by Guest</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end gap-1.5">
                              {/* Raise Exception Button */}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className={`h-8 gap-1 text-xs ${isLaundry ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100' : 'text-amber-800 hover:bg-amber-50'}`}
                                onClick={(e) => handleOpenRaiseException(booking, e)}
                                title="Raise Exception & Revised Price"
                              >
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                <span>Raise Exception</span>
                              </Button>

                              {/* Chat & Invoice Button */}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10"
                                onClick={() => handleOpenComms(booking)}
                                title="Open Chat & View Invoice"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Chat / Invoice</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Raise Exception Modal */}
      <Dialog open={isExceptionDialogOpen} onOpenChange={setIsExceptionDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          {exceptionBooking && (
            <form onSubmit={handleSubmitException}>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-800">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-base">Raise Service Exception & Price Adjustment</DialogTitle>
                    <DialogDescription className="text-xs">
                      Booking #{exceptionBooking.id} • {exceptionBooking.vendorName}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid gap-4 py-4 text-xs">
                {/* Summary Info */}
                <div className="bg-muted p-3 rounded-lg grid grid-cols-2 gap-2 border">
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase font-bold">Guest</span>
                    <p className="font-semibold">{exceptionBooking.guestName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase font-bold">Service</span>
                    <p className="font-semibold truncate">{exceptionBooking.serviceTitle}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase font-bold">Current Price</span>
                    <p className="font-bold text-foreground">AED {exceptionBooking.costNumeric.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] uppercase font-bold">Category</span>
                    <p className="font-medium">{exceptionBooking.category}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="exc-reason" className="text-xs font-semibold">Exception Reason <span className="text-destructive">*</span></Label>
                  <Select value={exceptionReason} onValueChange={setExceptionReason}>
                    <SelectTrigger id="exc-reason" className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Extra garments found requiring dry clean">Extra garments found requiring dry clean</SelectItem>
                      <SelectItem value="Heavy stain removal & specialized treatment">Heavy stain removal & specialized treatment</SelectItem>
                      <SelectItem value="Delicate fabric care upgrade (Silk/Wool/Leather)">Delicate fabric care upgrade (Silk/Wool/Leather)</SelectItem>
                      <SelectItem value="Express turnaround surcharge">Express turnaround surcharge</SelectItem>
                      <SelectItem value="Additional items / Scope expansion">Additional items / Scope expansion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="exc-details" className="text-xs font-semibold">Exception Details for Guest <span className="text-destructive">*</span></Label>
                  <Textarea 
                    id="exc-details" 
                    placeholder="Describe why the price is being adjusted so the guest understands..." 
                    value={exceptionDetails}
                    onChange={e => setExceptionDetails(e.target.value)}
                    className="min-h-[80px] text-xs"
                    required
                  />
                </div>

                {/* Price Adjustment Calculator */}
                <div className="space-y-2 border-2 border-amber-200 bg-amber-50/50 p-3 rounded-xl">
                  <Label htmlFor="proposed-price" className="text-xs font-bold text-amber-900 flex items-center justify-between">
                    <span>New Proposed Total Price (AED)</span>
                    <span className="text-[10px] font-normal text-amber-700">Original: AED {exceptionBooking.costNumeric.toFixed(2)}</span>
                  </Label>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">AED</span>
                      <Input 
                        id="proposed-price" 
                        type="number" 
                        step="0.01" 
                        className="pl-12 h-9 font-bold text-sm bg-white"
                        value={proposedPrice}
                        onChange={e => setProposedPrice(e.target.value)}
                        required
                      />
                    </div>
                    {parseFloat(proposedPrice) > exceptionBooking.costNumeric && (
                      <Badge className="bg-emerald-600 text-white font-bold h-9 px-2 text-xs flex items-center gap-1 shrink-0">
                        +AED {(parseFloat(proposedPrice) - exceptionBooking.costNumeric).toFixed(2)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-amber-800">
                    Once submitted, the guest receives an in-app prompt in their mobile view to approve or decline the new price of AED {parseFloat(proposedPrice) || 0}.
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsExceptionDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                  <ShieldAlert className="w-4 h-4" /> Send Exception & New Price
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Guest Communication & Approval Sync Modal */}
      <GuestCommunicationModal 
        isOpen={isCommsOpen} 
        onClose={() => setIsCommsOpen(false)} 
        booking={selectedBookingForComms} 
      />
    </div>
  );
};

export default VendorServices;