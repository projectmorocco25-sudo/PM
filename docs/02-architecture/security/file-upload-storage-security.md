# File Upload and Storage Security - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the comprehensive file upload and storage security strategy, including validation, virus scanning, access control, and storage security.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Gap Resolution)  
**Owner:** Salim (Security & Audit Engineer), Leila (Infrastructure Engineer)

## Overview

The PM platform implements comprehensive file upload and storage security to prevent malicious file uploads, ensure data integrity, and control access to stored files.

## File Upload Security Principles

1. **Validate Everything:** Validate file type, size, content
2. **Scan for Malware:** Scan all uploads for viruses/malware
3. **Restrict Access:** Control who can upload/download files
4. **Encrypt at Rest:** All files encrypted in storage
5. **Audit All Access:** Log all file operations
6. **Secure Transmission:** All uploads/downloads over HTTPS

## File Upload Validation

### 1. File Type Validation

**Allowed File Types:**
- Documents: PDF, DOC, DOCX, XLS, XLSX
- Images: JPG, JPEG, PNG, GIF, WEBP
- Archives: ZIP (for batch uploads)

**Validation:**
```sql
-- Validate file extension
CREATE OR REPLACE FUNCTION validate_file_extension(filename text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  extension text;
  allowed_extensions text[] := ARRAY[
    'pdf', 'doc', 'docx', 'xls', 'xlsx',
    'jpg', 'jpeg', 'png', 'gif', 'webp',
    'zip'
  ];
BEGIN
  -- Extract extension
  extension := lower(split_part(filename, '.', -1));
  
  -- Check if allowed
  IF NOT extension = ANY(allowed_extensions) THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;
```

**Magic Number Validation:**
```typescript
// Edge Function: Validate file content (magic numbers)
const fileMagicNumbers: Record<string, string[]> = {
  'pdf': ['%PDF'],
  'doc': ['D0CF11E0'], // OLE2 (DOC, XLS)
  'docx': ['504B0304'], // ZIP (DOCX, XLSX)
  'xls': ['D0CF11E0'],
  'xlsx': ['504B0304'],
  'jpg': ['FFD8FF'],
  'jpeg': ['FFD8FF'],
  'png': ['89504E47'],
  'gif': ['474946'],
  'webp': ['52494646'], // RIFF
  'zip': ['504B0304', '504B0506']
};

export async function validateFileContent(file: File, expectedExtension: string): Promise<boolean> {
  const buffer = await file.arrayBuffer();
  const magicNumber = Array.from(new Uint8Array(buffer.slice(0, 4)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('').toUpperCase();
  
  const expectedMagicNumbers = fileMagicNumbers[expectedExtension.toLowerCase()];
  if (!expectedMagicNumbers) {
    return false;
  }
  
  return expectedMagicNumbers.some(mn => magicNumber.startsWith(mn));
}
```

---

### 2. File Size Validation

**Size Limits:**
- Documents: 10 MB max
- Images: 5 MB max
- Archives: 50 MB max (for batch uploads)

**Validation:**
```sql
-- Validate file size
CREATE OR REPLACE FUNCTION validate_file_size(
  file_size_bytes bigint,
  file_type text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  max_size bigint;
BEGIN
  -- Set max size based on file type
  CASE file_type
    WHEN 'document' THEN max_size := 10485760; -- 10 MB
    WHEN 'image' THEN max_size := 5242880; -- 5 MB
    WHEN 'archive' THEN max_size := 52428800; -- 50 MB
    ELSE max_size := 10485760; -- Default 10 MB
  END CASE;
  
  IF file_size_bytes > max_size THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;
```

---

### 3. File Name Sanitization

**Sanitization:**
```sql
-- Sanitize file name
CREATE OR REPLACE FUNCTION sanitize_filename(filename text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Remove path components (prevent directory traversal)
  filename := split_part(filename, '/', -1);
  filename := split_part(filename, '\', -1);
  
  -- Remove dangerous characters
  filename := regexp_replace(filename, '[<>:"|?*\x00]', '', 'g');
  
  -- Remove leading/trailing dots and spaces
  filename := trim(both '. ' from filename);
  
  -- Limit length
  IF length(filename) > 255 THEN
    filename := substring(filename, 1, 255);
  END IF;
  
  -- Ensure has extension
  IF position('.' in filename) = 0 THEN
    RAISE EXCEPTION 'Filename must have extension';
  END IF;
  
  RETURN filename;
END;
$$;
```

---

## Virus Scanning

### Scanning Strategy

**Implementation:**
- Scan all uploads before storage
- Use external virus scanning service (ClamAV, VirusTotal API)
- Quarantine suspicious files

**Edge Function:**
```typescript
// Edge Function: Virus scanning
import { createClient } from '@supabase/supabase-js';

export async function scanFileForVirus(fileBuffer: ArrayBuffer): Promise<boolean> {
  // Option 1: Use VirusTotal API
  const virusTotalApiKey = Deno.env.get('VIRUSTOTAL_API_KEY');
  if (virusTotalApiKey) {
    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer]));
    
    const response = await fetch('https://www.virustotal.com/vtapi/v2/file/scan', {
      method: 'POST',
      headers: {
        'x-apikey': virusTotalApiKey
      },
      body: formData
    });
    
    const result = await response.json();
    return result.response_code === 1; // Clean
  }
  
  // Option 2: Use ClamAV (if available)
  // ...
  
  // Default: Allow if no scanner available (not recommended for production)
  return true;
}
```

---

## File Storage Security

### Supabase Storage Configuration

**Bucket Configuration:**
```sql
-- Create storage bucket with policies
-- Bucket: company-documents
-- Access: Private (RLS enforced)
-- Encryption: At rest (Supabase managed)
```

**Storage Policies:**
```sql
-- Policy: Company users can upload to own company bucket
CREATE POLICY "company_users_upload_own_files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'company-documents'
  AND (storage.foldername(name))[1] = (
    SELECT company_id::text FROM users WHERE id = auth.uid()
  )
);

-- Policy: Company users can read own company files
CREATE POLICY "company_users_read_own_files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'company-documents'
  AND (storage.foldername(name))[1] = (
    SELECT company_id::text FROM users WHERE id = auth.uid()
  )
);

-- Policy: MOH users can read all files
CREATE POLICY "moh_users_read_all_files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'company-documents'
  AND (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);
```

---

### File Access Control

**Access Levels:**
1. **Company Users:** Access only own company's files
2. **MOH Users:** Access all files (system-wide)
3. **Public:** No public access (all files private)

**Implementation:**
- RLS policies on storage.objects
- Folder structure: `{company_id}/{file_type}/{filename}`
- Signed URLs for temporary access

**Signed URL Generation:**
```typescript
// Generate signed URL for file access
const supabase = createClient(supabaseUrl, supabaseKey);

const { data, error } = await supabase.storage
  .from('company-documents')
  .createSignedUrl(`${companyId}/${fileType}/${filename}`, 3600); // 1 hour expiry

if (error) {
  throw error;
}

return data.signedUrl;
```

---

## File Upload Flow

### Complete Upload Flow

**1. Client Validation:**
```typescript
// Frontend: Validate before upload
function validateFile(file: File): ValidationResult {
  // Check file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' };
  }
  
  // Check file size
  if (file.size > 10485760) { // 10 MB
    return { valid: false, error: 'File too large' };
  }
  
  return { valid: true };
}
```

**2. Upload to Supabase Storage:**
```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('company-documents')
  .upload(`${companyId}/documents/${sanitizedFilename}`, file, {
    cacheControl: '3600',
    upsert: false
  });
```

**3. Virus Scanning (Edge Function):**
```typescript
// Trigger virus scanning
const { data: scanResult } = await supabase.functions.invoke('scan-file', {
  body: { filePath: data.path }
});
```

**4. Store File Metadata:**
```sql
-- Store file metadata in database
INSERT INTO file_uploads (
  id,
  company_id,
  filename,
  file_path,
  file_size,
  file_type,
  mime_type,
  uploaded_by,
  scan_status,
  created_at
) VALUES (
  gen_random_uuid(),
  company_id,
  sanitized_filename,
  storage_path,
  file_size,
  file_type,
  mime_type,
  auth.uid(),
  'pending',
  now()
);
```

---

## File Download Security

### Download Validation

**Checks:**
- User has permission to access file
- File exists and is accessible
- File not quarantined
- Generate signed URL with expiry

**Implementation:**
```sql
-- Check file access permission
CREATE OR REPLACE FUNCTION check_file_access(file_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  file_record record;
  user_company_id uuid;
BEGIN
  -- Get file record
  SELECT * INTO file_record
  FROM file_uploads
  WHERE id = file_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check if file is accessible (not quarantined)
  IF file_record.scan_status = 'quarantined' THEN
    RETURN false;
  END IF;
  
  -- Get user company
  SELECT company_id INTO user_company_id
  FROM users
  WHERE id = auth.uid();
  
  -- Check access: Company users can access own files, MOH users can access all
  IF user_company_id IS NULL THEN
    -- MOH user
    RETURN true;
  ELSIF user_company_id = file_record.company_id THEN
    -- Company user accessing own file
    RETURN true;
  ELSE
    -- No access
    RETURN false;
  END IF;
END;
$$;
```

---

## File Retention and Deletion

### Retention Policy

**Retention:**
- Active files: Retained while referenced
- Deleted files: Soft delete (mark as deleted)
- Regulatory retention: 7 years minimum

**Soft Delete:**
```sql
-- Soft delete file
UPDATE file_uploads
SET is_deleted = true,
    deleted_at = now(),
    deleted_by = auth.uid()
WHERE id = file_id;
```

**Hard Delete (After Retention Period):**
```sql
-- Hard delete file (after 7 years)
DELETE FROM file_uploads
WHERE is_deleted = true
  AND deleted_at < now() - interval '7 years';
```

---

## File Audit Logging

### Audit All File Operations

**Operations Logged:**
- File upload
- File download
- File deletion
- File access (who accessed what)

**Implementation:**
```sql
-- Log file operation
CREATE OR REPLACE FUNCTION log_file_operation(
  file_id uuid,
  operation text,
  details jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    operation_type,
    table_name,
    record_id,
    new_values,
    reason
  ) VALUES (
    auth.uid(),
    'FILE_' || operation,
    'file_uploads',
    file_id,
    details,
    'File operation: ' || operation
  );
END;
$$;
```

---

## File Security Best Practices

### 1. Validate Everything

- File type (extension + magic number)
- File size
- File name (sanitize)
- File content (scan for malware)

### 2. Encrypt at Rest

- Supabase Storage encryption (automatic)
- Additional encryption if needed

### 3. Control Access

- RLS policies on storage
- Signed URLs with expiry
- Audit all access

### 4. Scan for Malware

- Scan all uploads
- Quarantine suspicious files
- Regular updates to virus definitions

### 5. Monitor and Audit

- Log all file operations
- Monitor for suspicious patterns
- Alert on security events

---

## File Upload Security Checklist

### For Each File Upload:

- [ ] File type validated (extension + magic number)
- [ ] File size validated
- [ ] File name sanitized
- [ ] Virus scanning performed
- [ ] Access control enforced
- [ ] File metadata stored
- [ ] Upload logged in audit_logs
- [ ] Signed URL generated (if needed)
- [ ] Retention policy applied

---

## Related Documents

- [Backend Input Sanitization Strategy](backend-input-sanitization-strategy.md) - Input sanitization
- [Security Architecture](security-architecture.md) - Security overview
- [Audit Logging Specification](audit-logging-spec.md) - Audit logging

---

**Next Review Date:** [To be scheduled]  
**Owner:** Salim (Security & Audit Engineer), Leila (Infrastructure Engineer)

