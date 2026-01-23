/**
 * Wireframe: task-0.5.1.26-compose-message.md
 * Route: /communications/compose
 * Implements: Compose message page with recipient selection, subject, message content, attachments, and workflow entity linking.
 * Wireframe Link: ../../../../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.26-compose-message.md
 */
'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Search, X, Paperclip, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function ComposePage() {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [entityType, setEntityType] = useState('');
  const [entityId, setEntityId] = useState('');
  const [isSending, setIsSending] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleAddRecipient = (recipient: string) => {
    if (recipient && !recipients.includes(recipient)) {
      setRecipients([...recipients, recipient]);
      setRecipientSearch('');
    }
  };

  const handleRemoveRecipient = (recipient: string) => {
    setRecipients(recipients.filter((r) => r !== recipient));
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || recipients.length === 0) return;

    setIsSending(true);
    try {
      // Create conversation first
      const { data: conversationData, error: createError } = await supabase.rpc('communications_create_conversation', {
        p_subject: subject,
        p_recipient_ids: recipients, // This would need to be actual user IDs
        p_entity_type: entityType || null,
        p_entity_id: entityId || null,
      });

      if (createError) throw createError;

      if (conversationData?.conversation_id) {
        // Send message
        const { error: sendError } = await supabase.rpc('communications_send_message', {
          p_conversation_id: conversationData.conversation_id,
          p_content: message,
        });

        if (sendError) throw sendError;

        // TODO: Upload attachments if any

        router.push(`/communications/inbox/${conversationData.conversation_id}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
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
        <span className="text-text-primary">Compose</span>
      </nav>

      {/* Page Title */}
      <h1 className="mb-8 text-4xl font-bold text-text-primary">Compose New Message</h1>

      {/* Compose Form */}
      <form onSubmit={handleSend} className="space-y-6">
        {/* Recipient Selection */}
        <div className="rounded-lg border border-default bg-white p-6 shadow-sm">
          <label htmlFor="recipients" className="mb-2 block text-sm font-medium text-text-primary">
            To <span className="text-error-500">*</span>
          </label>
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary" />
            <input
              id="recipients"
              type="text"
              value={recipientSearch}
              onChange={(e) => setRecipientSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && recipientSearch.trim()) {
                  e.preventDefault();
                  handleAddRecipient(recipientSearch.trim());
                }
              }}
              placeholder="Search recipients..."
              className="h-10 w-full rounded-md border border-default bg-white pl-10 pr-4 text-base text-text-primary placeholder:text-text-tertiary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
            />
          </div>
          {recipients.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {recipients.map((recipient) => (
                <span
                  key={recipient}
                  className="flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700"
                >
                  {recipient}
                  <button
                    type="button"
                    onClick={() => handleRemoveRecipient(recipient)}
                    className="text-primary-700 hover:text-primary-900"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Subject */}
        <div className="rounded-lg border border-default bg-white p-6 shadow-sm">
          <label htmlFor="subject" className="mb-2 block text-sm font-medium text-text-primary">
            Subject <span className="text-error-500">*</span>
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="Enter subject..."
            className="h-10 w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary placeholder:text-text-tertiary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
          />
        </div>

        {/* Message Content */}
        <div className="rounded-lg border border-default bg-white p-6 shadow-sm">
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-text-primary">
            Message <span className="text-error-500">*</span>
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={10}
            placeholder="Type your message..."
            className="w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary placeholder:text-text-tertiary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
          />
        </div>

        {/* Attachments */}
        <div className="rounded-lg border border-default bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-medium text-text-primary">Attachments</label>
          <input
            type="file"
            id="attachments"
            multiple
            onChange={handleFileAttach}
            className="hidden"
          />
          <label
            htmlFor="attachments"
            className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-default bg-white px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-secondary"
          >
            <Paperclip className="h-4 w-4" />
            Attach Files
          </label>
          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between rounded-md bg-bg-secondary px-3 py-2">
                  <span className="text-sm text-text-secondary">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(index)}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Link to Workflow Entity (Optional) */}
        <div className="rounded-lg border border-default bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-medium text-text-primary">
            Link to Workflow Entity (Optional)
          </label>
          <div className="space-y-4">
            <div>
              <label htmlFor="entity-type" className="mb-2 block text-sm text-text-secondary">
                Entity Type
              </label>
              <select
                id="entity-type"
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className="h-10 w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
              >
                <option value="">Select entity type...</option>
                <option value="submission">Submission</option>
                <option value="breach">Breach</option>
                <option value="export_request">Export Request</option>
                <option value="enforcement_action">Enforcement Action</option>
                <option value="compliance_score">Compliance Score</option>
                <option value="dispute">Dispute</option>
              </select>
            </div>
            {entityType && (
              <div>
                <label htmlFor="entity-id" className="mb-2 block text-sm text-text-secondary">
                  Entity
                </label>
                <input
                  id="entity-id"
                  type="text"
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  placeholder="Search or select..."
                  className="h-10 w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary placeholder:text-text-tertiary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
                />
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/communications/inbox"
            className="rounded-md border border-default bg-white px-6 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSending || !subject.trim() || !message.trim() || recipients.length === 0}
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
                Send
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
