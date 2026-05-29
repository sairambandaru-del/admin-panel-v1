"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, Mail, ExternalLink } from 'lucide-react';

const chats = [
  { id: 1, guest: 'Alex Johnson', lastMessage: 'Can I get an extra towel?', time: '2m ago', unread: true, channel: 'WhatsApp' },
  { id: 2, guest: 'Maria Garcia', lastMessage: 'The check-in process was smooth, thanks!', time: '15m ago', unread: false, channel: 'App' },
  { id: 3, guest: 'James Wilson', lastMessage: 'Is there parking available?', time: '1h ago', unread: false, channel: 'SMS' },
  { id: 4, guest: 'Emma Thompson', lastMessage: 'I would like to extend my stay.', time: '3h ago', unread: true, channel: 'WhatsApp' },
];

const Communications = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1 space-y-4">
        <h3 className="font-semibold text-lg">Active Conversations</h3>
        <div className="space-y-2">
          {chats.map((chat) => (
            <Card key={chat.id} className={chat.unread ? "border-primary bg-primary/5" : ""}>
              <CardContent className="p-4 flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{chat.guest[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium truncate">{chat.guest}</p>
                    <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] h-4 px-1">
                      {chat.channel}
                    </Badge>
                    {chat.unread && <div className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        <Card className="h-full flex flex-col items-center justify-center text-center p-12 border-dashed">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Select a conversation</h3>
          <p className="text-muted-foreground max-w-xs mt-2">
            Choose a guest from the list to view the full conversation history and respond.
          </p>
          <div className="flex gap-2 mt-6">
            <Button variant="outline" size="sm"><Phone className="w-4 h-4 mr-2" /> Call Guest</Button>
            <Button variant="outline" size="sm"><Mail className="w-4 h-4 mr-2" /> Email Guest</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Communications;