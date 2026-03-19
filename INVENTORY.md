# Hospital Non-Medical Inventory Management — Research & System Design

## Research: 5 Examples of Non-Medical Inventory Tracked in Hospitals

### 1. Facilities & Infrastructure (Buildings, Floors, Wings)

Hospitals manage large physical campuses. Tracking buildings, floors, and wings is the top-level of asset hierarchy.

**What is tracked:**

- Building name, address, type (main hospital, outpatient clinic, admin building, warehouse)
- Total floors, year built, total area (sq ft / m²)
- Occupancy status, regulatory inspection dates
- Utility systems per building (HVAC, electrical, plumbing, fire suppression)

**Real-world example:** The U.S. Defense Medical Logistics Standard Support – Facilities Management (DMLSS-FM) system tracks every building, floor, and functional area across military hospitals using a hierarchical registry.

**Source:** [health.mil — DMLSS-FM Volume 4](https://health.mil/-/media/Files/MHS/Policy-Files/Defense-Medical-Logistics-Standard-SupportFacilities-Management-DMLSSFM--Volume-4-Facility-Systems-Inventor-Module.ashx)

---

### 2. Rooms & Spaces

Every room in a hospital serves a purpose — from operating theaters to janitorial closets. Room tracking enables space utilization analysis, maintenance scheduling, and compliance.

**What is tracked:**

- Room number, floor, building assignment
- Room type/category (office, storage, server room, conference room, break room, mechanical room, restroom)
- Capacity, square footage
- Current status (available, occupied, under maintenance, decommissioned)
- Assigned department

**Real-world example:** Oregon Health & Science University (OHSU) uses a standardized Room Type Definitions system with numeric coding for each room category (e.g., 011 = Shipping/Receiving, 012 = Janitorial, 013 = Garbage).

**Source:** [OHSU Room Type Definitions](https://www.ohsu.edu/sites/default/files/2023-03/Room%20Type%20Definitions.pdf)

---

### 3. Equipment & Fixed Assets (Non-Medical)

Non-clinical equipment is the backbone of hospital operations: IT hardware, furniture, kitchen appliances, cleaning machines, security systems, and more.

**What is tracked:**

- Asset tag / barcode / serial number
- Category (IT, furniture, kitchen, cleaning, security, HVAC, electrical)
- Location (building → room assignment)
- Purchase date, warranty expiry, purchase cost, current value (depreciation)
- Status (active, in repair, retired, disposed)
- Assigned department or person
- Maintenance schedule and history

**Real-world example:** EZOfficeInventory is used by hospitals to track non-medical equipment with barcode/QR scanning, check-in/check-out workflows, and recurring maintenance schedules.

**Source:** [MedicoReach — Best Inventory Management Software for Healthcare](https://www.medicoreach.com/medical-inventory-software/)

---

### 4. Office & Facility Supplies (Consumables)

Unlike fixed assets, consumable supplies are tracked by quantity and reorder level — pens, paper, cleaning chemicals, cafeteria supplies, printer cartridges, linens, etc.

**What is tracked:**

- Item name, SKU, category (stationery, cleaning, cafeteria, laundry, bathroom)
- Current stock quantity, reorder level, unit of measure
- Unit cost, supplier
- Storage location (building/room)
- Last restocked date

**Real-world example:** Sortly is used by hospital facilities teams to visually manage office and cleaning supply inventory with low-stock alerts and mobile scanning.

**Source:** [MedAssistantJobs — Top 30 Medical Inventory Management Software](https://medassistantjobs.com/top-30-best-medical-inventory-management-software-solutions/)

---

### 5. Maintenance & Work Orders

Tracking maintenance activities across all assets is critical for compliance (Joint Commission, NFPA), cost control, and asset longevity.

**What is tracked:**

- Work order number, asset reference, room/building location
- Type (preventive, corrective, emergency, inspection)
- Priority (low, medium, high, critical)
- Status (open, in progress, completed, cancelled)
- Assigned technician, scheduled date, completion date
- Cost of maintenance, parts used
- Notes and resolution details

**Real-world example:** Limble CMMS is deployed in hospitals to automate preventive maintenance scheduling for HVAC, elevators, generators, and general infrastructure with full audit trails.

**Source:** [OxMaint — Hospital Maintenance Management System Guide](https://oxmaint.com/industries/healthcare/hospital-maintenance-management-system-complete-healthcare-guide-2026)

---

## System Design Decision

### Chosen Architecture: **Hierarchical Asset Registry with Maintenance Tracking**

After reviewing all 5 categories, the best system design for AfroMed's non-pharmacy inventory combines **three core modules** in a single tabbed page:

| Tab | Purpose | Key Entity |
|-----|---------|------------|
| **Assets** | Track all non-medical physical items (equipment, furniture, IT, supplies) | `InventoryItem` |
| **Rooms** | Track rooms/spaces across hospital buildings | `InventoryRoom` |
| **Maintenance Log** | Record and track maintenance work on assets and facilities | `MaintenanceLog` |

### Why This Design?

1. **Unified asset view**: Instead of separate pages for buildings, equipment, and supplies, a single "Inventory" page with tabs keeps related data together — matching the existing Laboratory and Billing page patterns in AfroMed.

2. **Category-based filtering**: Assets use a `category` field to distinguish between equipment types (IT, furniture, kitchen, cleaning, HVAC, security, office supplies, other). This avoids separate tables while allowing powerful filtering.

3. **Location hierarchy**: Each asset links to a room, and each room links to a building + floor. This `Asset → Room → Building` hierarchy enables location-based tracking without over-engineering.

4. **Maintenance log**: A dedicated maintenance tab captures work orders for any asset, enabling preventive maintenance scheduling and audit compliance.

5. **Consistent with AfroMed patterns**: The design mirrors the Laboratory page (3 tabs: Orders, Results, Catalog) and uses the same SWR hooks, MUI table, and stat card patterns.

### Data Model Overview

```
InventoryItem (Asset)
├── id, name, category, assetTag, serialNumber
├── location (building, floor, roomNumber)
├── status (active | in_repair | retired | disposed)
├── condition (excellent | good | fair | poor)
├── purchaseDate, purchaseCost, warrantyExpiry
├── assignedDepartment, assignedTo
└── notes, createdAt, updatedAt

InventoryRoom
├── id, roomNumber, name, building, floor
├── roomType (office | storage | server_room | conference | ...)
├── capacity, areaSqFt
├── status (available | occupied | maintenance | decommissioned)
├── department
└── notes, createdAt, updatedAt

MaintenanceLog
├── id, assetId, assetName
├── type (preventive | corrective | emergency | inspection)
├── priority (low | medium | high | critical)
├── status (open | in_progress | completed | cancelled)
├── assignedTo, scheduledDate, completedDate
├── cost, description, resolution
└── createdAt, updatedAt

InventoryStats
├── totalAssets, activeAssets, inRepair, retired
├── totalRooms, availableRooms
└── openWorkOrders, completedWorkOrders
```

### References

- [Infraon — Hospital Asset Management System Guide 2025](https://infraon.io/blog/hospital-asset-management-system/)
- [RuyaCompliance — Hospital Inventory Management](https://www.ruyacompliance.com/blog/hospital-inventory-management)
- [ScienceInsights — What Is Inventory in Healthcare](https://scienceinsights.org/what-is-inventory-in-healthcare-and-why-it-matters/)
- [ASHE — Health Care FM Data Nomenclature Standards](https://www.ashe.org/HFDS_sheet)
- [Camcode — Healthcare Asset Tracking Best Practices](https://www.camcode.com/blog/best-practices-for-healthcare-asset-tracking/)
- [Facilio — Healthcare Asset Tracking Systems Guide](https://facilio.com/blog/healthcare-asset-tracking-system/)
- [openMAINT — Open Source CMMS](https://www.openmaint.org/en)
