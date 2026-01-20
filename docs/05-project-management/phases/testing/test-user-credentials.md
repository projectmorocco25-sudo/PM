# Test User Credentials - Subphase 1.1.1

**Purpose:** Test user accounts for Subphase 1.1.1 Foundation & Infrastructure Setup testing  
**Date Created:** 2026-01-19  
**Password:** All test users share the same password for testing convenience  
**Status:** ✅ All users created, seeded, and passwords set via MCP tools

---

## 🔐 Common Test Password

**Password:** `TestPassword123!`

> **Note:** This password is set for all test users to simplify testing workflows. In production, each user would have a unique, secure password.

---

## 👥 Test Users

### 1. MOH Tier 1 (System Administrator)

**Email:** `moh.tier1@moh.gov.ma`  
**Password:** `TestPassword123!`  
**Role:** `tier1` (MOH DMP Tier 1 - Approver/Admin)  
**User ID:** `00000000-0000-0000-0101-000000000001`  
**Full Name:** MOH Tier 1 Admin  
**Company:** None (MOH user)  
**Access Level:** System-wide access (all data visible)

### 2. MOH Tier 2 Officer (Verification & Analysis)

**Email:** `moh.tier2@moh.gov.ma`  
**Password:** `TestPassword123!`  
**Role:** `tier2_officer` (MOH DMP Tier 2 Officer - Verification, analysis, escalation)  
**User ID:** `00000000-0000-0000-0101-000000000002`  
**Full Name:** MOH Tier 2 Officer  
**Company:** None (MOH user)  
**Access Level:** System-wide access (all data visible)

### 3. Company User - Active (PharmaCo Active)

**Email:** `admin@pharmaco-active.ma`  
**Password:** `TestPassword123!`  
**Role:** `company_user` (Company User - View and limited submissions)  
**User ID:** `00000000-0000-0000-0201-000000000002`  
**Full Name:** Company Admin Active  
**Company:** PharmaCo Active (`00000000-0000-0000-0201-000000000001`)  
**Access Level:** Company-scoped access (own company data only)

### 4. Company User - Empty (PharmaCo Empty)

**Email:** `admin@pharmaco-empty.ma`  
**Password:** `TestPassword123!`  
**Role:** `company_user` (Company User - View and limited submissions)  
**User ID:** `00000000-0000-0000-0301-000000000002`  
**Full Name:** Company Admin Empty  
**Company:** PharmaCo Empty (`00000000-0000-0000-0301-000000000001`)  
**Access Level:** Company-scoped access (own company data only, intentionally empty for empty state testing)

### 5. Vendor (Module Licensing & Control)

**Email:** `vendor@pm-platform.ma`  
**Password:** `TestPassword123!`  
**Role:** `vendor` (Vendor - Module licensing and control)  
**User ID:** `00000000-0000-0000-0101-000000000099`  
**Full Name:** PM Platform Vendor  
**Company:** None (Vendor user)  
**Access Level:** Module licensing and system configuration access

---

## ✅ Setup Status

- [x] **Auth users created** via Supabase Admin API ✅ COMPLETE
- [x] **Public users seeded** via seed migration ✅ COMPLETE
- [x] **Passwords set** to `TestPassword123!` ✅ COMPLETE (2026-01-19)
- [x] **Email confirmed** for all users ✅ COMPLETE
- [x] **Auth schema fixed** (aud, confirmation_token, email_change, etc.) ✅ COMPLETE (2026-01-19)
- [x] **Seed data applied** (companies, notifications, conversations, messages, etc.) ✅ COMPLETE

---

## 🔧 Technical Details

### Database Fixes Applied (via MCP tools)

1. **Fixed `auth.users.aud` field:** Set to `'authenticated'` for all test users
2. **Fixed `auth.users.confirmation_token`:** Set to empty string (not NULL) for confirmed users
3. **Fixed `auth.users.recovery_token`:** Set to empty string (not NULL)
4. **Fixed `auth.users.email_change`:** Set to empty string (not NULL)
5. **Fixed `auth.users.phone_change`:** Set to empty string (not NULL)
6. **Fixed all other token fields:** Set to empty string to prevent NULL conversion errors

### Seed Data Status

- **Users:** 5 users (3 MOH/Vendor, 2 Company)
- **Companies:** 2 companies (1 active, 1 empty)
- **Notifications:** 5 notifications (mix of read/unread)
- **Conversations:** 5 conversations (all lifecycle states)
- **Messages:** 4 messages (with read receipts)
- **Follow-ups:** 2 follow-ups (pending, in_progress)
- **Meetings:** 1 meeting (scheduled)

---

## 🚨 Troubleshooting: "Invalid login credentials"

If you encounter "Invalid login credentials" despite using the correct email and password:

**Root Cause:** The password for the `auth.users` entry in Supabase Auth might not be correctly set to `TestPassword123!`. While the `public.users` table is seeded, the `auth.users` table (managed by Supabase Auth) needs its passwords explicitly set.

**Quick Fix (Recommended): Reset Passwords via Supabase Dashboard**

1. **Open Supabase Dashboard:** Navigate to your project's dashboard.
2. **Go to Authentication:** In the left sidebar, click on "Authentication".
3. **Select Users:** Go to the "Users" tab.
4. **Find Test Users:** Locate each of the test users listed above (e.g., `moh.tier1@moh.gov.ma`).
5. **Edit User:** Click on the user's row, then click "Edit User" or find the option to update their details.
6. **Set Password:** In the password field, enter `TestPassword123!`.
7. **Confirm Email:** Ensure the "Email Confirmed" checkbox is checked.
8. **Save:** Click "Update User" to save the changes.
9. **Repeat:** Perform these steps for all 5 test users.

**Alternative: Use PowerShell Script**

Run the script `supabase/scripts/update-user-passwords.ps1` with your service role key:

```powershell
$env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
.\supabase\scripts\update-user-passwords.ps1
```

After this, you should be able to log in successfully.

---

## 💡 Key Considerations for Testing

1. **Test Database:** Ensure you are testing against a dedicated test database, isolated from development or production environments.
2. **Deterministic Data:** All user IDs and data are deterministic, allowing for consistent test assertions.
3. **RLS Validation:** The primary purpose of these users is to validate Row Level Security (RLS) policies.
4. **Access Control:** RLS policies enforce data isolation in the database
5. **Authentication:** Users must authenticate via Supabase Auth before accessing the application

---

## 📝 Maintenance

**Last Updated:** 2026-01-19  
**Maintained By:** Hassan (QA/Assurance Engineer)  
**Seed Data Owner:** Farah (Analytics/CMC Specialist)  
**Database Owner:** Nadia (Supabase/Postgres Data Modeler)

**Change Log:**
- 2026-01-19: Initial test credentials document created
- 2026-01-19: All 5 test users created and seeded in database
- 2026-01-19: Common test password set for all users
- 2026-01-19: Added troubleshooting guide for "Invalid login credentials" error
- 2026-01-19: Fixed auth.users schema issues (aud, confirmation_token, email_change, etc.) via MCP tools
- 2026-01-19: All passwords successfully updated via Admin API
