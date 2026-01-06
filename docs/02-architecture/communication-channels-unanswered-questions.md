# Communication Channels - Questions & Answers

**Purpose:** This document lists all unanswered questions from the Communication Channels Requirements document, with recommended answers from specialists based on existing architecture patterns and best practices.

**Last Updated:** 2025-01-01  
**Status:** ✅ Approved - All Recommended Answers Accepted  
**Owner:** TBD (All recommended answers have been accepted)

---

## 1. Governance Requirements (Fatima - MOH Governance & Regulation SME)

### Question 1.1: Are there specific MOH regulations for communication retention?

**Recommended Answer (Based on Existing Patterns):**
- **7-year retention requirement** (consistent with existing audit log and historical data retention)
- All communications must be retained for regulatory compliance
- Communications are part of the audit trail and subject to the same retention policies as other regulatory records
- Exportable communication history for regulatory audits

**Rationale:**
- Aligns with existing 7-year data retention requirement documented in Phase 0
- Consistent with audit log retention policies
- Regulatory compliance standard for pharmaceutical governance

**Action Required:** Fatima to confirm 7-year retention is sufficient or specify different requirement.

---

### Question 1.2: What escalation protocols are required?

**Recommended Answer (Based on Workflow Architecture):**
- **Tier 2 → Tier 1 escalation:** Tier 2 Officers can escalate issues to Tier 1 via messaging
- **Company → MOH escalation:** Companies can escalate urgent matters to MOH Tier 1
- **Escalation indicators:** Priority flags, urgency levels, escalation timestamps
- **Escalation workflow:** Automatic notifications to Tier 1 when escalated
- **Response time expectations:** Define SLA for escalation responses (e.g., 24 hours for urgent)

**Rationale:**
- Aligns with existing Tier 2 → Tier 1 workflow patterns
- Supports regulatory governance structure
- Enables proper escalation chain

**Action Required:** Fatima to define:
- Escalation criteria (when can companies escalate?)
- Response time SLAs
- Escalation priority levels
- Required escalation documentation

---

### Question 1.3: Are there approval workflows for certain types of communications?

**Recommended Answer (Based on Workflow Architecture):**
- **System announcements:** Require Tier 1 approval before broadcast
- **Workflow-related communications:** Linked to existing approval workflows (no separate approval needed)
- **Direct messages:** No approval required (real-time communication)
- **Internal MOH communications:** No approval required (internal coordination)

**Rationale:**
- System announcements are regulatory communications and should be approved
- Workflow communications are already part of approval chains
- Direct messages need to be real-time for efficiency

**Action Required:** Fatima to confirm:
- Which communication types require approval
- Approval workflow for system announcements
- Any restrictions on direct messaging

---

## 2. Security Requirements (Salim - Security & Audit Engineer)

### Question 2.1: Are there additional encryption requirements?

**Recommended Answer (Based on Security Architecture):**
- **At rest:** Database encryption via Supabase (already implemented)
- **In transit:** TLS/HTTPS (already implemented)
- **File attachments:** Encrypted in Supabase Storage (already implemented)
- **Message content:** No additional encryption required beyond standard Supabase encryption
- **End-to-end encryption:** Not required (MOH needs access for regulatory compliance)

**Rationale:**
- Aligns with existing security architecture
- Supabase provides encryption at rest and in transit
- MOH regulatory access requirements preclude end-to-end encryption

**Action Required:** Salim to confirm:
- If additional encryption layers are needed
- If message content needs special encryption beyond database encryption
- If there are specific encryption standards for pharmaceutical data

---

### Question 2.2: What are the rate limiting requirements?

**Recommended Answer (Based on API Security Patterns):**
- **Message sending:** 50 messages per hour per user (prevents spam)
- **File uploads:** 10 attachments per message, 5MB max per file
- **API rate limiting:** 100 requests per minute per user (standard API rate limit)
- **Announcement creation:** 5 announcements per day per Tier 1 user (prevents abuse)

**Rationale:**
- Prevents spam and abuse
- Protects system resources
- Allows normal usage patterns
- Aligns with standard rate limiting practices

**Action Required:** Salim to define:
- Specific rate limits for each operation
- Rate limit error handling
- Rate limit reset policies
- Rate limit notifications to users

---

### Question 2.3: Are there specific audit log requirements?

**Recommended Answer (Based on Audit Logging Specification):**
- **All message actions logged:** Send, read, edit, archive, delete (soft delete)
- **Audit log format:** Consistent with existing `audit_logs` table structure
- **Operation types:** `message_sent`, `message_read`, `message_edited`, `message_archived`, `attachment_uploaded`, `conversation_created`
- **Hash chaining:** Messages included in audit log hash chain for immutability
- **7-year retention:** Same as other audit logs

**Rationale:**
- Aligns with existing audit logging specification
- Ensures regulatory compliance
- Maintains audit trail integrity

**Action Required:** Salim to confirm:
- If additional audit log fields are needed
- If message content should be in audit logs (privacy vs. compliance)
- If there are specific audit log requirements for communications

---

## 3. UI/UX Requirements (Emma - UI/UX + Next.js Frontend Specialist)

### Question 3.1: What are the wireframe requirements?

**Recommended Answer (Based on Phase 0.5 Wireframes):**
- **Wireframes already added to Phase 0.5 Priority 1:**
  - Task 0.5.1.24: Communications inbox list page
  - Task 0.5.1.25: Conversation detail page
  - Task 0.5.1.26: Compose message interface
  - Task 0.5.1.27: Sent messages page
  - Task 0.5.1.28: System announcements interface (MOH Tier 1 only)
  - Task 0.5.1.29: Communication integration in workflow pages

**Wireframe Requirements:**
- Low-fidelity wireframes focusing on layout, hierarchy, and flow
- Component-based design referencing existing UI component specifications
- Role-aware wireframes (Company, MOH Tier 1, Tier 2)
- Responsive considerations (desktop, tablet)
- Workflow-focused (emphasize user flows and state transitions)

**Rationale:**
- Wireframes already planned in Phase 0.5
- Follows existing wireframe principles
- Aligns with component specifications

**Action Required:** Emma to:
- Create wireframes per Phase 0.5 tasks
- Validate wireframe approach with stakeholders
- Document wireframe annotations

---

### Question 3.2: What are the responsive design requirements?

**Recommended Answer (Based on Navigation & Layout Patterns):**
- **Desktop (>1024px):** Full sidebar, multi-column layouts, full feature set
- **Tablet (768px - 1024px):** Collapsible sidebar, single column layouts, touch-optimized
- **Mobile (<768px):** Not officially supported, but responsive design should work (hamburger menu, stacked layouts)

**Communication-Specific Responsive Requirements:**
- **Inbox:** List view on desktop, card view on tablet
- **Conversation detail:** Side-by-side on desktop, stacked on tablet
- **Compose:** Full-width form on desktop, optimized for tablet
- **Message thread:** Scrollable thread, fixed compose area

**Rationale:**
- Aligns with existing responsive design patterns
- Consistent with platform breakpoints
- Optimized for primary use cases (desktop, tablet)

**Action Required:** Emma to:
- Define specific responsive breakpoints for communication interfaces
- Create responsive wireframes
- Test responsive behavior

---

### Question 3.3: What are the accessibility requirements?

**Recommended Answer (Based on UI Component Specifications):**
- **WCAG 2.1 AA compliance:** Standard accessibility requirements
- **Keyboard navigation:** Full keyboard support for all communication interfaces
- **Screen reader support:** ARIA labels, semantic HTML, proper heading hierarchy
- **Focus management:** Clear focus indicators, logical tab order
- **Color contrast:** Meet WCAG AA contrast ratios
- **Alternative text:** For message attachments and icons

**Communication-Specific Accessibility:**
- **Message content:** Readable by screen readers
- **Unread indicators:** Both visual and text-based indicators
- **Attachment indicators:** Clear labels for file types and sizes
- **Compose interface:** Accessible form controls with error messages

**Rationale:**
- Aligns with existing accessibility standards
- Ensures inclusive design
- Meets regulatory accessibility requirements

**Action Required:** Emma to:
- Define specific accessibility requirements for communication interfaces
- Create accessibility testing checklist
- Validate with accessibility tools

---

## 4. Architecture Requirements (Oliver - Chief Architect)

### Question 4.1: Are there performance requirements?

**Recommended Answer (Based on System Architecture):**
- **Message loading:** < 2 seconds for inbox list (100 conversations)
- **Conversation loading:** < 1 second for conversation detail (50 messages)
- **Real-time updates:** < 500ms latency for new message notifications
- **Search performance:** < 3 seconds for full-text search across 10,000 messages
- **Pagination:** 50 messages per page, infinite scroll support

**Performance Optimizations:**
- Database indexes on frequently queried columns
- Caching for frequently accessed conversations
- Lazy loading for message threads
- Virtual scrolling for long conversation lists

**Rationale:**
- Aligns with existing performance patterns
- Ensures good user experience
- Scalable for future growth

**Action Required:** Oliver to:
- Define specific performance SLAs
- Validate performance requirements with load testing
- Document performance optimization strategies

---

### Question 4.2: Are there scalability requirements?

**Recommended Answer (Based on System Architecture):**
- **Message volume:** Support 10,000 messages per day per company
- **Concurrent users:** Support 500 concurrent users
- **Storage:** Support 1TB total message storage (7-year retention)
- **Database:** PostgreSQL (Supabase) handles scaling automatically
- **File storage:** Supabase Storage scales automatically

**Scalability Considerations:**
- Database partitioning by date (for 7-year retention)
- Archive old conversations (after 7 years, move to cold storage)
- Message pagination and lazy loading
- Real-time updates via Supabase Realtime (scales automatically)

**Rationale:**
- Aligns with existing scalability patterns
- Leverages Supabase auto-scaling
- Supports regulatory retention requirements

**Action Required:** Oliver to:
- Define specific scalability targets
- Plan for future growth
- Document scalability architecture

---

### Question 4.3: Are there integration requirements with external systems?

**Recommended Answer (Based on Integration Architecture):**
- **Email notifications:** Edge Function integration with email service (SendGrid, AWS SES, etc.)
- **No external messaging systems:** All communications within platform (regulatory requirement)
- **Workflow integration:** Direct database integration (already implemented)
- **Notification system:** Integration with existing `notifications` table

**Integration Points:**
- **Email service:** Edge Function reads from `notifications` table, sends emails
- **Real-time updates:** Supabase Realtime for live message updates
- **Workflow entities:** Foreign key relationships to submissions, approvals, breaches

**Rationale:**
- Aligns with existing integration patterns
- Maintains regulatory compliance (all communications in-platform)
- Leverages existing notification infrastructure

**Action Required:** Oliver to:
- Define email service integration requirements
- Specify email template requirements
- Document integration architecture

---

## Summary of Recommended Answers

### Governance (Fatima)
1. **Retention:** 7-year retention (consistent with existing requirements)
2. **Escalation:** Tier 2 → Tier 1, Company → MOH, with priority levels
3. **Approval:** System announcements require Tier 1 approval

### Security (Salim)
1. **Encryption:** Standard Supabase encryption (at rest, in transit)
2. **Rate Limiting:** 50 messages/hour, 10 attachments/message, 5MB max
3. **Audit Logs:** All actions logged, hash-chained, 7-year retention

### UI/UX (Emma)
1. **Wireframes:** Already added to Phase 0.5 Priority 1
2. **Responsive:** Desktop/tablet optimized, mobile not officially supported
3. **Accessibility:** WCAG 2.1 AA compliance, keyboard navigation, screen reader support

### Architecture (Oliver)
1. **Performance:** < 2s inbox load, < 1s conversation load, < 500ms real-time updates
2. **Scalability:** 10,000 messages/day/company, 500 concurrent users, 1TB storage
3. **Integration:** Email service via Edge Function, no external messaging systems

---

## Next Steps

1. ✅ **Stakeholder Review:** All recommended answers accepted
2. ✅ **Update Requirements:** Communication Channels Requirements document updated with approved answers
3. ✅ **Database Schema:** Communication tables added to schema design
4. ✅ **Routing Structure:** Communication routes added to routing structure
5. ✅ **Navigation:** Communication navigation added to navigation patterns
6. ✅ **Wireframes:** Communication wireframes added to Phase 0.5 Priority 1
7. ⚪ **Implementation Planning:** Create Phase 1.1 implementation tasks based on approved requirements
8. ⚪ **Wireframe Creation:** Begin creating wireframes per Phase 0.5 tasks

---

**Status:** ✅ Approved - All Recommended Answers Accepted  
**Last Updated:** 2025-01-01

