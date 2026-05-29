"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Globe, User, Save, Plus, FileUp, FileText, Trash2, Download } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const TravelPolicy = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: "Global_Travel_Policy_2024.pdf", size: "1.2 MB", date: "2024-01-15" },
    { id: 2, name: "Expense_Guidelines_v2.pdf", size: "850 KB", date: "2024-03-10" }
  ]);

  const handleSave = () => {
    showSuccess("Policy rules updated successfully.");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc = {
        id: Date.now(),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        date: new Date().toISOString().split('T')[0]
      };
      setDocuments([...documents, newDoc]);
      showSuccess(`${file.name} uploaded successfully.`);
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
          <TabsTrigger value="documents" className="flex gap-2">
            <FileText className="w-4 h-4" /> Policy Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle>Global Rules Engine</CardTitle>
              <CardDescription>These rules apply to all employees within the corporate account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle>Individual Overrides</CardTitle>
              <CardDescription>Set specific rules for individual employees (e.g., Executives).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Policy Documents</CardTitle>
              <CardDescription>Upload and manage official PDF policy documentation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileUp className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF (MAX. 10MB)</p>
                  </div>
                  <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                </label>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Uploaded Documents</h4>
                <div className="grid gap-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-[10px] text-muted-foreground">{doc.size} • Uploaded on {doc.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            setDocuments(documents.filter(d => d.id !== doc.id));
                            showSuccess("Document removed.");
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {documents.length === 0 && (
                    <p className="text-sm text-center text-muted-foreground py-4">No documents uploaded yet.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TravelPolicy;