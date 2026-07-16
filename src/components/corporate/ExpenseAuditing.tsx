"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle, Eye } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const initialInvoices = [
  { id: 'INV-8821', employee: 'John Doe', trip: 'London Q2 Review', amount: 1250.00, policyMatch: true, status: 'Auto-Approved' },
  { id: 'INV-8822', employee: 'Jane Smith', trip: 'Sales Kickoff', amount: 3400.00, policyMatch: false, status: 'Pending Approval' },
  { id: 'INV-8823', employee: 'Mike Ross', trip: 'Client Meeting', amount: 450.00, policyMatch: true, status: 'Approved' },
  { id: 'INV-8824', employee: 'Sarah Connor', trip: 'Tech Summit', amount: 2100.00, policyMatch: false, status: 'Pending Approval' },
];

const ExpenseAuditing = () => {
  const [invoices, setInvoices] = useState(initialInvoices);

  const handleAction = (id: string, action: 'Approved' | 'Declined') => {
    setInvoices(prev => prev.map(inv => 
      inv.id === id ? { ...inv, status: action } : inv
    ));
    if (action === 'Approved') showSuccess(`Invoice ${id} approved.`);
    else showError(`Invoice ${id} declined.`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Expense Auditing Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Trip</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Policy Match</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-bold">{inv.id}</TableCell>
                    <TableCell>{inv.employee}</TableCell>
                    <TableCell>{inv.trip}</TableCell>
                    <TableCell>AED {inv.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {inv.policyMatch ? (
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Match
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                          <AlertCircle className="w-3 h-3 mr-1" /> Violation
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        inv.status === 'Auto-Approved' || inv.status === 'Approved' ? 'default' : 
                        inv.status === 'Declined' ? 'destructive' : 'secondary'
                      }>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {inv.status === 'Pending Approval' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleAction(inv.id, 'Approved')}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleAction(inv.id, 'Declined')}
                            >
                              Decline
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseAuditing;