# Glossary - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines key terms and concepts used throughout the PM project.

**Last Updated:** 2025-12-31

## Terms

### Core Concepts

**Sales (in PM context):** Refers exclusively to **quantities/units sold**, NOT financial values or prices. All sales data (AAMS, MSQ, XAMS) represents unit quantities, not monetary amounts. This is a stock sufficiency platform, not a financial system.

**AAMS (Annual Average Monthly Sales):** The average monthly **quantity of units sold** over a 12-month calendar year. Calculated by the company from their own sales records. Used to calculate VCI Thresholds. **Note:** This is quantity-based, not financial.

**MSQ (Monthly Sales Quantities):** Monthly submission of actual **quantities sold** for each SKU. Used for ECS XAMS calculations and anomaly detection. **Note:** This is quantity-based, not financial.

**WSL (Weekly Stock Levels):** Weekly submission of current **stock quantities** for each SKU. Compared against thresholds to detect breaches. **Note:** This is quantity-based, not financial.

**XAMS (X Months Average Monthly Sales):** Rolling average of monthly **sales quantities** over X months (default 6, configurable 3-12). Used to calculate ECS Thresholds. **Note:** This is quantity-based, not financial.

**Threshold:** Minimum stock **quantity** required for a SKU. Calculated as multiplier × AAMS (for VCI) or multiplier × XAMS (for ECS). Expressed in units, not currency.

**Breach:** When a SKU's stock level (quantity) falls below its applicable threshold (quantity).

**SKU (Stock Keeping Unit):** A unique product identifier that includes complete pharmaceutical specifications: product name, dosage/strength, pharmaceutical form, and pack size. SKUs contain all product details so that submissions (AAMS, MSQ, WSL) only need to reference **SKU_ID + Quantity**. Example: "Paracetamol 500mg Tablets 30-pack" is one SKU, while "Paracetamol 500mg Tablets 60-pack" is a different SKU.

**Value Chain:** The pharmaceutical supply chain from manufacturing to distribution, focusing on stock sufficiency and regulatory compliance (not financial performance).

### User Roles

**Company Admin:** Full company management capabilities, can submit registry updates for company information and products.

**Company Manager:** Product/SKU management, can manage products and SKUs.

**Company User:** View-only access with limited submission capabilities.

**MOH DMP Tier 1:** Approver/Admin role with full administrative capabilities.

**MOH DMP Tier 2 Officer:** Verification, analysis, and escalation role.

**MOH DMP Tier 2 Registrar:** Implementation of approved registry changes.

### Module Terms

**RMM (Registry Management Module):** Core module managing the authoritative registry of companies, products, SKUs, ATC codes, and critical medicines.

**VCI (Value Chain Intelligence):** Core module managing submissions (AAMS, MSQ, WSL), thresholds, and breach detection for stock sufficiency.

**ECS (Export Control System):** Optional module managing export authorization requests to protect national stock levels.

**CMC (Compliance Monitoring Center):** Optional module calculating compliance scores and managing disputes.

### Technical Terms

**RLS (Row Level Security):** PostgreSQL security feature enforcing data access at the row level.

**RPC (Remote Procedure Call):** Supabase database functions callable from the frontend.

**Edge Functions:** Serverless functions running on Supabase Edge (Deno runtime).

**Two-Person Rule:** Critical actions requiring approval from both Tier 1 and Tier 2 Officer before execution.

**Supabase:** Backend-as-a-Service platform providing PostgreSQL database, authentication, storage, and serverless functions.

---

**Note:** This glossary will be expanded as additional terms are identified during project development.

