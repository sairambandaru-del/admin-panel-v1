"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ShieldCheck, 
  Receipt, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Boxes, 
  Search, 
  Plus, 
  Filter, 
  X, 
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const vendors = [
  // House keeping
  { id: 'VND-001', name: 'Elite Housekeeping', manager: 'David Miller', status: 'Verified', type: 'House keeping' },
  { id: 'VND-002', name: 'Sparkle Cleaners', manager: 'Sarah Connor', status: 'Verified', type: 'House keeping' },
  // Car rental & Transportation
  { id: 'VND-003', name: 'Swift Car Rentals', manager: 'Elena Rodriguez', status: 'Verified', type: 'Car rental' },
  { id: 'VND-004', name: 'Apex Luxury Fleet', manager: 'James Bond', status: 'Verified', type: 'Transportation' },
  // F&B / Chef / Catering
  { id: 'VND-005', name: 'Gourmet Catering Co', manager: 'Marcus Chen', status: 'Pending', type: 'In-house catering' },
  { id: 'VND-006', name: 'Feast & Fete Catering', manager: 'Amelie Poulain', status: 'Verified', type: 'Chef on call' },
  // Laundry
  { id: 'VND-007', name: 'Laundry Pros', manager: 'Michael Jordan', status: 'Verified', type: 'Laundry' },
  { id: 'VND-008', name: 'Spin Cycle Dry Cleaners', manager: 'Danny DeVito', status: 'Verified', type: 'Laundry' },
  // Wellness, Dining, Leisure, Co-working
  { id: 'VND-009', name: 'Zen Spa & Wellness', manager: 'Yoda Grandmaster', status: 'Verified', type: 'Wellness' },
  { id: 'VND-010', name: 'Desert Safari Adventures', manager: 'Indiana Jones', status: 'Verified', type: 'Leisure activities' },
  { id: 'VND-011', name: 'Zuma Fine Dining', manager: 'Chef Gordon', status: 'Verified', type: 'Dining' },
  { id: 'VND-012', name: 'WeWork Global', manager: 'Adam Neumann', status: 'Verified', type: 'Co-working' },
  // Grocery & Food Delivery
  { id: 'VND-013', name: 'FreshMart Express', manager: 'Bruce Wayne', status: 'Verified', type: 'Grocery' },
  { id: 'VND-014', name: 'Bistro Food Delivery', manager: 'Mario Rossi', status: 'Verified', type: 'Food delivery' },
  // Doctor on Call
  { id: 'VND-015', name: 'MedCall Pro', manager: 'Clara Oswald', status: 'Verified', type: 'Doctor on call' },
  // Short Term Rental
  { id: 'VND-016', name: 'Skyline Property Management', manager: 'Emma Watson', status: 'Verified', type: 'Short term rental' },
];

const CATEGORY_TYPES = [
  'All Categories',
  'House keeping',
  'Car rental',
  'Transportation',
  'In-house catering',
  'Chef on call',
  'Laundry',
  'Wellness',
  'Leisure activities',
  'Dining',
  'Co-working',
  'Grocery',
  'Food delivery',
  'Doctor on call',
  'Short term rental'
];

// Mock inventory data mapped by Vendor ID
const vendorInventories: Record<string, Array<{ id: string; item: string; category: string; quantity: number; status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Available' | 'Rented' | 'Maintenance' }>> = {
  'VND-001': [
    { id: 'INV-HK-01', item: 'Standard Cleaning Kits', category: 'Supplies', quantity: 45, status: 'In Stock' },
    { id: 'INV-HK-02', item: 'Premium Bed Linens (King)', category: 'Linens', quantity: 12, status: 'Low Stock' },
  ],
  'VND-003': [
    { id: 'INV-CR-01', item: 'Tesla Model 3', category: 'Electric Sedan', quantity: 8, status: 'Available' },
    { id: 'INV-CR-02', item: 'Range Rover Sport', category: 'Luxury SUV', quantity: 3, status: 'Rented' },
  ],
  'VND-007': [
    { id: 'INV-LP-01', item: 'Heavy Duty Laundry Bags', category: 'Supplies', quantity: 150, status: 'In Stock' },
    { id: 'INV-LP-02', item: 'Hypoallergenic Detergent', category: 'Chemicals', quantity: 60, status: 'In Stock' },
  ]
};

const VendorRegistry = () => {
  const [selectedVendor, setSelectedVendor] = useState(vendors[0]);
  const [inventorySearch, setInventorySearch] = useState('');

  // Smart Search & Filter States
  const [vendorSearch, setVendorSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleRestockRequest = (itemName: string) => {
    showSuccess(`Restock request submitted for "${itemName}".`);
  };

  const handleClearFilters = () => {
    setVendorSearch('');
    setCategoryFilter('All Categories');
    setStatusFilter('all');
  };

  // Smart Filter Logic
  const filteredVendors = vendors.filter(v => {
    const query = vendorSearch.toLowerCase().trim();
    const matchesQuery = 
      !query ||
      v.name.toLowerCase().includes(query) ||
      v.id.toLowerCase().includes(query) ||
      v.manager.toLowerCase().includes(query) ||
      v.type.toLowerCase().includes(query);

    const matchesCategory = categoryFilter === 'All Categories' || v.type === categoryFilter;
    const matchesStatus = statusFilter === 'all' || v.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesQuery && matchesCategory && matchesStatus;
  });

  const hasActiveFilters = vendorSearch.length > 0 || categoryFilter !== 'All Categories' || statusFilter !== 'all';

  const currentInventory = vendorInventories[selectedVendor.id] || [
    { id: 'INV-GEN-01', item: 'Standard Service Unit Package', category: 'General', quantity: 20, status: 'In Stock' }
  ];
  
  const filteredInventory = currentInventory.filter(item => 
    item.item.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    item.category.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    item.id.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  const getStockBadge = (status: string) => {
    switch (status) {
      case 'In Stock':
      case 'Available':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-medium">{status}</Badge>;
      case 'Low Stock':
      case 'Rented':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 font-medium">{status}</Badge>;
      case 'Out of Stock':
      case 'Maintenance':
        return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 font-medium">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Smart Search Bar & Filters Control Strip */}
      <Card className="p-4 bg-card border shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Main Smart Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
            <Input 
              placeholder="Smart Search vendors by company name, manager, ID (e.g. VND-003), or category..." 
              value={vendorSearch}
              onChange={(e) => setVendorSearch(e.target.value)}
              className="pl-9 pr-8 h-9 text-xs font-medium"
            />
            {vendorSearch && (
              <button 
                onClick={() => setVendorSearch('')}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Select Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[170px] h-9 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {CATEGORY_TYPES.map(cat => (
                  <SelectItem key={cat} value={cat} className="text-xs">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
                <SelectItem value="verified" className="text-xs">Verified</SelectItem>
                <SelectItem value="pending" className="text-xs">Pending</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearFilters}
                className="h-9 text-xs text-muted-foreground hover:text-destructive gap-1 px-2"
              >
                <X className="w-3.5 h-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Live Matching Summary Bar */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-3 mt-3 border-t">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              Showing {filteredVendors.length} of {vendors.length} Vendors
            </span>
            {hasActiveFilters && (
              <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                Filtered Search Active
              </Badge>
            )}
          </div>
          <span className="hidden sm:inline-block">Click any vendor from the sidebar list to inspect details & KYC</span>
        </div>
      </Card>

      {/* Main Vendor Split View */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* Left Sidebar: Filtered Vendor List */}
        <Card className="md:col-span-1 h-[calc(100vh-280px)] flex flex-col">
          <CardHeader className="p-4 pb-2 border-b bg-muted/20 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-primary" />
              Vendor Accounts
            </CardTitle>
            <Badge variant="secondary" className="text-[10px] font-mono">
              {filteredVendors.length}
            </Badge>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto">
            {filteredVendors.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground space-y-2">
                <Search className="w-8 h-8 text-muted-foreground mx-auto opacity-30" />
                <p className="font-semibold text-foreground">No vendors match your search</p>
                <p className="text-[11px]">Try adjusting your search query or reset category/status filters.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearFilters} 
                  className="mt-2 text-xs h-8"
                >
                  Clear Search Filters
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {filteredVendors.map((vendor) => (
                  <button
                    key={vendor.id}
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setInventorySearch('');
                    }}
                    className={`w-full text-left p-4 hover:bg-accent transition-colors ${selectedVendor.id === vendor.id ? 'bg-accent border-l-4 border-l-primary' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="font-bold text-xs text-foreground truncate">{vendor.name}</p>
                      <Badge 
                        variant={vendor.status === 'Verified' ? 'default' : 'secondary'} 
                        className="text-[9px] h-4 px-1 shrink-0"
                      >
                        {vendor.status}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1 mt-1.5">
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3 text-primary" /> {vendor.manager}
                      </p>
                      <div className="flex items-center justify-between text-[10px]">
                        <Badge variant="outline" className="w-fit text-[9px] h-4 px-1 font-normal capitalize bg-primary/5 text-primary border-primary/20">
                          {vendor.type}
                        </Badge>
                        <span className="font-mono text-muted-foreground">{vendor.id}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Details Panel */}
        <Card className="md:col-span-3 h-[calc(100vh-280px)] flex flex-col overflow-y-auto">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {selectedVendor.name}
                  <Badge variant="outline" className="text-xs font-normal capitalize bg-primary/5 text-primary border-primary/20">
                    {selectedVendor.type}
                  </Badge>
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Vendor ID: <span className="font-mono font-bold">{selectedVendor.id}</span></p>
              </div>
              <Badge variant={selectedVendor.status === 'Verified' ? 'default' : 'secondary'} className="px-3 py-1">
                {selectedVendor.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="details" className="flex gap-2 text-xs">
                  <Building2 className="w-4 h-4" /> Account Details
                </TabsTrigger>
                <TabsTrigger value="kyc" className="flex gap-2 text-xs">
                  <ShieldCheck className="w-4 h-4" /> KYC Documents
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex gap-2 text-xs">
                  <Boxes className="w-4 h-4" /> Inventory
                </TabsTrigger>
                <TabsTrigger value="soa" className="flex gap-2 text-xs">
                  <Receipt className="w-4 h-4" /> SOA
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account Manager</p>
                    <p className="text-sm font-semibold">{selectedVendor.manager}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Service Category</p>
                    <p className="text-sm capitalize font-semibold text-primary">{selectedVendor.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact Email</p>
                    <div className="flex items-center gap-2 text-sm font-mono">
                      <Mail className="w-3.5 h-3.5 text-primary" />
                      {selectedVendor.name.toLowerCase().replace(/\s/g, '')}@provider.com
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone Number</p>
                    <div className="flex items-center gap-2 text-sm font-mono">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      +971 4 {Math.floor(1000000 + Math.random() * 9000000)}
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-2">Primary Operating Address</h4>
                  <p className="text-xs text-muted-foreground">789 Industry Way, Suite 200, Business Bay District, Dubai, UAE</p>
                </div>
              </TabsContent>

              <TabsContent value="kyc" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Document Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Uploaded Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-xs font-medium">{selectedVendor.name}</TableCell>
                        <TableCell className="font-medium text-xs">Commercial Trade License</TableCell>
                        <TableCell><Badge variant="default">Verified</Badge></TableCell>
                        <TableCell className="text-xs font-mono">2024-01-15</TableCell>
                        <TableCell className="text-right"><Button variant="ghost" size="sm" className="h-7 text-xs">View Document</Button></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-xs font-medium">{selectedVendor.name}</TableCell>
                        <TableCell className="font-medium text-xs">Liability Insurance Certificate</TableCell>
                        <TableCell><Badge variant="default">Verified</Badge></TableCell>
                        <TableCell className="text-xs font-mono">2024-02-10</TableCell>
                        <TableCell className="text-right"><Button variant="ghost" size="sm" className="h-7 text-xs">View Document</Button></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search vendor stock..." 
                      className="pl-8 h-9 text-xs"
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                    />
                  </div>
                  <Button size="sm" className="gap-1.5 h-9" onClick={() => showSuccess("Add item dialog opened.")}>
                    <Plus className="w-4 h-4" /> Add Item
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item ID</TableHead>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-xs font-bold">{item.id}</TableCell>
                          <TableCell className="font-medium text-xs">{item.item}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] font-normal">
                              {item.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center font-semibold text-xs">{item.quantity}</TableCell>
                          <TableCell>{getStockBadge(item.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-primary hover:text-primary/80 h-7 text-xs"
                              onClick={() => handleRestockRequest(item.item)}
                            >
                              Request Restock
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="soa" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm">Financial Summary - {selectedVendor.name}</h4>
                  <Button size="sm" variant="outline" className="h-8 text-xs">Export PDF Statement</Button>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Total Billed</p>
                    <p className="text-lg font-bold">AED 45,200.00</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Total Paid</p>
                    <p className="text-lg font-bold">AED 42,000.00</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
                    <p className="text-[10px] font-bold uppercase text-primary">Outstanding Balance</p>
                    <p className="text-lg font-bold text-primary">AED 3,200.00</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorRegistry;