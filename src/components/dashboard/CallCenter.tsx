"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Phone, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneOff, 
  PhoneForwarded, 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  Volume2, 
  Headphones, 
  Sparkles, 
  Radio, 
  User, 
  Users, 
  Clock, 
  Activity, 
  Search, 
  CheckCircle2, 
  ShieldAlert, 
  MessageSquare, 
  Flame, 
  Building2, 
  Check, 
  VolumeX,
  Disc,
  Send,
  Zap,
  Tag
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from "@/lib/utils";

interface ActiveCallSession {
  callId: string;
  callerName: string;
  callerPhone: string;
  unitAssigned?: string;
  accountName?: string;
  direction: 'Inbound' | 'Outbound';
  durationSeconds: number;
  isMuted: boolean;
  isOnHold: boolean;
  isRecording: boolean;
  transcript: Array<{ sender: 'Guest' | 'Agent' | 'AI Assistant'; text: string; time: string }>;
  aiSuggestions: string[];
}

interface QueueCall {
  id: string;
  callerName: string;
  phone: string;
  category: string;
  waitTime: string;
  priority: 'VIP' | 'High' | 'Normal';
  language: string;
}

interface SupervisorAgent {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: 'Available' | 'On Call' | 'After Call Work' | 'Offline';
  currentCustomer?: string;
  callDuration?: string;
  callsHandledToday: number;
  avgHandlingTime: string;
  csatRating: number;
}

interface HistoricalCallLog {
  id: string;
  callerName: string;
  phone: string;
  agentName: string;
  type: 'Inbound' | 'Outbound' | 'Missed';
  category: string;
  duration: string;
  timestamp: string;
  sentiment: 'Positive' | 'Neutral' | 'Escalated';
  recordingUrl?: string;
}

const mockQueue: QueueCall[] = [
  { id: 'Q-101', callerName: 'Alexander Wright', phone: '+971 50 492 8812', category: 'Short Term Rentals (Check-in)', waitTime: '00:42', priority: 'VIP', language: 'English' },
  { id: 'Q-102', callerName: 'Sarah Jenkins', phone: '+971 55 129 3844', category: 'Housekeeping Dispatch', waitTime: '01:15', priority: 'High', language: 'English' },
  { id: 'Q-103', callerName: 'Mohamed Al-Mansoor', phone: '+971 52 884 1029', category: 'Chauffeur Booking', waitTime: '02:08', priority: 'Normal', language: 'Arabic / English' }
];

const mockAgents: SupervisorAgent[] = [
  { id: 'AG-1', name: 'Sarah Jenkins', avatar: 'SJ', role: 'Senior Concierge Agent', status: 'On Call', currentCustomer: 'Alexander Wright (Marina Penthouse)', callDuration: '04:12', callsHandledToday: 24, avgHandlingTime: '3m 45s', csatRating: 4.9 },
  { id: 'AG-2', name: 'Mike Ross', avatar: 'MR', role: 'Support & Escalation', status: 'Available', callsHandledToday: 19, avgHandlingTime: '4m 10s', csatRating: 4.8 },
  { id: 'AG-3', name: 'Elena Rostova', avatar: 'ER', role: 'VIP Corporate Rep', status: 'On Call', currentCustomer: 'Bruce Wayne (Wayne Corp)', callDuration: '02:30', callsHandledToday: 15, avgHandlingTime: '5m 12s', csatRating: 5.0 },
  { id: 'AG-4', name: 'David Miller', avatar: 'DM', role: 'Vendor Dispatch Lead', status: 'After Call Work', callsHandledToday: 28, avgHandlingTime: '2m 55s', csatRating: 4.7 }
];

const mockCallLogs: HistoricalCallLog[] = [
  { id: 'CALL-9021', callerName: 'Kara Finley', phone: '+971 50 882 1928', agentName: 'Sarah Jenkins', type: 'Inbound', category: 'Booking Quotation', duration: '03:45', timestamp: 'Today, 10:14 AM', sentiment: 'Positive' },
  { id: 'CALL-9020', callerName: 'Robert Taylor', phone: '+971 55 901 2211', agentName: 'Mike Ross', type: 'Inbound', category: 'Chef On Call Booking', duration: '05:12', timestamp: 'Today, 09:30 AM', sentiment: 'Positive' },
  { id: 'CALL-9019', callerName: 'Emma Watson', phone: '+971 52 331 9920', agentName: 'Elena Rostova', type: 'Outbound', category: 'Flight Chauffeur Confirm', duration: '02:18', timestamp: 'Yesterday, 04:55 PM', sentiment: 'Neutral' },
  { id: 'CALL-9018', callerName: 'David Miller', phone: '+971 50 112 3344', agentName: 'David Miller', type: 'Inbound', category: 'Maintenance AC Leak', duration: '06:40', timestamp: 'Yesterday, 02:20 PM', sentiment: 'Escalated' }
];

const CallCenter = () => {
  const [activeTab, setActiveTab] = useState<'softphone' | 'queue' | 'supervisor' | 'history'>('softphone');
  
  // Softphone state
  const [dialNumber, setDialNumber] = useState('+971 ');
  const [activeCall, setActiveCall] = useState<ActiveCallSession | null>({
    callId: 'SESSION-8842',
    callerName: 'Alexander Wright',
    callerPhone: '+971 50 492 8812',
    unitAssigned: 'Marina Penthouse Suite 12B',
    accountName: 'TechCorp Solutions Inc.',
    direction: 'Inbound',
    durationSeconds: 142,
    isMuted: false,
    isOnHold: false,
    isRecording: true,
    transcript: [
      { sender: 'AI Assistant', text: 'Call connected. Live AI transcription & smart sentiment assist initiated.', time: '10:30:00' },
      { sender: 'Guest', text: 'Hi, this is Alexander from Marina Penthouse 12B. I wanted to verify if my airport limousine transfer for 8 PM is confirmed?', time: '10:30:15' },
      { sender: 'Agent', text: 'Hello Mr. Wright! Let me pull up your reservation and transport itinerary right away.', time: '10:30:30' },
      { sender: 'Guest', text: 'Also, could we arrange a late checkout around 2 PM tomorrow?', time: '10:31:05' }
    ],
    aiSuggestions: [
      'Confirm Chauffeur: Mercedes S-Class S500 assigned (Driver: Tariq, +971 50 999 1122)',
      'Approve 2 PM Late Check-out for Marina Penthouse 12B (No subsequent guest booking)',
      'Offer In-Suite Luggage Storage & Refresh Service'
    ]
  });

  const [callNotes, setCallNotes] = useState('Guest requested limousine confirmation and 2 PM late checkout.');
  const [agents, setAgents] = useState(mockAgents);
  const [queue, setQueue] = useState(mockQueue);

  // Timer simulation for active call
  useEffect(() => {
    if (!activeCall || activeCall.isOnHold) return;
    const interval = setInterval(() => {
      setActiveCall(prev => prev ? { ...prev, durationSeconds: prev.durationSeconds + 1 } : null);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeCall?.isOnHold, activeCall?.callId]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDialPadPress = (val: string) => {
    setDialNumber(prev => prev + val);
  };

  const handleStartOutboundCall = () => {
    if (dialNumber.length < 5) {
      showError("Please enter a valid phone number.");
      return;
    }
    const newSession: ActiveCallSession = {
      callId: `SESSION-${Math.floor(1000 + Math.random() * 9000)}`,
      callerName: 'Direct Outbound Contact',
      callerPhone: dialNumber,
      unitAssigned: 'Unassigned',
      direction: 'Outbound',
      durationSeconds: 0,
      isMuted: false,
      isOnHold: false,
      isRecording: true,
      transcript: [
        { sender: 'AI Assistant', text: 'Outbound call dialing... Carrier audio channel active.', time: 'Now' }
      ],
      aiSuggestions: [
        'Greet with Straizen concierge greeting',
        'Reference active reservation quotation'
      ]
    };
    setActiveCall(newSession);
    showSuccess(`Dialing ${dialNumber}... Call connected.`);
  };

  const handleEndCall = () => {
    if (!activeCall) return;
    showSuccess(`Call ${activeCall.callId} ended. Wrap-up summary logged to CRM.`);
    setActiveCall(null);
  };

  const handleToggleHold = () => {
    if (!activeCall) return;
    const newHold = !activeCall.isOnHold;
    setActiveCall({ ...activeCall, isOnHold: newHold });
    showSuccess(newHold ? "Call placed on hold (Comfort tone playing)." : "Call resumed.");
  };

  const handleToggleMute = () => {
    if (!activeCall) return;
    const newMute = !activeCall.isMuted;
    setActiveCall({ ...activeCall, isMuted: newMute });
    showSuccess(newMute ? "Microphone muted." : "Microphone unmuted.");
  };

  const handleToggleRecording = () => {
    if (!activeCall) return;
    const newRec = !activeCall.isRecording;
    setActiveCall({ ...activeCall, isRecording: newRec });
    showSuccess(newRec ? "Compliance call recording resumed." : "Call recording paused.");
  };

  const handleAnswerQueueCall = (qItem: QueueCall) => {
    setQueue(prev => prev.filter(q => q.id !== qItem.id));
    setActiveCall({
      callId: `SESSION-${qItem.id}`,
      callerName: qItem.callerName,
      callerPhone: qItem.phone,
      unitAssigned: qItem.category,
      direction: 'Inbound',
      durationSeconds: 0,
      isMuted: false,
      isOnHold: false,
      isRecording: true,
      transcript: [
        { sender: 'AI Assistant', text: `Inbound Call routed from queue. Skill Category: ${qItem.category}`, time: 'Now' }
      ],
      aiSuggestions: [
        `Pull up active reservation for ${qItem.callerName}`,
        'Verify caller security PIN'
      ]
    });
    setActiveTab('softphone');
    showSuccess(`Connected to ${qItem.callerName} (${qItem.phone}).`);
  };

  const handleApplyAISuggestion = (sugg: string) => {
    if (!activeCall) return;
    setActiveCall({
      ...activeCall,
      transcript: [
        ...activeCall.transcript,
        { sender: 'Agent', text: sugg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]
    });
    showSuccess("AI Response spoken to caller and appended to live transcript.");
  };

  const handleSupervisorAction = (agentName: string, action: 'Listen In' | 'Whisper Coaching' | 'Barge In') => {
    showSuccess(`Supervisor ${action} activated for ${agentName}. Audio channel connected.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Metrics Strip */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Live Inbound Queue</CardTitle>
            <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{queue.length} Waiting</div>
            <p className="text-xs text-muted-foreground mt-1">Avg Wait: 00:48s • 100% SLA</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Active Softphone</CardTitle>
            <Headphones className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeCall ? (
                <span className="text-primary font-mono">{formatDuration(activeCall.durationSeconds)}</span>
              ) : (
                <span className="text-muted-foreground text-lg">Ready (Idle)</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">WebRTC Softphone • HD Audio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Agents on Floor</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.filter(a => a.status !== 'Offline').length} Online</div>
            <p className="text-xs text-muted-foreground mt-1">
              {agents.filter(a => a.status === 'Available').length} Available • {agents.filter(a => a.status === 'On Call').length} On Call
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Avg Handling Time (AHT)</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3m 32s</div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">CSAT 4.9/5.0 (98.4%)</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-3">
          <TabsList className="bg-muted">
            <TabsTrigger value="softphone" className="text-xs gap-1.5 font-bold">
              <PhoneCall className="w-3.5 h-3.5" /> Live Softphone & AI Assist
              {activeCall && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />}
            </TabsTrigger>
            <TabsTrigger value="queue" className="text-xs gap-1.5 font-bold">
              <PhoneIncoming className="w-3.5 h-3.5" /> Inbound Queue ({queue.length})
            </TabsTrigger>
            <TabsTrigger value="supervisor" className="text-xs gap-1.5 font-bold">
              <ShieldAlert className="w-3.5 h-3.5" /> Floor Supervision & Barge-in
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs gap-1.5 font-bold">
              <Clock className="w-3.5 h-3.5" /> Call Recordings & History
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              PBX Server: Connected (Dubai Cloud 01)
            </Badge>
          </div>
        </div>

        {/* TAB 1: SOFTPHONE DIALER & ACTIVE CALL CANVAS */}
        <TabsContent value="softphone" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            
            {/* Left Column: Softphone Dialpad / Quick Calling */}
            <Card className="lg:col-span-4 flex flex-col justify-between">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>WebRTC Softphone</span>
                  <Badge variant={activeCall ? 'default' : 'secondary'} className="text-[10px]">
                    {activeCall ? 'In Call' : 'Idle'}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Enter number to initiate outbound HD voice or transfer
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                {/* Number Display Input */}
                <div className="relative">
                  <Input 
                    value={dialNumber}
                    onChange={e => setDialNumber(e.target.value)}
                    className="font-mono text-center text-lg font-bold h-12 tracking-wider"
                    placeholder="+971..."
                  />
                  {dialNumber.length > 5 && (
                    <button 
                      onClick={() => setDialNumber('+971 ')}
                      className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Keypad Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { num: '1', sub: '' },
                    { num: '2', sub: 'ABC' },
                    { num: '3', sub: 'DEF' },
                    { num: '4', sub: 'GHI' },
                    { num: '5', sub: 'JKL' },
                    { num: '6', sub: 'MNO' },
                    { num: '7', sub: 'PQRS' },
                    { num: '8', sub: 'TUV' },
                    { num: '9', sub: 'WXYZ' },
                    { num: '*', sub: '' },
                    { num: '0', sub: '+' },
                    { num: '#', sub: '' },
                  ].map((k) => (
                    <button
                      key={k.num}
                      type="button"
                      onClick={() => handleDialPadPress(k.num)}
                      className="h-12 border rounded-xl hover:bg-muted/70 transition-colors flex flex-col items-center justify-center font-bold text-base focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                    >
                      <span>{k.num}</span>
                      {k.sub && <span className="text-[8px] text-muted-foreground tracking-widest font-normal">{k.sub}</span>}
                    </button>
                  ))}
                </div>

                {/* Action Trigger Call Button */}
                <div className="pt-2">
                  {!activeCall ? (
                    <Button 
                      className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm gap-2 shadow-xs"
                      onClick={handleStartOutboundCall}
                    >
                      <PhoneCall className="w-4 h-4" /> Start Outbound Call
                    </Button>
                  ) : (
                    <Button 
                      variant="destructive"
                      className="w-full h-11 font-bold text-sm gap-2 shadow-xs"
                      onClick={handleEndCall}
                    >
                      <PhoneOff className="w-4 h-4" /> End Active Call
                    </Button>
                  )}
                </div>
              </CardContent>

              {/* Fast Dial Presets */}
              <div className="p-4 border-t bg-muted/20 text-xs space-y-2">
                <span className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground block">Speed Dial & Departments</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <Button variant="outline" size="sm" className="h-7 text-[10px] truncate" onClick={() => setDialNumber('+971 4 200 1100')}>
                    Front Desk Concierge
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-[10px] truncate" onClick={() => setDialNumber('+971 4 300 2200')}>
                    Chauffeur Fleet Hub
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-[10px] truncate" onClick={() => setDialNumber('+971 4 400 3300')}>
                    Housekeeping Dispatch
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-[10px] truncate" onClick={() => setDialNumber('+971 4 500 4400')}>
                    Executive Escalations
                  </Button>
                </div>
              </div>
            </Card>

            {/* Right Column: Live In-Call Workspace & Live Transcription */}
            <Card className="lg:col-span-8 flex flex-col justify-between">
              {activeCall ? (
                <>
                  <CardHeader className="border-b bg-muted/20 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-foreground">{activeCall.callerName}</span>
                          <Badge variant="outline" className="font-mono text-xs text-primary bg-primary/5 border-primary/20">
                            {activeCall.callerPhone}
                          </Badge>
                          <Badge className="bg-emerald-600 text-white font-bold text-xs">
                            {activeCall.direction}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-primary" /> {activeCall.unitAssigned || 'No unit assigned'}
                          {activeCall.accountName && <span>• {activeCall.accountName}</span>}
                        </p>
                      </div>

                      {/* Timer & Recording Status */}
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-2 justify-end">
                          {activeCall.isRecording && (
                            <span className="flex items-center gap-1 text-[10px] text-destructive font-bold animate-pulse">
                              <Disc className="w-3.5 h-3.5 text-destructive" /> REC
                            </span>
                          )}
                          <span className="font-mono text-2xl font-extrabold text-primary">
                            {formatDuration(activeCall.durationSeconds)}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">HD Audio Stream • 64 kbps Opus</p>
                      </div>
                    </div>

                    {/* Active In-Call Controls Strip */}
                    <div className="flex flex-wrap items-center gap-2 pt-4 border-t mt-4">
                      <Button 
                        variant={activeCall.isMuted ? 'destructive' : 'outline'}
                        size="sm"
                        className="h-8 gap-1.5 text-xs font-semibold"
                        onClick={handleToggleMute}
                      >
                        {activeCall.isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        {activeCall.isMuted ? 'Unmute' : 'Mute'}
                      </Button>

                      <Button 
                        variant={activeCall.isOnHold ? 'secondary' : 'outline'}
                        size="sm"
                        className="h-8 gap-1.5 text-xs font-semibold"
                        onClick={handleToggleHold}
                      >
                        <Pause className="w-3.5 h-3.5" />
                        {activeCall.isOnHold ? 'Resume Call' : 'Hold Call'}
                      </Button>

                      <Button 
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 text-xs font-semibold"
                        onClick={() => showSuccess("Transfer dialog opened: select agent or department")}
                      >
                        <PhoneForwarded className="w-3.5 h-3.5" />
                        Warm Transfer
                      </Button>

                      <Button 
                        variant={activeCall.isRecording ? 'outline' : 'secondary'}
                        size="sm"
                        className="h-8 gap-1.5 text-xs font-semibold"
                        onClick={handleToggleRecording}
                      >
                        <Disc className="w-3.5 h-3.5 text-destructive" />
                        {activeCall.isRecording ? 'Pause REC' : 'Resume REC'}
                      </Button>

                      <Button 
                        variant="destructive"
                        size="sm"
                        className="h-8 gap-1.5 text-xs font-bold ml-auto"
                        onClick={handleEndCall}
                      >
                        <PhoneOff className="w-3.5 h-3.5" /> Hang Up
                      </Button>
                    </div>
                  </CardHeader>

                  {/* Main In-Call Body: Live Transcription & AI Assist */}
                  <CardContent className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[380px]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Radio className="w-3.5 h-3.5 text-primary animate-pulse" /> Live Speech Transcription
                        </span>
                        <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                          AI Model: Whisper V3 Live
                        </Badge>
                      </div>

                      <div className="border rounded-xl p-3 bg-muted/20 space-y-2.5 max-h-[220px] overflow-y-auto font-sans text-xs">
                        {activeCall.transcript.map((item, idx) => (
                          <div 
                            key={idx} 
                            className={cn(
                              "p-2 rounded-lg text-xs",
                              item.sender === 'AI Assistant' ? "bg-primary/10 text-primary border border-primary/20 text-[11px]" :
                              item.sender === 'Agent' ? "bg-card border shadow-2xs ml-6" :
                              "bg-muted/80 border mr-6 font-medium"
                            )}
                          >
                            <div className="flex justify-between items-center text-[10px] text-muted-foreground mb-0.5 font-mono">
                              <span className="font-bold text-foreground">{item.sender}</span>
                              <span>{item.time}</span>
                            </div>
                            <p>{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Agent Smart Recommendations */}
                    <div className="space-y-2 border-2 border-primary/20 bg-primary/5 p-3.5 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-primary flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-primary" /> AI Agent Live Suggestions & Resolution Prompts
                        </span>
                        <span className="text-[10px] text-muted-foreground">Click to append to spoken reply</span>
                      </div>

                      <div className="space-y-1.5">
                        {activeCall.aiSuggestions.map((sugg, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleApplyAISuggestion(sugg)}
                            className="w-full text-left p-2 rounded-lg bg-card hover:bg-primary hover:text-primary-foreground transition-all border text-xs flex items-center justify-between group shadow-2xs"
                          >
                            <span className="truncate pr-2">{sugg}</span>
                            <Send className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  {/* Wrap-up Notes Footer */}
                  <div className="p-4 border-t bg-muted/10 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-muted-foreground uppercase text-[10px]">Call Disposition & CRM Wrap-up Notes</span>
                      <Button size="sm" variant="ghost" className="h-6 text-xs text-primary" onClick={() => showSuccess("Call notes auto-saved to CRM timeline.")}>
                        Save Notes
                      </Button>
                    </div>
                    <Textarea 
                      value={callNotes}
                      onChange={e => setCallNotes(e.target.value)}
                      placeholder="Enter wrap up summary..."
                      className="min-h-[50px] text-xs bg-background"
                    />
                  </div>
                </>
              ) : (
                /* Empty Idle State */
                <div className="h-[520px] flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Headphones className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-base text-foreground">Softphone Ready & Connected</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-6">
                    Enter a phone number using the dialpad on the left or answer an incoming call from the queue tab.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('queue')}
                    className="gap-2 bg-primary text-primary-foreground font-semibold text-xs"
                  >
                    <PhoneIncoming className="w-4 h-4" /> View Inbound Queue ({queue.length})
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: INBOUND CALL QUEUE */}
        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base">Real-time Inbound Call Queue</CardTitle>
                  <CardDescription className="text-xs">
                    Calls currently waiting in ACD (Automatic Call Distribution) queues.
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => showSuccess("Queue refreshed.")}>
                  <Radio className="w-3.5 h-3.5 text-emerald-500" /> Refresh Queue
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Queue ID</TableHead>
                    <TableHead>Caller Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Service / Skill Category</TableHead>
                    <TableHead>Wait Time</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queue.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-xs">
                        No callers waiting in queue. All queues clear.
                      </TableCell>
                    </TableRow>
                  ) : (
                    queue.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-xs font-bold">{item.id}</TableCell>
                        <TableCell className="font-bold text-xs">{item.callerName}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{item.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono font-bold text-xs text-amber-600">
                          {item.waitTime}
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.priority === 'VIP' ? 'default' : item.priority === 'High' ? 'destructive' : 'secondary'} className="text-[10px]">
                            {item.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{item.language}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm"
                            className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                            onClick={() => handleAnswerQueueCall(item)}
                          >
                            <PhoneCall className="w-3.5 h-3.5" /> Answer Call
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: SUPERVISOR FLOOR & MONITORING */}
        <TabsContent value="supervisor" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base">Supervisor Floor Matrix & Agent Live Coaching</CardTitle>
                  <CardDescription className="text-xs">
                    Monitor live agent statuses, listen into ongoing calls, whisper private coaching, or barge in.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Agent</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Live Customer & Duration</TableHead>
                    <TableHead>Calls Today</TableHead>
                    <TableHead>AHT</TableHead>
                    <TableHead>CSAT</TableHead>
                    <TableHead className="text-right">Supervisor Controls</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8 border">
                            <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">
                              {agent.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-xs text-foreground">{agent.name}</p>
                            <span className="font-mono text-[10px] text-muted-foreground">{agent.id}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{agent.role}</TableCell>
                      <TableCell>
                        <Badge variant={
                          agent.status === 'Available' ? 'default' :
                          agent.status === 'On Call' ? 'destructive' : 'secondary'
                        } className="text-[10px]">
                          {agent.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {agent.currentCustomer ? (
                          <div>
                            <p className="font-semibold text-xs text-foreground">{agent.currentCustomer}</p>
                            <span className="text-[10px] font-mono text-primary font-bold">{agent.callDuration}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Idle / Available</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-xs">{agent.callsHandledToday}</TableCell>
                      <TableCell className="font-mono text-xs">{agent.avgHandlingTime}</TableCell>
                      <TableCell className="font-bold text-xs text-emerald-600">★ {agent.csatRating}</TableCell>
                      <TableCell className="text-right">
                        {agent.status === 'On Call' ? (
                          <div className="flex justify-end gap-1.5">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-[10px] gap-1 px-2"
                              onClick={() => handleSupervisorAction(agent.name, 'Listen In')}
                            >
                              <Headphones className="w-3 h-3" /> Listen
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-[10px] gap-1 px-2 text-primary"
                              onClick={() => handleSupervisorAction(agent.name, 'Whisper Coaching')}
                            >
                              <Mic className="w-3 h-3" /> Whisper
                            </Button>
                            <Button 
                              size="sm" 
                              className="h-7 text-[10px] gap-1 px-2 bg-destructive hover:bg-destructive/90 text-white font-bold"
                              onClick={() => handleSupervisorAction(agent.name, 'Barge In')}
                            >
                              <ShieldAlert className="w-3 h-3" /> Barge In
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No Active Stream</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: CALL RECORDINGS & HISTORICAL LOGS */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-base">Call Recordings & Historical Analytics</CardTitle>
                  <CardDescription className="text-xs">
                    Search previous calls, listen to audio playbacks, review sentiment, and verify compliance.
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search caller, agent, ID..." className="pl-8 h-9 text-xs" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Call ID</TableHead>
                    <TableHead>Caller</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Date / Time</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead className="text-right">Playback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCallLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-xs font-bold">{log.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-xs text-foreground">{log.callerName}</p>
                          <span className="font-mono text-[10px] text-muted-foreground">{log.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium">{log.agentName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {log.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{log.category}</TableCell>
                      <TableCell className="font-mono font-bold text-xs">{log.duration}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{log.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant={log.sentiment === 'Positive' ? 'default' : log.sentiment === 'Escalated' ? 'destructive' : 'secondary'} className="text-[10px]">
                          {log.sentiment}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => showSuccess(`Playing recording audio for ${log.id}...`)}
                        >
                          <Play className="w-3.5 h-3.5" /> Play Recording
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CallCenter;