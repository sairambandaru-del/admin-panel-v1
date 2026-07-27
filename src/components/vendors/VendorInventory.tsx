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
  Key,
  ShieldCheck,
  Calendar,
  Sparkles,
  Clock,
  Flame,
  Battery
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { ServiceCategory } from './VendorServices';

// Dynamic category-specific fields interface
export interface CategoryInventoryItem {
  id: string;
  sku: string;
  itemName: string;
  vendorName: string;
  category: ServiceCategory;
  lastRestocked: string;
  unitCost: number;

  // Custom Category Attributes
  // 1. Short term rental
  unitAddress?: string;
  roomType?: string;
  turnoverStatus?: 'Clean' | 'Dirty' | 'In Progress';
  smartLockId?: string;

  // 2. Car rental
  vehicleModel?: string;
  plateNumber?: string;
  mileageKm?: number;
  fuelBatteryLevel?: string;

  // 3. Doctor on call
  medicalKitType?: string;
  expiryDate?: string;
  isSterilized?: boolean;
  batchNumber?: string;

  // 4. Laundry
  chemicalVolumeLiters?: number;
  detergentType?: string;
  garmentBagStock?: number;

  // 5. House keeping
  linenTurnoverCount?: number;
  cleaningChemicalsCount?: number;
  equipmentCondition?: 'Optimal' | 'Maintenance Due';

  // 6. Leisure activities
  passVouchersCount?: number;
  equipmentUnits?: number;
  maxSlotCapacity?: number;

  // 7. Dining
  voucherCount?: number;
  cellarStockBottles?: number;
  tableReservationsCapacity?: number;

  // 8. Co-working
  keycardPassesCount?: number;
  deskType?: string;
  techDockingStations?: number;

  // 9. Wellness
  organicOilVolumeLiters?: number;
  treatmentKitsCount?: number;
  robesTowelsCount?: number;

  // 10. Transportation
  transportVehicleType?: string;
  childSafetySeats?: number;

  // 11. Chef on call
  knifeSetsCount?: number;
  portableStovesCount?: number;
  premeasuredKitsCount?: number;

  // 12. In-house catering
  chafingDishSets?: number;
  paxCapacity?: number;

  // 13. Grocery
  perishableExpiryDate?: string;
  refrigeratedBagsCount?: number;

  // 14. Food delivery
  thermalBagsCount?: number;
  ecoPackagingKitsCount?: number;
}

export const EXACT_14_CATEGORIES: Array<{ id: ServiceCategory; label: string; icon: React.ElementType }> = [
  { id: 'Short term rental', label: 'Short Term Rental', icon: Building },
  { id: 'Car rental', label: 'Car Rental', icon: Car },
  { id: 'Doctor on call', label: 'Doctor on Call', icon: Stethoscope },
  { id: 'Laundry', label: 'Laundry', icon: Shirt },
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
  'Skyline Property Mgmt',
  'Apex Luxury Fleet',
  'MedCall Pro Services',
  'QuickWash Laundry',
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

const initialCategorizedInventory: CategoryInventoryItem[] = [
  // 1. Short term rental
  { 
    id: 'INV-STR-101', 
    sku: 'SKU-STR-01', 
    itemName: 'Skyline Downtown Penthouse Suite 402 Inventory', 
    vendorName: 'Skyline Property Mgmt', 
    category: 'Short term rental', 
    unitCost: 1200, 
    lastRestocked: '2024-05-20',
    unitAddress: 'Downtown Suite 402, Tower A',
    roomType: 'Penthouse 2BR',
    turnoverStatus: 'Clean',
    smartLockId: 'SL-8821'
  },
  { 
    id: 'INV-STR-102', 
    sku: 'SKU-STR-02', 
    itemName: 'Palm Jumeirah Villa 05 Amenity Pack', 
    vendorName: 'Skyline Property Mgmt', 
    category: 'Short term rental', 
    unitCost: 2500, 
    lastRestocked: '2024-05-18',
    unitAddress: 'Palm Jumeirah Villa 05',
    roomType: '4BR Luxury Villa',
    turnoverStatus: 'In Progress',
    smartLockId: 'SL-9943'
  },

  // 2. Car rental
  { 
    id: 'INV-CAR-201', 
    sku: 'SKU-CAR-01', 
    itemName: 'Tesla Model 3 Long Range (White)', 
    vendorName: 'Apex Luxury Fleet', 
    category: 'Car rental', 
    unitCost: 450, 
    lastRestocked: '2024-05-19',
    vehicleModel: 'Tesla Model 3 LR 2024',
    plateNumber: 'DXB-M-9021',
    mileageKm: 12400,
    fuelBatteryLevel: '98% Battery'
  },
  { 
    id: 'INV-CAR-202', 
    sku: 'SKU-CAR-02', 
    itemName: 'Range Rover Sport HSE (Black)', 
    vendorName: 'Apex Luxury Fleet', 
    category: 'Car rental', 
    unitCost: 950, 
    lastRestocked: '2024-05-15',
    vehicleModel: 'Range Rover Sport HSE',
    plateNumber: 'DXB-A-7712',
    mileageKm: 8500,
    fuelBatteryLevel: 'Full Tank'
  },

  // 3. Doctor on call
  { 
    id: 'INV-DOC-301', 
    sku: 'SKU-DOC-01', 
    itemName: 'Emergency Cardiac & Diagnostic Field Kit', 
    vendorName: 'MedCall Pro Services', 
    category: 'Doctor on call', 
    unitCost: 650, 
    lastRestocked: '2024-05-10',
    medicalKitType: 'Cardiac & Trauma Kit A',
    expiryDate: '2025-12-31',
    isSterilized: true,
    batchNumber: 'MED-2024-099'
  },

  // 4. Laundry
  { 
    id: 'INV-LND-401', 
    sku: 'SKU-LND-01', 
    itemName: 'Commercial Eco-Detergent & Softener Drums', 
    vendorName: 'QuickWash Laundry', 
    category: 'Laundry', 
    unitCost: 180, 
    lastRestocked: '2024-05-12',
    chemicalVolumeLiters: 120,
    detergentType: 'Hypoallergenic Silk & Wool Detergent',
    garmentBagStock: 250
  },

  // 5. House keeping
  { 
    id: 'INV-HKP-501', 
    sku: 'SKU-HKP-01', 
    itemName: 'King Linen Turnover & Bathroom Refill Packs', 
    vendorName: 'Sparkle Cleaners', 
    category: 'House keeping', 
    unitCost: 150, 
    lastRestocked: '2024-05-17',
    linenTurnoverCount: 45,
    cleaningChemicalsCount: 30,
    equipmentCondition: 'Optimal'
  },

  // 6. Leisure activities
  { 
    id: 'INV-LEI-601', 
    sku: 'SKU-LEI-01', 
    itemName: 'Desert Safari Dune Buggy & VIP Pass Stock', 
    vendorName: 'Desert Safari Adventures', 
    category: 'Leisure activities', 
    unitCost: 350, 
    lastRestocked: '2024-05-14',
    passVouchersCount: 35,
    equipmentUnits: 12,
    maxSlotCapacity: 50
  },

  // 7. Dining
  { 
    id: 'INV-DIN-701', 
    sku: 'SKU-DIN-01', 
    itemName: 'Zuma VIP Chef Table Voucher & Wine Cellar Pass', 
    vendorName: 'Zuma Fine Dining', 
    category: 'Dining', 
    unitCost: 550, 
    lastRestocked: '2024-05-20',
    voucherCount: 20,
    cellarStockBottles: 140,
    tableReservationsCapacity: 8
  },

  // 8. Co-working
  { 
    id: 'INV-CWK-801', 
    sku: 'SKU-CWK-01', 
    itemName: 'WeWork Executive NFC Keycards & Docks', 
    vendorName: 'WeWork Global Pass', 
    category: 'Co-working', 
    unitCost: 85, 
    lastRestocked: '2024-05-11',
    keycardPassesCount: 60,
    deskType: 'Dedicated Private Cabin',
    techDockingStations: 15
  },

  // 9. Wellness
  { 
    id: 'INV-WLN-901', 
    sku: 'SKU-WLN-01', 
    itemName: 'In-Suite Aromatherapy & Massage Therapy Kits', 
    vendorName: 'Zen Spa & Wellness', 
    category: 'Wellness', 
    unitCost: 220, 
    lastRestocked: '2024-05-16',
    organicOilVolumeLiters: 15,
    treatmentKitsCount: 25,
    robesTowelsCount: 40
  },

  // 10. Transportation
  { 
    id: 'INV-TRN-1001', 
    sku: 'SKU-TRN-01', 
    itemName: 'Terminal Chauffeur Mercedes S-Class Fleet Pack', 
    vendorName: 'Swift Airport Transfers', 
    category: 'Transportation', 
    unitCost: 750, 
    lastRestocked: '2024-05-13',
    transportVehicleType: 'Mercedes S-Class Maybach',
    childSafetySeats: 8
  },

  // 11. Chef on call
  { 
    id: 'INV-CHF-1101', 
    sku: 'SKU-CHF-01', 
    itemName: 'Japanese Teppanyaki Portable Chef Station', 
    vendorName: 'Gourmet Chef Collective', 
    category: 'Chef on call', 
    unitCost: 1200, 
    lastRestocked: '2024-05-08',
    knifeSetsCount: 5,
    portableStovesCount: 4,
    premeasuredKitsCount: 18
  },

  // 12. In-house catering
  { 
    id: 'INV-CAT-1201', 
    sku: 'SKU-CAT-01', 
    itemName: 'Executive Banquet Chafing Warmer & Bar Setup', 
    vendorName: 'Feast & Fete Catering', 
    category: 'In-house catering', 
    unitCost: 1800, 
    lastRestocked: '2024-05-09',
    chafingDishSets: 10,
    paxCapacity: 100
  },

  // 13. Grocery
  { 
    id: 'INV-GRC-1301', 
    sku: 'SKU-GRC-01', 
    itemName: 'Organic Fresh Fruit & Artisanal Pantry Basket', 
    vendorName: 'FreshMart Express', 
    category: 'Grocery', 
    unitCost: 140, 
    lastRestocked: '2024-05-21',
    perishableExpiryDate: '2024-05-28',
    refrigeratedBagsCount: 30
  },

  // 14. Food delivery
  { 
    id: 'INV-FDL-1401', 
    sku: 'SKU-FDL-01', 
    itemName: 'Insulated Thermal Courier Bags & Eco Containers', 
    vendorName: 'Bistro Express', 
    category: 'Food delivery', 
    unitCost: 65, 
    lastRestocked: '2024-05-19',
    thermalBagsCount: 40,
    ecoPackagingKitsCount: 500
  }
];

const VendorInventory = () => {
  const [inventory, setInventory] = useState<CategoryInventoryItem[]>(initialCategorizedInventory);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('Short term rental');
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState('all');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryInventoryItem | null>(null);

  // Category-specific form data state
  const [formData, setFormData] = useState<CategoryInventoryItem>({
    id: '',
    sku: '',
    itemName: '',
    vendorName: VENDORS_LIST[0],
    category: selectedCategory,
    lastRestocked: new Date().toISOString().split('T')[0],
    unitCost: 100,

    // Category specific
    unitAddress: 'Downtown Suite 402',
    roomType: '2BR Penthouse',
    turnoverStatus: 'Clean',
    smartLockId: 'SL-1001',
    vehicleModel: 'Tesla Model 3 2024',
    plateNumber: 'DXB-X-882',
    mileageKm: 10000,
    fuelBatteryLevel: '100% Battery',
    medicalKitType: 'Trauma Diagnostic Kit',
    expiryDate: '2025-12-31',
    isSterilized: true,
    batchNumber: 'MED-101',
    chemicalVolumeLiters: 50,
    detergentType: 'Eco Organic Liquid',
    garmentBagStock: 100,
    linenTurnoverCount: 30,
    cleaningChemicalsCount: 20,
    equipmentCondition: 'Optimal',
    passVouchersCount: 25,
    equipmentUnits: 10,
    maxSlotCapacity: 40,
    voucherCount: 15,
    cellarStockBottles: 80,
    tableReservationsCapacity: 6,
    keycardPassesCount: 50,
    deskType: 'Executive Office Suite',
    techDockingStations: 10,
    organicOilVolumeLiters: 10,
    treatmentKitsCount: 15,
    robesTowelsCount: 30,
    transportVehicleType: 'Mercedes S-Class',
    childSafetySeats: 5,
    knifeSetsCount: 3,
    portableStovesCount: 2,
    premeasuredKitsCount: 10,
    chafingDishSets: 6,
    paxCapacity: 50,
    perishableExpiryDate: '2024-06-01',
    refrigeratedBagsCount: 20,
    thermalBagsCount: 25,
    ecoPackagingKitsCount: 200
  });

  const handleCategoryTabChange = (cat: ServiceCategory) => {
    setSelectedCategory(cat);
    setFormData(prev => ({
      ...prev,
      category: cat
    }));
  };

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = item.category === selectedCategory;
    const matchesVendor = vendorFilter === 'all' || item.vendorName === vendorFilter;
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.unitAddress && item.unitAddress.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.vehicleModel && item.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesVendor && matchesSearch;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemName || !formData.sku) {
      showError("Please fill out SKU and Item Name.");
      return;
    }

    const newItem: CategoryInventoryItem = {
      ...formData,
      id: `INV-${Date.now().toString().slice(-4)}`,
      category: selectedCategory,
      lastRestocked: new Date().toISOString().split('T')[0]
    };

    setInventory([newItem, ...inventory]);
    setIsAddOpen(false);
    showSuccess(`Inventory entry created for category "${selectedCategory}".`);
  };

  const handleOpenEdit = (item: CategoryInventoryItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsEditOpen(true);
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setInventory(prev => prev.map(item => {
      if (item.id === editingItem.id) {
        return {
          ...formData,
          id: editingItem.id,
          category: selectedCategory
        };
      }
      return item;
    }));

    setIsEditOpen(false);
    setEditingItem(null);
    showSuccess(`Updated inventory attributes for "${formData.itemName}".`);
  };

  const handleDeleteItem = (id: string, name: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
    showSuccess(`Removed "${name}" from inventory.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Analytics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Active Category</CardTitle>
            <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
              {selectedCategory}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredInventory.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Structured Inventory Entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Total Vendors</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{VENDORS_LIST.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Assigned service providers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Category Valuation</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              AED {filteredInventory.reduce((sum, item) => sum + item.unitCost, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Live active asset cost</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">System Sync</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">100%</div>
            <p className="text-xs text-muted-foreground mt-1">Synced with Vendor Services</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Inventory Component with 14 Category Tabs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Category-Specific Vendor Inventory</CardTitle>
              <CardDescription>
                Select a category below to see its custom inventory structure, custom attributes, and tailored fields.
              </CardDescription>
            </div>

            {/* Add New Inventory Item Dialog Trigger */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shrink-0">
                  <Plus className="w-4 h-4" /> Add Item to {selectedCategory}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleAddItem}>
                  <DialogHeader>
                    <DialogTitle>Add Inventory Item ({selectedCategory})</DialogTitle>
                    <DialogDescription>
                      Fill in the custom fields required for the {selectedCategory} inventory structure.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4 text-xs">
                    {/* Shared Primary Fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="add-sku">SKU / Item Code <span className="text-destructive">*</span></Label>
                        <Input 
                          id="add-sku" 
                          placeholder="e.g. SKU-101" 
                          value={formData.sku} 
                          onChange={e => setFormData({...formData, sku: e.target.value})}
                          required 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="add-vendor">Vendor Partner</Label>
                        <Select 
                          value={formData.vendorName} 
                          onValueChange={v => setFormData({...formData, vendorName: v})}
                        >
                          <SelectTrigger id="add-vendor">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {VENDORS_LIST.map(v => (
                              <SelectItem key={v} value={v}>{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="add-name">Item / Asset Title <span className="text-destructive">*</span></Label>
                      <Input 
                        id="add-name" 
                        placeholder="Title of asset or stock package..." 
                        value={formData.itemName} 
                        onChange={e => setFormData({...formData, itemName: e.target.value})}
                        required 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="add-cost">Asset Cost (AED)</Label>
                      <Input 
                        id="add-cost" 
                        type="number" 
                        value={formData.unitCost} 
                        onChange={e => setFormData({...formData, unitCost: Number(e.target.value)})}
                      />
                    </div>

                    {/* DYNAMIC CATEGORY SPECIFIC FORM FIELDS */}
                    <div className="border-t pt-3 space-y-3">
                      <p className="font-bold text-primary uppercase text-[10px] tracking-wider">
                        {selectedCategory} Custom Structure Attributes
                      </p>

                      {selectedCategory === 'Short term rental' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>Unit Address</Label>
                            <Input value={formData.unitAddress} onChange={e => setFormData({...formData, unitAddress: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Room Type</Label>
                            <Input value={formData.roomType} onChange={e => setFormData({...formData, roomType: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Turnover Status</Label>
                            <Select value={formData.turnoverStatus} onValueChange={(v: any) => setFormData({...formData, turnoverStatus: v})}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Clean">Clean</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Dirty">Dirty</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label>Smart Lock ID</Label>
                            <Input value={formData.smartLockId} onChange={e => setFormData({...formData, smartLockId: e.target.value})} />
                          </div>
                        </div>
                      )}

                      {selectedCategory === 'Car rental' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>Vehicle Model</Label>
                            <Input value={formData.vehicleModel} onChange={e => setFormData({...formData, vehicleModel: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Plate Number</Label>
                            <Input value={formData.plateNumber} onChange={e => setFormData({...formData, plateNumber: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Mileage (KM)</Label>
                            <Input type="number" value={formData.mileageKm} onChange={e => setFormData({...formData, mileageKm: Number(e.target.value)})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Fuel / Battery %</Label>
                            <Input value={formData.fuelBatteryLevel} onChange={e => setFormData({...formData, fuelBatteryLevel: e.target.value})} />
                          </div>
                        </div>
                      )}

                      {selectedCategory === 'Doctor on call' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>Medical Kit Type</Label>
                            <Input value={formData.medicalKitType} onChange={e => setFormData({...formData, medicalKitType: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Expiration Date</Label>
                            <Input type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Batch Number</Label>
                            <Input value={formData.batchNumber} onChange={e => setFormData({...formData, batchNumber: e.target.value})} />
                          </div>
                          <div className="flex items-center space-x-2 pt-4">
                            <Switch checked={formData.isSterilized} onCheckedChange={v => setFormData({...formData, isSterilized: v})} />
                            <Label>Sterilized Kit Verified</Label>
                          </div>
                        </div>
                      )}

                      {selectedCategory === 'Laundry' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>Chemical Volume (Liters)</Label>
                            <Input type="number" value={formData.chemicalVolumeLiters} onChange={e => setFormData({...formData, chemicalVolumeLiters: Number(e.target.value)})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Detergent Formula</Label>
                            <Input value={formData.detergentType} onChange={e => setFormData({...formData, detergentType: e.target.value})} />
                          </div>
                          <div className="space-y-1 col-span-2">
                            <Label>Garment Bag Stock Count</Label>
                            <Input type="number" value={formData.garmentBagStock} onChange={e => setFormData({...formData, garmentBagStock: Number(e.target.value)})} />
                          </div>
                        </div>
                      )}

                      {selectedCategory === 'House keeping' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>Linen Turnover Sets Count</Label>
                            <Input type="number" value={formData.linenTurnoverCount} onChange={e => setFormData({...formData, linenTurnoverCount: Number(e.target.value)})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Chemical Supplies Count</Label>
                            <Input type="number" value={formData.cleaningChemicalsCount} onChange={e => setFormData({...formData, cleaningChemicalsCount: Number(e.target.value)})} />
                          </div>
                        </div>
                      )}

                      {selectedCategory === 'Leisure activities' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>Pass Vouchers Available</Label>
                            <Input type="number" value={formData.passVouchersCount} onChange={e => setFormData({...formData, passVouchersCount: Number(e.target.value)})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Gear / Equipment Units</Label>
                            <Input type="number" value={formData.equipmentUnits} onChange={e => setFormData({...formData, equipmentUnits: Number(e.target.value)})} />
                          </div>
                        </div>
                      )}

                      {selectedCategory === 'Dining' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>Vouchers Count</Label>
                            <Input type="number" value={formData.voucherCount} onChange={e => setFormData({...formData, voucherCount: Number(e.target.value)})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Cellar Stock Bottles</Label>
                            <Input type="number" value={formData.cellarStockBottles} onChange={e => setFormData({...formData, cellarStockBottles: Number(e.target.value)})} />
                          </div>
                        </div>
                      )}

                      {selectedCategory === 'Co-working' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>NFC Keycard Passes Count</Label>
                            <Input type="number" value={formData.keycardPassesCount} onChange={e => setFormData({...formData, keycardPassesCount: Number(e.target.value)})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Desk / Cabin Type</Label>
                            <Input value={formData.deskType} onChange={e => setFormData({...formData, deskType: e.target.value})} />
                          </div>
                        </div>
                      )}

                      {selectedCategory === 'Wellness' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>Organic Oils (Liters)</Label>
                            <Input type="number" value={formData.organicOilVolumeLiters} onChange={e => setFormData({...formData, organicOilVolumeLiters: Number(e.target.value)})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Treatment Kits Count</Label>
                            <Input type="number" value={formData.treatmentKitsCount} onChange={e => setFormData({...formData, treatmentKitsCount: Number(e.target.value)})} />
                          </div>
                        </div>
                      )}

                      {selectedCategory === 'Transportation' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>Vehicle Type</Label>
                            <Input value={formData.transportVehicleType} onChange={e => setFormData({...formData, transportVehicleType: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Child Safety Seats</Label>
                            <Input type="number" value={formData.childSafetySeats} onChange={e => setFormData({...formData, childSafetySeats: Number(e.target.value)})} />
                          </div>
                        </div>
                      )}

                      {selectedCategory === 'Chef on call' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>Culinary Knife Sets</Label>
                            <Input type="number" value={formData.knifeSetsCount} onChange={e => setFormData({...formData, knifeSetsCount: Number(e.target.value)})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Portable Induction Stoves</Label>
                            <Input type="number" value={formData.portableStovesCount} onChange={e => setFormData({...formData, portableStovesCount: Number(e.target.value)})} />
                          </div>
                        </div>
                      )}

                      {selectedCategory === 'In-house catering' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>Chafing Dish Warmer Sets</Label>
                            <Input type="number" value={formData.chafingDishSets} onChange={e => setFormData({...formData, chafingDishSets: Number(e.target.value)})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Dinnerware Pax Capacity</Label>
                            <Input type="number" value={formData.paxCapacity} onChange={e => setFormData({...formData, paxCapacity: Number(e.target.value)})} />
                          </div>
                        </div>
                      )}

                      {selectedCategory === 'Grocery' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>Fresh Perishable Expiry</Label>
                            <Input type="date" value={formData.perishableExpiryDate} onChange={e => setFormData({...formData, perishableExpiryDate: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Refrigerated Totes Count</Label>
                            <Input type="number" value={formData.refrigeratedBagsCount} onChange={e => setFormData({...formData, refrigeratedBagsCount: Number(e.target.value)})} />
                          </div>
                        </div>
                      )}

                      {selectedCategory === 'Food delivery' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>Thermal Insulated Bags</Label>
                            <Input type="number" value={formData.thermalBagsCount} onChange={e => setFormData({...formData, thermalBagsCount: Number(e.target.value)})} />
                          </div>
                          <div className="space-y-1">
                            <Label>Eco Packaging Kits</Label>
                            <Input type="number" value={formData.ecoPackagingKitsCount} onChange={e => setFormData({...formData, ecoPackagingKitsCount: Number(e.target.value)})} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="submit" className="w-full">Save Entry to {selectedCategory}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* 14 Category Scrollable Tabs Bar */}
          <div className="pt-4 border-t mt-4 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
            <div className="w-full xl:w-auto overflow-x-auto pb-1">
              <div className="flex gap-1.5 bg-muted/80 p-1.5 rounded-lg border min-w-max">
                {EXACT_14_CATEGORIES.map(tab => {
                  const Icon = tab.icon;
                  const count = inventory.filter(b => b.category === tab.id).length;
                  const isActive = selectedCategory === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleCategoryTabChange(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        isActive 
                          ? 'bg-background text-foreground shadow-xs border font-bold' 
                          : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'opacity-70'}`} />
                      <span>{tab.label}</span>
                      {count > 0 && (
                        <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-primary/10 text-primary font-mono font-bold">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full xl:w-64 shrink-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search category assets..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {/* DYNAMIC CATEGORY TABLE DISPLAY */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>SKU / ID</TableHead>
                  <TableHead>Asset / Item Title</TableHead>
                  <TableHead>Vendor Partner</TableHead>

                  {/* DYNAMIC TABLE HEADERS PER CATEGORY */}
                  {selectedCategory === 'Short term rental' && (
                    <>
                      <TableHead>Unit Address</TableHead>
                      <TableHead>Room Type</TableHead>
                      <TableHead>Turnover Status</TableHead>
                      <TableHead>Smart Lock ID</TableHead>
                    </>
                  )}

                  {selectedCategory === 'Car rental' && (
                    <>
                      <TableHead>Vehicle Model</TableHead>
                      <TableHead>Plate Number</TableHead>
                      <TableHead>Mileage (KM)</TableHead>
                      <TableHead>Fuel / Battery %</TableHead>
                    </>
                  )}

                  {selectedCategory === 'Doctor on call' && (
                    <>
                      <TableHead>Diagnostic Kit Type</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Sterility Status</TableHead>
                      <TableHead>Batch No.</TableHead>
                    </>
                  )}

                  {selectedCategory === 'Laundry' && (
                    <>
                      <TableHead>Chemical Stock (L)</TableHead>
                      <TableHead>Detergent Formula</TableHead>
                      <TableHead>Garment Bags</TableHead>
                    </>
                  )}

                  {selectedCategory === 'House keeping' && (
                    <>
                      <TableHead>Turnover Linen Sets</TableHead>
                      <TableHead>Cleaning Supplies</TableHead>
                      <TableHead>Equipment Condition</TableHead>
                    </>
                  )}

                  {selectedCategory === 'Leisure activities' && (
                    <>
                      <TableHead>Pass Vouchers Available</TableHead>
                      <TableHead>Equipment Units</TableHead>
                      <TableHead>Max Capacity</TableHead>
                    </>
                  )}

                  {selectedCategory === 'Dining' && (
                    <>
                      <TableHead>Vouchers Count</TableHead>
                      <TableHead>Cellar Wine Bottles</TableHead>
                    </>
                  )}

                  {selectedCategory === 'Co-working' && (
                    <>
                      <TableHead>NFC Pass Cards</TableHead>
                      <TableHead>Desk / Cabin Type</TableHead>
                      <TableHead>Tech Docks</TableHead>
                    </>
                  )}

                  {selectedCategory === 'Wellness' && (
                    <>
                      <TableHead>Organic Oils (L)</TableHead>
                      <TableHead>Treatment Kits</TableHead>
                      <TableHead>Robes & Towels</TableHead>
                    </>
                  )}

                  {selectedCategory === 'Transportation' && (
                    <>
                      <TableHead>Vehicle Model</TableHead>
                      <TableHead>Child Safety Seats</TableHead>
                    </>
                  )}

                  {selectedCategory === 'Chef on call' && (
                    <>
                      <TableHead>Culinary Knife Sets</TableHead>
                      <TableHead>Portable Stoves</TableHead>
                      <TableHead>Ingredient Kits</TableHead>
                    </>
                  )}

                  {selectedCategory === 'In-house catering' && (
                    <>
                      <TableHead>Chafing Warmer Sets</TableHead>
                      <TableHead>Pax Dinnerware Capacity</TableHead>
                    </>
                  )}

                  {selectedCategory === 'Grocery' && (
                    <>
                      <TableHead>Perishable Expiry Date</TableHead>
                      <TableHead>Refrigerated Tote Bags</TableHead>
                    </>
                  )}

                  {selectedCategory === 'Food delivery' && (
                    <>
                      <TableHead>Thermal Insulated Bags</TableHead>
                      <TableHead>Eco Packaging Kits</TableHead>
                    </>
                  )}

                  <TableHead>Asset Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground text-xs">
                      No inventory entries created yet for category "{selectedCategory}".
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map(item => (
                    <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-xs font-bold">{item.sku}</TableCell>
                      <TableCell>
                        <p className="font-semibold text-xs">{item.itemName}</p>
                        <p className="text-[10px] text-muted-foreground">Restocked: {item.lastRestocked}</p>
                      </TableCell>
                      <TableCell className="text-xs font-medium">{item.vendorName}</TableCell>

                      {/* DYNAMIC CELL DATA PER CATEGORY */}
                      {selectedCategory === 'Short term rental' && (
                        <>
                          <TableCell className="text-xs font-medium">{item.unitAddress || '-'}</TableCell>
                          <TableCell className="text-xs">{item.roomType || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={item.turnoverStatus === 'Clean' ? 'default' : 'secondary'}>
                              {item.turnoverStatus || 'Clean'}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{item.smartLockId || '-'}</TableCell>
                        </>
                      )}

                      {selectedCategory === 'Car rental' && (
                        <>
                          <TableCell className="text-xs font-semibold">{item.vehicleModel || '-'}</TableCell>
                          <TableCell className="font-mono text-xs">{item.plateNumber || '-'}</TableCell>
                          <TableCell className="text-xs">{item.mileageKm ? `${item.mileageKm.toLocaleString()} KM` : '-'}</TableCell>
                          <TableCell className="text-xs font-bold text-emerald-600">{item.fuelBatteryLevel || '-'}</TableCell>
                        </>
                      )}

                      {selectedCategory === 'Doctor on call' && (
                        <>
                          <TableCell className="text-xs font-medium">{item.medicalKitType || '-'}</TableCell>
                          <TableCell className="text-xs font-mono">{item.expiryDate || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                              Sterilized
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{item.batchNumber || '-'}</TableCell>
                        </>
                      )}

                      {selectedCategory === 'Laundry' && (
                        <>
                          <TableCell className="text-xs font-bold">{item.chemicalVolumeLiters ? `${item.chemicalVolumeLiters} L` : '-'}</TableCell>
                          <TableCell className="text-xs">{item.detergentType || '-'}</TableCell>
                          <TableCell className="text-xs font-semibold">{item.garmentBagStock || '-'}</TableCell>
                        </>
                      )}

                      {selectedCategory === 'House keeping' && (
                        <>
                          <TableCell className="text-xs font-bold">{item.linenTurnoverCount || '-'} Sets</TableCell>
                          <TableCell className="text-xs">{item.cleaningChemicalsCount || '-'} Packs</TableCell>
                          <TableCell><Badge variant="outline">{item.equipmentCondition || 'Optimal'}</Badge></TableCell>
                        </>
                      )}

                      {selectedCategory === 'Leisure activities' && (
                        <>
                          <TableCell className="text-xs font-bold">{item.passVouchersCount || '-'} Vouchers</TableCell>
                          <TableCell className="text-xs">{item.equipmentUnits || '-'} Gear Units</TableCell>
                          <TableCell className="text-xs">{item.maxSlotCapacity || '-'} Slots</TableCell>
                        </>
                      )}

                      {selectedCategory === 'Dining' && (
                        <>
                          <TableCell className="text-xs font-bold">{item.voucherCount || '-'} Passes</TableCell>
                          <TableCell className="text-xs font-semibold text-primary">{item.cellarStockBottles || '-'} Bottles</TableCell>
                        </>
                      )}

                      {selectedCategory === 'Co-working' && (
                        <>
                          <TableCell className="text-xs font-bold">{item.keycardPassesCount || '-'} Passes</TableCell>
                          <TableCell className="text-xs">{item.deskType || '-'}</TableCell>
                          <TableCell className="text-xs">{item.techDockingStations || '-'} Docks</TableCell>
                        </>
                      )}

                      {selectedCategory === 'Wellness' && (
                        <>
                          <TableCell className="text-xs font-bold">{item.organicOilVolumeLiters ? `${item.organicOilVolumeLiters} L` : '-'}</TableCell>
                          <TableCell className="text-xs">{item.treatmentKitsCount || '-'} Kits</TableCell>
                          <TableCell className="text-xs">{item.robesTowelsCount || '-'} Packs</TableCell>
                        </>
                      )}

                      {selectedCategory === 'Transportation' && (
                        <>
                          <TableCell className="text-xs font-semibold">{item.transportVehicleType || '-'}</TableCell>
                          <TableCell className="text-xs font-bold">{item.childSafetySeats || '-'} Seats</TableCell>
                        </>
                      )}

                      {selectedCategory === 'Chef on call' && (
                        <>
                          <TableCell className="text-xs">{item.knifeSetsCount || '-'} Sets</TableCell>
                          <TableCell className="text-xs">{item.portableStovesCount || '-'} Units</TableCell>
                          <TableCell className="text-xs font-bold">{item.premeasuredKitsCount || '-'} Kits</TableCell>
                        </>
                      )}

                      {selectedCategory === 'In-house catering' && (
                        <>
                          <TableCell className="text-xs font-bold">{item.chafingDishSets || '-'} Sets</TableCell>
                          <TableCell className="text-xs font-semibold text-primary">{item.paxCapacity ? `${item.paxCapacity} Pax` : '-'}</TableCell>
                        </>
                      )}

                      {selectedCategory === 'Grocery' && (
                        <>
                          <TableCell className="text-xs font-mono font-bold text-amber-700">{item.perishableExpiryDate || '-'}</TableCell>
                          <TableCell className="text-xs">{item.refrigeratedBagsCount || '-'} Totes</TableCell>
                        </>
                      )}

                      {selectedCategory === 'Food delivery' && (
                        <>
                          <TableCell className="text-xs font-bold">{item.thermalBagsCount || '-'} Bags</TableCell>
                          <TableCell className="text-xs">{item.ecoPackagingKitsCount || '-'} Kits</TableCell>
                        </>
                      )}

                      <TableCell className="text-xs font-bold text-primary">AED {item.unitCost.toFixed(2)}</TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit Custom Inventory Structure"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteItem(item.id, item.itemName)}
                            title="Delete Item"
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
        </CardContent>
      </Card>

      {/* Edit Category Item Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {editingItem && (
            <form onSubmit={handleUpdateItem}>
              <DialogHeader>
                <DialogTitle>Edit Inventory Item ({selectedCategory})</DialogTitle>
                <DialogDescription>
                  Modify custom inventory fields for {editingItem.itemName}.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-sku">SKU / Item Code</Label>
                    <Input id="edit-sku" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-vendor">Vendor Partner</Label>
                    <Select value={formData.vendorName} onValueChange={v => setFormData({...formData, vendorName: v})}>
                      <SelectTrigger id="edit-vendor"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {VENDORS_LIST.map(v => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-name">Asset Title</Label>
                  <Input id="edit-name" value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} required />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-cost">Asset Cost (AED)</Label>
                  <Input id="edit-cost" type="number" value={formData.unitCost} onChange={e => setFormData({...formData, unitCost: Number(e.target.value)})} />
                </div>

                {/* EDIT CATEGORY SPECIFIC ATTRIBUTES */}
                <div className="border-t pt-3 space-y-3">
                  <p className="font-bold text-primary uppercase text-[10px] tracking-wider">
                    {selectedCategory} Custom Attributes
                  </p>

                  {selectedCategory === 'Short term rental' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><Label>Unit Address</Label><Input value={formData.unitAddress} onChange={e => setFormData({...formData, unitAddress: e.target.value})} /></div>
                      <div className="space-y-1"><Label>Room Type</Label><Input value={formData.roomType} onChange={e => setFormData({...formData, roomType: e.target.value})} /></div>
                    </div>
                  )}

                  {selectedCategory === 'Car rental' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><Label>Vehicle Model</Label><Input value={formData.vehicleModel} onChange={e => setFormData({...formData, vehicleModel: e.target.value})} /></div>
                      <div className="space-y-1"><Label>Plate Number</Label><Input value={formData.plateNumber} onChange={e => setFormData({...formData, plateNumber: e.target.value})} /></div>
                    </div>
                  )}

                  {selectedCategory === 'Doctor on call' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><Label>Diagnostic Kit Type</Label><Input value={formData.medicalKitType} onChange={e => setFormData({...formData, medicalKitType: e.target.value})} /></div>
                      <div className="space-y-1"><Label>Batch Number</Label><Input value={formData.batchNumber} onChange={e => setFormData({...formData, batchNumber: e.target.value})} /></div>
                    </div>
                  )}

                  {selectedCategory === 'Laundry' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><Label>Chemical Volume (L)</Label><Input type="number" value={formData.chemicalVolumeLiters} onChange={e => setFormData({...formData, chemicalVolumeLiters: Number(e.target.value)})} /></div>
                      <div className="space-y-1"><Label>Detergent Formula</Label><Input value={formData.detergentType} onChange={e => setFormData({...formData, detergentType: e.target.value})} /></div>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full">Update {selectedCategory} Structure</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorInventory;