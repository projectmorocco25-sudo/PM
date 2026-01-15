"use client";

// Wireframe binding: /rmm/products/[id] -> docs/04-design/user-experience/wireframes/01-rmm/products/task-0.5.2.5-product-detail.md

import Link from "next/link";
import { useMemo } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DetailPage } from "@/components/layout/DetailPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAtcCodes } from "@/hooks/useAtcCodes";
import { useCompanies } from "@/hooks/useCompanies";
import { useEnforcementActions } from "@/hooks/useEnforcementActions";
import { useProduct } from "@/hooks/useProduct";
import { useRecordAuditLogs } from "@/hooks/useRecordAuditLogs";
import { useSkus } from "@/hooks/useSkus";
import { useUserRole } from "@/hooks/useUserRole";

type ProductRow = {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  is_critical_medicine: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type SkuRow = {
  id: string;
  sku_code: string;
  name: string;
  dosage_strength: string;
  dosage_form: string;
  pack_size: string;
  unit_of_measure: string;
  atc_code_id: string | null;
  is_active: boolean;
  created_at: string;
};

function kv(label: string, value: React.ReactNode) {
  return (
    <div className="grid gap-1">
      <div className="text-sm font-medium text-zinc-500">{label}</div>
      <div className="text-base text-zinc-900">{value}</div>
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = params.id;

  const { data: roleInfo } = useUserRole();
  const role = roleInfo?.role ?? "unknown";
  const canEdit =
    role === "tier1" || role === "tier2_officer" || role === "tier2_registrar" || role === "system_admin" || role === "company_admin";

  const productQ = useProduct(productId);
  const companiesQ = useCompanies();
  const skusQ = useSkus({ productId });
  const auditProductQ = useRecordAuditLogs("products", productId, 20);
  const enforcementQ = useEnforcementActions(productQ.data ? (productQ.data as ProductRow).company_id : "");
  const atcQ = useAtcCodes();

  const product = (productQ.data ?? null) as ProductRow | null;
  const companies = useMemo(() => (companiesQ.data ?? []) as Array<{ id: string; name: string }>, [companiesQ.data]);
  const skus = useMemo(() => (skusQ.data ?? []) as SkuRow[], [skusQ.data]);

  const companyName = useMemo(() => {
    if (!product) return "—";
    return companies.find((c) => c.id === product.company_id)?.name ?? "—";
  }, [companies, product]);

  const atcCodeById = useMemo(() => {
    const m = new Map<string, string>();
    for (const a of atcQ.data ?? []) m.set(a.id, a.code);
    return m;
  }, [atcQ.data]);

  const primaryAtcCode = useMemo(() => {
    for (const s of skus) {
      if (!s.atc_code_id) continue;
      const code = atcCodeById.get(s.atc_code_id);
      if (code) return code;
    }
    return "—";
  }, [atcCodeById, skus]);

  const skuMetrics = useMemo(() => {
    const total = skus.length;
    const active = skus.filter((s) => s.is_active !== false).length;
    return { total, active };
  }, [skus]);

  const loading = productQ.isLoading || companiesQ.isLoading || skusQ.isLoading;
  const error = productQ.isError;

  return (
    <DashboardLayout>
      <DetailPage
        breadcrumbs={<span>Home &gt; RMM &gt; Products &gt; {product?.name ?? "Product"}</span>}
        title={product?.name ?? "Product"}
        actions={
          <div className="flex items-center gap-2">
            {canEdit ? (
              <Button variant="outline" disabled title="Product edit form comes in Task 1.1.2.22">
                Edit
              </Button>
            ) : null}
            <Button variant="outline" disabled title="Actions menu comes later">
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
                    Unable to load product information.{" "}
                    <button type="button" className="text-blue-700 hover:underline" onClick={() => void productQ.refetch()}>
                      Retry
                    </button>
                  </div>
                ) : null}

                {product ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2">
                        {kv(
                          "Company",
                          <Link className="text-blue-700 hover:underline" href={`/rmm/companies/${product.company_id}`}>
                            {companyName}
                          </Link>,
                        )}
                        {kv("ATC Code", <span className="font-mono text-sm">{primaryAtcCode}</span>)}
                        {kv(
                          "Critical Medicine",
                          product.is_critical_medicine ? (
                            <Badge variant="destructive">Critical Medicine</Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          ),
                        )}
                        {kv("Status", <Badge variant={product.is_active ? "success" : "secondary"}>{product.is_active ? "Active" : "Inactive"}</Badge>)}
                        {kv(
                          "Description",
                          product.description ? <div className="text-sm text-zinc-800">{product.description}</div> : <span className="text-sm text-zinc-500">—</span>,
                        )}
                        {kv("Created", <span className="text-sm">{new Date(product.created_at).toLocaleDateString()}</span>)}
                        {kv("Last Updated", <span className="text-sm">{new Date(product.updated_at).toLocaleDateString()}</span>)}
                      </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Total SKUs</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold text-zinc-900">{skuMetrics.total}</CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Active SKUs</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-semibold text-zinc-900">{skuMetrics.active}</CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {auditProductQ.isLoading ? (
                          <div className="text-sm text-zinc-600">Loading…</div>
                        ) : (auditProductQ.data ?? []).length === 0 ? (
                          <div className="text-sm text-zinc-600">No recent product activity.</div>
                        ) : (
                          <ul className="space-y-2">
                            {(auditProductQ.data ?? []).slice(0, 10).map((a) => (
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
                        <Link className="text-sm font-medium text-blue-700 hover:underline" href={`/enforcement/actions?product=${productId}`}>
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
            key: "skus",
            label: "SKUs",
            content: (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>SKUs</CardTitle>
                    <Button variant="outline" disabled title="SKU create form comes in Task 1.1.2.25">
                      New SKU
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {skusQ.isLoading ? (
                    <div className="text-sm text-zinc-600">Loading…</div>
                  ) : skus.length === 0 ? (
                    <div className="text-sm text-zinc-600">No SKUs found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-separate border-spacing-0">
                        <thead>
                          <tr className="text-left text-xs font-semibold text-zinc-700">
                            <th className="border-b border-zinc-200 px-3 py-2">SKU Code</th>
                            <th className="border-b border-zinc-200 px-3 py-2">SKU Name</th>
                            <th className="border-b border-zinc-200 px-3 py-2">Dosage Strength</th>
                            <th className="border-b border-zinc-200 px-3 py-2">Dosage Form</th>
                            <th className="border-b border-zinc-200 px-3 py-2">Pack Size</th>
                            <th className="border-b border-zinc-200 px-3 py-2">Status</th>
                            <th className="border-b border-zinc-200 px-3 py-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {skus.slice(0, 10).map((s) => (
                            <tr key={s.id} className="hover:bg-zinc-50">
                              <td className="border-b border-zinc-100 px-3 py-2 font-mono text-xs text-zinc-800">{s.sku_code}</td>
                              <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-900">{s.name}</td>
                              <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-800">{s.dosage_strength}</td>
                              <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-800">{s.dosage_form}</td>
                              <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-800">
                                {s.pack_size} {s.unit_of_measure}
                              </td>
                              <td className="border-b border-zinc-100 px-3 py-2">
                                <Badge variant={s.is_active ? "success" : "secondary"}>{s.is_active ? "Active" : "Inactive"}</Badge>
                              </td>
                              <td className="border-b border-zinc-100 px-3 py-2">
                                <div className="flex gap-2">
                                  <Button variant="link" className="h-auto p-0 text-sm" disabled title="SKU detail comes in Task 1.1.2.24">
                                    View
                                  </Button>
                                  {canEdit ? (
                                    <Button variant="link" className="h-auto p-0 text-sm" disabled title="SKU edit comes in Task 1.1.2.25">
                                      Edit
                                    </Button>
                                  ) : null}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="mt-3">
                    <Link className="text-sm font-medium text-blue-700 hover:underline" href={`/rmm/products/${productId}/skus`}>
                      View All SKUs
                    </Link>
                  </div>
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
                  {auditProductQ.isLoading ? (
                    <div className="text-sm text-zinc-600">Loading…</div>
                  ) : (auditProductQ.data ?? []).length === 0 ? (
                    <div className="text-sm text-zinc-600">No history available.</div>
                  ) : (
                    <ul className="space-y-3">
                      {(auditProductQ.data ?? []).map((a) => (
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

