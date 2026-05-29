"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Globe, User, Save, Plus, FileUp, FileText, X } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const TravelPolicy = () => {
  const [globalMode, setGlobalMode] = useState<'manual' | 'pdf'>('manual');
  const [individualMode, setIndividualMode] = useState<'manual' | 'pdf'>('manual');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleSave = () => {
    showSuccess("Policy rules updated successfully.");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      showSuccess(`File "${file.name}" uploaded successfully.`);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="global">
        <TabsList className="mb-4">
          <TabsTrigger value="global" className="flex gap-2">
            <Globe className="w-4 h-4" /> Global Policy
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex gap-2">
            <User className="w-4 h-4" /> Individual Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Global Rules Engine</CardTitle>
                <CardDescription>These rules apply to all employees within the corporate account.</CardDescription>
              </div>
              <div className="flex bg-muted p-1 rounded-lg">
                <Button 
                  variant={globalMode === 'manual' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setGlobalMode('manual')}
                  className="text-xs h-8"
                >
                  Manual Entry
                </Button>
                <Button 
                  variant={globalMode === 'pdf' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setGlobalMode('pdf')}
                  className="text-xs h-8"
                >
                  PDF Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {globalMode === 'manual' ? (
                <>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Max Budget per Night</Label>
                          <p className="text-xs text-muted-foreground">Limit the maximum cost for accommodation.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">$</span>
                          <Input className="w-24 h-8" defaultValue="250" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Business Class Travel</Label>
                          <p className="text-xs text-muted-foreground">Allow business class for flights over 6 hours.</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Advance Booking Required</Label>
                          <p className="text-xs text-muted-foreground">Minimum days before trip to book.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input className="w-24 h-8" defaultValue="14" />
                          <span className="text-sm font-medium">Days</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Auto-Approval Threshold</Label>
                          <p className="text-xs text-muted-foreground">Approve trips below this total amount.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">$</span>
                          <Input className="w-24 h-8" defaultValue="1500" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSave} className="gap-2">
                      <Save className="w-4 h-4" /> Save Global Policy
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 bg-muted/30">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <FileUp className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold">Upload Global Policy PDF</h4>
                  <p className="text-sm text-muted-foreground text-center max-w-xs mt-2 mb-6">
                    Upload a PDF document containing the travel policy rules. Our system will parse and apply these rules globally.
                  </p>
                  <div className="flex flex-col items-center gap-4">
                    <Label htmlFor="global-pdf" className="cursor-pointer">
                      <div className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        Select PDF File
                      </div>
                      <Input 
                        id="global-pdf" 
                        type="file" 
                        accept=".pdf" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                    </Label>
                    {uploadedFile && (
                      <div className="flex items-center gap-2 text-sm bg-accent px-3 py-1.5 rounded-full">
                        <FileText className="w-4 h-4" />
                        <span>{uploadedFile}</span>
                        <button onClick={() => setUploadedFile(null)} className="hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Individual Overrides</CardTitle>
                <CardDescription>Set specific rules for individual employees (e.g., Executives).</CardDescription>
              </div>
              <div className="flex bg-muted p-1 rounded-lg">
                <Button 
                  variant={individualMode === 'manual' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setIndividualMode('manual')}
                  className="text-xs h-8"
                >
                  Manual Entry
                </Button>
                <Button 
                  variant={individualMode === 'pdf' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setIndividualMode('pdf')}
                  className="text-xs h-8"
                >
                  PDF Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {individualMode === 'manual' ? (
                <>
                  <div className="flex gap-2 max-w-md">
                    <Input placeholder="Search employee by name or ID..." />
                    <Button variant="secondary">Search</Button>
                  </div>
                  
                  <div className="border rounded-lg p-8 text-center bg-muted/30">
                    <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="font-medium">No Employee Selected</h4>
                    <p className="text-sm text-muted-foreground mt-1">Search for an employee to manage their individual travel rules.</p>
                    <Button variant="outline" className="mt-4 gap-2">
                      <Plus className="w-4 h-4" /> Add New Override
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 bg-muted/30">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <FileUp className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold">Upload Individual Policy PDF</h4>
                  <p className="text-sm text-muted-foreground text-center max-w-xs mt-2 mb-6">
                    Upload a PDF document for specific employee overrides. Please ensure the employee ID is mentioned in the document.
                  </p>
                  <div className="flex flex-col items-center gap-4">
                    <Label htmlFor="individual-pdf" className="cursor-pointer">
                      <div className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        Select PDF File
                      </div>
                      <Input 
                        id="individual-pdf" 
                        type="file" 
                        accept=".pdf" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                    </Label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TravelPolicy;