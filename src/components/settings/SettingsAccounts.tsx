"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Plus, Edit2, Power } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

export interface Account {
  id: string;
  name: string;
  type: 'STR' | 'Corporate' | 'Vendor';
  domain: string;
  allowedModules: string[];
  status: 'Active' | 'Inactive';
}

export const AVAILABLE_MODULES = [
  { id: 'dashboard', label: 'Dashboard & KPIs' },
  { id: 'corporate', label: 'Corporate Ecosystem' },
  { id: 'inventory', label: 'Unit Inventory' },
  { id: 'vendors', label: 'Vendors Registry' },
  { id: 'finance', label: 'Financial Reporting' }
];

// Seed some initial accounts including the new corporate accounts
export const initialAccounts: Account[] = [
  { id: 'ACC-01', name: 'TechCorp Solutions', type: 'Corporate', domain: 'techcorp.com', allowedModules: ['dashboard', 'corporate'], status: 'Active' },
  { id: 'ACC-02', name: 'Elite Housekeeping', type: 'Vendor', domain: 'elitehouse.com', allowedModules: ['dashboard', 'vendors'], status: 'Active' },
  { id: 'ACC-03', name: 'Skyline Holdings', type: 'STR', domain: 'skyline.com', allowedModules: ['dashboard', 'inventory', 'finance'], status: 'Active' },
  { id: 'ACC-04', name: 'Global Logistics Inc', type: 'Corporate', domain: 'globallogistics.com', allowedModules: ['dashboard', 'corporate'], status: 'Active' },
  { id: 'ACC-05', name: 'Stark Industries', type: 'Corporate', domain: 'starkindustries.com', allowedModules: ['dashboard', 'corporate', 'finance'], status: 'Active' },
  { id: 'ACC-06', name: 'Wayne Enterprises', type: 'Corporate', domain: 'waynecorp.com', allowedModules: ['dashboard', 'corporate', 'finance'], status: 'Active' },
];

const SettingsAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Corporate' as Account['type'],
    domain: '',
    allowedModules: ['dashboard'] as string[]
  });

  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newAccount: Account = {
      id: `ACC-0${accounts.length + 1}`,
      name: formData.name,
      type: formData.type,
      domain: formData.domain,
      allowedModules: formData.allowedModules,
      status: 'Active'
    };

    setAccounts([...accounts, newAccount]);
    setIsCreateOpen(false);
    // Reset
    setFormData({ name: '', type: 'Corporate', domain: '', allowedModules: ['dashboard'] });
    showSuccess(`Account "${newAccount.name}" created with custom access rights.`);
  };

  const handleToggleModule = (moduleId: string) => {
    setFormData(prev => ({
      ...prev,
      allowedModules: prev.allowedModules.includes(moduleId)
        ? prev.allowedModules.filter(id => id !== moduleId)
        : [...prev.allowedModules, moduleId]
    }));
  };

  const handleToggleStatus = (id: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        const nextStatus = acc.status === 'Active' ? 'Inactive' : 'Active';
        showSuccess(`Account "${acc.name}" status set to ${nextStatus}.`);
        return { ...acc, status: nextStatus };
      }
      return acc;
    }));
  };

  const handleEditClick = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      type: account.type,
      domain: account.domain,
      allowedModules: account.allowedModules
    });
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;

    setAccounts(prev => prev.map(acc => {
      if (acc.id === editingAccount.id) {
        return {
          ...acc,
          name: formData.name,
          type: formData.type,
          domain: formData.domain,
          allowedModules: formData.allowedModules
        };
      }
      return acc;
    }));

    setIsEditOpen(false);
    setEditingAccount(null);
    showSuccess(`Account details updated successfully.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Partner Accounts</h3>
          <p className="text-sm text-muted-foreground">Manage organizational boundaries and default permission scopes.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Create Partner Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Add New Partner Account</DialogTitle>
                <DialogDescription>
                  Partner accounts act as default security profiles for nested users.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Acme Corp" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Ecosystem Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(val: Account['type']) => setFormData({...formData, type: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Corporate">Corporate Partner</SelectItem>
                        <SelectItem value="Vendor">Vendor Provider</SelectItem>
                        <SelectItem value="STR">STR Host / Operator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="domain">Primary Domain</Label>
                    <Input 
                      id="domain" 
                      value={formData.domain} 
                      onChange={e => setFormData({...formData, domain: e.target.value})} 
                      placeholder="acme.com" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="text-sm font-semibold">Module Access Restrictions (Default)</Label>
                  <div className="space-y-2 border rounded-lg p-3 bg-muted/20">
                    {AVAILABLE_MODULES.map(module => (
                      <div key={module.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`module-${module.id}`} 
                          checked={formData.allowedModules.includes(module.id)}
                          onCheckedChange={() => handleToggleModule(module.id)}
                        />
                        <Label htmlFor={`module-${module.id}`} className="text-sm font-normal cursor-pointer">
                          {module.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Create Account Boundary</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Access Scopes Allowed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map(account => (
                <TableRow key={account.id} className={account.status === 'Inactive' ? 'opacity-60' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{account.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      account.type === 'Corporate' ? 'default' :
                      account.type === 'Vendor' ? 'secondary' : 'outline'
                    }>
                      {account.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{account.domain}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[320px]">
                      {account.allowedModules.map(mId => (
                        <Badge key={mId} variant="outline" className="text-[10px] py-0 px-1.5 capitalize bg-primary/5">
                          {AVAILABLE_MODULES.find(m => m.id === mId)?.label || mId}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={account.status === 'Active' ? 'default' : 'destructive'}>
                      {account.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(account)} title="Edit Account Permissions">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleToggleStatus(account.id)} 
                        title={account.status === 'Active' ? "Deactivate Account" : "Activate Account"}
                        className={account.status === 'Active' ? "text-destructive hover:text-destructive" : "text-green-600 hover:text-green-600"}
                      >
                        <Power className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[450px]">
          {editingAccount && (
            <form onSubmit={handleUpdate}>
              <DialogHeader>
                <DialogTitle>Edit Boundary: {editingAccount.name}</DialogTitle>
                <DialogDescription>
                  Update access controls. Users nested in this account will immediately be restricted to the updated settings.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Company Name</Label>
                  <Input 
                    id="edit-name" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-type">Ecosystem Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(val: Account['type']) => setFormData({...formData, type: val})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Corporate">Corporate Partner</SelectItem>
                        <SelectItem value="Vendor">Vendor Provider</SelectItem>
                        <SelectItem value="STR">STR Host / Operator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-domain">Primary Domain</Label>
                    <Input 
                      id="edit-domain" 
                      value={formData.domain} 
                      onChange={e => setFormData({...formData, domain: e.target.value})} 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="text-sm font-semibold">Allowed Scopes</Label>
                  <div className="space-y-2 border rounded-lg p-3 bg-muted/20">
                    {AVAILABLE_MODULES.map(module => (
                      <div key={module.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`edit-module-${module.id}`} 
                          checked={formData.allowedModules.includes(module.id)}
                          onCheckedChange={() => handleToggleModule(module.id)}
                        />
                        <Label htmlFor={`edit-module-${module.id}`} className="text-sm font-normal cursor-pointer">
                          {module.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Update Settings</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsAccounts;