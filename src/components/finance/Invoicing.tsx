"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { showSuccess } from '@/utils/toast';

const ACCOUNTS = {
  corporate: ['TechCorp Solutions', 'Global Logistics', 'Innovate Inc', 'Future Systems'],
  vendor: ['Elite Housekeeping', 'Swift Car Rentals', 'Gourmet Catering Co', 'Laundry Pros'],
  str: ['Skyline Suite 402', 'Ocean View 105', 'Mountain Retreat 202', 'Urban Loft 3B']
};

const Invoicing = () => {
  const [activeTab, setActiveTab] = useState('corporate');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [invoices, setInvoices] = useState([
    { id: 'INV-2024-001', entity: 'TechCorp Solutions', date: '2024-05-20', amount: 4500.00, status: 'Paid', type: 'corporate' },
    { id: 'INV-2024-002', entity: 'Elite Housekeeping', date: '2024-05-18', amount: 1200.00, status: 'Pending', type: 'vendor' },
    { id: 'INV-2024-003', entity: 'Skyline Suite 402', date: '2024-05-15', amount: 850.00, status: 'Overdue', type: 'str' },
  ]);

  const [formData, setFormData] = useState({
    entity: '',
    amount: '',
    type: 'corporate',
    date: new Date().toISOString().split('T')[0]
  });

  const handleRaiseInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvoice = {
      id: `INV-2024-00${invoices.length + 1}`,
      entity: formData.entity,
      date: formData.date,
      amount: parseFloat(formData.amount),
      status: 'Pending',
      type: formData.type
    };

    setInvoices([newInvoice, ...invoices]);
    setIsDialogOpen(false);
    setFormData({ entity: '', amount: '', type: 'corporate', date: new Date().toISOString().split('T')[0] });
    showSuccess(`Invoice ${newInvoice.id} raised for ${newInvoice.entity}.`);
  };

  const filteredInvoices = invoices.filter(inv => inv.type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 max-w-sm flex-1">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." className="h-9" />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Raise Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleRaiseInvoice}>
              <DialogHeader>
                <DialogTitle>Raise New Invoice</DialogTitle>
                <DialogDescription>
                  Select an account and fill in the details to create a new invoice.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="entity">Account / Entity Name</Label>
                  <Select 
                    value={formData.entity} 
                    onValueChange={(value) => setFormData({...formData, entity: value})}
                    required
                  >
                    <SelectTrigger id="entity">
                      <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Corporate</SelectLabel>
                        {ACCOUNTS.corporate.map(acc => (
                          <SelectItem key={acc} value={acc}>{acc}</SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Vendor</SelectLabel>
                        {ACCOUNTS.vendor.map(acc => (
                          <SelectItem key={acc} value={acc}>{acc}</SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>STR</SelectLabel>
                        {ACCOUNTS.str.map(acc => (
                          <SelectItem key={acc} value={acc}>{acc}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Invoice Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => setFormData({...formData, type: value})}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="vendor">Vendor</SelectItem>
                        <SelectItem value="str">STR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (AED)</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="0.00" 
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Invoice Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Create Invoice</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="corporate" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="corporate">Corporate</TabsTrigger>
          <TabsTrigger value="vendor">Vendor</TabsTrigger>
          <TabsTrigger value="str">STR</TabsTrigger>
        </TabsList>

        {['corporate', 'vendor', 'str'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{tab} Invoices</CardTitle>
                <CardDescription>Manage and track all invoices raised for {tab} accounts.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Entity Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-bold">{inv.id}</TableCell>
                          <TableCell>{inv.entity}</TableCell>
                          <TableCell>{inv.date}</TableCell>
                          <TableCell>AED {inv.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={
                              inv.status === 'Paid' ? 'default' : 
                              inv.status === 'Pending' ? 'secondary' : 'destructive'
                            }>
                              {inv.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" title="Download PDF">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="View Details">
                                <FileText className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredInvoices.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                            No invoices found for this category.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Invoicing;