"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { showSuccess } from '@/utils/toast';

const Invoicing = () => {
  const [activeTab, setActiveTab] = useState('corporate');

  const handleRaiseInvoice = () => {
    showSuccess(`New ${activeTab.toUpperCase()} invoice raised successfully.`);
  };

  const invoices = [
    { id: 'INV-2024-001', entity: 'TechCorp Solutions', date: '2024-05-20', amount: 4500.00, status: 'Paid', type: 'corporate' },
    { id: 'INV-2024-002', entity: 'Elite Housekeeping', date: '2024-05-18', amount: 1200.00, status: 'Pending', type: 'vendor' },
    { id: 'INV-2024-003', entity: 'Skyline Suite 402', date: '2024-05-15', amount: 850.00, status: 'Overdue', type: 'str' },
  ];

  const filteredInvoices = invoices.filter(inv => inv.type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 max-w-sm flex-1">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." className="h-9" />
        </div>
        <Button onClick={handleRaiseInvoice} className="gap-2">
          <Plus className="w-4 h-4" /> Raise Invoice
        </Button>
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
                          <TableCell>${inv.amount.toFixed(2)}</TableCell>
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