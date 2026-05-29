"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  CreditCard, 
  AlertCircle, 
  MessageSquare, 
  HelpCircle,
  Check,
  X,
  TrendingUp
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const categories = [
  { id: 'str', label: 'Short Term Rentals' },
  { id: 'leisure', label: 'Leisure Activities' },
  { id: 'car', label: 'Car Rentals' },
  { id: 'housekeeping', label: 'House Keeping' },
  { id: 'laundry', label: 'Laundry' },
  { id: 'food', label: 'Food Delivery' },
  { id: 'dining', label: 'Dining' },
  { id: 'doctor', label: 'Doctor on Call' },
  { id: 'transport', label: 'Transportation' },
  { id: 'coworking', label: 'Co-working Spaces' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'grocery', label: 'Grocery' },
  { id: 'chef', label: 'Chef on Call' },
  { id: 'catering', label: 'In House Catering' },
];

const VendorServices = () => {
  const [category, setCategory] = useState('str');
  const [enquiries, setEnquiries] = useState([
    { id: 'ENQ-101', guest: 'Alice Brown', service: 'Deep Cleaning', date: '2024-05-22', status: 'Pending' },
    { id: 'ENQ-102', guest: 'Mark Wilson', service: 'Airport Transfer', date: '2024-05-23', status: 'Pending' },
  ]);

  const handleEnquiry = (id: string, action: 'Accepted' | 'Rejected') => {
    setEnquiries(prev => prev.map(enq => enq.id === id ? { ...enq, status: action } : enq));
    if (action === 'Accepted') showSuccess(`Enquiry ${id} accepted.`);
    else showError(`Enquiry ${id} rejected.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold">Service Category</h3>
            <p className="text-xs text-muted-foreground">Select a category to manage vendor operations</p>
          </div>
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="earnings">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="earnings" className="gap-2"><DollarSign className="w-4 h-4" /> Earnings</TabsTrigger>
          <TabsTrigger value="payouts" className="gap-2"><CreditCard className="w-4 h-4" /> Payouts</TabsTrigger>
          <TabsTrigger value="disputes" className="gap-2"><AlertCircle className="w-4 h-4" /> Disputes</TabsTrigger>
          <TabsTrigger value="escalations" className="gap-2"><MessageSquare className="w-4 h-4" /> Escalations</TabsTrigger>
          <TabsTrigger value="enquiries" className="gap-2"><HelpCircle className="w-4 h-4" /> Enquiries</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Report - {categories.find(c => c.id === category)?.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2024-05-15</TableCell>
                      <TableCell className="font-mono text-xs">BK-9921</TableCell>
                      <TableCell>Standard Service</TableCell>
                      <TableCell className="text-right font-bold">$120.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2024-05-14</TableCell>
                      <TableCell className="font-mono text-xs">BK-9918</TableCell>
                      <TableCell>Premium Add-on</TableCell>
                      <TableCell className="text-right font-bold">$45.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payout ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-bold">PAY-882</TableCell>
                      <TableCell>2024-05-01</TableCell>
                      <TableCell>Bank Transfer</TableCell>
                      <TableCell><Badge>Completed</Badge></TableCell>
                      <TableCell className="text-right font-bold">$2,450.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes">
          <Card>
            <CardHeader>
              <CardTitle>Refunds & Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                <p>No active disputes for this category.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalations">
          <Card>
            <CardHeader>
              <CardTitle>Active Escalations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-bold">ESC-004</TableCell>
                      <TableCell>Service Delay Complaint</TableCell>
                      <TableCell><Badge variant="destructive">High</Badge></TableCell>
                      <TableCell>Under Investigation</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enquiries">
          <Card>
            <CardHeader>
              <CardTitle>Service Enquiries</CardTitle>
              <CardDescription>Manage incoming requests from guests and corporate accounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Enquiry ID</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Service Requested</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enquiries.map((enq) => (
                      <TableRow key={enq.id}>
                        <TableCell className="font-bold">{enq.id}</TableCell>
                        <TableCell>{enq.guest}</TableCell>
                        <TableCell>{enq.service}</TableCell>
                        <TableCell>{enq.date}</TableCell>
                        <TableCell>
                          <Badge variant={
                            enq.status === 'Accepted' ? 'default' : 
                            enq.status === 'Rejected' ? 'destructive' : 'secondary'
                          }>
                            {enq.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {enq.status === 'Pending' && (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 text-green-600"
                                onClick={() => handleEnquiry(enq.id, 'Accepted')}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 text-red-600"
                                onClick={() => handleEnquiry(enq.id, 'Rejected')}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorServices;