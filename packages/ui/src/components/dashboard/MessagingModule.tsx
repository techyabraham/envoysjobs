"use client";

import React, { useState } from 'react';
import { Send, Paperclip, Search, MoreVertical, CheckCheck } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { EmptyState } from '../LoadingState';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  avatar: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'me' | 'other';
  time: string;
  read: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Sarah Adeyemi',
    lastMessage: 'That sounds great! When can we start?',
    time: '5m',
    unread: true,
    avatar: 'S'
  },
  {
    id: '2',
    name: 'Emmanuel Okafor',
    lastMessage: 'Thank you for your interest in the position.',
    time: '2h',
    unread: true,
    avatar: 'E'
  },
  {
    id: '3',
    name: 'Grace Nwosu',
    lastMessage: 'Looking forward to working with you!',
    time: '1d',
    unread: false,
    avatar: 'G'
  },
  {
    id: '4',
    name: 'David Eze',
    lastMessage: 'I honour you! Can we discuss the project details?',
    time: '2d',
    unread: false,
    avatar: 'D'
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hi! I saw your web development service and I\'m interested.',
    sender: 'other',
    time: '10:30 AM',
    read: true
  },
  {
    id: '2',
    content: 'I honour you! Thank you for reaching out. I\'d be happy to help with your project.',
    sender: 'me',
    time: '10:35 AM',
    read: true
  },
  {
    id: '3',
    content: 'Great! I need a website for my new business. Can you provide an estimate?',
    sender: 'other',
    time: '10:40 AM',
    read: true
  },
  {
    id: '4',
    content: 'Absolutely! Could you share more details about what you need? Number of pages, specific features, etc.?',
    sender: 'me',
    time: '10:45 AM',
    read: true
  },
  {
    id: '5',
    content: 'I need about 5 pages with a contact form and gallery. Also mobile responsive.',
    sender: 'other',
    time: '10:50 AM',
    read: true
  },
  {
    id: '6',
    content: 'Perfect! For that scope, I can provide a quote of â‚¦150,000. Timeline would be about 2 weeks.',
    sender: 'me',
    time: '11:00 AM',
    read: true
  },
  {
    id: '7',
    content: 'That sounds great! When can we start?',
    sender: 'other',
    time: '11:05 AM',
    read: true
  }
];

export function MessagingModule() {
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConversationList, setShowConversationList] = useState(true);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const selectedConv = mockConversations.find(c => c.id === selectedConversation);

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-0rem)] flex">
      {/* Conversations List */}
      <div className={`${showConversationList ? 'flex' : 'hidden lg:flex'} lg:w-80 xl:w-96 flex-col border-r border-border bg-white shrink-0`}>
        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground-tertiary" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background-secondary rounded-lg border border-transparent focus:border-deep-blue focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => {
                setSelectedConversation(conversation.id);
                setShowConversationList(false);
              }}
              className={`w-full flex items-start gap-3 p-4 hover:bg-background-secondary transition-colors ${
                selectedConversation === conversation.id ? 'bg-background-secondary' : ''
              } ${conversation.unread ? 'bg-emerald-green/5' : ''}`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-deep-blue to-emerald-green flex items-center justify-center text-white font-medium shrink-0">
                {conversation.avatar}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-medium ${conversation.unread ? 'text-foreground' : 'text-foreground-secondary'}`}>
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-foreground-tertiary shrink-0">
                    {conversation.time}
                  </span>
                </div>
                <p className={`text-sm truncate ${conversation.unread ? 'text-foreground font-medium' : 'text-foreground-tertiary'}`}>
                  {conversation.lastMessage}
                </p>
              </div>
              {conversation.unread && (
                <div className="w-2 h-2 rounded-full bg-emerald-green shrink-0 mt-2" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className={`${showConversationList ? 'hidden lg:flex' : 'flex'} flex-1 flex-col bg-background-secondary`}>
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="lg:hidden"
                  onClick={() => setShowConversationList(true)}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deep-blue to-emerald-green flex items-center justify-center text-white font-medium">
                  {selectedConv.avatar}
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{selectedConv.name}</h2>
                  <p className="text-xs text-foreground-tertiary">Active now</p>
                </div>
              </div>
              <button className="p-2 hover:bg-background-secondary rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-foreground-secondary" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md lg:max-w-lg ${message.sender === 'me' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.sender === 'me'
                          ? 'bg-deep-blue text-white rounded-br-sm'
                          : 'bg-white text-foreground rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-1 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-foreground-tertiary">{message.time}</span>
                      {message.sender === 'me' && message.read && (
                        <CheckCheck className="w-3 h-3 text-emerald-green" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-border p-4">
              <div className="flex items-end gap-2">
                <button className="p-2 hover:bg-background-secondary rounded-lg transition-colors shrink-0">
                  <Paperclip className="w-5 h-5 text-foreground-secondary" />
                </button>
                <div className="flex-1 bg-background-secondary rounded-lg border border-transparent focus-within:border-deep-blue transition-colors">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full px-4 py-3 bg-transparent border-none outline-none resize-none"
                  />
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-foreground-tertiary mt-2 text-center">
                Messages are monitored to ensure a respectful community
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <EmptyState
              title="No conversation selected"
              description="Select a conversation to start messaging"
              icon={
                <div className="w-20 h-20 rounded-full bg-background-secondary flex items-center justify-center">
                  <Send className="w-10 h-10 text-foreground-tertiary" />
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}


