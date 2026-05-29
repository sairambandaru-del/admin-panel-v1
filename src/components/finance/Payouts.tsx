"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const Payouts = () => {
  const [activeTab, setActiveTab] = useState('vendor');

  const handleProcessPayout = (id: string) => {
    showSuccess(`Payout ${id} processed and sent for approval.`);
  };

  const payoutData = [
    { id: 'PAY-001', entity: 'Elite Housekeeping', income: 5000.00, expenses: 450.00, type: 'vendor' },
    { id: 'PAY-002', entity: 'TechCorp Solutions', income: 12000.00, expenses: 1200.00, type: 'corporate' },
    { id: 'PAY-003', entity: 'Skyline Suite 101', income: 2500.00, expenses: 300.00, type: 'str' },
  ];

  const filteredPayouts = payoutData.filter(p => p.type === activeTab);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              $19,500.00
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              $1,950.00
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Net Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              $17,550.00
              <Wallet className="w-4 h-4 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vendor" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="vendor">Vendor</TabsTrigger>
          <TabsTrigger value="corporate">Corporate</TabsTrigger>
          <TabsTrigger value="str">STR</TabsTrigger>
        </TabsList>

        {['vendor', 'corporate', 'str'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{tab} Payout Report</CardTitle>
                <CardDescription>Auto-calculated payout amounts based on income minus expenses.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payout ID</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Booking Income</TableHead>
                        <TableHead>Expenses</TableHead>
                        <TableHead>Net Payout</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayouts.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-bold">{p.id}</TableCell>
                          <TableCell>{p.entity}</TableCell>
                          <TableCell className="text-green-600 font-medium">+${p.income.toFixed(2)}</TableCell>
                          <TableCell className="text-red-600 font-medium">-${p.expenses.toFixed(2)}</TableCell>
                          <TableCell className="font-bold text-primary">${(p.income - p.expenses).toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline" onClick={() => handleProcessPayout(p.id)}>
                              Process Payout
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
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

export default Payouts;