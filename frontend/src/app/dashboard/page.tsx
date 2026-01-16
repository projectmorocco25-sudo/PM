"use client";

import Link from "next/link";

import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardHomePage() {
  const { data: roleInfo } = useUserRole();

  const role = roleInfo?.role ?? "unknown";
  const isTier1 = roleInfo?.isTier1 ?? false;
  const isTier2 = roleInfo?.isTier2 ?? false;
  const isCompany = roleInfo?.isCompanyUser ?? false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600">Signed in as: {role}</p>
      </div>

      {isTier1 ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Approvals</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600">Tier 1 approval queue will appear here.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600">
              <Link className="text-blue-700 hover:underline" href="/system-config">
                Manage modules
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Communications</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600">
              <Link className="text-blue-700 hover:underline" href="/communications/inbox">
                Open inbox
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {isTier2 ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Verification</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600">Tier 2 verification queue will appear here.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Audit</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600">
              <Link className="text-blue-700 hover:underline" href="/audit/logs">
                View audit logs
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600">
              <Link className="text-blue-700 hover:underline" href="/notifications">
                View notifications
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {isCompany ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Registry</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600">Access your companies/products/SKUs.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600">Submit and track reporting obligations.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600">
              <Link className="text-blue-700 hover:underline" href="/communications/inbox">
                Message MOH
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

