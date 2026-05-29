"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Calculator, Send, Plus, Trash2, ChevronDown, Check } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

const properties = [
  { id: 'skyline', label: 'Skyline Suites' },
  { id: 'ocean', label: 'Ocean View Residences' },
  { id: 'garden', label: 'Garden Villas' },
  { id: 'urban', label: 'Urban Lofts' },
  { id: 'mountain', label: 'Mountain Cabins' },
];

const BookingQuotation = () => {
  const [quote, setQuote] = useState({
    dates: '',
    bedroomType: '',
    location: '',
    adjustment: '0',
    selectedProperties: [] as string[]
  });

  const handlePropertyToggle = (propertyId: string) => {
    setQuote(prev => ({
      ...prev,
      selectedProperties: prev.selectedProperties.includes(propertyId)
        ? prev.selectedProperties.filter(id => id !== propertyId)
        : [...prev.selectedProperties, propertyId]
    }));
  };

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
              <Label>Properties</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    role="combobox" 
                    className="w-full justify-between font-normal hover:bg-background"
                  >
                    <span className="truncate">
                      {quote.selectedProperties.length === 0 
                        ? "Select properties" 
                        : `${quote.selectedProperties.length} selected`}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <div className="p-2 space-y-1">
                    {properties.map((prop) => (
                      <div 
                        key={prop.id}
                        className="flex items-center space-x-2 p-2 rounded-sm hover:bg-accent cursor-pointer"
                        onClick={() => handlePropertyToggle(prop.id)}
                      >
                        <Checkbox 
                          id={prop.id} 
                          checked={quote.selectedProperties.includes(prop.id)}
                          onCheckedChange={() => handlePropertyToggle(prop.id)}
                        />
                        <Label 
                          htmlFor={prop.id} 
                          className="flex-1 cursor-pointer text-sm font-normal"
                        >
                          {prop.label}
                        </Label>
                        {quote.selectedProperties.includes(prop.id) && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adjustment">Discount / Surcharge (%)</Label>
              <Input id="adjustment" type="number" defaultValue="0" />
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
                  <span>
                    {quote.selectedProperties.length > 0 
                      ? properties.filter(p => quote.selectedProperties.includes(p.id)).map(p => p.label).join(", ")
                      : "Skyline Suite 101 (2 Bedroom)"}
                  </span>
                  <span className="font-semibold">$1,250.00</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b text-sm">
                  <span>Service Fee</span>
                  <span className="font-semibold">$50.00</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-2xl font-bold text-primary">$1,300.00</span>
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