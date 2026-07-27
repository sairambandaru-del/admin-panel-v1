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
  Bed,
  Moon,
  Droplets,
  Sparkle
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
  durationFormatted: string; // e.g. "90 min", "3 hours", "1 hour", "30 min"
  durationMinutes: number;
  priceAED: number;
  isIncludedInStay: boolean;
  dailyCapacity: number;
  isActive: boolean;
}

export interface CategoryInventoryItem {
  id: string;
  sku: string;
  itemName: string;
  vendorName: string;
  category: ServiceCategory;
  lastRestocked: string;
  unitCost: number;

  // Custom Category Attributes
  unitAddress?: string;
  roomType?: string;
  vehicleModel?: string;
  plateNumber?: string;
  medicalKitType?: string;
}

export const EXACT_14_CATEGORIES: Array<{ id: ServiceCategory; label: string; icon: React.ElementType }> = [
  { id: 'House keeping', label: 'House Keeping', icon: Home },
  { id: 'Laundry', label: 'Laundry', icon: Shirt },
  { id: 'Short term rental', label: 'Short Term Rental', icon: Building },
  { id: 'Car rental', label: 'Car Rental', icon: Car },
  { id: 'Doctor on call', label: 'Doctor on Call', icon: Stethoscope },
  { id: 'Leisure activities', label: 'Leisure Activities', icon: Compass },
  { id: 'Dining', label: 'Dining', icon: UtensilsCrossed },
  { id: 'Co-working', label: 'Co-working', icon: Laptop },
  { id: 'Wellness', label: 'Wellness', icon: HeartPulse },
  { id: 'Transportation', label: 'Transportation', icon: CarTaxiFront },
  { id: 'Chef on call', label: 'Chef on Call', icon: ChefHat },
  { id: 'In-house catering', label: 'Catering', icon: Utensils },
  { id: 'Grocery', label: 'Grocery', icon: ShoppingBasket },
  { id: 'Food delivery', label: 'Food Delivery', icon: ShoppingBag }
];

const VENDORS_LIST = [
  'Sparkle Cleaners',
  'Elite Housekeeping Co',
  'QuickWash Laundry',
  'Spin Cycle Dry Cleaners',
  'Skyline Property Mgmt',
  'Apex Luxury Fleet',
  'MedCall Pro Services',
  'Desert Safari Adventures',
  'Zuma Fine Dining',
  'WeWork Global Pass',
  'Zen Spa & Wellness',
  'Swift Airport Transfers',
  'Gourmet Chef Collective',
  'Feast & Fete Catering',
  'FreshMart Express',
  'Bistro Express'
];

// Structured Housekeeping Catalog matching exact frontend structure
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
  },
  {
    id: 'HKP-003',
    sku: 'SKU-HKP-KITCHEN',
    serviceTitle: 'Kitchen Cleaning',
    vendorName: 'Sparkle Cleaners',
    serviceType: 'Targeted Service',
    description: 'Full kitchen deep clean including appliances, counters, and cabinets',
    durationFormatted: '1 hour',
    durationMinutes: 60,
    priceAED: 60.00,
    isIncludedInStay: false,
    dailyCapacity: 25,
    isActive: true
  },
  {
    id: 'HKP-004',
    sku: 'SKU-HKP-LINEN',
    serviceTitle: 'Linen Change',
    vendorName: 'Elite Housekeeping Co',
    serviceType: 'Targeted Service',
    description: 'Fresh bed linen, pillowcases, and duvet cover replacement',
    durationFormatted: '30 min',
    durationMinutes: 30,
    priceAED: 40.00,
    isIncludedInStay: false,
    dailyCapacity: 50,
    isActive: true
  },
  {
    id: 'HKP-005',
    sku: 'SKU-HKP-TURNDOWN',
    serviceTitle: 'Turndown Service',
    vendorName: 'Elite Housekeeping Co',
    serviceType: 'Evening Service',
    description: 'Evening turndown with chocolates, water, and ambient lighting setup',
    durationFormatted: '20 min',
    durationMinutes: 20,
    priceAED: 30.00,
    isIncludedInStay: false,
    dailyCapacity: 30,
    isActive: true
  },
  {
    id: 'HKP-006',
    sku: 'SKU-HKP-TOWELS',
    serviceTitle: 'Extra Towels',
    vendorName: 'Elite Housekeeping Co',
    serviceType: 'Amenity Refill',
    description: 'Additional bath towels, hand towels, and face cloths delivered to your suite',
    durationFormatted: '15 min',
    durationMinutes: 15,
    priceAED: 25.00,
    isIncludedInStay: false,
    dailyCapacity: 80,
    isActive: true
  },
  {
    id: 'HKP-007',
    sku: 'SKU-HKP-TOILETRIES',
    serviceTitle: 'Toiletries Refill',
    vendorName: 'Elite Housekeeping Co',
    serviceType: 'Amenity Refill',
    description: 'Restock of premium shampoo, conditioner, body wash, soap, and dental kit',
    durationFormatted: '15 min',
    durationMinutes: 15,
    priceAED: 35.00,
    isIncludedInStay: false,
    dailyCapacity: 100,
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
  },
  {
    id: 'LND-102',
    sku: 'SKU-LND-SUIT-DC',
    itemName: "2-Piece Business Suit",
    vendorName: 'QuickWash Laundry',
    subCategory: 'Suits & Outerwear',
    serviceMethod: 'Dry Cleaning',
    unitPriceAED: 55.00,
    expressPriceAED: 85.00,
    packagingStyle: 'Garment Bag',
    dailyCapacity: 80,
    isActive: true
  },
  {
    id: 'LND-103',
    sku: 'SKU-LND-DRESS-DC',
    itemName: "Evening Dress / Silk Gown",
    vendorName: 'QuickWash Laundry',
    subCategory: 'Delicates',
    serviceMethod: 'Dry Cleaning',
    unitPriceAED: 65.00,
    expressPriceAED: 100.00,
    packagingStyle: 'Garment Bag',
    dailyCapacity: 50,
    isActive: true
  }
];

const VendorInventory = () => {
  const [housekeepingCatalog, setHousekeepingCatalog] = useState<HousekeepingServiceItem[]>(initialHousekeepingCatalog);
  const [laundryCatalog, setLaundryCatalog] = useState<LaundryServiceItem[]>(initialLaundryCatalog);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('House keeping');
  const [searchTerm, setSearchTerm] = useState('');
  const [hkFilter, setHkFilter] = useState('all');

  // Modals state for Housekeeping
  const [isAddHKOpen, setIsAddHKOpen] = useState(false);
  const [isEditHKOpen, setIsEditHKOpen] = useState(false);
  const [editingHKItem, setEditingHKItem] = useState<HousekeepingServiceItem | null>(null);

  const [hkFormData, setHkFormData] = useState<HousekeepingServiceItem>({
    id: '',
    sku: '',
    serviceTitle: '',
    vendorName: 'Sparkle Cleaners',
    serviceType: 'Targeted Service',
    description: '',
    durationFormatted: '30 min',
    durationMinutes: 30,
    priceAED: 40,
    isIncludedInStay: false,
    dailyCapacity: 30,
    isActive: true
  });

  const filteredHousekeepingItems = housekeepingCatalog.filter(item => {
    const matchesSearch = 
      item.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = hkFilter === 'all' || item.serviceType === hkFilter;

    return matchesSearch && matchesType;
  });

  const handleAddHousekeepingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hkFormData.serviceTitle || !hkFormData.sku) {
      showError("Please enter Service Title and SKU.");
      return;
    }

    const newItem: HousekeepingServiceItem = {
      ...hkFormData,
      id: `HKP-00${housekeepingCatalog.length + 1}`
    };

    setHousekeepingCatalog([...housekeepingCatalog, newItem]);
    setIsAddHKOpen(false);
    showSuccess(`Added "${newItem.serviceTitle}" to Housekeeping Services Catalog.`);
  };

  const handleOpenEditHK = (item: HousekeepingServiceItem) => {
    setEditingHKItem(item);
    setHkFormData(item);
    setIsEditHKOpen(true);
  };

  const handleUpdateHKItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHKItem) return;

    setHousekeepingCatalog(prev => prev.map(item => {
      if (item.id === editingHKItem.id) {
        return hkFormData;
      }
      return item;
    }));

    setIsEditHKOpen(false);
    setEditingHKItem(null);
    showSuccess(`Updated Housekeeping Service "${hkFormData.serviceTitle}".`);
  };

  const handleDeleteHKItem = (id: string, name: string) => {
    setHousekeepingCatalog(prev => prev.filter(i => i.id !== id));
    showSuccess(`Removed "${name}" from Housekeeping Catalog.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Housekeeping Services</CardTitle>
            <Home className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{housekeepingCatalog.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Configured Service Offerings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Base Complimentary Service</CardTitle>
            <Sparkles className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Daily Cleaning</div>
            <p className="text-xs text-muted-foreground mt-1">Included in Guest Stay</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Avg Add-on Price</CardTitle>
            <Tag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED 54.00</div>
            <p className="text-xs text-muted-foreground mt-1">Add-on service requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Daily Staff Slots</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {housekeepingCatalog.reduce((sum, item) => sum + item.dailyCapacity, 0)} Requests/Day
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active vendor capacity</p>
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

            {selectedCategory === 'House keeping' && (
              <Dialog open={isAddHKOpen} onOpenChange={setIsAddHKOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shrink-0">
                    <Plus className="w-4 h-4" /> Add Housekeeping Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form onSubmit={handleAddHousekeepingItem}>
                    <DialogHeader>
                      <DialogTitle>Add Housekeeping Service Offering</DialogTitle>
                      <DialogDescription>
                        Configure service details, duration, pricing, and guest mobile display options.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="hk-sku">SKU Code</Label>
                          <Input 
                            id="hk-sku" 
                            placeholder="e.g. SKU-HKP-CLEAN" 
                            value={hkFormData.sku}
                            onChange={e => setHkFormData({...hkFormData, sku: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="hk-vendor">Assigned Vendor</Label>
                          <Select 
                            value={hkFormData.vendorName}
                            onValueChange={v => setHkFormData({...hkFormData, vendorName: v})}
                          >
                            <SelectTrigger id="hk-vendor"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Sparkle Cleaners">Sparkle Cleaners</SelectItem>
                              <SelectItem value="Elite Housekeeping Co">Elite Housekeeping Co</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="hk-title">Service Title</Label>
                        <Input 
                          id="hk-title" 
                          placeholder="e.g. Deep Cleaning" 
                          value={hkFormData.serviceTitle}
                          onChange={e => setHkFormData({...hkFormData, serviceTitle: e.target.value})}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="hk-type">Service Type</Label>
                          <Select 
                            value={hkFormData.serviceType}
                            onValueChange={(v: any) => setHkFormData({...hkFormData, serviceType: v})}
                          >
                            <SelectTrigger id="hk-type"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Daily Service">Daily Service</SelectItem>
                              <SelectItem value="Deep Cleaning">Deep Cleaning</SelectItem>
                              <SelectItem value="Targeted Service">Targeted Service</SelectItem>
                              <SelectItem value="Amenity Refill">Amenity Refill</SelectItem>
                              <SelectItem value="Evening Service">Evening Service</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="hk-dur">Estimated Duration</Label>
                          <Input 
                            id="hk-dur" 
                            placeholder="e.g. 90 min, 3 hours" 
                            value={hkFormData.durationFormatted}
                            onChange={e => setHkFormData({...hkFormData, durationFormatted: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="hk-desc">Description for Guest Mobile App</Label>
                        <Textarea 
                          id="hk-desc" 
                          placeholder="Describe the service scope shown to guests..." 
                          value={hkFormData.description}
                          onChange={e => setHkFormData({...hkFormData, description: e.target.value})}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="hk-price">Price (AED)</Label>
                          <Input 
                            id="hk-price" 
                            type="number"
                            step="1.00"
                            disabled={hkFormData.isIncludedInStay}
                            value={hkFormData.isIncludedInStay ? 0 : hkFormData.priceAED}
                            onChange={e => setHkFormData({...hkFormData, priceAED: Number(e.target.value)})}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="hk-cap">Daily Request Capacity</Label>
                          <Input 
                            id="hk-cap" 
                            type="number"
                            value={hkFormData.dailyCapacity}
                            onChange={e => setHkFormData({...hkFormData, dailyCapacity: Number(e.target.value)})}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2 border-t">
                        <Switch 
                          id="hk-included"
                          checked={hkFormData.isIncludedInStay}
                          onCheckedChange={v => setHkFormData({...hkFormData, isIncludedInStay: v, priceAED: v ? 0 : 40})}
                        />
                        <Label htmlFor="hk-included" className="cursor-pointer text-xs font-semibold">
                          Mark as Included in Stay (AED 0 Complimentary)
                        </Label>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="submit" className="w-full">Save Housekeeping Service</Button>
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
              {selectedCategory === 'House keeping' && (
                <Select value={hkFilter} onValueChange={setHkFilter}>
                  <SelectTrigger className="w-[170px] h-9 text-xs">
                    <SelectValue placeholder="All Service Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Service Types</SelectItem>
                    <SelectItem value="Daily Service">Daily Service</SelectItem>
                    <SelectItem value="Deep Cleaning">Deep Cleaning</SelectItem>
                    <SelectItem value="Targeted Service">Targeted Service</SelectItem>
                    <SelectItem value="Amenity Refill">Amenity Refill</SelectItem>
                    <SelectItem value="Evening Service">Evening Service</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <div className="relative w-full xl:w-60 shrink-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search service title..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {selectedCategory === 'House keeping' ? (
            /* TAILORED HOUSEKEEPING SERVICE CATALOG TABLE (MATCHES FRONTEND APP) */
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHousekeepingItems.map(item => (
                    <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-xs font-bold">{item.sku}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xs text-foreground">{item.serviceTitle}</p>
                          {item.isIncludedInStay && (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[9px] px-1.5 py-0">
                              Included
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                          {item.serviceType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[280px]">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-xs font-medium font-mono">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{item.durationFormatted}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-muted-foreground">{item.vendorName}</TableCell>
                      <TableCell className="text-xs font-bold">
                        {item.isIncludedInStay ? (
                          <span className="text-emerald-600 font-bold">Included</span>
                        ) : (
                          <span className="text-foreground">AED {item.priceAED.toFixed(2)}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs font-bold">
                        {item.dailyCapacity} Requests/Day
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => handleOpenEditHK(item)}
                            title="Edit Offering"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteHKItem(item.id, item.serviceTitle)}
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
                Select the Housekeeping or Laundry tabs above to view synchronized service offerings and pricing catalogs.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Housekeeping Dialog */}
      <Dialog open={isEditHKOpen} onOpenChange={setIsEditHKOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {editingHKItem && (
            <form onSubmit={handleUpdateHKItem}>
              <DialogHeader>
                <DialogTitle>Edit Housekeeping Offering: {editingHKItem.serviceTitle}</DialogTitle>
                <DialogDescription>Modify service scope, price, and duration.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-hk-sku">SKU Code</Label>
                    <Input 
                      id="edit-hk-sku" 
                      value={hkFormData.sku}
                      onChange={e => setHkFormData({...hkFormData, sku: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-hk-vendor">Vendor</Label>
                    <Select 
                      value={hkFormData.vendorName}
                      onValueChange={v => setHkFormData({...hkFormData, vendorName: v})}
                    >
                      <SelectTrigger id="edit-hk-vendor"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sparkle Cleaners">Sparkle Cleaners</SelectItem>
                        <SelectItem value="Elite Housekeeping Co">Elite Housekeeping Co</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-hk-title">Service Title</Label>
                  <Input 
                    id="edit-hk-title" 
                    value={hkFormData.serviceTitle}
                    onChange={e => setHkFormData({...hkFormData, serviceTitle: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-hk-dur">Duration</Label>
                    <Input 
                      id="edit-hk-dur" 
                      value={hkFormData.durationFormatted}
                      onChange={e => setHkFormData({...hkFormData, durationFormatted: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-hk-price">Price (AED)</Label>
                    <Input 
                      id="edit-hk-price" 
                      type="number"
                      disabled={hkFormData.isIncludedInStay}
                      value={hkFormData.isIncludedInStay ? 0 : hkFormData.priceAED}
                      onChange={e => setHkFormData({...hkFormData, priceAED: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-hk-desc">Description</Label>
                  <Textarea 
                    id="edit-hk-desc" 
                    value={hkFormData.description}
                    onChange={e => setHkFormData({...hkFormData, description: e.target.value})}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t">
                  <Switch 
                    id="edit-hk-inc"
                    checked={hkFormData.isIncludedInStay}
                    onCheckedChange={v => setHkFormData({...hkFormData, isIncludedInStay: v, priceAED: v ? 0 : 40})}
                  />
                  <Label htmlFor="edit-hk-inc" className="cursor-pointer text-xs font-semibold">
                    Mark as Included in Stay (Complimentary)
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full">Update Service Offering</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorInventory;