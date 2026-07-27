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
  Briefcase,
  Fuel,
  Users,
  Shield
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
  vehicleModel: string;
  rideModeProfile: 'Business' | 'Relaxed' | 'VIP' | 'Green' | 'Focus';
  zenPoolEligible: boolean;
  aquaAccessEligible: boolean;
  onboardExtras: string[];
  priceAED: number;
  pricingUnit: 'Per Trip' | 'Per Hour' | 'Per Day' | '3-Day Package';
  dailyCapacity: number;
  isActive: boolean;
}

export interface CarRentalItem {
  id: string;
  sku: string;
  vehicleName: string; // e.g. "Range Rover Sport HSE 2024"
  vendorName: string;
  categoryClass: 'Luxury SUV' | 'Electric & Hybrid' | 'Executive Sedan' | 'Sports Car' | 'Compact Economy';
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Petrol' | 'Electric' | 'Hybrid';
  seats: number;
  dailyRateAED: number;
  weeklyRateAED: number;
  depositAED: number;
  insuranceIncluded: boolean;
  deliveryToUnit: boolean;
  zenPoolEligible: boolean;
  aquaAccessEligible: boolean;
  availableVehiclesCount: number;
  isActive: boolean;
}

export const EXACT_14_CATEGORIES: Array<{ id: ServiceCategory; label: string; icon: React.ElementType }> = [
  { id: 'Car rental', label: 'Car Rental', icon: Car },
  { id: 'Transportation', label: 'Transportation Hub', icon: CarTaxiFront },
  { id: 'House keeping', label: 'House Keeping', icon: Home },
  { id: 'Laundry', label: 'Laundry', icon: Shirt },
  { id: 'Short term rental', label: 'Short Term Rental', icon: Building },
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

// Car Rental Catalog
const initialCarRentalCatalog: CarRentalItem[] = [
  {
    id: 'CAR-001',
    sku: 'SKU-CAR-RR-SPORT',
    vehicleName: 'Range Rover Sport HSE 2024 (Silver)',
    vendorName: 'Apex Luxury Fleet',
    categoryClass: 'Luxury SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    dailyRateAED: 850.00,
    weeklyRateAED: 5200.00,
    depositAED: 2000.00,
    insuranceIncluded: true,
    deliveryToUnit: true,
    zenPoolEligible: true,
    aquaAccessEligible: true,
    availableVehiclesCount: 6,
    isActive: true
  },
  {
    id: 'CAR-002',
    sku: 'SKU-CAR-TESLA-M3',
    vehicleName: 'Tesla Model 3 Performance (White)',
    vendorName: 'Apex Luxury Fleet',
    categoryClass: 'Electric & Hybrid',
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 5,
    dailyRateAED: 450.00,
    weeklyRateAED: 2800.00,
    depositAED: 1500.00,
    insuranceIncluded: true,
    deliveryToUnit: true,
    zenPoolEligible: true,
    aquaAccessEligible: true,
    availableVehiclesCount: 12,
    isActive: true
  },
  {
    id: 'CAR-003',
    sku: 'SKU-CAR-MERC-S500',
    vehicleName: 'Mercedes-Benz S500 AMG Line (Black)',
    vendorName: 'Swift Airport Transfers',
    categoryClass: 'Executive Sedan',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    dailyRateAED: 950.00,
    weeklyRateAED: 6000.00,
    depositAED: 2500.00,
    insuranceIncluded: true,
    deliveryToUnit: true,
    zenPoolEligible: true,
    aquaAccessEligible: true,
    availableVehiclesCount: 4,
    isActive: true
  },
  {
    id: 'CAR-004',
    sku: 'SKU-CAR-PORSCHE-MACAN',
    vehicleName: 'Porsche Macan GTS (Carmine Red)',
    vendorName: 'Apex Luxury Fleet',
    categoryClass: 'Sports Car',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    dailyRateAED: 1100.00,
    weeklyRateAED: 7000.00,
    depositAED: 3000.00,
    insuranceIncluded: true,
    deliveryToUnit: true,
    zenPoolEligible: true,
    aquaAccessEligible: true,
    availableVehiclesCount: 3,
    isActive: true
  }
];

// Transportation Catalog
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
  }
];

// Housekeeping Catalog
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
  const [carRentalCatalog, setCarRentalCatalog] = useState<CarRentalItem[]>(initialCarRentalCatalog);
  const [transportationCatalog, setTransportationCatalog] = useState<TransportationServiceItem[]>(initialTransportationCatalog);
  const [housekeepingCatalog, setHousekeepingCatalog] = useState<HousekeepingServiceItem[]>(initialHousekeepingCatalog);
  const [laundryCatalog, setLaundryCatalog] = useState<LaundryServiceItem[]>(initialLaundryCatalog);
  
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('Car rental');
  const [searchTerm, setSearchTerm] = useState('');
  const [carClassFilter, setCarClassFilter] = useState('all');

  // Modals state for Car Rental
  const [isAddCarOpen, setIsAddCarOpen] = useState(false);
  const [isEditCarOpen, setIsEditCarOpen] = useState(false);
  const [editingCarItem, setEditingCarItem] = useState<CarRentalItem | null>(null);

  const [carFormData, setCarFormData] = useState<CarRentalItem>({
    id: '',
    sku: '',
    vehicleName: '',
    vendorName: 'Apex Luxury Fleet',
    categoryClass: 'Luxury SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    dailyRateAED: 750,
    weeklyRateAED: 4500,
    depositAED: 2000,
    insuranceIncluded: true,
    deliveryToUnit: true,
    zenPoolEligible: true,
    aquaAccessEligible: true,
    availableVehiclesCount: 5,
    isActive: true
  });

  const filteredCarItems = carRentalCatalog.filter(item => {
    const matchesSearch = 
      item.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = carClassFilter === 'all' || item.categoryClass === carClassFilter;

    return matchesSearch && matchesClass;
  });

  const handleAddCarItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carFormData.vehicleName || !carFormData.sku) {
      showError("Please enter Vehicle Name and SKU.");
      return;
    }

    const newItem: CarRentalItem = {
      ...carFormData,
      id: `CAR-00${carRentalCatalog.length + 1}`
    };

    setCarRentalCatalog([...carRentalCatalog, newItem]);
    setIsAddCarOpen(false);
    showSuccess(`Added "${newItem.vehicleName}" to Car Rental Fleet Catalog.`);
  };

  const handleOpenEditCar = (item: CarRentalItem) => {
    setEditingCarItem(item);
    setCarFormData(item);
    setIsEditCarOpen(true);
  };

  const handleUpdateCarItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCarItem) return;

    setCarRentalCatalog(prev => prev.map(item => {
      if (item.id === editingCarItem.id) {
        return carFormData;
      }
      return item;
    }));

    setIsEditCarOpen(false);
    setEditingCarItem(null);
    showSuccess(`Updated Car Rental offering "${carFormData.vehicleName}".`);
  };

  const handleDeleteCarItem = (id: string, name: string) => {
    setCarRentalCatalog(prev => prev.filter(i => i.id !== id));
    showSuccess(`Removed "${name}" from Car Rental Catalog.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Rental Fleet Vehicles</CardTitle>
            <Car className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carRentalCatalog.length} Models</div>
            <p className="text-xs text-muted-foreground mt-1">Configured Rental Models</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Delivery to Suite / Unit</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">100% Free Delivery</div>
            <p className="text-xs text-muted-foreground mt-1">Direct dropoff at property</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Avg. Daily Rate</CardTitle>
            <Tag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED 837.50</div>
            <p className="text-xs text-muted-foreground mt-1">Self-drive rentals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Total Fleet Available</CardTitle>
            <Boxes className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {carRentalCatalog.reduce((sum, item) => sum + item.availableVehiclesCount, 0)} Cars
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active vendor stock</p>
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

            {selectedCategory === 'Car rental' && (
              <Dialog open={isAddCarOpen} onOpenChange={setIsAddCarOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shrink-0">
                    <Plus className="w-4 h-4" /> Add Car Rental Fleet Model
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <form onSubmit={handleAddCarItem}>
                    <DialogHeader>
                      <DialogTitle>Add Car Rental Vehicle Offering</DialogTitle>
                      <DialogDescription>
                        Configure vehicle specs, daily/weekly rates, security deposit, and suite delivery options.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="car-sku">SKU Code</Label>
                          <Input 
                            id="car-sku" 
                            placeholder="e.g. SKU-CAR-ROVER" 
                            value={carFormData.sku}
                            onChange={e => setCarFormData({...carFormData, sku: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="car-vendor">Rental Vendor</Label>
                          <Select 
                            value={carFormData.vendorName}
                            onValueChange={v => setCarFormData({...carFormData, vendorName: v})}
                          >
                            <SelectTrigger id="car-vendor"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Apex Luxury Fleet">Apex Luxury Fleet</SelectItem>
                              <SelectItem value="Swift Airport Transfers">Swift Airport Transfers</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="car-name">Vehicle Name & Model Year</Label>
                        <Input 
                          id="car-name" 
                          placeholder="e.g. Range Rover Sport HSE 2024 (Silver)" 
                          value={carFormData.vehicleName}
                          onChange={e => setCarFormData({...carFormData, vehicleName: e.target.value})}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="car-class">Category Class</Label>
                          <Select 
                            value={carFormData.categoryClass}
                            onValueChange={(v: any) => setCarFormData({...carFormData, categoryClass: v})}
                          >
                            <SelectTrigger id="car-class"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Luxury SUV">Luxury SUV</SelectItem>
                              <SelectItem value="Electric & Hybrid">Electric & Hybrid</SelectItem>
                              <SelectItem value="Executive Sedan">Executive Sedan</SelectItem>
                              <SelectItem value="Sports Car">Sports Car</SelectItem>
                              <SelectItem value="Compact Economy">Compact Economy</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="car-trans">Transmission</Label>
                          <Select 
                            value={carFormData.transmission}
                            onValueChange={(v: any) => setCarFormData({...carFormData, transmission: v})}
                          >
                            <SelectTrigger id="car-trans"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Automatic">Automatic</SelectItem>
                              <SelectItem value="Manual">Manual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="car-fuel">Fuel Type</Label>
                          <Select 
                            value={carFormData.fuelType}
                            onValueChange={(v: any) => setCarFormData({...carFormData, fuelType: v})}
                          >
                            <SelectTrigger id="car-fuel"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Petrol">Petrol</SelectItem>
                              <SelectItem value="Electric">Electric</SelectItem>
                              <SelectItem value="Hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="car-daily">Daily Rate (AED)</Label>
                          <Input 
                            id="car-daily" 
                            type="number"
                            step="10.00"
                            value={carFormData.dailyRateAED}
                            onChange={e => setCarFormData({...carFormData, dailyRateAED: Number(e.target.value)})}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="car-weekly">Weekly Rate (AED)</Label>
                          <Input 
                            id="car-weekly" 
                            type="number"
                            step="50.00"
                            value={carFormData.weeklyRateAED}
                            onChange={e => setCarFormData({...carFormData, weeklyRateAED: Number(e.target.value)})}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="car-dep">Refundable Deposit (AED)</Label>
                          <Input 
                            id="car-dep" 
                            type="number"
                            step="100.00"
                            value={carFormData.depositAED}
                            onChange={e => setCarFormData({...carFormData, depositAED: Number(e.target.value)})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t text-xs">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="car-ins"
                            checked={carFormData.insuranceIncluded}
                            onCheckedChange={v => setCarFormData({...carFormData, insuranceIncluded: v})}
                          />
                          <Label htmlFor="car-ins" className="cursor-pointer font-semibold">
                            Full Insurance Included
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="car-del"
                            checked={carFormData.deliveryToUnit}
                            onCheckedChange={v => setCarFormData({...carFormData, deliveryToUnit: v})}
                          />
                          <Label htmlFor="car-del" className="cursor-pointer font-semibold">
                            Direct Delivery to Unit
                          </Label>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="submit" className="w-full">Save Car Model</Button>
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
              {selectedCategory === 'Car rental' && (
                <Select value={carClassFilter} onValueChange={setCarClassFilter}>
                  <SelectTrigger className="w-[180px] h-9 text-xs">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vehicle Classes</SelectItem>
                    <SelectItem value="Luxury SUV">Luxury SUV</SelectItem>
                    <SelectItem value="Electric & Hybrid">Electric & Hybrid</SelectItem>
                    <SelectItem value="Executive Sedan">Executive Sedan</SelectItem>
                    <SelectItem value="Sports Car">Sports Car</SelectItem>
                    <SelectItem value="Compact Economy">Compact Economy</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <div className="relative w-full xl:w-60 shrink-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search car model or SKU..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {selectedCategory === 'Car rental' ? (
            /* TAILORED CAR RENTAL FLEET CATALOG TABLE */
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>SKU</TableHead>
                    <TableHead>Vehicle Model Name</TableHead>
                    <TableHead>Category Class</TableHead>
                    <TableHead>Specs (Transmission / Fuel)</TableHead>
                    <TableHead>Daily Rate (AED)</TableHead>
                    <TableHead>Weekly Rate (AED)</TableHead>
                    <TableHead>Security Deposit</TableHead>
                    <TableHead>Service Perks</TableHead>
                    <TableHead className="text-center">Fleet Available</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCarItems.map(item => (
                    <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-xs font-bold">{item.sku}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-xs text-foreground">{item.vehicleName}</p>
                          <p className="text-[10px] text-muted-foreground">{item.vendorName}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                          {item.categoryClass}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5 text-[11px]">
                          <p className="font-medium text-foreground">{item.transmission} • {item.seats} Seats</p>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Fuel className="w-3 h-3 text-primary" /> {item.fuelType}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-foreground">
                        AED {item.dailyRateAED.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-emerald-600">
                        AED {item.weeklyRateAED.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        AED {item.depositAED.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {item.insuranceIncluded && (
                            <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-800 border-emerald-300 w-fit py-0">
                              <Shield className="w-2.5 h-2.5 mr-1 text-emerald-600" /> Full Insurance
                            </Badge>
                          )}
                          {item.deliveryToUnit && (
                            <Badge variant="outline" className="text-[9px] bg-blue-50 text-blue-800 border-blue-300 w-fit py-0">
                              <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-blue-600" /> Suite Delivery
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs font-bold">
                        {item.availableVehiclesCount} Cars
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => handleOpenEditCar(item)}
                            title="Edit Vehicle Specs"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteCarItem(item.id, item.vehicleName)}
                            title="Delete Car Model"
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
          ) : selectedCategory === 'Transportation' ? (
            /* TAILORED TRANSPORTATION HUB CATALOG TABLE */
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>SKU</TableHead>
                    <TableHead>Ride Service Title</TableHead>
                    <TableHead>Ride Type</TableHead>
                    <TableHead>Assigned Vehicle / Fleet ID</TableHead>
                    <TableHead>Eligibility Badges</TableHead>
                    <TableHead>Rate (AED)</TableHead>
                    <TableHead className="text-center">Daily Capacity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transportationCatalog.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs font-bold">{item.sku}</TableCell>
                      <TableCell className="font-bold text-xs">{item.serviceTitle}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{item.rideType}</Badge></TableCell>
                      <TableCell className="text-xs">{item.vehicleModel}</TableCell>
                      <TableCell><Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[9px]">Zen Pool Eligible</Badge></TableCell>
                      <TableCell className="text-xs font-bold">AED {item.priceAED.toFixed(2)}</TableCell>
                      <TableCell className="text-center font-mono text-xs">{item.dailyCapacity} Trips/Day</TableCell>
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
                Select the Car Rental or Transportation Hub tabs above to inspect synchronized fleet offerings and pricing catalogs.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Car Rental Dialog */}
      <Dialog open={isEditCarOpen} onOpenChange={setIsEditCarOpen}>
        <DialogContent className="sm:max-w-[550px]">
          {editingCarItem && (
            <form onSubmit={handleUpdateCarItem}>
              <DialogHeader>
                <DialogTitle>Edit Car Rental Model: {editingCarItem.vehicleName}</DialogTitle>
                <DialogDescription>Modify rates, security deposit, and fleet availability.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-car-sku">SKU Code</Label>
                    <Input 
                      id="edit-car-sku" 
                      value={carFormData.sku}
                      onChange={e => setCarFormData({...carFormData, sku: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-car-vendor">Vendor</Label>
                    <Select 
                      value={carFormData.vendorName}
                      onValueChange={v => setCarFormData({...carFormData, vendorName: v})}
                    >
                      <SelectTrigger id="edit-car-vendor"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Apex Luxury Fleet">Apex Luxury Fleet</SelectItem>
                        <SelectItem value="Swift Airport Transfers">Swift Airport Transfers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-car-name">Vehicle Name</Label>
                  <Input 
                    id="edit-car-name" 
                    value={carFormData.vehicleName}
                    onChange={e => setCarFormData({...carFormData, vehicleName: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-car-daily">Daily Rate (AED)</Label>
                    <Input 
                      id="edit-car-daily" 
                      type="number"
                      value={carFormData.dailyRateAED}
                      onChange={e => setCarFormData({...carFormData, dailyRateAED: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-car-weekly">Weekly Rate (AED)</Label>
                    <Input 
                      id="edit-car-weekly" 
                      type="number"
                      value={carFormData.weeklyRateAED}
                      onChange={e => setCarFormData({...carFormData, weeklyRateAED: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-car-dep">Deposit (AED)</Label>
                    <Input 
                      id="edit-car-dep" 
                      type="number"
                      value={carFormData.depositAED}
                      onChange={e => setCarFormData({...carFormData, depositAED: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full">Update Vehicle Model</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorInventory;