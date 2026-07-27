"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Boxes, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  PackageX, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  Building2, 
  DollarSign,
  Shirt,
  Car,
  Utensils,
  Stethoscope,
  ShoppingBag,
  Home,
  Compass,
  UtensilsCrossed,
  Laptop,
  HeartPulse,
  ChefHat,
  ShoppingBasket,
  CarTaxiFront,
  Building,
  Sparkles,
  Zap,
  Tag,
  Clock,
  Plane,
  Navigation,
  Crown,
  Leaf,
  Wifi,
  Radio,
  Sliders,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { ServiceCategory } from './VendorServices';

export interface LaundryServiceItem {
  id: string;
  sku: string;
  itemName: string;
  vendorName: string;
  subCategory: 'Clothing' | 'Suits & Outerwear' | 'Bedding & Linens' | 'Bulk Wash & Fold' | 'Delicates';
  serviceMethod: 'Wash & Iron' | 'Dry Cleaning' | 'Wash & Fold' | 'Pressing Only';
  unitPriceAED: number;
  expressPriceAED: number;
  packagingStyle: 'Hanger' | 'Folded & Boxed' | 'Garment Bag';
  dailyCapacity: number;
  isActive: boolean;
}

export interface HousekeepingServiceItem {
  id: string;
  sku: string;
  serviceTitle: string;
  vendorName: string;
  serviceType: 'Daily Service' | 'Deep Cleaning' | 'Targeted Service' | 'Amenity Refill' | 'Evening Service';
  description: string;
  durationFormatted: string;
  durationMinutes: number;
  priceAED: number;
  isIncludedInStay: boolean;
  dailyCapacity: number;
  isActive: boolean;
}

export interface TransportationServiceItem {
  id: string;
  sku: string;
  serviceTitle: string;
  vendorName: string;
  rideType: 'Airport Transfer' | 'Local Ride Hailing' | 'Premium Private Taxi' | 'Rent a Car';
  description: string;
  vehicleModel: string; // e.g. "Range Rover Sport · Silver · C 21987"
  rideModeProfile: 'Business' | 'Relaxed' | 'VIP' | 'Green' | 'Focus';
  zenPoolEligible: boolean;
  aquaAccessEligible: boolean;
  onboardExtras: string[]; // e.g. ['WiFi Hotspot', 'Phone Charger', 'Bottled Water']
  priceAED: number;
  pricingUnit: 'Per Trip' | 'Per Hour' | 'Per Day' | '3-Day Package';
  dailyCapacity: number;
  isActive: boolean;
}

export const EXACT_14_CATEGORIES: Array<{ id: ServiceCategory; label: string; icon: React.ElementType }> = [
  { id: 'Transportation', label: 'Transportation Hub', icon: CarTaxiFront },
  { id: 'House keeping', label: 'House Keeping', icon: Home },
  { id: 'Laundry', label: 'Laundry', icon: Shirt },
  { id: 'Short term rental', label: 'Short Term Rental', icon: Building },
  { id: 'Car rental', label: 'Car Rental', icon: Car },
  { id: 'Doctor on call', label: 'Doctor on Call', icon: Stethoscope },
  { id: 'Leisure activities', label: 'Leisure Activities', icon: Compass },
  { id: 'Dining', label: 'Dining', icon: UtensilsCrossed },
  { id: 'Co-working', label: 'Co-working', icon: Laptop },
  { id: 'Wellness', label: 'Wellness', icon: HeartPulse },
  { id: 'Chef on call', label: 'Chef on Call', icon: ChefHat },
  { id: 'In-house catering', label: 'Catering', icon: Utensils },
  { id: 'Grocery', label: 'Grocery', icon: ShoppingBasket },
  { id: 'Food delivery', label: 'Food Delivery', icon: ShoppingBag }
];

const VENDORS_LIST = [
  'Swift Airport Transfers',
  'Apex Luxury Fleet',
  'Sparkle Cleaners',
  'Elite Housekeeping Co',
  'QuickWash Laundry',
  'Spin Cycle Dry Cleaners',
  'Skyline Property Mgmt',
  'MedCall Pro Services',
  'Desert Safari Adventures',
  'Zuma Fine Dining',
  'WeWork Global Pass',
  'Zen Spa & Wellness',
  'Gourmet Chef Collective',
  'Feast & Fete Catering',
  'FreshMart Express',
  'Bistro Express'
];

// Structured Transportation Catalog matching Transportation Hub Frontend
const initialTransportationCatalog: TransportationServiceItem[] = [
  {
    id: 'TRN-001',
    sku: 'SKU-TRN-AIRPORT-DXB',
    serviceTitle: 'Airport Transfer (DXB & AUH)',
    vendorName: 'Swift Airport Transfers',
    rideType: 'Airport Transfer',
    description: 'Meet & greet, one-way or round-trip transfers for DXB & AUH airports',
    vehicleModel: 'Mercedes S-Class Maybach (Black · DXB 9021)',
    rideModeProfile: 'Business',
    zenPoolEligible: true,
    aquaAccessEligible: true,
    onboardExtras: ['WiFi Hotspot', 'Phone Charger', 'Bottled Water', 'Bloomberg News Briefing'],
    priceAED: 180.00,
    pricingUnit: 'Per Trip',
    dailyCapacity: 40,
    isActive: true
  },
  {
    id: 'TRN-002',
    sku: 'SKU-TRN-CHAUFFEUR-HALF',
    serviceTitle: 'Half-day Chauffeur — Client Visits',
    vendorName: 'Apex Luxury Fleet',
    rideType: 'Premium Private Taxi',
    description: 'Chauffeur-driven luxury vehicles, booked hourly or full day',
    vehicleModel: 'Range Rover Sport · Silver · C 21987',
    rideModeProfile: 'VIP',
    zenPoolEligible: true,
    aquaAccessEligible: true,
    onboardExtras: ['WiFi Hotspot', 'Phone Charger', 'Bottled Water', 'Quiet Cabin Mode'],
    priceAED: 550.00,
    pricingUnit: 'Per Hour',
    dailyCapacity: 15,
    isActive: true
  },
  {
    id: 'TRN-003',
    sku: 'SKU-TRN-LOCAL-HAIL',
    serviceTitle: 'Local Ride Hailing (DIFC & City Trips)',
    vendorName: 'Swift Airport Transfers',
    rideType: 'Local Ride Hailing',
    description: 'Point-to-point, hourly, multi-stop city rides across Dubai',
    vehicleModel: 'Tesla Model S Plaid (White · Electric)',
    rideModeProfile: 'Green',
    zenPoolEligible: true,
    aquaAccessEligible: true,
    onboardExtras: ['WiFi Hotspot', 'Phone Charger', 'Bottled Water'],
    priceAED: 60.00,
    pricingUnit: 'Per Trip',
    dailyCapacity: 100,
    isActive: true
  },
  {
    id: 'TRN-004',
    sku: 'SKU-TRN-WEEKEND-SUV',
    serviceTitle: 'Weekend SUV — Jebel Jais Drive',
    vendorName: 'Apex Luxury Fleet',
    rideType: 'Rent a Car',
    description: 'Self-drive, daily & weekly luxury SUV rental packages',
    vehicleModel: 'Range Rover Sport HSE 2024 (Silver)',
    rideModeProfile: 'Relaxed',
    zenPoolEligible: true,
    aquaAccessEligible: true,
    onboardExtras: ['Child Safety Seat', 'All-Wheel Drive Package', 'GPS Navigation'],
    priceAED: 1050.00,
    pricingUnit: '3-Day Package',
    dailyCapacity: 10,
    isActive: true
  }
];

// Structured Housekeeping Catalog
const initialHousekeepingCatalog: HousekeepingServiceItem[] = [
  {
    id: 'HKP-001',
    sku: 'SKU-HKP-DAILY',
    serviceTitle: 'Daily Cleaning',
    vendorName: 'Sparkle Cleaners',
    serviceType: 'Daily Service',
    description: 'Standard room cleaning, dusting, vacuuming, bathroom sanitization',
    durationFormatted: '90 min',
    durationMinutes: 90,
    priceAED: 0,
    isIncludedInStay: true,
    dailyCapacity: 45,
    isActive: true
  },
  {
    id: 'HKP-002',
    sku: 'SKU-HKP-DEEP',
    serviceTitle: 'Deep Cleaning',
    vendorName: 'Sparkle Cleaners',
    serviceType: 'Deep Cleaning',
    description: 'Thorough cleaning including upholstery, curtains, and hard-to-reach areas',
    durationFormatted: '3 hours',
    durationMinutes: 180,
    priceAED: 120.00,
    isIncludedInStay: false,
    dailyCapacity: 15,
    isActive: true
  }
];

// Laundry catalog
const initialLaundryCatalog: LaundryServiceItem[] = [
  {
    id: 'LND-101',
    sku: 'SKU-LND-SHIRT-WI',
    itemName: "Men's Shirt (Formal / Casual)",
    vendorName: 'QuickWash Laundry',
    subCategory: 'Clothing',
    serviceMethod: 'Wash & Iron',
    unitPriceAED: 18.00,
    expressPriceAED: 28.00,
    packagingStyle: 'Hanger',
    dailyCapacity: 250,
    isActive: true
  }
];

const VendorInventory = () => {
  const [transportationCatalog, setTransportationCatalog] = useState<TransportationServiceItem[]>(initialTransportationCatalog);
  const [housekeepingCatalog, setHousekeepingCatalog] = useState<HousekeepingServiceItem[]>(initialHousekeepingCatalog);
  const [laundryCatalog, setLaundryCatalog] = useState<LaundryServiceItem[]>(initialLaundryCatalog);
  
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('Transportation');
  const [searchTerm, setSearchTerm] = useState('');
  const [transportRideTypeFilter, setTransportRideTypeFilter] = useState('all');

  // Modals state for Transportation
  const [isAddTrnOpen, setIsAddTrnOpen] = useState(false);
  const [isEditTrnOpen, setIsEditTrnOpen] = useState(false);
  const [editingTrnItem, setEditingTrnItem] = useState<TransportationServiceItem | null>(null);

  const [trnFormData, setTrnFormData] = useState<TransportationServiceItem>({
    id: '',
    sku: '',
    serviceTitle: '',
    vendorName: 'Swift Airport Transfers',
    rideType: 'Airport Transfer',
    description: '',
    vehicleModel: 'Mercedes S-Class Maybach',
    rideModeProfile: 'Business',
    zenPoolEligible: true,
    aquaAccessEligible: true,
    onboardExtras: ['WiFi Hotspot', 'Phone Charger', 'Bottled Water'],
    priceAED: 180,
    pricingUnit: 'Per Trip',
    dailyCapacity: 30,
    isActive: true
  });

  const filteredTransportationItems = transportationCatalog.filter(item => {
    const matchesSearch = 
      item.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRideType = transportRideTypeFilter === 'all' || item.rideType === transportRideTypeFilter;

    return matchesSearch && matchesRideType;
  });

  const handleAddTransportationItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trnFormData.serviceTitle || !trnFormData.sku) {
      showError("Please enter Service Title and SKU.");
      return;
    }

    const newItem: TransportationServiceItem = {
      ...trnFormData,
      id: `TRN-00${transportationCatalog.length + 1}`
    };

    setTransportationCatalog([...transportationCatalog, newItem]);
    setIsAddTrnOpen(false);
    showSuccess(`Added "${newItem.serviceTitle}" to Transportation Hub Catalog.`);
  };

  const handleOpenEditTrn = (item: TransportationServiceItem) => {
    setEditingTrnItem(item);
    setTrnFormData(item);
    setIsEditTrnOpen(true);
  };

  const handleUpdateTrnItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrnItem) return;

    setTransportationCatalog(prev => prev.map(item => {
      if (item.id === editingTrnItem.id) {
        return trnFormData;
      }
      return item;
    }));

    setIsEditTrnOpen(false);
    setEditingTrnItem(null);
    showSuccess(`Updated Transportation offering "${trnFormData.serviceTitle}".`);
  };

  const handleDeleteTrnItem = (id: string, name: string) => {
    setTransportationCatalog(prev => prev.filter(i => i.id !== id));
    showSuccess(`Removed "${name}" from Transportation Catalog.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Transportation Offerings</CardTitle>
            <CarTaxiFront className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transportationCatalog.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Configured Ride Services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Zen Pool & Aqua Access</CardTitle>
            <Sparkles className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">100% Eligible</div>
            <p className="text-xs text-muted-foreground mt-1">All rides meet tier criteria</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Core Service Modes</CardTitle>
            <Navigation className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4 Ride Types</div>
            <p className="text-xs text-muted-foreground mt-1">Airport, Local, Taxi, Rental</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Fleet Daily Trips</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {transportationCatalog.reduce((sum, item) => sum + item.dailyCapacity, 0)} Trips/Day
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active fleet capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Directory Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Category Inventory & Pricing Catalog</CardTitle>
              <CardDescription>
                Tailored inventory structure per category. Selected category: <span className="font-bold text-primary">{selectedCategory}</span>
              </CardDescription>
            </div>

            {selectedCategory === 'Transportation' && (
              <Dialog open={isAddTrnOpen} onOpenChange={setIsAddTrnOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shrink-0">
                    <Plus className="w-4 h-4" /> Add Transportation Ride Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <form onSubmit={handleAddTransportationItem}>
                    <DialogHeader>
                      <DialogTitle>Add Transportation Offering (Ride Service)</DialogTitle>
                      <DialogDescription>
                        Configure ride type, ride settings profile, Zen Pool/Aqua eligibility, and vehicle details.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="trn-sku">SKU Code</Label>
                          <Input 
                            id="trn-sku" 
                            placeholder="e.g. SKU-TRN-AIRPORT" 
                            value={trnFormData.sku}
                            onChange={e => setTrnFormData({...trnFormData, sku: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="trn-vendor">Assigned Chauffeur / Fleet Vendor</Label>
                          <Select 
                            value={trnFormData.vendorName}
                            onValueChange={v => setTrnFormData({...trnFormData, vendorName: v})}
                          >
                            <SelectTrigger id="trn-vendor"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Swift Airport Transfers">Swift Airport Transfers</SelectItem>
                              <SelectItem value="Apex Luxury Fleet">Apex Luxury Fleet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="trn-title">Service Title</Label>
                        <Input 
                          id="trn-title" 
                          placeholder="e.g. Airport Transfer (DXB & AUH)" 
                          value={trnFormData.serviceTitle}
                          onChange={e => setTrnFormData({...trnFormData, serviceTitle: e.target.value})}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="trn-type">Ride Type (Transportation Category)</Label>
                          <Select 
                            value={trnFormData.rideType}
                            onValueChange={(v: any) => setTrnFormData({...trnFormData, rideType: v})}
                          >
                            <SelectTrigger id="trn-type"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Airport Transfer">Airport Transfer</SelectItem>
                              <SelectItem value="Local Ride Hailing">Local Ride Hailing</SelectItem>
                              <SelectItem value="Premium Private Taxi">Premium Private Taxi</SelectItem>
                              <SelectItem value="Rent a Car">Rent a Car</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="trn-profile">Ride Setting Profile Preset</Label>
                          <Select 
                            value={trnFormData.rideModeProfile}
                            onValueChange={(v: any) => setTrnFormData({...trnFormData, rideModeProfile: v})}
                          >
                            <SelectTrigger id="trn-profile"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Business">Business</SelectItem>
                              <SelectItem value="Relaxed">Relaxed</SelectItem>
                              <SelectItem value="VIP">VIP</SelectItem>
                              <SelectItem value="Green">Green</SelectItem>
                              <SelectItem value="Focus">Focus</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="trn-vehicle">Assigned Vehicle Model & License Tag</Label>
                        <Input 
                          id="trn-vehicle" 
                          placeholder="e.g. Range Rover Sport · Silver · C 21987" 
                          value={trnFormData.vehicleModel}
                          onChange={e => setTrnFormData({...trnFormData, vehicleModel: e.target.value})}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="trn-desc">Description for Guest Mobile App</Label>
                        <Textarea 
                          id="trn-desc" 
                          placeholder="Describe ride scope (e.g. Meet & greet, one-way/round-trip DXB & AUH)..." 
                          value={trnFormData.description}
                          onChange={e => setTrnFormData({...trnFormData, description: e.target.value})}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="trn-price">Base Price (AED)</Label>
                          <Input 
                            id="trn-price" 
                            type="number"
                            step="1.00"
                            value={trnFormData.priceAED}
                            onChange={e => setTrnFormData({...trnFormData, priceAED: Number(e.target.value)})}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="trn-unit">Pricing Unit</Label>
                          <Select 
                            value={trnFormData.pricingUnit}
                            onValueChange={(v: any) => setTrnFormData({...trnFormData, pricingUnit: v})}
                          >
                            <SelectTrigger id="trn-unit"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Per Trip">Per Trip</SelectItem>
                              <SelectItem value="Per Hour">Per Hour</SelectItem>
                              <SelectItem value="Per Day">Per Day</SelectItem>
                              <SelectItem value="3-Day Package">3-Day Package</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t text-xs">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="trn-zen"
                            checked={trnFormData.zenPoolEligible}
                            onCheckedChange={v => setTrnFormData({...trnFormData, zenPoolEligible: v})}
                          />
                          <Label htmlFor="trn-zen" className="cursor-pointer font-semibold text-amber-900">
                            Zen Pool Eligible
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="trn-aqua"
                            checked={trnFormData.aquaAccessEligible}
                            onCheckedChange={v => setTrnFormData({...trnFormData, aquaAccessEligible: v})}
                          />
                          <Label htmlFor="trn-aqua" className="cursor-pointer font-semibold text-cyan-900">
                            Aqua Access
                          </Label>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="submit" className="w-full">Save Ride Offering</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Category Navigation Bar */}
          <div className="pt-4 border-t mt-4 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
            <div className="w-full xl:w-auto overflow-x-auto pb-1">
              <div className="flex gap-1.5 bg-muted/80 p-1.5 rounded-lg border min-w-max">
                {EXACT_14_CATEGORIES.map(tab => {
                  const Icon = tab.icon;
                  const isActive = selectedCategory === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        isActive 
                          ? 'bg-background text-foreground shadow-xs border font-bold' 
                          : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'opacity-70'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-2 w-full xl:w-auto">
              {selectedCategory === 'Transportation' && (
                <Select value={transportRideTypeFilter} onValueChange={setTransportRideTypeFilter}>
                  <SelectTrigger className="w-[180px] h-9 text-xs">
                    <SelectValue placeholder="All Ride Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ride Types</SelectItem>
                    <SelectItem value="Airport Transfer">Airport Transfer</SelectItem>
                    <SelectItem value="Local Ride Hailing">Local Ride Hailing</SelectItem>
                    <SelectItem value="Premium Private Taxi">Premium Private Taxi</SelectItem>
                    <SelectItem value="Rent a Car">Rent a Car</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <div className="relative w-full xl:w-60 shrink-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search ride service or vehicle..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {selectedCategory === 'Transportation' ? (
            /* TAILORED TRANSPORTATION HUB CATALOG TABLE (MATCHES FRONTEND APP) */
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>SKU</TableHead>
                    <TableHead>Ride Service Title</TableHead>
                    <TableHead>Ride Type</TableHead>
                    <TableHead>Assigned Vehicle / Fleet ID</TableHead>
                    <TableHead>Eligibility Badges</TableHead>
                    <TableHead>Ride Profile Preset</TableHead>
                    <TableHead>Onboard Extras</TableHead>
                    <TableHead>Rate (AED)</TableHead>
                    <TableHead className="text-center">Daily Capacity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransportationItems.map(item => (
                    <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-xs font-bold">{item.sku}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-xs text-foreground">{item.serviceTitle}</p>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[220px]">{item.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                          {item.rideType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-foreground">
                        {item.vehicleModel}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {item.zenPoolEligible && (
                            <Badge variant="outline" className="text-[9px] bg-amber-50 text-amber-900 border-amber-300 w-fit py-0">
                              <Crown className="w-2.5 h-2.5 mr-1 text-amber-600" /> Zen Pool eligible
                            </Badge>
                          )}
                          {item.aquaAccessEligible && (
                            <Badge variant="outline" className="text-[9px] bg-cyan-50 text-cyan-900 border-cyan-300 w-fit py-0">
                              <Sparkles className="w-2.5 h-2.5 mr-1 text-cyan-600" /> Aqua access
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] font-bold ${
                          item.rideModeProfile === 'Business' ? 'bg-slate-900 text-white' :
                          item.rideModeProfile === 'VIP' ? 'bg-amber-600 text-white' :
                          item.rideModeProfile === 'Green' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {item.rideModeProfile}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {item.onboardExtras.map((ex, idx) => (
                            <Badge key={idx} variant="secondary" className="text-[9px] px-1 py-0 font-normal">
                              {ex}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-foreground">
                        AED {item.priceAED.toFixed(2)} <span className="text-[10px] font-normal text-muted-foreground">/ {item.pricingUnit}</span>
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs font-bold">
                        {item.dailyCapacity} Trips/Day
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => handleOpenEditTrn(item)}
                            title="Edit Service Offering"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteTrnItem(item.id, item.serviceTitle)}
                            title="Delete Offering"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : selectedCategory === 'House keeping' ? (
            /* TAILORED HOUSEKEEPING SERVICE CATALOG TABLE */
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>SKU</TableHead>
                    <TableHead>Service Title</TableHead>
                    <TableHead>Classification</TableHead>
                    <TableHead>Frontend App Description</TableHead>
                    <TableHead>Estimated Duration</TableHead>
                    <TableHead>Vendor Provider</TableHead>
                    <TableHead>Price (AED)</TableHead>
                    <TableHead className="text-center">Daily Capacity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {housekeepingCatalog.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs font-bold">{item.sku}</TableCell>
                      <TableCell className="font-bold text-xs">{item.serviceTitle}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{item.serviceType}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{item.description}</TableCell>
                      <TableCell className="text-xs font-mono">{item.durationFormatted}</TableCell>
                      <TableCell className="text-xs">{item.vendorName}</TableCell>
                      <TableCell className="text-xs font-bold">AED {item.priceAED.toFixed(2)}</TableCell>
                      <TableCell className="text-center font-mono text-xs">{item.dailyCapacity} Requests/Day</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : selectedCategory === 'Laundry' ? (
            /* TAILORED LAUNDRY PRICE CATALOG TABLE */
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>SKU</TableHead>
                    <TableHead>Garment / Service Item</TableHead>
                    <TableHead>Sub-Category</TableHead>
                    <TableHead>Service Method</TableHead>
                    <TableHead>Vendor Provider</TableHead>
                    <TableHead>Standard Rate (AED)</TableHead>
                    <TableHead>Express Rate (AED)</TableHead>
                    <TableHead className="text-center">Capacity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {laundryCatalog.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs font-bold">{item.sku}</TableCell>
                      <TableCell className="font-semibold text-xs">{item.itemName}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{item.subCategory}</Badge></TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px]">{item.serviceMethod}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{item.vendorName}</TableCell>
                      <TableCell className="text-xs font-bold">AED {item.unitPriceAED.toFixed(2)}</TableCell>
                      <TableCell className="text-xs font-bold text-amber-600">AED {item.expressPriceAED.toFixed(2)}</TableCell>
                      <TableCell className="text-center font-mono text-xs">{item.dailyCapacity} Pcs/Day</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-dashed rounded-xl bg-muted/10">
              <Boxes className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <h4 className="font-bold text-sm">Custom Inventory for {selectedCategory}</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                Select the Transportation Hub, Housekeeping, or Laundry tabs above to view synchronized service offerings and pricing catalogs.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Transportation Dialog */}
      <Dialog open={isEditTrnOpen} onOpenChange={setIsEditTrnOpen}>
        <DialogContent className="sm:max-w-[550px]">
          {editingTrnItem && (
            <form onSubmit={handleUpdateTrnItem}>
              <DialogHeader>
                <DialogTitle>Edit Transportation Offering: {editingTrnItem.serviceTitle}</DialogTitle>
                <DialogDescription>Modify ride details, rates, and vehicle specifications.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-trn-sku">SKU Code</Label>
                    <Input 
                      id="edit-trn-sku" 
                      value={trnFormData.sku}
                      onChange={e => setTrnFormData({...trnFormData, sku: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-trn-vendor">Vendor</Label>
                    <Select 
                      value={trnFormData.vendorName}
                      onValueChange={v => setTrnFormData({...trnFormData, vendorName: v})}
                    >
                      <SelectTrigger id="edit-trn-vendor"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Swift Airport Transfers">Swift Airport Transfers</SelectItem>
                        <SelectItem value="Apex Luxury Fleet">Apex Luxury Fleet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-trn-title">Service Title</Label>
                  <Input 
                    id="edit-trn-title" 
                    value={trnFormData.serviceTitle}
                    onChange={e => setTrnFormData({...trnFormData, serviceTitle: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-trn-price">Base Price (AED)</Label>
                    <Input 
                      id="edit-trn-price" 
                      type="number"
                      step="1.00"
                      value={trnFormData.priceAED}
                      onChange={e => setTrnFormData({...trnFormData, priceAED: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-trn-cap">Daily Trip Capacity</Label>
                    <Input 
                      id="edit-trn-cap" 
                      type="number"
                      value={trnFormData.dailyCapacity}
                      onChange={e => setTrnFormData({...trnFormData, dailyCapacity: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-trn-desc">Description</Label>
                  <Textarea 
                    id="edit-trn-desc" 
                    value={trnFormData.description}
                    onChange={e => setTrnFormData({...trnFormData, description: e.target.value})}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full">Update Transportation Offering</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorInventory;