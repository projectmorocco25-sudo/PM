/**
 * Wireframe: task-0.5.1.25-conversation-detail.md
 * Route: /communications/inbox/[conversation_id]
 * Implements: Conversation detail page with message thread and reply functionality.
 * Wireframe Link: ../../../../../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.25-conversation-detail.md
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Message {
  id: string;
  content: string;
  sender_name: string;
  sender_role: string;
  created_at: string;
  is_read: boolean;
  attachments?: any[];
}

export default function ConversationDetailPage() {
  const params = useParams();
  const conversationId = params.conversation_id as string;
  const router = useRouter();
  const supabase = createClient();

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: rpcError } = await supabase.rpc('communications_get_conversation', {
          p_conversation_id: conversationId,
        });

        if (rpcError) throw rpcError;

        setConversation(data.conversation);
        setMessages(data.messages || []);
      } catch (err) {
        console.error('Error fetching conversation:', err);
        setError(err instanceof Error ? err.message : 'Failed to load conversation');
      } finally {
        setIsLoading(false);
      }
    };

    if (conversationId) {
      fetchConversation();
    }
  }, [conversationId, supabase]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !conversationId) return;

    setIsSending(true);
    try {
      const { error: sendError } = await supabase.rpc('communications_send_message', {
        p_conversation_id: conversationId,
        p_content: replyContent,
      });

      if (sendError) throw sendError;

      setReplyContent('');
      // Refresh messages
      const { data } = await supabase.rpc('communications_get_conversation', {
        p_conversation_id: conversationId,
      });
      if (data) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center text-text-secondary">Loading conversation...</div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center text-error-500">Error: {error || 'Conversation not found'}</div>
        <Link href="/communications/inbox" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
          Back to Inbox
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-text-secondary">
        <Link href="/dashboard" className="hover:text-text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/communications/inbox" className="hover:text-text-primary transition-colors">
          Inbox
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">Conversation</span>
      </nav>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/communications/inbox"
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{conversation.subject}</h1>
            <p className="text-sm text-text-secondary">
              From: {conversation.from_name} ({conversation.from_role})
            </p>
          </div>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="mb-6 space-y-4 rounded-lg border border-default bg-white p-6 shadow-sm">
        {messages.map((message) => (
          <div key={message.id} className="border-b border-default pb-4 last:border-b-0">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="font-semibold text-text-primary">{message.sender_name}</p>
                <p className="text-sm text-text-secondary">{message.sender_role}</p>
              </div>
              <p className="text-xs text-text-tertiary">
                {formatDistanceToNowStrict(new Date(message.created_at), { addSuffix: true })}
              </p>
            </div>
            <p className="text-base text-text-secondary whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
      </div>

      {/* Reply Form */}
      <form onSubmit={handleSendReply} className="rounded-lg border border-default bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-text-primary">Reply</h2>
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Type your message..."
          rows={6}
          required
          disabled={isSending}
          className={cn(
            'mb-4 w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50'
          )}
        />
        <button
          type="submit"
          disabled={isSending || !replyContent.trim()}
          className={cn(
            'flex items-center gap-2 rounded-md bg-primary-500 px-6 py-2 font-medium text-white transition-colors',
            'hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:bg-gray-400',
            isSending && 'cursor-wait'
          )}
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Reply
            </>
          )}
        </button>
      </form>
    </div>
  );
}
