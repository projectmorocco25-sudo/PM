/**
 * Task 1.1.1.23: Communication Seed Data
 * 
 * Creates sample conversations and messages.
 */

import { log, seedUUID, batchInsert, daysAgo } from './utils'

// ============================================================================
// Communication Definitions
// ============================================================================

interface Conversation {
  id: string
  subject: string
  type: 'direct' | 'group' | 'announcement'
  lifecycle_state: 'ACTIVE' | 'DELIVERED' | 'READ' | 'ARCHIVED'
  related_entity_type: string | null
  related_entity_id: string | null
  created_by: string
  created_at: string
  last_message_at: string
  is_deleted: boolean
}

interface ConversationParticipant {
  conversation_id: string
  user_id: string
  role: 'sender' | 'recipient'
  joined_at: string
}

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'system'
  created_at: string
  delivered_at: string | null
}

// Sample conversations
const CONVERSATIONS: Conversation[] = [
  // Direct message between MOH and company
  {
    id: seedUUID('conv', 1),
    subject: 'AAMS Submission Query - Paracetamol 500mg',
    type: 'direct',
    lifecycle_state: 'READ',
    related_entity_type: 'aams_submission',
    related_entity_id: seedUUID('aams', 1),
    created_by: seedUUID('user', 3),
    created_at: daysAgo(30),
    last_message_at: daysAgo(28),
    is_deleted: false,
  },
  {
    id: seedUUID('conv', 2),
    subject: 'Stock Level Verification Request',
    type: 'direct',
    lifecycle_state: 'ACTIVE',
    related_entity_type: null,
    related_entity_id: null,
    created_by: seedUUID('user', 4),
    created_at: daysAgo(5),
    last_message_at: daysAgo(2),
    is_deleted: false,
  },
  
  // System announcement
  {
    id: seedUUID('conv', 10),
    subject: 'System Maintenance Scheduled - January 15, 2026',
    type: 'announcement',
    lifecycle_state: 'DELIVERED',
    related_entity_type: null,
    related_entity_id: null,
    created_by: seedUUID('user', 1),
    created_at: daysAgo(10),
    last_message_at: daysAgo(10),
    is_deleted: false,
  },
  {
    id: seedUUID('conv', 11),
    subject: 'New WSL Submission Requirements - Effective February 2026',
    type: 'announcement',
    lifecycle_state: 'DELIVERED',
    related_entity_type: null,
    related_entity_id: null,
    created_by: seedUUID('user', 1),
    created_at: daysAgo(7),
    last_message_at: daysAgo(7),
    is_deleted: false,
  },
]

// Conversation participants
const PARTICIPANTS: ConversationParticipant[] = [
  // Conversation 1: MOH officer <-> Company admin
  { conversation_id: seedUUID('conv', 1), user_id: seedUUID('user', 3), role: 'sender', joined_at: daysAgo(30) },
  { conversation_id: seedUUID('conv', 1), user_id: seedUUID('user', 10), role: 'recipient', joined_at: daysAgo(30) },
  
  // Conversation 2: MOH officer <-> Company admin
  { conversation_id: seedUUID('conv', 2), user_id: seedUUID('user', 4), role: 'sender', joined_at: daysAgo(5) },
  { conversation_id: seedUUID('conv', 2), user_id: seedUUID('user', 20), role: 'recipient', joined_at: daysAgo(5) },
  
  // Announcement 10: From Tier 1 to all
  { conversation_id: seedUUID('conv', 10), user_id: seedUUID('user', 1), role: 'sender', joined_at: daysAgo(10) },
  { conversation_id: seedUUID('conv', 10), user_id: seedUUID('user', 10), role: 'recipient', joined_at: daysAgo(10) },
  { conversation_id: seedUUID('conv', 10), user_id: seedUUID('user', 20), role: 'recipient', joined_at: daysAgo(10) },
  { conversation_id: seedUUID('conv', 10), user_id: seedUUID('user', 30), role: 'recipient', joined_at: daysAgo(10) },
  
  // Announcement 11: From Tier 1 to all
  { conversation_id: seedUUID('conv', 11), user_id: seedUUID('user', 1), role: 'sender', joined_at: daysAgo(7) },
  { conversation_id: seedUUID('conv', 11), user_id: seedUUID('user', 10), role: 'recipient', joined_at: daysAgo(7) },
  { conversation_id: seedUUID('conv', 11), user_id: seedUUID('user', 20), role: 'recipient', joined_at: daysAgo(7) },
]

// Messages
const MESSAGES: Message[] = [
  // Conversation 1 messages
  {
    id: seedUUID('msg', 1),
    conversation_id: seedUUID('conv', 1),
    sender_id: seedUUID('user', 3),
    content: 'Dear Pharma Industries team,\n\nWe noticed your AAMS submission for Paracetamol 500mg (20-pack) shows an average of 15,000 units. Could you please verify this figure against your sales records?\n\nThank you.',
    message_type: 'text',
    created_at: daysAgo(30),
    delivered_at: daysAgo(30),
  },
  {
    id: seedUUID('msg', 2),
    conversation_id: seedUUID('conv', 1),
    sender_id: seedUUID('user', 10),
    content: 'Hello,\n\nThank you for your query. I have reviewed our records and can confirm that the figure of 15,000 units per month is correct. This is based on our 2024 sales data.\n\nPlease let me know if you need any supporting documentation.',
    message_type: 'text',
    created_at: daysAgo(29),
    delivered_at: daysAgo(29),
  },
  {
    id: seedUUID('msg', 3),
    conversation_id: seedUUID('conv', 1),
    sender_id: seedUUID('user', 3),
    content: 'Thank you for the confirmation. The submission has been verified and approved.',
    message_type: 'text',
    created_at: daysAgo(28),
    delivered_at: daysAgo(28),
  },
  
  // Conversation 2 messages
  {
    id: seedUUID('msg', 10),
    conversation_id: seedUUID('conv', 2),
    sender_id: seedUUID('user', 4),
    content: 'Dear MedLab team,\n\nWe are conducting a routine verification of stock levels for critical medicines. Please confirm your current stock of Metformin 500mg and 850mg formulations.',
    message_type: 'text',
    created_at: daysAgo(5),
    delivered_at: daysAgo(5),
  },
  {
    id: seedUUID('msg', 11),
    conversation_id: seedUUID('conv', 2),
    sender_id: seedUUID('user', 20),
    content: 'Hello,\n\nCurrent stock levels as of today:\n- Metformin 500mg: 37,200 units\n- Metformin 850mg: 28,500 units\n\nBest regards',
    message_type: 'text',
    created_at: daysAgo(4),
    delivered_at: daysAgo(4),
  },
  {
    id: seedUUID('msg', 12),
    conversation_id: seedUUID('conv', 2),
    sender_id: seedUUID('user', 4),
    content: 'Thank you. Could you also provide the expected delivery schedule for the next month?',
    message_type: 'text',
    created_at: daysAgo(2),
    delivered_at: daysAgo(2),
  },
  
  // Announcement 10 message
  {
    id: seedUUID('msg', 20),
    conversation_id: seedUUID('conv', 10),
    sender_id: seedUUID('user', 1),
    content: '📢 SYSTEM MAINTENANCE NOTICE\n\nThe Pharmaceutical Marketplace platform will undergo scheduled maintenance on January 15, 2026, from 02:00 to 06:00 (Morocco time).\n\nDuring this period, the system will be unavailable. Please plan your submissions accordingly.\n\nThank you for your understanding.',
    message_type: 'text',
    created_at: daysAgo(10),
    delivered_at: daysAgo(10),
  },
  
  // Announcement 11 message
  {
    id: seedUUID('msg', 21),
    conversation_id: seedUUID('conv', 11),
    sender_id: seedUUID('user', 1),
    content: '📋 NEW WSL SUBMISSION REQUIREMENTS\n\nEffective February 1, 2026, the following changes will apply to Weekly Stock Level submissions:\n\n1. All submissions must be completed by Sunday 23:59 (Morocco time)\n2. Critical medicines require daily stock reporting\n3. Variance explanations are required for any stock change exceeding 20%\n\nPlease update your internal processes accordingly. Training materials will be available in the Help section.\n\nFor questions, please contact your designated MOH representative.',
    message_type: 'text',
    created_at: daysAgo(7),
    delivered_at: daysAgo(7),
  },
]

// ============================================================================
// Seed Function
// ============================================================================

export async function seedCommunications(): Promise<void> {
  log(`Preparing communications: ${CONVERSATIONS.length} conversations, ${MESSAGES.length} messages...`)
  
  await batchInsert('conversations', CONVERSATIONS, { onConflict: 'id' })
  await batchInsert('conversation_participants', PARTICIPANTS, { onConflict: 'conversation_id,user_id' })
  await batchInsert('messages', MESSAGES, { onConflict: 'id' })
  
  const directCount = CONVERSATIONS.filter(c => c.type === 'direct').length
  const announcementCount = CONVERSATIONS.filter(c => c.type === 'announcement').length
  
  log(`Communications seeded: ${directCount} direct, ${announcementCount} announcements`, 'success')
}
