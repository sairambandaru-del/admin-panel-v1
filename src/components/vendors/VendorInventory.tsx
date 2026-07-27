"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Tag
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { ServiceCategory } from './VendorServices';

export interface LaundryServiceItem {
  id: string;
  sku: string;
  itemName: string; // e.g. "Shirt - Wash & Iron"
  vendorName: string; // e.g. "QuickWash Laundry"
  subCategory: 'Clothing' | 'Suits & Outerwear' | 'Bedding & Linens' | 'Bulk Wash & Fold' | 'Delicates';
  serviceMethod: 'Wash & Iron' | 'Dry Cleaning' | 'Wash & Fold' | 'Pressing Only';
  unitPriceAED: number;
  expressPriceAED: number;
  packagingStyle: 'Hanger' | 'Folded & Boxed' | 'Garment Bag';
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

  // Custom Category Attributes for non-laundry
  unitAddress?: string;
  roomType?: string;
  vehicleModel?: string;
  plateNumber?: string;
  medicalKitType?: string;
}

export const EXACT_14_CATEGORIES: Array<{ id: ServiceCategory; label: string; icon: React.ElementType }> = [
  { id: 'Laundry', label: 'Laundry', icon: Shirt },
  { id: 'Short term rental', label: 'Short Term Rental', icon: Building },
  { id: 'Car rental', label: 'Car Rental', icon: Car },
  { id: 'Doctor on call', label: 'Doctor on Call', icon: Stethoscope },
  { id: 'House keeping', label: 'House Keeping', icon: Home },
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
  'QuickWash Laundry',
  'Spin Cycle Dry Cleaners',
  'Skyline Property Mgmt',
  'Apex Luxury Fleet',
  'MedCall Pro Services',
  'Sparkle Cleaners',
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

// Structured Laundry Price Catalog
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
  },
  {
    id: 'LND-104',
    sku: 'SKU-LND-TROUSER-WI',
    itemName: "Trousers / Chinos",
    vendorName: 'QuickWash Laundry',
    subCategory: 'Clothing',
    serviceMethod: 'Wash & Iron',
    unitPriceAED: 20.00,
    expressPriceAED: 32.00,
    packagingStyle: 'Hanger',
    dailyCapacity: 200,
    isActive: true
  },
  {
    id: 'LND-105',
    sku: 'SKU-LND-WF-BAG6KG',
    itemName: "Wash & Fold Load (6kg Bag)",
    vendorName: 'QuickWash Laundry',
    subCategory: 'Bulk Wash & Fold',
    serviceMethod: 'Wash & Fold',
    unitPriceAED: 75.00,
    expressPriceAED: 110.00,
    packagingStyle: 'Folded & Boxed',
    dailyCapacity: 100,
    isActive: true
  },
  {
    id: 'LND-106',
    sku: 'SKU-LND-KING-LINEN',
    itemName: "King Bed Sheet & Duvet Cover Set",
    vendorName: 'Spin Cycle Dry Cleaners',
    subCategory: 'Bedding & Linens',
    serviceMethod: 'Wash & Iron',
    unitPriceAED: 45.00,
    expressPriceAED: 70.00,
    packagingStyle: 'Folded & Boxed',
    dailyCapacity: 120,
    isActive: true
  },
  {
    id: 'LND-107',
    sku: 'SKU-LND-TOWEL-SET',
    itemName: "Bath Towels & Hand Towel Bundle (4 Pcs)",
    vendorName: 'Spin Cycle Dry Cleaners',
    subCategory: 'Bedding & Linens',
    serviceMethod: 'Wash & Fold',
    unitPriceAED: 30.00,
    expressPriceAED: 48.00,
    packagingStyle: 'Folded & Boxed',
    dailyCapacity: 150,
    isActive: true
  },
  {
    id: 'LND-108',
    sku: 'SKU-LND-BLAZER-DC',
    itemName: "Jacket / Blazer",
    vendorName: 'Spin Cycle Dry Cleaners',
    subCategory: 'Suits & Outerwear',
    serviceMethod: 'Dry Cleaning',
    unitPriceAED: 35.00,
    expressPriceAED: 55.00,
    packagingStyle: 'Garment Bag',
    dailyCapacity: 90,
    isActive: true
  }
];

const VendorInventory = () => {
  const [laundryCatalog, setLaundryCatalog] = useState<LaundryServiceItem[]>(initialLaundryCatalog);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('Laundry');
  const [searchTerm, setSearchTerm] = useState('');
  const [laundrySubFilter, setLaundrySubFilter] = useState('all');

  // Add Item Modal for Laundry
  const [isAddLaundryOpen, setIsAddOpen] = useState(false);
  const [isEditLaundryOpen, setIsEditOpen] = useState(false);
  const [editingLaundryItem, setEditingLaundryItem] = useState<LaundryServiceItem | null>(null);

  const [laundryFormData, setLaundryFormData] = useState<LaundryServiceItem>({
    id: '',
    sku: '',
    itemName: '',
    vendorName: 'QuickWash Laundry',
    subCategory: 'Clothing',
    serviceMethod: 'Wash & Iron',
    unitPriceAED: 20,
    expressPriceAED: 35,
    packagingStyle: 'Hanger',
    dailyCapacity: 100,
    isActive: true
  });

  const filteredLaundryItems = laundryCatalog.filter(item => {
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSub = laundrySubFilter === 'all' || item.subCategory === laundrySubFilter;

    return matchesSearch && matchesSub;
  });

  const handleAddLaundryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!laundryFormData.itemName || !laundryFormData.sku) {
      showError("Please enter Item Name and SKU.");
      return;
    }

    const newItem: LaundryServiceItem = {
      ...laundryFormData,
      id: `LND-${100 + laundryCatalog.length + 1}`
    };

    setLaundryCatalog([newItem, ...laundryCatalog]);
    setIsAddOpen(false);
    showSuccess(`Added "${newItem.itemName}" to Laundry Catalog.`);
  };

  const handleOpenEditLaundry = (item: LaundryServiceItem) => {
    setEditingLaundryItem(item);
    setLaundryFormData(item);
    setIsEditOpen(true);
  };

  const handleUpdateLaundryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLaundryItem) return;

    setLaundryCatalog(prev => prev.map(item => {
      if (item.id === editingLaundryItem.id) {
        return laundryFormData;
      }
      return item;
    }));

    setIsEditOpen(false);
    setEditingLaundryItem(null);
    showSuccess(`Updated laundry pricing for "${laundryFormData.itemName}".`);
  };

  const handleDeleteLaundryItem = (id: string, name: string) => {
    setLaundryCatalog(prev => prev.filter(i => i.id !== id));
    showSuccess(`Removed "${name}" from Laundry Catalog.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Laundry Service Items</CardTitle>
            <Shirt className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{laundryCatalog.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Configured Garment Rates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Avg. Dry Clean Rate</CardTitle>
            <Tag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED 51.60</div>
            <p className="text-xs text-muted-foreground mt-1">Standard 24h turnaround</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Express Surcharge</CardTitle>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">+55% Avg.</div>
            <p className="text-xs text-muted-foreground mt-1">6-Hour Same Day Delivery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Daily Processing Capacity</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {laundryCatalog.reduce((sum, item) => sum + item.dailyCapacity, 0)} Items/Day
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active vendor capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Inventory Directory Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Category Inventory & Pricing Catalog</CardTitle>
              <CardDescription>
                Tailored inventory structure per category. Selected category: <span className="font-bold text-primary">{selectedCategory}</span>
              </CardDescription>
            </div>

            {selectedCategory === 'Laundry' && (
              <Dialog open={isAddLaundryOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shrink-0">
                    <Plus className="w-4 h-4" /> Add Laundry Garment Rate
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form onSubmit={handleAddLaundryItem}>
                    <DialogHeader>
                      <DialogTitle>Add Laundry Garment / Service</DialogTitle>
                      <DialogDescription>
                        Configure garment pricing, service methods, and express options.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="sku">SKU Code</Label>
                          <Input 
                            id="sku" 
                            placeholder="e.g. SKU-LND-SUIT" 
                            value={laundryFormData.sku}
                            onChange={e => setLaundryFormData({...laundryFormData, sku: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="vendor">Laundry Vendor</Label>
                          <Select 
                            value={laundryFormData.vendorName}
                            onValueChange={v => setLaundryFormData({...laundryFormData, vendorName: v})}
                          >
                            <SelectTrigger id="vendor"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="QuickWash Laundry">QuickWash Laundry</SelectItem>
                              <SelectItem value="Spin Cycle Dry Cleaners">Spin Cycle Dry Cleaners</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="name">Garment / Item Title</Label>
                        <Input 
                          id="name" 
                          placeholder="e.g. 2-Piece Business Suit" 
                          value={laundryFormData.itemName}
                          onChange={e => setLaundryFormData({...laundryFormData, itemName: e.target.value})}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="subCat">Sub-Category</Label>
                          <Select 
                            value={laundryFormData.subCategory}
                            onValueChange={(v: any) => setLaundryFormData({...laundryFormData, subCategory: v})}
                          >
                            <SelectTrigger id="subCat"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Clothing">Clothing</SelectItem>
                              <SelectItem value="Suits & Outerwear">Suits & Outerwear</SelectItem>
                              <SelectItem value="Bedding & Linens">Bedding & Linens</SelectItem>
                              <SelectItem value="Bulk Wash & Fold">Bulk Wash & Fold</SelectItem>
                              <SelectItem value="Delicates">Delicates</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="method">Service Method</Label>
                          <Select 
                            value={laundryFormData.serviceMethod}
                            onValueChange={(v: any) => setLaundryFormData({...laundryFormData, serviceMethod: v})}
                          >
                            <SelectTrigger id="method"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Wash & Iron">Wash & Iron</SelectItem>
                              <SelectItem value="Dry Cleaning">Dry Cleaning</SelectItem>
                              <SelectItem value="Wash & Fold">Wash & Fold</SelectItem>
                              <SelectItem value="Pressing Only">Pressing Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="stdPrice">Standard Price (AED)</Label>
                          <Input 
                            id="stdPrice" 
                            type="number"
                            step="0.50"
                            value={laundryFormData.unitPriceAED}
                            onChange={e => setLaundryFormData({...laundryFormData, unitPriceAED: Number(e.target.value)})}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="expPrice">Express Price (AED)</Label>
                          <Input 
                            id="expPrice" 
                            type="number"
                            step="0.50"
                            value={laundryFormData.expressPriceAED}
                            onChange={e => setLaundryFormData({...laundryFormData, expressPriceAED: Number(e.target.value)})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="packaging">Finishing & Packaging</Label>
                          <Select 
                            value={laundryFormData.packagingStyle}
                            onValueChange={(v: any) => setLaundryFormData({...laundryFormData, packagingStyle: v})}
                          >
                            <SelectTrigger id="packaging"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Hanger">Hanger</SelectItem>
                              <SelectItem value="Folded & Boxed">Folded & Boxed</SelectItem>
                              <SelectItem value="Garment Bag">Garment Bag</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="cap">Daily Unit Capacity</Label>
                          <Input 
                            id="cap" 
                            type="number"
                            value={laundryFormData.dailyCapacity}
                            onChange={e => setLaundryFormData({...laundryFormData, dailyCapacity: Number(e.target.value)})}
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="submit" className="w-full">Save Garment Rate</Button>
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

            {/* Filter Search */}
            <div className="flex items-center gap-2 w-full xl:w-auto">
              {selectedCategory === 'Laundry' && (
                <Select value={laundrySubFilter} onValueChange={setLaundrySubFilter}>
                  <SelectTrigger className="w-[160px] h-9 text-xs">
                    <SelectValue placeholder="All Sub-Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sub-Categories</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Suits & Outerwear">Suits & Outerwear</SelectItem>
                    <SelectItem value="Bedding & Linens">Bedding & Linens</SelectItem>
                    <SelectItem value="Bulk Wash & Fold">Bulk Wash & Fold</SelectItem>
                    <SelectItem value="Delicates">Delicates</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <div className="relative w-full xl:w-60 shrink-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search garment or SKU..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {selectedCategory === 'Laundry' ? (
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
                    <TableHead>Express 6h Rate (AED)</TableHead>
                    <TableHead>Finishing Style</TableHead>
                    <TableHead className="text-center">Daily Capacity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLaundryItems.map(item => (
                    <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-xs font-bold">{item.sku}</TableCell>
                      <TableCell className="font-semibold text-xs text-foreground">
                        {item.itemName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                          {item.subCategory}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            item.serviceMethod === 'Dry Cleaning' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            item.serviceMethod === 'Wash & Iron' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            item.serviceMethod === 'Wash & Fold' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50'
                          }
                        >
                          {item.serviceMethod}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-muted-foreground">{item.vendorName}</TableCell>
                      <TableCell className="text-xs font-bold text-foreground">
                        AED {item.unitPriceAED.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-amber-600">
                        AED {item.expressPriceAED.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{item.packagingStyle}</TableCell>
                      <TableCell className="text-center font-mono text-xs font-bold">
                        {item.dailyCapacity} Pcs/Day
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => handleOpenEditLaundry(item)}
                            title="Edit Rate"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteLaundryItem(item.id, item.itemName)}
                            title="Delete Garment"
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
          ) : (
            <div className="p-8 text-center border-2 border-dashed rounded-xl bg-muted/10">
              <Boxes className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <h4 className="font-bold text-sm">Custom Inventory for {selectedCategory}</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                Select the Laundry tab above to inspect the synchronized Garment Price Catalog and Laundry Inventory.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Laundry Dialog */}
      <Dialog open={isEditLaundryOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {editingLaundryItem && (
            <form onSubmit={handleUpdateLaundryItem}>
              <DialogHeader>
                <DialogTitle>Edit Laundry Rate: {editingLaundryItem.itemName}</DialogTitle>
                <DialogDescription>Modify rates and capacities for this garment.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-sku">SKU Code</Label>
                    <Input 
                      id="edit-sku" 
                      value={laundryFormData.sku}
                      onChange={e => setLaundryFormData({...laundryFormData, sku: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-vendor">Laundry Vendor</Label>
                    <Select 
                      value={laundryFormData.vendorName}
                      onValueChange={v => setLaundryFormData({...laundryFormData, vendorName: v})}
                    >
                      <SelectTrigger id="edit-vendor"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="QuickWash Laundry">QuickWash Laundry</SelectItem>
                        <SelectItem value="Spin Cycle Dry Cleaners">Spin Cycle Dry Cleaners</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-name">Garment / Item Title</Label>
                  <Input 
                    id="edit-name" 
                    value={laundryFormData.itemName}
                    onChange={e => setLaundryFormData({...laundryFormData, itemName: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-std">Standard Price (AED)</Label>
                    <Input 
                      id="edit-std" 
                      type="number"
                      step="0.50"
                      value={laundryFormData.unitPriceAED}
                      onChange={e => setLaundryFormData({...laundryFormData, unitPriceAED: Number(e.target.value)})}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-exp">Express Price (AED)</Label>
                    <Input 
                      id="edit-exp" 
                      type="number"
                      step="0.50"
                      value={laundryFormData.expressPriceAED}
                      onChange={e => setLaundryFormData({...laundryFormData, expressPriceAED: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full">Update Laundry Item Rate</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorInventory;