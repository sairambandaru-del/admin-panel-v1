"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Download, 
  Filter, 
  Search, 
  Calendar as CalendarIcon, 
  Building2, 
  User, 
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  Eye
} from 'lucide-react';
import GuestCommunicationModal, { BookingCommsData } from '@/components/common/GuestCommunicationModal';

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  propertyName: string;
  category: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled' | 'In Progress';
  amount: string;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
}

const mockBookings: Booking[] = [
  {
    id: "BK-9021",
    guestName: "Alexander Wright",
    guestEmail: "a.wright@techcorp.com",
    propertyName: "Downtown Luxury Suite 402",
    category: "Short Term Rentals",
    checkIn: "2024-05-20",
    checkOut: "2024-05-25",
    status: "In Progress",
    amount: "AED 4,250",
    paymentStatus: "Paid"
  },
  {
    id: "BK-9022",
    guestName: "Sarah Jenkins",
    guestEmail: "s.jenkins@innovate.io",
    propertyName: "Marina Bay Penthouse 12B",
    category: "Short Term Rentals",
    checkIn: "2024-05-22",
    checkOut: "2024-05-28",
    status: "Confirmed",
    amount: "AED 8,900",
    paymentStatus: "Paid"
  },
  {
    id: "BK-9023",
    guestName: "Michael Chen",
    guestEmail: "m.chen@globalfinance.com",
    propertyName: "Palm Jumeirah Villa 05",
    category: "Short Term Rentals",
    checkIn: "2024-05-15",
    checkOut: "2024-05-18",
    status: "Completed",
    amount: "AED 12,500",
    paymentStatus: "Paid"
  },
  {
    id: "BK-9024",
    guestName: "Emma Watson",
    guestEmail: "e.watson@creative.co",
    propertyName: "Executive Chauffeur Service - S Class",
    category: "Car Rentals",
    checkIn: "2024-05-21",
    checkOut: "2024-05-22",
    status: "Confirmed",
    amount: "AED 1,800",
    paymentStatus: "Paid"
  },
  {
    id: "BK-9025",
    guestName: "David Miller",
    guestEmail: "d.miller@enterprises.org",
    propertyName: "Full Unit Deep Clean & Refresh",
    category: "House Keeping",
    checkIn: "2024-05-20",
    checkOut: "2024-05-20",
    status: "Completed",
    amount: "AED 450",
    paymentStatus: "Paid"
  },
  {
    id: "BK-9026",
    guestName: "Elena Rostova",
    guestEmail: "elena@designstudio.com",
    propertyName: "Express Dry Cleaning & Laundry",
    category: "Laundry",
    checkIn: "2024-05-21",
    checkOut: "2024-05-21",
    status: "In Progress",
    amount: "AED 220",
    paymentStatus: "Paid"
  },
  {
    id: "BK-9027",
    guestName: "Robert Taylor",
    guestEmail: "rtaylor@apex.com",
    propertyName: "Gourmet Dinner Catering (4 Persons)",
    category: "In House Catering",
    checkIn: "2024-05-23",
    checkOut: "2024-05-23",
    status: "Confirmed",
    amount: "AED 2,400",
    paymentStatus: "Paid"
  },
  {
    id: "BK-9028",
    guestName: "Sophia Martinez",
    guestEmail: "sophia@globaltech.com",
    propertyName: "In-Suite Full Body Massage",
    category: "Wellness",
    checkIn: "2024-05-24",
    checkOut: "2024-05-24",
    status: "Confirmed",
    amount: "AED 650",
    paymentStatus: "Paid"
  }
];

const BookingReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBookingForComms, setSelectedBookingForComms] = useState<BookingCommsData | null>(null);
  const [isCommsOpen, setIsCommsOpen] = useState(false);

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || booking.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenComms = (booking: Booking) => {
    setSelectedBookingForComms({
      id: booking.id,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      propertyName: booking.propertyName,
      serviceCategory: booking.category,
      dates: `${booking.checkIn} to ${booking.checkOut}`,
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
            <CardTitle className="text-xs font-medium">Total Bookings</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBookings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Active / In Progress</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockBookings.filter(b => b.status === 'In Progress' || b.status === 'Confirmed').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requires active service</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Completed Bookings</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockBookings.filter(b => b.status === 'Completed').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Fulfilled this period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Total Booking Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED 31,120</div>
            <p className="text-xs text-muted-foreground mt-1">Gross revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Booking Reports & Logs</CardTitle>
              <CardDescription>
                Detailed overview of reservations and service orders across all categories. Click any booking to view guest communications.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 h-8">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search guest, ID, property..."
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
                <SelectItem value="Short Term Rentals">Short Term Rentals</SelectItem>
                <SelectItem value="Car Rentals">Car Rentals</SelectItem>
                <SelectItem value="House Keeping">House Keeping</SelectItem>
                <SelectItem value="Laundry">Laundry</SelectItem>
                <SelectItem value="In House Catering">In House Catering</SelectItem>
                <SelectItem value="Wellness">Wellness</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] h-9 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
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
                <TableHead>Guest</TableHead>
                <TableHead>Property / Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Guest Communication</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-xs">
                    No bookings match your current search and filter criteria.
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
                        <p className="font-semibold text-xs">{booking.guestName}</p>
                        <p className="text-[10px] text-muted-foreground">{booking.guestEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium max-w-[200px] truncate">
                      {booking.propertyName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] bg-primary/5 border-primary/20">
                        {booking.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {booking.checkIn} <span className="text-muted-foreground">to</span> {booking.checkOut}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        booking.status === 'Completed' ? 'default' :
                        booking.status === 'Confirmed' ? 'secondary' :
                        booking.status === 'In Progress' ? 'outline' : 'destructive'
                      } className={booking.status === 'In Progress' ? 'bg-amber-100 text-amber-800 border-amber-300' : ''}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-xs">{booking.amount}</TableCell>
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

export default BookingReport;