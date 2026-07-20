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
  { id: 'BK-5534', vendor: 'Spin Cycle Dry Cleaners', guestName: 'Serena Williams', guestPhone: '+1 (555) 444-8811', guestEmail: 'serena@tennis.com', serviceCategory: 'Laundry', serviceName: 'Sports Gear Wash & Fold', bookingDate: '2024-05-21', startDate: '2024-05-22 08:00', endDate: '2024-05-24 17:00', status: 'order accepted', amount: 120.00 },
  { id: 'BK-5535', vendor: 'Laundry Pros', guestName: 'Tony Stark', guestPhone: '+1 (555) 300-4000', guestEmail: 'tony@starkindustries.com', serviceCategory: 'Laundry', serviceName: 'Wash & Fold Bulk', bookingDate: '2024-05-19', startDate: '2024-05-20 09:00', endDate: '2024-05-22 18:00', status: 'rider assigned', amount: 240.00 },
  { id: 'BK-5536', vendor: 'Spin Cycle Dry Cleaners', guestName: 'Bruce Wayne', guestPhone: '+1 (555) 111-2222', guestEmail: 'bruce@waynecorp.com', serviceCategory: 'Laundry', serviceName: 'Tuxedo Special Care', bookingDate: '2024-05-20', startDate: '2024-05-21 09:00', endDate: '2024-05-23 18:00', status: 'rider assigned', amount: 220.00 },
  { id: 'BK-5537', vendor: 'Laundry Pros', guestName: 'Peter Parker', guestPhone: '+1 (555) 123-4567', guestEmail: 'peter.parker@dailybugle.com', serviceCategory: 'Laundry', serviceName: 'Silk Suit Care', bookingDate: '2024-05-18', startDate: '2024-05-19 10:00', endDate: '2024-05-21 12:00', status: 'picked up', amount: 350.00 },
  { id: 'BK-5538', vendor: 'Spin Cycle Dry Cleaners', guestName: 'Clark Kent', guestPhone: '+1 (555) 987-6543', guestEmail: 'clark.kent@dailyplanet.com', serviceCategory: 'Laundry', serviceName: 'Woolen Coat Dry Clean', bookingDate: '2024-05-19', startDate: '2024-05-20 10:00', endDate: '2024-05-22 12:00', status: 'picked up', amount: 300.00 },
  { id: 'BK-5539', vendor: 'Laundry Pros', guestName: 'Diana Prince', guestPhone: '+1 (555) 555-1941', guestEmail: 'diana@themyscira.gov', serviceCategory: 'Laundry', serviceName: 'Ancient Armor Polish & Clean', bookingDate: '2024-05-17', startDate: '2024-05-18 11:00', endDate: '2024-05-20 15:00', status: 'received at facility', amount: 400.00 },
  { id: 'BK-5540', vendor: 'Spin Cycle Dry Cleaners', guestName: 'Barry Allen', guestPhone: '+1 (555) 321-3211', guestEmail: 'barry@centralcitypd.gov', serviceCategory: 'Laundry', serviceName: 'Friction-Resistant Suit Wash', bookingDate: '2024-05-18', startDate: '2024-05-19 11:00', endDate: '2024-05-21 15:00', status: 'received at facility', amount: 380.00 },
  { id: 'BK-5541', vendor: 'Laundry Pros', guestName: 'Arthur Curry', guestPhone: '+1 (555) 777-8888', guestEmail: 'aquaman@atlantis.gov', serviceCategory: 'Laundry', serviceName: 'Saltwater Stain Removal', bookingDate: '2024-05-16', startDate: '2024-05-17 12:00', endDate: '2024-05-19 16:00', status: 'under processing', amount: 300.00 },
  { id: 'BK-5542', vendor: 'Spin Cycle Dry Cleaners', guestName: 'Victor Stone', guestPhone: '+1 (555) 888-9999', guestEmail: 'cyborg@star-labs.com', serviceCategory: 'Laundry', serviceName: 'Metallic Fiber Polish', bookingDate: '2024-05-17', startDate: '2024-05-18 12:00', endDate: '2024-05-20 16:00', status: 'under processing', amount: 280.00 },
  { id: 'BK-5543', vendor: 'Laundry Pros', guestName: 'Hal Jordan', guestPhone: '+1 (555) 444-5555', guestEmail: 'greenlantern@oa.org', serviceCategory: 'Laundry', serviceName: 'Premium Dry Cleaning', bookingDate: '2024-05-15', startDate: '2024-05-16 13:00', endDate: '2024-05-18 17:00', status: 'quality check', amount: 150.00 },
  { id: 'BK-5544', vendor: 'Spin Cycle Dry Cleaners', guestName: 'Oliver Queen', guestPhone: '+1 (555) 333-2222', guestEmail: 'arrow@starling.gov', serviceCategory: 'Laundry', serviceName: 'Sports Gear Wash & Fold', bookingDate: '2024-05-16', startDate: '2024-05-17 13:00', endDate: '2024-05-19 17:00', status: 'quality check', amount: 140.00 },
  { id: 'BK-5545', vendor: 'Laundry Pros', guestName: 'John Doe', guestPhone: '+1 (555) 019-2834', guestEmail: 'john.doe@techcorp.com', serviceCategory: 'Laundry', serviceName: 'Wash & Fold Bulk', bookingDate: '2024-05-14', startDate: '2024-05-15 14:00', endDate: '2024-05-17 18:00', status: 'out for delivery', amount: 200.00 },
  { id: 'BK-5546', vendor: 'Spin Cycle Dry Cleaners', guestName: 'Jane Smith', guestPhone: '+1 (555) 044-8822', guestEmail: 'jane.smith@globallogistics.com', serviceCategory: 'Laundry', serviceName: 'Tuxedo Special Care', bookingDate: '2024-05-15', startDate: '2024-05-16 14:00', endDate: '2024-05-18 18:00', status: 'out for delivery', amount: 180.00 },
  { id: 'BK-5547', vendor: 'Laundry Pros', guestName: 'Mike Ross', guestPhone: '+1 (555) 077-5678', guestEmail: 'mike.ross@innovate.com', serviceCategory: 'Laundry', serviceName: 'Silk Suit Care', bookingDate: '2024-05-13', startDate: '2024-05-14 15:00', endDate: '2024-05-16 19:00', status: 'delivered', amount: 120.00 },
  { id: 'BK-5548', vendor: 'Spin Cycle Dry Cleaners', guestName: 'Rachel Zane', guestPhone: '+1 (555) 088-1234', guestEmail: 'rachel@pearsonspecter.com', serviceCategory: 'Laundry', serviceName: 'Woolen Coat Dry Clean', bookingDate: '2024-05-14', startDate: '2024-05-15 15:00', endDate: '2024-05-17 19:00', status: 'delivered', amount: 110.00 },
  { id: 'BK-5549', vendor: 'Laundry Pros', guestName: 'Harvey Specter', guestPhone: '+1 (555) 999-0000', guestEmail: 'harvey@pearsonspecter.com', serviceCategory: 'Laundry', serviceName: 'Premium Dry Cleaning', bookingDate: '2024-05-12', startDate: '2024-05-13 16:00', endDate: '2024-05-15 20:00', status: 'exception raised', amount: 350.00 },
  { id: 'BK-5550', vendor: 'Spin Cycle Dry Cleaners', guestName: 'Louis Litt', guestPhone: '+1 (555) 888-1111', guestEmail: 'louis@pearsonspecter.com', serviceCategory: 'Laundry', serviceName: 'Sports Gear Wash & Fold', bookingDate: '2024-05-13', startDate: '2024-05-14 16:00', endDate: '2024-05-16 20:00', status: 'exception raised', amount: 320.00 },
  { id: 'BK-5551', vendor: 'Laundry Pros', guestName: 'Donna Paulsen', guestPhone: '+1 (555) 777-2222', guestEmail: 'donna@pearsonspecter.com', serviceCategory: 'Laundry', serviceName: 'Wash & Fold Bulk', bookingDate: '2024-05-11', startDate: '2024-05-12 17:00', endDate: '2024-05-14 21:00', status: 'claim under review', amount: 500.00 },
  { id: 'BK-5552', vendor: 'Spin Cycle Dry Cleaners', guestName: 'Jessica Pearson', guestPhone: '+1 (555) 666-3333', guestEmail: 'jessica@pearsonspecter.com', serviceCategory: 'Laundry', serviceName: 'Tuxedo Special Care', bookingDate: '2024-05-12', startDate: '2024-05-13 17:00', endDate: '2024-05-15 21:00', status: 'claim under review', amount: 480.00 },

  // Food Delivery (Gourmet Catering Co & Feast & Fete Catering)
  // Statuses: Order placed, Accepted, Preparing, Ready for pickup, Out for delivery, Delivered, Cancelled
  { id: 'BK-5553', vendor: 'Gourmet Catering Co', guestName: 'Mark Wilson', guestPhone: '+1 (555) 024-9911', guestEmail: 'mark.w@gmail.com', serviceCategory: 'Food Delivery', serviceName: 'Gourmet Burger Combo', bookingDate: '2024-05-20', startDate: '2024-05-20 19:00', endDate: '2024-05-20 19:45', status: 'Order placed', amount: 85.00 },
  { id: 'BK-5554', vendor: 'Feast & Fete Catering', guestName: 'Sarah Jenkins', guestPhone: '+1 (555) 088-1234', guestEmail: 'sarah.j@gmail.com', serviceCategory: 'Food Delivery', serviceName: 'Premium Sushi Platter', bookingDate: '2024-05-20', startDate: '2024-05-20 19:15', endDate: '2024-05-20 20:00', status: 'Order placed', amount: 95.00 },
  { id: 'BK-5555', vendor: 'Gourmet Catering Co', guestName: 'David Miller', guestPhone: '+1 (555) 077-5678', guestEmail: 'david.m@gmail.com', serviceCategory: 'Food Delivery', serviceName: 'Gourmet Burger Combo', bookingDate: '2024-05-20', startDate: '2024-05-20 18:00', endDate: '2024-05-20 18:45', status: 'Accepted', amount: 120.00 },
  { id: 'BK-5556', vendor: 'Feast & Fete Catering', guestName: 'Emma Watson', guestPhone: '+1 (555) 044-8822', guestEmail: 'emma.w@example.com', serviceCategory: 'Food Delivery', serviceName: 'Premium Sushi Platter', bookingDate: '2024-05-20', startDate: '2024-05-20 18:15', endDate: '2024-05-20 19:00', status: 'Accepted', amount: 110.00 },
  { id: 'BK-5557', vendor: 'Gourmet Catering Co', guestName: 'Amelie Poulain', guestPhone: '+1 (555) 333-4444', guestEmail: 'amelie@montmartre.fr', serviceCategory: 'Food Delivery', serviceName: 'Gourmet Burger Combo', bookingDate: '2024-05-20', startDate: '2024-05-20 17:00', endDate: '2024-05-20 17:45', status: 'Preparing', amount: 150.00 },
  { id: 'BK-5558', vendor: 'Feast & Fete Catering', guestName: 'Sherlock Holmes', guestPhone: '+1 (555) 221-221B', guestEmail: 'sherlock@bakerstreet.co.uk', serviceCategory: 'Food Delivery', serviceName: 'Premium Sushi Platter', bookingDate: '2024-05-20', startDate: '2024-05-20 17:15', endDate: '2024-05-20 18:00', status: 'Preparing', amount: 140.00 },
  { id: 'BK-5559', vendor: 'Gourmet Catering Co', guestName: 'John Watson', guestPhone: '+1 (555) 221-221C', guestEmail: 'watson@bakerstreet.co.uk', serviceCategory: 'Food Delivery', serviceName: 'Gourmet Burger Combo', bookingDate: '2024-05-20', startDate: '2024-05-20 16:00', endDate: '2024-05-20 16:45', status: 'Ready for pickup', amount: 85.00 },
  { id: 'BK-5560', vendor: 'Feast & Fete Catering', guestName: 'Peter Parker', guestPhone: '+1 (555) 123-4567', guestEmail: 'peter.parker@dailybugle.com', serviceCategory: 'Food Delivery', serviceName: 'Premium Sushi Platter', bookingDate: '2024-05-20', startDate: '2024-05-20 16:15', endDate: '2024-05-20 17:00', status: 'Ready for pickup', amount: 95.00 },
  { id: 'BK-5561', vendor: 'Gourmet Catering Co', guestName: 'Clark Kent', guestPhone: '+1 (555) 987-6543', guestEmail: 'clark.kent@dailyplanet.com', serviceCategory: 'Food Delivery', serviceName: 'Gourmet Burger Combo', bookingDate: '2024-05-20', startDate: '2024-05-20 15:00', endDate: '2024-05-20 15:45', status: 'Out for delivery', amount: 120.00 },
  { id: 'BK-5562', vendor: 'Feast & Fete Catering', guestName: 'Diana Prince', guestPhone: '+1 (555) 555-1941', guestEmail: 'diana@themyscira.gov', serviceCategory: 'Food Delivery', serviceName: 'Premium Sushi Platter', bookingDate: '2024-05-20', startDate: '2024-05-20 15:15', endDate: '2024-05-20 16:00', status: 'Out for delivery', amount: 110.00 },
  { id: 'BK-5563', vendor: 'Gourmet Catering Co', guestName: 'Barry Allen', guestPhone: '+1 (555) 321-3211', guestEmail: 'barry@centralcitypd.gov', serviceCategory: 'Food Delivery', serviceName: 'Gourmet Burger Combo', bookingDate: '2024-05-20', startDate: '2024-05-20 14:00', endDate: '2024-05-20 14:45', status: 'Delivered', amount: 150.00 },
  { id: 'BK-5564', vendor: 'Feast & Fete Catering', guestName: 'Arthur Curry', guestPhone: '+1 (555) 777-8888', guestEmail: 'aquaman@atlantis.gov', serviceCategory: 'Food Delivery', serviceName: 'Premium Sushi Platter', bookingDate: '2024-05-20', startDate: '2024-05-20 14:15', endDate: '2024-05-20 15:00', status: 'Delivered', amount: 140.00 },
  { id: 'BK-5565', vendor: 'Gourmet Catering Co', guestName: 'Victor Stone', guestPhone: '+1 (555) 888-9999', guestEmail: 'cyborg@star-labs.com', serviceCategory: 'Food Delivery', serviceName: 'Gourmet Burger Combo', bookingDate: '2024-05-20', startDate: '2024-05-20 13:00', endDate: '2024-05-20 13:45', status: 'Cancelled', amount: 85.00 },
  { id: 'BK-5566', vendor: 'Feast & Fete Catering', guestName: 'Hal Jordan', guestPhone: '+1 (555) 444-5555', guestEmail: 'greenlantern@oa.org', serviceCategory: 'Food Delivery', serviceName: 'Premium Sushi Platter', bookingDate: '2024-05-20', startDate: '2024-05-20 13:15', endDate: '2024-05-20 14:00', status: 'Cancelled', amount: 95.00 },

  // Grocery (InstaCart Grocery & FreshMart Express)
  // Statuses: Order placed, Packing the cart, Out for delivery, Delivered, Cancelled
  { id: 'BK-5567', vendor: 'InstaCart Grocery', guestName: 'Sarah Jenkins', guestPhone: '+1 (555) 088-1234', guestEmail: 'sarah.j@gmail.com', serviceCategory: 'Grocery', serviceName: 'Weekly Essentials Cart', bookingDate: '2024-05-21', startDate: '2024-05-21 10:00', endDate: '2024-05-21 11:30', status: 'Order placed', amount: 220.00 },
  { id: 'BK-5568', vendor: 'FreshMart Express', guestName: 'David Miller', guestPhone: '+1 (555) 077-5678', guestEmail: 'david.m@gmail.com', serviceCategory: 'Grocery', serviceName: 'Fresh Produce Box', bookingDate: '2024-05-21', startDate: '2024-05-21 10:15', endDate: '2024-05-21 11:45', status: 'Order placed', amount: 180.00 },
  { id: 'BK-5569', vendor: 'InstaCart Grocery', guestName: 'Emma Watson', guestPhone: '+1 (555) 044-8822', guestEmail: 'emma.w@example.com', serviceCategory: 'Grocery', serviceName: 'Weekly Essentials Cart', bookingDate: '2024-05-21', startDate: '2024-05-21 09:00', endDate: '2024-05-21 10:30', status: 'Packing the cart', amount: 250.00 },
  { id: 'BK-5570', vendor: 'FreshMart Express', guestName: 'Amelie Poulain', guestPhone: '+1 (555) 333-4444', guestEmail: 'amelie@montmartre.fr', serviceCategory: 'Grocery', serviceName: 'Fresh Produce Box', bookingDate: '2024-05-21', startDate: '2024-05-21 09:15', endDate: '2024-05-21 10:45', status: 'Packing the cart', amount: 210.00 },
  { id: 'BK-5571', vendor: 'InstaCart Grocery', guestName: 'Sherlock Holmes', guestPhone: '+1 (555) 221-221B', guestEmail: 'sherlock@bakerstreet.co.uk', serviceCategory: 'Grocery', serviceName: 'Weekly Essentials Cart', bookingDate: '2024-05-21', startDate: '2024-05-21 08:00', endDate: '2024-05-21 09:30', status: 'Out for delivery', amount: 220.00 },
  { id: 'BK-5572', vendor: 'FreshMart Express', guestName: 'John Watson', guestPhone: '+1 (555) 221-221C', guestEmail: 'watson@bakerstreet.co.uk', serviceCategory: 'Grocery', serviceName: 'Fresh Produce Box', bookingDate: '2024-05-21', startDate: '2024-05-21 08:15', endDate: '2024-05-21 09:45', status: 'Out for delivery', amount: 180.00 },
  { id: 'BK-5573', vendor: 'InstaCart Grocery', guestName: 'Peter Parker', guestPhone: '+1 (555) 123-4567', guestEmail: 'peter.parker@dailybugle.com', serviceCategory: 'Grocery', serviceName: 'Weekly Essentials Cart', bookingDate: '2024-05-21', startDate: '2024-05-21 07:00', endDate: '2024-05-21 08:30', status: 'Delivered', amount: 250.00 },
  { id: 'BK-5574', vendor: 'FreshMart Express', guestName: 'Clark Kent', guestPhone: '+1 (555) 987-6543', guestEmail: 'clark.kent@dailyplanet.com', serviceCategory: 'Grocery', serviceName: 'Fresh Produce Box', bookingDate: '2024-05-21', startDate: '2024-05-21 07:15', endDate: '2024-05-21 08:45', status: 'Delivered', amount: 210.00 },
  { id: 'BK-5575', vendor: 'InstaCart Grocery', guestName: 'Diana Prince', guestPhone: '+1 (555) 555-1941', guestEmail: 'diana@themyscira.gov', serviceCategory: 'Grocery', serviceName: 'Weekly Essentials Cart', bookingDate: '2024-05-21', startDate: '2024-05-21 06:00', endDate: '2024-05-21 07:30', status: 'Cancelled', amount: 220.00 },
  { id: 'BK-5576', vendor: 'FreshMart Express', guestName: 'Barry Allen', guestPhone: '+1 (555) 321-3211', guestEmail: 'barry@centralcitypd.gov', serviceCategory: 'Grocery', serviceName: 'Fresh Produce Box', bookingDate: '2024-05-21', startDate: '2024-05-21 06:15', endDate: '2024-05-21 07:45', status: 'Cancelled', amount: 180.00 },

  // Doctor on Call (MedCall Pro & DoctorAtHome Services)
  // Statuses: Enquiry, Arrived, Consultation active, treatment & documentation, Completed, Follow-up, Cancelled
  { id: 'BK-5577', vendor: 'MedCall Pro', guestName: 'David Miller', guestPhone: '+1 (555) 077-5678', guestEmail: 'david.m@gmail.com', serviceCategory: 'Doctor on Call', serviceName: 'General Practitioner Visit', bookingDate: '2024-05-21', startDate: '2024-05-21 14:00', endDate: '2024-05-21 15:00', status: 'Enquiry', amount: 450.00 },
  { id: 'BK-5578', vendor: 'DoctorAtHome Services', guestName: 'Emma Watson', guestPhone: '+1 (555) 044-8822', guestEmail: 'emma.w@example.com', serviceCategory: 'Doctor on Call', serviceName: 'Specialist Consultation', bookingDate: '2024-05-21', startDate: '2024-05-21 14:15', endDate: '2024-05-21 15:15', status: 'Enquiry', amount: 400.00 },
  { id: 'BK-5579', vendor: 'MedCall Pro', guestName: 'Amelie Poulain', guestPhone: '+1 (555) 333-4444', guestEmail: 'amelie@montmartre.fr', serviceCategory: 'Doctor on Call', serviceName: 'General Practitioner Visit', bookingDate: '2024-05-21', startDate: '2024-05-21 13:00', endDate: '2024-05-21 14:00', status: 'Arrived', amount: 450.00 },
  { id: 'BK-5580', vendor: 'DoctorAtHome Services', guestName: 'Sherlock Holmes', guestPhone: '+1 (555) 221-221B', guestEmail: 'sherlock@bakerstreet.co.uk', serviceCategory: 'Doctor on Call', serviceName: 'Specialist Consultation', bookingDate: '2024-05-21', startDate: '2024-05-21 13:15', endDate: '2024-05-21 14:15', status: 'Arrived', amount: 400.00 },
  { id: 'BK-5581', vendor: 'MedCall Pro', guestName: 'John Watson', guestPhone: '+1 (555) 221-221C', guestEmail: 'watson@bakerstreet.co.uk', serviceCategory: 'Doctor on Call', serviceName: 'General Practitioner Visit', bookingDate: '2024-05-21', startDate: '2024-05-21 12:00', endDate: '2024-05-21 13:00', status: 'Consultation active', amount: 450.00 },
  { id: 'BK-5582', vendor: 'DoctorAtHome Services', guestName: 'Peter Parker', guestPhone: '+1 (555) 123-4567', guestEmail: 'peter.parker@dailybugle.com', serviceCategory: 'Doctor on Call', serviceName: 'Specialist Consultation', bookingDate: '2024-05-21', startDate: '2024-05-21 12:15', endDate: '2024-05-21 13:15', status: 'Consultation active', amount: 400.00 },
  { id: 'BK-5583', vendor: 'MedCall Pro', guestName: 'Clark Kent', guestPhone: '+1 (555) 987-6543', guestEmail: 'clark.kent@dailyplanet.com', serviceCategory: 'Doctor on Call', serviceName: 'General Practitioner Visit', bookingDate: '2024-05-21', startDate: '2024-05-21 11:00', endDate: '2024-05-21 12:00', status: 'treatment & documentation', amount: 450.00 },
  { id: 'BK-5584', vendor: 'DoctorAtHome Services', guestName: 'Diana Prince', guestPhone: '+1 (555) 555-1941', guestEmail: 'diana@themyscira.gov', serviceCategory: 'Doctor on Call', serviceName: 'Specialist Consultation', bookingDate: '2024-05-21', startDate: '2024-05-21 11:15', endDate: '2024-05-21 12:15', status: 'treatment & documentation', amount: 400.00 },
  { id: 'BK-5585', vendor: 'MedCall Pro', guestName: 'Barry Allen', guestPhone: '+1 (555) 321-3211', guestEmail: 'barry@centralcitypd.gov', serviceCategory: 'Doctor on Call', serviceName: 'General Practitioner Visit', bookingDate: '2024-05-21', startDate: '2024-05-21 10:00', endDate: '2024-05-21 11:00', status: 'Completed', amount: 450.00 },
  { id: 'BK-5586', vendor: 'DoctorAtHome Services', guestName: 'Arthur Curry', guestPhone: '+1 (555) 777-8888', guestEmail: 'aquaman@atlantis.gov', serviceCategory: 'Doctor on Call', serviceName: 'Specialist Consultation', bookingDate: '2024-05-21', startDate: '2024-05-21 10:15', endDate: '2024-05-21 11:15', status: 'Completed', amount: 400.00 },
  { id: 'BK-5587', vendor: 'MedCall Pro', guestName: 'Victor Stone', guestPhone: '+1 (555) 888-9999', guestEmail: 'cyborg@star-labs.com', serviceCategory: 'Doctor on Call', serviceName: 'General Practitioner Visit', bookingDate: '2024-05-21', startDate: '2024-05-21 09:00', endDate: '2024-05-21 10:00', status: 'Follow-up', amount: 450.00 },
  { id: 'BK-5588', vendor: 'DoctorAtHome Services', guestName: 'Hal Jordan', guestPhone: '+1 (555) 444-5555', guestEmail: 'greenlantern@oa.org', serviceCategory: 'Doctor on Call', serviceName: 'Specialist Consultation', bookingDate: '2024-05-21', startDate: '2024-05-21 09:15', endDate: '2024-05-21 10:15', status: 'Follow-up', amount: 400.00 },
  { id: 'BK-5589', vendor: 'MedCall Pro', guestName: 'Oliver Queen', guestPhone: '+1 (555) 333-2222', guestEmail: 'arrow@starling.gov', serviceCategory: 'Doctor on Call', serviceName: 'General Practitioner Visit', bookingDate: '2024-05-21', startDate: '2024-05-21 08:00', endDate: '2024-05-21 09:00', status: 'Cancelled', amount: 450.00 },
  { id: 'BK-5590', vendor: 'DoctorAtHome Services', guestName: 'Bruce Wayne', guestPhone: '+1 (555) 111-2222', guestEmail: 'bruce@waynecorp.com', serviceCategory: 'Doctor on Call', serviceName: 'Specialist Consultation', bookingDate: '2024-05-21', startDate: '2024-05-21 08:15', endDate: '2024-05-21 09:15', status: 'Cancelled', amount: 400.00 },

  // In House Catering (Gourmet Catering Co & Feast & Fete Catering)
  // Statuses: Enquiry, Confirmed, Menu finalized, Inprogress, Completed, Cancelled
  { id: 'BK-5591', vendor: 'Gourmet Catering Co', guestName: 'Sarah Jenkins', guestPhone: '+1 (555) 088-1234', guestEmail: 'sarah.j@gmail.com', serviceCategory: 'In House Catering', serviceName: 'In-House Buffet Dinner', bookingDate: '2024-05-15', startDate: '2024-05-22 18:00', endDate: '2024-05-22 22:00', status: 'Enquiry', amount: 850.00 },
  { id: 'BK-5592', vendor: 'Feast & Fete Catering', guestName: 'David Miller', guestPhone: '+1 (555) 077-5678', guestEmail: 'david.m@gmail.com', serviceCategory: 'In House Catering', serviceName: 'Private 5-Course French Dinner', bookingDate: '2024-05-16', startDate: '2024-05-23 18:00', endDate: '2024-05-23 22:00', status: 'Enquiry', amount: 900.00 },
  { id: 'BK-5593', vendor: 'Gourmet Catering Co', guestName: 'Emma Watson', guestPhone: '+1 (555) 044-8822', guestEmail: 'emma.w@example.com', serviceCategory: 'In House Catering', serviceName: 'In-House Buffet Dinner', bookingDate: '2024-05-17', startDate: '2024-05-24 18:00', endDate: '2024-05-24 22:00', status: 'Confirmed', amount: 1200.00 },
  { id: 'BK-5594', vendor: 'Feast & Fete Catering', guestName: 'Amelie Poulain', guestPhone: '+1 (555) 333-4444', guestEmail: 'amelie@montmartre.fr', serviceCategory: 'In House Catering', serviceName: 'Private 5-Course French Dinner', bookingDate: '2024-05-18', startDate: '2024-05-25 18:00', endDate: '2024-05-25 22:00', status: 'Confirmed', amount: 1500.00 },
  { id: 'BK-5595', vendor: 'Gourmet Catering Co', guestName: 'Sherlock Holmes', guestPhone: '+1 (555) 221-221B', guestEmail: 'sherlock@bakerstreet.co.uk', serviceCategory: 'In House Catering', serviceName: 'In-House Buffet Dinner', bookingDate: '2024-05-19', startDate: '2024-05-26 18:00', endDate: '2024-05-26 22:00', status: 'Menu finalized', amount: 850.00 },
  { id: 'BK-5596', vendor: 'Feast & Fete Catering', guestName: 'John Watson', guestPhone: '+1 (555) 221-221C', guestEmail: 'watson@bakerstreet.co.uk', serviceCategory: 'In House Catering', serviceName: 'Private 5-Course French Dinner', bookingDate: '2024-05-20', startDate: '2024-05-27 18:00', endDate: '2024-05-27 22:00', status: 'Menu finalized', amount: 900.00 },
  { id: 'BK-5597', vendor: 'Gourmet Catering Co', guestName: 'Peter Parker', guestPhone: '+1 (555) 123-4567', guestEmail: 'peter.parker@dailybugle.com', serviceCategory: 'In House Catering', serviceName: 'In-House Buffet Dinner', bookingDate: '2024-05-20', startDate: '2024-05-21 18:00', endDate: '2024-05-21 22:00', status: 'Inprogress', amount: 1200.00 },
  { id: 'BK-5598', vendor: 'Feast & Fete Catering', guestName: 'Clark Kent', guestPhone: '+1 (555) 987-6543', guestEmail: 'clark.kent@dailyplanet.com', serviceCategory: 'In House Catering', serviceName: 'Private 5-Course French Dinner', bookingDate: '2024-05-20', startDate: '2024-05-21 19:00', endDate: '2024-05-21 23:00', status: 'Inprogress', amount: 1500.00 },
  { id: 'BK-5599', vendor: 'Gourmet Catering Co', guestName: 'Diana Prince', guestPhone: '+1 (555) 555-1941', guestEmail: 'diana@themyscira.gov', serviceCategory: 'In House Catering', serviceName: 'In-House Buffet Dinner', bookingDate: '2024-05-10', startDate: '2024-05-15 18:00', endDate: '2024-05-15 22:00', status: 'Completed', amount: 850.00 },
  { id: 'BK-5600', vendor: 'Feast & Fete Catering', guestName: 'Barry Allen', guestPhone: '+1 (555) 321-3211', guestEmail: 'barry@centralcitypd.gov', serviceCategory: 'In House Catering', serviceName: 'Private 5-Course French Dinner', bookingDate: '2024-05-11', startDate: '2024-05-16 18:00', endDate: '2024-05-16 22:00', status: 'Completed', amount: 900.00 },
  { id: 'BK-5601', vendor: 'Gourmet Catering Co', guestName: 'Arthur Curry', guestPhone: '+1 (555) 777-8888', guestEmail: 'aquaman@atlantis.gov', serviceCategory: 'In House Catering', serviceName: 'In-House Buffet Dinner', bookingDate: '2024-05-12', startDate: '2024-05-18 18:00', endDate: '2024-05-18 22:00', status: 'Cancelled', amount: 1200.00 },
  { id: 'BK-5602', vendor: 'Feast & Fete Catering', guestName: 'Victor Stone', guestPhone: '+1 (555) 888-9999', guestEmail: 'cyborg@star-labs.com', serviceCategory: 'In House Catering', serviceName: 'Private 5-Course French Dinner', bookingDate: '2024-05-13', startDate: '2024-05-19 18:00', endDate: '2024-05-19 22:00', status: 'Cancelled', amount: 1500.00 },

  // Wellness (Wellness Retreats & Zen Spa & Wellness)
  // Statuses: Enquiry, Confirmed, Cancelled, Completed
  { id: 'BK-5603', vendor: 'Wellness Retreats', guestName: 'David Miller', guestPhone: '+1 (555) 077-5678', guestEmail: 'david.m@gmail.com', serviceCategory: 'Wellness', serviceName: 'Full Body Massage & Spa', bookingDate: '2024-05-15', startDate: '2024-05-22 14:00', endDate: '2024-05-22 16:00', status: 'Enquiry', amount: 180.00 },
  { id: 'BK-5604', vendor: 'Zen Spa & Wellness', guestName: 'Emma Watson', guestPhone: '+1 (555) 044-8822', guestEmail: 'emma.w@example.com', serviceCategory: 'Wellness', serviceName: 'Force Meditation & Hot Stone', bookingDate: '2024-05-16', startDate: '2024-05-23 14:00', endDate: '2024-05-23 16:00', status: 'Enquiry', amount: 300.00 },
  { id: 'BK-5605', vendor: 'Wellness Retreats', guestName: 'Amelie Poulain', guestPhone: '+1 (555) 333-4444', guestEmail: 'amelie@montmartre.fr', serviceCategory: 'Wellness', serviceName: 'Full Body Massage & Spa', bookingDate: '2024-05-17', startDate: '2024-05-24 14:00', endDate: '2024-05-24 16:00', status: 'Confirmed', amount: 180.00 },
  { id: 'BK-5606', vendor: 'Zen Spa & Wellness', guestName: 'Sherlock Holmes', guestPhone: '+1 (555) 221-221B', guestEmail: 'sherlock@bakerstreet.co.uk', serviceCategory: 'Wellness', serviceName: 'Force Meditation & Hot Stone', bookingDate: '2024-05-18', startDate: '2024-05-25 14:00', endDate: '2024-05-25 16:00', status: 'Confirmed', amount: 300.00 },
  { id: 'BK-5607', vendor: 'Wellness Retreats', guestName: 'John Watson', guestPhone: '+1 (555) 221-221C', guestEmail: 'watson@bakerstreet.co.uk', serviceCategory: 'Wellness', serviceName: 'Full Body Massage & Spa', bookingDate: '2024-05-10', startDate: '2024-05-15 14:00', endDate: '2024-05-15 16:00', status: 'Completed', amount: 180.00 },
  { id: 'BK-5608', vendor: 'Zen Spa & Wellness', guestName: 'Peter Parker', guestPhone: '+1 (555) 123-4567', guestEmail: 'peter.parker@dailybugle.com', serviceCategory: 'Wellness', serviceName: 'Force Meditation & Hot Stone', bookingDate: '2024-05-11', startDate: '2024-05-16 14:00', endDate: '2024-05-16 16:00', status: 'Completed', amount: 300.00 },
  { id: 'BK-5609', vendor: 'Wellness Retreats', guestName: 'Clark Kent', guestPhone: '+1 (555) 987-6543', guestEmail: 'clark.kent@dailyplanet.com', serviceCategory: 'Wellness', serviceName: 'Full Body Massage & Spa', bookingDate: '2024-05-12', startDate: '2024-05-18 14:00', endDate: '2024-05-18 16:00', status: 'Cancelled', amount: 180.00 },
  { id: 'BK-5610', vendor: 'Zen Spa & Wellness', guestName: 'Diana Prince', guestPhone: '+1 (555) 555-1941', guestEmail: 'diana@themyscira.gov', serviceCategory: 'Wellness', serviceName: 'Force Meditation & Hot Stone', bookingDate: '2024-05-13', startDate: '2024-05-19 14:00', endDate: '2024-05-19 16:00', status: 'Cancelled', amount: 300.00 }
];

const VendorServices = () => {
  const [category, setCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [enquiries, setEnquiries] = useState([
    { id: 'ENQ-101', vendor: 'Elite Housekeeping', guest: 'Alice Brown', service: 'Deep Cleaning', date: '2024-05-22', status: 'Pending' },
    { id: 'ENQ-102', vendor: 'Swift Car Rentals', guest: 'Mark Wilson', service: 'Airport Transfer', date: '2024-05-23', status: 'Pending' },
  ]);

  const handleEnquiry = (id: string, action: 'Accepted' | 'Rejected') => {
    setEnquiries(prev => prev.map(enq => enq.id === id ? { ...enq, status: action } : enq));
    if (action === 'Accepted') showSuccess(`Enquiry ${id} accepted.`);
    else showError(`Enquiry ${id} rejected.`);
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

  const handleConfirmHousekeeping = (bookingId: string) => {
    handleUpdateStatus(bookingId, 'Confirmed');
    showSuccess(`Housekeeping booking ${bookingId} has been confirmed by the STR company.`);
  };

  // Reset status filter if it's not valid for the newly selected category
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setStatusFilter('all');
  };

  // Smart Search & Filter Logic
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesCategory = category === 'all' || booking.serviceCategory === category;
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

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

  // Determine available statuses for the selected category
  const getAvailableStatuses = () => {
    if (category === 'Short Term Rentals') {
      return ['Enquiry', 'Confirmed', 'Checked in', 'Checked out', 'Cancelled'];
    } else if (category === 'House Keeping') {
      return ['Enquiry', 'Confirmed', 'Scheduled', 'In progressed', 'Completed', 'Cancelled'];
    } else if (category === 'Food Delivery') {
      return ['Order placed', 'Accepted', 'Preparing', 'Ready for pickup', 'Out for delivery', 'Delivered', 'Cancelled'];
    } else if (category === 'Grocery') {
      return ['Order placed', 'Packing the cart', 'Out for delivery', 'Delivered', 'Cancelled'];
    } else if (category === 'Doctor on Call') {
      return ['Enquiry', 'Arrived', 'Consultation active', 'treatment & documentation', 'Completed', 'Follow-up', 'Cancelled'];
    } else if (category === 'In House Catering') {
      return ['Enquiry', 'Confirmed', 'Menu finalized', 'Inprogress', 'Completed', 'Cancelled'];
    } else if (category === 'Car Rentals') {
      return ['Enquiry', 'Confirmed', 'In progress', 'Completed', 'Cancelled'];
    } else if (category === 'Laundry') {
      return LAUNDRY_STATUSES;
    } else if (category !== 'all') {
      return ['Enquiry', 'Confirmed', 'Cancelled', 'Completed'];
    }
    return ['Enquiry', 'Confirmed', 'Checked in', 'Checked out', 'Completed', 'Cancelled', 'Scheduled', 'In progressed', 'Order placed', 'Accepted', 'Preparing', 'Ready for pickup', 'Out for delivery', 'Delivered', 'Packing the cart', 'Arrived', 'Consultation active', 'treatment & documentation', 'Follow-up', ...LAUNDRY_STATUSES];
  };

  const currentStatuses = getAvailableStatuses().filter(s => s !== 'all');

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
        <Select value={category} onValueChange={handleCategoryChange}>
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
                  {/* View Mode Toggle */}
                  <div className="flex bg-muted p-1 rounded-lg border">
                    <Button 
                      variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setViewMode('table')}
                      className="h-7 px-2.5 text-[11px] gap-1"
                    >
                      <List className="w-3 h-3" /> Table
                    </Button>
                    <Button 
                      variant={viewMode === 'kanban' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setViewMode('kanban')}
                      className="h-7 px-2.5 text-[11px] gap-1"
                    >
                      <LayoutGrid className="w-3 h-3" /> Kanban
                    </Button>
                  </div>

                  {/* Status Filter (Dynamic based on Category) */}
                  {viewMode === 'table' && (
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px] h-9 text-xs">
                        <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {getAvailableStatuses().map(status => (
                          <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

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
              {viewMode === 'table' ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Booking ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Update Status</TableHead>
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
                      {filteredBookings.map((booking) => {
                        const allowedStatuses = booking.serviceCategory === 'Laundry' ? LAUNDRY_STATUSES : 
                          booking.serviceCategory === 'Short Term Rentals' ? ['Enquiry', 'Confirmed', 'Checked in', 'Checked out', 'Cancelled'] :
                          booking.serviceCategory === 'House Keeping' ? ['Enquiry', 'Confirmed', 'Scheduled', 'In progressed', 'Completed', 'Cancelled'] :
                          booking.serviceCategory === 'Food Delivery' ? ['Order placed', 'Accepted', 'Preparing', 'Ready for pickup', 'Out for delivery', 'Delivered', 'Cancelled'] :
                          booking.serviceCategory === 'Grocery' ? ['Order placed', 'Packing the cart', 'Out for delivery', 'Delivered', 'Cancelled'] :
                          booking.serviceCategory === 'Doctor on Call' ? ['Enquiry', 'Arrived', 'Consultation active', 'treatment & documentation', 'Completed', 'Follow-up', 'Cancelled'] :
                          booking.serviceCategory === 'In House Catering' ? ['Enquiry', 'Confirmed', 'Menu finalized', 'Inprogress', 'Completed', 'Cancelled'] :
                          booking.serviceCategory === 'Car Rentals' ? ['Enquiry', 'Confirmed', 'In progress', 'Completed', 'Cancelled'] :
                          ['Enquiry', 'Confirmed', 'Cancelled', 'Completed'];

                        return (
                          <TableRow 
                            key={booking.id} 
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <TableCell className="font-mono text-xs font-bold text-primary">
                              {booking.id}
                            </TableCell>
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
                        );
                      })}
                      {filteredBookings.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={12} className="h-32 text-center text-muted-foreground">
                            No bookings found matching the search or filter criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                /* Kanban View */
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-4 min-w-[1200px] h-[500px]">
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
                                      <p className="text-[10px] text-muted-foreground truncate">{booking.serviceName}</p>
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

                  {/* Invoice Header */}
                  <div className="border p-4 rounded-xl bg-card space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Invoice Preview</h4>
                        <p className="text-[10px] text-muted-foreground">Generated on {selectedBooking.bookingDate}</p>
                      </div>
                      <div>
                        {getStatusBadge(selectedBooking.status)}
                      </div>
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
                    <h4 className="text-xs font-bold uppercase tracking-wider">Pricing Summary</h4>
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