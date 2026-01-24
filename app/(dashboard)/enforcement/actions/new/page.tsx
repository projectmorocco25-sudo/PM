/**
 * Wireframe: task-0.5.2.1b-create-enforcement-action-wizard.md
 * Route: /enforcement/actions/new
 * Implements: Create enforcement action wizard (multi-step form)
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/enforcement/task-0.5.2.1b-create-enforcement-action-wizard.md
 * 
 * Database: enforcement_actions, companies tables
 * RPC Functions: enforcement_create_action(creator_user_id, company_id, action_type, violation_type, legal_basis, justification, violation_reference_id, violation_reference_table, amount, currency, notes)
 * 
 * Features:
 * - Multi-step wizard form
 * - Company selection
 * - Action type selection (warning, fine, suspension)
 * - Violation type selection
 * - Legal basis and justification
 * - Form validation
 * - Role-based access control (MOH Tier 1 and Tier 2 only)
 * - Responsive design
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES } from "@/lib/constants/roles";
import { ArrowLeft, Save, ChevronRight, ChevronLeft } from "lucide-react";

interface Company {
  id: string;
  name: string;
}

const ACTION_TYPES = [
  { value: "warning", label: "Warning" },
  { value: "fine", label: "Fine" },
  { value: "suspension", label: "Suspension" },
];

const VIOLATION_TYPES = [
  { value: "submission_non_compliance", label: "Submission Non-Compliance" },
  { value: "threshold_breach", label: "Threshold Breach" },
  { value: "critical_medicine_non_compliance", label: "Critical Medicine Non-Compliance" },
  { value: "export_violation", label: "Export Violation" },
  { value: "data_quality_issue", label: "Data Quality Issue" },
  { value: "repeated_offender", label: "Repeated Offender" },
];

type WizardStep = 1 | 2 | 3 | 4;

export default function CreateEnforcementActionPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // Form state
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [companyId, setCompanyId] = useState<string>("");
  const [actionType, setActionType] = useState<string>("");
  const [violationType, setViolationType] = useState<string>("");
  const [violationReferenceId, setViolationReferenceId] = useState<string>("");
  const [violationReferenceTable, setViolationReferenceTable] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("MAD");
  const [legalBasis, setLegalBasis] = useState<string>("");
  const [justification, setJustification] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Get current user
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUser();
  }, []);

  // Load companies
  useEffect(() => {
    if (!user || permissionsLoading) return;

    async function fetchCompanies() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("rmm_list_companies", {
          user_id: user.id,
          page_number: 1,
          page_size: 1000,
        });

        if (!error && data) {
          const response = data as any;
          setCompanies(response.companies || []);
        }
      } catch {
        // Ignore errors
      }
    }

    fetchCompanies();
  }, [user, permissionsLoading]);

  // Check if user can create actions
  const canCreate = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
  ].includes(permissions.role as any);

  // Validate current step
  const validateStep = (step: WizardStep): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!companyId) {
        newErrors.companyId = "Company is required";
      }
    }

    if (step === 2) {
      if (!actionType) {
        newErrors.actionType = "Action type is required";
      }
      if (!violationType) {
        newErrors.violationType = "Violation type is required";
      }
      if (actionType === "fine" && (!amount || parseFloat(amount) <= 0)) {
        newErrors.amount = "Fine amount is required and must be greater than 0";
      }
    }

    if (step === 3) {
      if (!legalBasis.trim()) {
        newErrors.legalBasis = "Legal basis is required";
      }
      if (!justification.trim()) {
        newErrors.justification = "Justification is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => (prev + 1) as WizardStep);
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateStep(4) || !user || !canCreate) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("enforcement_create_action", {
        creator_user_id: user.id,
        company_id: companyId,
        action_type: actionType,
        violation_type: violationType,
        legal_basis: legalBasis.trim(),
        justification: justification.trim(),
        violation_reference_id: violationReferenceId || null,
        violation_reference_table: violationReferenceTable || null,
        amount: actionType === "fine" && amount ? parseFloat(amount) : null,
        currency: currency,
        notes: notes.trim() || null,
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      // Navigate to action detail page
      router.push(`/enforcement/actions/${(data as any).id}`);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Failed to create enforcement action" });
    } finally {
      setSubmitting(false);
    }
  };

  if (permissionsLoading) {
    return <div className="h-96 bg-gray-200 rounded animate-pulse" />;
  }

  if (!canCreate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/enforcement/actions" className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary">Create Enforcement Action</h1>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium">You don't have permission to create enforcement actions</p>
          <Link
            href="/enforcement/actions"
            className="inline-block mt-4 px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors"
          >
            Back to Actions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs and Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/enforcement/actions" className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/enforcement" className="hover:text-text-primary">Enforcement</Link>
              {" > "}
              <Link href="/enforcement/actions" className="hover:text-text-primary">Actions</Link>
              {" > New Action"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Create Enforcement Action</h1>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2",
                  currentStep >= step
                    ? "bg-primary-500 border-primary-500 text-white"
                    : "bg-bg-secondary border-border-default text-text-secondary"
                )}
              >
                {step}
              </div>
              <span className="text-xs mt-1 text-text-secondary">
                {step === 1 && "Company"}
                {step === 2 && "Action Details"}
                {step === 3 && "Legal Basis"}
                {step === 4 && "Review"}
              </span>
            </div>
            {step < 4 && (
              <div
                className={cn(
                  "w-full h-0.5 mx-2",
                  currentStep > step ? "bg-primary-500" : "bg-border-default"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Steps */}
      <form onSubmit={(e) => { e.preventDefault(); currentStep === 4 ? handleSubmit() : handleNext(); }} className="space-y-6">
        {/* Step 1: Company Selection */}
        {currentStep === 1 && (
          <div className="bg-bg-primary border border-border-default rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Select Company</h2>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Company <span className="text-error-500">*</span>
              </label>
              <select
                value={companyId}
                onChange={(e) => {
                  setCompanyId(e.target.value);
                  if (errors.companyId) setErrors({ ...errors, companyId: "" });
                }}
                className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {errors.companyId && <p className="mt-1 text-sm text-error-500">{errors.companyId}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Action Details */}
        {currentStep === 2 && (
          <div className="bg-bg-primary border border-border-default rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Action Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Action Type <span className="text-error-500">*</span>
              </label>
              <select
                value={actionType}
                onChange={(e) => {
                  setActionType(e.target.value);
                  if (actionType !== "fine") setAmount("");
                  if (errors.actionType) setErrors({ ...errors, actionType: "" });
                }}
                className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Action Type</option>
                {ACTION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.actionType && <p className="mt-1 text-sm text-error-500">{errors.actionType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Violation Type <span className="text-error-500">*</span>
              </label>
              <select
                value={violationType}
                onChange={(e) => {
                  setViolationType(e.target.value);
                  if (errors.violationType) setErrors({ ...errors, violationType: "" });
                }}
                className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Violation Type</option>
                {VIOLATION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.violationType && <p className="mt-1 text-sm text-error-500">{errors.violationType}</p>}
            </div>

            {actionType === "fine" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Amount <span className="text-error-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        if (errors.amount) setErrors({ ...errors, amount: "" });
                      }}
                      placeholder="0.00"
                      className="flex-1 px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="MAD">MAD</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                  {errors.amount && <p className="mt-1 text-sm text-error-500">{errors.amount}</p>}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Violation Reference ID (Optional)</label>
              <input
                type="text"
                value={violationReferenceId}
                onChange={(e) => setViolationReferenceId(e.target.value)}
                placeholder="Reference ID"
                className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Violation Reference Table (Optional)</label>
              <input
                type="text"
                value={violationReferenceTable}
                onChange={(e) => setViolationReferenceTable(e.target.value)}
                placeholder="e.g., breaches, compliance_scores"
                className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {/* Step 3: Legal Basis */}
        {currentStep === 3 && (
          <div className="bg-bg-primary border border-border-default rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Legal Basis & Justification</h2>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Legal Basis <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                value={legalBasis}
                onChange={(e) => {
                  setLegalBasis(e.target.value);
                  if (errors.legalBasis) setErrors({ ...errors, legalBasis: "" });
                }}
                placeholder="e.g., DMP Regulation Article 12, Section 3"
                className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.legalBasis && <p className="mt-1 text-sm text-error-500">{errors.legalBasis}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Justification <span className="text-error-500">*</span>
              </label>
              <textarea
                value={justification}
                onChange={(e) => {
                  setJustification(e.target.value);
                  if (errors.justification) setErrors({ ...errors, justification: "" });
                }}
                placeholder="Provide detailed justification for this enforcement action..."
                rows={6}
                className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.justification && <p className="mt-1 text-sm text-error-500">{errors.justification}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes (MOH only)..."
                rows={4}
                className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="bg-bg-primary border border-border-default rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">Review</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary">Company</label>
                <p className="text-text-primary font-medium">
                  {companies.find((c) => c.id === companyId)?.name || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Action Type</label>
                <p className="text-text-primary font-medium capitalize">{actionType}</p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Violation Type</label>
                <p className="text-text-primary">
                  {VIOLATION_TYPES.find((t) => t.value === violationType)?.label || "-"}
                </p>
              </div>
              {actionType === "fine" && amount && (
                <div>
                  <label className="text-sm text-text-secondary">Amount</label>
                  <p className="text-text-primary font-medium">
                    {amount} {currency}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm text-text-secondary">Legal Basis</label>
                <p className="text-text-primary">{legalBasis}</p>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Justification</label>
                <p className="text-text-primary">{justification}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-error-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <div className="flex gap-2">
            <Link
              href="/enforcement/actions"
              className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors"
            >
              Cancel
            </Link>
            {currentStep < 4 ? (
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {submitting ? "Creating..." : "Create Action"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
