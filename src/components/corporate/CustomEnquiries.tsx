"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Send, History } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const CustomEnquiries = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Enquiry submitted successfully. Our team will get back to you.");
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>New Custom Enquiry</CardTitle>
          <CardDescription>Submit a special request for corporate travel requirements.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date-range">Date Range</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="date-range" placeholder="Select dates..." className="pl-10" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pax">Number of Pax</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="pax" type="number" placeholder="e.g. 10" className="pl-10" required />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description of Requirement</Label>
              <Textarea 
                id="description" 
                placeholder="Please describe your specific needs (e.g., conference room, catering, specific location)..." 
                className="min-h-[120px]"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="gap-2">
                <Send className="w-4 h-4" /> Submit Enquiry
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <CardTitle>Enquiry History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead>Travel Dates</TableHead>
                  <TableHead>Pax</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2024-05-15</TableCell>
                  <TableCell>2024-06-10 to 2024-06-15</TableCell>
                  <TableCell>25</TableCell>
                  <TableCell><Badge variant="secondary">In Review</Badge></TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm">View</Button></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-04-20</TableCell>
                  <TableCell>2024-05-01 to 2024-05-05</TableCell>
                  <TableCell>5</TableCell>
                  <TableCell><Badge variant="default">Quoted</Badge></TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm">View</Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomEnquiries;