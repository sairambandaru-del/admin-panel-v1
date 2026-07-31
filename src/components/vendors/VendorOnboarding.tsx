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
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
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
  X,
  Send,
  Link as LinkIcon,
  Copy,
  Kanban,
  Search,
  Plus,
  Globe,
  Calendar,
  Code2,
  DollarSign,
  Edit2
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

export type CRMStage = 
  | 'New Lead'
  | 'In Discussion'
  | 'Contract Sent'
  | 'Contract Signed'
  | 'Onboarding Completed';

export interface VendorCRMLead {
  // 1. Vendor name & 2. Vendor category & 3. Status
  id: string;
  companyName: string;
  category: string;
  stage: CRMStage;

  // 4. Expected date of closure & 5. Expected date of API's
  expectedDateOfClosure: string;
  expectedDateOfAPIs: string;

  // 6. Source & 7. Account owner & 8. Mobile number & 9. Email id & 10. Website
  source: string;
  accountOwner: string;
  phone: string;
  email: string;
  website: string;

  // 11. Commercial model & 12. Concept document & 13. Pitch deck & 14. Agreed pricing model
  commercialModel: string;
  conceptDocument: 'Uploaded' | 'Pending' | 'N/A';
  pitchDeck: 'Uploaded' | 'Pending' | 'N/A';
  agreedPricingModel: string;

  // 15. Draft terms and conditions & 16. Contract & 17. Signed contract
  draftTermsAndConditions: 'Uploaded' | 'Pending' | 'N/A';
  contract: 'Uploaded' | 'Pending' | 'N/A';
  signedContract: 'Uploaded' | 'Pending' | 'N/A';

  // 18. Lead start date & 19. Expected date of signing the contract & 20. Closing date
  leadStartDate: string;
  expectedSigningDate: string;
  closingDate: string;

  // 21. Name of softwares used & 22. API documentation & 23. Type of integration
  softwareUsed: string;
  apiDocumentation: 'Uploaded' | 'Pending' | 'N/A';
  integrationType: 'API' | 'Admin Panel' | 'API & Admin Panel';

  // System helpers
  contactPerson: string;
  onboardingToken?: string;
  emailSentDate?: string;
  notes?: string;
}

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

const initialCRMLeads: VendorCRMLead[] = [
  {
    id: 'LEAD-101',
    companyName: 'Apex Luxury Fleet',
    category: 'Car rental',
    stage: 'Contract Signed',
    contactPerson: 'James Bond',
    email: 'james@apexfleet.com',
    phone: '+971 50 123 4567',
    website: 'https://apexfleet.ae',
    source: 'Inbound Referral',
    accountOwner: 'Sarah Jenkins',
    
    expectedDateOfClosure: '2024-05-30',
    expectedDateOfAPIs: '2024-06-05',
    leadStartDate: '2024-04-10',
    expectedSigningDate: '2024-05-20',
    closingDate: '2024-05-20',

    commercialModel: '15% Commission per booking',
    agreedPricingModel: 'Tiered daily rates with AED 2000 security deposit',
    
    conceptDocument: 'Uploaded',
    pitchDeck: 'Uploaded',
    draftTermsAndConditions: 'Uploaded',
    contract: 'Uploaded',
    signedContract: 'Uploaded',

    softwareUsed: 'FleetManager Pro & Odoo',
    apiDocumentation: 'Uploaded',
    integrationType: 'API & Admin Panel',

    onboardingToken: 'TOK-APEX-8821',
    emailSentDate: '2024-05-20 14:30',
    notes: 'Premium fleet supplier. Contract signed for 15% platform commission.'
  },
  {
    id: 'LEAD-102',
    companyName: 'Gourmet Chef Collective',
    category: 'Chef on call',
    stage: 'Contract Sent',
    contactPerson: 'Chef Auguste',
    email: 'auguste@gourmetchef.ae',
    phone: '+971 52 987 6543',
    website: 'https://gourmetchef.ae',
    source: 'Direct Outreach',
    accountOwner: 'Michael Chen',

    expectedDateOfClosure: '2024-06-15',
    expectedDateOfAPIs: '2024-06-20',
    leadStartDate: '2024-05-01',
    expectedSigningDate: '2024-05-28',
    closingDate: 'Pending',

    commercialModel: '12% Revenue Share',
    agreedPricingModel: 'Per-menu pricing with min AED 1200 order value',

    conceptDocument: 'Uploaded',
    pitchDeck: 'Uploaded',
    draftTermsAndConditions: 'Uploaded',
    contract: 'Uploaded',
    signedContract: 'Pending',

    softwareUsed: 'Custom Chef Portal',
    apiDocumentation: 'Pending',
    integrationType: 'Admin Panel',

    notes: 'Awaiting signature from legal team.'
  },
  {
    id: 'LEAD-103',
    companyName: 'Desert Oasis Yachting',
    category: 'Leisure activities',
    stage: 'In Discussion',
    contactPerson: 'Capt. Jack Sparrow',
    email: 'jack@oasisyachts.com',
    phone: '+971 55 444 3322',
    website: 'https://oasisyachts.com',
    source: 'Trade Show Expo',
    accountOwner: 'David Miller',

    expectedDateOfClosure: '2024-07-01',
    expectedDateOfAPIs: '2024-07-10',
    leadStartDate: '2024-05-10',
    expectedSigningDate: '2024-06-15',
    closingDate: 'Pending',

    commercialModel: '10% Commission',
    agreedPricingModel: 'Hourly charter rate plus fuel surcharge',

    conceptDocument: 'Uploaded',
    pitchDeck: 'Pending',
    draftTermsAndConditions: 'Pending',
    contract: 'Pending',
    signedContract: 'Pending',

    softwareUsed: 'YachtMaster OS',
    apiDocumentation: 'Pending',
    integrationType: 'API',

    notes: 'Reviewing category pricing structure.'
  }
];

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
  }
];

const VendorOnboarding = () => {
  const [activeTab, setActiveTab] = useState<'crm' | 'wizard' | 'queue'>('crm');
  const [crmLeads, setCrmLeads] = useState<VendorCRMLead[]>(initialCRMLeads);
  const [applications, setApplications] = useState<OnboardingApplication[]>(initialApplications);
  const [crmSearch, setCrmSearch] = useState('');

  // Selected Lead for 360° Inspector Modal / Drawer
  const [selectedLead, setSelectedLead] = useState<VendorCRMLead | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  
  // New Lead Dialog
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [leadForm, setLeadForm] = useState<VendorCRMLead>({
    id: '',
    companyName: '',
    category: 'Car rental',
    stage: 'New Lead',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    source: 'Direct Outreach',
    accountOwner: 'Sarah Jenkins',
    expectedDateOfClosure: '',
    expectedDateOfAPIs: '',
    leadStartDate: new Date().toISOString().split('T')[0],
    expectedSigningDate: '',
    closingDate: 'Pending',
    commercialModel: '15% Commission',
    agreedPricingModel: '',
    conceptDocument: 'Pending',
    pitchDeck: 'Pending',
    draftTermsAndConditions: 'Pending',
    contract: 'Pending',
    signedContract: 'Pending',
    softwareUsed: '',
    apiDocumentation: 'Pending',
    integrationType: 'API & Admin Panel',
    notes: ''
  });

  // Email Sent Modal State
  const [isEmailSentModalOpen, setIsEmailSentModalOpen] = useState(false);
  const [lastSentLead, setLastSentLead] = useState<VendorCRMLead | null>(null);

  // Form Wizard State
  const [step, setStep] = useState(1);
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

  // CRM Helper: Change Stage
  const handleStageChange = (leadId: string, newStage: CRMStage) => {
    setCrmLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const isContractSigned = newStage === 'Contract Signed';
        const token = lead.onboardingToken || `TOK-${lead.companyName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)}-${Math.floor(1000 + Math.random() * 9000)}`;
        const dateStr = new Date().toLocaleString();

        const updatedLead: VendorCRMLead = {
          ...lead,
          stage: newStage,
          signedContract: isContractSigned ? 'Uploaded' : lead.signedContract,
          closingDate: isContractSigned ? new Date().toISOString().split('T')[0] : lead.closingDate,
          onboardingToken: token,
          emailSentDate: isContractSigned ? dateStr : lead.emailSentDate
        };

        if (isContractSigned) {
          setLastSentLead(updatedLead);
          setIsEmailSentModalOpen(true);
          showSuccess(`Contract Signed! Onboarding invitation email sent to ${lead.email}`);
        } else {
          showSuccess(`Lead "${lead.companyName}" stage updated to ${newStage}.`);
        }

        if (selectedLead?.id === leadId) {
          setSelectedLead(updatedLead);
        }

        return updatedLead;
      }
      return lead;
    }));
  };

  const handleOpenAddLead = () => {
    setLeadForm({
      id: `LEAD-${100 + crmLeads.length + 1}`,
      companyName: '',
      category: 'Car rental',
      stage: 'New Lead',
      contactPerson: '',
      email: '',
      phone: '',
      website: 'https://',
      source: 'Direct Outreach',
      accountOwner: 'Sarah Jenkins',
      expectedDateOfClosure: '',
      expectedDateOfAPIs: '',
      leadStartDate: new Date().toISOString().split('T')[0],
      expectedSigningDate: '',
      closingDate: 'Pending',
      commercialModel: '15% Commission per booking',
      agreedPricingModel: '',
      conceptDocument: 'Pending',
      pitchDeck: 'Pending',
      draftTermsAndConditions: 'Pending',
      contract: 'Pending',
      signedContract: 'Pending',
      softwareUsed: '',
      apiDocumentation: 'Pending',
      integrationType: 'API & Admin Panel',
      notes: ''
    });
    setIsNewLeadOpen(true);
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.companyName || !leadForm.email || !leadForm.contactPerson) {
      showError("Please fill in company name, contact person, and email.");
      return;
    }

    // Check if updating existing or adding new
    const exists = crmLeads.some(l => l.id === leadForm.id);
    if (exists) {
      setCrmLeads(prev => prev.map(l => l.id === leadForm.id ? leadForm : l));
      showSuccess(`Lead "${leadForm.companyName}" updated.`);
    } else {
      setCrmLeads([leadForm, ...crmLeads]);
      showSuccess(`Vendor CRM Lead "${leadForm.companyName}" created.`);
    }

    setIsNewLeadOpen(false);
    if (selectedLead?.id === leadForm.id) {
      setSelectedLead(leadForm);
    }
  };

  const handleOpenInspector = (lead: VendorCRMLead) => {
    setSelectedLead(lead);
    setIsInspectorOpen(true);
  };

  const handleCopyOnboardingLink = (token?: string) => {
    const link = `https://straizen.app/onboard?token=${token || 'DEMO-TOKEN'}`;
    navigator.clipboard.writeText(link);
    showSuccess("Onboarding email link copied to clipboard!");
  };

  const handleLaunchOnboardingForLead = (lead: VendorCRMLead) => {
    setFormData(prev => ({
      ...prev,
      companyName: lead.companyName,
      category: lead.category,
      contactName: lead.contactPerson,
      email: lead.email,
      phone: lead.phone
    }));
    setActiveTab('wizard');
    showSuccess(`Pre-filled onboarding form with details for "${lead.companyName}".`);
  };

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
    
    // Update CRM lead stage to Completed if exists
    setCrmLeads(prev => prev.map(l => l.email === formData.email ? { ...l, stage: 'Onboarding Completed' } : l));

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
    showSuccess(`Application ${id} approved. Vendor is active in the registry.`);
    if (selectedApp?.id === id) {
      setSelectedApp(prev => prev ? { ...prev, status: 'Approved' } : null);
    }
  };

  const handleReject = (id: string) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'Rejected' } : app
    ));
    showError(`Application ${id} rejected.`);
    if (selectedApp?.id === id) {
      setSelectedApp(prev => prev ? { ...prev, status: 'Rejected' } : null);
    }
  };

  const filteredCRMLeads = crmLeads.filter(l => 
    l.companyName.toLowerCase().includes(crmSearch.toLowerCase()) ||
    l.contactPerson.toLowerCase().includes(crmSearch.toLowerCase()) ||
    l.email.toLowerCase().includes(crmSearch.toLowerCase()) ||
    l.accountOwner.toLowerCase().includes(crmSearch.toLowerCase()) ||
    l.id.toLowerCase().includes(crmSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Bar with Section Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Vendor CRM & Onboarding Pipeline</h3>
          <p className="text-sm text-muted-foreground">Manage prospective vendor leads, track 23 key CRM parameters, auto-trigger onboarding email links on Contract Signed, and review submissions.</p>
        </div>
        <div className="flex bg-muted p-1 rounded-lg border shrink-0">
          <Button 
            variant={activeTab === 'crm' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('crm')}
            className="text-xs h-8 gap-1.5"
          >
            <Kanban className="w-3.5 h-3.5" /> Vendor CRM Pipeline
          </Button>
          <Button 
            variant={activeTab === 'wizard' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('wizard')}
            className="text-xs h-8 gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> Onboarding Form
          </Button>
          <Button 
            variant={activeTab === 'queue' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('queue')}
            className="text-xs h-8 gap-1.5"
          >
            Submissions Queue
            {applications.filter(a => a.status === 'Pending Review').length > 0 && (
              <Badge variant="destructive" className="h-4 min-w-4 px-1 flex items-center justify-center text-[9px]">
                {applications.filter(a => a.status === 'Pending Review').length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* TAB 1: VENDOR CRM PIPELINE */}
      {activeTab === 'crm' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-base">Prospective Vendor CRM Directory (23 Tracking Attributes)</CardTitle>
                  <CardDescription className="text-xs">
                    Click any row to inspect all 23 details including technical integration, dates, commercial models, and contract documents.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-56">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search lead, owner, or email..."
                      value={crmSearch}
                      onChange={e => setCrmSearch(e.target.value)}
                      className="pl-8 h-9 text-xs"
                    />
                  </div>

                  <Button onClick={handleOpenAddLead} className="gap-1.5 h-9 text-xs shrink-0">
                    <Plus className="w-3.5 h-3.5" /> Add CRM Lead
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="rounded-md border-t overflow-x-auto">
                <Table className="min-w-[1100px]">
                  <TableHeader>
                    <TableRow className="bg-muted/30 text-[11px]">
                      <TableHead className="min-w-[210px]">Vendor & Category</TableHead>
                      <TableHead className="min-w-[150px]">Account Owner & Source</TableHead>
                      <TableHead className="min-w-[180px]">Status Stage</TableHead>
                      <TableHead className="min-w-[160px]">Integration Type & Software</TableHead>
                      <TableHead className="min-w-[150px]">Target Dates (Signing / APIs)</TableHead>
                      <TableHead className="min-w-[170px]">Commercial Model</TableHead>
                      <TableHead className="min-w-[160px]">Legal Docs</TableHead>
                      <TableHead className="text-right min-w-[110px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCRMLeads.map((lead) => {
                      const isSigned = lead.stage === 'Contract Signed' || lead.stage === 'Onboarding Completed';

                      return (
                        <TableRow 
                          key={lead.id} 
                          className="hover:bg-muted/40 transition-colors cursor-pointer"
                          onClick={() => handleOpenInspector(lead)}
                        >
                          <TableCell className="align-top py-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-xs text-foreground">{lead.companyName}</span>
                                <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">({lead.id})</span>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-[10px] rounded-md bg-primary/5 text-primary border-primary/20 px-1.5 py-0 capitalize whitespace-nowrap">
                                  {lead.category}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{lead.contactPerson}</span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="align-top py-3">
                            <div className="text-xs space-y-0.5">
                              <p className="font-semibold text-foreground">{lead.accountOwner}</p>
                              <p className="text-[10px] text-muted-foreground whitespace-nowrap">Source: {lead.source}</p>
                            </div>
                          </TableCell>

                          <TableCell className="align-top py-3" onClick={e => e.stopPropagation()}>
                            <div className="space-y-1.5 max-w-[170px]">
                              <Select 
                                value={lead.stage} 
                                onValueChange={(val: CRMStage) => handleStageChange(lead.id, val)}
                              >
                                <SelectTrigger className={cn(
                                  "h-8 text-xs font-bold w-full rounded-md",
                                  lead.stage === 'Contract Signed' ? 'border-emerald-500 bg-emerald-50 text-emerald-900' :
                                  lead.stage === 'Onboarding Completed' ? 'border-blue-500 bg-blue-50 text-blue-900' :
                                  'bg-background'
                                )}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="New Lead" className="text-xs">New Lead</SelectItem>
                                  <SelectItem value="In Discussion" className="text-xs">In Discussion</SelectItem>
                                  <SelectItem value="Contract Sent" className="text-xs">Contract Sent</SelectItem>
                                  <SelectItem value="Contract Signed" className="text-xs font-bold text-emerald-600">
                                    Contract Signed (Auto-Send Link)
                                  </SelectItem>
                                  <SelectItem value="Onboarding Completed" className="text-xs">Onboarding Completed</SelectItem>
                                </SelectContent>
                              </Select>

                              {lead.stage === 'Contract Signed' && (
                                <span className="block text-[9px] text-emerald-600 font-bold flex items-center gap-1 whitespace-nowrap">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                  Onboarding Email Sent
                                </span>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="align-top py-3">
                            <div className="text-xs space-y-1">
                              <Badge variant="outline" className="text-[9px] rounded-md py-0.5 px-1.5 font-mono whitespace-nowrap">
                                <Code2 className="w-2.5 h-2.5 mr-1 text-primary shrink-0 inline-block" />
                                {lead.integrationType}
                              </Badge>
                              <p className="text-[10px] text-muted-foreground truncate max-w-[150px]" title={lead.softwareUsed}>
                                {lead.softwareUsed || 'Software TBD'}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="align-top py-3">
                            <div className="text-[10px] font-mono space-y-0.5 whitespace-nowrap">
                              <p className="text-foreground"><span className="text-muted-foreground font-normal">Signing:</span> <span className="font-bold">{lead.expectedSigningDate || 'TBD'}</span></p>
                              <p className="text-muted-foreground"><span>APIs:</span> {lead.expectedDateOfAPIs || 'TBD'}</p>
                            </div>
                          </TableCell>

                          <TableCell className="align-top py-3">
                            <p className="text-xs font-semibold text-primary">
                              {lead.commercialModel}
                            </p>
                          </TableCell>

                          <TableCell className="align-top py-3">
                            <Badge 
                              variant={lead.signedContract === 'Uploaded' ? 'default' : 'outline'}
                              className={cn(
                                "text-[10px] rounded-md px-2 py-0.5 font-medium whitespace-nowrap border",
                                lead.signedContract === 'Uploaded' 
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600" 
                                  : "bg-muted/40 text-muted-foreground border-muted-foreground/30"
                              )}
                            >
                              Contract: {lead.signedContract}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right align-top py-3" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-xs text-primary hover:text-primary gap-1 px-2 whitespace-nowrap"
                                onClick={() => handleOpenInspector(lead)}
                              >
                                <Eye className="w-3.5 h-3.5" /> 360° View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 360° LEAD INSPECTOR MODAL (Viewing & Editing all 23 details) */}
      <Dialog open={isInspectorOpen} onOpenChange={setIsInspectorOpen}>
        <DialogContent className="sm:max-w-[750px] max-h-[92vh] flex flex-col p-0 overflow-hidden">
          {selectedLead && (
            <>
              <DialogHeader className="p-5 pr-12 bg-muted/30 border-b shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <DialogTitle className="text-lg font-bold">{selectedLead.companyName}</DialogTitle>
                      <Badge variant="outline" className="text-[10px] font-mono font-bold bg-primary/5 text-primary border-primary/20">
                        {selectedLead.id}
                      </Badge>
                      <Badge variant={selectedLead.stage === 'Contract Signed' ? 'default' : 'secondary'}>
                        {selectedLead.stage}
                      </Badge>
                    </div>
                    <DialogDescription className="text-xs mt-1.5 flex items-center gap-3 text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <User className="w-3.5 h-3.5 text-primary" /> {selectedLead.contactPerson} ({selectedLead.email})
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground" /> {selectedLead.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-muted-foreground" /> {selectedLead.website}
                      </span>
                    </DialogDescription>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1 text-xs shrink-0"
                    onClick={() => {
                      setLeadForm(selectedLead);
                      setIsInspectorOpen(false);
                      setIsNewLeadOpen(true);
                    }}
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Parameters
                  </Button>
                </div>
              </DialogHeader>

              <div className="p-5 overflow-y-auto space-y-6 max-h-[620px] text-xs">
                {/* Section 1: General & Account Info */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-primary" /> General & Account Details
                  </h4>
                  <div className="grid grid-cols-3 gap-3 bg-muted/20 p-3 rounded-xl border">
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase block">Vendor Category</span>
                      <span className="font-bold text-foreground text-xs">{selectedLead.category}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase block">Account Owner</span>
                      <span className="font-bold text-foreground text-xs">{selectedLead.accountOwner}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase block">Lead Source</span>
                      <span className="font-semibold text-foreground text-xs">{selectedLead.source}</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Key Milestones & Dates (5 Tracking Dates) */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" /> Timeline & Milestone Dates
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border rounded-xl p-3 bg-card font-mono text-[11px]">
                    <div className="space-y-0.5 border-r pr-2">
                      <span className="text-[9px] text-muted-foreground uppercase block font-bold">Lead Start Date</span>
                      <span className="font-bold text-foreground">{selectedLead.leadStartDate || 'N/A'}</span>
                    </div>
                    <div className="space-y-0.5 border-r pr-2">
                      <span className="text-[9px] text-muted-foreground uppercase block font-bold">Expected Signing</span>
                      <span className="font-bold text-primary">{selectedLead.expectedSigningDate || 'Pending'}</span>
                    </div>
                    <div className="space-y-0.5 border-r pr-2">
                      <span className="text-[9px] text-muted-foreground uppercase block font-bold">Expected Closure</span>
                      <span className="font-bold text-foreground">{selectedLead.expectedDateOfClosure || 'Pending'}</span>
                    </div>
                    <div className="space-y-0.5 border-r pr-2">
                      <span className="text-[9px] text-muted-foreground uppercase block font-bold">Expected APIs</span>
                      <span className="font-bold text-foreground">{selectedLead.expectedDateOfAPIs || 'Pending'}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-muted-foreground uppercase block font-bold">Closing Date</span>
                      <span className="font-bold text-emerald-600">{selectedLead.closingDate || 'Pending'}</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Technical & Software Architecture */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-primary" /> Software & Integration Specs
                  </h4>
                  <div className="grid grid-cols-3 gap-3 border rounded-xl p-3 bg-card">
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase block">Type of Integration</span>
                      <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20 mt-1">
                        {selectedLead.integrationType}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase block">Name of Software Used</span>
                      <span className="font-bold text-foreground text-xs mt-1 block">{selectedLead.softwareUsed || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase block">API Documentation Status</span>
                      <Badge variant={selectedLead.apiDocumentation === 'Uploaded' ? 'default' : 'secondary'} className="text-[10px] mt-1">
                        {selectedLead.apiDocumentation}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Section 4: Commercials & Pricing Models */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-primary" /> Commercial & Pricing Structure
                  </h4>
                  <div className="grid grid-cols-2 gap-3 border rounded-xl p-3 bg-primary/5 border-primary/20">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block">Commercial Model</span>
                      <p className="font-bold text-primary text-xs mt-0.5">{selectedLead.commercialModel}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block">Agreed Pricing Model</span>
                      <p className="font-semibold text-foreground text-xs mt-0.5">{selectedLead.agreedPricingModel || 'Standard rate card agreed'}</p>
                    </div>
                  </div>
                </div>

                {/* Section 5: Legal & Pitch Documentation Checklist */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Legal & Proposal Documentation
                  </h4>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="border rounded-lg p-2.5 bg-card">
                      <span className="text-[9px] text-muted-foreground uppercase font-bold block mb-1">Concept Doc</span>
                      <Badge variant={selectedLead.conceptDocument === 'Uploaded' ? 'default' : 'outline'} className="text-[9px] rounded-md">
                        {selectedLead.conceptDocument}
                      </Badge>
                    </div>

                    <div className="border rounded-lg p-2.5 bg-card">
                      <span className="text-[9px] text-muted-foreground uppercase font-bold block mb-1">Pitch Deck</span>
                      <Badge variant={selectedLead.pitchDeck === 'Uploaded' ? 'default' : 'outline'} className="text-[9px] rounded-md">
                        {selectedLead.pitchDeck}
                      </Badge>
                    </div>

                    <div className="border rounded-lg p-2.5 bg-card">
                      <span className="text-[9px] text-muted-foreground uppercase font-bold block mb-1">Draft T&C</span>
                      <Badge variant={selectedLead.draftTermsAndConditions === 'Uploaded' ? 'default' : 'outline'} className="text-[9px] rounded-md">
                        {selectedLead.draftTermsAndConditions}
                      </Badge>
                    </div>

                    <div className="border rounded-lg p-2.5 bg-card">
                      <span className="text-[9px] text-muted-foreground uppercase font-bold block mb-1">Contract</span>
                      <Badge variant={selectedLead.contract === 'Uploaded' ? 'default' : 'outline'} className="text-[9px] rounded-md">
                        {selectedLead.contract}
                      </Badge>
                    </div>

                    <div className="border rounded-lg p-2.5 bg-emerald-50 border-emerald-200">
                      <span className="text-[9px] text-emerald-900 uppercase font-bold block mb-1">Signed Contract</span>
                      <Badge className={cn("text-[9px] rounded-md", selectedLead.signedContract === 'Uploaded' ? 'bg-emerald-600' : 'bg-secondary')}>
                        {selectedLead.signedContract}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Section 6: Notes */}
                {selectedLead.notes && (
                  <div className="p-3 bg-muted/30 rounded-xl border">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Account Manager Notes</span>
                    <p className="text-xs text-foreground italic">{selectedLead.notes}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="p-4 border-t bg-muted/20 gap-2 shrink-0 sm:gap-0">
                <Button variant="outline" size="sm" onClick={() => setIsInspectorOpen(false)}>
                  Close
                </Button>
                {selectedLead.stage === 'Contract Signed' && (
                  <Button 
                    size="sm" 
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    onClick={() => handleLaunchOnboardingForLead(selectedLead)}
                  >
                    <LinkIcon className="w-3.5 h-3.5" /> Launch Onboarding Form
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* CREATE / EDIT VENDOR LEAD MODAL (FULL 23 PARAMETERS) */}
      <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[92vh] flex flex-col p-0 overflow-hidden">
          <form onSubmit={handleSaveLead} className="flex flex-col h-full overflow-hidden">
            <DialogHeader className="p-5 bg-muted/30 border-b shrink-0">
              <DialogTitle className="text-base font-bold">
                {leadForm.id ? `Edit Vendor Lead (${leadForm.id})` : 'Add Prospective Vendor CRM Lead'}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Configure all 23 parameters including contacts, milestone dates, software integration, commercial models, and contract documents.
              </DialogDescription>
            </DialogHeader>

            <div className="p-5 overflow-y-auto space-y-4 max-h-[580px] text-xs">
              {/* Row 1: Vendor Name, Category, Status */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="c-name">Vendor Name *</Label>
                  <Input 
                    id="c-name" 
                    placeholder="e.g. Apex Luxury Fleet" 
                    value={leadForm.companyName}
                    onChange={e => setLeadForm({...leadForm, companyName: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="c-cat">Vendor Category</Label>
                  <Select value={leadForm.category} onValueChange={v => setLeadForm({...leadForm, category: v})}>
                    <SelectTrigger id="c-cat"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Car rental">Car rental</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="House keeping">House keeping</SelectItem>
                      <SelectItem value="Laundry">Laundry</SelectItem>
                      <SelectItem value="Chef on call">Chef on call</SelectItem>
                      <SelectItem value="In-house catering">In-house catering</SelectItem>
                      <SelectItem value="Doctor on call">Doctor on call</SelectItem>
                      <SelectItem value="Wellness">Wellness</SelectItem>
                      <SelectItem value="Leisure activities">Leisure activities</SelectItem>
                      <SelectItem value="Dining">Dining</SelectItem>
                      <SelectItem value="Co-working">Co-working</SelectItem>
                      <SelectItem value="Grocery">Grocery</SelectItem>
                      <SelectItem value="Food delivery">Food delivery</SelectItem>
                      <SelectItem value="Short term rental">Short term rental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="c-stage">Status (CRM Stage)</Label>
                  <Select value={leadForm.stage} onValueChange={(v: CRMStage) => setLeadForm({...leadForm, stage: v})}>
                    <SelectTrigger id="c-stage"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New Lead">New Lead</SelectItem>
                      <SelectItem value="In Discussion">In Discussion</SelectItem>
                      <SelectItem value="Contract Sent">Contract Sent</SelectItem>
                      <SelectItem value="Contract Signed">Contract Signed</SelectItem>
                      <SelectItem value="Onboarding Completed">Onboarding Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Account Owner, Source, Contact Person */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="c-owner">Account Owner</Label>
                  <Input 
                    id="c-owner" 
                    placeholder="e.g. Sarah Jenkins" 
                    value={leadForm.accountOwner}
                    onChange={e => setLeadForm({...leadForm, accountOwner: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="c-source">Lead Source</Label>
                  <Input 
                    id="c-source" 
                    placeholder="e.g. Referral / Outreach" 
                    value={leadForm.source}
                    onChange={e => setLeadForm({...leadForm, source: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="c-contact">Mobile / Contact Person *</Label>
                  <Input 
                    id="c-contact" 
                    placeholder="Contact Name" 
                    value={leadForm.contactPerson}
                    onChange={e => setLeadForm({...leadForm, contactPerson: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Row 3: Phone, Email, Website */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="c-phone">Mobile Number</Label>
                  <Input 
                    id="c-phone" 
                    placeholder="+971 50 123 4567" 
                    value={leadForm.phone}
                    onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="c-email">Email ID *</Label>
                  <Input 
                    id="c-email" 
                    type="email" 
                    placeholder="contact@company.com" 
                    value={leadForm.email}
                    onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="c-web">Website</Label>
                  <Input 
                    id="c-web" 
                    placeholder="https://company.com" 
                    value={leadForm.website}
                    onChange={e => setLeadForm({...leadForm, website: e.target.value})}
                  />
                </div>
              </div>

              {/* Row 4: Commercial Model & Agreed Pricing Model */}
              <div className="grid grid-cols-2 gap-3 bg-primary/5 p-3 rounded-xl border border-primary/20">
                <div className="space-y-1">
                  <Label htmlFor="c-comm">Commercial Model</Label>
                  <Input 
                    id="c-comm" 
                    placeholder="e.g. 15% Commission per booking" 
                    value={leadForm.commercialModel}
                    onChange={e => setLeadForm({...leadForm, commercialModel: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="c-pricing">Agreed Pricing Model</Label>
                  <Input 
                    id="c-pricing" 
                    placeholder="e.g. Tiered daily rate card with deposit" 
                    value={leadForm.agreedPricingModel}
                    onChange={e => setLeadForm({...leadForm, agreedPricingModel: e.target.value})}
                  />
                </div>
              </div>

              {/* Row 5: Technical & Integration Specs */}
              <div className="grid grid-cols-3 gap-3 bg-muted/20 p-3 rounded-xl border">
                <div className="space-y-1">
                  <Label htmlFor="c-sw">Name of Softwares Used</Label>
                  <Input 
                    id="c-sw" 
                    placeholder="e.g. FleetManager Pro / Odoo" 
                    value={leadForm.softwareUsed}
                    onChange={e => setLeadForm({...leadForm, softwareUsed: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="c-type">Type of Integration</Label>
                  <Select 
                    value={leadForm.integrationType} 
                    onValueChange={(v: any) => setLeadForm({...leadForm, integrationType: v})}
                  >
                    <SelectTrigger id="c-type"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="API">API Only</SelectItem>
                      <SelectItem value="Admin Panel">Admin Panel Only</SelectItem>
                      <SelectItem value="API & Admin Panel">API & Admin Panel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="c-apidoc">API Documentation</Label>
                  <Select 
                    value={leadForm.apiDocumentation} 
                    onValueChange={(v: any) => setLeadForm({...leadForm, apiDocumentation: v})}
                  >
                    <SelectTrigger id="c-apidoc"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Uploaded">Uploaded</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="N/A">N/A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 6: Milestone Dates (5 Dates) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border p-3 rounded-xl bg-card">
                <div className="space-y-1">
                  <Label htmlFor="d-start" className="text-[10px]">Lead Start Date</Label>
                  <Input 
                    id="d-start" 
                    type="date" 
                    className="h-8 text-[11px]" 
                    value={leadForm.leadStartDate}
                    onChange={e => setLeadForm({...leadForm, leadStartDate: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="d-sign" className="text-[10px]">Expected Signing</Label>
                  <Input 
                    id="d-sign" 
                    type="date" 
                    className="h-8 text-[11px]" 
                    value={leadForm.expectedSigningDate}
                    onChange={e => setLeadForm({...leadForm, expectedSigningDate: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="d-closure" className="text-[10px]">Expected Closure</Label>
                  <Input 
                    id="d-closure" 
                    type="date" 
                    className="h-8 text-[11px]" 
                    value={leadForm.expectedDateOfClosure}
                    onChange={e => setLeadForm({...leadForm, expectedDateOfClosure: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="d-api" className="text-[10px]">Expected Date APIs</Label>
                  <Input 
                    id="d-api" 
                    type="date" 
                    className="h-8 text-[11px]" 
                    value={leadForm.expectedDateOfAPIs}
                    onChange={e => setLeadForm({...leadForm, expectedDateOfAPIs: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="d-close" className="text-[10px]">Closing Date</Label>
                  <Input 
                    id="d-close" 
                    placeholder="e.g. 2024-05-20" 
                    className="h-8 text-[11px]" 
                    value={leadForm.closingDate}
                    onChange={e => setLeadForm({...leadForm, closingDate: e.target.value})}
                  />
                </div>
              </div>

              {/* Row 7: Legal Documents Status (5 Docs) */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Legal & Pitch Document Statuses</Label>
                <div className="grid grid-cols-5 gap-2 border p-3 rounded-xl bg-card">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold">Concept Doc</span>
                    <Select value={leadForm.conceptDocument} onValueChange={(v: any) => setLeadForm({...leadForm, conceptDocument: v})}>
                      <SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Uploaded">Uploaded</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold">Pitch Deck</span>
                    <Select value={leadForm.pitchDeck} onValueChange={(v: any) => setLeadForm({...leadForm, pitchDeck: v})}>
                      <SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Uploaded">Uploaded</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold">Draft T&C</span>
                    <Select value={leadForm.draftTermsAndConditions} onValueChange={(v: any) => setLeadForm({...leadForm, draftTermsAndConditions: v})}>
                      <SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Uploaded">Uploaded</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold">Contract</span>
                    <Select value={leadForm.contract} onValueChange={(v: any) => setLeadForm({...leadForm, contract: v})}>
                      <SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Uploaded">Uploaded</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold">Signed Contract</span>
                    <Select value={leadForm.signedContract} onValueChange={(v: any) => setLeadForm({...leadForm, signedContract: v})}>
                      <SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Uploaded">Uploaded</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <Label htmlFor="c-notes">Notes / Deal Parameters</Label>
                <Textarea 
                  id="c-notes" 
                  placeholder="Enter initial terms or deal notes..." 
                  value={leadForm.notes}
                  onChange={e => setLeadForm({...leadForm, notes: e.target.value})}
                  className="min-h-[50px]"
                />
              </div>
            </div>

            <DialogFooter className="p-4 border-t bg-muted/20 gap-2 shrink-0 sm:gap-0">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsNewLeadOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold">
                Save Vendor CRM Lead
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* TAB 2: VENDOR ONBOARDING WIZARD FORM */}
      {activeTab === 'wizard' && (
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
      )}

      {/* TAB 3: APPLICATIONS QUEUE */}
      {activeTab === 'queue' && (
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

      {/* AUTOMATED EMAIL SENT MODAL CONFIRMATION */}
      <Dialog open={isEmailSentModalOpen} onOpenChange={setIsEmailSentModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          {lastSentLead && (
            <div>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-bold text-foreground">
                      Contract Signed - Automated Email Sent!
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      Onboarding invitation dispatched to <span className="font-bold text-foreground">{lastSentLead.email}</span>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-4 space-y-4 text-xs">
                <div className="border-2 border-emerald-200 bg-emerald-50/60 p-3.5 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-900">{lastSentLead.companyName}</span>
                    <Badge className="bg-emerald-600 text-white text-[10px]">
                      Contract Signed
                    </Badge>
                  </div>
                  <p className="text-emerald-800">
                    The vendor contact ({lastSentLead.contactPerson}) has been emailed a unique registration link to fill out the 4-step Onboarding Form.
                  </p>
                </div>

                <div className="space-y-1.5 border rounded-lg p-3 bg-muted/20">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Unique Vendor Onboarding Link</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      readOnly 
                      value={`https://straizen.app/onboard?token=${lastSentLead.onboardingToken}`}
                      className="font-mono text-xs h-8 bg-background"
                    />
                    <Button 
                      size="sm" 
                      className="h-8 shrink-0 gap-1"
                      onClick={() => handleCopyOnboardingLink(lastSentLead.onboardingToken)}
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" size="sm" onClick={() => setIsEmailSentModalOpen(false)}>
                  Close
                </Button>
                <Button 
                  size="sm" 
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => {
                    setIsEmailSentModalOpen(false);
                    handleLaunchOnboardingForLead(lastSentLead);
                  }}
                >
                  <LinkIcon className="w-3.5 h-3.5" /> Open & Fill Form
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorOnboarding;