"use client";

// Wireframe binding: /rmm/skus/[id] -> docs/04-design/user-experience/wireframes/01-rmm/skus/task-0.5.2.7-sku-detail.md

import Link from "next/link";
import { useMemo } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DetailPage } from "@/components/layout/DetailPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAtcCodes } from "@/hooks/useAtcCodes";
import { useCompanies } from "@/hooks/useCompanies";
import { useProduct } from "@/hooks/useProduct";
import { useRecordAuditLogs } from "@/hooks/useRecordAuditLogs";
import { useSku } from "@/hooks/useSku";
import { useUserRole } from "@/hooks/useUserRole";

type SkuRow = {
  id: string;
  product_id: string;
  sku_code: string;
  name: string;
  dosage_strength: string;
  dosage_form: string;
  pack_size: string;
  unit_of_measure: string;
  atc_code_id: string | null;
  is_moh_authorized_unregistered: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type ProductRow = { id: string; company_id: string; name: string };

function kv(label: string, value: React.ReactNode) {
  return (
    <div className="grid gap-1">
      <div className="text-sm font-medium text-zinc-500">{label}</div>
      <div className="text-base text-zinc-900">{value}</div>
    </div>
  );
}

export default function SkuDetailPage({ params }: { params: { id: string } }) {
  const skuId = params.id;

  const { data: roleInfo } = useUserRole();
  const role = roleInfo?.role ?? "unknown";
  const canEdit =
    role === "tier1" || role === "tier2_officer" || role === "tier2_registrar" || role === "system_admin" || role === "company_admin";

  const skuQ = useSku(skuId);
  const sku = (skuQ.data ?? null) as SkuRow | null;

  const productQ = useProduct(sku?.product_id ?? null);
  const product = (productQ.data ?? null) as ProductRow | null;

  const companiesQ = useCompanies();
  const companies = useMemo(() => (companiesQ.data ?? []) as Array<{ id: string; name: string }>, [companiesQ.data]);

  const atcQ = useAtcCodes();
  const atcById = useMemo(() => {
    const m = new Map<string, string>();
    for (const a of atcQ.data ?? []) m.set(a.id, a.code);
    return m;
  }, [atcQ.data]);

  const companyName = useMemo(() => {
    if (!product) return "—";
    return companies.find((c) => c.id === product.company_id)?.name ?? "—";
  }, [companies, product]);

  const atcCode = sku?.atc_code_id ? atcById.get(sku.atc_code_id) ?? "—" : "—";

  const auditQ = useRecordAuditLogs("skus", skuId, 20);

  const loading = skuQ.isLoading || productQ.isLoading || companiesQ.isLoading || atcQ.isLoading;
  const error = skuQ.isError;

  return (
    <DashboardLayout>
      <DetailPage
        breadcrumbs={<span>Home &gt; RMM &gt; SKUs &gt; {sku?.sku_code ?? "SKU"}</span>}
        title={sku?.name ?? sku?.sku_code ?? "SKU"}
        actions={
          <div className="flex items-center gap-2">
            {canEdit ? (
              <Button variant="outline" disabled title="SKU edit form comes in Task 1.1.2.25">
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
                    Unable to load SKU information.{" "}
                    <button type="button" className="text-blue-700 hover:underline" onClick={() => void skuQ.refetch()}>
                      Retry
                    </button>
                  </div>
                ) : null}

                {sku ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>SKU Information</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2">
                        {kv("SKU Code", <span className="font-mono text-sm">{sku.sku_code}</span>)}
                        {kv(
                          "Product",
                          product ? (
                            <Link className="text-blue-700 hover:underline" href={`/rmm/products/${product.id}`}>
                              {product.name}
                            </Link>
                          ) : (
                            <span className="text-sm text-zinc-500">—</span>
                          ),
                        )}
                        {kv(
                          "Company",
                          product ? (
                            <Link className="text-blue-700 hover:underline" href={`/rmm/companies/${product.company_id}`}>
                              {companyName}
                            </Link>
                          ) : (
                            <span className="text-sm text-zinc-500">—</span>
                          ),
                        )}
                        {kv("ATC Code", <span className="font-mono text-sm">{atcCode}</span>)}
                        {kv("Status", <Badge variant={sku.is_active ? "success" : "secondary"}>{sku.is_active ? "Active" : "Inactive"}</Badge>)}
                        {kv("Full Name", <div className="text-sm text-zinc-900">{sku.name}</div>)}
                        {kv("Created", <span className="text-sm">{new Date(sku.created_at).toLocaleDateString()}</span>)}
                        {kv("Last Updated", <span className="text-sm">{new Date(sku.updated_at).toLocaleDateString()}</span>)}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Pharmaceutical Attributes</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4 bg-zinc-50 md:grid-cols-2">
                        {kv("Dosage Strength", <span className="text-sm font-medium text-zinc-900">{sku.dosage_strength}</span>)}
                        {kv("Dosage Form", <Badge variant="secondary">{sku.dosage_form}</Badge>)}
                        {kv("Pack Size", <span className="text-sm font-medium text-zinc-900">{sku.pack_size}</span>)}
                        {kv("Unit of Measure", <span className="text-sm font-medium text-zinc-900">{sku.unit_of_measure}</span>)}
                        {kv(
                          "MOH Authorized Unregistered",
                          sku.is_moh_authorized_unregistered ? <Badge variant="warning">Yes</Badge> : <Badge variant="secondary">No</Badge>,
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Related Activity</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-zinc-700">
                        <div>Related submissions / export requests / compliance violations will appear here in later tasks.</div>
                        <div>
                          <Link className="font-medium text-blue-700 hover:underline" href={`/enforcement/actions?sku=${skuId}`}>
                            View All Enforcement Actions →
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : null}
              </div>
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

