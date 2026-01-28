"use client";

/**
 * Wireframe: task-0.5.1.38-faq-page.md
 * FAQ search, category filters, expandable Q&A. Client-only interactivity.
 */

import { useMemo, useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

type Category = "all" | "getting-started" | "account" | "submissions" | "compliance" | "export" | "general";

type FAQItem = {
  id: string;
  category: Category;
  question: string;
  answer: string;
};

const FAQ_DATA: FAQItem[] = [
  {
    id: "q1",
    category: "getting-started",
    question: "What is the PM platform?",
    answer:
      "The PM platform is a regulatory governance system that supports the Ministry of Health's mission to ensure medicine availability and compliance across the pharmaceutical value chain. Companies use it to manage registrations, monitor stock levels, and coordinate export controls.",
  },
  {
    id: "q2",
    category: "getting-started",
    question: "How do I register?",
    answer:
      'To register, click "Register" on the homepage and fill out the company registration form. You will need your company details, contact information, and supporting documentation. Once submitted, MOH will review and approve your account.',
  },
  {
    id: "q3",
    category: "account",
    question: "How do I reset my password?",
    answer:
      'Click "Forgot Password" on the login page and follow the instructions. You will receive an email with a link to reset your password. The link expires after a short period for security.',
  },
  {
    id: "q4",
    category: "account",
    question: "How do I update my company info?",
    answer:
      "Navigate to your company profile from the dashboard (or Account settings). Edit the relevant fields and save. Some changes may require MOH approval before they take effect.",
  },
  {
    id: "q5",
    category: "submissions",
    question: "How do I submit a product?",
    answer:
      "To submit a product for registration, go to Registry Management (RMM) from the dashboard. Create a new product submission, complete the required fields, attach supporting documents, and submit. You can track status in your submissions list.",
  },
  {
    id: "q6",
    category: "compliance",
    question: "What are AAMS, MSQ, and WSL?",
    answer:
      "AAMS (Annual), MSQ (Monthly), and WSL (Weekly) are stock level reporting requirements under the compliance monitoring (VCI) module. Companies must report inventory according to the schedule. See the Documentation section for detailed guides.",
  },
  {
    id: "q7",
    category: "export",
    question: "How does export control work?",
    answer:
      "The Export Control (ECS) module manages export authorizations and replenishment tracking. You must request authorization before exporting regulated products. The system tracks approvals and ensures domestic availability requirements are met.",
  },
  {
    id: "q8",
    category: "general",
    question: "Where can I find user guides?",
    answer:
      "Visit the Documentation page under Support for user guides, workflow guides, and API documentation. Quick links are also available on the Support Center homepage.",
  },
];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "getting-started", label: "Getting Started" },
  { value: "account", label: "Account Management" },
  { value: "submissions", label: "Submissions" },
  { value: "compliance", label: "Compliance" },
  { value: "export", label: "Export Control" },
  { value: "general", label: "General" },
];

function AccordionItem({
  id,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const aid = `faq-${id}`;
  return (
    <div className="border-b border-[#e5e7eb] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-4 text-left focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
        aria-expanded={isOpen}
        aria-controls={`${aid}-answer`}
        id={`${aid}-question`}
      >
        <span className="text-base font-medium text-[#111827]">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-[#6b7280]" aria-hidden />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-[#6b7280]" aria-hidden />
        )}
      </button>
      <div
        id={`${aid}-answer`}
        role="region"
        aria-labelledby={`${aid}-question`}
        hidden={!isOpen}
        className="pb-4"
      >
        <p className="text-sm leading-[1.6] text-[#4b5563]">{answer}</p>
      </div>
    </div>
  );
}

export function FAQContent() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set([FAQ_DATA[0]?.id ?? ""]));

  const filtered = useMemo(() => {
    let list = FAQ_DATA;
    if (category !== "all") {
      list = list.filter((i) => i.category === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (i) =>
          i.question.toLowerCase().includes(q) || i.answer.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, category]);

  const byCategory = useMemo(() => {
    const map = new Map<Category, FAQItem[]>();
    for (const item of filtered) {
      const arr = map.get(item.category) ?? [];
      arr.push(item);
      map.set(item.category, arr);
    }
    return map;
  }, [filtered]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mt-8 flex flex-col gap-8 lg:flex-row">
      {/* Search */}
      <div className="w-full lg:hidden">
        <div className="relative">
          <input
            type="search"
            placeholder="Search FAQ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-md border border-[#e5e7eb] bg-white px-4 pr-10 text-base text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-0"
            aria-label="Search FAQ"
          />
          <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b7280]" aria-hidden />
        </div>
      </div>

      {/* Sidebar filters */}
      <aside className="w-full shrink-0 lg:w-[240px]">
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-4">
          <div className="hidden lg:block">
            <div className="relative mb-4">
              <input
                type="search"
                placeholder="Search FAQ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-md border border-[#e5e7eb] bg-white px-4 pr-10 text-base text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-0"
                aria-label="Search FAQ"
              />
              <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b7280]" aria-hidden />
            </div>
          </div>
          <p className="mb-2 text-sm font-semibold text-[#111827]">Category</p>
          <div className="space-y-2">
            {CATEGORIES.map(({ value, label }) => (
              <label key={value} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="faq-category"
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

      {/* FAQ list */}
      <div className="min-w-0 flex-1">
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#111827]">FAQ Questions</h2>
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="mx-auto h-10 w-10 text-[#9ca3af]" aria-hidden />
              <p className="mt-4 text-[#4b5563]">No questions found matching your search.</p>
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
            <div className="space-y-6">
              {Array.from(byCategory.entries()).map(([cat, items]) => (
                <div key={cat} id={cat} className="scroll-mt-4">
                  <h3 className="mb-2 text-lg font-semibold text-[#111827]">
                    {CATEGORIES.find((c) => c.value === cat)?.label ?? cat}
                  </h3>
                  <div className="space-y-0">
                    {items.map((item) => (
                      <AccordionItem
                        key={item.id}
                        id={item.id}
                        question={item.question}
                        answer={item.answer}
                        isOpen={expanded.has(item.id)}
                        onToggle={() => toggle(item.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
