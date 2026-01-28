"use client";

/**
 * Wireframe: task-0.5.1.40-documentation.md
 * Search, category filters, expandable doc sections, quick links.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

type Category = "all" | "getting-started" | "user-guides" | "workflow" | "compliance" | "api" | "reference";

type DocItem = {
  id: string;
  category: Category;
  title: string;
  href: string;
};

const DOC_SECTIONS: { category: Category; label: string; items: Omit<DocItem, "category">[] }[] = [
  {
    category: "getting-started",
    label: "Getting Started",
    items: [
      { id: "gs1", title: "Platform Overview", href: "/support/documentation#getting-started" },
      { id: "gs2", title: "Registration Guide", href: "/support/documentation#getting-started" },
      { id: "gs3", title: "First Steps", href: "/support/documentation#getting-started" },
    ],
  },
  {
    category: "user-guides",
    label: "User Guides",
    items: [
      { id: "ug1", title: "Company Dashboard", href: "/support/documentation#user-guides" },
      { id: "ug2", title: "Product Registration", href: "/support/documentation#user-guides" },
      { id: "ug3", title: "Submission Workflows", href: "/support/documentation#user-guides" },
      { id: "ug4", title: "Compliance Reporting", href: "/support/documentation#user-guides" },
      { id: "ug5", title: "Export Control", href: "/support/documentation#user-guides" },
    ],
  },
  {
    category: "workflow",
    label: "Workflow Guides",
    items: [
      { id: "wf1", title: "Registry Submission Process", href: "/support/documentation#workflow" },
      { id: "wf2", title: "AAMS Submission Guide", href: "/support/documentation#workflow" },
      { id: "wf3", title: "WSL Submission Guide", href: "/support/documentation#workflow" },
      { id: "wf4", title: "MSQ Submission Guide", href: "/support/documentation#workflow" },
    ],
  },
  {
    category: "compliance",
    label: "Compliance Guides",
    items: [
      { id: "cg1", title: "Compliance Scoring", href: "/support/documentation#compliance" },
      { id: "cg2", title: "Dispute Resolution", href: "/support/documentation#compliance" },
      { id: "cg3", title: "Enforcement Actions", href: "/support/documentation#compliance" },
    ],
  },
  {
    category: "api",
    label: "API Documentation",
    items: [
      { id: "api1", title: "API Overview", href: "/support/documentation#api" },
      { id: "api2", title: "Authentication", href: "/support/documentation#api" },
      { id: "api3", title: "Endpoints Reference", href: "/support/documentation#api" },
      { id: "api4", title: "Rate Limits", href: "/support/documentation#api" },
    ],
  },
];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "getting-started", label: "Getting Started" },
  { value: "user-guides", label: "User Guides" },
  { value: "workflow", label: "Workflow Guides" },
  { value: "compliance", label: "Compliance Guides" },
  { value: "api", label: "API Docs" },
  { value: "reference", label: "Reference" },
];

const QUICK_LINKS = [
  { label: "Download PDF Guide", href: "/support/documentation#quick-links" },
  { label: "API Documentation", href: "/support/documentation#api" },
  { label: "Video Tutorials", href: "/support/documentation#quick-links" },
  { label: "Release Notes", href: "/support/documentation#quick-links" },
] as const;

function SectionBlock({
  section,
  categoryFilter,
  search,
  expanded,
  onToggle,
}: {
  section: (typeof DOC_SECTIONS)[number];
  categoryFilter: Category;
  search: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const filtered = useMemo(() => {
    if (categoryFilter !== "all" && categoryFilter !== section.category) return [];
    const q = search.trim().toLowerCase();
    if (!q) return section.items;
    return section.items.filter((i) => i.title.toLowerCase().includes(q));
  }, [section, categoryFilter, search]);

  if (filtered.length === 0) return null;

  return (
    <div id={section.category} className="mb-6 scroll-mt-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-2 text-left focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
        aria-expanded={expanded}
      >
        <span className="text-lg font-semibold text-[#111827]">{section.label}</span>
        {expanded ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-[#6b7280]" aria-hidden />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-[#6b7280]" aria-hidden />
        )}
      </button>
      {expanded && (
        <ul className="mt-2 space-y-2 pl-2">
          {filtered.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="text-base font-medium text-[#2563eb] hover:underline focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function DocumentationContent() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(DOC_SECTIONS.map((s) => s.category))
  );

  const toggle = (cat: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const hasResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    for (const section of DOC_SECTIONS) {
      if (category !== "all" && category !== section.category) continue;
      const items = q
        ? section.items.filter((i) => i.title.toLowerCase().includes(q))
        : section.items;
      if (items.length) return true;
    }
    return false;
  }, [search, category]);

  return (
    <div className="mt-8 space-y-8">
      {/* Search */}
      <div className="relative">
        <input
          type="search"
          placeholder="Search documentation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-md border border-[#e5e7eb] bg-white px-4 pr-10 text-base text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-0"
          aria-label="Search documentation"
        />
        <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b7280]" aria-hidden />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-[240px]">
          <div className="rounded-lg border border-[#e5e7eb] bg-white p-4">
            <p className="mb-2 text-sm font-semibold text-[#111827]">Category</p>
            <div className="space-y-2">
              {CATEGORIES.map(({ value, label }) => (
                <label key={value} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="doc-category"
                    checked={category === value}
                    onChange={() => setCategory(value)}
                    className="h-4 w-4 border-[#e5e7eb] text-[#3b82f6] focus:ring-[#3b82f6]"
                  />
                  <span className="text-sm text-[#4b5563]">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Doc list */}
        <div className="min-w-0 flex-1">
          <div className="rounded-lg border border-[#e5e7eb] bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-[#111827]">Documentation Sections</h2>
            {!hasResults ? (
              <div className="py-12 text-center text-[#4b5563]">
                <p>No documents found matching your search.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                  }}
                  className="mt-4 text-sm font-medium text-[#2563eb] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div>
                {DOC_SECTIONS.map((section) => (
                  <SectionBlock
                    key={section.category}
                    section={section}
                    categoryFilter={category}
                    search={search}
                    expanded={expanded.has(section.category)}
                    onToggle={() => toggle(section.category)}
                  />
                ))}
                <Link
                  href="/support/documentation#api"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#2563eb] hover:underline"
                >
                  View Full API Docs →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <section
        className="rounded-lg border border-[#3b82f6] bg-[#eff6ff] p-8"
        aria-labelledby="doc-quick-links-heading"
        id="quick-links"
      >
        <h2 id="doc-quick-links-heading" className="mb-4 text-[24px] font-semibold text-[#111827]">
          Quick Links
        </h2>
        <ul className="space-y-2">
          {QUICK_LINKS.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="text-base text-[#2563eb] hover:underline focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
