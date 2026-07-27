"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ShieldCheck, Receipt, User, Building2, Tag, HelpCircle, Calendar, Send } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const accounts = [
  { id: 'CORP-001', name: 'TechCorp Solutions', manager: 'Sarah Jenkins', status: 'Active', type: 'Corporate' },
  { id: 'CORP-002', name: 'Global Logistics Inc', manager: 'Michael Chen', status: 'Active', type: 'Corporate' },
  { id: 'CORP-003', name: 'Innovate Media', manager: 'Emma Wilson', status: 'Pending', type: 'STR' },
  { id: 'CORP-004', name: 'Stark Industries', manager: 'Pepper Potts', status: 'Active', type: 'Corporate' },
  { id: 'CORP-005', name: 'Wayne Enterprises', manager: 'Lucius Fox', status: 'Active', type: 'Corporate' },
  { id: 'CORP-006', name: 'Acme Corporation', manager: 'Wile E. Coyote', status: 'Pending', type: 'STR' },
];

const mockAccountEnquiries: Record<string, Array<{ id: string; subject: string; pax: number; travelDates: string; status: string; date: string }>> = {
  'CORP-001': [
    { id: 'ENQ-201', subject: 'Q3 Leadership Retreat Accommodation & Transportation', pax: 25, travelDates: 'Jul 15 - Jul 20, 2024', status: 'Quoted', date: '2024-05-18' },
    { id: 'ENQ-202', subject: 'Engineering Team Onsite Extended Stay', pax: 12, travelDates: 'Aug 01 - Aug 30, 2024', status: 'Under Review', date: '2024-05-21' }
  ],
  'CORP-002': [
    { id: 'ENQ-203', subject: 'Global Logistics Annual Executive Meeting Catering', pax: 40, travelDates: 'Jun 10 - Jun 12, 2024', status: 'Under Review', date: '2024-05-19' }
  ],
  'CORP-004': [
    { id: 'ENQ-204', subject: 'Clean Energy Summit VIP Chauffeur Fleet', pax: 8, travelDates: 'Jun 01 - Jun 05, 2024', status: 'Approved', date: '2024-05-15' }
  ]
};

const CorporateDirectories = () => {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);

  const accountEnquiries = mockAccountEnquiries[selectedAccount.id] || [
    { id: 'ENQ-200', subject: 'Standard Custom Travel Enquiry', pax: 5, travelDates: 'Jun 20 - Jun 25, 2024', status: 'Pending', date: '2024-05-20' }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card className="md:col-span-1 h-[calc(100vh-220px)] flex flex-col">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg">Accounts</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-y-auto">
          <div className="divide-y">
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => setSelectedAccount(account)}
                className={`w-full text-left p-4 hover:bg-accent transition-colors ${selectedAccount.id === account.id ? 'bg-accent' : ''}`}
              >
                <p className="font-semibold text-sm">{account.name}</p>
                <div className="flex flex-col gap-1 mt-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" /> {account.manager}
                  </p>
                  <Badge variant="outline" className="w-fit text-[10px] h-4 px-1 font-normal">
                    {account.type}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-3 h-[calc(100vh-220px)] flex flex-col overflow-y-auto">
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
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="details" className="flex gap-2 text-xs">
                <Building2 className="w-4 h-4" /> Details
              </TabsTrigger>
              <TabsTrigger value="enquiries" className="flex gap-2 text-xs">
                <HelpCircle className="w-4 h-4" /> Enquiries
              </TabsTrigger>
              <TabsTrigger value="kyc" className="flex gap-2 text-xs">
                <ShieldCheck className="w-4 h-4" /> KYC
              </TabsTrigger>
              <TabsTrigger value="soa" className="flex gap-2 text-xs">
                <Receipt className="w-4 h-4" /> SOA
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type of Account</p>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" />
                    <p className="text-sm font-semibold">{selectedAccount.type}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account Manager</p>
                  <p className="text-sm">{selectedAccount.manager}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</p>
                  <p className="text-sm">contact@{selectedAccount.name.toLowerCase().replace(/\s/g, '')}.com</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Employee Count</p>
                  <p className="text-sm">450</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Billing Address</p>
                  <p className="text-sm">123 Business Ave, Suite 500, New York, NY</p>
                </div>
              </div>
            </TabsContent>

            {/* Custom Enquiries Tab */}
            <TabsContent value="enquiries" className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="font-semibold text-sm">Custom Travel Enquiries</h4>
                  <p className="text-xs text-muted-foreground">Special requests and custom group travel submissions for {selectedAccount.name}.</p>
                </div>
                <Button size="sm" className="gap-1.5 text-xs" onClick={() => showSuccess("Navigating to Custom Enquiry Builder...")}>
                  <Send className="w-3.5 h-3.5" /> Submit New Enquiry
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Enquiry ID</TableHead>
                      <TableHead>Requirement Subject</TableHead>
                      <TableHead>Pax</TableHead>
                      <TableHead>Travel Dates</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountEnquiries.map((enq) => (
                      <TableRow key={enq.id}>
                        <TableCell className="font-mono text-xs font-bold">{enq.id}</TableCell>
                        <TableCell className="font-medium text-xs">{enq.subject}</TableCell>
                        <TableCell className="text-xs font-semibold">{enq.pax} Guests</TableCell>
                        <TableCell className="text-xs">{enq.travelDates}</TableCell>
                        <TableCell className="text-xs font-mono">{enq.date}</TableCell>
                        <TableCell>
                          <Badge variant={enq.status === 'Approved' ? 'default' : enq.status === 'Quoted' ? 'secondary' : 'outline'}>
                            {enq.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={() => showSuccess(`Viewing enquiry ${enq.id}`)}>
                            View Proposal
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                      <TableCell>AED 12,450.00</TableCell>
                      <TableCell>AED 0.00</TableCell>
                      <TableCell><Badge variant="default">Paid</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>April 2024</TableCell>
                      <TableCell>AED 8,920.00</TableCell>
                      <TableCell>AED 0.00</TableCell>
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