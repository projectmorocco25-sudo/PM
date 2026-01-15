"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/FormField";
import { Checkbox } from "@/components/forms/Checkbox";
import { notify } from "@/lib/toast";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { checkPassword, isPasswordValid } from "@/lib/passwordPolicy";
import { useApp } from "@/contexts/AppContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";

const prefsSchema = z.object({
  language: z.string().min(2),
  timezone: z.string().min(1),
  email_enabled: z.boolean().default(true),
  submission_updates: z.boolean().default(true),
  compliance_alerts: z.boolean().default(true),
  enforcement_actions: z.boolean().default(false),
  system_announcements: z.boolean().default(true),
});

const profileSchema = z.object({
  full_name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Valid email required"),
  prefs: prefsSchema,
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useApp();
  const userId = user?.id ?? null;
  const profileQ = useProfile(userId);
  const update = useUpdateProfile(userId ?? "");

  const defaultValues: ProfileForm | undefined = useMemo(() => {
    const p = profileQ.data;
    if (!p) return undefined;
    const np = (p.notification_preferences ?? {}) as Record<string, unknown>;
    return {
      full_name: p.full_name ?? "",
      email: p.email ?? "",
      prefs: {
        language: p.language ?? "en",
        timezone: p.timezone ?? "UTC+01:00",
        email_enabled: Boolean(np.email_enabled ?? true),
        submission_updates: Boolean(np.submission_updates ?? true),
        compliance_alerts: Boolean(np.compliance_alerts ?? true),
        enforcement_actions: Boolean(np.enforcement_actions ?? false),
        system_announcements: Boolean(np.system_announcements ?? true),
      },
    };
  }, [profileQ.data]);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: defaultValues,
    mode: "onBlur",
  });

  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNext, setPwNext] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const pwCheck = useMemo(() => checkPassword(pwNext, 12), [pwNext]);
  const pwOk = isPasswordValid(pwCheck) && pwNext === pwConfirm && pwCurrent.length > 0;

  async function uploadAvatar(file: File) {
    if (!userId) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) throw new Error("Only jpg, png, webp, gif are allowed");
    if (file.size > 5 * 1024 * 1024) throw new Error("File must be <= 5MB");

    const ext = file.name.split(".").pop() ?? "img";
    const safeName = `${crypto.randomUUID()}.${ext}`.replace(/[^a-zA-Z0-9._-]/g, "");
    const path = `${userId}/${safeName}`;

    const supabase = createSupabaseBrowserClient();
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, {
      upsert: true,
      contentType: file.type,
    });
    if (upErr) throw upErr;

    // Store path in profile; signed URL can be generated later.
    await update.mutateAsync({ avatar_url: path });
  }

  async function changePassword() {
    const supabase = createSupabaseBrowserClient();
    const email = profileQ.data?.email ?? user?.email;
    if (!email) throw new Error("Missing email");

    // Verify current password by re-auth.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: pwCurrent,
    });
    if (signInError) throw signInError;

    const { error: updateErr } = await supabase.auth.updateUser({ password: pwNext });
    if (updateErr) throw updateErr;
  }

  return (
    <DashboardLayout>
      <MainContent breadcrumbs={<span>Home &gt; Profile</span>} title="Profile">
        {!userId ? (
          <div className="text-sm text-zinc-600">Please log in.</div>
        ) : profileQ.isLoading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : profileQ.error ? (
          <div className="text-sm text-red-600">Failed to load profile.</div>
        ) : (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-3">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
                    {profileQ.data?.avatar_url ? (
                      <Image
                        src={`/api/avatar?path=${encodeURIComponent(profileQ.data.avatar_url)}`}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <label className="cursor-pointer text-sm font-medium text-blue-700 hover:underline">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        try {
                          await uploadAvatar(f);
                          notify.success("Avatar updated");
                        } catch (err) {
                          notify.error(err instanceof Error ? err.message : "Failed to upload avatar");
                        } finally {
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                  </label>
                </div>

                <form
                  className="mt-6 space-y-4"
                  onSubmit={form.handleSubmit(async (values) => {
                    try {
                      await update.mutateAsync({
                        full_name: values.full_name,
                        email: values.email,
                        timezone: values.prefs.timezone,
                        language: values.prefs.language,
                        notification_preferences: {
                          email_enabled: values.prefs.email_enabled,
                          submission_updates: values.prefs.submission_updates,
                          compliance_alerts: values.prefs.compliance_alerts,
                          enforcement_actions: values.prefs.enforcement_actions,
                          system_announcements: values.prefs.system_announcements,
                        },
                      });
                      notify.success("Profile updated");
                    } catch {
                      notify.error("Failed to update profile");
                    }
                  })}
                >
                  <FormField
                    label="Name"
                    required
                    htmlFor="full_name"
                    error={form.formState.errors.full_name?.message}
                  >
                    <Input id="full_name" {...form.register("full_name")} />
                  </FormField>

                  <FormField label="Email" required htmlFor="email" error={form.formState.errors.email?.message}>
                    <Input id="email" type="email" {...form.register("email")} />
                  </FormField>

                  <FormField label="Company" htmlFor="company">
                    <Input id="company" value={profileQ.data?.company_id ?? "MOH"} disabled />
                  </FormField>

                  <FormField label="Role" htmlFor="role">
                    <Input id="role" value={profileQ.data?.role ?? ""} disabled />
                  </FormField>

                  <Button type="submit" disabled={update.isPending} className="w-full">
                    {update.isPending ? "Saving…" : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <FormField label="Current Password" required>
                  <Input type="password" value={pwCurrent} onChange={(e) => setPwCurrent(e.target.value)} />
                </FormField>
                <FormField label="New Password" required helperText="Minimum 12 chars, upper/lower/digit/symbol.">
                  <Input type="password" value={pwNext} onChange={(e) => setPwNext(e.target.value)} />
                </FormField>
                <FormField label="Confirm New Password" required error={pwConfirm && pwNext !== pwConfirm ? "Passwords do not match" : undefined}>
                  <Input type="password" value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)} />
                </FormField>
                <Button
                  type="button"
                  disabled={!pwOk}
                  className="w-full"
                  onClick={async () => {
                    try {
                      await changePassword();
                      setPwCurrent("");
                      setPwNext("");
                      setPwConfirm("");
                      notify.success("Password updated");
                    } catch (err) {
                      notify.error(err instanceof Error ? err.message : "Failed to update password");
                    }
                  }}
                >
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <FormField label="Language" required>
                  <Input {...form.register("prefs.language")} placeholder="en" />
                </FormField>
                <FormField label="Timezone" required helperText="Default: UTC+01:00 (Morocco)">
                  <Input {...form.register("prefs.timezone")} placeholder="UTC+01:00" />
                </FormField>

                <div className="pt-2">
                  <Checkbox
                    checked={form.watch("prefs.email_enabled")}
                    onChange={(v) => form.setValue("prefs.email_enabled", v)}
                    label="Receive email notifications"
                  />
                </div>
                <div className="space-y-2 pt-2">
                  <div className="text-sm font-semibold text-zinc-900">Notification Preferences</div>
                  <Checkbox
                    checked={form.watch("prefs.submission_updates")}
                    onChange={(v) => form.setValue("prefs.submission_updates", v)}
                    label="Submission status updates"
                  />
                  <Checkbox
                    checked={form.watch("prefs.compliance_alerts")}
                    onChange={(v) => form.setValue("prefs.compliance_alerts", v)}
                    label="Compliance alerts"
                  />
                  <Checkbox
                    checked={form.watch("prefs.enforcement_actions")}
                    onChange={(v) => form.setValue("prefs.enforcement_actions", v)}
                    label="Enforcement actions"
                  />
                  <Checkbox
                    checked={form.watch("prefs.system_announcements")}
                    onChange={(v) => form.setValue("prefs.system_announcements", v)}
                    label="System announcements"
                  />
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={async () => {
                    try {
                      const values = form.getValues();
                      await update.mutateAsync({
                        timezone: values.prefs.timezone,
                        language: values.prefs.language,
                        notification_preferences: {
                          email_enabled: values.prefs.email_enabled,
                          submission_updates: values.prefs.submission_updates,
                          compliance_alerts: values.prefs.compliance_alerts,
                          enforcement_actions: values.prefs.enforcement_actions,
                          system_announcements: values.prefs.system_announcements,
                        },
                      });
                      notify.success("Preferences saved");
                    } catch {
                      notify.error("Failed to save preferences");
                    }
                  }}
                >
                  Save Preferences
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => notify.info("Export will be implemented via background job in later phases.")}
                >
                  Export My Data
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => notify.info("Account deletion requires administrative workflow.")}
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </MainContent>
    </DashboardLayout>
  );
}

