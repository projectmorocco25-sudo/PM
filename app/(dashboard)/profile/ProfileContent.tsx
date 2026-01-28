"use client";

/**
 * Wireframe: task-0.5.1.22-profile-page.md
 * Profile form: User info, Change password, Preferences, Account actions.
 * APIs: shared_update_user_profile, shared_update_user_preferences; users table read.
 */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import { useProfile, roleLabel } from "@/hooks/use-profile";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { isPasswordValid } from "@/lib/password-validation";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
  { value: "fr", label: "French" },
];

const TIMEZONES = [
  { value: "UTC+01:00", label: "UTC+01:00 (Morocco)" },
  { value: "UTC+00:00", label: "UTC+00:00" },
  { value: "Africa/Casablanca", label: "Africa/Casablanca" },
];

function Section({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[#e5e7eb] bg-white p-8">
      <h2 className="text-[24px] font-semibold text-[#111827]">{title}</h2>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

export function ProfileContent() {
  const { user } = useSession();
  const { data, status, error, refetch } = useProfile(user);
  const supabase = createClient();

  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("UTC+01:00");
  const [language, setLanguage] = useState("en");
  const [prefs, setPrefs] = useState({
    email_enabled: true,
    submission_updates: true,
    compliance_alerts: true,
    enforcement_actions: false,
    system_announcements: true,
  });
  const [profileSaveStatus, setProfileSaveStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [prefsSaveStatus, setPrefsSaveStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [prefsError, setPrefsError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!data) return;
    setName(data.user.full_name ?? "");
    setTimezone(data.user.timezone || "UTC+01:00");
    setLanguage(data.user.language || "en");
    const p = data.user.notification_preferences;
    if (p) {
      setPrefs({
        email_enabled: p.email_enabled ?? true,
        submission_updates: p.submission_updates ?? true,
        compliance_alerts: p.compliance_alerts ?? true,
        enforcement_actions: p.enforcement_actions ?? false,
        system_announcements: p.system_announcements ?? true,
      });
    }
  }, [data]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || profileSaveStatus === "loading") return;
    setProfileSaveStatus("loading");
    setProfileError(null);
    const { data: res, error: err } = await supabase.rpc("shared_update_user_profile", {
      p_full_name: name.trim() || null,
      p_avatar_url: null,
      p_timezone: timezone,
      p_language: language,
    });
    if (err) {
      setProfileError(err.message);
      setProfileSaveStatus("error");
      return;
    }
    const out = res as { success?: boolean; error?: string };
    if (!out?.success) {
      setProfileError(out?.error ?? "Update failed");
      setProfileSaveStatus("error");
      return;
    }
    setProfileSaveStatus("success");
    refetch();
  };

  const handleSavePrefs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || prefsSaveStatus === "loading") return;
    setPrefsSaveStatus("loading");
    setPrefsError(null);
    const { data: res, error: err } = await supabase.rpc("shared_update_user_preferences", {
      p_preferences: prefs,
    });
    if (err) {
      setPrefsError(err.message);
      setPrefsSaveStatus("error");
      return;
    }
    const out = res as { success?: boolean; error?: string };
    if (!out?.success) {
      setPrefsError(out?.error ?? "Update failed");
      setPrefsSaveStatus("error");
      return;
    }
    setPrefsSaveStatus("success");
    refetch();
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || passwordStatus === "loading") return;
    if (!isPasswordValid(newPassword) || newPassword !== confirmPassword) return;
    setPasswordStatus("loading");
    setPasswordError(null);
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (signInErr) {
      setPasswordError("Current password is incorrect.");
      setPasswordStatus("error");
      return;
    }
    const { error: updateErr } = await supabase.auth.updateUser({ password: newPassword });
    if (updateErr) {
      setPasswordError(updateErr.message);
      setPasswordStatus("error");
      return;
    }
    setPasswordStatus("success");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    if (!file.type.startsWith("image/")) {
      setAvatarError("Please choose an image (JPEG, PNG, GIF, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Image must be 5MB or smaller.");
      return;
    }
    setAvatarUploading(true);
    setAvatarError(null);
    const ext = file.name.split(".").pop() || "png";
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("avatars").upload(path, file, {
      upsert: true,
    });
    if (uploadErr) {
      setAvatarError(uploadErr.message);
      setAvatarUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const { error: updateErr } = await supabase.rpc("shared_update_user_profile", {
      p_full_name: null,
      p_avatar_url: urlData.publicUrl,
      p_timezone: null,
      p_language: null,
    });
    if (updateErr) {
      setAvatarError(updateErr.message);
      setAvatarUploading(false);
      return;
    }
    setAvatarUploading(false);
    refetch();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExport = async () => {
    if (!data || exporting) return;
    setExporting(true);
    const blob = new Blob(
      [JSON.stringify({ profile: data.user, companyName: data.companyName, exportedAt: new Date().toISOString() }, null, 2)],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pm-profile-export.json";
    a.click();
    URL.revokeObjectURL(a.href);
    setExporting(false);
  };

  const passwordValid = isPasswordValid(newPassword) && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">Profile</span>
        </nav>
        <h1 className="text-2xl font-bold text-[#111827] md:text-3xl">Profile</h1>
        <div className="h-64 animate-pulse rounded-lg bg-[#e5e7eb]" />
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="space-y-6">
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
          <span className="mx-2 text-[#9ca3af]">/</span>
          <span className="text-[#111827]">Profile</span>
        </nav>
        <h1 className="text-2xl font-bold text-[#111827] md:text-3xl">Profile</h1>
        <div className="rounded-lg border border-[#ef4444] bg-[#fef2f2] p-6 text-[#991b1b]">
          <p className="font-medium">Unable to load profile.</p>
          <p className="mt-1 text-sm">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 rounded-lg bg-[#ef4444] px-4 py-2 text-sm font-medium text-white hover:bg-[#dc2626]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const avatarUrl = data.user.avatar_url;
  const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  return (
    <div className="mx-auto max-w-[600px] space-y-8">
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-2 text-[#9ca3af]">/</span>
        <span className="text-[#111827]">Profile</span>
      </nav>

      <h1 className="text-2xl font-bold text-[#111827] md:text-3xl">Profile</h1>

      {/* User Information */}
      <Section title="User Information">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-full border-2 border-[#e5e7eb] bg-[#f3f4f6] md:h-[120px] md:w-[120px]">
            {avatarUrl ? (
              <img
                src={avatarUrl.startsWith("http") ? avatarUrl : `${storageUrl}/storage/v1/object/public/avatars/${avatarUrl}`}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-[#9ca3af]">
                {(data.user.full_name || data.user.email || "?").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleAvatarUpload}
            aria-label="Upload avatar"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            className="rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb] disabled:opacity-70"
          >
            {avatarUploading ? "Uploading…" : "Upload"}
          </button>
          {avatarError && <p className="text-sm text-[#ef4444]" role="alert">{avatarError}</p>}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div>
            <label htmlFor="profile-name" className="block text-sm font-medium text-[#111827]">Name <span className="text-[#ef4444]">*</span></label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-[#e5e7eb] px-4 text-base text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              required
            />
          </div>
          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-[#111827]">Email <span className="text-[#ef4444]">*</span></label>
            <input
              id="profile-email"
              type="email"
              value={data.user.email}
              readOnly
              className="mt-1 h-10 w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 text-base text-[#4b5563]"
              aria-readonly="true"
            />
          </div>
          <div>
            <label htmlFor="profile-company" className="block text-sm font-medium text-[#111827]">Company</label>
            <input
              id="profile-company"
              type="text"
              value={data.companyName ? `${data.companyName} (Read-only)` : "—"}
              readOnly
              className="mt-1 h-10 w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 text-base text-[#4b5563]"
              aria-readonly="true"
            />
          </div>
          <div>
            <label htmlFor="profile-role" className="block text-sm font-medium text-[#111827]">Role</label>
            <input
              id="profile-role"
              type="text"
              value={`${roleLabel(data.user.role)} (Read-only)`}
              readOnly
              className="mt-1 h-10 w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 text-base text-[#4b5563]"
              aria-readonly="true"
            />
          </div>
          {profileSaveStatus === "success" && <p className="text-sm text-[#059669]" role="status">Profile updated successfully.</p>}
          {profileError && <p className="text-sm text-[#ef4444]" role="alert">{profileError}</p>}
          <button
            type="submit"
            disabled={profileSaveStatus === "loading"}
            className="h-10 w-full rounded-lg bg-[#3b82f6] px-4 text-sm font-medium text-white hover:bg-[#2563eb] disabled:opacity-70"
          >
            {profileSaveStatus === "loading" ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </Section>

      {/* Change Password */}
      <Section title="Change Password">
        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <PasswordInput
            id="current-password"
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            required
          />
          <PasswordInput
            id="new-password"
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            required
            aria-describedby="profile-pw-requirements"
          />
          <PasswordInput
            id="confirm-password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            error={passwordsMismatch ? "Passwords do not match." : undefined}
          />
          <PasswordRequirements password={newPassword} id="profile-pw-requirements" />
          {passwordStatus === "success" && <p className="text-sm text-[#059669]" role="status">Password updated.</p>}
          {passwordError && <p className="text-sm text-[#ef4444]" role="alert">{passwordError}</p>}
          <button
            type="submit"
            disabled={passwordStatus === "loading" || !passwordValid || passwordsMismatch}
            className="h-10 w-full rounded-lg bg-[#3b82f6] px-4 text-sm font-medium text-white hover:bg-[#2563eb] disabled:opacity-70"
          >
            {passwordStatus === "loading" ? "Updating…" : "Update Password"}
          </button>
        </form>
      </Section>

      {/* Preferences */}
      <Section title="Preferences">
        <form onSubmit={handleSavePrefs} className="space-y-6">
          <div>
            <label htmlFor="profile-language" className="block text-sm font-medium text-[#111827]">Language</label>
            <select
              id="profile-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-[#e5e7eb] px-4 text-base text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="profile-timezone" className="block text-sm font-medium text-[#111827]">Timezone</label>
            <select
              id="profile-timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-[#e5e7eb] px-4 text-base text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
            >
              {TIMEZONES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={prefs.email_enabled}
                onChange={(e) => setPrefs((p) => ({ ...p, email_enabled: e.target.checked }))}
                className="h-4 w-4 rounded border-[#e5e7eb] text-[#3b82f6]"
              />
              <span className="text-base text-[#111827]">Receive email notifications</span>
            </label>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#111827]">Notification Preferences</h3>
            <div className="mt-3 space-y-2">
              {[
                { key: "submission_updates" as const, label: "Submission status updates" },
                { key: "compliance_alerts" as const, label: "Compliance alerts" },
                { key: "enforcement_actions" as const, label: "Enforcement actions" },
                { key: "system_announcements" as const, label: "System announcements" },
              ].map(({ key, label }) => (
                <label key={key} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={prefs[key]}
                    onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))}
                    className="h-4 w-4 rounded border-[#e5e7eb] text-[#3b82f6]"
                  />
                  <span className="text-base text-[#111827]">{label}</span>
                </label>
              ))}
            </div>
          </div>
          {prefsSaveStatus === "success" && <p className="text-sm text-[#059669]" role="status">Preferences saved.</p>}
          {prefsError && <p className="text-sm text-[#ef4444]" role="alert">{prefsError}</p>}
          <button
            type="submit"
            disabled={prefsSaveStatus === "loading"}
            className="h-10 w-full rounded-lg bg-[#3b82f6] px-4 text-sm font-medium text-white hover:bg-[#2563eb] disabled:opacity-70"
          >
            {prefsSaveStatus === "loading" ? "Saving…" : "Save Preferences"}
          </button>
        </form>
      </Section>

      {/* Account Actions */}
      <Section title="Account Actions">
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="h-10 w-full rounded-lg border border-[#e5e7eb] bg-white px-4 text-sm font-medium text-[#111827] hover:bg-[#f9fafb] disabled:opacity-70"
          >
            {exporting ? "Exporting…" : "Export My Data"}
          </button>
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="h-10 w-full rounded-lg bg-[#ef4444] px-4 text-sm font-medium text-white hover:bg-[#dc2626]"
          >
            Delete Account
          </button>
        </div>
      </Section>

      {deleteModalOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" aria-hidden onClick={() => setDeleteModalOpen(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-[min(400px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
            <h2 id="delete-modal-title" className="text-lg font-semibold text-[#111827]">Delete Account</h2>
            <p className="mt-2 text-sm text-[#4b5563]">
              Account deletion must be requested through support. Contact us for assistance.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href="/support/contact"
                className="flex-1 rounded-lg bg-[#3b82f6] px-4 py-2 text-center text-sm font-medium text-white hover:bg-[#2563eb]"
              >
                Contact Support
              </Link>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="rounded-lg border border-[#e5e7eb] px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
