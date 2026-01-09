# VCI Analytics Wireframes

**Purpose:** This directory contains wireframes for VCI Analytics module (treemap visualization for compliance violations).

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

This directory contains wireframes for the VCI Analytics treemap visualization. The treemap provides interactive visualization of stock level compliance violations by ATC therapeutic area, products, dosage forms, and SKUs.

## Wireframes

### Analytics (VCI Treemap)

- [x] **Task 0.5.3.22:** [ATC Treemap page](task-0.5.3.22-atc-treemap.md) (Level 1 - % total stock level compliance violations by therapeutic area/ATC code, clickable tiles, filters: critical medicines/date range)
- [x] **Task 0.5.3.23:** [Products Treemap page](task-0.5.3.23-products-treemap.md) (Level 2 - % total stock level compliance violations by product within selected ATC, drill-down from ATC, back navigation, breadcrumbs)
- [x] **Task 0.5.3.24:** [Dosage/Forms Modal](task-0.5.3.24-dosage-forms-modal.md) (Level 3 - table showing dosage/form with % compliance, expandable rows, modal overlay, no route change)
- [x] **Task 0.5.3.25:** [SKU List expanded view](task-0.5.3.25-sku-list-expanded.md) (Level 4 - SKUs with compliance violation status, external link icon indicating opens in new tab, info message, modal stays open)
- [x] **Task 0.5.3.27:** [SKU Action Page integration](task-0.5.3.27-sku-action-page-integration.md) (Level 5 - uses existing SKU detail route, opens in new tab, role-based actions for Tier 1/Tier 2, query params for back navigation)

## Navigation Flow

The treemap visualization follows a 5-level drill-down flow:

1. **Level 1 (ATC Treemap):** `/vci/treemap` - View compliance violations by therapeutic area
2. **Level 2 (Products Treemap):** `/vci/treemap?atc=J01` - View products within selected ATC code
3. **Level 3 (Dosage/Forms Modal):** Modal overlay - View dosage forms for selected product
4. **Level 4 (SKU List Expanded):** Modal overlay - View SKUs for selected dosage form
5. **Level 5 (SKU Action Page):** `/rmm/skus/[id]?back=treemap&atc=J01&product=amoxicillin` - Full SKU detail page with back navigation

## Related Documents

- [VCI Wireframes README](../README.md) - VCI wireframe overview
- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Analytics routes
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Treemap and visualization components
- [Historical Data Routing Proposal](../../../../02-architecture/frontend/historical-data-routing-proposal.md) - Historical data patterns

## Guidance

**Created with guidance from:**
- **Fatima (MOH Regulatory Requirements):** Compliance violation visualization critical for regulatory oversight. Product-level visibility enables targeted regulatory intervention. SKU-level visibility enables precise regulatory intervention.
- **Dr. Samir (Business Process Validation):** Supply chain visibility enables proactive compliance management. Product-level insights support supply chain optimization decisions. SKU-level insights support granular supply chain management.

---

**Status:** ✅ Complete  
**Created:** 2025-01-15  
**Last Updated:** 2025-01-15

