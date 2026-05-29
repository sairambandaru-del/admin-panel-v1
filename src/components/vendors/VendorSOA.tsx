"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Receipt } from 'lucide-react';

const VendorSOA = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Filter className="w-4 h-4" /> Filter Period</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" /> Export All</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          <CardTitle>Statement of Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Statement Period</TableHead>
                  <TableHead>Total Earnings</TableHead>
                  <TableHead>Commission (15%)</TableHead>
                  <TableHead>Net Payout</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">May 2024</TableCell>
                  <TableCell>$12,450.00</TableCell>
                  <TableCell>$1,867.50</TableCell>
                  <TableCell className="font-bold text-primary">$10,582.50</TableCell>
                  <TableCell><Badge variant="secondary">Processing</Badge></TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm">View Details</Button></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">April 2024</TableCell>
                  <TableCell>$15,200.00</TableCell>
                  <TableCell>$2,280.00</TableCell>
                  <TableCell className="font-bold text-primary">$12,920.00</TableCell>
                  <TableCell><Badge variant="default">Paid</Badge></TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm">View Details</Button></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">March 2024</TableCell>
                  <TableCell>$11,800.00</TableCell>
                  <TableCell>$1,770.00</TableCell>
                  <TableCell className="font-bold text-primary">$10,030.00</TableCell>
                  <TableCell><Badge variant="default">Paid</Badge></TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm">View Details</Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorSOA;