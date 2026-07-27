"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  DollarSign
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { ServiceCategory } from './VendorServices';

export interface InventoryItem {
  id: string;
  sku: string;
  itemName: string;
  vendorName: string;
  category: ServiceCategory;
  quantity: number;
  minThreshold: number;
  unitCost: number;
  lastRestocked: string;
}

export const EXACT_14_CATEGORIES: ServiceCategory[] = [
  'Short term rental',
  'Leisure activities',
  'Dining',
  'Co-working',
  'Wellness',
  'Laundry',
  'Car rental',
  'Transportation',
  'Chef on call',
  'In-house catering',
  'Doctor on call',
  'Grocery',
  'Food delivery',
  'House keeping'
];

const VENDORS_LIST = [
  'Skyline Property Mgmt',
  'Desert Safari Adventures',
  'Zuma Fine Dining',
  'WeWork Global Pass',
  'Zen Spa & Wellness',
  'QuickWash Laundry',
  'Apex Luxury Fleet',
  'Swift Airport Transfers',
  'Gourmet Chef Collective',
  'Feast & Fete Catering',
  'MedCall Pro Services',
  'FreshMart Express',
  'Bistro Express',
  'Sparkle Cleaners'
];

const initialInventory: InventoryItem[] = [
  { id: 'INV-101', sku: 'SKU-STR-001', itemName: 'Luxury Suite Amenity Kit & Welcome Pack', vendorName: 'Skyline Property Mgmt', category: 'Short term rental', quantity: 24, minThreshold: 10, unitCost: 120, lastRestocked: '2024-05-18' },
  { id: 'INV-102', sku: 'SKU-LEI-001', itemName: 'Desert Safari VIP Experience Pass', vendorName: 'Desert Safari Adventures', category: 'Leisure activities', quantity: 15, minThreshold: 5, unitCost: 450, lastRestocked: '2024-05-15' },
  { id: 'INV-103', sku: 'SKU-DIN-001', itemName: 'Zuma Chef Tasting Menu Voucher Pack', vendorName: 'Zuma Fine Dining', category: 'Dining', quantity: 30, minThreshold: 8, unitCost: 350, lastRestocked: '2024-05-20' },
  { id: 'INV-104', sku: 'SKU-CWK-001', itemName: 'WeWork Executive Day Keycards', vendorName: 'WeWork Global Pass', category: 'Co-working', quantity: 50, minThreshold: 15, unitCost: 85, lastRestocked: '2024-05-12' },
  { id: 'INV-105', sku: 'SKU-WLN-001', itemName: 'Organic Massage Oils & Aromatherapy Set', vendorName: 'Zen Spa & Wellness', category: 'Wellness', quantity: 4, minThreshold: 12, unitCost: 95, lastRestocked: '2024-05-02' },
  { id: 'INV-106', sku: 'SKU-LND-001', itemName: 'Heavy Duty Eco Laundry Detergent (20L)', vendorName: 'QuickWash Laundry', category: 'Laundry', quantity: 0, minThreshold: 5, unitCost: 180, lastRestocked: '2024-04-20' },
  { id: 'INV-107', sku: 'SKU-LND-002', itemName: 'Hypoallergenic Fabric Softener (15L)', vendorName: 'QuickWash Laundry', category: 'Laundry', quantity: 18, minThreshold: 10, unitCost: 120, lastRestocked: '2024-05-15' },
  { id: 'INV-108', sku: 'SKU-CAR-001', itemName: 'Tesla Model 3 Key Cards & Charging Adapters', vendorName: 'Apex Luxury Fleet', category: 'Car rental', quantity: 8, minThreshold: 10, unitCost: 250, lastRestocked: '2024-05-01' },
  { id: 'INV-109', sku: 'SKU-TRN-001', itemName: 'Executive Sedan Child Safety Seats', vendorName: 'Swift Airport Transfers', category: 'Transportation', quantity: 15, minThreshold: 8, unitCost: 310, lastRestocked: '2024-05-12' },
  { id: 'INV-110', sku: 'SKU-CHF-001', itemName: '3-Course Gourmet Chef Pre-measured Ingredient Kit', vendorName: 'Gourmet Chef Collective', category: 'Chef on call', quantity: 6, minThreshold: 5, unitCost: 450, lastRestocked: '2024-05-05' },
  { id: 'INV-111', sku: 'SKU-CAT-001', itemName: 'Executive Banquet Chafing Dish Set & Fuel', vendorName: 'Feast & Fete Catering', category: 'In-house catering', quantity: 12, minThreshold: 4, unitCost: 550, lastRestocked: '2024-05-14' },
  { id: 'INV-112', sku: 'SKU-DOC-001', itemName: 'Emergency Diagnostic & Medical Kit', vendorName: 'MedCall Pro Services', category: 'Doctor on call', quantity: 10, minThreshold: 6, unitCost: 380, lastRestocked: '2024-05-11' },
  { id: 'INV-113', sku: 'SKU-GRC-001', itemName: 'Organic Produce & Grocery Basket', vendorName: 'FreshMart Express', category: 'Grocery', quantity: 22, minThreshold: 10, unitCost: 120, lastRestocked: '2024-05-20' },
  { id: 'INV-114', sku: 'SKU-FDL-001', itemName: 'Thermal Meal Insulated Delivery Bags', vendorName: 'Bistro Express', category: 'Food delivery', quantity: 35, minThreshold: 15, unitCost: 65, lastRestocked: '2024-05-17' },
  { id: 'INV-115', sku: 'SKU-HKP-001', itemName: 'Premium Linen Turnover Sets (King)', vendorName: 'Sparkle Cleaners', category: 'House keeping', quantity: 12, minThreshold: 20, unitCost: 150, lastRestocked: '2024-05-10' },
  { id: 'INV-116', sku: 'SKU-HKP-002', itemName: 'Standard Turnover Cleaning Kit', vendorName: 'Sparkle Cleaners', category: 'House keeping', quantity: 85, minThreshold: 30, unitCost: 45, lastRestocked: '2024-05-18' }
];

const VendorInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    sku: '',
    itemName: '',
    vendorName: VENDORS_LIST[0],
    category: EXACT_14_CATEGORIES[0],
    quantity: 10,
    minThreshold: 10,
    unitCost: 50
  });

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return 'Out of Stock';
    if (item.quantity <= item.minThreshold) return 'Low Stock';
    return 'In Stock';
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVendor = vendorFilter === 'all' || item.vendorName === vendorFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    const status = getStockStatus(item);
    const matchesStatus = statusFilter === 'all' || status === statusFilter;

    return matchesSearch && matchesVendor && matchesCategory && matchesStatus;
  });

  // Analytics Metrics
  const totalItemsCount = inventory.length;
  const lowStockCount = inventory.filter(i => i.quantity > 0 && i.quantity <= i.minThreshold).length;
  const outOfStockCount = inventory.filter(i => i.quantity === 0).length;
  const totalValuation = inventory.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemName || !formData.sku) {
      showError("Please enter Item Name and SKU.");
      return;
    }

    const newItem: InventoryItem = {
      id: `INV-${100 + inventory.length + 1}`,
      sku: formData.sku,
      itemName: formData.itemName,
      vendorName: formData.vendorName,
      category: formData.category as ServiceCategory,
      quantity: Number(formData.quantity),
      minThreshold: Number(formData.minThreshold),
      unitCost: Number(formData.unitCost),
      lastRestocked: new Date().toISOString().split('T')[0]
    };

    setInventory([newItem, ...inventory]);
    setIsAddOpen(false);
    setFormData({
      sku: '',
      itemName: '',
      vendorName: VENDORS_LIST[0],
      category: EXACT_14_CATEGORIES[0],
      quantity: 10,
      minThreshold: 10,
      unitCost: 50
    });
    showSuccess(`Inventory item "${newItem.itemName}" created successfully.`);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      sku: item.sku,
      itemName: item.itemName,
      vendorName: item.vendorName,
      category: item.category,
      quantity: item.quantity,
      minThreshold: item.minThreshold,
      unitCost: item.unitCost
    });
    setIsEditOpen(true);
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setInventory(prev => prev.map(item => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          sku: formData.sku,
          itemName: formData.itemName,
          vendorName: formData.vendorName,
          category: formData.category as ServiceCategory,
          quantity: Number(formData.quantity),
          minThreshold: Number(formData.minThreshold),
          unitCost: Number(formData.unitCost)
        };
      }
      return item;
    }));

    setIsEditOpen(false);
    setEditingItem(null);
    showSuccess(`Updated inventory details for "${formData.itemName}".`);
  };

  const handleQuickAdjustStock = (id: string, delta: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: nextQty };
      }
      return item;
    }));
    showSuccess("Stock quantity adjusted.");
  };

  const handleRestockOrder = (item: InventoryItem) => {
    const restockQty = Math.max(20, item.minThreshold * 2);
    setInventory(prev => prev.map(i => {
      if (i.id === item.id) {
        return {
          ...i,
          quantity: i.quantity + restockQty,
          lastRestocked: new Date().toISOString().split('T')[0]
        };
      }
      return i;
    }));
    showSuccess(`Restock order placed for ${restockQty} units of "${item.itemName}".`);
  };

  const handleDeleteItem = (id: string, name: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
    showSuccess(`Removed "${name}" from inventory.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Total Tracked Items</CardTitle>
            <Boxes className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItemsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Across 14 synchronized categories</p>
          </CardContent>
        </Card>

        <Card className={lowStockCount > 0 ? "border-amber-300 bg-amber-50/20" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-amber-800">Low Stock Warning</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{lowStockCount}</div>
            <p className="text-xs text-amber-600/80 mt-1">Below minimum threshold</p>
          </CardContent>
        </Card>

        <Card className={outOfStockCount > 0 ? "border-rose-300 bg-rose-50/20" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-rose-800">Out of Stock</CardTitle>
            <PackageX className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-700">{outOfStockCount}</div>
            <p className="text-xs text-rose-600/80 mt-1">Action required immediately</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Total Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">Calculated at unit cost</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Inventory Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Vendor Inventory Directory</CardTitle>
              <CardDescription>
                Synchronized with Vendor Services across all 14 service categories.
              </CardDescription>
            </div>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shrink-0">
                  <Plus className="w-4 h-4" /> Add Inventory Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <form onSubmit={handleAddItem}>
                  <DialogHeader>
                    <DialogTitle>Add New Inventory Item</DialogTitle>
                    <DialogDescription>
                      Assign an item to a vendor and select from the 14 service categories.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="sku">SKU / Item Code <span className="text-destructive">*</span></Label>
                        <Input 
                          id="sku" 
                          placeholder="e.g. SKU-HK-009" 
                          value={formData.sku}
                          onChange={e => setFormData({...formData, sku: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="category">Service Category</Label>
                        <Select 
                          value={formData.category} 
                          onValueChange={val => setFormData({...formData, category: val as ServiceCategory})}
                        >
                          <SelectTrigger id="category">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {EXACT_14_CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="itemName">Item Name <span className="text-destructive">*</span></Label>
                      <Input 
                        id="itemName" 
                        placeholder="e.g. Luxury Towel Sets (10 Pack)" 
                        value={formData.itemName}
                        onChange={e => setFormData({...formData, itemName: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="vendorName">Vendor Partner</Label>
                      <Select 
                        value={formData.vendorName} 
                        onValueChange={val => setFormData({...formData, vendorName: val})}
                      >
                        <SelectTrigger id="vendorName">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VENDORS_LIST.map(v => (
                            <SelectItem key={v} value={v}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input 
                          id="quantity" 
                          type="number" 
                          min="0"
                          value={formData.quantity}
                          onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="minThreshold">Min. Threshold</Label>
                        <Input 
                          id="minThreshold" 
                          type="number" 
                          min="1"
                          value={formData.minThreshold}
                          onChange={e => setFormData({...formData, minThreshold: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="unitCost">Unit Cost (AED)</Label>
                        <Input 
                          id="unitCost" 
                          type="number" 
                          min="0"
                          step="0.01"
                          value={formData.unitCost}
                          onChange={e => setFormData({...formData, unitCost: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">Save Inventory Item</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t mt-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search item, SKU, or vendor..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>

            <Select value={vendorFilter} onValueChange={setVendorFilter}>
              <SelectTrigger className="w-[180px] h-9 text-xs">
                <SelectValue placeholder="All Vendors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {VENDORS_LIST.map(v => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[190px] h-9 text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All 14 Categories</SelectItem>
                {EXACT_14_CATEGORIES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9 text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU / ID</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Vendor Partner</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground text-xs">
                    No inventory items match your current filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory.map(item => {
                  const status = getStockStatus(item);
                  const totalValue = item.quantity * item.unitCost;

                  return (
                    <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-xs font-bold">{item.sku}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-xs">{item.itemName}</p>
                          <p className="text-[10px] text-muted-foreground">Restocked: {item.lastRestocked}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{item.vendorName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20 capitalize">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6 text-xs"
                            onClick={() => handleQuickAdjustStock(item.id, -1)}
                            disabled={item.quantity === 0}
                          >
                            -
                          </Button>
                          <span className="font-bold text-xs w-8 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6 text-xs"
                            onClick={() => handleQuickAdjustStock(item.id, 1)}
                          >
                            +
                          </Button>
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-0.5">Min: {item.minThreshold}</p>
                      </TableCell>
                      <TableCell>
                        {status === 'In Stock' && (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> In Stock
                          </Badge>
                        )}
                        {status === 'Low Stock' && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Low Stock
                          </Badge>
                        )}
                        {status === 'Out of Stock' && (
                          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                            <PackageX className="w-3 h-3 mr-1" /> Out of Stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">AED {item.unitCost.toFixed(2)}</TableCell>
                      <TableCell className="text-xs font-bold text-primary">AED {totalValue.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-1">
                          {(status === 'Low Stock' || status === 'Out of Stock') && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-[10px] gap-1 px-2 border-primary/30 text-primary hover:bg-primary/10"
                              onClick={() => handleRestockOrder(item)}
                            >
                              <RefreshCw className="w-3 h-3" /> Restock
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit Item"
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
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Item Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[480px]">
          {editingItem && (
            <form onSubmit={handleUpdateItem}>
              <DialogHeader>
                <DialogTitle>Edit Inventory Item</DialogTitle>
                <DialogDescription>
                  Update SKU, quantity thresholds, or pricing for {editingItem.itemName}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-sku">SKU / Item Code</Label>
                    <Input 
                      id="edit-sku" 
                      value={formData.sku}
                      onChange={e => setFormData({...formData, sku: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-category">Service Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={val => setFormData({...formData, category: val as ServiceCategory})}
                    >
                      <SelectTrigger id="edit-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EXACT_14_CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-itemName">Item Name</Label>
                  <Input 
                    id="edit-itemName" 
                    value={formData.itemName}
                    onChange={e => setFormData({...formData, itemName: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-vendorName">Vendor Partner</Label>
                  <Select 
                    value={formData.vendorName} 
                    onValueChange={val => setFormData({...formData, vendorName: val})}
                  >
                    <SelectTrigger id="edit-vendorName">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VENDORS_LIST.map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-quantity">Current Stock</Label>
                    <Input 
                      id="edit-quantity" 
                      type="number" 
                      min="0"
                      value={formData.quantity}
                      onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-minThreshold">Min. Threshold</Label>
                    <Input 
                      id="edit-minThreshold" 
                      type="number" 
                      min="1"
                      value={formData.minThreshold}
                      onChange={e => setFormData({...formData, minThreshold: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-unitCost">Unit Cost (AED)</Label>
                    <Input 
                      id="edit-unitCost" 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={formData.unitCost}
                      onChange={e => setFormData({...formData, unitCost: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Update Item Details</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorInventory;