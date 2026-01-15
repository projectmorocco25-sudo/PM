"use client";

// Wireframe binding: /rmm/companies/[id] -> docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.3-company-detail.md

import Link from "next/link";
import { useMemo } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DetailPage } from "@/components/layout/DetailPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCompany } from "@/hooks/useCompany";
import { useProducts } from "@/hooks/useProducts";
import { useSkus } from "@/hooks/useSkus";
import { useUserRole } from "@/hooks/useUserRole";
import { useCompanyAuditLogs } from "@/hooks/useCompanyAuditLogs";
import { useEnforcementActions } from "@/hooks/useEnforcementActions";

type CompanyRow = {
  id: string;
  name: string;
  registration_number: string;
  tax_id: string | null;
  company_type: "ipc" | "wholesaler";
  address: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type ProductRow = {
  id: string;
  name: string;
  is_active: boolean;
};

type SkuRow = {
  id: string;
  is_active: boolean;
};

type EnforcementRow = {
  id: string;
  action_type: "warning" | "fine" | "suspension";
  status: string;
  violation_type: string;
  legal_basis: string;
  created_at: string;
  executed_at?: string | null;
  amount?: number | null;
  currency?: string | null;
};

function kv(label: string, value: React.ReactNode) {
  return (
    <div className="grid gap-1">
      <div className="text-sm font-medium text-zinc-500">{label}</div>
      <div className="text-base text-zinc-900">{value}</div>
    </div>
  );
}

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const companyId = params.id;

  const { data: roleInfo } = useUserRole();
  const role = roleInfo?.role ?? "unknown";
  const canEdit = role === "tier1" || role === "system_admin" || role === "company_admin";
  const canSeeEnforcement = role === "tier1" || role === "tier2_officer" || role === "system_admin";

  const companyQ = useCompany(companyId);
  const productsQ = useProducts({ companyId });
  const skusQ = useSkus(); // scope to product in later pages; for company summary we just count by joining in DB later
  const auditQ = useCompanyAuditLogs(companyId, 20);
  const enforcementQ = useEnforcementActions(companyId);

  const company = (companyQ.data ?? null) as CompanyRow | null;
  const enforcement = (enforcementQ.data ?? []) as EnforcementRow[];

  const metrics = useMemo(() => {
    const products = (productsQ.data ?? []) as ProductRow[];
    const allSkus = (skusQ.data ?? []) as SkuRow[];
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.is_active !== false).length;
    const totalSkus = allSkus.length;
    const activeSkus = allSkus.filter((s) => s.is_active !== false).length;
    return { totalProducts, activeProducts, totalSkus, activeSkus };
  }, [productsQ.data, skusQ.data]);

  const loading = companyQ.isLoading;
  const error = companyQ.isError;

  return (
    <DashboardLayout>
      <DetailPage
        breadcrumbs={<span>Home &gt; RMM &gt; Companies &gt; {company?.name ?? "Company"}</span>}
        title={company?.name ?? "Company"}
        actions={
          <div className="flex items-center gap-2">
            {canEdit ? (
              <Link href={`/rmm/companies/${companyId}/edit`}>
                <Button variant="outline">Edit</Button>
              </Link>
            ) : null}
            <Button variant="outline" disabled title="Actions menu (coming next)">
              Actions ▾
            </Button>
          </div>
        }
        tabs={[
          {
            key: "overview",
            label: "Overview",
            content: (
              <div className="space-y-4">
                {loading ? <div className="text-sm text-zinc-600">Loading…</div> : null}
                {error ? (
                  <div className="text-sm text-zinc-600">
                    Unable to load company information.{" "}
                    <button type="button" className="text-blue-700 hover:underline" onClick={() => void companyQ.refetch()}>
                      Retry
                    </button>
                  </div>
                ) : null}

                {company ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2">
                        {kv("Type", <Badge variant="secondary">{company.company_type === "ipc" ? "IPC" : "Wholesaler"}</Badge>)}
                        {kv("Status", <Badge variant={company.is_active ? "success" : "secondary"}>{company.is_active ? "Active" : "Inactive"}</Badge>)}
                        {kv("Registration Number", <span className="font-mono text-sm">{company.registration_number}</span>)}
                        {kv("Tax ID", company.tax_id ? <span className="font-mono text-sm">{company.tax_id}</span> : <span className="text-sm text-zinc-500">—</span>)}
                        {kv("Address", company.address ? <span className="text-sm">{company.address}</span> : <span className="text-sm text-zinc-500">—</span>)}
                        {kv(
                          "Contact",
                          <div className="space-y-1 text-sm">
                            <div>{company.contact_email ?? "—"}</div>
                            <div>{company.contact_phone ?? "—"}</div>
                          </div>,
                        )}
                        {kv("Created", <span className="text-sm">{new Date(company.created_at).toLocaleDateString()}</span>)}
                        {kv("Last Updated", <span className="text-sm">{new Date(company.updated_at).toLocaleDateString()}</span>)}
                      </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Total Products</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold text-zinc-900">{metrics.totalProducts}</CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Active Products</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold text-zinc-900">{metrics.activeProducts}</CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Total SKUs</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold text-zinc-900">{metrics.totalSkus}</CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Active SKUs</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold text-zinc-900">{metrics.activeSkus}</CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {auditQ.isLoading ? (
                          <div className="text-sm text-zinc-600">Loading…</div>
                        ) : (auditQ.data ?? []).length === 0 ? (
                          <div className="text-sm text-zinc-600">No recent company activity.</div>
                        ) : (
                          <ul className="space-y-2">
                            {(auditQ.data ?? []).slice(0, 10).map((a) => (
                              <li key={a.id} className="text-sm text-zinc-700">
                                <span className="font-medium text-zinc-900">{a.operation_type}</span>{" "}
                                <span className="text-zinc-500">{new Date(a.created_at).toLocaleString()}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Enforcement History</CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between gap-3">
                        <div className="text-sm text-zinc-700">
                          {enforcementQ.isLoading ? "Loading…" : `${(enforcementQ.data ?? []).length} enforcement actions for this company`}
                        </div>
                        <Link className="text-sm font-medium text-blue-700 hover:underline" href={`/enforcement/actions?company=${companyId}`}>
                          View Enforcement History →
                        </Link>
                      </CardContent>
                    </Card>
                  </>
                ) : null}
              </div>
            ),
          },
          {
            key: "products",
            label: "Products",
            content: (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>Products</CardTitle>
                    <Button variant="outline" disabled title="Product create form comes in Task 1.1.2.22">
                      New Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {productsQ.isLoading ? (
                    <div className="text-sm text-zinc-600">Loading…</div>
                  ) : (productsQ.data ?? []).length === 0 ? (
                    <div className="text-sm text-zinc-600">No products found.</div>
                  ) : (
                    <ul className="divide-y divide-zinc-200 rounded-md border border-zinc-200">
                      {((productsQ.data ?? []) as ProductRow[]).slice(0, 10).map((p) => (
                        <li key={p.id} className="flex items-center justify-between gap-3 p-3">
                          <div className="text-sm font-medium text-zinc-900">{p.name}</div>
                          <Link className="text-sm text-blue-700 hover:underline" href={`/rmm/products/${p.id}`}>
                            View
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-3">
                    <Link className="text-sm font-medium text-blue-700 hover:underline" href={`/rmm/companies/${companyId}/products`}>
                      View All Products
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ),
          },
          {
            key: "enforcement",
            label: "Enforcement",
            disabled: !canSeeEnforcement,
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Enforcement</CardTitle>
                </CardHeader>
                <CardContent>
                  {!canSeeEnforcement ? (
                    <div className="text-sm text-zinc-600">You do not have access to enforcement data.</div>
                  ) : enforcementQ.isLoading ? (
                    <div className="text-sm text-zinc-600">Loading…</div>
                  ) : enforcementQ.isError ? (
                    <div className="text-sm text-zinc-600">Unable to load enforcement actions.</div>
                  ) : enforcement.length === 0 ? (
                    <div className="text-sm text-zinc-600">No enforcement actions for this company.</div>
                  ) : (
                    <div className="space-y-3">
                      {enforcement.slice(0, 10).map((e) => (
                        <div key={e.id} className="rounded-md border border-zinc-200 p-4 hover:bg-zinc-50">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm font-semibold text-zinc-900">
                              {e.action_type === "warning" ? "Warning" : e.action_type === "fine" ? "Fine" : "Suspension"}{" "}
                              {e.amount ? `- ${e.amount} ${e.currency ?? "MAD"}` : null}
                            </div>
                            <Badge variant={e.status === "executed" ? "success" : "secondary"}>{e.status}</Badge>
                          </div>
                          <div className="mt-2 text-sm text-zinc-700">
                            <div>Violation: {e.violation_type}</div>
                            <div>Legal Basis: {e.legal_basis}</div>
                            <div>Date: {new Date((e.executed_at ?? e.created_at) as string).toLocaleString()}</div>
                          </div>
                          <div className="mt-3">
                            <Link className="text-sm font-medium text-blue-700 hover:underline" href={`/enforcement/actions/${e.id}`}>
                              View Full Details
                            </Link>
                          </div>
                        </div>
                      ))}
                      <div>
                        <Link className="text-sm font-medium text-blue-700 hover:underline" href={`/enforcement/actions?company=${companyId}`}>
                          View All Enforcement Actions →
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ),
          },
          {
            key: "history",
            label: "History",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>History</CardTitle>
                </CardHeader>
                <CardContent>
                  {auditQ.isLoading ? (
                    <div className="text-sm text-zinc-600">Loading…</div>
                  ) : (auditQ.data ?? []).length === 0 ? (
                    <div className="text-sm text-zinc-600">No history available.</div>
                  ) : (
                    <ul className="space-y-3">
                      {(auditQ.data ?? []).map((a) => (
                        <li key={a.id} className="rounded-md border border-zinc-200 p-3">
                          <div className="text-sm font-medium text-zinc-900">{a.operation_type}</div>
                          <div className="mt-1 text-sm text-zinc-700">{new Date(a.created_at).toLocaleString()}</div>
                          {a.reason ? <div className="mt-1 text-sm text-zinc-600">{a.reason}</div> : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ),
          },
        ]}
      />
    </DashboardLayout>
  );
}

