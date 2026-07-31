"use client";

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Send, 
  FileText, 
  User, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Download, 
  DollarSign, 
  Receipt, 
  ShieldCheck, 
  Sparkles,
  Clock,
  Building
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

export interface ServiceException {
  id: string;
  reason: string;
  details: string;
  originalCost: number;
  proposedCost: number;
  status: 'Pending Guest Approval' | 'Approved' | 'Declined';
  createdAt: string;
}

export interface BookingCommsData {
  id: string;
  guestName: string;
  propertyName: string;
  serviceCategory: string;
  dates: string;
  status: string;
  totalAmount: string;
  pendingException?: ServiceException | null;
  onApproveException?: (bookingId: string, newCost: number) => void;
  onDeclineException?: (bookingId: string) => void;
}

interface GuestCommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingCommsData | null;
}

interface ChatMessage {
  id: string;
  sender: 'Guest' | 'Vendor Staff' | 'System';
  text: string;
  timestamp: string;
}

const GuestCommunicationModal: React.FC<GuestCommunicationModalProps> = ({
  isOpen,
  onClose,
  booking
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'invoice'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'System',
      text: 'Order created and assigned to vendor. Communication channel open.',
      timestamp: '10:30 AM'
    },
    {
      id: 'm2',
      sender: 'Guest',
      text: 'Hello, please ensure delicate items are handled with extra care.',
      timestamp: '10:32 AM'
    },
    {
      id: 'm3',
      sender: 'Vendor Staff',
      text: 'Greetings! Our specialist team is handling your request now.',
      timestamp: '10:35 AM'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  if (!booking) return null;

  // Extract numeric price for invoice calculations
  const rawNumericPrice = parseFloat(booking.totalAmount.replace(/[^0-9.]/g, '')) || 250;
  const baseCost = booking.pendingException ? booking.pendingException.originalCost : (rawNumericPrice * 0.85);
  const exceptionAddon = booking.pendingException && booking.pendingException.status === 'Approved' 
    ? (booking.pendingException.proposedCost - booking.pendingException.originalCost) 
    : 0;
  const serviceFee = 15.00;
  const vatAmount = (baseCost + exceptionAddon + serviceFee) * 0.05;
  const finalCalculatedTotal = baseCost + exceptionAddon + serviceFee + vatAmount;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'Vendor Staff',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setNewMessage('');

    // Simulate Guest Automated Reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `m-reply-${Date.now()}`,
          sender: 'Guest',
          text: 'Thank you for the update! Please let me know once completed.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  const handleQuickAction = (actionText: string) => {
    setNewMessage(actionText);
  };

  const handlePrintInvoice = () => {
    window.print();
    showSuccess("Sending invoice to print...");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
        {/* Modal Header with Customer Quick Info & Clear Right Margin for Close Button */}
        <DialogHeader className="p-4 pr-12 bg-muted/40 border-b shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-base font-bold">Order #{booking.id}</DialogTitle>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                  {booking.serviceCategory}
                </Badge>
                <Badge className="text-[10px] bg-emerald-600 text-white">
                  {booking.status}
                </Badge>
              </div>
              <DialogDescription className="text-xs mt-1 flex items-center gap-3 flex-wrap">
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-primary" /> {booking.guestName}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> {booking.propertyName}
                </span>
              </DialogDescription>
            </div>

            {/* Price Badge - Positioned cleanly away from Close Button */}
            <div className="text-left sm:text-right sm:border-l sm:pl-4 shrink-0">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Total Amount</span>
              <span className="text-base font-extrabold text-primary">AED {finalCalculatedTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full mt-3">
            <TabsList className="grid grid-cols-2 w-full h-9 bg-muted">
              <TabsTrigger value="chat" className="text-xs font-semibold gap-2">
                <MessageSquare className="w-3.5 h-3.5" />
                Live Guest Chat Channel
              </TabsTrigger>
              <TabsTrigger value="invoice" className="text-xs font-semibold gap-2">
                <Receipt className="w-3.5 h-3.5" />
                Customer Invoice & Breakdown
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>

        {/* Tab 1: Live Chat Window */}
        {activeTab === 'chat' && (
          <div className="flex flex-col flex-1 overflow-hidden p-4 space-y-3">
            {/* Pending Exception Alert inside Chat */}
            {booking.pendingException && (
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-xl space-y-2 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-xs text-amber-900">
                      Exception Raised: {booking.pendingException.reason}
                    </span>
                  </div>
                  <Badge className="text-[9px] bg-amber-600 text-white">
                    {booking.pendingException.status}
                  </Badge>
                </div>
                <p className="text-xs text-amber-800">{booking.pendingException.details}</p>
                
                <div className="flex items-center justify-between text-xs pt-1 border-t border-amber-200">
                  <span className="text-amber-900 font-semibold">
                    Original: AED {booking.pendingException.originalCost.toFixed(2)} → Proposed: AED {booking.pendingException.proposedCost.toFixed(2)}
                  </span>
                  
                  {booking.pendingException.status === 'Pending Guest Approval' && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-7 text-[10px] border-rose-300 text-rose-700 hover:bg-rose-50"
                        onClick={() => booking.onDeclineException && booking.onDeclineException(booking.id)}
                      >
                        Decline
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        onClick={() => booking.onApproveException && booking.onApproveException(booking.id, booking.pendingException!.proposedCost)}
                      >
                        Approve New Price
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Scrollable Messages Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[340px] border rounded-lg p-3 bg-muted/20">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${
                    msg.sender === 'Vendor Staff' ? 'items-end' : 
                    msg.sender === 'Guest' ? 'items-start' : 'items-center'
                  }`}
                >
                  {msg.sender === 'System' ? (
                    <div className="my-1.5 px-3 py-1 bg-muted rounded-full text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span>{msg.text}</span>
                    </div>
                  ) : (
                    <div className="max-w-[80%] space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground px-1">
                        <span className="font-bold text-foreground">{msg.sender}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div className={`p-2.5 rounded-2xl text-xs ${
                        msg.sender === 'Vendor Staff' 
                          ? 'bg-primary text-primary-foreground rounded-tr-none' 
                          : 'bg-card border shadow-2xs rounded-tl-none text-foreground'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Response Action Buttons */}
            <div className="flex flex-wrap gap-1.5 shrink-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-6 text-[10px] px-2 text-muted-foreground hover:text-foreground"
                onClick={() => handleQuickAction("Our rider/agent has arrived at your unit location.")}
              >
                "Arrived at unit"
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-6 text-[10px] px-2 text-muted-foreground hover:text-foreground"
                onClick={() => handleQuickAction("Your order has been completed and quality inspected.")}
              >
                "Order Completed"
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-6 text-[10px] px-2 text-muted-foreground hover:text-foreground"
                onClick={() => handleQuickAction("Please confirm your preferred time slot.")}
              >
                "Confirm Time Slot"
              </Button>
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0">
              <Input
                placeholder="Type a message to the guest..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                className="text-xs h-9"
              />
              <Button type="submit" size="sm" className="h-9 px-4 gap-1.5">
                <Send className="w-3.5 h-3.5" /> Send
              </Button>
            </form>
          </div>
        )}

        {/* Tab 2: Itemized Customer Invoice */}
        {activeTab === 'invoice' && (
          <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-4 max-h-[460px]">
            {/* Invoice Header Card */}
            <div className="border rounded-xl p-4 bg-card space-y-4 shadow-2xs">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <h3 className="text-base font-extrabold tracking-tight">TAX INVOICE</h3>
                  <p className="text-xs font-mono text-muted-foreground">INV-{booking.id.replace('VS-', '2024-')}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-600 text-white font-bold text-xs">PAID & VERIFIED</Badge>
                  <p className="text-[10px] text-muted-foreground mt-1">VAT Reg TRN: 100293848100003</p>
                </div>
              </div>

              {/* Customer & Unit Details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-muted/30 p-3 rounded-lg border">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Billed To (Customer)</span>
                  <p className="font-bold text-foreground text-sm">{booking.guestName}</p>
                  <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {booking.propertyName}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Order & Schedule Details</span>
                  <p className="font-semibold text-foreground">Service: {booking.serviceCategory}</p>
                  <p className="text-muted-foreground flex items-center gap-1 mt-0.5 font-mono text-[11px]">
                    <Calendar className="w-3 h-3" /> {booking.dates}
                  </p>
                </div>
              </div>

              {/* Itemized Line Items Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted/60 text-muted-foreground border-b text-[11px]">
                    <tr>
                      <th className="text-left p-2.5 font-bold">Item Description</th>
                      <th className="text-center p-2.5 font-bold">Qty</th>
                      <th className="text-right p-2.5 font-bold">Rate</th>
                      <th className="text-right p-2.5 font-bold">Amount (AED)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-2.5 font-semibold text-foreground">
                        {booking.serviceCategory} Base Service Package
                      </td>
                      <td className="p-2.5 text-center font-mono">1</td>
                      <td className="p-2.5 text-right font-mono">AED {baseCost.toFixed(2)}</td>
                      <td className="p-2.5 text-right font-mono font-bold">AED {baseCost.toFixed(2)}</td>
                    </tr>

                    {booking.pendingException && booking.pendingException.status === 'Approved' && (
                      <tr className="bg-amber-50/50">
                        <td className="p-2.5 font-medium text-amber-900">
                          Add-on Exception: {booking.pendingException.reason}
                        </td>
                        <td className="p-2.5 text-center font-mono">1</td>
                        <td className="p-2.5 text-right font-mono">AED {exceptionAddon.toFixed(2)}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-amber-900">
                          AED {exceptionAddon.toFixed(2)}
                        </td>
                      </tr>
                    )}

                    <tr>
                      <td className="p-2.5 font-medium text-muted-foreground">Standard Service Fee & Handling</td>
                      <td className="p-2.5 text-center font-mono">1</td>
                      <td className="p-2.5 text-right font-mono">AED {serviceFee.toFixed(2)}</td>
                      <td className="p-2.5 text-right font-mono">AED {serviceFee.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals Summary */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal Excl. Tax:</span>
                    <span className="font-mono">AED {(baseCost + exceptionAddon + serviceFee).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>UAE VAT (5%):</span>
                    <span className="font-mono">AED {vatAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-extrabold text-sm text-foreground">
                    <span>Total Amount Billed:</span>
                    <span className="text-primary font-mono">AED {finalCalculatedTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Print & Download Action Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handlePrintInvoice}>
                <Printer className="w-3.5 h-3.5" /> Print Official Invoice
              </Button>
              <Button size="sm" className="gap-1.5 text-xs" onClick={() => showSuccess("Downloading Invoice PDF...")}>
                <Download className="w-3.5 h-3.5" /> Download PDF
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GuestCommunicationModal;