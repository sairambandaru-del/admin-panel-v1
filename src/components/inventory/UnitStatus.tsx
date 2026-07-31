"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Activity, 
  DollarSign, 
  MapPin, 
  Building, 
  Wifi, 
  Key, 
  Calendar, 
  User, 
  CheckCircle2, 
  RefreshCw, 
  Wrench, 
  ShieldCheck, 
  Eye, 
  Bed, 
  Bath, 
  Users, 
  Maximize,
  Sparkles,
  Lock,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';

interface UnitDetail {
  id: string;
  name: string;
  location: string;
  fullAddress: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  sizeSqFt: number;
  price: number;
  status: 'Available' | 'Occupied' | 'Maintenance';
  pms: string;
  lastSync: string;
  smartLockCode: string;
  cleaningStatus: 'Cleaned & Inspected' | 'Pending Clean' | 'In Progress';
  currentBooking?: {
    bookingId: string;
    guestName: string;
    guestEmail: string;
    checkIn: string;
    checkOut: string;
    totalAmount: string;
  };
  upcomingBooking?: {
    bookingId: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
  };
  amenities: string[];
}

const mockUnits: UnitDetail[] = [
  {
    id: 'U-101',
    name: 'Skyline Suite 101',
    location: 'Downtown',
    fullAddress: '123 Skyline Boulevard, Tower A, Unit 101, Downtown Dubai',
    type: '2BR Luxury Apartment',
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    sizeSqFt: 1350,
    price: 250,
    status: 'Available',
    pms: 'Cloudbeds',
    lastSync: '2 mins ago',
    smartLockCode: '9021-88',
    cleaningStatus: 'Cleaned & Inspected',
    upcomingBooking: {
      bookingId: 'BK-9022',
      guestName: 'Sarah Jenkins',
      checkIn: '2024-05-22',
      checkOut: '2024-05-28'
    },
    amenities: ['High-speed WiFi', 'Burj View Balcony', 'Smart Lock', 'Infinity Pool Access', 'Reserved Parking Slot #12', 'Nespresso Machine']
  },
  {
    id: 'U-102',
    name: 'Ocean View Residence 102',
    location: 'Beachfront',
    fullAddress: '45 Palm Jumeirah Crescent, Villa 102, Dubai',
    type: '1BR Premium Suite',
    bedrooms: 1,
    bathrooms: 1.5,
    maxGuests: 2,
    sizeSqFt: 980,
    price: 180,
    status: 'Occupied',
    pms: 'Mews',
    lastSync: '5 mins ago',
    smartLockCode: '4412-09',
    cleaningStatus: 'Cleaned & Inspected',
    currentBooking: {
      bookingId: 'BK-9021',
      guestName: 'Alexander Wright',
      guestEmail: 'a.wright@techcorp.com',
      checkIn: '2024-05-20',
      checkOut: '2024-05-25',
      totalAmount: 'AED 4,250'
    },
    amenities: ['Private Beach Access', 'High-speed WiFi', 'Sea View Balcony', 'Jacuzzi', 'Covered Parking']
  },
  {
    id: 'U-103',
    name: 'Garden Villa 103',
    location: 'Suburbs',
    fullAddress: '88 Arabian Ranches Way, Villa 103, Dubai',
    type: '3BR Independent Villa',
    bedrooms: 3,
    bathrooms: 3.5,
    maxGuests: 6,
    sizeSqFt: 2400,
    price: 450,
    status: 'Available',
    pms: 'Cloudbeds',
    lastSync: '12 mins ago',
    smartLockCode: '7721-55',
    cleaningStatus: 'Cleaned & Inspected',
    amenities: ['Private Garden & BBQ', 'Private Swimming Pool', 'Garage Parking', 'Maid Room', 'High-speed WiFi']
  },
  {
    id: 'U-104',
    name: 'Urban Loft 104',
    location: 'Downtown',
    fullAddress: '55 DIFC Gate Precinct, Building 04, Loft 104, Dubai',
    type: 'Studio Loft',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    sizeSqFt: 650,
    price: 150,
    status: 'Maintenance',
    pms: 'Hostaway',
    lastSync: '1 min ago',
    smartLockCode: '3310-99',
    cleaningStatus: 'In Progress',
    amenities: ['Workstation & Monitor', 'High-speed WiFi', 'Gym Access', 'Metro Access', 'Smart TV']
  },
  {
    id: 'U-105',
    name: 'Mountain Retreat Cabin 105',
    location: 'Highlands',
    fullAddress: '12 Hatta Mountain Road, Cabin 105, Hatta, UAE',
    type: '2BR Cabin',
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 5,
    sizeSqFt: 1400,
    price: 320,
    status: 'Available',
    pms: 'Mews',
    lastSync: '8 mins ago',
    smartLockCode: '1102-44',
    cleaningStatus: 'Cleaned & Inspected',
    amenities: ['Mountain View Deck', 'Firepit', 'Stargazing Telescope', 'High-speed WiFi', 'Free Parking']
  }
];

const UnitStatus = () => {
  const [selectedUnit, setSelectedUnit] = useState<UnitDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleUnitClick = (unit: UnitDetail) => {
    setSelectedUnit(unit);
    setIsDetailOpen(true);
  };

  const handleForceSync = () => {
    if (!selectedUnit) return;
    showSuccess(`Manual PMS sync triggered for ${selectedUnit.name} via ${selectedUnit.pms}.`);
  };

  const handleToggleMaintenance = () => {
    if (!selectedUnit) return;
    const nextStatus = selectedUnit.status === 'Maintenance' ? 'Available' : 'Maintenance';
    setSelectedUnit({...selectedUnit, status: nextStatus});
    showSuccess(`Unit status updated to ${nextStatus}.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">Across 12 prime locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Daily Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED 285.50</div>
            <p className="text-xs text-muted-foreground">+5.2% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Current live status</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Units Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Unit Status & Pricing Catalog</CardTitle>
              <CardDescription>
                Click on any unit row below to open the comprehensive detailed view, specs, current guest, and PMS actions.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono bg-primary/5 text-primary border-primary/20">
              Interactive Table
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Unit ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Daily Price</TableHead>
                <TableHead>PMS Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUnits.map((unit) => (
                <TableRow 
                  key={unit.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors group"
                  onClick={() => handleUnitClick(unit)}
                >
                  <TableCell className="font-mono text-xs font-bold">{unit.id}</TableCell>
                  <TableCell className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                    {unit.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {unit.location}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium">{unit.type}</TableCell>
                  <TableCell className="font-bold text-xs text-primary">AED {unit.price}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-mono">{unit.pms}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      unit.status === 'Available' ? 'default' : 
                      unit.status === 'Occupied' ? 'secondary' : 'destructive'
                    }>
                      {unit.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 gap-1 text-xs text-primary hover:text-primary hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnitClick(unit);
                      }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Unit Detailed View Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
          {selectedUnit && (
            <>
              {/* Modal Header */}
              <DialogHeader className="p-5 pr-12 bg-muted/30 border-b shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <DialogTitle className="text-lg font-bold">{selectedUnit.name}</DialogTitle>
                      <Badge variant="outline" className="text-[10px] font-mono font-bold bg-primary/5 text-primary border-primary/20">
                        {selectedUnit.id}
                      </Badge>
                      <Badge variant={
                        selectedUnit.status === 'Available' ? 'default' : 
                        selectedUnit.status === 'Occupied' ? 'secondary' : 'destructive'
                      }>
                        {selectedUnit.status}
                      </Badge>
                    </div>
                    <DialogDescription className="text-xs mt-1.5 flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{selectedUnit.fullAddress}</span>
                    </DialogDescription>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Daily Rate</span>
                    <span className="text-lg font-extrabold text-primary">AED {selectedUnit.price}</span>
                  </div>
                </div>
              </DialogHeader>

              {/* Modal Body Content */}
              <div className="p-5 overflow-y-auto space-y-6 max-h-[580px] text-xs">
                {/* Specs Grid */}
                <div className="grid grid-cols-4 gap-3 bg-muted/20 p-3 rounded-xl border text-center">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block flex items-center justify-center gap-1">
                      <Bed className="w-3 h-3 text-primary" /> Bedrooms
                    </span>
                    <span className="font-bold text-sm text-foreground">{selectedUnit.bedrooms} BR</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block flex items-center justify-center gap-1">
                      <Bath className="w-3 h-3 text-primary" /> Bathrooms
                    </span>
                    <span className="font-bold text-sm text-foreground">{selectedUnit.bathrooms} Bath</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block flex items-center justify-center gap-1">
                      <Users className="w-3 h-3 text-primary" /> Max Guests
                    </span>
                    <span className="font-bold text-sm text-foreground">{selectedUnit.maxGuests} Guests</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase block flex items-center justify-center gap-1">
                      <Maximize className="w-3 h-3 text-primary" /> Unit Size
                    </span>
                    <span className="font-bold text-sm text-foreground">{selectedUnit.sizeSqFt} sq ft</span>
                  </div>
                </div>

                {/* Status & PMS Integration Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-xl p-3.5 bg-card space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">PMS Integration</span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-primary" />
                        <span className="font-bold text-sm text-foreground">{selectedUnit.pms}</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-mono">
                        Synced {selectedUnit.lastSync}
                      </Badge>
                    </div>
                  </div>

                  <div className="border rounded-xl p-3.5 bg-card space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Smart Lock & Access</span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-600" />
                        <span className="font-mono font-extrabold text-sm text-foreground">{selectedUnit.smartLockCode}</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-200">
                        Active Key
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Housekeeping Inspection Status */}
                <div className="border rounded-xl p-3.5 bg-card flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-bold text-xs text-foreground">Housekeeping & Inspection Status</p>
                      <p className="text-[11px] text-muted-foreground">{selectedUnit.cleaningStatus}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-bold text-[10px]">
                    Ready for Check-in
                  </Badge>
                </div>

                {/* Current or Upcoming Guest Details */}
                {selectedUnit.currentBooking ? (
                  <div className="border-2 border-primary/20 bg-primary/5 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                      <span className="font-bold text-xs text-primary flex items-center gap-1.5">
                        <User className="w-4 h-4" /> Current In-House Guest
                      </span>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {selectedUnit.currentBooking.bookingId}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase">Guest Name</span>
                        <p className="font-bold text-sm text-foreground">{selectedUnit.currentBooking.guestName}</p>
                        <p className="text-[11px] text-muted-foreground">{selectedUnit.currentBooking.guestEmail}</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase">Stay Dates</span>
                        <p className="font-mono text-xs font-semibold text-foreground">
                          {selectedUnit.currentBooking.checkIn} to {selectedUnit.currentBooking.checkOut}
                        </p>
                        <p className="text-[11px] font-bold text-primary mt-0.5">
                          Paid: {selectedUnit.currentBooking.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : selectedUnit.upcomingBooking ? (
                  <div className="border bg-muted/10 rounded-xl p-3.5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Next Confirmed Arrival
                    </span>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-xs text-foreground">{selectedUnit.upcomingBooking.guestName}</p>
                        <p className="text-[11px] font-mono text-muted-foreground">
                          {selectedUnit.upcomingBooking.checkIn} to {selectedUnit.upcomingBooking.checkOut}
                        </p>
                      </div>
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {selectedUnit.upcomingBooking.bookingId}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed bg-muted/10 rounded-xl p-4 text-center text-muted-foreground">
                    <p className="font-semibold text-xs">No active in-house guest</p>
                    <p className="text-[11px] mt-0.5">Unit is currently available for immediate instant booking.</p>
                  </div>
                )}

                {/* Amenities Checklist */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Unit Key Amenities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUnit.amenities.map((amenity, idx) => (
                      <Badge key={idx} variant="outline" className="bg-background text-xs py-1 px-2.5 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1" />
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <DialogFooter className="p-4 border-t bg-muted/20 gap-2 shrink-0 sm:gap-0">
                <Button variant="outline" size="sm" onClick={handleToggleMaintenance} className="gap-1.5 text-xs">
                  <Wrench className="w-3.5 h-3.5 text-amber-600" />
                  {selectedUnit.status === 'Maintenance' ? 'End Maintenance' : 'Set Maintenance'}
                </Button>

                <Button size="sm" onClick={handleForceSync} className="gap-1.5 text-xs bg-primary text-primary-foreground">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Force PMS Sync
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnitStatus;