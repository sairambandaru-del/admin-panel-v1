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
  { id: 'skyline', label: 'Skyline Suites', basePrice: 1250 },
  { id: 'ocean', label: 'Ocean View Residences', basePrice: 1400 },
  { id: 'garden', label: 'Garden Villas', basePrice: 1800 },
  { id: 'urban', label: 'Urban Lofts', basePrice: 950 },
  { id: 'mountain', label: 'Mountain Cabins', basePrice: 1100 },
];

const BookingQuotation = () => {
  const [quote, setQuote] = useState({
    dates: 'May 20 - May 25',
    bedroomType: '2 Bedroom',
    location: 'Downtown',
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

  const handleSendQuotation = () => {
    showSuccess("Quotation has been sent to the guest's email.");
  };

  const handleDownloadPDF = () => {
    showSuccess("Generating PDF...");
    // Simulate a short delay for PDF generation
    setTimeout(() => {
      showSuccess("Quotation PDF downloaded successfully.");
    }, 1000);
  };

  const calculateTotal = (base: number) => {
    const adj = parseFloat(quote.adjustment) || 0;
    const serviceFee = 50;
    return base + serviceFee + (base * (adj / 100));
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
              <Input 
                id="dates" 
                value={quote.dates} 
                onChange={(e) => setQuote({...quote, dates: e.target.value})}
                placeholder="e.g. May 20 - May 25" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedroom">Bedroom Type</Label>
              <Select onValueChange={(v) => setQuote({...quote, bedroomType: v})} defaultValue="2br">
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
              <Input 
                id="adjustment" 
                type="number" 
                value={quote.adjustment}
                onChange={(e) => setQuote({...quote, adjustment: e.target.value})}
              />
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
            <Button variant="outline" size="sm" className="text-destructive" onClick={() => setQuote({...quote, selectedProperties: []})}>
              <Trash2 className="w-4 h-4 mr-2" /> Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-xl p-8 bg-muted/10 min-h-[600px] flex flex-col">
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

            <div className="space-y-8">
              {/* Stay Details - Shown Once */}
              <div className="grid grid-cols-2 gap-8 bg-background p-4 rounded-lg border border-dashed">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Guest Details</p>
                  <p className="text-sm font-medium">Pending Selection</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Stay Details</p>
                  <p className="text-sm font-medium">{quote.dates || 'Dates not set'}</p>
                  <p className="text-xs text-muted-foreground mt-1">{quote.bedroomType} • {quote.location}</p>
                </div>
              </div>

              {/* Property Tables */}
              <div className="space-y-6">
                {quote.selectedProperties.length > 0 ? (
                  quote.selectedProperties.map((propId) => {
                    const property = properties.find(p => p.id === propId);
                    if (!property) return null;
                    const total = calculateTotal(property.basePrice);

                    return (
                      <div key={propId} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="h-px flex-1 bg-border" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{property.label}</span>
                          <div className="h-px flex-1 bg-border" />
                        </div>
                        <div className="rounded-lg border bg-background overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b">
                              <tr>
                                <th className="text-left p-3 font-medium">Description</th>
                                <th className="text-right p-3 font-medium">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              <tr>
                                <td className="p-3">Base Rate ({quote.bedroomType})</td>
                                <td className="p-3 text-right font-semibold">${property.basePrice.toFixed(2)}</td>
                              </tr>
                              <tr>
                                <td className="p-3">Service Fee</td>
                                <td className="p-3 text-right font-semibold">$50.00</td>
                              </tr>
                              {parseFloat(quote.adjustment) !== 0 && (
                                <tr>
                                  <td className="p-3">Adjustment ({quote.adjustment}%)</td>
                                  <td className="p-3 text-right font-semibold">
                                    ${(property.basePrice * (parseFloat(quote.adjustment) / 100)).toFixed(2)}
                                  </td>
                                </tr>
                              )}
                              <tr className="bg-primary/5">
                                <td className="p-3 font-bold">Total for {property.label}</td>
                                <td className="p-3 text-right font-bold text-primary">${total.toFixed(2)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground">
                    <Plus className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-sm">Select properties to generate preview tables</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-auto pt-8 border-t">
              <div className="flex gap-3">
                <Button 
                  className="flex-1 gap-2" 
                  disabled={quote.selectedProperties.length === 0}
                  onClick={handleSendQuotation}
                >
                  <Send className="w-4 h-4" /> Send Quotation
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2" 
                  disabled={quote.selectedProperties.length === 0}
                  onClick={handleDownloadPDF}
                >
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