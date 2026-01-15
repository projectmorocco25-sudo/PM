# Storage Buckets Configuration - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines all Supabase Storage buckets and their configurations.

**Last Updated:** 2025-01-12  
**Status:** ✅ Complete (Phase 1.1.1, Task 1.1.1.1)  
**Owner:** Nadia

## Overview

This document specifies all storage buckets used in the PM platform, including their purposes, access policies, and file size limits.

## Storage Buckets

### 1. avatars

**Purpose:** User profile avatar images

**Configuration:**
- **Public:** Yes (read-only for public, write for authenticated users)
- **File Size Limit:** 5 MB
- **Allowed MIME Types:** image/jpeg, image/png, image/webp
- **Path Pattern:** `avatars/{user_id}/{filename}`

**RLS Policies:**
- **SELECT:** Public read access
- **INSERT:** Authenticated users can upload their own avatar
- **UPDATE:** Users can update their own avatar
- **DELETE:** Users can delete their own avatar

**Example:**
```
avatars/550e8400-e29b-41d4-a716-446655440000/profile.jpg
```

---

### 2. export-documents

**Purpose:** Export request documentation (export certificates, shipping documents)

**Configuration:**
- **Public:** No (private bucket)
- **File Size Limit:** 10 MB per file
- **Allowed MIME Types:** application/pdf, image/jpeg, image/png
- **Path Pattern:** `export-documents/{export_request_id}/{filename}`

**RLS Policies:**
- **SELECT:** Company users see their own documents, MOH sees all
- **INSERT:** Company users can upload for their export requests
- **UPDATE:** Company users can update their own documents
- **DELETE:** Company users can delete their own documents, MOH can delete any

**Example:**
```
export-documents/550e8400-e29b-41d4-a716-446655440000/export-certificate.pdf
```

---

### 3. replenishment-proofs

**Purpose:** Replenishment proof documents (delivery receipts, invoices)

**Configuration:**
- **Public:** No (private bucket)
- **File Size Limit:** 10 MB per file
- **Allowed MIME Types:** application/pdf, image/jpeg, image/png
- **Path Pattern:** `replenishment-proofs/{replenishment_schedule_id}/{filename}`

**RLS Policies:**
- **SELECT:** Company users see their own proofs, MOH sees all
- **INSERT:** Company users can upload for their replenishment schedules
- **UPDATE:** Company users can update their own proofs
- **DELETE:** Company users can delete their own proofs, MOH can delete any

**Example:**
```
replenishment-proofs/550e8400-e29b-41d4-a716-446655440000/delivery-receipt.pdf
```

---

### 4. compliance-reports

**Purpose:** Regulatory compliance reports (generated PDFs)

**Configuration:**
- **Public:** No (private bucket)
- **File Size Limit:** 50 MB per file
- **Allowed MIME Types:** application/pdf
- **Path Pattern:** `compliance-reports/{report_id}/{filename}`

**RLS Policies:**
- **SELECT:** MOH only (Tier 1 and Tier 2)
- **INSERT:** System-generated reports only (via service role)
- **UPDATE:** Not allowed
- **DELETE:** MOH Tier 1 only

**Example:**
```
compliance-reports/550e8400-e29b-41d4-a716-446655440000/monthly-report-2025-01.pdf
```

---

### 5. audit-attachments

**Purpose:** Audit log attachments (evidence, screenshots)

**Configuration:**
- **Public:** No (private bucket)
- **File Size Limit:** 5 MB per file
- **Allowed MIME Types:** application/pdf, image/jpeg, image/png, image/webp
- **Path Pattern:** `audit-attachments/{audit_log_id}/{filename}`

**RLS Policies:**
- **SELECT:** MOH only (Tier 1 and Tier 2), Auditors
- **INSERT:** System-generated attachments only (via service role)
- **UPDATE:** Not allowed
- **DELETE:** MOH Tier 1 only

**Example:**
```
audit-attachments/550e8400-e29b-41d4-a716-446655440000/evidence-screenshot.png
```

---

## Bucket Creation Script

### SQL Migration Template

```sql
-- Migration: create_storage_buckets
-- Description: Create all storage buckets with RLS policies
-- Date: 2025-01-12

BEGIN;

-- Create buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('export-documents', 'export-documents', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('replenishment-proofs', 'replenishment-proofs', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('compliance-reports', 'compliance-reports', false, 52428800, ARRAY['application/pdf']),
  ('audit-attachments', 'audit-attachments', false, 5242880, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for each bucket
-- (See RLS policy framework for detailed policies)

COMMIT;
```

---

## Storage Access Patterns

### Upload Pattern

```typescript
// Upload file to storage bucket
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/${filename}`, file, {
    cacheControl: '3600',
    upsert: false
  });
```

### Download Pattern

```typescript
// Download file from storage bucket
const { data, error } = await supabase.storage
  .from('avatars')
  .download(`${userId}/${filename}`);
```

### Public URL Pattern

```typescript
// Get public URL (for public buckets only)
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/${filename}`);
```

---

## File Validation

### Client-Side Validation

```typescript
// Validate file before upload
function validateFile(file: File, bucket: string): { valid: boolean; error?: string } {
  const bucketConfig = BUCKET_CONFIGS[bucket];
  
  // Check file size
  if (file.size > bucketConfig.fileSizeLimit) {
    return { valid: false, error: `File size exceeds ${bucketConfig.fileSizeLimit} bytes` };
  }
  
  // Check MIME type
  if (!bucketConfig.allowedMimeTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} not allowed` };
  }
  
  return { valid: true };
}
```

### Server-Side Validation

```sql
-- Server-side validation via RLS policies
-- File size and MIME type checked by Supabase Storage
-- RLS policies enforce access control
```

---

## Related Documents

- [RLS Policy Framework](../docs/02-architecture/security/rls-policy-framework.md)
- [Storage Security](../docs/02-architecture/security/storage-security.md)
- [File Upload Patterns](../docs/02-architecture/frontend/file-upload-patterns.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Nadia
