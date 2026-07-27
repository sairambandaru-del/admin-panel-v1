"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Trash2, 
  ShieldCheck, 
  Clock,
  Eye,
  Check,
  X
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface OnboardingApplication {
  id: string;
  companyName: string;
  category: string;
  contactPerson: string;
  email: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Draft';
  submittedDate: string;
  documents: string[];
}

const initialApplications: OnboardingApplication[] = [
  {
    id: 'ONB-001',
    companyName: 'Apex Luxury Fleet',
    category: 'Car rental',
    contactPerson: 'James Bond',
    email: 'james@apexfleet.com',
    status: 'Pending Review',
    submittedDate: '2024-05-19',
    documents: ['Trade License.pdf', 'Insurance Certificate.pdf']
  },
  {
    id: 'ONB-002',
    companyName: 'Feast & Fete Catering',
    category: 'In-house catering',
    contactPerson: 'Amelie Poulain',
    email: 'amelie@feastfete.com',
    status: 'Approved',
    submittedDate: '2024-05-15',
    documents: ['Trade License.pdf', 'Food Safety Permit.pdf', 'Tax Registration.pdf']
  },
  {
    id: 'ONB-003',
    companyName: 'Zen Spa & Wellness',
    category: 'Wellness',
    contactPerson: 'Yoda Grandmaster',
    email: 'yoda@zenspa.com',
    status: 'Pending Review',
    submittedDate: '2024-05-20',
    documents: ['Trade License.pdf', 'Therapist Certifications.pdf']
  },
  {
    id: 'ONB-004',
    companyName: 'QuickWash Laundry',
    category: 'Laundry',
    contactPerson: 'John Smith',
    email: 'john@quickwash.com',
    status: 'Rejected',
    submittedDate: '2024-05-10',
    documents: ['Trade License.pdf']
  }
];

const VendorOnboarding = () => {
  const [applications, setApplications] = useState<OnboardingApplication[]>(initialApplications);
  const [activeTab, setActiveTab] = useState<'wizard' | 'queue'>('wizard');
  const [step, setStep] = useState(1);
  
  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    tradeLicense: '',
    category: 'House keeping',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    pricingDetails: '',
    agreeToTerms: false,
    uploadedFiles: [] as string[]
  });

  const [selectedApp, setSelectedApp] = useState<OnboardingApplication | null>(null);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.companyName || !formData.contactName || !formData.email || !formData.phone) {
        showError("Please fill in all required fields in Step 1.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.pricingDetails) {
        showError("Please provide service and pricing details in Step 2.");
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, `${docType}: ${file.name}`]
      }));
      showSuccess(`Successfully uploaded ${file.name} for ${docType}.`);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      showError("You must agree to the terms and conditions to submit.");
      return;
    }

    const newApp: OnboardingApplication = {
      id: `ONB-00${applications.length + 1}`,
      companyName: formData.companyName,
      category: formData.category,
      contactPerson: formData.contactName,
      email: formData.email,
      status: 'Pending Review',
      submittedDate: new Date().toISOString().split('T')[0],
      documents: formData.uploadedFiles.map(f => f.split(': ')[1] || f)
    };

    setApplications([newApp, ...applications]);
    showSuccess(`Application for "${formData.companyName}" submitted successfully!`);
    
    // Reset Form
    setFormData({
      companyName: '',
      tradeLicense: '',
      category: 'House keeping',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      pricingDetails: '',
      agreeToTerms: false,
      uploadedFiles: []
    });
    setStep(1);
    setActiveTab('queue');
  };

  const handleApprove = (id: string) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'Approved' } : app
    ));
    showSuccess(`Application ${id} has been approved. Vendor is now active in the registry.`);
    if (selectedApp?.id === id) {
      setSelectedApp(prev => prev ? { ...prev, status: 'Approved' } : null);
    }
  };

  const handleReject = (id: string) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'Rejected' } : app
    ));
    showError(`Application ${id} has been rejected.`);
    if (selectedApp?.id === id) {
      setSelectedApp(prev => prev ? { ...prev, status: 'Rejected' } : null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Vendor Onboarding</h3>
          <p className="text-sm text-muted-foreground">Onboard new service providers across all 14 service categories.</p>
        </div>
        <div className="flex bg-muted p-1 rounded-lg border">
          <Button 
            variant={activeTab === 'wizard' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('wizard')}
            className="text-xs h-8"
          >
            Onboarding Form
          </Button>
          <Button 
            variant={activeTab === 'queue' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('queue')}
            className="text-xs h-8 gap-1.5"
          >
            Applications Queue
            {applications.filter(a => a.status === 'Pending Review').length > 0 && (
              <Badge variant="destructive" className="h-4 min-w-4 px-1 flex items-center justify-center text-[9px]">
                {applications.filter(a => a.status === 'Pending Review').length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {activeTab === 'wizard' ? (
        <div className="grid gap-6 md:grid-cols-4">
          {/* Step Indicator Sidebar */}
          <Card className="md:col-span-1 p-4 h-fit">
            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Onboarding Steps</h4>
              <div className="space-y-2">
                {[
                  { num: 1, label: 'Company Profile' },
                  { num: 2, label: 'Services & Pricing' },
                  { num: 3, label: 'KYC Documents' },
                  { num: 4, label: 'Review & Submit' }
                ].map((s) => (
                  <div 
                    key={s.num} 
                    className={`flex items-center gap-3 p-2.5 rounded-lg text-xs font-medium transition-colors ${
                      step === s.num 
                        ? 'bg-primary text-primary-foreground' 
                        : step > s.num 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
                      step === s.num 
                        ? 'border-primary-foreground bg-primary-foreground text-primary' 
                        : 'border-current'
                    }`}>
                      {step > s.num ? <Check className="w-3 h-3" /> : s.num}
                    </div>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Step Form Content */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>
                {step === 1 && "Step 1: Company Profile"}
                {step === 2 && "Step 2: Services & Pricing"}
                {step === 3 && "Step 3: KYC Documents Upload"}
                {step === 4 && "Step 4: Review & Submit"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Enter basic company details and primary contact information."}
                {step === 2 && "Specify your service category and describe your pricing structure."}
                {step === 3 && "Upload required legal and financial documents for verification."}
                {step === 4 && "Review your application details before submitting for admin approval."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name <span className="text-destructive">*</span></Label>
                      <Input 
                        id="companyName" 
                        placeholder="e.g. Apex Luxury Fleet" 
                        value={formData.companyName}
                        onChange={e => setFormData({...formData, companyName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tradeLicense">Trade License Number</Label>
                      <Input 
                        id="tradeLicense" 
                        placeholder="e.g. TL-99281-A" 
                        value={formData.tradeLicense}
                        onChange={e => setFormData({...formData, tradeLicense: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Primary Contact Person <span className="text-destructive">*</span></Label>
                      <Input 
                        id="contactName" 
                        placeholder="e.g. James Bond" 
                        value={formData.contactName}
                        onChange={e => setFormData({...formData, contactName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Service Category</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={val => setFormData({...formData, category: val})}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Short term rental">Short term rental</SelectItem>
                          <SelectItem value="Leisure activities">Leisure activities</SelectItem>
                          <SelectItem value="Dining">Dining</SelectItem>
                          <SelectItem value="Co-working">Co-working</SelectItem>
                          <SelectItem value="Wellness">Wellness</SelectItem>
                          <SelectItem value="Laundry">Laundry</SelectItem>
                          <SelectItem value="Car rental">Car rental</SelectItem>
                          <SelectItem value="Transportation">Transportation</SelectItem>
                          <SelectItem value="Chef on call">Chef on call</SelectItem>
                          <SelectItem value="In-house catering">In-house catering</SelectItem>
                          <SelectItem value="Doctor on call">Doctor on call</SelectItem>
                          <SelectItem value="Grocery">Grocery</SelectItem>
                          <SelectItem value="Food delivery">Food delivery</SelectItem>
                          <SelectItem value="House keeping">House keeping</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="e.g. contact@company.com" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                      <Input 
                        id="phone" 
                        placeholder="e.g. +1 (555) 019-2834" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Textarea 
                      id="address" 
                      placeholder="Enter full physical address..." 
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricingDetails">Describe Services & Pricing Structure <span className="text-destructive">*</span></Label>
                    <Textarea 
                      id="pricingDetails" 
                      placeholder="Describe the services you offer, base rates, capacity, and any additional fees..." 
                      className="min-h-[150px]"
                      value={formData.pricingDetails}
                      onChange={e => setFormData({...formData, pricingDetails: e.target.value})}
                      required
                    />
                  </div>
                  <div className="p-4 bg-accent/30 rounded-lg border border-dashed text-xs text-muted-foreground space-y-1">
                    <p className="font-semibold text-foreground">Note on Platform Commission:</p>
                    <p>Straizen charges a standard 15% commission on all completed bookings. Please factor this into your pricing structure.</p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Trade License Upload */}
                    <div className="border rounded-xl p-4 flex flex-col items-center justify-center text-center bg-muted/10 border-dashed">
                      <Building2 className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-xs font-semibold">Trade License <span className="text-destructive">*</span></p>
                      <p className="text-[10px] text-muted-foreground mt-1 mb-3">Upload valid Trade License PDF</p>
                      <Label htmlFor="upload-license" className="cursor-pointer">
                        <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" /> Select File
                        </div>
                        <Input 
                          id="upload-license" 
                          type="file" 
                          accept=".pdf,.jpg,.png" 
                          className="hidden" 
                          onChange={e => handleFileUpload(e, 'Trade License')}
                        />
                      </Label>
                    </div>

                    {/* Insurance Certificate Upload */}
                    <div className="border rounded-xl p-4 flex flex-col items-center justify-center text-center bg-muted/10 border-dashed">
                      <ShieldCheck className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-xs font-semibold">Liability Insurance</p>
                      <p className="text-[10px] text-muted-foreground mt-1 mb-3">Upload valid Insurance Certificate</p>
                      <Label htmlFor="upload-insurance" className="cursor-pointer">
                        <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded text-xs font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" /> Select File
                        </div>
                        <Input 
                          id="upload-insurance" 
                          type="file" 
                          accept=".pdf,.jpg,.png" 
                          className="hidden" 
                          onChange={e => handleFileUpload(e, 'Insurance Certificate')}
                        />
                      </Label>
                    </div>
                  </div>

                  {/* Uploaded Files List */}
                  {formData.uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Uploaded Documents</Label>
                      <div className="border rounded-lg divide-y bg-card">
                        {formData.uploadedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 text-xs">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-primary" />
                              <span className="font-medium">{file}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveFile(idx)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <form onSubmit={handleSubmitApplication} className="space-y-6">
                  <div className="border rounded-xl p-4 space-y-4 bg-muted/10 text-xs">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-muted-foreground font-medium">Company Name</p>
                        <p className="font-semibold text-sm mt-0.5">{formData.companyName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium">Service Category</p>
                        <p className="font-semibold text-sm mt-0.5 capitalize">{formData.category}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium">Primary Contact</p>
                        <p className="font-semibold mt-0.5">{formData.contactName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium">Email & Phone</p>
                        <p className="font-semibold mt-0.5">{formData.email} • {formData.phone}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-muted-foreground font-medium">Services & Pricing Summary</p>
                      <p className="font-medium mt-1 whitespace-pre-wrap">{formData.pricingDetails}</p>
                    </div>

                    {formData.uploadedFiles.length > 0 && (
                      <div className="pt-3 border-t">
                        <p className="text-muted-foreground font-medium mb-1.5">Uploaded Documents</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.uploadedFiles.map((file, idx) => (
                            <Badge key={idx} variant="outline" className="bg-background gap-1 py-1">
                              <FileText className="w-3 h-3 text-primary" />
                              {file.split(': ')[1] || file}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: !!checked})}
                    />
                    <Label htmlFor="terms" className="text-xs font-normal leading-tight cursor-pointer">
                      I certify that all information provided is accurate and valid. I agree to Straizen's Vendor Terms of Service and the 15% platform commission.
                    </Label>
                  </div>
                </form>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t mt-6">
                {step > 1 ? (
                  <Button variant="outline" onClick={handleBack} className="gap-1.5">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <Button onClick={handleNext} className="gap-1.5">
                    Next <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmitApplication} className="gap-1.5 bg-primary text-primary-foreground">
                    Submit Application <CheckCircle2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Applications Queue Tab */
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left side: Applications List */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Onboarding Applications Queue</CardTitle>
              <CardDescription>Review and process registration requests from prospective vendors.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow 
                      key={app.id} 
                      className={`cursor-pointer hover:bg-muted/50 transition-colors ${selectedApp?.id === app.id ? 'bg-accent' : ''}`}
                      onClick={() => setSelectedApp(app)}
                    >
                      <TableCell className="font-bold">{app.id}</TableCell>
                      <TableCell className="font-semibold">{app.companyName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 capitalize">
                          {app.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{app.contactPerson}</TableCell>
                      <TableCell className="text-xs font-mono">{app.submittedDate}</TableCell>
                      <TableCell>
                        <Badge variant={
                          app.status === 'Approved' ? 'default' : 
                          app.status === 'Rejected' ? 'destructive' : 
                          app.status === 'Pending Review' ? 'secondary' : 'outline'
                        }>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-primary"
                          onClick={() => setSelectedApp(app)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Right side: Selected Application Details */}
          <div className="md:col-span-1">
            {selectedApp ? (
              <Card className="border-primary/20 shadow-sm">
                <CardHeader className="border-b bg-muted/10 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{selectedApp.companyName}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">ID: {selectedApp.id}</p>
                    </div>
                    <Badge variant={
                      selectedApp.status === 'Approved' ? 'default' : 
                      selectedApp.status === 'Rejected' ? 'destructive' : 'secondary'
                    }>
                      {selectedApp.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6 text-xs">
                  <div className="space-y-3">
                    <h4 className="font-bold uppercase tracking-wider text-muted-foreground">Contact Information</h4>
                    <div className="border rounded-lg p-3 space-y-2 bg-card">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-primary" />
                        <span className="font-medium">{selectedApp.contactPerson}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-primary" />
                        <span>{selectedApp.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>Submitted: {selectedApp.submittedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold uppercase tracking-wider text-muted-foreground">Uploaded Documents</h4>
                    <div className="border rounded-lg divide-y bg-card">
                      {selectedApp.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="font-medium truncate max-w-[180px]">{doc}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 text-primary">View</Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedApp.status === 'Pending Review' && (
                    <div className="pt-4 border-t flex gap-3">
                      <Button 
                        className="flex-1 gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApprove(selectedApp.id)}
                      >
                        <Check className="w-4 h-4" /> Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="flex-1 gap-1.5"
                        onClick={() => handleReject(selectedApp.id)}
                      >
                        <X className="w-4 h-4" /> Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl min-h-[300px]">
                <Building2 className="w-10 h-10 text-muted-foreground/40 mb-3" />
                <h4 className="font-semibold text-sm">No Application Selected</h4>
                <p className="text-xs text-muted-foreground max-w-xs mt-1">
                  Select an onboarding application from the queue to view details, verify documents, and approve or reject.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOnboarding;