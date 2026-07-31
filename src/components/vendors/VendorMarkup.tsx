"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  TrendingUp, 
  Percent, 
  DollarSign, 
  Plus, 
  Edit2, 
  Trash2, 
  Building2, 
  Tag, 
  Calculator, 
  Sliders, 
  Search, 
  CheckCircle2, 
  HelpCircle, 
  Info, 
  Sparkles, 
  Layers, 
  ArrowUpRight, 
  Save 
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

export interface MarkupRule {
  id: string;
  name: string;
  targetType: 'Global' | 'Category' | 'Vendor';
  targetName: string; // e.g. "All Services", "Laundry", or "Apex Luxury Fleet"
  markupType: 'Percentage' | 'Fixed AED';
  value: number;
  applyMode: 'Add to Base' | 'Commission Deduction';
  status: 'Active' | 'Disabled';
  description: string;
}

const initialRules: MarkupRule[] = [
  {
    id: 'MKP-001',
    name: 'Standard Platform Global Margin',
    targetType: 'Global',
    targetName: 'All Vendor Services',
    markupType: 'Percentage',
    value: 12.5,
    applyMode: 'Add to Base',
    status: 'Active',
    description: 'Default platform markup added on top of all vendor base rates.'
  },
  {
    id: 'MKP-002',
    name: 'Luxury Car Rental Surcharge',
    targetType: 'Category',
    targetName: 'Car rental',
    markupType: 'Percentage',
    value: 18.0,
    applyMode: 'Add to Base',
    status: 'Active',
    description: 'Premium markup applied to all vehicle and chauffeur services.'
  },
  {
    id: 'MKP-003',
    name: 'Express Laundry Handling Fee',
    targetType: 'Category',
    targetName: 'Laundry',
    markupType: 'Fixed AED',
    value: 15.0,
    applyMode: 'Add to Base',
    status: 'Active',
    description: 'Flat markup fee per dry clean order for priority logistics handling.'
  },
  {
    id: 'MKP-004',
    name: 'Gourmet Catering VIP Margin',
    targetType: 'Vendor',
    targetName: 'Feast & Fete Catering',
    markupType: 'Percentage',
    value: 15.0,
    applyMode: 'Add to Base',
    status: 'Active',
    description: 'Custom vendor override for high-end dining and private chef bookings.'
  },
  {
    id: 'MKP-005',
    name: 'Doctor Consultation Service Fee',
    targetType: 'Category',
    targetName: 'Doctor on call',
    markupType: 'Fixed AED',
    value: 50.0,
    applyMode: 'Add to Base',
    status: 'Active',
    description: 'Fixed administrative markup for on-call medical dispatch.'
  }
];

const VENDORS_LIST = [
  'Elite Housekeeping',
  'Sparkle Cleaners',
  'Swift Car Rentals',
  'Apex Luxury Fleet',
  'Gourmet Catering Co',
  'Feast & Fete Catering',
  'QuickWash Laundry',
  'Zen Spa & Wellness',
  'MedCall Pro'
];

const CATEGORIES_LIST = [
  'Short term rental',
  'Leisure activities',
  'Dining',
  'Co-working',
  'Wellness',
  'Laundry',
  'Car rental',
  'Transportation',
  'Chef on call',
  'In-house catering',
  'Doctor on call',
  'Grocery',
  'Food delivery',
  'House keeping'
];

const VendorMarkup = () => {
  const [rules, setRules] = useState<MarkupRule[]>(initialRules);
  const [activeTab, setActiveTab] = useState<'rules' | 'calculator'>('rules');
  const [searchTerm, setSearchTerm] = useState('');
  const [targetFilter, setTargetFilter] = useState<string>('all');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<MarkupRule | null>(null);

  // Form State
  const [formData, setFormData] = useState<MarkupRule>({
    id: '',
    name: '',
    targetType: 'Category',
    targetName: 'Laundry',
    markupType: 'Percentage',
    value: 10,
    applyMode: 'Add to Base',
    status: 'Active',
    description: ''
  });

  // Calculator State
  const [calcVendor, setCalcVendor] = useState('Apex Luxury Fleet');
  const [calcCategory, setCalcCategory] = useState('Car rental');
  const [calcBasePrice, setCalcBasePrice] = useState<number>(500);

  // Filtered Rules
  const filteredRules = rules.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTarget = targetFilter === 'all' || r.targetType === targetFilter;

    return matchesSearch && matchesTarget;
  });

  // Helper function to resolve applicable markup for a vendor/category
  const calculateEffectivePrice = (vendorName: string, category: string, basePrice: number) => {
    // 1. Check for Vendor override first
    const vendorRule = rules.find(r => r.status === 'Active' && r.targetType === 'Vendor' && r.targetName === vendorName);
    // 2. Otherwise Check Category rule
    const categoryRule = rules.find(r => r.status === 'Active' && r.targetType === 'Category' && r.targetName === category);
    // 3. Fallback to Global rule
    const globalRule = rules.find(r => r.status === 'Active' && r.targetType === 'Global');

    const activeRule = vendorRule || categoryRule || globalRule;

    if (!activeRule) {
      return {
        ruleUsed: 'None (0% Markup)',
        markupAmount: 0,
        finalPrice: basePrice,
        platformProfit: 0
      };
    }

    let markupAmount = 0;
    if (activeRule.markupType === 'Percentage') {
      markupAmount = basePrice * (activeRule.value / 100);
    } else {
      markupAmount = activeRule.value;
    }

    const finalPrice = basePrice + markupAmount;

    return {
      ruleUsed: `${activeRule.name} (${activeRule.markupType === 'Percentage' ? activeRule.value + '%' : 'AED ' + activeRule.value})`,
      markupAmount,
      finalPrice,
      platformProfit: markupAmount
    };
  };

  const calcResult = calculateEffectivePrice(calcVendor, calcCategory, calcBasePrice);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.value) {
      showError("Please fill in Rule Name and Markup Value.");
      return;
    }

    const newRule: MarkupRule = {
      ...formData,
      id: `MKP-00${rules.length + 1}`
    };

    setRules([...rules, newRule]);
    setIsAddOpen(false);
    showSuccess(`Markup Rule "${newRule.name}" created successfully.`);
    // Reset
    setFormData({
      id: '',
      name: '',
      targetType: 'Category',
      targetName: 'Laundry',
      markupType: 'Percentage',
      value: 10,
      applyMode: 'Add to Base',
      status: 'Active',
      description: ''
    });
  };

  const handleOpenEdit = (rule: MarkupRule) => {
    setEditingRule(rule);
    setFormData(rule);
    setIsEditOpen(true);
  };

  const handleUpdateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;

    setRules(prev => prev.map(r => r.id === editingRule.id ? formData : r));
    setIsEditOpen(false);
    setEditingRule(null);
    showSuccess(`Updated Markup Rule "${formData.name}".`);
  };

  const handleToggleStatus = (id: string) => {
    setRules(prev => prev.map(r => {
      if (r.id === id) {
        const nextStatus = r.status === 'Active' ? 'Disabled' : 'Active';
        showSuccess(`Rule "${r.name}" is now ${nextStatus}.`);
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  };

  const handleDeleteRule = (id: string, name: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
    showSuccess(`Deleted rule "${name}".`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Active Markup Rules</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.filter(r => r.status === 'Active').length} Active</div>
            <p className="text-xs text-muted-foreground mt-1">Configured price policies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Default Global Margin</CardTitle>
            <Percent className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {rules.find(r => r.targetType === 'Global')?.value || 12.5}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Applied when no override exists</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Category Overrides</CardTitle>
            <Tag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rules.filter(r => r.targetType === 'Category').length} Categories
            </div>
            <p className="text-xs text-muted-foreground mt-1">Custom category margins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Vendor Overrides</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rules.filter(r => r.targetType === 'Vendor').length} Vendors
            </div>
            <p className="text-xs text-muted-foreground mt-1">Specific partner markups</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Container */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Vendor Service Markups & Margin Rules</CardTitle>
              <CardDescription>
                Configure percentage or fixed AED markup amounts added onto base vendor rates prior to guest checkout.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shrink-0">
                    <Plus className="w-4 h-4" /> Add Markup Rule
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form onSubmit={handleAddRule}>
                    <DialogHeader>
                      <DialogTitle>Create Vendor Service Markup Rule</DialogTitle>
                      <DialogDescription>
                        Set up a percentage or fixed AED markup to automatically add onto vendor service prices.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4 text-xs">
                      <div className="space-y-1.5">
                        <Label htmlFor="rule-name">Rule Title <span className="text-destructive">*</span></Label>
                        <Input 
                          id="rule-name" 
                          placeholder="e.g. Chauffeur Luxury Surcharge" 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="rule-target-type">Applies To Scope</Label>
                          <Select 
                            value={formData.targetType} 
                            onValueChange={(val: any) => {
                              const defaultTarget = val === 'Global' ? 'All Vendor Services' : val === 'Vendor' ? VENDORS_LIST[0] : CATEGORIES_LIST[0];
                              setFormData({...formData, targetType: val, targetName: defaultTarget});
                            }}
                          >
                            <SelectTrigger id="rule-target-type"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Global">Global Default</SelectItem>
                              <SelectItem value="Category">Service Category</SelectItem>
                              <SelectItem value="Vendor">Specific Vendor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="rule-target-name">Scope Target Name</Label>
                          {formData.targetType === 'Global' ? (
                            <Input id="rule-target-name" value="All Vendor Services" disabled />
                          ) : formData.targetType === 'Vendor' ? (
                            <Select 
                              value={formData.targetName} 
                              onValueChange={val => setFormData({...formData, targetName: val})}
                            >
                              <SelectTrigger id="rule-target-name"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {VENDORS_LIST.map(v => (
                                  <SelectItem key={v} value={v}>{v}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Select 
                              value={formData.targetName} 
                              onValueChange={val => setFormData({...formData, targetName: val})}
                            >
                              <SelectTrigger id="rule-target-name"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {CATEGORIES_LIST.map(c => (
                                  <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="rule-type">Markup Type</Label>
                          <Select 
                            value={formData.markupType} 
                            onValueChange={(val: any) => setFormData({...formData, markupType: val})}
                          >
                            <SelectTrigger id="rule-type"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Percentage">Percentage (%)</SelectItem>
                              <SelectItem value="Fixed AED">Fixed Amount (AED)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="rule-value">Markup Value ({formData.markupType === 'Percentage' ? '%' : 'AED'}) <span className="text-destructive">*</span></Label>
                          <Input 
                            id="rule-value" 
                            type="number" 
                            step="0.1"
                            value={formData.value}
                            onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="rule-desc">Description & Internal Notes</Label>
                        <Input 
                          id="rule-desc" 
                          placeholder="e.g. Applied during high season operations..." 
                          value={formData.description}
                          onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="submit" className="w-full">Save Markup Rule</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Navigation Bar & Filters */}
          <div className="pt-4 border-t mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex bg-muted p-1 rounded-lg border w-fit">
              <Button
                variant={activeTab === 'rules' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 gap-1.5 text-xs font-medium"
                onClick={() => setActiveTab('rules')}
              >
                <Sliders className="w-3.5 h-3.5" />
                Markup Rules Directory ({rules.length})
              </Button>
              <Button
                variant={activeTab === 'calculator' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 gap-1.5 text-xs font-medium"
                onClick={() => setActiveTab('calculator')}
              >
                <Calculator className="w-3.5 h-3.5" />
                Live Price & Margin Simulator
              </Button>
            </div>

            {activeTab === 'rules' && (
              <div className="flex items-center gap-2">
                <Select value={targetFilter} onValueChange={setTargetFilter}>
                  <SelectTrigger className="w-[150px] h-9 text-xs">
                    <SelectValue placeholder="All Scopes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Scopes</SelectItem>
                    <SelectItem value="Global">Global</SelectItem>
                    <SelectItem value="Category">Category</SelectItem>
                    <SelectItem value="Vendor">Vendor</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative w-full md:w-60">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search rule title or vendor..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-8 h-9 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {activeTab === 'rules' ? (
            /* MARKUP RULES DIRECTORY TABLE */
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Rule ID</TableHead>
                    <TableHead>Rule Title</TableHead>
                    <TableHead>Scope Type</TableHead>
                    <TableHead>Target Name</TableHead>
                    <TableHead>Markup Configured</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                        No service markup rules match your search filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRules.map((rule) => (
                      <TableRow key={rule.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-xs font-bold">{rule.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-bold text-xs text-foreground">{rule.name}</p>
                            <p className="text-[10px] text-muted-foreground">{rule.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] ${
                              rule.targetType === 'Global' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                              rule.targetType === 'Category' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                              'bg-purple-50 text-purple-800 border-purple-300'
                            }`}
                          >
                            {rule.targetType} Scope
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-xs text-foreground">
                          {rule.targetName}
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-xs text-primary flex items-center gap-1">
                            {rule.markupType === 'Percentage' ? (
                              <>
                                <Percent className="w-3.5 h-3.5" />
                                <span>+{rule.value}%</span>
                              </>
                            ) : (
                              <>
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>+AED {rule.value.toFixed(2)}</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={rule.status === 'Active' ? 'default' : 'secondary'}>
                            {rule.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => handleOpenEdit(rule)}
                              title="Edit Rule"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={`h-7 w-7 ${rule.status === 'Active' ? 'text-amber-600' : 'text-emerald-600'}`}
                              onClick={() => handleToggleStatus(rule.id)}
                              title={rule.status === 'Active' ? 'Disable Rule' : 'Enable Rule'}
                            >
                              <Switch checked={rule.status === 'Active'} className="scale-75" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteRule(rule.id, rule.name)}
                              title="Delete Rule"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* LIVE PRICE & MARGIN SIMULATOR */
            <div className="grid gap-6 md:grid-cols-12 p-2">
              <div className="md:col-span-5 space-y-4 border rounded-xl p-4 bg-muted/10">
                <h3 className="font-bold text-sm flex items-center gap-2 text-foreground">
                  <Calculator className="w-4 h-4 text-primary" />
                  Service Rate Inputs
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <Label htmlFor="calc-vendor">Select Delivering Vendor</Label>
                    <Select value={calcVendor} onValueChange={setCalcVendor}>
                      <SelectTrigger id="calc-vendor" className="h-9 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {VENDORS_LIST.map(v => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="calc-category">Select Service Category</Label>
                    <Select value={calcCategory} onValueChange={setCalcCategory}>
                      <SelectTrigger id="calc-category" className="h-9 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES_LIST.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="calc-base">Vendor Base Service Rate (AED)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">AED</span>
                      <Input 
                        id="calc-base" 
                        type="number"
                        step="10"
                        className="pl-12 h-9 text-xs font-bold"
                        value={calcBasePrice}
                        onChange={e => setCalcBasePrice(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulation Output Card */}
              <div className="md:col-span-7 border-2 border-primary/20 rounded-xl p-5 bg-card space-y-4 shadow-2xs">
                <div className="flex justify-between items-start border-b pb-3">
                  <div>
                    <h4 className="font-extrabold text-base text-foreground">Dynamic Pricing Breakdown</h4>
                    <p className="text-xs text-muted-foreground">Real-time simulation of guest checkout price with markups</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground font-bold">
                    <Sparkles className="w-3 h-3 mr-1" /> Live Result
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded bg-muted/40">
                    <span className="text-muted-foreground">Vendor Base Rate:</span>
                    <span className="font-mono font-bold">AED {calcBasePrice.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between p-2 rounded bg-muted/40">
                    <span className="text-muted-foreground">Applied Rule:</span>
                    <span className="font-semibold text-primary">{calcResult.ruleUsed}</span>
                  </div>

                  <div className="flex justify-between p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <span className="font-medium">Platform Service Markup Added:</span>
                    <span className="font-mono font-bold">+AED {calcResult.markupAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between p-3 rounded-lg bg-primary/10 border border-primary/30 text-sm font-extrabold mt-2">
                    <span className="text-foreground">Final Guest Selling Price (Pre-VAT):</span>
                    <span className="text-primary font-mono text-base">AED {calcResult.finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-3 bg-muted/30 rounded-lg text-[11px] text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-primary" /> How Markups Work across Straizen:
                  </p>
                  <p>
                    Markups are dynamically calculated whenever a service order is initiated in guest communications, booking quotations, or invoice raising.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Rule Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {editingRule && (
            <form onSubmit={handleUpdateRule}>
              <DialogHeader>
                <DialogTitle>Edit Markup Rule: {editingRule.id}</DialogTitle>
                <DialogDescription>Modify markup values or change application target scopes.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-rule-name">Rule Title</Label>
                  <Input 
                    id="edit-rule-name" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-rule-type">Markup Type</Label>
                    <Select 
                      value={formData.markupType} 
                      onValueChange={(val: any) => setFormData({...formData, markupType: val})}
                    >
                      <SelectTrigger id="edit-rule-type"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Percentage">Percentage (%)</SelectItem>
                        <SelectItem value="Fixed AED">Fixed Amount (AED)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-rule-val">Value ({formData.markupType === 'Percentage' ? '%' : 'AED'})</Label>
                    <Input 
                      id="edit-rule-val" 
                      type="number"
                      step="0.1"
                      value={formData.value}
                      onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-rule-desc">Description</Label>
                  <Input 
                    id="edit-rule-desc" 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full">Update Rule</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorMarkup;