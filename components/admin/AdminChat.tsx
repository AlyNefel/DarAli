"use client";

import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'chat'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, 'chat'), {
        text: newMessage,
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName || auth.currentUser.email,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-12rem)]">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-serif font-bold text-gray-900">Internal Team Chat</h3>
        <p className="text-sm text-gray-500">Coordinate with your colleagues in real-time</p>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isMe = msg.senderId === auth.currentUser?.uid;
            return (
              <div key={msg.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                <div className={cn(
                  "max-w-[70%] p-4 rounded-2xl text-sm shadow-sm",
                  isMe ? "bg-gray-900 text-white rounded-tr-none" : "bg-gray-100 text-gray-900 rounded-tl-none"
                )}>
                  {!isMe && <p className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-50">{msg.senderName}</p>}
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                  {msg.timestamp?.toDate ? format(msg.timestamp.toDate(), 'HH:mm') : '...'}
                </span>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-100 flex gap-3">
        <Input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="rounded-full h-12"
        />
        <Button type="submit" size="icon" className="rounded-full h-12 w-12 bg-gray-900 shrink-0">
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
