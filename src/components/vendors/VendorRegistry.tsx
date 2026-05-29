symbols as > in VendorRegistry.tsx to avoid any JSX compilation errors.">
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Receipt, User, Building2, Mail } from 'lucide-react';
import { usePlatformData, Account } from '@/context/PlatformDataContext';

const VendorRegistry = () => {
  const { accounts } = usePlatformData();
  const vendorAccounts = accounts.filter(acc => acc.type === 'Vendor');
  const [selectedVendor, setSelectedVendor] = useState<Account | null>(null);

  useEffect(() => {
    if (vendorAccounts.length > 0) {
      const exists = vendorAccounts.find(v => v.id === selectedVendor?.id);
      if (!exists) setSelectedVendor(vendorAccounts[0]);
    } else {
      setSelectedVendor(null);
    }
  }, [accounts]);

  if (!selectedVendor) {
    return (
      <Card className="p-8 text-center border-dashed">
        <p className="text-muted-foreground">No Vendor accounts found. Create one in Settings > Accounts with ecosystem type set to Vendor Provider.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Vendor Accounts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y max-h-[500px] overflow-y-auto">
            {vendorAccounts.map((vendor) => (
              <button
                key={vendor.id}
                onClick={() => setSelectedVendor(vendor)}
                className={`w-full text-left p-4 hover:bg-accent transition-colors ${selectedVendor.id === vendor.id ? 'bg-accent font-medium' : ''}`}
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
            <Badge variant={selectedVendor.status === 'Active' ? 'default' : 'destructive'}>
              {selectedVendor.status === 'Active' ? 'Verified' : 'Deactivated'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="details" className="flex gap-2">
                <Building2 className="w-4 h-4" /> Account Details
              </TabsTrigger>
              <TabsTrigger value="kyc" className="flex gap-2">
                <ShieldCheck className="w-4 h-4" /> KYC Documents
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
                  <p className="text-sm">{selectedVendor.type} Provider</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact Email</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    {selectedVendor.name.toLowerCase().replace(/\s/g, '')}@provider.com
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company Domain</p>
                  <p className="text-sm font-mono text-primary">{selectedVendor.domain}</p>
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