/**
 * Wireframe: task-0.5.1.27-sent-messages.md
 * Route: /communications/sent
 * Implements: Sent messages page with list of sent messages, status indicators, and filters.
 * Wireframe Link: ../../../../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.27-sent-messages.md
 */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { Search, Filter, Check, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SentMessage {
  id: string;
  conversation_id: string;
  subject: string;
  recipient_name: string;
  recipient_role: string;
  preview: string;
  status: 'sent' | 'delivered' | 'read';
  created_at: string;
  delivered_at?: string;
  read_at?: string;
}

export default function SentMessagesPage() {
  const [messages, setMessages] = useState<SentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchSentMessages = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: rpcError } = await supabase.rpc('communications_list_sent', {
          p_limit: 50,
          p_offset: 0,
        });

        if (rpcError) throw rpcError;

        setMessages(data || []);
      } catch (err) {
        console.error('Error fetching sent messages:', err);
        setError(err instanceof Error ? err.message : 'Failed to load sent messages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSentMessages();
  }, [supabase]);

  const filteredMessages = messages.filter((msg) => {
    if (searchQuery && !msg.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read':
        return <CheckCheck className="h-4 w-4 text-success-500" />;
      case 'delivered':
        return <CheckCheck className="h-4 w-4 text-primary-500" />;
      case 'sent':
        return <Check className="h-4 w-4 text-text-tertiary" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'read':
        return 'Read';
      case 'delivered':
        return 'Delivered';
      case 'sent':
        return 'Sent';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-text-secondary">
        <Link href="/dashboard" className="hover:text-text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/communications/inbox" className="hover:text-text-primary transition-colors">
          Communications
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">Sent Messages</span>
      </nav>

      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-text-primary">Sent Messages</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-64 rounded-md border border-default bg-white pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
            />
          </div>
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors" title="Filters">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Sent Messages List */}
      {isLoading ? (
        <div className="text-center text-text-secondary">Loading sent messages...</div>
      ) : error ? (
        <div className="text-center text-error-500">Error: {error}</div>
      ) : filteredMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-default bg-white p-12 text-center">
          <p className="mb-2 text-lg font-semibold text-text-primary">No sent messages</p>
          <p className="mb-6 text-text-secondary">You haven&apos;t sent any messages yet.</p>
          <Link
            href="/communications/compose"
            className="rounded-md bg-primary-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-600"
          >
            Compose Message
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-default bg-white shadow-sm">
          {filteredMessages.map((message) => (
            <Link
              key={message.id}
              href={`/communications/inbox/${message.conversation_id}`}
              className="flex items-center gap-4 border-b border-default p-4 transition-colors hover:bg-bg-secondary last:border-b-0"
            >
              <div className="flex-grow">
                <div className="mb-1 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">
                      To: {message.recipient_name} ({message.recipient_role})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(message.status)}
                    <span className="text-xs text-text-tertiary">{getStatusText(message.status)}</span>
                    <span className="text-xs text-text-tertiary">
                      {formatDistanceToNowStrict(new Date(message.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <h3 className="mb-1 text-base font-semibold text-text-primary">{message.subject}</h3>
                <p className="line-clamp-2 text-sm text-text-secondary">{message.preview}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
