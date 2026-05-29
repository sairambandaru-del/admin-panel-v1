"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Calculator, Send, Plus, Trash2, DollarSign } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const BookingQuotation = () => {
  const [quote, setQuote] = useState({
    dates: '',
    bedroomType: '',
    location: '',
    adjustment: '0',
    fixedCharge: '0',
    property: ''
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Quotation generated successfully.");
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Build Quotation</CardTitle>
          <CardDescription>Enter details to generate a booking quote.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dates">Stay Dates</Label>
              <Input id="dates" placeholder="e.g. May 20 - May 25" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedroom">Bedroom Type</Label>
              <Select onValueChange={(v) => setQuote({...quote, bedroomType: v})}>
                <SelectTrigger id="bedroom">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="1br">1 Bedroom</SelectItem>
                  <SelectItem value="2br">2 Bedroom</SelectItem>
                  <SelectItem value="3br">3 Bedroom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select onValueChange={(v) => setQuote({...quote, location: v})}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="downtown">Downtown</SelectItem>
                  <SelectItem value="beachfront">Beachfront</SelectItem>
                  <SelectItem value="suburbs">Suburbs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="property">Property</Label>
              <Select onValueChange={(v) => setQuote({...quote, property: v})}>
                <SelectTrigger id="property">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skyline">Skyline Suites</SelectItem>
                  <SelectItem value="ocean">Ocean View Residences</SelectItem>
                  <SelectItem value="garden">Garden Villas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adjustment">Adjustment (%)</Label>
                <Input 
                  id="adjustment" 
                  type="number" 
                  defaultValue="0" 
                  onChange={(e) => setQuote({...quote, adjustment: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fixedCharge">Fixed Charge ($)</Label>
                <Input 
                  id="fixedCharge" 
                  type="number" 
                  defaultValue="0" 
                  onChange={(e) => setQuote({...quote, fixedCharge: e.target.value})}
                />
              </div>
            </div>
            <Button type="submit" className="w-full gap-2 mt-4">
              <Calculator className="w-4 h-4" /> Generate Quote
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Quotation Preview</CardTitle>
            <CardDescription>Review and send the generated quote.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
            <Button variant="outline" size="sm" className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Clear</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-xl p-8 bg-muted/10 min-h-[400px] flex flex-col">
            <div className="flex justify-between items-start border-b pb-6 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-primary">straizen</h3>
                <p className="text-xs text-muted-foreground mt-1">Booking Quotation #QT-2024-001</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">Date: May 20, 2024</p>
                <p className="text-xs text-muted-foreground">Valid for 48 hours</p>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Guest Details</p>
                  <p className="text-sm font-medium">Pending Selection</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Stay Details</p>
                  <p className="text-sm font-medium">May 20 - May 25 (5 Nights)</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Items</p>
                <div className="flex justify-between items-center py-2 border-b text-sm">
                  <span>Skyline Suite 101 (2 Bedroom)</span>
                  <span className="font-semibold">$1,250.00</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b text-sm">
                  <span>Service Fee</span>
                  <span className="font-semibold">$50.00</span>
                </div>
                {parseFloat(quote.fixedCharge) !== 0 && (
                  <div className="flex justify-between items-center py-2 border-b text-sm">
                    <span>Additional Fixed Charge</span>
                    <span className="font-semibold">${parseFloat(quote.fixedCharge).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-2xl font-bold text-primary">
                  ${(1300 + parseFloat(quote.fixedCharge)).toFixed(2)}
                </span>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 gap-2">
                  <Send className="w-4 h-4" /> Send to Guest
                </Button>
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" /> Download PDF
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingQuotation;