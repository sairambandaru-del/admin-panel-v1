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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ShieldAlert,
  Kanban,
  List,
  User,
  MapPin,
  Calendar,
  Shirt,
  Car,
  Utensils,
  Stethoscope,
  ShoppingBag,
  Sparkles,
  Home,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import GuestCommunicationModal, { BookingCommsData, ServiceException } from '@/components/common/GuestCommunicationModal';

interface VendorServiceBooking {
  id: string;
  vendorName: string;
  category: 
    | 'Short Term Rental'
    | 'Leisure & Wellness'
    | 'House Keeping'
    | 'Food Delivery'
    | 'Grocery'
    | 'Doctor on Call'
    | 'Chef & Catering'
    | 'Car Rental & Transport'
    | 'Laundry';
  serviceTitle: string;
  guestName: string;
  unitAddress: string;
  dateScheduled: string;
  status: string;
  strConfirmed?: boolean; // Required for House Keeping rule
  costNumeric: number;
  costDisplay: string;
  pendingException?: ServiceException | null;
}

// Category Specific Status Pipelines (Strictly mapped as requested)
const SERVICE_PIPELINES: Record<string, Array<{ id: string; title: string; color: string }>> = {
  'Short Term Rental': [
    { id: 'Enquiry', title: 'Enquiry', color: 'border-blue-400 bg-blue-50/60' },
    { id: 'Confirmed', title: 'Confirmed', color: 'border-indigo-400 bg-indigo-50/60' },
    { id: 'Checked in', title: 'Checked in', color: 'border-emerald-400 bg-emerald-50/60' },
    { id: 'Checked out', title: 'Checked out', color: 'border-slate-300 bg-slate-50/60' },
    { id: 'Cancelled', title: 'Cancelled', color: 'border-rose-400 bg-rose-50/60' }
  ],
  'Leisure & Wellness': [
    { id: 'Enquiry', title: 'Enquiry', color: 'border-blue-400 bg-blue-50/60' },
    { id: 'Confirmed', title: 'Confirmed', color: 'border-indigo-400 bg-indigo-50/60' },
    { id: 'Completed', title: 'Completed', color: 'border-emerald-400 bg-emerald-50/60' },
    { id: 'Cancelled', title: 'Cancelled', color: 'border-rose-400 bg-rose-50/60' }
  ],
  'House Keeping': [
    { id: 'Enquiry', title: 'Enquiry', color: 'border-blue-400 bg-blue-50/60' },
    { id: 'Confirmed', title: 'Confirmed (STR Approved)', color: 'border-emerald-400 bg-emerald-50/60' },
    { id: 'Scheduled', title: 'Scheduled', color: 'border-amber-400 bg-amber-50/60' },
    { id: 'In Progress', title: 'In Progress', color: 'border-purple-400 bg-purple-50/60' },
    { id: 'Completed', title: 'Completed', color: 'border-slate-300 bg-slate-50/60' },
    { id: 'Cancelled', title: 'Cancelled', color: 'border-rose-400 bg-rose-50/60' }
  ],
  'Food Delivery': [
    { id: 'Order placed', title: 'Order Placed', color: 'border-blue-400 bg-blue-50/60' },
    { id: 'Accepted', title: 'Accepted', color: 'border-indigo-400 bg-indigo-50/60' },
    { id: 'Preparing', title: 'Preparing', color: 'border-amber-400 bg-amber-50/60' },
    { id: 'Ready for pickup', title: 'Ready for Pickup', color: 'border-cyan-400 bg-cyan-50/60' },
    { id: 'Out for delivery', title: 'Out for Delivery', color: 'border-purple-400 bg-purple-50/60' },
    { id: 'Delivered', title: 'Delivered', color: 'border-emerald-400 bg-emerald-50/60' },
    { id: 'Cancelled', title: 'Cancelled', color: 'border-rose-400 bg-rose-50/60' }
  ],
  'Grocery': [
    { id: 'Order placed', title: 'Order Placed', color: 'border-blue-400 bg-blue-50/60' },
    { id: 'Packing the cart', title: 'Packing the Cart', color: 'border-amber-400 bg-amber-50/60' },
    { id: 'Out for delivery', title: 'Out for Delivery', color: 'border-purple-400 bg-purple-50/60' },
    { id: 'Delivered', title: 'Delivered', color: 'border-emerald-400 bg-emerald-50/60' },
    { id: 'Cancelled', title: 'Cancelled', color: 'border-rose-400 bg-rose-50/60' }
  ],
  'Doctor on Call': [
    { id: 'Enquiry', title: 'Enquiry', color: 'border-blue-400 bg-blue-50/60' },
    { id: 'Arrived', title: 'Arrived at Unit', color: 'border-cyan-400 bg-cyan-50/60' },
    { id: 'Consultation active', title: 'Consultation Active', color: 'border-purple-400 bg-purple-50/60' },
    { id: 'Treatment & documentation', title: 'Treatment & Documentation', color: 'border-amber-400 bg-amber-50/60' },
    { id: 'Completed', title: 'Completed', color: 'border-emerald-400 bg-emerald-50/60' },
    { id: 'Follow-up', title: 'Follow-up Required', color: 'border-indigo-400 bg-indigo-50/60' },
    { id: 'Cancelled', title: 'Cancelled', color: 'border-rose-400 bg-rose-50/60' }
  ],
  'Chef & Catering': [
    { id: 'Enquiry', title: 'Enquiry', color: 'border-blue-400 bg-blue-50/60' },
    { id: 'Confirmed', title: 'Confirmed', color: 'border-indigo-400 bg-indigo-50/60' },
    { id: 'Menu finalized', title: 'Menu Finalized', color: 'border-cyan-400 bg-cyan-50/60' },
    { id: 'In Progress', title: 'In Progress', color: 'border-amber-400 bg-amber-50/60' },
    { id: 'Completed', title: 'Completed', color: 'border-emerald-400 bg-emerald-50/60' },
    { id: 'Cancelled', title: 'Cancelled', color: 'border-rose-400 bg-rose-50/60' }
  ],
  'Car Rental & Transport': [
    { id: 'Enquiry', title: 'Enquiry', color: 'border-blue-400 bg-blue-50/60' },
    { id: 'Confirmed', title: 'Confirmed', color: 'border-indigo-400 bg-indigo-50/60' },
    { id: 'In Progress', title: 'In Progress', color: 'border-amber-400 bg-amber-50/60' },
    { id: 'Completed', title: 'Completed', color: 'border-emerald-400 bg-emerald-50/60' },
    { id: 'Cancelled', title: 'Cancelled', color: 'border-rose-400 bg-rose-50/60' }
  ],
  'Laundry': [
    { id: 'Order accepted', title: 'Order Accepted', color: 'border-blue-400 bg-blue-50/60' },
    { id: 'Rider assigned', title: 'Rider Assigned', color: 'border-cyan-400 bg-cyan-50/60' },
    { id: 'Picked up', title: 'Picked Up', color: 'border-indigo-400 bg-indigo-50/60' },
    { id: 'Received at facility', title: 'Received at Facility', color: 'border-purple-400 bg-purple-50/60' },
    { id: 'Under processing', title: 'Under Processing', color: 'border-amber-400 bg-amber-50/60' },
    { id: 'Quality check', title: 'Quality Check', color: 'border-teal-400 bg-teal-50/60' },
    { id: 'Out for delivery', title: 'Out for Delivery', color: 'border-blue-500 bg-blue-100/60' },
    { id: 'Delivered', title: 'Delivered', color: 'border-emerald-400 bg-emerald-50/60' },
    { id: 'Exception raised', title: 'Exception Raised', color: 'border-rose-400 bg-rose-50/60' },
    { id: 'Claim under review', title: 'Claim Under Review', color: 'border-rose-600 bg-rose-100/60' }
  ]
};

const initialVendorBookings: VendorServiceBooking[] = [
  {
    id: "VS-8804",
    vendorName: "QuickWash Laundry",
    category: "Laundry",
    serviceTitle: "Express Dry Clean & Laundry",
    guestName: "Elena Rostova",
    unitAddress: "Downtown Suite 402",
    dateScheduled: "2024-05-21 10:00",
    status: "Under processing",
    costNumeric: 220,
    costDisplay: "AED 220.00"
  },
  {
    id: "VS-8806",
    vendorName: "Spin Cycle Dry Cleaners",
    category: "Laundry",
    serviceTitle: "Suits & Evening Gown Pressing",
    guestName: "Alexander Wright",
    unitAddress: "Downtown Suite 402",
    dateScheduled: "2024-05-21 14:00",
    status: "Picked up",
    costNumeric: 180,
    costDisplay: "AED 180.00"
  },
  {
    id: "VS-8807",
    vendorName: "Sparkle Cleaners",
    category: "House Keeping",
    serviceTitle: "Full Apartment Turnover Cleaning",
    guestName: "Michael Chen",
    unitAddress: "Marina Penthouse 12B",
    dateScheduled: "2024-05-22 11:00",
    status: "Enquiry",
    strConfirmed: false, // STR confirmation required
    costNumeric: 350,
    costDisplay: "AED 350.00"
  },
  {
    id: "VS-8801",
    vendorName: "Apex Luxury Fleet",
    category: "Car Rental & Transport",
    serviceTitle: "Airport Transfer - Chauffeur Service",
    guestName: "Alexander Wright",
    unitAddress: "Terminal 3 -> Suite 402",
    dateScheduled: "2024-05-20 14:00",
    status: "In Progress",
    costNumeric: 450,
    costDisplay: "AED 450.00"
  },
  {
    id: "VS-8802",
    vendorName: "Feast & Fete Catering",
    category: "Chef & Catering",
    serviceTitle: "3-Course Private Chef Dinner",
    guestName: "Robert Taylor",
    unitAddress: "Palm Jumeirah Villa 05",
    dateScheduled: "2024-05-23 19:30",
    status: "Menu finalized",
    costNumeric: 2400,
    costDisplay: "AED 2,400.00"
  },
  {
    id: "VS-8803",
    vendorName: "Zen Spa & Wellness",
    category: "Leisure & Wellness",
    serviceTitle: "In-Suite Massage & Aromatherapy",
    guestName: "Sophia Martinez",
    unitAddress: "Marina Bay Penthouse 12B",
    dateScheduled: "2024-05-24 16:00",
    status: "Confirmed",
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
    status: "Packing the cart",
    costNumeric: 310,
    costDisplay: "AED 310.00"
  },
  {
    id: "VS-8808",
    vendorName: "MedCall Pro",
    category: "Doctor on Call",
    serviceTitle: "In-Room General Consultation",
    guestName: "David Miller",
    unitAddress: "Skyline Suite 101",
    dateScheduled: "2024-05-20 18:00",
    status: "Arrived",
    costNumeric: 500,
    costDisplay: "AED 500.00"
  }
];

const VendorServices = () => {
  const [bookings, setBookings] = useState<VendorServiceBooking[]>(initialVendorBookings);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
  const [selectedCategory, setSelectedCategory] = useState<string>('Laundry');
  const [searchTerm, setSearchTerm] = useState('');

  // Guest Chat & Invoice Modal State
  const [selectedBookingForComms, setSelectedBookingForComms] = useState<BookingCommsData | null>(null);
  const [isCommsOpen, setIsCommsOpen] = useState(false);

  // Exception Dialog State
  const [isExceptionDialogOpen, setIsExceptionDialogOpen] = useState(false);
  const [exceptionBooking, setExceptionBooking] = useState<VendorServiceBooking | null>(null);
  const [exceptionReason, setExceptionReason] = useState('Extra garments found requiring dry clean');
  const [exceptionDetails, setExceptionDetails] = useState('');
  const [proposedPrice, setProposedPrice] = useState<string>('');

  // Active Pipeline Columns based on selected category tab
  const activePipeline = SERVICE_PIPELINES[selectedCategory] || SERVICE_PIPELINES['Laundry'];

  const filteredBookings = bookings.filter(booking => {
    const matchesCategory = selectedCategory === 'All' || booking.category === selectedCategory;
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
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
              status: b.category === 'Laundry' ? 'Under processing' : 'Confirmed',
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
          status: 'Exception raised',
          pendingException: newException
        };
      }
      return b;
    }));

    setIsExceptionDialogOpen(false);
    showSuccess(`Exception raised for ${exceptionBooking.id}. Mobile notification sent to guest.`);

    handleOpenComms({
      ...exceptionBooking,
      status: 'Exception raised',
      pendingException: newException
    });
  };

  const handleConfirmSTRHousekeeping = (bookingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Confirmed',
          strConfirmed: true
        };
      }
      return b;
    }));
    showSuccess(`Housekeeping booking ${bookingId} confirmed by Short Term Rental Admin.`);
  };

  const handleAdvanceStatus = (booking: VendorServiceBooking, nextStatus: string) => {
    // Check HK special rule
    if (booking.category === 'House Keeping' && nextStatus === 'Confirmed' && !booking.strConfirmed) {
      showError("Housekeeping booking must be confirmed by the Short Term Rental company admin first.");
      return;
    }

    setBookings(prev => prev.map(b => 
      b.id === booking.id ? { ...b, status: nextStatus } : b
    ));
    showSuccess(`Order ${booking.id} advanced to "${nextStatus}".`);
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
            <p className="text-xs text-muted-foreground mt-1">Dispatched across categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Laundry Orders</CardTitle>
            <Shirt className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-700">
              {bookings.filter(b => b.category === 'Laundry').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">10-Stage Service Pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Pending STR Confirmations</CardTitle>
            <ShieldCheck className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {bookings.filter(b => b.category === 'House Keeping' && !b.strConfirmed).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Housekeeping STR Admin Approval</p>
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

      {/* Main Vendor Dispatch Board */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Vendor Service Dispatch & Kanban Workflows</CardTitle>
              <CardDescription>
                Category-specific status mappings for Laundry, Housekeeping, Doctor on Call, Catering, Transportation & Grocery.
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

          {/* Category Selector Tabs */}
          <div className="pt-4 border-t mt-4 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full xl:w-auto overflow-x-auto pb-1">
              <TabsList className="bg-muted/80 h-9 p-1 flex-nowrap w-max">
                <TabsTrigger value="Laundry" className="text-xs gap-1.5 px-3">
                  <Shirt className="w-3.5 h-3.5 text-indigo-600" />
                  Laundry ({bookings.filter(b => b.category === 'Laundry').length})
                </TabsTrigger>
                <TabsTrigger value="House Keeping" className="text-xs gap-1.5 px-3">
                  <Home className="w-3.5 h-3.5 text-blue-600" />
                  House Keeping
                </TabsTrigger>
                <TabsTrigger value="Car Rental & Transport" className="text-xs gap-1.5 px-3">
                  <Car className="w-3.5 h-3.5 text-cyan-600" />
                  Car Rental & Transport
                </TabsTrigger>
                <TabsTrigger value="Chef & Catering" className="text-xs gap-1.5 px-3">
                  <Utensils className="w-3.5 h-3.5 text-amber-600" />
                  Chef & Catering
                </TabsTrigger>
                <TabsTrigger value="Doctor on Call" className="text-xs gap-1.5 px-3">
                  <Stethoscope className="w-3.5 h-3.5 text-rose-600" />
                  Doctor on Call
                </TabsTrigger>
                <TabsTrigger value="Grocery" className="text-xs gap-1.5 px-3">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                  Grocery
                </TabsTrigger>
                <TabsTrigger value="Leisure & Wellness" className="text-xs gap-1.5 px-3">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Leisure & Wellness
                </TabsTrigger>
                <TabsTrigger value="Short Term Rental" className="text-xs gap-1.5 px-3">
                  STR
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search Input */}
            <div className="relative w-full xl:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search order ID, guest, vendor..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {viewMode === 'kanban' ? (
            /* KANBAN BOARD VIEW (Horizontal scroll container with fixed non-overlapping columns) */
            <div className="w-full overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-max">
                {activePipeline.map(col => {
                  const columnBookings = filteredBookings.filter(b => b.status === col.id);

                  return (
                    <div 
                      key={col.id} 
                      className="w-72 shrink-0 flex flex-col rounded-xl border bg-muted/20 min-h-[480px]"
                    >
                      {/* Column Header */}
                      <div className={`p-3 border-b rounded-t-xl flex justify-between items-center ${col.color}`}>
                        <h4 className="font-bold text-xs tracking-tight text-foreground">{col.title}</h4>
                        <Badge variant="outline" className="text-[10px] bg-background font-mono font-bold">
                          {columnBookings.length}
                        </Badge>
                      </div>

                      {/* Column Card Body */}
                      <div className="p-2 space-y-3 flex-1 overflow-y-auto max-h-[620px]">
                        {columnBookings.length === 0 ? (
                          <div className="h-28 flex flex-col items-center justify-center text-[11px] text-muted-foreground border border-dashed rounded-lg bg-background/50">
                            <span>No orders in stage</span>
                          </div>
                        ) : (
                          columnBookings.map(b => (
                            <Card 
                              key={b.id} 
                              className="p-3.5 space-y-2.5 cursor-pointer hover:border-primary/60 transition-all shadow-2xs group bg-card"
                              onClick={() => handleOpenComms(b)}
                            >
                              <div className="flex justify-between items-start gap-1">
                                <span className="font-mono font-bold text-xs">{b.id}</span>
                                <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-primary/5 text-primary border-primary/20">
                                  {b.category}
                                </Badge>
                              </div>

                              <div>
                                <p className="font-bold text-xs text-foreground group-hover:text-primary transition-colors leading-snug">
                                  {b.serviceTitle}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">{b.vendorName}</p>
                              </div>

                              <div className="space-y-1 text-[11px] border-t border-b py-2 text-muted-foreground">
                                <div className="flex items-center gap-1.5 text-foreground font-medium">
                                  <User className="w-3.5 h-3.5 text-primary shrink-0" />
                                  <span className="truncate">{b.guestName}</span>
                                </div>
                                <div className="flex items-center gap-1.5 truncate">
                                  <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                  <span className="truncate">{b.unitAddress}</span>
                                </div>
                                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                                  <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                  <span>{b.dateScheduled}</span>
                                </div>
                              </div>

                              {/* Housekeeping Special Rule Indicator */}
                              {b.category === 'House Keeping' && !b.strConfirmed && (
                                <div className="p-2 bg-amber-50 rounded border border-amber-200 text-[10px] space-y-1.5">
                                  <p className="font-semibold text-amber-900 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                                    STR Admin Approval Required
                                  </p>
                                  <Button 
                                    size="sm" 
                                    className="w-full text-[10px] h-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                                    onClick={(e) => handleConfirmSTRHousekeeping(b.id, e)}
                                  >
                                    Approve as STR Admin
                                  </Button>
                                </div>
                              )}

                              {/* Price & Action Triggers */}
                              <div className="flex justify-between items-center pt-1">
                                <div>
                                  <span className="font-bold text-xs text-primary">{b.costDisplay}</span>
                                  {b.pendingException?.status === 'Approved' && (
                                    <span className="block text-[9px] text-emerald-600 font-bold">Price Approved</span>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-7 text-[10px] gap-1 px-2 border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                                    title="Raise Exception & Revised Price"
                                    onClick={(e) => handleOpenRaiseException(b, e)}
                                  >
                                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                                    <span>Exception</span>
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

                              {/* Stage Advance Trigger */}
                              {col.id !== activePipeline[activePipeline.length - 1].id && col.id !== 'Cancelled' && (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="w-full text-[10px] h-7 mt-1 text-primary hover:bg-primary/5 border border-dashed border-primary/30 flex items-center justify-between"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const currIdx = activePipeline.findIndex(p => p.id === col.id);
                                    if (currIdx !== -1 && currIdx + 1 < activePipeline.length) {
                                      handleAdvanceStatus(b, activePipeline[currIdx + 1].id);
                                    }
                                  }}
                                >
                                  <span>Move to next stage</span>
                                  <ChevronRight className="w-3 h-3" />
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
            </div>
          ) : (
            /* TABLE VIEW */
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Service Category</TableHead>
                    <TableHead>Service Title</TableHead>
                    <TableHead>Guest & Unit</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Current Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground text-xs">
                        No service bookings match your search.
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
                        <TableCell className="font-semibold text-xs">{booking.vendorName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                            {booking.category}
                          </Badge>
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
                          <div className="space-y-1">
                            <Badge variant="secondary" className="text-[10px] font-semibold">
                              {booking.status}
                            </Badge>
                            {booking.category === 'House Keeping' && !booking.strConfirmed && (
                              <span className="block text-[9px] text-amber-600 font-bold">Awaiting STR Admin Approval</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-xs">{booking.costDisplay}</TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-1.5">
                            {booking.category === 'House Keeping' && !booking.strConfirmed && (
                              <Button 
                                size="sm" 
                                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={(e) => handleConfirmSTRHousekeeping(booking.id, e)}
                              >
                                Approve STR
                              </Button>
                            )}

                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 gap-1 text-xs border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                              onClick={(e) => handleOpenRaiseException(booking, e)}
                            >
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              <span>Exception</span>
                            </Button>

                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10"
                              onClick={() => handleOpenComms(booking)}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Chat / Invoice</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
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
                    Once submitted, the guest receives an in-app prompt on their mobile app to approve or decline the new price of AED {parseFloat(proposedPrice) || 0}.
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