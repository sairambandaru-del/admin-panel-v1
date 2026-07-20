"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Receipt, User, Building2, Mail, Phone, Boxes, Search, Plus } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const vendors = [
  { id: 'VND-001', name: 'Elite Housekeeping', manager: 'David Miller', status: 'Verified', type: 'Service Provider' },
  { id: 'VND-002', name: 'Swift Car Rentals', manager: 'Elena Rodriguez', status: 'Verified', type: 'Logistics' },
  { id: 'VND-003', name: 'Gourmet Catering Co', manager: 'Marcus Chen', status: 'Pending', type: 'Food & Beverage' },
];

// Mock inventory data mapped by Vendor ID
const vendorInventories: Record<string, Array<{ id: string; item: string; category: string; quantity: number; status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Available' | 'Rented' | 'Maintenance' }>> = {
  'VND-001': [
    { id: 'INV-HK-01', item: 'Standard Cleaning Kits', category: 'Supplies', quantity: 45, status: 'In Stock' },
    { id: 'INV-HK-02', item: 'Premium Bed Linens (King)', category: 'Linens', quantity: 12, status: 'Low Stock' },
    { id: 'INV-HK-03', item: 'Eco-friendly Detergents (5L)', category: 'Chemicals', quantity: 80, status: 'In Stock' },
    { id: 'INV-HK-04', item: 'Industrial Vacuum Cleaners', category: 'Equipment', quantity: 15, status: 'In Stock' },
    { id: 'INV-HK-05', item: 'Microfiber Cloth Packs', category: 'Supplies', quantity: 0, status: 'Out of Stock' },
  ],
  'VND-002': [
    { id: 'INV-CR-01', item: 'Tesla Model 3', category: 'Electric Sedan', quantity: 8, status: 'Available' },
    { id: 'INV-CR-02', item: 'Premium SUV (GMC Yukon)', category: 'SUV', quantity: 5, status: 'Rented' },
    { id: 'INV-CR-03', item: 'Range Rover Sport', category: 'Luxury SUV', quantity: 3, status: 'Maintenance' },
    { id: 'INV-CR-04', item: 'Economy Sedan (Nissan Sunny)', category: 'Sedan', quantity: 12, status: 'Available' },
  ],
  'VND-003': [
    { id: 'INV-CAT-01', item: 'Buffet Setup Kits', category: 'Equipment', quantity: 10, status: 'In Stock' },
    { id: 'INV-CAT-02', item: 'Premium Dinnerware Sets (100pax)', category: 'Tableware', quantity: 150, status: 'In Stock' },
    { id: 'INV-CAT-03', item: 'Portable Gas Burners', category: 'Cooking', quantity: 5, status: 'Low Stock' },
    { id: 'INV-CAT-04', item: 'Commercial Chocolate Fountains', category: 'Specialty', quantity: 0, status: 'Out of Stock' },
  ],
};

const VendorRegistry = () => {
  const [selectedVendor, setSelectedVendor] = useState(vendors[0]);
  const [inventorySearch, setInventorySearch] = useState('');

  const handleRestockRequest = (itemName: string) => {
    showSuccess(`Restock request submitted for "${itemName}".`);
  };

  const currentInventory = vendorInventories[selectedVendor.id] || [];
  
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
    <div className="grid gap-6 md:grid-cols-4">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Vendor Accounts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {vendors.map((vendor) => (
              <button
                key={vendor.id}
                onClick={() => {
                  setSelectedVendor(vendor);
                  setInventorySearch('');
                }}
                className={`w-full text-left p-4 hover:bg-accent transition-colors ${selectedVendor.id === vendor.id ? 'bg-accent' : ''}`}
              >
                <p className="font-semibold text-sm">{vendor.name}</p>
                <div className="flex flex-col gap-1 mt-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" /> {vendor.manager}
                  </p>
                  <Badge variant="outline" className="w-fit text-[10px] h-4 px-1 font-normal">
                    {vendor.type}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{selectedVendor.name}</CardTitle>
              <p className="text-sm text-muted-foreground">Vendor ID: {selectedVendor.id}</p>
            </div>
            <Badge variant={selectedVendor.status === 'Verified' ? 'default' : 'secondary'}>
              {selectedVendor.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="details" className="flex gap-2">
                <Building2 className="w-4 h-4" /> Account Details
              </TabsTrigger>
              <TabsTrigger value="kyc" className="flex gap-2">
                <ShieldCheck className="w-4 h-4" /> KYC Documents
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex gap-2">
                <Boxes className="w-4 h-4" /> Inventory
              </TabsTrigger>
              <TabsTrigger value="soa" className="flex gap-2">
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
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</p>
                  <p className="text-sm">{selectedVendor.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact Email</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    {selectedVendor.name.toLowerCase().replace(/\s/g, '')}@provider.com
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone Number</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    +1 (555) 000-1234
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-3">Business Address</h4>
                <p className="text-sm text-muted-foreground">789 Industry Way, Suite 200, Business District, NY 10001</p>
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
                      <TableCell className="font-medium">Trade License</TableCell>
                      <TableCell><Badge variant="default">Verified</Badge></TableCell>
                      <TableCell>2024-01-15</TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="sm">View</Button></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-xs font-medium">{selectedVendor.name}</TableCell>
                      <TableCell className="font-medium">Insurance Certificate</TableCell>
                      <TableCell><Badge variant="default">Verified</Badge></TableCell>
                      <TableCell>2024-02-10</TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="sm">View</Button></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-xs font-medium">{selectedVendor.name}</TableCell>
                      <TableCell className="font-medium">Tax Registration</TableCell>
                      <TableCell><Badge variant="secondary">Pending Review</Badge></TableCell>
                      <TableCell>2024-05-18</TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="sm">View</Button></TableCell>
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
                    placeholder="Search inventory..." 
                    className="pl-8 h-9 text-xs"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                  />
                </div>
                <Button size="sm" className="gap-1.5" onClick={() => showSuccess("Add item dialog coming soon!")}>
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
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-normal">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-semibold">{item.quantity}</TableCell>
                        <TableCell>{getStockBadge(item.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary hover:text-primary/80"
                            onClick={() => handleRestockRequest(item.item)}
                          >
                            Request Restock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredInventory.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          No inventory items found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="soa" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Financial Summary - {selectedVendor.name}</h4>
                <Button size="sm" variant="outline">Export PDF</Button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Total Billed</p>
                  <p className="text-lg font-bold">$45,200.00</p>
                </div>
                <div className="p-4 border rounded-lg bg-muted/30">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Total Paid</p>
                  <p className="text-lg font-bold">$42,000.00</p>
                </div>
                <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
                  <p className="text-[10px] font-bold uppercase text-primary">Outstanding</p>
                  <p className="text-lg font-bold text-primary">$3,200.00</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorRegistry;