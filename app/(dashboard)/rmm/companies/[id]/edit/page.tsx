/**
 * Wireframe: task-0.5.2.8-company-create-edit-form.md
 * Route: /rmm/companies/[id]/edit
 * Implements: Edit company form
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.8-company-create-edit-form.md
 * 
 * Database: companies table
 * RPC Functions: rmm_get_company(user_id, company_id), rmm_update_company(updater_user_id, company_id, name, registration_number, company_type, address, contact_email, contact_phone, create_submission)
 * 
 * Features:
 * - Edit existing company
 * - Form validation
 * - Role-based access control
 * - Company type read-only (cannot change after creation)
 * - Responsive design
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserPermissions } from "@/lib/hooks/use-user-permissions";
import { ROLES } from "@/lib/constants/roles";
import { ArrowLeft, Save } from "lucide-react";

interface Company {
  id: string;
  name: string;
  registration_number: string;
  company_type: string;
  address: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function EditCompanyPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  
  // Form state
  const [company, setCompany] = useState<Company | null>(null);
  const [name, setName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [address, setAddress] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isActive, setIsActive] = useState(true);
  
  // Loading and error state
  const [loading, setLoading] = useState(true);
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

  // Load company data
  useEffect(() => {
    if (!user || !companyId || permissionsLoading) return;

    async function fetchCompany() {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error: rpcError } = await supabase.rpc("rmm_get_company", {
          user_id: user.id,
          company_id: companyId,
        });

        if (rpcError) {
          throw new Error(rpcError.message);
        }

        const companyData = data as Company;
        setCompany(companyData);
        setName(companyData.name);
        setRegistrationNumber(companyData.registration_number);
        setAddress(companyData.address || "");
        setContactEmail(companyData.contact_email || "");
        setContactPhone(companyData.contact_phone || "");
        setIsActive(companyData.is_active);
      } catch (err) {
        setErrors({ fetch: err instanceof Error ? err.message : "Failed to load company" });
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [user, companyId, permissionsLoading]);

  // Check if user can edit
  const canEdit = permissions?.role && [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.SYSTEM_ADMIN,
  ].includes(permissions.role as any);

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Company name is required";
    } else if (name.trim().length < 2 || name.trim().length > 200) {
      newErrors.name = "Company name must be between 2 and 200 characters";
    }

    if (!registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required";
    }

    if (!contactEmail.trim() && !contactPhone.trim()) {
      newErrors.contact = "At least one contact method (Email OR Phone) is required";
    }

    if (contactEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      newErrors.contactEmail = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate() || !user || !canEdit || !company) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("rmm_update_company", {
        updater_user_id: user.id,
        company_id: companyId,
        name: name.trim() !== company.name ? name.trim() : null,
        registration_number: registrationNumber.trim() !== company.registration_number ? registrationNumber.trim() : null,
        address: address.trim() !== (company.address || "") ? address.trim() || null : null,
        contact_email: contactEmail.trim() !== (company.contact_email || "") ? contactEmail.trim() || null : null,
        contact_phone: contactPhone.trim() !== (company.contact_phone || "") ? contactPhone.trim() || null : null,
        create_submission: true,
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      // Navigate to company detail page
      router.push(`/rmm/companies/${companyId}`);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Failed to update company" });
    } finally {
      setSubmitting(false);
    }
  };

  if (permissionsLoading || loading) {
    return <div className="h-96 bg-gray-200 rounded animate-pulse" />;
  }

  if (errors.fetch || !company) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/rmm/companies/${companyId}`} className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary">Edit Company</h1>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium mb-2">
            {errors.fetch || "Company not found"}
          </p>
          <Link
            href={`/rmm/companies/${companyId}`}
            className="inline-block mt-4 px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors"
          >
            Back to Company
          </Link>
        </div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/rmm/companies/${companyId}`} className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary">Edit Company</h1>
        </div>
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <p className="text-error-600 font-medium">You don't have permission to edit companies</p>
          <Link
            href={`/rmm/companies/${companyId}`}
            className="inline-block mt-4 px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors"
          >
            Back to Company
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
          <Link href={`/rmm/companies/${companyId}`} className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/dashboard" className="hover:text-text-primary">Home</Link>
              {" > "}
              <Link href="/rmm" className="hover:text-text-primary">RMM</Link>
              {" > "}
              <Link href="/rmm/companies" className="hover:text-text-primary">Companies</Link>
              {" > "}
              <Link href={`/rmm/companies/${companyId}`} className="hover:text-text-primary">
                {company.name}
              </Link>
              {" > Edit"}
            </nav>
            <h1 className="text-2xl font-semibold text-text-primary">Edit Company</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Company Information</h2>
          
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Company Name <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              placeholder="Enter company name..."
              className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.name && <p className="mt-1 text-sm text-error-500">{errors.name}</p>}
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Registration Number <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => {
                setRegistrationNumber(e.target.value);
                if (errors.registrationNumber) setErrors({ ...errors, registrationNumber: "" });
              }}
              placeholder="REG-2024-001"
              className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
            />
            {errors.registrationNumber && (
              <p className="mt-1 text-sm text-error-500">{errors.registrationNumber}</p>
            )}
          </div>

          {/* Company Type (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Company Type
            </label>
            <div className="px-3 py-2 bg-bg-secondary border border-border-default rounded-md text-text-primary">
              {company.company_type === "ipc" ? "IPC (Industrial Pharmaceutical Company)" : "Wholesaler"}
            </div>
            <p className="mt-1 text-xs text-text-secondary">
              ℹ️ Company type cannot be changed after creation.
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-border-default"
              />
              <span className="text-sm text-text-primary">Active</span>
            </label>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-bg-primary border border-border-default rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Contact Information</h2>
          
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter company address..."
              rows={3}
              className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => {
                setContactEmail(e.target.value);
                if (errors.contactEmail) setErrors({ ...errors, contactEmail: "" });
                if (errors.contact) setErrors({ ...errors, contact: "" });
              }}
              placeholder="contact@company.ma"
              className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.contactEmail && <p className="mt-1 text-sm text-error-500">{errors.contactEmail}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Phone</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => {
                setContactPhone(e.target.value);
                if (errors.contact) setErrors({ ...errors, contact: "" });
              }}
              placeholder="+212 5XX XXX XXX"
              className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {errors.contact && <p className="text-sm text-error-500">{errors.contact}</p>}
          <p className="text-xs text-text-secondary">
            ℹ️ At least one contact method (Email OR Phone) is required for regulatory communications
          </p>
        </div>

        {/* Metadata (Display Only) */}
        <div className="bg-bg-secondary border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Created At: </span>
              <span className="text-text-primary">
                {new Date(company.created_at).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Last Updated: </span>
              <span className="text-text-primary">
                {new Date(company.updated_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-error-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href={`/rmm/companies/${companyId}`}
            className="px-4 py-2 border border-border-default rounded-md hover:bg-bg-secondary transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {submitting ? "Updating..." : "Update Company"}
          </button>
        </div>
      </form>
    </div>
  );
}
