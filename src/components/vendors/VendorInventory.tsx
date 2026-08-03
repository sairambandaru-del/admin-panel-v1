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
  CheckCircle2, 
  Edit2, 
  Trash2, 
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
  Tag,
  Shirt,
  Fuel,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { ServiceCategory } from './VendorServices';

export interface CarRentalItem {
  id: string;
  sku: string;
  vehicleName: string;
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
  availableVehiclesCount: number;
  isActive: boolean;
}

export interface GenericServiceItem {
  id: string;
  sku: string;
  category: ServiceCategory;
  title: string;
  vendorName: string;
  description: string;
  unitPriceAED: number;
  capacityOrStock: number;
  unitLabel: string; // e.g. "Per Trip", "Per Session", "Per Hour", "Per Item"
  badgeText?: string;
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

// Initial Catalogs
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
    availableVehiclesCount: 4,
    isActive: true
  }
];

const initialGenericCatalog: GenericServiceItem[] = [
  {
    id: 'TRN-001',
    sku: 'SKU-TRN-AIRPORT-DXB',
    category: 'Transportation',
    title: 'Airport Transfer (DXB & AUH)',
    vendorName: 'Swift Airport Transfers',
    description: 'Meet & greet transfers with chauffeur in Mercedes Maybach',
    unitPriceAED: 180.00,
    capacityOrStock: 40,
    unitLabel: 'Per Trip',
    badgeText: 'Zen Pool Eligible',
    isActive: true
  },
  {
    id: 'HKP-001',
    sku: 'SKU-HKP-DAILY',
    category: 'House keeping',
    title: 'Daily Suite Sanitization & Linen Refresh',
    vendorName: 'Sparkle Cleaners',
    description: 'Deep bathroom sanitization, bed making, dusting, and trash removal',
    unitPriceAED: 120.00,
    capacityOrStock: 30,
    unitLabel: 'Per Session',
    badgeText: 'Eco-certified',
    isActive: true
  },
  {
    id: 'LND-001',
    sku: 'SKU-LND-SUIT-DRY',
    category: 'Laundry',
    title: 'Men / Women 2-Piece Suit Dry Cleaning',
    vendorName: 'QuickWash Laundry',
    description: 'Premium dry cleaning and hanger pressing with garment cover',
    unitPriceAED: 45.00,
    capacityOrStock: 100,
    unitLabel: 'Per Suit',
    badgeText: 'Same-day Express',
    isActive: true
  },
  {
    id: 'DOC-001',
    sku: 'SKU-DOC-VISIT',
    category: 'Doctor on call',
    title: 'In-Suite General Practitioner Consultation',
    vendorName: 'CarePlus Mobile Health',
    description: '24/7 licensed GP consultation, vital checks, and immediate prescription',
    unitPriceAED: 350.00,
    capacityOrStock: 15,
    unitLabel: 'Per Visit',
    badgeText: 'DHA Licensed',
    isActive: true
  },
  {
    id: 'LEI-001',
    sku: 'SKU-LEI-YACHT',
    category: 'Leisure activities',
    title: 'Private Yacht Charter (50ft Luxury Cruiser)',
    vendorName: 'Ocean Breeze Marine',
    description: 'Includes captain, crew, soft drinks, ice, and sound system',
    unitPriceAED: 1200.00,
    capacityOrStock: 5,
    unitLabel: 'Per Hour',
    badgeText: 'VIP Experience',
    isActive: true
  },
  {
    id: 'DIN-001',
    sku: 'SKU-DIN-SEAFOOD',
    category: 'Dining',
    title: 'Signature Omakase Dining Voucher',
    vendorName: 'Gourmet Express',
    description: '7-course Japanese Omakase experience with priority seating',
    unitPriceAED: 450.00,
    capacityOrStock: 20,
    unitLabel: 'Per Guest',
    badgeText: 'Michelin Starred Chef',
    isActive: true
  },
  {
    id: 'CWK-001',
    sku: 'SKU-CWK-DESK',
    category: 'Co-working',
    title: 'Dedicated Executive Desk Pass',
    vendorName: 'Zenith Workspaces',
    description: 'High-speed fiber internet, free espresso bar, print services, and meeting room access',
    unitPriceAED: 85.00,
    capacityOrStock: 25,
    unitLabel: 'Per Day',
    badgeText: '24/7 Access',
    isActive: true
  },
  {
    id: 'WEL-001',
    sku: 'SKU-WEL-MASSAGE',
    category: 'Wellness',
    title: 'In-Suite Swedish Massage (90 Min)',
    vendorName: 'Serenity Spa Mobile',
    description: 'Professional therapist brings massage bed, aromatherapy oils, and calming music',
    unitPriceAED: 290.00,
    capacityOrStock: 12,
    unitLabel: 'Per Session',
    badgeText: 'Organic Essential Oils',
    isActive: true
  },
  {
    id: 'CHF-001',
    sku: 'SKU-CHF-PRIVATE',
    category: 'Chef on call',
    title: 'Private Chef Dining Experience (3-Course)',
    vendorName: 'Elite Culinary Group',
    description: 'Custom menu creation, ingredient sourcing, cooking, and kitchen cleanup',
    unitPriceAED: 650.00,
    capacityOrStock: 8,
    unitLabel: 'Per Event',
    badgeText: 'Personalized Menu',
    isActive: true
  },
  {
    id: 'CAT-001',
    sku: 'SKU-CAT-CANAPE',
    category: 'In-house catering',
    title: 'Gourmet Canapé & Mocktail Platter',
    vendorName: 'Elite Culinary Group',
    description: 'Selection of 24 handcrafted sweet and savory canapés with beverage service',
    unitPriceAED: 520.00,
    capacityOrStock: 15,
    unitLabel: 'Per Platter',
    badgeText: 'Serves 10 Guests',
    isActive: true
  },
  {
    id: 'GRO-001',
    sku: 'SKU-GRO-BASKET',
    category: 'Grocery',
    title: 'Organic Breakfast Welcome Basket',
    vendorName: 'Fresh Mart Essentials',
    description: 'Artisanal bread, organic eggs, fresh berries, local honey, and premium coffee beans',
    unitPriceAED: 145.00,
    capacityOrStock: 50,
    unitLabel: 'Per Basket',
    badgeText: 'Farm Fresh',
    isActive: true
  },
  {
    id: 'FOD-001',
    sku: 'SKU-FOD-BOWL',
    category: 'Food delivery',
    title: 'Artisanal Acai & Superfood Bowl',
    vendorName: 'Gourmet Express',
    description: 'Organic acai, guarana, fresh kiwi, strawberries, chia seeds, and almond butter',
    unitPriceAED: 48.00,
    capacityOrStock: 80,
    unitLabel: 'Per Order',
    badgeText: '30-min Express',
    isActive: true
  },
  {
    id: 'STR-001',
    sku: 'SKU-STR-PENTHOUSE',
    category: 'Short term rental',
    title: 'Marina Horizon Luxury Penthouse Suite',
    vendorName: 'Apex Luxury Fleet',
    description: '3-bedroom penthouse with private plunge pool, skyline views, and butler service',
    unitPriceAED: 2400.00,
    capacityOrStock: 2,
    unitLabel: 'Per Night',
    badgeText: 'Panoramic Sea View',
    isActive: true
  }
];

const VendorInventory = () => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('Car rental');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Catalogs state
  const [carRentalCatalog, setCarRentalCatalog] = useState<CarRentalItem[]>(initialCarRentalCatalog);
  const [genericCatalog, setGenericCatalog] = useState<GenericServiceItem[]>(initialGenericCatalog);

  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Car form data
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
    availableVehiclesCount: 5,
    isActive: true
  });

  // Generic form data
  const [genericFormData, setGenericFormData] = useState<GenericServiceItem>({
    id: '',
    sku: '',
    category: 'Transportation',
    title: '',
    vendorName: 'Apex Luxury Fleet',
    description: '',
    unitPriceAED: 150,
    capacityOrStock: 20,
    unitLabel: 'Per Session',
    badgeText: 'Verified Partner',
    isActive: true
  });

  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Reset generic form when category changes
  const handleCategoryChange = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setSearchTerm('');
    setGenericFormData(prev => ({
      ...prev,
      category,
      title: '',
      sku: `SKU-${category.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    }));
  };

  // Filtering
  const filteredCarItems = carRentalCatalog.filter(item => 
    item.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGenericItems = genericCatalog.filter(item => 
    item.category === selectedCategory && (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Add Item Handler
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategory === 'Car rental') {
      if (!carFormData.vehicleName || !carFormData.sku) {
        showError("Please fill in Vehicle Name and SKU.");
        return;
      }
      const newItem: CarRentalItem = {
        ...carFormData,
        id: `CAR-${Date.now()}`
      };
      setCarRentalCatalog([newItem, ...carRentalCatalog]);
      showSuccess(`Added "${newItem.vehicleName}" to Car Rental Catalog.`);
    } else {
      if (!genericFormData.title || !genericFormData.sku) {
        showError("Please fill in Offering Title and SKU.");
        return;
      }
      const newItem: GenericServiceItem = {
        ...genericFormData,
        category: selectedCategory,
        id: `GEN-${Date.now()}`
      };
      setGenericCatalog([newItem, ...genericCatalog]);
      showSuccess(`Added "${newItem.title}" to ${selectedCategory} Catalog.`);
    }

    setIsAddDialogOpen(false);
  };

  // Edit Item Handlers
  const handleOpenEdit = (item: CarRentalItem | GenericServiceItem) => {
    setEditingItemId(item.id);
    if (selectedCategory === 'Car rental') {
      setCarFormData(item as CarRentalItem);
    } else {
      setGenericFormData(item as GenericServiceItem);
    }
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItemId) return;

    if (selectedCategory === 'Car rental') {
      setCarRentalCatalog(prev => prev.map(i => i.id === editingItemId ? carFormData : i));
      showSuccess(`Updated "${carFormData.vehicleName}".`);
    } else {
      setGenericCatalog(prev => prev.map(i => i.id === editingItemId ? genericFormData : i));
      showSuccess(`Updated "${genericFormData.title}".`);
    }

    setIsEditDialogOpen(false);
    setEditingItemId(null);
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (selectedCategory === 'Car rental') {
      setCarRentalCatalog(prev => prev.filter(i => i.id !== id));
    } else {
      setGenericCatalog(prev => prev.filter(i => i.id !== id));
    }
    showSuccess(`Removed "${name}" from ${selectedCategory} catalog.`);
  };

  const activeCategoryObj = EXACT_14_CATEGORIES.find(c => c.id === selectedCategory);
  const ActiveCategoryIcon = activeCategoryObj?.icon || Boxes;

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Active Category</CardTitle>
            <ActiveCategoryIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedCategory}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedCategory === 'Car rental' 
                ? `${carRentalCatalog.length} Vehicles configured` 
                : `${filteredGenericItems.length} Offerings cataloged`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Service Delivery</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">100% On-Demand</div>
            <p className="text-xs text-muted-foreground mt-1">In-suite & mobile dispatch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Total Inventory Categories</CardTitle>
            <Boxes className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 Categories</div>
            <p className="text-xs text-muted-foreground mt-1">Integrated ecosystem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Active Vendor Network</CardTitle>
            <Tag className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Verified</div>
            <p className="text-xs text-muted-foreground mt-1">SLA & Quality monitored</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Directory & Action Area */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <ActiveCategoryIcon className="w-5 h-5 text-primary" />
                {selectedCategory} Inventory & Pricing Catalog
              </CardTitle>
              <CardDescription>
                Manage service offerings, unit pricing, SKU codes, and stock availability for <span className="font-bold text-primary">{selectedCategory}</span>.
              </CardDescription>
            </div>

            {/* ADD BUTTON FOR ALL 14 CATEGORIES */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shrink-0">
                  <Plus className="w-4 h-4" /> Add {selectedCategory} Offering
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleAddItem}>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <ActiveCategoryIcon className="w-5 h-5 text-primary" />
                      Add New {selectedCategory} Offering
                    </DialogTitle>
                    <DialogDescription>
                      Configure pricing, vendor partner details, and capacity for this {selectedCategory} item.
                    </DialogDescription>
                  </DialogHeader>

                  {selectedCategory === 'Car rental' ? (
                    /* CAR RENTAL FORM FIELDS */
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
                          <Label htmlFor="car-vendor">Vendor Partner</Label>
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
                          <Label>Category Class</Label>
                          <Select 
                            value={carFormData.categoryClass}
                            onValueChange={(v: any) => setCarFormData({...carFormData, categoryClass: v})}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
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
                          <Label>Transmission</Label>
                          <Select 
                            value={carFormData.transmission}
                            onValueChange={(v: any) => setCarFormData({...carFormData, transmission: v})}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Automatic">Automatic</SelectItem>
                              <SelectItem value="Manual">Manual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label>Fuel Type</Label>
                          <Select 
                            value={carFormData.fuelType}
                            onValueChange={(v: any) => setCarFormData({...carFormData, fuelType: v})}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
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
                          <Label>Daily Rate (AED)</Label>
                          <Input 
                            type="number"
                            value={carFormData.dailyRateAED}
                            onChange={e => setCarFormData({...carFormData, dailyRateAED: Number(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Weekly Rate (AED)</Label>
                          <Input 
                            type="number"
                            value={carFormData.weeklyRateAED}
                            onChange={e => setCarFormData({...carFormData, weeklyRateAED: Number(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Security Deposit (AED)</Label>
                          <Input 
                            type="number"
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
                  ) : (
                    /* GENERIC FORM FIELDS FOR ALL OTHER 13 CATEGORIES */
                    <div className="grid gap-4 py-4 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="gen-sku">SKU Code</Label>
                          <Input 
                            id="gen-sku" 
                            placeholder="e.g. SKU-SRV-101" 
                            value={genericFormData.sku}
                            onChange={e => setGenericFormData({...genericFormData, sku: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="gen-vendor">Vendor Partner</Label>
                          <Select 
                            value={genericFormData.vendorName}
                            onValueChange={v => setGenericFormData({...genericFormData, vendorName: v})}
                          >
                            <SelectTrigger id="gen-vendor"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Apex Luxury Fleet">Apex Luxury Fleet</SelectItem>
                              <SelectItem value="Swift Airport Transfers">Swift Airport Transfers</SelectItem>
                              <SelectItem value="Sparkle Cleaners">Sparkle Cleaners</SelectItem>
                              <SelectItem value="QuickWash Laundry">QuickWash Laundry</SelectItem>
                              <SelectItem value="CarePlus Mobile Health">CarePlus Mobile Health</SelectItem>
                              <SelectItem value="Gourmet Express">Gourmet Express</SelectItem>
                              <SelectItem value="Serenity Spa Mobile">Serenity Spa Mobile</SelectItem>
                              <SelectItem value="Fresh Mart Essentials">Fresh Mart Essentials</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="gen-title">Service / Item Title</Label>
                        <Input 
                          id="gen-title" 
                          placeholder={`e.g. Premium ${selectedCategory} Service`} 
                          value={genericFormData.title}
                          onChange={e => setGenericFormData({...genericFormData, title: e.target.value})}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="gen-desc">Description & Inclusions</Label>
                        <Textarea 
                          id="gen-desc" 
                          rows={2}
                          placeholder="Brief description of inclusions, turnaround time, or service details..." 
                          value={genericFormData.description}
                          onChange={e => setGenericFormData({...genericFormData, description: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="gen-price">Price (AED)</Label>
                          <Input 
                            id="gen-price" 
                            type="number"
                            step="5"
                            value={genericFormData.unitPriceAED}
                            onChange={e => setGenericFormData({...genericFormData, unitPriceAED: Number(e.target.value)})}
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="gen-label">Pricing Unit</Label>
                          <Select 
                            value={genericFormData.unitLabel}
                            onValueChange={v => setGenericFormData({...genericFormData, unitLabel: v})}
                          >
                            <SelectTrigger id="gen-label"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Per Session">Per Session</SelectItem>
                              <SelectItem value="Per Trip">Per Trip</SelectItem>
                              <SelectItem value="Per Item">Per Item</SelectItem>
                              <SelectItem value="Per Hour">Per Hour</SelectItem>
                              <SelectItem value="Per Day">Per Day</SelectItem>
                              <SelectItem value="Per Visit">Per Visit</SelectItem>
                              <SelectItem value="Per Guest">Per Guest</SelectItem>
                              <SelectItem value="Per Order">Per Order</SelectItem>
                              <SelectItem value="Per Night">Per Night</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="gen-stock">Daily Capacity / Stock</Label>
                          <Input 
                            id="gen-stock" 
                            type="number"
                            value={genericFormData.capacityOrStock}
                            onChange={e => setGenericFormData({...genericFormData, capacityOrStock: Number(e.target.value)})}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="gen-badge">Special Tag / Badge (Optional)</Label>
                        <Input 
                          id="gen-badge" 
                          placeholder="e.g. Express Delivery, DHA Certified, 24/7 Available" 
                          value={genericFormData.badgeText || ''}
                          onChange={e => setGenericFormData({...genericFormData, badgeText: e.target.value})}
                        />
                      </div>
                    </div>
                  )}

                  <DialogFooter>
                    <Button type="submit" className="w-full">
                      Save {selectedCategory} Offering
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Category Bar Navigation */}
          <div className="pt-4 border-t mt-4 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
            <div className="w-full xl:w-auto overflow-x-auto pb-1">
              <div className="flex gap-1.5 bg-muted/80 p-1.5 rounded-lg border min-w-max">
                {EXACT_14_CATEGORIES.map(tab => {
                  const Icon = tab.icon;
                  const isActive = selectedCategory === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleCategoryChange(tab.id)}
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

            {/* Search Input */}
            <div className="relative w-full xl:w-64 shrink-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${selectedCategory}...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {selectedCategory === 'Car rental' ? (
            /* CAR RENTAL TABLE */
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>SKU</TableHead>
                    <TableHead>Vehicle Model</TableHead>
                    <TableHead>Category Class</TableHead>
                    <TableHead>Specs</TableHead>
                    <TableHead>Daily Rate (AED)</TableHead>
                    <TableHead>Weekly Rate (AED)</TableHead>
                    <TableHead>Deposit</TableHead>
                    <TableHead>Perks</TableHead>
                    <TableHead className="text-center">Fleet Available</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCarItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-6 text-xs text-muted-foreground">
                        No car rental models found matching search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCarItems.map(item => (
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
                              onClick={() => handleOpenEdit(item)}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteItem(item.id, item.vehicleName)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* GENERIC CATALOG TABLE FOR ALL OTHER 13 CATEGORIES */
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>SKU</TableHead>
                    <TableHead>Offering Title & Vendor</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Tag / Badge</TableHead>
                    <TableHead>Unit Price (AED)</TableHead>
                    <TableHead className="text-center">Daily Capacity / Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGenericItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Boxes className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="font-bold text-xs">No items currently listed for {selectedCategory}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Click "Add {selectedCategory} Offering" above to create an offering.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredGenericItems.map(item => (
                      <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-xs font-bold">{item.sku}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-bold text-xs text-foreground">{item.title}</p>
                            <p className="text-[10px] text-muted-foreground">{item.vendorName}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                          {item.description || 'Standard service offering'}
                        </TableCell>
                        <TableCell>
                          {item.badgeText ? (
                            <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                              <Sparkles className="w-2.5 h-2.5 mr-1" />
                              {item.badgeText}
                            </Badge>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs font-bold text-foreground">
                          AED {item.unitPriceAED.toFixed(2)} <span className="text-[10px] font-normal text-muted-foreground">/ {item.unitLabel}</span>
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs font-bold">
                          {item.capacityOrStock} units/day
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => handleOpenEdit(item)}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteItem(item.id, item.title)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

      {/* Edit Offering Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <form onSubmit={handleUpdateItem}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-primary" />
                Edit {selectedCategory} Offering
              </DialogTitle>
              <DialogDescription>Modify offering specs and price details.</DialogDescription>
            </DialogHeader>

            {selectedCategory === 'Car rental' ? (
              <div className="grid gap-4 py-4 text-xs">
                <div className="space-y-1.5">
                  <Label>Vehicle Name</Label>
                  <Input 
                    value={carFormData.vehicleName}
                    onChange={e => setCarFormData({...carFormData, vehicleName: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label>Daily Rate (AED)</Label>
                    <Input 
                      type="number"
                      value={carFormData.dailyRateAED}
                      onChange={e => setCarFormData({...carFormData, dailyRateAED: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Weekly Rate (AED)</Label>
                    <Input 
                      type="number"
                      value={carFormData.weeklyRateAED}
                      onChange={e => setCarFormData({...carFormData, weeklyRateAED: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Deposit (AED)</Label>
                    <Input 
                      type="number"
                      value={carFormData.depositAED}
                      onChange={e => setCarFormData({...carFormData, depositAED: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 py-4 text-xs">
                <div className="space-y-1.5">
                  <Label>Service Title</Label>
                  <Input 
                    value={genericFormData.title}
                    onChange={e => setGenericFormData({...genericFormData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea 
                    rows={2}
                    value={genericFormData.description}
                    onChange={e => setGenericFormData({...genericFormData, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Unit Price (AED)</Label>
                    <Input 
                      type="number"
                      value={genericFormData.unitPriceAED}
                      onChange={e => setGenericFormData({...genericFormData, unitPriceAED: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Daily Capacity / Stock</Label>
                    <Input 
                      type="number"
                      value={genericFormData.capacityOrStock}
                      onChange={e => setGenericFormData({...genericFormData, capacityOrStock: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="submit" className="w-full">Update Offering</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorInventory;