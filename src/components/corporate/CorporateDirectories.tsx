"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ShieldCheck, Receipt, User, Building2 } from 'lucide-react';

const accounts = [
  { id: 'CORP-001', name: 'TechCorp Solutions', manager: 'Sarah Jenkins', status: 'Active' },
  { id: 'CORP-002', name: 'Global Logistics Inc', manager: 'Michael Chen', status: 'Active' },
  { id: 'CORP-003', name: 'Innovate Media', manager: 'Emma Wilson', status: 'Pending' },
];

const CorporateDirectories = () => {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Accounts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => setSelectedAccount(account)}
                className={`w-full text-left p-4 hover:bg-accent transition-colors ${selectedAccount.id === account.id ? 'bg-accent' : ''}`}
              >
                <p className="font-semibold text-sm">{account.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <User className="w-3 h-3" /> {account.manager}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{selectedAccount.name}</CardTitle>
              <p className="text-sm text-muted-foreground">ID: {selectedAccount.id}</p>
            </div>
            <Badge variant={selectedAccount.status === 'Active' ? 'default' : 'secondary'}>
              {selectedAccount.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="details" className="flex gap-2">
                <Building2 className="w-4 h-4" /> Details
              </TabsTrigger>
              <TabsTrigger value="kyc" className="flex gap-2">
                <ShieldCheck className="w-4 h-4" /> KYC
              </TabsTrigger>
              <TabsTrigger value="soa" className="flex gap-2">
                <Receipt className="w-4 h-4" /> SOA
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Account Manager</p>
                  <p className="text-sm">{selectedAccount.manager}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Email</p>
                  <p className="text-sm">contact@{selectedAccount.name.toLowerCase().replace(/\s/g, '')}.com</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Billing Address</p>
                  <p className="text-sm">123 Business Ave, Suite 500, New York, NY</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Employee Count</p>
                  <p className="text-sm">450</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="kyc" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Business Registration</TableCell>
                      <TableCell><Badge variant="default">Verified</Badge></TableCell>
                      <TableCell>2025-12-31</TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="sm">View</Button></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Tax Certificate</TableCell>
                      <TableCell><Badge variant="default">Verified</Badge></TableCell>
                      <TableCell>2024-06-30</TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="sm">View</Button></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="soa" className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Statement of Accounts</h4>
                <Button size="sm" variant="outline">Download Full Report</Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Outstanding</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>May 2024</TableCell>
                      <TableCell>$12,450.00</TableCell>
                      <TableCell>$0.00</TableCell>
                      <TableCell><Badge variant="default">Paid</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>April 2024</TableCell>
                      <TableCell>$8,920.00</TableCell>
                      <TableCell>$0.00</TableCell>
                      <TableCell><Badge variant="default">Paid</Badge></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CorporateDirectories;