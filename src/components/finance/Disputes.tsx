"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Clock, Plus, MessageSquare } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const Disputes = () => {
  const [disputes, setDisputes] = useState([
    { id: 'DSP-101', guest: 'Robert Fox', issue: 'AC Leakage Damage', amount: 150.00, status: 'Open', priority: 'High', date: '2024-05-20' },
    { id: 'DSP-102', guest: 'Jane Cooper', issue: 'Late Check-in Refund', amount: 50.00, status: 'In Progress', priority: 'Medium', date: '2024-05-19' },
    { id: 'DSP-103', guest: 'Cody Fisher', issue: 'Missing Amenities', amount: 25.00, status: 'Resolved', priority: 'Low', date: '2024-05-15' },
  ]);

  const handleResolve = (id: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'Resolved' } : d));
    showSuccess(`Dispute ${id} marked as resolved.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Dispute & Refund Tickets</h3>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Create Ticket
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Disputes</CardTitle>
          <CardDescription>Track and resolve guest issues and refund requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Issue Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disputes.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-bold">{d.id}</TableCell>
                    <TableCell>{d.guest}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{d.issue}</span>
                        <span className="text-[10px] text-muted-foreground">{d.date}</span>
                      </div>
                    </TableCell>
                    <TableCell>${d.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={d.priority === 'High' ? 'destructive' : 'secondary'}>
                        {d.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {d.status === 'Resolved' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : d.status === 'In Progress' ? (
                          <Clock className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        {d.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Chat with Guest">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        {d.status !== 'Resolved' && (
                          <Button size="sm" variant="outline" onClick={() => handleResolve(d.id)}>
                            Resolve
                          </Button>
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

export default Disputes;