"use client";

// Wireframe binding: /rmm -> docs/04-design/user-experience/wireframes/01-rmm/overview/task-0.5.2.1-rmm-overview.md

import Link from "next/link";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainContent } from "@/components/layout/MainContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCompanies } from "@/hooks/useCompanies";
import { useProducts } from "@/hooks/useProducts";
import { useSkus } from "@/hooks/useSkus";
import { useModuleActive } from "@/hooks/useModuleActive";
import { useUserRole } from "@/hooks/useUserRole";
import { useRegistrySubmissions } from "@/hooks/useRegistrySubmissions";
import { useAuditLogs } from "@/hooks/useAuditLogs";

function StatLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-zinc-600">{label}</div>
      <div className="font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

export default function RmmOverviewPage() {
  const { data: roleInfo } = useUserRole();
  const role = roleInfo?.role ?? "unknown";
  const isCompany = roleInfo?.isCompanyUser ?? false;

  const { data: rmmActive, isLoading: rmmLoading } = useModuleActive("rmm");

  const companiesQ = useCompanies();
  const productsQ = useProducts();
  const skusQ = useSkus();
  const submissionsQ = useRegistrySubmissions();
  const auditQ = useAuditLogs(10);

  const companies = (companiesQ.data ?? []) as { is_active?: boolean }[];
  const products = (productsQ.data ?? []) as { is_active?: boolean }[];
  const skus = (skusQ.data ?? []) as { is_active?: boolean }[];
  const submissions = (submissionsQ.data ?? []) as { status?: string }[];

  const companyTotals = {
    total: companies.length,
    active: companies.filter((c) => c.is_active !== false).length,
    inactive: companies.filter((c) => c.is_active === false).length,
  };
  const productTotals = {
    total: products.length,
    active: products.filter((p) => p.is_active !== false).length,
    inactive: products.filter((p) => p.is_active === false).length,
  };
  const skuTotals = {
    total: skus.length,
    active: skus.filter((s) => s.is_active !== false).length,
    inactive: skus.filter((s) => s.is_active === false).length,
  };

  const submissionTotals = {
    pending: submissions.filter((s) => ["submitted", "tier2_verified", "tier2_peer_reviewed", "tier1_approved", "tier2_implemented"].includes(s.status ?? "")).length,
    approved: submissions.filter((s) => ["completed"].includes(s.status ?? "")).length,
    rejected: submissions.filter((s) => ["rejected"].includes(s.status ?? "")).length,
  };

  const isLoading = companiesQ.isLoading || productsQ.isLoading || skusQ.isLoading || submissionsQ.isLoading;
  const isError = companiesQ.isError || productsQ.isError || skusQ.isError || submissionsQ.isError;

  return (
    <DashboardLayout>
      <MainContent
        breadcrumbs={<span>Home &gt; RMM</span>}
        title="Registry Management Module (RMM)"
        actions={<Badge variant="secondary">Core module</Badge>}
      >
        {!rmmLoading && rmmActive === false ? (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            The RMM module is currently inactive. Some features may be unavailable.
          </div>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Module Summary</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-700">
            RMM manages company registrations, products, SKUs, and registry submissions. This module is the foundation for all other modules.
          </CardContent>
        </Card>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Companies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <div className="text-sm text-zinc-600">Loading…</div>
              ) : (
                <>
                  <StatLine label="Total" value={companyTotals.total} />
                  <StatLine label="Active" value={companyTotals.active} />
                  <StatLine label="Inactive" value={companyTotals.inactive} />
                </>
              )}
              <Link className="inline-block text-sm font-medium text-blue-700 hover:underline" href="/rmm/companies">
                View all
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <div className="text-sm text-zinc-600">Loading…</div>
              ) : (
                <>
                  <StatLine label="Total" value={productTotals.total} />
                  <StatLine label="Active" value={productTotals.active} />
                  <StatLine label="Inactive" value={productTotals.inactive} />
                </>
              )}
              <Link className="inline-block text-sm font-medium text-blue-700 hover:underline" href="/rmm/products">
                View all
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SKUs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <div className="text-sm text-zinc-600">Loading…</div>
              ) : (
                <>
                  <StatLine label="Total" value={skuTotals.total} />
                  <StatLine label="Active" value={skuTotals.active} />
                  <StatLine label="Inactive" value={skuTotals.inactive} />
                </>
              )}
              <Link className="inline-block text-sm font-medium text-blue-700 hover:underline" href="/rmm/skus">
                View all
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50" href="/rmm/companies">
              Companies
            </Link>
            <Link className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50" href="/rmm/products">
              Products
            </Link>
            <Link className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50" href="/rmm/skus">
              SKUs
            </Link>
            <Link className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50" href="/rmm/submissions">
              Submissions
            </Link>
            {!isCompany ? (
              <>
                <Link className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50" href="/rmm/atc-codes">
                  ATC Codes
                </Link>
                <Link className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50" href="/rmm/critical-medicines">
                  Critical Medicines
                </Link>
                <Link className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50" href="/enforcement">
                  Enforcement
                </Link>
              </>
            ) : null}
          </CardContent>
        </Card>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {auditQ.isLoading ? (
                <div className="text-sm text-zinc-600">Loading…</div>
              ) : (auditQ.data ?? []).length === 0 ? (
                <div className="text-sm text-zinc-600">No recent activity.</div>
              ) : (
                <ul className="space-y-2">
                  {(auditQ.data ?? []).slice(0, 10).map((a) => (
                    <li key={a.id} className="text-sm text-zinc-700">
                      <span className="font-medium text-zinc-900">{a.operation_type}</span> on{" "}
                      <span className="font-mono text-xs text-zinc-700">{a.table_name}</span>{" "}
                      <span className="text-zinc-500">({new Date(a.created_at).toLocaleString()})</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3">
                <Link className="text-sm font-medium text-blue-700 hover:underline" href="/audit/logs">
                  View full history
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registry Submissions Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isError ? (
                <div className="text-sm text-zinc-600">Unable to load RMM overview.</div>
              ) : isLoading ? (
                <div className="text-sm text-zinc-600">Loading…</div>
              ) : submissions.length === 0 ? (
                <div className="text-sm text-zinc-600">
                  No RMM data available. {role === "company_admin" || role === "company_manager" || role === "company_user" ? "Start by creating a submission." : "Start by registering companies and products."}
                </div>
              ) : (
                <>
                  <StatLine label="Pending" value={submissionTotals.pending} />
                  <StatLine label="Approved" value={submissionTotals.approved} />
                  <StatLine label="Rejected" value={submissionTotals.rejected} />
                </>
              )}
              <Link className="inline-block text-sm font-medium text-blue-700 hover:underline" href="/rmm/submissions">
                View all submissions
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainContent>
    </DashboardLayout>
  );
}

