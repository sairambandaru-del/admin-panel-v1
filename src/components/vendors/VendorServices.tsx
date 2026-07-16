"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  ClipboardList, 
  CreditCard, 
  AlertCircle, 
  MessageSquare, 
  HelpCircle,
  Check,
  X,
  TrendingUp,
  Search,
  Download,
  Eye,
  Calendar,
  User,
  Mail,
  Phone,
  Clock,
  Tag,
  FileText
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const categories = [
  { id: 'all', label: 'All Categories' },
  { id: 'str', label: 'Short Term Rentals' },
  { id: 'leisure', label: 'Leisure Activities' },
  { id: 'car', label: 'Car Rentals' },
  { id: 'housekeeping', label: 'House Keeping' },
  { id: 'laundry', label: 'Laundry' },
  { id: 'food', label: 'Food Delivery' },
  { id: 'dining', label: 'Dining' },
  { id: 'doctor', label: 'Doctor on Call' },
  { id: 'transport', label: 'Transportation' },
  { id: 'coworking', label: 'Co-working Spaces' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'grocery', label: 'Grocery' },
  { id: 'chef', label: 'Chef on Call' },
  { id: 'catering', label: 'In House Catering' },
];

interface Booking {
  id: string;
  vendor: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  serviceCategory: string;
  serviceName: string;
  bookingDate: string;
  startDate: string;
  endDate: string;
  status: 'Completed' | 'Confirmed' | 'Pending' | 'Cancelled';
  amount: number;
}

const initialBookings: Booking[] = [
  {
    id: 'BK-9921',
    vendor: 'Elite Housekeeping',
    guestName: 'Alice Brown',
    guestPhone: '+1 (555) 019-2834',
    guestEmail: 'alice.brown@example.com',
    serviceCategory: 'housekeeping',
    serviceName: 'Deep Cleaning Service',
    bookingDate: '2024-05-12 10:30 AM',
    startDate: '2024-05-15 09:00 AM',
    endDate: '2024-05-15 01:00 PM',
    status: 'Completed',
    amount: 120.00
  },
  {
    id: 'BK-9918',
    vendor: 'Swift Car Rentals',
    guestName: 'Mark Wilson',
    guestPhone: '+1 (555) 024-9911',
    guestEmail: 'mark.wilson@example.com',
    serviceCategory: 'car',
    serviceName: 'Premium SUV Rental',
    bookingDate: '2024-05-11 02:15 PM',
    startDate: '2024-05-14 08:00 AM',
    endDate: '2024-05-17 06:00 PM',
    status: 'Confirmed',
    amount: 450.00
  },
  {
    id: 'BK-9930',
    vendor: 'Gourmet Catering Co',
    guestName: 'Sarah Jenkins',
    guestPhone: '+1 (555) 088-1234',
    guestEmail: 'sarah.j@example.com',
    serviceCategory: 'catering',
    serviceName: 'In-House Buffet Dinner',
    bookingDate: '2024-05-13 09:00 AM',
    startDate: '2024-05-18 06:00 PM',
    endDate: '2024-05-18 10:00 PM',
    status: 'Pending',
    amount: 850.00
  },
  {
    id: 'BK-9945',
    vendor: 'Wellness Retreats',
    guestName: 'David Miller',
    guestPhone: '+1 (555) 077-5678',
    guestEmail: 'david.m@example.com',
    serviceCategory: 'wellness',
    serviceName: 'Full Body Massage & Spa',
    bookingDate: '2024-05-14 11:00 AM',
    startDate: '2024-05-16 02:00 PM',
    endDate: '2024-05-16 04:00 PM',
    status: 'Confirmed',
    amount: 180.00
  },
  {
    id: 'BK-9950',
    vendor: 'Skyline Apartments',
    guestName: 'Emma Watson',
    guestPhone: '+1 (555) 044-8822',
    guestEmail: 'emma.w@example.com',
    serviceCategory: 'str',
    serviceName: 'Luxury Penthouse Stay',
    bookingDate: '2024-05-10 04:30 PM',
    startDate: '2024-05-20 03:00 PM',
    endDate: '2024-05-25 11:00 AM',
    status: 'Confirmed',
    amount: 1250.00
  },
  {
    id: 'BK-9962',
    vendor: 'Swift Car Rentals',
    guestName: 'James Smith',
    guestPhone: '+1 (555) 011-2233',
    guestEmail: 'james.smith@example.com',
    serviceCategory: 'car',
    serviceName: 'Sedan Airport Transfer',
    bookingDate: '2024-05-12 08:00 AM',
    startDate: '2024-05-13 05:00 AM',
    endDate: '2024-05-13 06:30 AM',
    status: 'Cancelled',
    amount: 75.00
  }
];

const VendorServices = () => {
  const [category, setCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [enquiries, setEnquiries] = useState([
    { id: 'ENQ-101', vendor: 'Elite Housekeeping', guest: 'Alice Brown', service: 'Deep Cleaning', date: '2024-05-22', status: 'Pending' },
    { id: 'ENQ-102', vendor: 'Swift Car Rentals', guest: 'Mark Wilson', service: 'Airport Transfer', date: '2024-05-23', status: 'Pending' },
  ]);

  const handleEnquiry = (id: string, action: 'Accepted' | 'Rejected') => {
    setEnquiries(prev => prev.map(enq => enq.id === id ? { ...enq, status: action } : enq));
    if (action === 'Accepted') showSuccess(`Enquiry ${id} accepted.`);
    else showError(`Enquiry ${id} rejected.`);
  };

  // Smart Search & Filter Logic
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      // Category Filter
      const matchesCategory = category === 'all' || booking.serviceCategory === category;
      
      // Status Filter
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

      // Smart Search (matches any field value)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        booking.id.toLowerCase().includes(searchLower) ||
        booking.guestName.toLowerCase().includes(searchLower) ||
        booking.guestEmail.toLowerCase().includes(searchLower) ||
        booking.guestPhone.toLowerCase().includes(searchLower) ||
        booking.serviceName.toLowerCase().includes(searchLower) ||
        booking.vendor.toLowerCase().includes(searchLower) ||
        booking.status.toLowerCase().includes(searchLower) ||
        categories.find(c => c.id === booking.serviceCategory)?.label.toLowerCase().includes(searchLower);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [bookings, category, statusFilter, searchQuery]);

  const handleDownloadInvoice = (booking: Booking) => {
    showSuccess(`Downloading invoice for booking ${booking.id}...`);
  };

  const handleDownloadAllBookings = () => {
    showSuccess("Exporting and downloading all bookings as CSV...");
  };

  return (
    <div className="space-y-6">
      {/* Category Selector Header */}
      <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold">Service Category</h3>
            <p className="text-xs text-muted-foreground">Select a category to manage vendor operations</p>
          </div>
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="bookings" className="gap-2"><ClipboardList className="w-4 h-4" /> Bookings</TabsTrigger>
          <TabsTrigger value="payouts" className="gap-2"><CreditCard className="w-4 h-4" /> Payouts</TabsTrigger>
          <TabsTrigger value="disputes" className="gap-2"><AlertCircle className="w-4 h-4" /> Disputes</TabsTrigger>
          <TabsTrigger value="escalations" className="gap-2"><MessageSquare className="w-4 h-4" /> Escalations</TabsTrigger>
          <TabsTrigger value="enquiries" className="gap-2"><HelpCircle className="w-4 h-4" /> Enquiries</TabsTrigger>
        </TabsList>

        {/* Bookings Tab Content */}
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Bookings Report - {categories.find(c => c.id === category)?.label}</CardTitle>
                  <CardDescription>View, search, and manage all guest bookings and download invoices.</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] h-9 text-xs">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Download All Button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 gap-2 text-xs"
                    onClick={handleDownloadAllBookings}
                  >
                    <Download className="w-4 h-4" /> Download All
                  </Button>
                </div>
              </div>

              {/* Smart Search Bar */}
              <div className="relative mt-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Smart search bookings (e.g. guest name, email, phone, booking ID, service...)" 
                  className="pl-9 h-9 text-xs" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Booking ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Guest Name</TableHead>
                      <TableHead>Contact Number</TableHead>
                      <TableHead>Email ID</TableHead>
                      <TableHead>Service Category</TableHead>
                      <TableHead>Booking Date</TableHead>
                      <TableHead>Start Date & Time</TableHead>
                      <TableHead>End Date & Time</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow 
                        key={booking.id} 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <TableCell className="font-mono text-xs font-bold text-primary">
                          {booking.id}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            booking.status === 'Completed' ? 'default' :
                            booking.status === 'Confirmed' ? 'secondary' :
                            booking.status === 'Pending' ? 'outline' : 'destructive'
                          }>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-xs">{booking.guestName}</TableCell>
                        <TableCell className="text-xs">{booking.guestPhone}</TableCell>
                        <TableCell className="text-xs">{booking.guestEmail}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize text-[10px]">
                            {categories.find(c => c.id === booking.serviceCategory)?.label || booking.serviceCategory}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs whitespace-nowrap">{booking.bookingDate}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap">{booking.startDate}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap">{booking.endDate}</TableCell>
                        <TableCell className="text-right font-bold text-xs">AED {booking.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-primary"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredBookings.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={11} className="h-32 text-center text-muted-foreground">
                          No bookings found matching the search or filter criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Booking Breakdown Side Drawer / Modal Overlay */}
          {selectedBooking && (
            <div className="fixed inset-0 bg-black/50 z-50 flex justify-end animate-in fade-in duration-200">
              <div className="bg-background w-full max-w-lg h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Drawer Header */}
                <div className="p-6 border-b flex items-center justify-between bg-muted/20">
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Booking Breakdown
                    </h3>
                    <p className="text-xs text-muted-foreground">ID: {selectedBooking.id}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full" 
                    onClick={() => setSelectedBooking(null)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Drawer Content / Invoice Preview */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Invoice Header */}
                  <div className="border p-4 rounded-xl bg-card space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Invoice Preview</h4>
                        <p className="text-[10px] text-muted-foreground">Generated on {selectedBooking.bookingDate}</p>
                      </div>
                      <Badge variant={
                        selectedBooking.status === 'Completed' ? 'default' :
                        selectedBooking.status === 'Confirmed' ? 'secondary' :
                        selectedBooking.status === 'Pending' ? 'outline' : 'destructive'
                      }>
                        {selectedBooking.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t text-xs">
                      <div>
                        <p className="text-muted-foreground font-medium">Vendor</p>
                        <p className="font-semibold">{selectedBooking.vendor}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium">Service Category</p>
                        <p className="font-semibold capitalize">
                          {categories.find(c => c.id === selectedBooking.serviceCategory)?.label}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Guest Details Section */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                      Guest Details
                    </h4>
                    <div className="border rounded-xl p-4 space-y-3 bg-card text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Full Name:</span>
                        <span className="font-semibold">{selectedBooking.guestName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Contact Number:</span>
                        <span className="font-semibold">{selectedBooking.guestPhone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Email Address:</span>
                        <span className="font-semibold">{selectedBooking.guestEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Schedule Section */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      Schedule & Timestamps
                    </h4>
                    <div className="border rounded-xl p-4 space-y-3 bg-card text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-muted-foreground flex items-center gap-1 shrink-0">
                          <Clock className="w-3.5 h-3.5" /> Start Date & Time:
                        </span>
                        <span className="font-semibold text-right">{selectedBooking.startDate}</span>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-muted-foreground flex items-center gap-1 shrink-0">
                          <Clock className="w-3.5 h-3.5" /> End Date & Time:
                        </span>
                        <span className="font-semibold text-right">{selectedBooking.endDate}</span>
                      </div>
                      <div className="flex items-start justify-between gap-2 pt-2 border-t">
                        <span className="text-muted-foreground flex items-center gap-1 shrink-0">
                          <Tag className="w-3.5 h-3.5" /> Service Booked:
                        </span>
                        <span className="font-semibold text-right text-primary">{selectedBooking.serviceName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pricing Summary</h4>
                    <div className="border rounded-xl p-4 bg-card text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>AED {(selectedBooking.amount * 0.9).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Fee (10%)</span>
                        <span>AED {(selectedBooking.amount * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t font-bold text-sm text-primary">
                        <span>Total Amount</span>
                        <span>AED {selectedBooking.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="p-6 border-t bg-muted/10 flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setSelectedBooking(null)}
                  >
                    Close
                  </Button>
                  <Button 
                    className="flex-1 gap-2" 
                    onClick={() => handleDownloadInvoice(selectedBooking)}
                  >
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Payout ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-xs font-medium">Elite Housekeeping</TableCell>
                      <TableCell className="font-bold">PAY-882</TableCell>
                      <TableCell>2024-05-01</TableCell>
                      <TableCell>Bank Transfer</TableCell>
                      <TableCell><Badge>Completed</Badge></TableCell>
                      <TableCell className="text-right font-bold">AED 2,450.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes">
          <Card>
            <CardHeader>
              <CardTitle>Refunds & Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                <p>No active disputes for this category.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalations">
          <Card>
            <CardHeader>
              <CardTitle>Active Escalations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-xs font-medium">Gourmet Catering Co</TableCell>
                      <TableCell className="font-bold">ESC-004</TableCell>
                      <TableCell>Service Delay Complaint</TableCell>
                      <TableCell><Badge variant="destructive">High</Badge></TableCell>
                      <TableCell>Under Investigation</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enquiries">
          <Card>
            <CardHeader>
              <CardTitle>Service Enquiries</CardTitle>
              <CardDescription>Manage incoming requests from guests and corporate accounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Enquiry ID</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Service Requested</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enquiries.map((enq) => (
                      <TableRow key={enq.id}>
                        <TableCell className="text-xs font-medium">{enq.vendor}</TableCell>
                        <TableCell className="font-bold">{enq.id}</TableCell>
                        <TableCell>{enq.guest}</TableCell>
                        <TableCell>{enq.service}</TableCell>
                        <TableCell>{enq.date}</TableCell>
                        <TableCell>
                          <Badge variant={
                            enq.status === 'Accepted' ? 'default' : 
                            enq.status === 'Rejected' ? 'destructive' : 'secondary'
                          }>
                            {enq.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {enq.status === 'Pending' && (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 text-green-600"
                                onClick={() => handleEnquiry(enq.id, 'Accepted')}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 text-red-600"
                                onClick={() => handleEnquiry(enq.id, 'Rejected')}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorServices;