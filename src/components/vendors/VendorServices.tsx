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
  FileText,
  CheckCircle,
  LayoutGrid,
  List,
  ChevronRight
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { getStatusBadge, LAUNDRY_STATUSES } from '../inventory/BookingReport';

const categories = [
  { id: 'all', label: 'All Categories' },
  { id: 'Short Term Rentals', label: 'Short Term Rentals' },
  { id: 'Car Rentals', label: 'Car Rentals' },
  { id: 'House Keeping', label: 'House Keeping' },
  { id: 'Laundry', label: 'Laundry' },
  { id: 'Food Delivery', label: 'Food Delivery' },
  { id: 'Grocery', label: 'Grocery' },
  { id: 'Doctor on Call', label: 'Doctor on Call' },
  { id: 'In House Catering', label: 'In House Catering' },
  { id: 'Wellness', label: 'Wellness' },
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
  status: string;
  amount: number;
}

const initialBookings: Booking[] = [
  // Short Term Rentals (Skyline Apartments & Urban Oasis Stays)
  // Statuses: Enquiry, Confirmed, Checked in, Checked out, Cancelled
  { id: 'BK-5501', vendor: 'Skyline Apartments', guestName: 'Robert Fox', guestPhone: '+1 (555) 234-5678', guestEmail: 'robert.fox@gmail.com', serviceCategory: 'Short Term Rentals', serviceName: 'Skyline Suite 101', bookingDate: '2024-04-15', startDate: '2024-05-02 14:00', endDate: '2024-05-05 11:00', status: 'Checked out', amount: 750.00 },
  { id: 'BK-5502', vendor: 'Urban Oasis Stays', guestName: 'Jane Cooper', guestPhone: '+1 (555) 876-5432', guestEmail: 'jane.cooper@yahoo.com', serviceCategory: 'Short Term Rentals', serviceName: 'Urban Oasis Loft 3B', bookingDate: '2024-04-16', startDate: '2024-05-03 14:00', endDate: '2024-05-06 11:00', status: 'Checked out', amount: 850.00 },
  { id: 'BK-5503', vendor: 'Skyline Apartments', guestName: 'Michael Jordan', guestPhone: '+1 (555) 230-9944', guestEmail: 'mj23@bulls.com', serviceCategory: 'Short Term Rentals', serviceName: 'Skyline Suite 102', bookingDate: '2024-05-10', startDate: '2024-05-25 15:00', endDate: '2024-05-30 10:00', status: 'Confirmed', amount: 1250.00 },
  { id: 'BK-5504', vendor: 'Urban Oasis Stays', guestName: 'Serena Williams', guestPhone: '+1 (555) 444-8811', guestEmail: 'serena@tennis.com', serviceCategory: 'Short Term Rentals', serviceName: 'Urban Oasis Loft 4A', bookingDate: '2024-05-11', startDate: '2024-05-26 15:00', endDate: '2024-05-29 10:00', status: 'Confirmed', amount: 1100.00 },
  { id: 'BK-5505', vendor: 'Skyline Apartments', guestName: 'Tony Stark', guestPhone: '+1 (555) 300-4000', guestEmail: 'tony@starkindustries.com', serviceCategory: 'Short Term Rentals', serviceName: 'Skyline Penthouse', bookingDate: '2024-05-15', startDate: '2024-05-20 14:00', endDate: '2024-05-24 11:00', status: 'Checked in', amount: 2500.00 },
  { id: 'BK-5506', vendor: 'Urban Oasis Stays', guestName: 'Bruce Wayne', guestPhone: '+1 (555) 111-2222', guestEmail: 'bruce@waynecorp.com', serviceCategory: 'Short Term Rentals', serviceName: 'Urban Oasis Villa', bookingDate: '2024-05-16', startDate: '2024-05-21 14:00', endDate: '2024-05-25 11:00', status: 'Checked in', amount: 2200.00 },
  { id: 'BK-5507', vendor: 'Skyline Apartments', guestName: 'Peter Parker', guestPhone: '+1 (555) 123-4567', guestEmail: 'peter.parker@dailybugle.com', serviceCategory: 'Short Term Rentals', serviceName: 'Skyline Suite 101', bookingDate: '2024-05-18', startDate: '2024-06-01 14:00', endDate: '2024-06-05 11:00', status: 'Enquiry', amount: 600.00 },
  { id: 'BK-5508', vendor: 'Urban Oasis Stays', guestName: 'Clark Kent', guestPhone: '+1 (555) 987-6543', guestEmail: 'clark.kent@dailyplanet.com', serviceCategory: 'Short Term Rentals', serviceName: 'Urban Oasis Loft 3B', bookingDate: '2024-05-19', startDate: '2024-06-02 14:00', endDate: '2024-06-06 11:00', status: 'Enquiry', amount: 550.00 },
  { id: 'BK-5509', vendor: 'Skyline Apartments', guestName: 'Diana Prince', guestPhone: '+1 (555) 555-1941', guestEmail: 'diana@themyscira.gov', serviceCategory: 'Short Term Rentals', serviceName: 'Skyline Suite 102', bookingDate: '2024-05-01', startDate: '2024-05-15 14:00', endDate: '2024-05-18 11:00', status: 'Cancelled', amount: 900.00 },
  { id: 'BK-5510', vendor: 'Urban Oasis Stays', guestName: 'Barry Allen', guestPhone: '+1 (555) 321-3211', guestEmail: 'barry@centralcitypd.gov', serviceCategory: 'Short Term Rentals', serviceName: 'Urban Oasis Loft 4A', bookingDate: '2024-05-02', startDate: '2024-05-16 14:00', endDate: '2024-05-19 11:00', status: 'Cancelled', amount: 800.00 },

  // House Keeping (Elite Housekeeping & Sparkle Cleaners)
  // Statuses: Enquiry, Confirmed, Scheduled, In progressed, Completed, Cancelled
  { id: 'BK-5511', vendor: 'Elite Housekeeping', guestName: 'Alice Brown', guestPhone: '+1 (555) 019-2834', guestEmail: 'alice.b@gmail.com', serviceCategory: 'House Keeping', serviceName: 'Deep Cleaning Service', bookingDate: '2024-05-08', startDate: '2024-05-10 09:00', endDate: '2024-05-10 12:00', status: 'Completed', amount: 150.00 },
  { id: 'BK-5512', vendor: 'Sparkle Cleaners', guestName: 'Mark Wilson', guestPhone: '+1 (555) 024-9911', guestEmail: 'mark.w@gmail.com', serviceCategory: 'House Keeping', serviceName: 'Standard Turn-down Service', bookingDate: '2024-05-09', startDate: '2024-05-11 09:00', endDate: '2024-05-11 12:00', status: 'Completed', amount: 150.00 },
  { id: 'BK-5513', vendor: 'Elite Housekeeping', guestName: 'Sarah Jenkins', guestPhone: '+1 (555) 088-1234', guestEmail: 'sarah.j@gmail.com', serviceCategory: 'House Keeping', serviceName: 'Deep Cleaning Service', bookingDate: '2024-05-18', startDate: '2024-05-22 09:00', endDate: '2024-05-22 12:00', status: 'Enquiry', amount: 150.00 },
  { id: 'BK-5514', vendor: 'Sparkle Cleaners', guestName: 'David Miller', guestPhone: '+1 (555) 077-5678', guestEmail: 'david.m@gmail.com', serviceCategory: 'House Keeping', serviceName: 'Standard Turn-down Service', bookingDate: '2024-05-19', startDate: '2024-05-23 09:00', endDate: '2024-05-23 12:00', status: 'Enquiry', amount: 120.00 },
  { id: 'BK-5515', vendor: 'Elite Housekeeping', guestName: 'Emma Watson', guestPhone: '+1 (555) 044-8822', guestEmail: 'emma.w@example.com', serviceCategory: 'House Keeping', serviceName: 'Post-Party Deep Clean', bookingDate: '2024-05-20', startDate: '2024-05-24 10:00', endDate: '2024-05-24 13:00', status: 'Confirmed', amount: 180.00 },
  { id: 'BK-5516', vendor: 'Sparkle Cleaners', guestName: 'Amelie Poulain', guestPhone: '+1 (555) 333-4444', guestEmail: 'amelie@montmartre.fr', serviceCategory: 'House Keeping', serviceName: 'Weekly Express Clean', bookingDate: '2024-05-21', startDate: '2024-05-25 10:00', endDate: '2024-05-25 13:00', status: 'Confirmed', amount: 180.00 },
  { id: 'BK-5517', vendor: 'Elite Housekeeping', guestName: 'Sherlock Holmes', guestPhone: '+1 (555) 221-221B', guestEmail: 'sherlock@bakerstreet.co.uk', serviceCategory: 'House Keeping', serviceName: 'Deep Cleaning Service', bookingDate: '2024-05-22', startDate: '2024-05-26 09:00', endDate: '2024-05-26 12:00', status: 'Scheduled', amount: 150.00 },
  { id: 'BK-5518', vendor: 'Sparkle Cleaners', guestName: 'John Watson', guestPhone: '+1 (555) 221-221C', guestEmail: 'watson@bakerstreet.co.uk', serviceCategory: 'House Keeping', serviceName: 'Standard Turn-down Service', bookingDate: '2024-05-23', startDate: '2024-05-27 09:00', endDate: '2024-05-27 12:00', status: 'Scheduled', amount: 120.00 },
  { id: 'BK-5519', vendor: 'Elite Housekeeping', guestName: 'Peter Parker', guestPhone: '+1 (555) 123-4567', guestEmail: 'peter.parker@dailybugle.com', serviceCategory: 'House Keeping', serviceName: 'Post-Party Deep Clean', bookingDate: '2024-05-20', startDate: '2024-05-21 08:00', endDate: '2024-05-21 11:00', status: 'In progressed', amount: 200.00 },
  { id: 'BK-5520', vendor: 'Sparkle Cleaners', guestName: 'Clark Kent', guestPhone: '+1 (555) 987-6543', guestEmail: 'clark.kent@dailyplanet.com', serviceCategory: 'House Keeping', serviceName: 'Weekly Express Clean', bookingDate: '2024-05-20', startDate: '2024-05-21 09:00', endDate: '2024-05-21 12:00', status: 'In progressed', amount: 180.00 },
  { id: 'BK-5521', vendor: 'Elite Housekeeping', guestName: 'Diana Prince', guestPhone: '+1 (555) 555-1941', guestEmail: 'diana@themyscira.gov', serviceCategory: 'House Keeping', serviceName: 'Deep Cleaning Service', bookingDate: '2024-05-15', startDate: '2024-05-18 09:00', endDate: '2024-05-18 12:00', status: 'Cancelled', amount: 150.00 },
  { id: 'BK-5522', vendor: 'Sparkle Cleaners', guestName: 'Barry Allen', guestPhone: '+1 (555) 321-3211', guestEmail: 'barry@centralcitypd.gov', serviceCategory: 'House Keeping', serviceName: 'Standard Turn-down Service', bookingDate: '2024-05-16', startDate: '2024-05-19 09:00', endDate: '2024-05-19 12:00', status: 'Cancelled', amount: 120.00 },

  // Car Rentals (Swift Car Rentals & Apex Luxury Fleet)
  // Statuses: Enquiry, Confirmed, In progress, Completed, Cancelled
  { id: 'BK-5523', vendor: 'Swift Car Rentals', guestName: 'Robert Fox', guestPhone: '+1 (555) 234-5678', guestEmail: 'robert.fox@gmail.com', serviceCategory: 'Car Rentals', serviceName: 'Tesla Model 3', bookingDate: '2024-05-05', startDate: '2024-05-10 08:00', endDate: '2024-05-12 18:00', status: 'Completed', amount: 300.00 },
  { id: 'BK-5524', vendor: 'Apex Luxury Fleet', guestName: 'Jane Cooper', guestPhone: '+1 (555) 876-5432', guestEmail: 'jane.cooper@yahoo.com', serviceCategory: 'Car Rentals', serviceName: 'Premium SUV', bookingDate: '2024-05-06', startDate: '2024-05-11 08:00', endDate: '2024-05-13 18:00', status: 'Completed', amount: 400.00 },
  { id: 'BK-5525', vendor: 'Swift Car Rentals', guestName: 'Michael Jordan', guestPhone: '+1 (555) 230-9944', guestEmail: 'mj23@bulls.com', serviceCategory: 'Car Rentals', serviceName: 'Tesla Model 3', bookingDate: '2024-05-20', startDate: '2024-05-25 08:00', endDate: '2024-05-28 18:00', status: 'Enquiry', amount: 450.00 },
  { id: 'BK-5526', vendor: 'Apex Luxury Fleet', guestName: 'Serena Williams', guestPhone: '+1 (555) 444-8811', guestEmail: 'serena@tennis.com', serviceCategory: 'Car Rentals', serviceName: 'Premium SUV', bookingDate: '2024-05-21', startDate: '2024-05-26 08:00', endDate: '2024-05-29 18:00', status: 'Enquiry', amount: 600.00 },
  { id: 'BK-5527', vendor: 'Swift Car Rentals', guestName: 'Tony Stark', guestPhone: '+1 (555) 300-4000', guestEmail: 'tony@starkindustries.com', serviceCategory: 'Car Rentals', serviceName: 'Aston Martin DB11', bookingDate: '2024-05-18', startDate: '2024-05-22 08:00', endDate: '2024-05-24 18:00', status: 'Confirmed', amount: 1500.00 },
  { id: 'BK-5528', vendor: 'Apex Luxury Fleet', guestName: 'Bruce Wayne', guestPhone: '+1 (555) 111-2222', guestEmail: 'bruce@waynecorp.com', serviceCategory: 'Car Rentals', serviceName: 'Mercedes S-Class', bookingDate: '2024-05-19', startDate: '2024-05-23 08:00', endDate: '2024-05-25 18:00', status: 'Confirmed', amount: 1200.00 },
  { id: 'BK-5529', vendor: 'Swift Car Rentals', guestName: 'Peter Parker', guestPhone: '+1 (555) 123-4567', guestEmail: 'peter.parker@dailybugle.com', serviceCategory: 'Car Rentals', serviceName: 'Tesla Model 3', bookingDate: '2024-05-15', startDate: '2024-05-20 08:00', endDate: '2024-05-23 18:00', status: 'In progress', amount: 350.00 },
  { id: 'BK-5530', vendor: 'Apex Luxury Fleet', guestName: 'Clark Kent', guestPhone: '+1 (555) 987-6543', guestEmail: 'clark.kent@dailyplanet.com', serviceCategory: 'Car Rentals', serviceName: 'Premium SUV', bookingDate: '2024-05-16', startDate: '2024-05-21 08:00', endDate: '2024-05-24 18:00', status: 'In progress', amount: 320.00 },
  { id: 'BK-5531', vendor: 'Swift Car Rentals', guestName: 'Diana Prince', guestPhone: '+1 (555) 555-1941', guestEmail: 'diana@themyscira.gov', serviceCategory: 'Car Rentals', serviceName: 'Tesla Model 3', bookingDate: '2024-05-10', startDate: '2024-05-15 08:00', endDate: '2024-05-17 18:00', status: 'Cancelled', amount: 450.00 },
  { id: 'BK-5532', vendor: 'Apex Luxury Fleet', guestName: 'Barry Allen', guestPhone: '+1 (555) 321-3211', guestEmail: 'barry@centralcitypd.gov', serviceCategory: 'Car Rentals', serviceName: 'Premium SUV', bookingDate: '2024-05-11', startDate: '2024-05-16 08:00', endDate: '2024-05-18 18:00', status: 'Cancelled', amount: 400.00 },

  // Laundry (Laundry Pros & Spin Cycle Dry Cleaners)
  // Statuses: order accepted, rider assigned, picked up, received at facility, under processing, quality check, out for delivery, delivered, exception raised, claim under review
  { id: 'BK-5533', vendor: 'Laundry Pros', guestName: 'Michael Jordan', guestPhone: '+1 (555) 230-9944', guestEmail: 'mj23@bulls.com', serviceCategory: 'Laundry', serviceName: 'Premium Dry Cleaning', bookingDate: '2024-05-20', startDate: '2024-05-21 08:00', endDate: '2024-05-23 17:00', status: 'order accepted', amount: 180.00 },
  { id: 'BK-5534', vendor: 'Spin Cycle Dry Cleaners', guestName: '<dyad-write path="src/components/inventory/BookingReport.tsx" description="Completing the standardized BookingReport component with the full bookings dataset.">
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
  ChevronRight,
  Shirt
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
  // Short Term Rentals (Skyline Apartments & Urban Oasis Stays)
  // Statuses: Enquiry, Confirmed, Checked in, Checked out, Cancelled
  { id: 'BK-5501', status: 'Checked out', startDate: '2024-05-02 14:00', endDate: '2024-05-05 11:00', bookingDate: '2024-04-15', guestName: 'Robert Fox', contactNumber: '+1 (555) 234-5678', emailId: 'robert.fox@gmail.com', serviceCategory: 'Short Term Rentals', amount: 750.00, unit: 'Skyline Suite 101' },
  { id: 'BK-5502', status: 'Checked out', startDate: '2024-05-03 14:00', endDate: '2024-05-06 11:00', bookingDate: '2024-04-16', guestName: 'Jane Cooper', contactNumber: '+1 (555) 876-5432', emailId: 'jane.cooper@yahoo.com', serviceCategory: 'Short Term Rentals', amount: 850.00, unit: 'Urban Oasis Loft 3B' },
  { id: 'BK-5503', status: 'Confirmed', startDate: '2024-05-25 15:00', endDate: '2024-05-30 10:00', bookingDate: '2024-05-10', guestName: 'Michael Jordan', contactNumber: '+1 (555) 230-9944', emailId: 'mj23@bulls.com', serviceCategory: 'Short Term Rentals', amount: 1250.00, unit: 'Skyline Suite 102' },
  { id: 'BK-5504', status: 'Confirmed', startDate: '2024-05-26 15:00', endDate: '2024-05-29 10:00', bookingDate: '2024-05-11', guestName: 'Serena Williams', contactNumber: '+1 (555) 444-8811', emailId: 'serena@tennis.com', serviceCategory: 'Short Term Rentals', amount: 1100.00, unit: 'Urban Oasis Loft 4A' },
  { id: 'BK-5505', status: 'Checked in', startDate: '2024-05-20 14:00', endDate: '2024-05-24 11:00', bookingDate: '2024-05-15', guestName: 'Tony Stark', contactNumber: '+1 (555) 300-4000', emailId: 'tony@starkindustries.com', serviceCategory: 'Short Term Rentals', amount: 2500.00, unit: 'Skyline Penthouse' },
  { id: 'BK-5506', status: 'Checked in', startDate: '2024-05-21 14:00', endDate: '2024-05-25 11:00', bookingDate: '2024-05-16', guestName: 'Bruce Wayne', contactNumber: '+1 (555) 111-2222', emailId: 'bruce@waynecorp.com', serviceCategory: 'Short Term Rentals', amount: 2200.00, unit: 'Urban Oasis Villa' },
  { id: 'BK-5507', status: 'Enquiry', startDate: '2024-06-01 14:00', endDate: '2024-06-05 11:00', bookingDate: '2024-05-18', guestName: 'Peter Parker', contactNumber: '+1 (555) 123-4567', emailId: 'peter.parker@dailybugle.com', serviceCategory: 'Short Term Rentals', amount: 600.00, unit: 'Skyline Suite 101' },
  { id: 'BK-5508', status: 'Enquiry', startDate: '2024-06-02 14:00', endDate: '2024-06-06 11:00', bookingDate: '2024-05-19', guestName: 'Clark Kent', contactNumber: '+1 (555) 987-6543', emailId: 'clark.kent@dailyplanet.com', serviceCategory: 'Short Term Rentals', amount: 550.00, unit: 'Urban Oasis Loft 3B' },
  { id: 'BK-5509', status: 'Cancelled', startDate: '2024-05-15 14:00', endDate: '2024-05-18 11:00', bookingDate: '2024-05-01', guestName: 'Diana Prince', contactNumber: '+1 (555) 555-1941', emailId: 'diana@themyscira.gov', serviceCategory: 'Short Term Rentals', amount: 900.00, unit: 'Skyline Suite 102' },
  { id: 'BK-5510', status: 'Cancelled', startDate: '2024-05-16 14:00', endDate: '2024-05-19 11:00', bookingDate: '2024-05-02', guestName: 'Barry Allen', contactNumber: '+1 (555) 321-3211', emailId: 'barry@centralcitypd.gov', serviceCategory: 'Short Term Rentals', amount: 800.00, unit: 'Urban Oasis Loft 4A' },

  // House Keeping (Elite Housekeeping & Sparkle Cleaners)
  // Statuses: Enquiry, Confirmed, Scheduled, In progressed, Completed, Cancelled
  { id: 'BK-5511', status: 'Completed', startDate: '2024-05-10 09:00', endDate: '2024-05-10 12:00', bookingDate: '2024-05-08', guestName: 'Alice Brown', contactNumber: '+1 (555) 019-2834', emailId: 'alice.b@gmail.com', serviceCategory: 'House Keeping', amount: 150.00, unit: 'Deep Cleaning Service' },
  { id: 'BK-5512', status: 'Completed', startDate: '2024-05-11 09:00', endDate: '2024-05-11 12:00', bookingDate: '2024-05-09', guestName: 'Mark Wilson', contactNumber: '+1 (555) 024-9911', emailId: 'mark.w@gmail.com', serviceCategory: 'House Keeping', amount: 150.00, unit: 'Standard Turn-down Service' },
  { id: 'BK-5513', status: 'Enquiry', startDate: '2024-05-22 09:00', endDate: '2024-05-22 12:00', bookingDate: '2024-05-18', guestName: 'Sarah Jenkins', contactNumber: '+1 (555) 088-1234', emailId: 'sarah.j@gmail.com', serviceCategory: 'House Keeping', amount: 150.00, unit: 'Deep Cleaning Service' },
  { id: 'BK-5514', status: 'Enquiry', startDate: '2024-05-23 09:00', endDate: '2024-05-23 12:00', bookingDate: '2024-05-19', guestName: 'David Miller', contactNumber: '+1 (555) 077-5678', emailId: 'david.m@gmail.com', serviceCategory: 'House Keeping', amount: 120.00, unit: 'Standard Turn-down Service' },
  { id: 'BK-5515', status: 'Confirmed', startDate: '2024-05-24 10:00', endDate: '2024-05-24 13:00', bookingDate: '2024-05-20', guestName: 'Emma Watson', contactNumber: '+1 (555) 044-8822', emailId: 'emma.w@example.com', serviceCategory: 'House Keeping', amount: 180.00, unit: 'Post-Party Deep Clean' },
  { id: 'BK-5516', status: 'Confirmed', startDate: '2024-05-25 10:00', endDate: '2024-05-25 13:00', bookingDate: '2024-05-21', guestName: 'Amelie Poulain', contactNumber: '+1 (555) 333-4444', emailId: 'amelie@montmartre.fr', serviceCategory: 'House Keeping', amount: 180.00, unit: 'Weekly Express Clean' },
  { id: 'BK-5517', status: 'Scheduled', startDate: '2024-05-26 09:00', endDate: '2024-05-26 12:00', bookingDate: '2024-05-22', guestName: 'Sherlock Holmes', contactNumber: '+1 (555) 221-221B', emailId: 'sherlock@bakerstreet.co.uk', serviceCategory: 'House Keeping', amount: 150.00, unit: 'Deep Cleaning Service' },
  { id: 'BK-5518', status: 'Scheduled', startDate: '2024-05-27 09:00', endDate: '2024-05-27 12:00', bookingDate: '2024-05-23', guestName: 'John Watson', contactNumber: '+1 (555) 221-221C', emailId: 'watson@bakerstreet.co.uk', serviceCategory: 'House Keeping', amount: 120.00, unit: 'Standard Turn-down Service' },
  { id: 'BK-5519', status: 'In progressed', startDate: '2024-05-21 08:00', endDate: '2024-05-21 11:00', bookingDate: '2024-05-20', guestName: 'Peter Parker', contactNumber: '+1 (555) 123-4567', emailId: 'peter.parker@dailybugle.com', serviceCategory: 'House Keeping', amount: 200.00, unit: 'Post-Party Deep Clean' },
  { id: 'BK-5520', status: 'In progressed', startDate: '2024-05-21 09:00', endDate: '2024-05-21 12:00', bookingDate: '2024-05-20', guestName: 'Clark Kent', contactNumber: '+1 (555) 987-6543', emailId: 'clark.kent@dailyplanet.com', serviceCategory: 'House Keeping', amount: 180.00, unit: 'Weekly Express Clean' },
  { id: 'BK-5521', status: 'Cancelled', startDate: '2024-05-18 09:00', endDate: '2024-05-18 12:00', bookingDate: '2024-05-15', guestName: 'Diana Prince', contactNumber: '+1 (555) 555-1941', emailId: 'diana@themyscira.gov', serviceCategory: 'House Keeping', amount: 150.00, unit: 'Deep Cleaning Service' },
  { id: 'BK-5522', status: 'Cancelled', startDate: '2024-05-19 09:00', endDate: '2024-05-19 12:00', bookingDate: '2024-05-16', guestName: 'Barry Allen', contactNumber: '+1 (555) 321-3211', emailId: 'barry@centralcitypd.gov', serviceCategory: 'House Keeping', amount: 120.00, unit: 'Standard Turn-down Service' },

  // Car Rentals (Swift Car Rentals & Apex Luxury Fleet)
  // Statuses: Enquiry, Confirmed, In progress, Completed, Cancelled
  { id: 'BK-5523', status: 'Completed', startDate: '2024-05-10 08:00', endDate: '2024-05-12 18:00', bookingDate: '2024-05-05', guestName: 'Robert Fox', contactNumber: '+1 (555) 234-5678', emailId: 'robert.fox@gmail.com', serviceCategory: 'Car Rentals', amount: 300.00, unit: 'Tesla Model 3' },
  { id: 'BK-5524', status: 'Completed', startDate: '2024-05-11 08:00', endDate: '2024-05-13 18:00', bookingDate: '2024-05-06', guestName: 'Jane Cooper', contactNumber: '+1 (555) 876-5432', emailId: 'jane.cooper@yahoo.com', serviceCategory: 'Car Rentals', amount: 400.00, unit: 'Premium SUV' },
  { id: 'BK-5525', status: 'Enquiry', startDate: '2024-05-25 08:00', endDate: '2024-05-28 18:00', bookingDate: '2024-05-20', guestName: 'Michael Jordan', contactNumber: '+1 (555) 230-9944', emailId: 'mj23@bulls.com', serviceCategory: 'Car Rentals', amount: 450.00, unit: 'Tesla Model 3' },
  { id: 'BK-5526', status: 'Enquiry', startDate: '2024-05-26 08:00', endDate: '2024-05-29 18:00', bookingDate: '2024-05-21', guestName: 'Serena Williams', contactNumber: '+1 (555) 444-8811', emailId: 'serena@tennis.com', serviceCategory: 'Car Rentals', amount: 600.00, unit: 'Premium SUV' },
  { id: 'BK-5527', status: 'Confirmed', startDate: '2024-05-22 08:00', endDate: '2024-05-24 18:00', bookingDate: '2024-05-18', guestName: 'Tony Stark', contactNumber: '+1 (555) 300-4000', emailId: 'tony@starkindustries.com', serviceCategory: 'Car Rentals', amount: 1500.00, unit: 'Aston Martin DB11' },
  { id: 'BK-5528', status: 'Confirmed', startDate: '2024-05-23 08:00', endDate: '2024-05-25 18:00', bookingDate: '2024-05-19', guestName: 'Bruce Wayne', contactNumber: '+1 (555) 111-2222', emailId: 'bruce@waynecorp.com', serviceCategory: 'Car Rentals', amount: 1200.00, unit: 'Mercedes S-Class' },
  { id: 'BK-5529', status: 'In progress', startDate: '2024-05-20 08:00', endDate: '2024-05-23 18:00', bookingDate: '2024-05-15', guestName: 'Peter Parker', contactNumber: '+1 (555) 123-4567', emailId: 'peter.parker@dailybugle.com', serviceCategory: 'Car Rentals', amount: 350.00, unit: 'Tesla Model 3' },
  { id: 'BK-5530', status: 'In progress', startDate: '2024-05-21 08:00', endDate: '2024-05-24 18:00', bookingDate: '2024-05-16', guestName: 'Clark Kent', contactNumber: '+1 (555) 987-6543', emailId: 'clark.kent@dailyplanet.com', serviceCategory: 'Car Rentals', amount: 320.00, unit: 'Premium SUV' },
  { id: 'BK-5531', status: 'Cancelled', startDate: '2024-05-15 08:00', endDate: '2024-05-17 18:00', bookingDate: '2024-05-10', guestName: 'Diana Prince', contactNumber: '+1 (555) 555-1941', emailId: 'diana@themyscira.gov', serviceCategory: 'Car Rentals', amount: 450.00, unit: 'Tesla Model 3' },
  { id: 'BK-5532', status: 'Cancelled', startDate: '2024-05-16 08:00', endDate: '2024-05-18 18:00', bookingDate: '2024-05-11', guestName: 'Barry Allen', contactNumber: '+1 (555) 321-3211', emailId: 'barry@centralcitypd.gov', serviceCategory: 'Car Rentals', amount: 400.00, unit: 'Premium SUV' },

  // Laundry (Laundry Pros & Spin Cycle Dry Cleaners)
  // Statuses: order accepted, rider assigned, picked up, received at facility, under processing, quality check, out for delivery, delivered, exception raised, claim under review
  { id: 'BK-5533', status: 'order accepted', startDate: '2024-05-21 08:00', endDate: '2024-05-23 17:00', bookingDate: '2024-05-20', guestName: 'Michael Jordan', contactNumber: '+1 (555) 230-9944', emailId: 'mj23@bulls.com', serviceCategory: 'Laundry', amount: 180.00, unit: 'Premium Dry Cleaning' },
  { id: 'BK-5534', status: 'order accepted', startDate: '2024-05-22 08:00', endDate: '2024-05-24 17:00', bookingDate: '2024-05-21', guestName: 'Serena Williams', contactNumber: '+1 (555) 444-8811', emailId: 'serena@tennis.com', serviceCategory: 'Laundry', amount: 120.00, unit: 'Sports Gear Wash & Fold' },
  { id: 'BK-5535', status: 'rider assigned', startDate: '2024-05-20 09:00', endDate: '2024-05-22 18:00', bookingDate: '2024-05-19', guestName: 'Tony Stark', contactNumber: '+1 (555) 300-4000', emailId: 'tony@starkindustries.com', serviceCategory: 'Laundry', amount: 240.00, unit: 'Wash & Fold Bulk' },
  { id: 'BK-5536', status: 'rider assigned', startDate: '2024-05-21 09:00', endDate: '2024-05-23 18:00', bookingDate: '2024-05-20', guestName: 'Bruce Wayne', contactNumber: '+1 (555) 111-2222', emailId: 'bruce@waynecorp.com', serviceCategory: 'Laundry', amount: 220.00, unit: 'Tuxedo Special Care' },
  { id: 'BK-5537', status: 'picked up', startDate: '2024-05-19 10:00', endDate: '2024-05-21 12:00', bookingDate: '2024-05-18', guestName: 'Peter Parker', contactNumber: '+1 (555) 123-4567', emailId: 'peter.parker@dailybugle.com', serviceCategory: 'Laundry', amount: 350.00, unit: 'Silk Suit Care' },
  { id: 'BK-5538', status: 'picked up', startDate: '2024-05-20 10:00', endDate: '2024-05-22 12:00', bookingDate: '2024-05-19', guestName: 'Clark Kent', contactNumber: '+1 (555) 987-6543', emailId: 'clark.kent@dailyplanet.com', serviceCategory: 'Laundry', amount: 300.00, unit: 'Woolen Coat Dry Clean' },
  { id: 'BK-5539', status: 'received at facility', startDate: '2024-05-18 11:00', endDate: '2024-05-20 15:00', bookingDate: '2024-05-17', guestName: 'Diana Prince', contactNumber: '+1 (555) 555-1941', emailId: 'diana@themyscira.gov', serviceCategory: 'Laundry', amount: 400.00, unit: 'Ancient Armor Polish & Clean' },
  { id: 'BK-5540', status: 'received at facility', startDate: '2024-05-19 11:00', endDate: '2024-05-21 15:00', bookingDate: '2024-05-18', guestName: 'Barry Allen', contactNumber: '+1 (555) 321-3211', emailId: 'barry@centralcitypd.gov', serviceCategory: 'Laundry', amount: 380.00, unit: 'Friction-Resistant Suit Wash' },
  { id: 'BK-5541', status: 'under processing', startDate: '2024-05-17 12:00', endDate: '2024-05-19 16:00', bookingDate: '2024-05-16', guestName: 'Arthur Curry', contactNumber: '+1 (555) 777-8888', emailId: 'aquaman@atlantis.gov', serviceCategory: 'Laundry', amount: 300.00, unit: 'Saltwater Stain Removal' },
  { id: 'BK-5542', status: 'under processing', startDate: '2024-05-18 12:00', endDate: '2024-05-20 16:00', bookingDate: '2024-05-17', guestName: 'Victor Stone', contactNumber: '+1 (555) 888-9999', emailId: 'cyborg@star-labs.com', serviceCategory: 'Laundry', amount: 280.00, unit: 'Metallic Fiber Polish' },
  { id: 'BK-5543', status: 'quality check', startDate: '2024-05-16 13:00', endDate: '2024-05-18 17:00', bookingDate: '2024-05-15', guestName: 'Hal Jordan', contactNumber: '+1 (555) 444-5555', emailId: 'greenlantern@oa.org', serviceCategory: 'Laundry', amount: 150.00, unit: 'Premium Dry Cleaning' },
  { id: 'BK-5544', status: 'quality check', startDate: '2024-05-17 13:00', endDate: '2024-05-19 17:00', bookingDate: '2024-05-16', guestName: 'Oliver Queen', contactNumber: '+1 (555) 333-2222', emailId: 'arrow@starling.gov', serviceCategory: 'Laundry', amount: 140.00, unit: 'Sports Gear Wash & Fold' },
  { id: 'BK-5545', status: 'out for delivery', startDate: '2024-05-15 14:00', endDate: '2024-05-17 18:00', bookingDate: '2024-05-14', guestName: 'John Doe', contactNumber: '+1 (555) 019-2834', emailId: 'john.doe@techcorp.com', serviceCategory: 'Laundry', amount: 200.00, unit: 'Wash & Fold Bulk' },
  { id: 'BK-5546', status: 'out for delivery', startDate: '2024-05-16 14:00', endDate: '2024-05-18 18:00', bookingDate: '2024-05-15', guestName: 'Jane Smith', contactNumber: '+1 (555) 044-8822', emailId: 'jane.smith@globallogistics.com', serviceCategory: 'Laundry', amount: 180.00, unit: 'Tuxedo Special Care' },
  { id: 'BK-5547', status: 'delivered', startDate: '2024-05-14 15:00', endDate: '2024-05-16 19:00', bookingDate: '2024-05-13', guestName: 'Mike Ross', contactNumber: '+1 (555) 077-5678', emailId: 'mike.ross@innovate.com', serviceCategory: 'Laundry', amount: 120.00, unit: 'Silk Suit Care' },
  { id: 'BK-5548', status: 'delivered', startDate: '2024-05-15 15:00', endDate: '2024-05-17 19:00', bookingDate: '2024-05-14', guestName: 'Rachel Zane', contactNumber: '+1 (555) 088-1234', emailId: 'rachel@pearsonspecter.com', serviceCategory: 'Laundry', amount: 110.00, unit: 'Woolen Coat Dry Clean' },
  { id: 'BK-5549', status: 'exception raised', startDate: '2024-05-13 16:00', endDate: '2024-05-15 20:00', bookingDate: '2024-05-12', guestName: 'Harvey Specter', contactNumber: '+1 (555) 999-0000', emailId: 'harvey@pearsonspecter.com', serviceCategory: 'Laundry', amount: 350.00, unit: 'Premium Dry Cleaning' },
  { id: 'BK-5550', status: 'exception raised', startDate: '2024-05-14 16:00', endDate: '2024-05-16 20:00', bookingDate: '2024-05-13', guestName: 'Louis Litt', contactNumber: '+1 (555) 888-1111', emailId: 'louis@pearsonspecter.com', serviceCategory: 'Laundry', amount: 320.00, unit: 'Sports Gear Wash & Fold' },
  { id: 'BK-5551', status: 'claim under review', startDate: '2024-05-12 17:00', endDate: '2024-05-14 21:00', bookingDate: '2024-05-11', guestName: 'Donna Paulsen', contactNumber: '+1 (555) 777-2222', emailId: 'donna@pearsonspecter.com', serviceCategory: 'Laundry', amount: 500.00, unit: 'Wash & Fold Bulk' },
  { id: 'BK-5552', status: 'claim under review', startDate: '2024-05-13 17:00', endDate: '2024-05-15 21:00', bookingDate: '2024-05-12', guestName: 'Jessica Pearson', contactNumber: '+1 (555) 666-3333', emailId: 'jessica@pearsonspecter.com', serviceCategory: 'Laundry', amount: 480.00, unit: 'Tuxedo Special Care' },

  // Food Delivery (Gourmet Catering Co & Feast & Fete Catering)
  // Statuses: Order placed, Accepted, Preparing, Ready for pickup, Out for delivery, Delivered, Cancelled
  { id: 'BK-5553', status: 'Order placed', startDate: '2024-05-20 19:00', endDate: '2024-05-20 19:45', bookingDate: '2024-05-20', guestName: 'Mark Wilson', contactNumber: '+1 (555) 024-9911', emailId: 'mark.w@gmail.com', serviceCategory: 'Food Delivery', amount: 85.00, unit: 'Gourmet Burger Combo' },
  { id: 'BK-5554', status: 'Order placed', startDate: '2024-05-20 19:15', endDate: '2024-05-20 20:00', bookingDate: '2024-05-20', guestName: 'Sarah Jenkins', contactNumber: '+1 (555) 088-1234', emailId: 'sarah.j@gmail.com', serviceCategory: 'Food Delivery', amount: 95.00, unit: 'Premium Sushi Platter' },
  { id: 'BK-5555', status: 'Accepted', startDate: '2024-05-20 18:00', endDate: '2024-05-20 18:45', bookingDate: '2024-05-20', guestName: 'David Miller', contactNumber: '+1 (555) 077-5678', emailId: 'david.m@gmail.com', serviceCategory: 'Food Delivery', amount: 120.00, unit: 'Gourmet Burger Combo' },
  { id: 'BK-5556', status: 'Accepted', startDate: '2024-05-20 18:15', endDate: '2024-05-20 19:00', bookingDate: '2024-05-20', guestName: 'Emma Watson', contactNumber: '+1 (555) 044-8822', emailId: 'emma.w@example.com', serviceCategory: 'Food Delivery', amount: 110.00, unit: 'Premium Sushi Platter' },
  { id: 'BK-5557', status: 'Preparing', startDate: '2024-05-20 17:00', endDate: '2024-05-20 17:45', bookingDate: '2024-05-20', guestName: 'Amelie Poulain', contactNumber: '+1 (555) 333-4444', emailId: 'amelie@montmartre.fr', serviceCategory: 'Food Delivery', amount: 150.00, unit: 'Gourmet Burger Combo' },
  { id: 'BK-5558', status: 'Preparing', startDate: '2024-05-20 17:15', endDate: '2024-05-20 18:00', bookingDate: '2024-05-20', guestName: 'Sherlock Holmes', contactNumber: '+1 (555) 221-221B', emailId: 'sherlock@bakerstreet.co.uk', serviceCategory: 'Food Delivery', amount: 140.00, unit: 'Premium Sushi Platter' },
  { id: 'BK-5559', status: 'Ready for pickup', startDate: '2024-05-20 16:00', endDate: '2024-05-20 16:45', bookingDate: '2024-05-20', guestName: 'John Watson', contactNumber: '+1 (555) 221-221C', emailId: 'watson@bakerstreet.co.uk', serviceCategory: 'Food Delivery', amount: 85.00, unit: 'Gourmet Burger Combo' },
  { id: 'BK-5560', status: 'Ready for pickup', startDate: '2024-05-20 16:15', endDate: '2024-05-20 17:00', bookingDate: '2024-05-20', guestName: 'Peter Parker', contactNumber: '+1 (555) 123-4567', emailId: 'peter.parker@dailybugle.com', serviceCategory: 'Food Delivery', amount: 95.00, unit: 'Premium Sushi Platter' },
  { id: 'BK-5561', status: 'Out for delivery', startDate: '2024-05-20 15:00', endDate: '2024-05-20 15:45', bookingDate: '2024-05-20', guestName: 'Clark Kent', contactNumber: '+1 (555) 987-6543', emailId: 'clark.kent@dailyplanet.com', serviceCategory: 'Food Delivery', amount: 120.00, unit: 'Gourmet Burger Combo' },
  { id: 'BK-5562', status: 'Out for delivery', startDate: '2024-05-20 15:15', endDate: '2024-05-20 16:00', bookingDate: '2024-05-20', guestName: 'Diana Prince', contactNumber: '+1 (555) 555-1941', emailId: 'diana@themyscira.gov', serviceCategory: 'Food Delivery', amount: 110.00, unit: 'Premium Sushi Platter' },
  { id: 'BK-5563', status: 'Delivered', startDate: '2024-05-20 14:00', endDate: '2024-05-20 14:45', bookingDate: '2024-05-20', guestName: 'Barry Allen', contactNumber: '+1 (555) 321-3211', emailId: 'barry@centralcitypd.gov', serviceCategory: 'Food Delivery', amount: 150.00, unit: 'Gourmet Burger Combo' },
  { id: 'BK-5564', status: 'Delivered', startDate: '2024-05-20 14:15', endDate: '2024-05-20 15:00', bookingDate: '2024-05-20', guestName: 'Arthur Curry', contactNumber: '+1 (555) 777-8888', emailId: 'aquaman@atlantis.gov', serviceCategory: 'Food Delivery', amount: 140.00, unit: 'Premium Sushi Platter' },
  { id: 'BK-5565', status: 'Cancelled', startDate: '2024-05-20 13:00', endDate: '2024-05-20 13:45', bookingDate: '2024-05-20', guestName: 'Victor Stone', contactNumber: '+1 (555) 888-9999', emailId: 'cyborg@star-labs.com', serviceCategory: 'Food Delivery', amount: 85.00, unit: 'Gourmet Burger Combo' },
  { id: 'BK-5566', status: 'Cancelled', startDate: '2024-05-20 13:15', endDate: '2024-05-20 14:00', bookingDate: '2024-05-20', guestName: 'Hal Jordan', contactNumber: '+1 (555) 444-5555', emailId: 'greenlantern@oa.org', serviceCategory: 'Food Delivery', amount: 95.00, unit: 'Premium Sushi Platter' },

  // Grocery (InstaCart Grocery & FreshMart Express)
  // Statuses: Order placed, Packing the cart, Out for delivery, Delivered, Cancelled
  { id: 'BK-5567', status: 'Order placed', startDate: '2024-05-21 10:00', endDate: '2024-05-21 11:30', bookingDate: '2024-05-21', guestName: 'Sarah Jenkins', contactNumber: '+1 (555) 088-1234', emailId: 'sarah.j@gmail.com', serviceCategory: 'Grocery', amount: 220.00, unit: 'Weekly Essentials Cart' },
  { id: 'BK-5568', status: 'Order placed', startDate: '2024-05-21 10:15', endDate: '2024-05-21 11:45', bookingDate: '2024-05-21', guestName: 'David Miller', contactNumber: '+1 (555) 077-5678', emailId: 'david.m@gmail.com', serviceCategory: 'Grocery', amount: 180.00, unit: 'Fresh Produce Box' },
  { id: 'BK-5569', status: 'Packing the cart', startDate: '2024-05-21 09:00', endDate: '2024-05-21 10:30', bookingDate: '2024-05-21', guestName: 'Emma Watson', contactNumber: '+1 (555) 044-8822', emailId: 'emma.w@example.com', serviceCategory: 'Grocery', amount: 250.00, unit: 'Weekly Essentials Cart' },
  { id: 'BK-5570', status: 'Packing the cart', startDate: '2024-05-21 09:15', endDate: '2024-05-21 10:45', bookingDate: '2024-05-21', guestName: 'Amelie Poulain', contactNumber: '+1 (555) 333-4444', emailId: 'amelie@montmartre.fr', serviceCategory: 'Grocery', amount: 210.00, unit: 'Fresh Produce Box' },
  { id: 'BK-5571', status: 'Out for delivery', startDate: '2024-05-21 08:00', endDate: '2024-05-21 09:30', bookingDate: '2024-05-21', guestName: 'Sherlock Holmes', contactNumber: '+1 (555) 221-221B', emailId: 'sherlock@bakerstreet.co.uk', serviceCategory: 'Grocery', amount: 220.00, unit: 'Weekly Essentials Cart' },
  { id: 'BK-5572', status: 'Out for delivery', startDate: '2024-05-21 08:15', endDate: '2024-05-21 09:45', bookingDate: '2024-05-21', guestName: 'John Watson', contactNumber: '+1 (555) 221-221C', emailId: 'watson@bakerstreet.co.uk', serviceCategory: 'Grocery', amount: 180.00, unit: 'Fresh Produce Box' },
  { id: 'BK-5573', status: 'Delivered', startDate: '2024-05-21 07:00', endDate: '2024-05-21 08:30', bookingDate: '2024-05-21', guestName: 'Peter Parker', contactNumber: '+1 (555) 123-4567', emailId: 'peter.parker@dailybugle.com', serviceCategory: 'Grocery', amount: 250.00, unit: 'Weekly Essentials Cart' },
  { id: 'BK-5574', status: 'Delivered', startDate: '2024-05-21 07:15', endDate: '2024-05-21 08:45', bookingDate: '2024-05-21', guestName: 'Clark Kent', contactNumber: '+1 (555) 987-6543', emailId: 'clark.kent@dailyplanet.com', serviceCategory: 'Grocery', amount: 210.00, unit: 'Fresh Produce Box' },
  { id: 'BK-5575', status: 'Cancelled', startDate: '2024-05-21 06:00', endDate: '2024-05-21 07:30', bookingDate: '2024-05-21', guestName: 'Diana Prince', contactNumber: '+1 (555) 555-1941', emailId: 'diana@themyscira.gov', serviceCategory: 'Grocery', amount: 220.00, unit: 'Weekly Essentials Cart' },
  { id: 'BK-5576', status: 'Cancelled', startDate: '2024-05-21 06:15', endDate: '2024-05-21 07:45', bookingDate: '2024-05-21', guestName: 'Barry Allen', contactNumber: '+1 (555) 321-3211', emailId: 'barry@centralcitypd.gov', serviceCategory: 'Grocery', amount: 180.00, unit: 'Fresh Produce Box' },

  // Doctor on Call (MedCall Pro & DoctorAtHome Services)
  // Statuses: Enquiry, Arrived, Consultation active, treatment & documentation, Completed, Follow-up, Cancelled
  { id: 'BK-5577', status: 'Enquiry', startDate: '2024-05-21 14:00', endDate: '2024-05-21 15:00', bookingDate: '2024-05-21', guestName: 'David Miller', contactNumber: '+1 (555) 077-5678', emailId: 'david.m@gmail.com', serviceCategory: 'Doctor on Call', amount: 450.00, unit: 'General Practitioner Visit' },
  { id: 'BK-5578', status: 'Enquiry', startDate: '2024-05-21 14:15', endDate: '2024-05-21 15:15', bookingDate: '2024-05-21', guestName: 'Emma Watson', contactNumber: '+1 (555) 044-8822', emailId: 'emma.w@example.com', serviceCategory: 'Doctor on Call', amount: 400.00, unit: 'Specialist Consultation' },
  { id: 'BK-5579', status: 'Arrived', startDate: '2024-05-21 13:00', endDate: '2024-05-21 14:00', bookingDate: '2024-05-21', guestName: 'Amelie Poulain', contactNumber: '+1 (555) 333-4444', emailId: 'amelie@montmartre.fr', serviceCategory: 'Doctor on Call', amount: 450.00, unit: 'General Practitioner Visit' },
  { id: 'BK-5580', status: 'Arrived', startDate: '2024-05-21 13:15', endDate: '2024-05-21 14:15', bookingDate: '2024-05-21', guestName: 'Sherlock Holmes', contactNumber: '+1 (555) 221-221B', emailId: 'sherlock@bakerstreet.co.uk', serviceCategory: 'Doctor on Call', amount: 400.00, unit: 'Specialist Consultation' },
  { id: 'BK-5581', status: 'Consultation active', startDate: '2024-05-21 12:00', endDate: '2024-05-21 13:00', bookingDate: '2024-05-21', guestName: 'John Watson', contactNumber: '+1 (555) 221-221C', emailId: 'watson@bakerstreet.co.uk', serviceCategory: 'Doctor on Call', amount: 450.00, unit: 'General Practitioner Visit' },
  { id: 'BK-5582', status: 'Consultation active', startDate: '2024-05-21 12:15', endDate: '2024-05-21 13:15', bookingDate: '2024-05-21', guestName: 'Peter Parker', contactNumber: '+1 (555) 123-4567', emailId: 'peter.parker@dailybugle.com', serviceCategory: 'Doctor on Call', amount: 400.00, unit: 'Specialist Consultation' },
  { id: 'BK-5583', status: 'treatment & documentation', startDate: '2024-05-21 11:00', endDate: '2024-05-21 12:00', bookingDate: '2024-05-21', guestName: 'Clark Kent', contactNumber: '+1 (555) 987-6543', emailId: 'clark.kent@dailyplanet.com', serviceCategory: 'Doctor on Call', amount: 450.00, unit: 'General Practitioner Visit' },
  { id: 'BK-5584', status: 'treatment & documentation', startDate: '2024-05-21 11:15', endDate: '2024-05-21 12:15', bookingDate: '2024-05-21', guestName: 'Diana Prince', contactNumber: '+1 (555) 555-1941', emailId: 'diana@themyscira.gov', serviceCategory: 'Doctor on Call', amount: 400.00, unit: 'Specialist Consultation' },
  { id: 'BK-5585', status: 'Completed', startDate: '2024-05-21 10:00', endDate: '2024-05-21 11:00', bookingDate: '2024-05-21', guestName: 'Barry Allen', contactNumber: '+1 (555) 321-3211', emailId: 'barry@centralcitypd.gov', serviceCategory: 'Doctor on Call', amount: 450.00, unit: 'General Practitioner Visit' },
  { id: 'BK-5586', status: 'Completed', startDate: '2024-05-21 10:15', endDate: '2024-05-21 11:15', bookingDate: '2024-05-21', guestName: 'Arthur Curry', contactNumber: '+1 (555) 777-8888', emailId: 'aquaman@atlantis.gov', serviceCategory: 'Doctor on Call', amount: 400.00, unit: 'Specialist Consultation' },
  { id: 'BK-5587', status: 'Follow-up', startDate: '2024-05-21 09:00', endDate: '2024-05-21 10:00', bookingDate: '2024-05-21', guestName: 'Victor Stone', contactNumber: '+1 (555) 888-9999', emailId: 'cyborg@star-labs.com', serviceCategory: 'Doctor on Call', amount: 450.00, unit: 'General Practitioner Visit' },
  { id: 'BK-5588', status: 'Follow-up', startDate: '2024-05-21 09:15', endDate: '2024-05-21 10:15', bookingDate: '2024-05-21', guestName: 'Hal Jordan', contactNumber: '+1 (555) 444-5555', emailId: 'greenlantern@oa.org', serviceCategory: 'Doctor on Call', amount: 400.00, unit: 'Specialist Consultation' },
  { id: 'BK-5589', status: 'Cancelled', startDate: '2024-05-21 08:00', endDate: '2024-05-21 09:00', bookingDate: '2024-05-21', guestName: 'Oliver Queen', contactNumber: '+1 (555) 333-2222', emailId: 'arrow@starling.gov', serviceCategory: 'Doctor on Call', amount: 450.00, unit: 'General Practitioner Visit' },
  { id: 'BK-5590', status: 'Cancelled', startDate: '2024-05-21 08:15', endDate: '2024-05-21 09:15', bookingDate: '2024-05-21', guestName: 'Bruce Wayne', contactNumber: '+1 (555) 111-2222', emailId: 'bruce@waynecorp.com', serviceCategory: 'Doctor on Call', amount: 400.00, unit: 'Specialist Consultation' },

  // In House Catering (Gourmet Catering Co & Feast & Fete Catering)
  // Statuses: Enquiry, Confirmed, Menu finalized, Inprogress, Completed, Cancelled
  { id: 'BK-5591', status: 'Enquiry', startDate: '2024-05-22 18:00', endDate: '2024-05-22 22:00', bookingDate: '2024-05-15', guestName: 'Sarah Jenkins', contactNumber: '+1 (555) 088-1234', emailId: 'sarah.j@gmail.com', serviceCategory: 'In House Catering', amount: 850.00, unit: 'In-House Buffet Dinner' },
  { id: 'BK-5592', status: 'Enquiry', startDate: '2024-05-23 18:00', endDate: '2024-05-23 22:00', bookingDate: '2024-05-16', guestName: 'David Miller', contactNumber: '+1 (555) 077-5678', emailId: 'david.m@gmail.com', serviceCategory: 'In House Catering', amount: 900.00, unit: 'Private 5-Course French Dinner' },
  { id: 'BK-5593', status: 'Confirmed', startDate: '2024-05-24 18:00', endDate: '2024-05-24 22:00', bookingDate: '2024-05-17', guestName: 'Emma Watson', contactNumber: '+1 (555) 044-8822', emailId: 'emma.w@example.com', serviceCategory: 'In House Catering', amount: 1200.00, unit: 'In-House Buffet Dinner' },
  { id: 'BK-5594', status: 'Confirmed', startDate: '2024-05-25 18:00', endDate: '2024-05-25 22:00', bookingDate: '2024-05-18', guestName: 'Amelie Poulain', contactNumber: '+1 (555) 333-4444', emailId: 'amelie@montmartre.fr', serviceCategory: 'In House Catering', amount: 1500.00, unit: 'Private 5-Course French Dinner' },
  { id: 'BK-5595', status: 'Menu finalized', startDate: '2024-05-26 18:00', endDate: '2024-05-26 22:00', bookingDate: '2024-05-19', guestName: 'Sherlock Holmes', contactNumber: '+1 (555) 221-221B', emailId: 'sherlock@bakerstreet.co.uk', serviceCategory: 'In House Catering', amount: 850.00, unit: 'In-House Buffet Dinner' },
  { id: 'BK-5596', status: 'Menu finalized', startDate: '2024-05-27 18:00', endDate: '2024-05-27 22:00', bookingDate: '2024-05-20', guestName: 'John Watson', contactNumber: '+1 (555) 221-221C', emailId: 'watson@bakerstreet.co.uk', serviceCategory: 'In House Catering', amount: 900.00, unit: 'Private 5-Course French Dinner' },
  { id: 'BK-5597', status: 'Inprogress', startDate: '2024-05-21 18:00', endDate: '2024-05-21 22:00', bookingDate: '2024-05-20', guestName: 'Peter Parker', contactNumber: '+1 (555) 123-4567', emailId: 'peter.parker@dailybugle.com', serviceCategory: 'In House Catering', amount: 1200.00, unit: 'In-House Buffet Dinner' },
  { id: 'BK-5598', status: 'Inprogress', startDate: '2024-05-21 19:00', endDate: '2024-05-21 23:00', bookingDate: '2024-05-20', guestName: 'Clark Kent', contactNumber: '+1 (555) 987-6543', emailId: 'clark.kent@dailyplanet.com', serviceCategory: 'In House Catering', amount: 1500.00, unit: 'Private 5-Course French Dinner' },
  { id: 'BK-5599', status: 'Completed', startDate: '2024-05-15 18:00', endDate: '2024-05-15 22:00', bookingDate: '2024-05-10', guestName: 'Diana Prince', contactNumber: '+1 (555) 555-1941', emailId: 'diana@themyscira.gov', serviceCategory: 'In House Catering', amount: 850.00, unit: 'In-House Buffet Dinner' },
  { id: 'BK-5600', status: 'Completed', startDate: '2024-05-16 18:00', endDate: '2024-05-16 22:00', bookingDate: '2024-05-11', guestName: 'Barry Allen', contactNumber: '+1 (555) 321-3211', emailId: 'barry@centralcitypd.gov', serviceCategory: 'In House Catering', amount: 900.00, unit: 'Private 5-Course French Dinner' },
  { id: 'BK-5601', status: 'Cancelled', startDate: '2024-05-18 18:00', endDate: '2024-05-18 22:00', bookingDate: '2024-05-12', guestName: 'Arthur Curry', contactNumber: '+1 (555) 777-8888', emailId: 'aquaman@atlantis.gov', serviceCategory: 'In House Catering', amount: 1200.00, unit: 'In-House Buffet Dinner' },
  { id: 'BK-5602', status: 'Cancelled', startDate: '2024-05-19 18:00', endDate: '2024-05-19 22:00', bookingDate: '2024-05-13', guestName: 'Victor Stone', contactNumber: '+1 (555) 888-9999', emailId: 'cyborg@star-labs.com', serviceCategory: 'In House Catering', amount: 1500.00, unit: 'Private 5-Course French Dinner' },

  // Wellness (Wellness Retreats & Zen Spa & Wellness)
  // Statuses: Enquiry, Confirmed, Cancelled, Completed
  { id: 'BK-5603', status: 'Enquiry', startDate: '2024-05-22 14:00', endDate: '2024-05-22 16:00', bookingDate: '2024-05-15', guestName: 'David Miller', contactNumber: '+1 (555) 077-5678', emailId: 'david.m@gmail.com', serviceCategory: 'Wellness', amount: 180.00, unit: 'Full Body Massage & Spa' },
  { id: 'BK-5604', status: 'Enquiry', startDate: '2024-05-23 14:00', endDate: '2024-05-23 16:00', bookingDate: '2024-05-16', guestName: 'Emma Watson', contactNumber: '+1 (555) 044-8822', emailId: 'emma.w@example.com', serviceCategory: 'Wellness', amount: 300.00, unit: 'Force Meditation & Hot Stone' },
  { id: 'BK-5605', status: 'Confirmed', startDate: '2024-05-24 14:00', endDate: '2024-05-24 16:00', bookingDate: '2024-05-17', guestName: 'Amelie Poulain', contactNumber: '+1 (555) 333-4444', emailId: 'amelie@montmartre.fr', serviceCategory: 'Wellness', amount: 180.00, unit: 'Full Body Massage & Spa' },
  { id: 'BK-5606', status: 'Confirmed', startDate: '2024-05-25 14:00', endDate: '2024-05-25 16:00', bookingDate: '2024-05-18', guestName: 'Sherlock Holmes', contactNumber: '+1 (555) 221-221B', emailId: 'sherlock@bakerstreet.co.uk', serviceCategory: 'Wellness', amount: 300.00, unit: 'Force Meditation & Hot Stone' },
  { id: 'BK-5607', status: 'Completed', startDate: '2024-05-15 14:00', endDate: '2024-05-15 16:00', bookingDate: '2024-05-10', guestName: 'John Watson', contactNumber: '+1 (555) 221-221C', emailId: 'watson@bakerstreet.co.uk', serviceCategory: 'Wellness', amount: 180.00, unit: 'Full Body Massage & Spa' },
  { id: 'BK-5608', status: 'Completed', startDate: '2024-05-16 14:00', endDate: '2024-05-16 16:00', bookingDate: '2024-05-11', guestName: 'Peter Parker', contactNumber: '+1 (555) 123-4567', emailId: 'peter.parker@dailybugle.com', serviceCategory: 'Wellness', amount: 300.00, unit: 'Force Meditation & Hot Stone' },
  { id: 'BK-5609', status: 'Cancelled', startDate: '2024-05-18 14:00', endDate: '2024-05-18 16:00', bookingDate: '2024-05-12', guestName: 'Clark Kent', contactNumber: '+1 (555) 987-6543', emailId: 'clark.kent@dailyplanet.com', serviceCategory: 'Wellness', amount: 180.00, unit: 'Full Body Massage & Spa' },
  { id: 'BK-5610', status: 'Cancelled', startDate: '2024-05-19 14:00', endDate: '2024-05-19 16:00', bookingDate: '2024-05-13', guestName: 'Diana Prince', contactNumber: '+1 (555) 555-1941', emailId: 'diana@themyscira.gov', serviceCategory: 'Wellness', amount: 300.00, unit: 'Force Meditation & Hot Stone' }
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
    } else if (categoryFilter === 'In House Catering') {
      return ['Enquiry', 'Confirmed', 'Menu finalized', 'Inprogress', 'Completed', 'Cancelled'];
    } else if (categoryFilter === 'Car Rentals') {
      return ['Enquiry', 'Confirmed', 'In progress', 'Completed', 'Cancelled'];
    } else if (categoryFilter === 'Laundry') {
      return LAUNDRY_STATUSES;
    } else if (categoryFilter === 'Wellness') {
      return ['Enquiry', 'Confirmed', 'Cancelled', 'Completed'];
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
          {/* Laundry Kanban Quick Switch Button */}
          <Button
            variant={categoryFilter === 'Laundry' && viewMode === 'kanban' ? 'default' : 'outline'}
            className="h-10 gap-2 border-primary/30 hover:border-primary"
            onClick={() => {
              setCategoryFilter('Laundry');
              setViewMode('kanban');
              showSuccess("Switched to Laundry Kanban Board");
            }}
          >
            <Shirt className="w-4 h-4 text-primary" />
            Laundry Kanban
          </Button>

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
                      booking.serviceCategory === 'In House Catering' ? ['Enquiry', 'Confirmed', 'Menu finalized', 'Inprogress', 'Completed', 'Cancelled'] :
                      booking.serviceCategory === 'Car Rentals' ? ['Enquiry', 'Confirmed', 'In progress', 'Completed', 'Cancelled'] :
                      booking.serviceCategory === 'Wellness' ? ['Enquiry', 'Confirmed', 'Cancelled', 'Completed'] :
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
                        booking.serviceCategory === 'In House Catering' ? ['Enquiry', 'Confirmed', 'Menu finalized', 'Inprogress', 'Completed', 'Cancelled'] :
                        booking.serviceCategory === 'Car Rentals' ? ['Enquiry', 'Confirmed', 'In progress', 'Completed', 'Cancelled'] :
                        booking.serviceCategory === 'Wellness' ? ['Enquiry', 'Confirmed', 'Cancelled', 'Completed'] :
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