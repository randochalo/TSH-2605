# TSH-2605: Support IT System - Product Requirements Document (PRD)

**Tender Reference:** MMFSB/TD 02/2026  
**Agency:** Multimodal Freight Sdn Bhd (MMF)  
**System:** Support IT System (EMS, PS, HRMS)  
**Vendor:** Sinergi Elit Sdn Bhd (SESB)  
**Version:** 1.0  
**Date:** 31 January 2026  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview & Architecture](#2-system-overview--architecture)
3. [Module Specifications](#3-module-specifications)
   - 3.1 Equipment Management System (EMS)
   - 3.2 Procurement System (PS)
   - 3.3 Human Resource Management System (HRMS)
4. [Integration Requirements](#4-integration-requirements)
5. [Security & Compliance](#5-security--compliance)
6. [User Stories by Module](#6-user-stories-by-module)
7. [Technical Stack](#7-technical-stack)
8. [Deployment Model](#8-deployment-model)
9. [Success Metrics](#9-success-metrics)
10. [Definition of Done](#10-definition-of-done)

---

## 1. Executive Summary

### 1.1 Project Overview

TSH-2605 is a comprehensive Support IT System procurement for Multimodal Freight Sdn Bhd (MMF), comprising three integrated modules designed to modernize and streamline MMF's operational support functions across all six branches.

### 1.2 System Scope

| Module | Features | Primary Users | Business Value |
|--------|----------|---------------|----------------|
| **Equipment Management System (EMS)** | 12 | Fleet Managers, Maintenance Teams, Technicians | Optimize asset lifecycle, reduce downtime, control maintenance costs |
| **Procurement System (PS)** | 13 | Procurement Officers, Finance, Department Heads | Streamline purchasing, enforce compliance, reduce procurement costs |
| **HR Management System (HRMS)** | 12 | HR Team, Managers, All Employees | Automate HR processes, improve employee experience, ensure compliance |
| **TOTAL** | **37** | **500+ users across 6 branches** | **End-to-end operational efficiency** |

### 1.3 Key Value Propositions

- **Accelerated Deployment**: 8-10 week go-live timeline vs. industry standard 6-9 months
- **Production-Ready**: 95% of requirements already engineered, tested, and deployed
- **Zero Risk**: Zero critical/high VAPT findings with CREST-accredited penetration testing
- **Value Beyond Price**: RM 2.78 Million in Value-Added Services at no additional cost
- **Sovereign Cloud**: Awan Kita compliant deployment with 99.9% uptime SLA

### 1.4 Target Outcomes

| Metric | Target | Measurement |
|--------|--------|-------------|
| System Uptime | 99.9% | Monitoring dashboard |
| UAT Pass Rate | 98%+ | Test execution reports |
| User Adoption | 90%+ | Login analytics |
| Procurement Cost Savings | 8-12% | Spend analysis reports |
| Maintenance Cost Reduction | 15-20% | TCO analytics |
| HR Process Efficiency | 40-60% | Process cycle time |

---

## 2. System Overview & Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         TSH-2605 SUPPORT IT SYSTEM                       │
│                         LogisticsPro Suite v4.2                         │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                     │
│  │    EMS      │  │     PS      │  │    HRMS     │                     │
│  │  Equipment  │  │ Procurement │  │     HR      │                     │
│  │ Management  │  │   System    │  │ Management  │                     │
│  │   12 Feat   │  │   13 Feat   │  │   12 Feat   │                     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                     │
│         │                │                │                             │
│         └────────────────┼────────────────┘                             │
│                          │                                              │
│              ┌───────────┴───────────┐                                 │
│              │   Integration Layer   │                                 │
│              │     (API Gateway)     │                                 │
│              └───────────┬───────────┘                                 │
│                          │                                              │
│  ┌───────────────────────┼───────────────────────┐                     │
│  │                       │                       │                     │
│  ▼                       ▼                       ▼                     │
│ ┌─────────┐         ┌─────────┐           ┌─────────┐                  │
│ │  HMS    │◄───────►│   FMS   │◄─────────►│   All   │                  │
│ │TSH-2604 │         │TSH-2604 │           │ Systems │                  │
│ └─────────┘         └─────────┘           └─────────┘                  │
│     │                    │                    │                        │
│     └────────────────────┴────────────────────┘                        │
│                          │                                             │
│              ┌───────────┴───────────┐                                │
│              │   Awan Kita Cloud     │                                │
│              │  Sovereign Infrastructure│                               │
│              └───────────────────────┘                                │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                               │
├─────────────────────────────────────────────────────────────────────────┤
│  Web Application (React/Vue)  │  Mobile App (PWA/iOS/Android)            │
│  ├─ Desktop Responsive         │  ├─ Offline-First Capability              │
│  ├─ Tablet Optimized           │  ├─ Push Notifications                    │
│  └─ Role-Based Dashboards      │  └─ Biometric/GPS Features                │
├─────────────────────────────────────────────────────────────────────────┤
│                         APPLICATION LAYER                                │
├─────────────────────────────────────────────────────────────────────────┤
│  EMS Module    │  PS Module      │  HRMS Module    │  Shared Services   │
│  ├─ Assets     │  ├─ Requisitions│  ├─ Employees   │  ├─ Authentication │
│  ├─ Maintenance│  ├─ Vendors     │  ├─ Payroll     │  ├─ Authorization  │
│  ├─ Repairs    │  ├─ PO/GRN      │  ├─ Leave       │  ├─ Audit Trail    │
│  ├─ Depreciation│  ├─ Invoicing  │  ├─ Claims      │  ├─ Notifications  │
│  ├─ Warranty   │  ├─ Analytics   │  ├─ Performance │  ├─ Reporting      │
│  └─ Inventory  │  └─ Budget      │  └─ Training    │  └─ Integration    │
├─────────────────────────────────────────────────────────────────────────┤
│                         INTEGRATION LAYER                                │
├─────────────────────────────────────────────────────────────────────────┤
│  API Gateway  │  Message Queue  │  ETL Engine  │  External Connectors   │
│  ├─ REST/GraphQL│  ├─ RabbitMQ   │  ├─ Data Sync │  ├─ MyDigitalID       │
│  ├─ Rate Limiting│  ├─ Event Bus  │  ├─ Batch     │  ├─ IRBM e-Invoice    │
│  └─ OAuth 2.0  │  └─ Webhooks    │  └─ Real-time │  └─ Bank APIs         │
├─────────────────────────────────────────────────────────────────────────┤
│                         DATA LAYER                                       │
├─────────────────────────────────────────────────────────────────────────┤
│  PostgreSQL (Primary)  │  Redis (Cache)  │  Document Store  │  File Store│
│  ├─ Transactional      │  ├─ Session     │  ├─ JSON Docs    │  ├─ Receipts│
│  ├─ Relational         │  ├─ Cache       │  ├─ Audit Logs   │  ├─ Reports │
│  └─ Multi-tenant       │  └─ Queue       │  └─ Attachments  │  └─ Backups │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Deployment Architecture

```
                    ┌─────────────────┐
                    │   Internet      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Cloudflare     │
                    │  WAF + CDN      │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼───────┐   ┌────────▼────────┐   ┌──────▼──────┐
│   Branch 1    │   │   Branch 2-N    │   │    HQ       │
│   (Users)     │   │    (Users)      │   │   (Users)   │
└───────┬───────┘   └────────┬────────┘   └──────┬──────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │      Awan Kita Cloud        │
              │    Sovereign Infrastructure │
              ├─────────────────────────────┤
              │  ┌─────────────────────┐    │
              │  │   Load Balancer     │    │
              │  │   (HAProxy/NGINX)   │    │
              │  └──────────┬──────────┘    │
              │             │               │
              │  ┌──────────┴──────────┐    │
              │  │   Kubernetes        │    │
              │  │   ┌─────┬─────┐     │    │
              │  │   │ Pod │ Pod │     │    │
              │  │   └─────┴─────┘     │    │
              │  └──────────┬──────────┘    │
              │             │               │
              │  ┌──────────┴──────────┐    │
              │  │   Database Cluster  │    │
              │  │  (PostgreSQL Patroni)│   │
              │  └─────────────────────┘    │
              └─────────────────────────────┘
```

---

## 3. Module Specifications

### 3.1 Equipment Management System (EMS)

#### Module Overview
EMS provides comprehensive lifecycle management for MMF's equipment fleet including prime movers, trailers, forklifts, cranes, and container handling equipment across all 6 branches.

---

#### Feature 1: Asset Register & Tracking

**Description:**  
Centralized asset registry with unique identification, real-time location tracking, and complete custody chain management for all MMF equipment.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| EMS-001-A | System shall support unique asset ID generation with configurable numbering schemes | Must |
| EMS-001-B | System shall support QR code, barcode, and RFID tagging for all asset types | Must |
| EMS-001-C | System shall display real-time asset location and current assignment | Must |
| EMS-001-D | System shall maintain complete custody chain history | Must |
| EMS-001-E | System shall support asset search by ID, type, location, status, or custodian | Must |
| EMS-001-F | System shall provide asset photo capture and document attachment | Should |
| EMS-001-G | System shall support bulk asset import via CSV/Excel | Should |

**Value-Add Enhancement:**
- **IoT Sensor Integration**: Real-time monitoring of equipment health metrics (engine temperature, hydraulic pressure, brake wear)
- **Asset Performance Scoring**: AI algorithm analyzing utilization patterns to recommend optimal fleet sizing
- **Expected Benefit**: 10-15% overcapacity identification for redeployment or retirement

**User Stories:**
- As a Fleet Manager, I want to view all assets by location so that I can optimize equipment allocation
- As a Technician, I want to scan an asset QR code so that I can quickly access its history and specifications
- As an Operations Manager, I want to see real-time asset locations so that I can respond to equipment requests efficiently

---

#### Feature 2: Maintenance Scheduling

**Description:**  
Preventive maintenance module supporting time-based and usage-based scheduling with automatic work order generation and resource allocation.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| EMS-002-A | System shall support calendar-based (time) scheduling | Must |
| EMS-002-B | System shall support usage-based (hours/mileage/km) scheduling | Must |
| EMS-002-C | System shall automatically generate work orders when maintenance is due | Must |
| EMS-002-D | System shall provide maintenance calendar with drag-and-drop rescheduling | Must |
| EMS-002-E | System shall support resource allocation (technicians, bays, tools) | Must |
| EMS-002-F | System shall send automated alerts 7/3/1 days before maintenance due | Should |
| EMS-002-G | System shall support maintenance checklist templates | Should |

**Value-Add Enhancement:**
- **AI-Powered Predictive Maintenance**: Analysis of 50+ telemetry data points to predict failures 7-14 days in advance (89% accuracy)
- **Expected Benefit**: 40% reduction in unexpected breakdowns, 15-20% extension of asset lifespan

**User Stories:**
- As a Maintenance Supervisor, I want to view the weekly maintenance schedule so that I can allocate technician resources
- As a Technician, I want to receive maintenance alerts on my mobile device so that I can prepare in advance
- As a Fleet Manager, I want to see overdue maintenance items so that I can prioritize urgent repairs

---

#### Feature 3: Repair History & Costs

**Description:**  
Complete repair tracking with maintenance activity logging, parts usage, labor hours, and cost analysis for total cost of ownership.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| EMS-003-A | System shall log all maintenance activities with date, description, and technician | Must |
| EMS-003-B | System shall track parts replaced with quantities and costs | Must |
| EMS-003-C | System shall record labor hours per repair activity | Must |
| EMS-003-D | System shall calculate total cost per repair including parts and labor | Must |
| EMS-003-E | System shall generate TCO reports per asset showing cumulative costs | Must |
| EMS-003-F | System shall identify assets exceeding maintenance cost thresholds | Should |
| EMS-003-G | System shall support repair photo documentation | Should |

**Value-Add Enhancement:**
- **Total Cost of Ownership Analytics**: 5-year TCO projections considering depreciation, maintenance, fuel, insurance, and downtime costs
- **Replace vs Repair Algorithm**: Automatic flagging of assets approaching the replacement crossover point
- **Expected Benefit**: 15-20% savings on lifecycle costs

**User Stories:**
- As a Finance Manager, I want to see maintenance costs by asset so that I can make replacement decisions
- As a Maintenance Supervisor, I want to view repair history for an asset so that I can identify recurring issues
- As a Procurement Officer, I want to see parts usage patterns so that I can optimize inventory levels

---

#### Feature 4: Asset Depreciation Tracking

**Description:**  
Depreciation engine supporting multiple calculation methods with automatic monthly calculations and financial system integration.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| EMS-004-A | System shall support straight-line depreciation method | Must |
| EMS-004-B | System shall support declining balance method | Must |
| EMS-004-C | System shall support sum-of-years-digits method | Should |
| EMS-004-D | System shall calculate depreciation automatically on monthly basis | Must |
| EMS-004-E | System shall post depreciation entries to FMS General Ledger | Must |
| EMS-004-F | System shall generate depreciation reports by asset category | Must |
| EMS-004-G | System shall support asset revaluation and impairment tracking | Should |

**Value-Add Enhancement:**
- **Tax Optimization Engine**: Automatic determination of most tax-efficient depreciation method and timing for capital allowance maximization
- **MFRS Compliance**: Automated compliance with Malaysian Financial Reporting Standards
- **Expected Benefit**: RM 200K-300K annual tax liability deferral for MMF fleet

**User Stories:**
- As a Finance Manager, I want to see monthly depreciation calculations so that I can post to GL accurately
- As an Accountant, I want to compare depreciation methods so that I can optimize tax position
- As an Auditor, I want to view depreciation audit trails so that I can verify compliance

---

#### Feature 5: Warranty Management

**Description:**  
Warranty tracking with expiry alerts, claims management, and reimbursement tracking for all asset warranties.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| EMS-005-A | System shall store warranty information (provider, terms, expiry date) | Must |
| EMS-005-B | System shall send automated alerts at 90/60/30 days before expiry | Must |
| EMS-005-C | System shall log warranty claims with status tracking | Must |
| EMS-005-D | System shall track warranty reimbursements | Must |
| EMS-005-E | System shall identify assets under warranty during repair entry | Should |
| EMS-005-F | System shall generate warranty expiry forecasts | Should |

**Value-Add Enhancement:**
- **Warranty Intelligence**: Analysis of warranty claim patterns to identify manufacturer defects early
- **Extended Warranty ROI Calculator**: Tracks extended warranty options with ROI calculations
- **Expected Benefit**: 8-12% savings on warranty costs through optimized coverage decisions

**User Stories:**
- As a Procurement Officer, I want warranty expiry alerts so that I can negotiate extensions proactively
- As a Maintenance Supervisor, I want to see warranty status during repair so that I can decide on warranty claims
- As a Finance Manager, I want warranty reimbursement tracking so that I can follow up on outstanding claims

---

#### Feature 6: Equipment Utilization Reports

**Description:**  
Utilization tracking with operating hours, idle time, and productivity metrics to support capacity planning decisions.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| EMS-006-A | System shall track operating hours per asset | Must |
| EMS-006-B | System shall calculate idle time and utilization percentage | Must |
| EMS-006-C | System shall generate utilization reports by asset, type, and location | Must |
| EMS-006-D | System shall identify underutilized assets (below threshold) | Must |
| EMS-006-E | System shall show peak demand periods by location | Should |
| EMS-006-F | System shall support utilization heat map visualization | Should |

**Value-Add Enhancement:**
- **Fleet Right-Sizing Analytics**: Utilization pattern analysis to recommend optimal fleet composition
- **Asset Sharing Recommendations**: Identification of opportunities for inter-branch asset sharing
- **Expected Benefit**: 15-20% efficiency gains through optimized capacity utilization

**User Stories:**
- As an Operations Manager, I want utilization reports by branch so that I can allocate equipment optimally
- As a Fleet Manager, I want to identify underutilized assets so that I can redeploy or dispose of them
- As a Branch Manager, I want peak demand analysis so that I can plan capacity for busy periods

---

#### Feature 7: Spare Parts Inventory

**Description:**  
Spare parts inventory management with reorder alerts, ABC classification, and demand forecasting.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| EMS-007-A | System shall track parts inventory levels by location | Must |
| EMS-007-B | System shall generate reorder alerts when below minimum level | Must |
| EMS-007-C | System shall support ABC classification for parts | Should |
| EMS-007-D | System shall provide automatic reorder suggestions | Should |
| EMS-007-E | System shall track parts usage against specific assets | Must |
| EMS-007-F | System shall support parts issue/return transactions | Must |
| EMS-007-G | System shall generate parts consumption reports | Must |

**Value-Add Enhancement:**
- **Smart Inventory Optimization**: Machine learning-based demand prediction based on scheduled maintenance, seasonal patterns, and failure rates
- **Expected Benefit**: 25-30% reduction in parts stockholding while maintaining 99%+ parts availability, freeing up RM 150K-200K in working capital

**User Stories:**
- As a Store Keeper, I want reorder alerts so that I can maintain optimal stock levels
- As a Maintenance Supervisor, I want to check parts availability before scheduling repairs
- As a Procurement Officer, I want parts consumption reports so that I can negotiate better contracts

---

#### Feature 8: Multi-Platform Interface

**Description:**  
Cross-platform accessibility via web browsers, native mobile apps, and responsive design with offline capability.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| EMS-008-A | System shall support Chrome, Edge, Safari browsers | Must |
| EMS-008-B | System shall provide responsive design for tablets | Must |
| EMS-008-C | System shall support iOS and Android mobile apps | Must |
| EMS-008-D | System shall provide offline-first architecture for mobile | Must |
| EMS-008-E | System shall sync data when connectivity restored | Must |
| EMS-008-F | System shall support Progressive Web App (PWA) | Should |

**Value-Add Enhancement:**
- **Progressive Web App (PWA)**: "Add to home screen" functionality without app store delays
- **Push Notifications**: Critical maintenance alerts even when app is not active
- **Expected Benefit**: Faster deployment and improved technician responsiveness

**User Stories:**
- As a Field Technician, I want to update maintenance records via mobile so that I can work anywhere
- As a Maintenance Supervisor, I want offline capability so that I can work in areas with poor connectivity
- As an IT Manager, I want PWA support so that we can deploy without app store approval delays

---

#### Feature 9: User-Friendly Interface

**Description:**  
Intuitive UI following Nielsen's usability heuristics with role-based navigation and contextual help.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| EMS-009-A | System shall follow consistent design language across all screens | Must |
| EMS-009-B | System shall provide role-based navigation menus | Must |
| EMS-009-C | System shall support contextual help tooltips | Should |
| EMS-009-D | System shall enable equipment issue logging with photo in <30 seconds | Must |
| EMS-009-E | System shall provide dashboard widgets customizable by role | Should |

**Value-Add Enhancement:**
- **Voice Command Interface**: Hands-free maintenance status updates while working on equipment
- **Natural Language Processing**: Commands like "Log repair for PM-047, replaced brake pads, job complete"
- **Expected Benefit**: 20% improvement in technician productivity

**User Stories:**
- As a Technician, I want a simple interface so that I can log repairs quickly without extensive training
- As a New User, I want contextual help so that I can learn the system without formal training
- As a Maintenance Supervisor, I want customizable dashboards so that I can see key metrics at a glance

---

#### Feature 10: Audit Trail & History

**Description:**  
Immutable audit logs capturing all asset modifications with complete before/after values and compliance reporting.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| EMS-010-A | System shall log all asset modifications with timestamp | Must |
| EMS-010-B | System shall capture before and after values for changes | Must |
| EMS-010-C | System shall record user identity and IP address | Must |
| EMS-010-D | System shall provide audit inquiry screen with filtering | Must |
| EMS-010-E | System shall support audit report export (PDF/Excel) | Must |
| EMS-010-F | System shall prevent audit log modification/deletion | Must |

**Value-Add Enhancement:**
- **Blockchain-Based Audit Trail**: Cryptographically-verifiable records preventing tampering even by administrators
- **Audit-Proof Evidence**: For insurance claims, warranty disputes, and regulatory compliance
- **Expected Benefit**: 60% reduction in audit preparation time

**User Stories:**
- As an Auditor, I want complete audit trails so that I can verify compliance
- As a Compliance Officer, I want tamper-proof logs so that I can ensure data integrity
- As a Manager, I want to track who changed asset information so that I can investigate discrepancies

---

#### Feature 11: Comprehensive Security Features

**Description:**  
Enterprise security framework implementing MFA, RBAC, encryption, and continuous monitoring.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| EMS-011-A | System shall support Multi-Factor Authentication (MFA) | Must |
| EMS-011-B | System shall implement Role-Based Access Control (RBAC) with 50+ permissions | Must |
| EMS-011-C | System shall enforce NIST 800-63B password policy | Must |
| EMS-011-D | System shall encrypt data at rest using AES-256 | Must |
| EMS-011-E | System shall encrypt data in transit using TLS 1.3 | Must |
| EMS-011-F | System shall undergo annual VAPT with zero critical/high findings | Must |

**Value-Add Enhancement:**
- **Zero-Trust Security**: Behavioral biometrics with continuous authentication based on typing patterns and device posture
- **AI-Powered Threat Detection**: Real-time identification of anomalous access patterns with automatic account suspension
- **Expected Benefit**: Enhanced protection against sophisticated attacks

**User Stories:**
- As an IT Security Officer, I want MFA so that I can protect against unauthorized access
- As an Admin, I want granular RBAC so that I can enforce least privilege access
- As a Compliance Officer, I want encryption so that I can meet data protection requirements

---

#### Feature 12: Reporting and Enquiries

**Description:**  
Comprehensive reporting library with ad-hoc query builder for custom analysis.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| EMS-012-A | System shall provide asset listing reports | Must |
| EMS-012-B | System shall provide maintenance schedule reports | Must |
| EMS-012-C | System shall provide repair history reports | Must |
| EMS-012-D | System shall provide cost analysis reports | Must |
| EMS-012-E | System shall provide depreciation reports | Must |
| EMS-012-F | System shall provide warranty status reports | Must |
| EMS-012-G | System shall provide utilization reports | Must |
| EMS-012-H | System shall support ad-hoc query builder | Should |

**Value-Add Enhancement:**
- **Natural Language Reporting**: Managers can ask questions like "Show me equipment with maintenance cost exceeding 30% of book value"
- **Predictive Analytics**: Forecast which assets will need major repairs in the next quarter
- **Expected Benefit**: Faster, more intuitive access to critical business intelligence

**User Stories:**
- As a Fleet Manager, I want standard reports so that I can monitor fleet performance
- As an Analyst, I want ad-hoc queries so that I can answer specific business questions
- As an Executive, I want dashboards so that I can see KPIs at a glance

---

### 3.2 Procurement System (PS)

#### Module Overview
PS streamlines the entire procurement lifecycle from requisition to payment with vendor management, budget control, and analytics.

---

#### Feature 1: Purchase Requisition Workflow

**Description:**  
Online PR module with multi-level approval workflows, budget checking, and real-time visibility.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| PS-001-A | System shall support online PR creation | Must |
| PS-001-B | System shall support multi-level approval workflows | Must |
| PS-001-C | System shall support configurable approval rules (amount, category, dept) | Must |
| PS-001-D | System shall check budget availability during requisition | Must |
| PS-001-E | System shall prevent overspend with real-time budget visibility | Must |
| PS-001-F | System shall support PR routing based on approver availability | Should |

**Value-Add Enhancement:**
- **AI Spend Classification**: Automatic categorization of purchase requests with preferred vendor suggestions
- **Smart Routing**: Urgent requests routed to available approvers based on calendar integration
- **Expected Benefit**: 40-50% reduction in approval cycle time

**User Stories:**
- As a Department Head, I want to submit PRs online so that I can avoid paper forms
- As an Approver, I want mobile approval so that I can approve requests while traveling
- As a Budget Holder, I want real-time budget checking so that I can prevent overspend

---

#### Feature 2: Vendor Management and Evaluation

**Description:**  
Comprehensive vendor registry with profile management, classification, and performance tracking.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| PS-002-A | System shall maintain vendor master data (profile, contact, bank) | Must |
| PS-002-B | System shall support vendor classification and categorization | Must |
| PS-002-C | System shall track vendor performance metrics (delivery, quality, price) | Must |
| PS-002-D | System shall generate automated vendor scorecards | Must |
| PS-002-E | System shall support vendor onboarding workflow | Should |
| PS-002-F | System shall maintain vendor document repository | Should |

**Value-Add Enhancement:**
- **Vendor Risk Intelligence**: Monitoring of external data sources (news, financial reports, court records) for proactive risk identification
- **Peer Benchmarking**: MMF vendor performance comparison against industry peers using anonymized data
- **Expected Benefit**: Better vendor negotiations and risk mitigation

**User Stories:**
- As a Procurement Officer, I want vendor scorecards so that I can make informed sourcing decisions
- As a Compliance Officer, I want vendor risk monitoring so that I can identify issues early
- As a Category Manager, I want performance trends so that I can negotiate better contracts

---

#### Feature 3: Quotation Management

**Description:**  
RFQ module for creation, distribution, and comparison of vendor quotations.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| PS-003-A | System shall support RFQ creation with item specifications | Must |
| PS-003-B | System shall support RFQ distribution to multiple vendors | Must |
| PS-003-C | System shall provide side-by-side quotation comparison | Must |
| PS-003-D | System shall display historical pricing for context | Should |
| PS-003-E | System shall support vendor quote submission portal | Must |
| PS-003-F | System shall identify lowest compliant bid automatically | Should |

**Value-Add Enhancement:**
- **AI Price Benchmarking**: Quote comparison against market rates, historical purchases, and industry benchmarks
- **Price Anomaly Detection**: Flags quotes significantly above or below market rates with target price suggestions
- **Expected Benefit**: 8-12% savings on procurement costs

**User Stories:**
- As a Buyer, I want quotation comparison so that I can select the best vendor
- As a Procurement Manager, I want historical pricing so that I can identify trends
- As a Finance Manager, I want price benchmarks so that I can ensure value for money

---

#### Feature 4: Purchase Order Processing

**Description:**  
Automated PO generation with configurable templates, approval workflows, and status tracking.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| PS-004-A | System shall auto-generate POs from approved requisitions | Must |
| PS-004-B | System shall support configurable PO templates | Must |
| PS-004-C | System shall support PO approval workflows | Must |
| PS-004-D | System shall provide real-time PO status visibility | Must |
| PS-004-E | System shall send automatic notifications for delays | Should |
| PS-004-F | System shall support PO amendment workflow | Should |

**Value-Add Enhancement:**
- **Smart PO Consolidation**: Identification of opportunities to combine requisitions for volume discounts
- **Delivery Delay Prediction**: Prediction of delays based on vendor historical performance with alternative supplier suggestions
- **Expected Benefit**: Volume discounts and 35% reduction in stockout risk

**User Stories:**
- As a Procurement Officer, I want auto PO generation so that I can reduce manual work
- As a Vendor, I want to receive POs electronically so that I can process orders faster
- As a Requester, I want PO tracking so that I can monitor my order status

---

#### Feature 5: Goods Receipt and Inspection

**Description:**  
GRN module with barcode/RFID scanning, quality inspection, and acceptance workflows.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| PS-005-A | System shall support GRN creation against PO | Must |
| PS-005-B | System shall support barcode/RFID scanning for receiving | Should |
| PS-005-C | System shall support quality inspection recording | Must |
| PS-005-D | System shall support acceptance/rejection workflows | Must |
| PS-005-E | System shall integrate with WMS for inventory updates | Must |
| PS-005-F | System shall support partial receipt handling | Must |

**Value-Add Enhancement:**
- **AI Quality Prediction**: Analysis of vendor historical quality data to predict defect likelihood
- **Risk-Based Inspection**: High-risk shipments flagged for enhanced inspection; trusted vendors fast-tracked
- **Expected Benefit**: 30% reduction in inspection workload without compromising quality

**User Stories:**
- As a Store Keeper, I want barcode scanning so that I can receive goods quickly
- As a QC Inspector, I want inspection checklists so that I can ensure quality standards
- As a Procurement Officer, I want rejection workflow so that I can return defective goods

---

#### Feature 6: Three-Way Matching (PO-GRN-Invoice)

**Description:**  
Automated three-way matching with configurable tolerances and discrepancy workflows.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| PS-006-A | System shall match invoice against PO and GRN | Must |
| PS-006-B | System shall support configurable tolerance levels | Must |
| PS-006-C | System shall route discrepancies for approval | Must |
| PS-006-D | System shall support variance justification capture | Must |
| PS-006-E | System shall auto-approve within tolerance | Should |
| PS-006-F | System shall flag duplicate invoices | Must |

**Value-Add Enhancement:**
- **Intelligent Matching Engine**: AI matching of invoices with incomplete references or minor discrepancies (e.g., different UOM)
- **Auto-Processing**: Handles 85%+ of invoices automatically
- **Expected Benefit**: AP processing time reduced from days to hours, virtually eliminating duplicate payments

**User Stories:**
- As an AP Clerk, I want automated matching so that I can reduce manual checking
- As a Finance Manager, I want discrepancy alerts so that I can control payments
- As an Auditor, I want three-way match records so that I can verify payment accuracy

---

#### Feature 7: Procurement Analytics

**Description:**  
Analytics dashboard with spending analysis, trend reports, and vendor performance insights.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| PS-007-A | System shall provide spend analysis by category | Must |
| PS-007-B | System shall provide spend analysis by vendor | Must |
| PS-007-C | System shall provide spend analysis by department | Must |
| PS-007-D | System shall support drill-down capability | Must |
| PS-007-E | System shall provide purchase trend reports | Should |
| PS-007-F | System shall provide vendor performance scorecards | Must |

**Value-Add Enhancement:**
- **Procurement Intelligence**: Identification of maverick spending and consolidation opportunities
- **Contract Compliance Tracking**: Tracks realized savings against negotiated contracts
- **Expiry Alerts**: Early warning of contract expiries
- **Expected Benefit**: Recovery of 10-15% in leakage savings

**User Stories:**
- As a CFO, I want spend analysis so that I can control costs
- As a Category Manager, I want vendor scorecards so that I can manage suppliers
- As a Procurement Director, I want trend reports so that I can forecast spending

---

#### Feature 8: Budget Control and Tracking

**Description:**  
Budget allocation with real-time checking during requisition and utilization tracking.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| PS-008-A | System shall support budget allocation by department | Must |
| PS-008-B | System shall support budget allocation by category | Must |
| PS-008-C | System shall check budget availability during PR | Must |
| PS-008-D | System shall track committed vs actual spend | Must |
| PS-008-E | System shall provide budget utilization visibility | Must |
| PS-008-F | System shall send overspend alerts | Should |

**Value-Add Enhancement:**
- **Predictive Budget Forecasting**: Analysis of historical patterns and pipeline requisitions to forecast year-end position
- **Proactive Alerts**: Alerts to budget holders when forecasts indicate potential overspend
- **Expected Benefit**: Prevention of 95%+ of budget overruns

**User Stories:**
- As a Budget Holder, I want real-time budget visibility so that I can manage my spend
- As a Department Head, I want committed spend tracking so that I can see available budget
- As a Finance Manager, I want overspend alerts so that I can enforce budget discipline

---

#### Feature 9: Multi-Platform Interface

**Description:**  
Cross-platform accessibility for desktop, tablet, and mobile with push notifications.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| PS-009-A | System shall support desktop browsers | Must |
| PS-009-B | System shall support tablet devices | Must |
| PS-009-C | System shall support mobile app | Must |
| PS-009-D | System shall provide push notifications for approvals | Should |
| PS-009-E | System shall support offline mode for mobile | Should |

**Value-Add Enhancement:**
- **Smart Approval Assistant**: Summarizes key information for approvers enabling one-tap approval
- **Voice Approval**: Hands-free approval processing while driving or in the field
- **Expected Benefit**: Faster approval cycles and improved user experience

**User Stories:**
- As an Approver, I want mobile approval so that I can approve requests anywhere
- As a Requester, I want push notifications so that I can track approval status
- As a Manager, I want summary views so that I can approve quickly

---

#### Feature 10: User-Friendly Interface

**Description:**  
Intuitive interface with guided workflows and smart defaults.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| PS-010-A | System shall provide guided workflows | Must |
| PS-010-B | System shall provide smart defaults | Must |
| PS-010-C | System shall provide contextual help | Should |
| PS-010-D | System shall enable first PR creation within 10 minutes | Must |

**Value-Add Enhancement:**
- **Conversational Procurement**: Natural language requisition submission ("I need 10 boxes of A4 paper for Port Klang office")
- **AI Conversion**: Converts natural language to structured requisitions with vendor and pricing suggestions
- **Expected Benefit**: 70% reduction in requisition time

**User Stories:**
- As a New User, I want guided workflows so that I can learn without training
- As a Frequent User, I want smart defaults so that I can complete forms faster
- As a Department User, I want natural language input so that I can submit requests quickly

---

#### Feature 11: Audit Trail & History

**Description:**  
Complete audit trail capturing all procurement activities for compliance.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| PS-011-A | System shall log all procurement activities | Must |
| PS-011-B | System shall capture user, timestamp, before/after values | Must |
| PS-011-C | System shall support audit report export | Must |
| PS-011-D | System shall maintain immutable logs | Must |

**Value-Add Enhancement:**
- **Fraud Detection Analytics**: Pattern analysis to identify suspicious activities (split purchases, unusual vendor relationships)
- **Auto-Flagging**: High-risk transactions automatically flagged for review
- **Expected Benefit**: Protection against procurement fraud (typically 3-5% of spend)

**User Stories:**
- As an Internal Auditor, I want complete audit trails so that I can verify compliance
- As a Compliance Officer, I want fraud detection so that I can prevent misconduct
- As a CFO, I want audit reports so that I can satisfy external auditors

---

#### Feature 12: Comprehensive Security Features

**Description:**  
Enterprise-grade security with MFA, RBAC, encryption, and segregation of duties.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| PS-012-A | System shall support MFA | Must |
| PS-012-B | System shall implement RBAC | Must |
| PS-012-C | System shall enforce segregation of duties | Must |
| PS-012-D | System shall encrypt data at rest and in transit | Must |
| PS-012-E | System shall enforce requisitioner ≠ approver ≠ receiver | Must |

**Value-Add Enhancement:**
- **Dynamic Access Control**: Permissions adjusted based on risk factors (location, device, time)
- **Dual Authorization**: Sensitive transactions (vendor bank changes) require dual auth with video verification
- **Expected Benefit**: Bank-grade security for financial transactions

**User Stories:**
- As an IT Security Officer, I want MFA so that I can protect the system
- As a Compliance Officer, I want segregation of duties so that I can prevent fraud
- As an Admin, I want dynamic access so that I can balance security and usability

---

#### Feature 13: Reporting and Enquiries

**Description:**  
Comprehensive reporting with custom report builder.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| PS-013-A | System shall provide PR status reports | Must |
| PS-013-B | System shall provide PO tracking reports | Must |
| PS-013-C | System shall provide vendor performance reports | Must |
| PS-013-D | System shall provide spend analysis reports | Must |
| PS-013-E | System shall provide budget utilization reports | Must |
| PS-013-F | System shall provide GRN reports | Must |
| PS-013-G | System shall support custom report builder | Should |

**Value-Add Enhancement:**
- **Procurement Cockpit**: Executive real-time visibility into KPIs (spend under management, contract compliance, savings)
- **Natural Language Queries**: Instant answers to questions like "What percentage of spend is with preferred vendors?"
- **Expected Benefit**: Strategic decision-making support for executives

**User Stories:**
- As a Procurement Manager, I want standard reports so that I can monitor operations
- As an Executive, I want KPI dashboards so that I can see performance at a glance
- As an Analyst, I want custom reports so that I can answer specific questions

---

### 3.3 Human Resource Management System (HRMS)

#### Module Overview
HRMS automates HR processes for 500+ employees across 6 branches with payroll, leave, claims, and talent management.

---

#### Feature 1: Employee Database Management

**Description:**  
Centralized employee database with comprehensive profiles and organizational visualization.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| HR-001-A | System shall maintain comprehensive employee profiles | Must |
| HR-001-B | System shall store employment history | Must |
| HR-001-C | System shall track qualifications and certifications | Must |
| HR-001-D | System shall support document management | Must |
| HR-001-E | System shall provide organizational chart with drill-down | Must |
| HR-001-F | System shall support multi-branch organization views | Must |

**Value-Add Enhancement:**
- **Employee Lifecycle Analytics**: Sentiment analysis from reviews and surveys with attrition risk factors
- **Predictive Models**: Flight risk identification 60-90 days in advance
- **Expected Benefit**: 20-25% reduction in voluntary turnover through proactive retention

**User Stories:**
- As an HR Manager, I want employee profiles so that I can manage personnel data
- As a Manager, I want org charts so that I can understand reporting lines
- As an HR Analyst, I want attrition predictions so that I can intervene early

---

#### Feature 2: Attendance and Leave Management

**Description:**  
Attendance tracking with multiple clock-in methods and comprehensive leave management.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| HR-002-A | System shall support biometric clock-in | Must |
| HR-002-B | System shall support mobile GPS clock-in | Must |
| HR-002-C | System shall support web clock-in | Must |
| HR-002-D | System shall calculate automatic overtime | Must |
| HR-002-E | System shall manage all leave types | Must |
| HR-002-F | System shall track leave balances | Must |
| HR-002-G | System shall support leave approval workflows | Must |

**Value-Add Enhancement:**
- **AI Absence Prediction**: Pattern analysis to identify issues (e.g., Monday/Friday patterns suggesting disengagement)
- **Shift Optimization**: Demand forecast-based scheduling with employee preference consideration
- **Expected Benefit**: 15% improvement in workforce utilization

**User Stories:**
- As an Employee, I want to clock in via mobile so that I can work at different locations
- As an Employee, I want to apply for leave online so that I can avoid paper forms
- As an HR Officer, I want attendance reports so that I can process payroll accurately

---

#### Feature 3: Payroll Processing

**Description:**  
Monthly payroll calculation with full statutory compliance and financial system integration.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| HR-003-A | System shall calculate monthly payroll | Must |
| HR-003-B | System shall support all statutory deductions (EPF, SOCSO, EIS, PCB) | Must |
| HR-003-C | System shall generate EA forms | Must |
| HR-003-D | System shall generate CP8D forms | Must |
| HR-003-E | System shall integrate with FMS for GL posting | Must |
| HR-003-F | System shall generate bank payment files | Must |
| HR-003-G | System shall support multi-branch payroll | Must |

**Value-Add Enhancement:**
- **Intelligent Payroll Validation**: AI detection of anomalies (unusual overtime, duplicate payments, rate changes)
- **Tax Optimization**: Year-round tax deduction optimization for maximum take-home pay
- **Expected Benefit**: Error prevention and RM 500-1,000 annual tax savings per employee

**User Stories:**
- As an HR Officer, I want automated payroll so that I can ensure accurate and timely payment
- As an Employee, I want online payslips so that I can access my pay history
- As a Finance Manager, I want GL integration so that I can post payroll accurately

---

#### Feature 4: Claims and Reimbursement

**Description:**  
Online claims module with receipt management and approval workflows.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| HR-004-A | System shall support multiple claim types (medical, travel, entertainment) | Must |
| HR-004-B | System shall support receipt attachment | Must |
| HR-004-C | System shall route claims based on amount and type | Must |
| HR-004-D | System shall integrate with payroll for reimbursement | Must |
| HR-004-E | System shall support claim status tracking | Must |
| HR-004-F | System shall support receipt OCR extraction | Should |

**Value-Add Enhancement:**
- **Receipt Intelligence**: OCR-based automatic receipt reading and validation
- **Duplicate and Policy Violation Flagging**: Automatic identification of issues
- **Corporate Card Integration**: Automatic reconciliation with credit card statements
- **Expected Benefit**: Claims processing reduced from weeks to 2-3 days, elimination of manual errors

**User Stories:**
- As an Employee, I want online claims so that I can submit expenses easily
- As a Manager, I want claim approval workflow so that I can control expenses
- As an HR Officer, I want receipt OCR so that I can process claims faster

---

#### Feature 5: Performance Appraisal

**Description:**  
Performance management with goal setting, reviews, and 360-degree feedback.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| HR-005-A | System shall support goal setting and tracking | Must |
| HR-005-B | System shall support periodic review forms | Must |
| HR-005-C | System shall support 360-degree feedback | Should |
| HR-005-D | System shall provide customizable appraisal forms | Must |
| HR-005-E | System shall maintain historical performance tracking | Must |
| HR-005-F | System shall support succession planning integration | Should |

**Value-Add Enhancement:**
- **Continuous Performance Management**: Ongoing feedback and check-ins replacing annual reviews
- **AI Analysis**: Performance data analysis to identify high-potentials and skill gaps
- **Auto-Recommendations**: Automatic training program suggestions
- **Expected Benefit**: 40% improvement in employee development effectiveness

**User Stories:**
- As an Employee, I want goal tracking so that I can monitor my progress
- As a Manager, I want performance reviews so that I can provide feedback
- As an HR Manager, I want succession planning so that I can develop future leaders

---

#### Feature 6: Training Management

**Description:**  
Training module for needs assessment, scheduling, attendance, and certification.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| HR-006-A | System shall support training needs assessment | Must |
| HR-006-B | System shall support course scheduling | Must |
| HR-006-C | System shall track training attendance | Must |
| HR-006-D | System shall manage certification tracking | Must |
| HR-006-E | System shall track training costs | Must |
| HR-006-F | System shall provide training ROI analysis | Should |

**Value-Add Enhancement:**
- **AI Learning Recommendations**: Personalized learning paths based on job roles, performance gaps, and career aspirations
- **Online Learning Integration**: Seamless access to LinkedIn Learning, Coursera, and other platforms
- **Expected Benefit**: Training completion rates increased from 40% to 75%

**User Stories:**
- As an Employee, I want training recommendations so that I can develop my skills
- As a Manager, I want to track team training so that I can ensure compliance
- As an HR Officer, I want training cost tracking so that I can manage budget

---

#### Feature 7: Recruitment Tracking

**Description:**  
Recruitment module managing requisition-to-offer workflow with candidate database.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| HR-007-A | System shall support requisition-to-offer workflow | Must |
| HR-007-B | System shall maintain candidate database | Must |
| HR-007-C | System shall support interview scheduling | Must |
| HR-007-D | System shall support offer letter generation | Must |
| HR-007-E | System shall provide onboarding checklists | Must |
| HR-007-F | System shall support resume parsing | Should |

**Value-Add Enhancement:**
- **AI Resume Screening**: Automatic parsing and ranking against job requirements (75% time reduction)
- **Predictive Analytics**: Candidate success likelihood identification
- **Expected Benefit**: 30% improvement in quality of hire, 40% reduction in time-to-fill

**User Stories:**
- As a Hiring Manager, I want candidate tracking so that I can manage the hiring process
- As an HR Officer, I want resume screening so that I can shortlist efficiently
- As a Recruiter, I want interview scheduling so that I can coordinate with candidates

---

#### Feature 8: HR Analytics and Reporting

**Description:**  
HR dashboard with headcount, turnover, attendance, and payroll reports.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| HR-008-A | System shall provide headcount reports | Must |
| HR-008-B | System shall provide turnover analysis | Must |
| HR-008-C | System shall provide attendance reports | Must |
| HR-008-D | System shall provide payroll summary reports | Must |
| HR-008-E | System shall support drill-down by branch/department | Must |
| HR-008-F | System shall support regulatory reporting | Must |

**Value-Add Enhancement:**
- **Workforce Intelligence**: Predictive analytics for workforce planning (retirement forecasting, succession gaps, hiring needs)
- **Peer Benchmarking**: MMF HR metrics comparison against industry peers
- **Expected Benefit**: Data-driven workforce planning and competitive positioning

**User Stories:**
- As an HR Director, I want HR dashboards so that I can monitor workforce metrics
- As a CFO, I want headcount reports so that I can plan budgets
- As a Manager, I want turnover analysis so that I can improve retention

---

#### Feature 9: Multi-Platform Interface

**Description:**  
Web and mobile accessibility for employees and managers.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| HR-009-A | System shall provide web access | Must |
| HR-009-B | System shall provide mobile app access | Must |
| HR-009-C | System shall support payslip viewing | Must |
| HR-009-D | System shall support leave application | Must |
| HR-009-E | System shall support personal detail updates | Must |
| HR-009-F | System shall support manager approvals on mobile | Must |

**Value-Add Enhancement:**
- **Employee Self-Service Chatbot**: WhatsApp/Teams integration for common HR queries ("How much leave do I have?")
- **24/7 Availability**: Instant employee support without HR intervention
- **Expected Benefit**: 60% reduction in HR administration workload

**User Stories:**
- As an Employee, I want mobile access so that I can view payslips anywhere
- As an Employee, I want a chatbot so that I can get answers quickly
- As a Manager, I want mobile approvals so that I can approve requests on the go

---

#### Feature 10: User-Friendly Interface

**Description:**  
Modern, intuitive interface requiring minimal training.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| HR-010-A | System shall provide intuitive navigation | Must |
| HR-010-B | System shall enable payslip access within minutes of first login | Must |
| HR-010-C | System shall support contextual help | Should |
| HR-010-D | System shall provide guided processes | Should |

**Value-Add Enhancement:**
- **Voice-Enabled HR**: Natural language interaction ("Apply for 2 days annual leave starting tomorrow")
- **Accessibility**: Valuable for field staff and drivers with limited typing ability
- **Expected Benefit**: Improved accessibility and user experience

**User Stories:**
- As an Employee, I want an intuitive interface so that I don't need training
- As a Field Worker, I want voice commands so that I can use the system while working
- As an HR Manager, I want minimal support requests so that I can focus on strategic work

---

#### Feature 11: Audit Trail & History

**Description:**  
Complete audit trail for HR data changes with regulatory compliance support.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| HR-011-A | System shall capture all HR data changes | Must |
| HR-011-B | System shall record user, timestamp, before/after values | Must |
| HR-011-C | System shall support audit report export | Must |
| HR-011-D | System shall support Malaysian employment regulation compliance | Must |

**Value-Add Enhancement:**
- **GDPR/PDPA Compliance Module**: Automatic data retention policy management, consent tracking, data subject access request handling
- **Compliance Risk Flagging**: Automatic identification of potential issues
- **Expected Benefit**: Reduced regulatory risk and audit preparation effort

**User Stories:**
- As an HR Officer, I want audit trails so that I can track data changes
- As a Compliance Officer, I want PDPA compliance so that I can protect employee data
- As an Auditor, I want audit reports so that I can verify compliance

---

#### Feature 12: Comprehensive Security Features

**Description:**  
Role-based access with field-level controls for sensitive information.

**Acceptance Criteria:**

| ID | Criteria | Priority |
|----|----------|----------|
| HR-012-A | System shall implement role-based access (employee/manager/HR) | Must |
| HR-012-B | System shall encrypt sensitive information (salary, IC) | Must |
| HR-012-C | System shall enforce field-level access controls | Must |
| HR-012-D | System shall support data masking for sensitive fields | Should |

**Value-Add Enhancement:**
- **Privacy-Preserving Analytics**: Differential privacy allowing workforce trend analysis without exposing individual data
- **Secure Analysis**: Gender pay gap and diversity metric analysis with mathematical privacy guarantees
- **Expected Benefit**: Data-driven decisions without compromising employee trust

**User Stories:**
- As an Employee, I want data security so that my personal information is protected
- As an HR Analyst, I want privacy-preserving analytics so that I can analyze trends ethically
- As an HR Director, I want access controls so that I can enforce data protection policies

---

## 4. Integration Requirements

### 4.1 Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     TSH-2605 SUPPORT IT SYSTEM                           │
│                     (EMS / PS / HRMS)                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         INTEGRATION LAYER                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ API Gateway │  │ Message Bus │  │   ETL       │  │   Event     │    │
│  │  (REST)     │  │  (RabbitMQ) │  │  Engine     │  │   Store     │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
└─────────┼────────────────┼────────────────┼────────────────┼───────────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   TSH-2604  │  │   TSH-2604  │  │   External  │  │   External  │
│    HMS      │  │    FMS      │  │ MyDigitalID │  │    IRBM     │
│  (Vehicle   │  │  (Financial │  │  (Identity) │  │ (e-Invoice) │
│ Maintenance)│  │ Management) │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

### 4.2 TSH-2604 System Integrations

#### Integration 1: EMS ↔ HMS (Vehicle Maintenance)

| Attribute | Details |
|-----------|---------|
| **Integration Point** | Equipment Management System ↔ Hardware Management System |
| **Data Direction** | Bidirectional |
| **Frequency** | Real-time / Scheduled |
| **Protocol** | REST API + Message Queue |

**Data Exchange:**

| From | To | Data Elements |
|------|-----|---------------|
| EMS | HMS | Vehicle maintenance schedules, preventive maintenance status |
| HMS | EMS | Vehicle usage data, mileage/hours, fault codes |

**Acceptance Criteria:**
- EMS shall push PM schedules to HMS within 5 minutes of creation
- EMS shall receive vehicle usage updates from HMS daily
- System shall maintain data consistency across both systems
- Failed syncs shall be queued for retry with alerting

---

#### Integration 2: EMS ↔ FMS (Asset Depreciation)

| Attribute | Details |
|-----------|---------|
| **Integration Point** | Equipment Management System ↔ Financial Management System |
| **Data Direction** | Unidirectional (EMS → FMS) |
| **Frequency** | Daily / Monthly |
| **Protocol** | REST API |

**Data Exchange:**

| From | To | Data Elements |
|------|-----|---------------|
| EMS | FMS | Asset depreciation entries, maintenance costs, asset additions/disposals |
| FMS | EMS | Asset account codes, cost center mapping |

**Acceptance Criteria:**
- EMS shall post depreciation entries to FMS GL automatically on monthly basis
- EMS shall post maintenance costs to FMS AP daily
- All financial postings shall include proper account codes and cost centers
- Posting errors shall trigger alerts to finance team

---

#### Integration 3: PS ↔ FMS (3-Way Matching)

| Attribute | Details |
|-----------|---------|
| **Integration Point** | Procurement System ↔ Financial Management System |
| **Data Direction** | Bidirectional |
| **Frequency** | Real-time |
| **Protocol** | REST API |

**Data Exchange:**

| From | To | Data Elements |
|------|-----|---------------|
| PS | FMS | Approved invoices for payment, vendor master data |
| FMS | PS | Payment status, vendor balances, GL account validation |

**Acceptance Criteria:**
- PS shall push approved invoices to FMS within 1 minute of approval
- FMS shall update payment status back to PS within 1 hour
- Vendor master data shall sync bidirectionally daily
- Invoice postings shall include full 3-way match documentation

---

#### Integration 4: HRMS ↔ FMS (Payroll)

| Attribute | Details |
|-----------|---------|
| **Integration Point** | HR Management System ↔ Financial Management System |
| **Data Direction** | Unidirectional (HRMS → FMS) |
| **Frequency** | Monthly |
| **Protocol** | REST API + File Transfer |

**Data Exchange:**

| From | To | Data Elements |
|------|-----|---------------|
| HRMS | FMS | Payroll journal entries, statutory payment files, cost allocations |
| FMS | HRMS | Cost center budgets, project codes |

**Acceptance Criteria:**
- HRMS shall generate payroll journal and post to FMS within 2 hours of payroll completion
- HRMS shall generate bank payment files in required format
- Payroll postings shall be broken down by cost center and project
- Reconciliation reports shall be generated automatically

---

#### Integration 5: HRMS ↔ All (User Authentication)

| Attribute | Details |
|-----------|---------|
| **Integration Point** | HRMS → All TSH-2604/2605 Systems |
| **Data Direction** | Unidirectional |
| **Frequency** | Real-time |
| **Protocol** | SSO / LDAP / SAML |

**Data Exchange:**

| From | To | Data Elements |
|------|-----|---------------|
| HRMS | All Systems | Employee master data, role assignments, department/org structure |
| All Systems | HRMS | Login events, access logs (for audit) |

**Acceptance Criteria:**
- HRMS shall be the master system for employee data
- New hires shall automatically receive system access within 1 hour of HR record creation
- Terminated employees shall have access revoked automatically
- Role changes shall propagate to all systems within 1 hour
- SSO shall provide seamless access across all integrated systems

### 4.3 External System Integrations

#### MyDigitalID Integration

| Attribute | Details |
|-----------|---------|
| **Purpose** | National digital identity authentication |
| **Integration Type** | OAuth 2.0 / SAML |
| **Data Exchanged** | Identity verification, authentication tokens |

**Acceptance Criteria:**
- System shall support MyDigitalID as primary authentication method
- System shall fall back to enterprise auth if MyDigitalID unavailable
- User attributes (name, IC, email) shall be retrieved from MyDigitalID
- Session management shall comply with MyDigitalID specifications

#### IRBM e-Invoicing Integration

| Attribute | Details |
|-----------|---------|
| **Purpose** | Tax invoice submission to Inland Revenue Board |
| **Integration Type** | REST API (via FMS) |
| **Data Exchanged** | Invoice data, validation status, UIN (Unique Identification Number) |

**Acceptance Criteria:**
- System shall submit e-invoices to IRBM within 24 hours of creation
- System shall receive and store UIN for each submitted invoice
- System shall handle validation errors with retry mechanism
- System shall maintain audit trail of all submissions

---

## 5. Security & Compliance

### 5.1 Security Framework

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      SECURITY FRAMEWORK                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     IDENTITY & ACCESS                            │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │   │
│  │  │     MFA      │ │     RBAC     │ │   Password   │              │   │
│  │  │  (TOTP/SMS)  │ │ (50+ Perms)  │ │  (NIST Std)  │              │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     DATA PROTECTION                              │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │   │
│  │  │  AES-256     │ │   TLS 1.3    │ │   Field-Level│              │   │
│  │  │  (At Rest)   │ │ (In Transit) │ │   Encryption │              │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     MONITORING & AUDIT                           │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │   │
│  │  │  Audit Logs  │ │  AI Threat   │ │  VAPT (Ann'l)│              │   │
│  │  │ (Immutable)  │ │  Detection   │ │(Zero Critical│              │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Security Requirements

| Category | Requirement | Implementation |
|----------|-------------|----------------|
| **Authentication** | Multi-Factor Authentication | TOTP + SMS/Email backup |
| **Authorization** | Role-Based Access Control | 50+ granular permissions |
| **Password Policy** | NIST 800-63B Compliance | Min 12 chars, complexity rules, breach checking |
| **Encryption at Rest** | Database Encryption | AES-256-GCM |
| **Encryption in Transit** | Network Encryption | TLS 1.3 mandatory |
| **Field-Level Security** | Sensitive Data Protection | IC, salary fields encrypted |
| **Session Management** | Secure Sessions | 30-min timeout, concurrent session limits |
| **Audit Logging** | Immutable Logs | Tamper-proof with blockchain option |
| **Penetration Testing** | Annual VAPT | CREST-accredited, zero critical/high |

### 5.3 Compliance Matrix

| Regulation | Requirement | Status |
|------------|-------------|--------|
| **PDPA 2010** | Personal Data Protection | ✅ Full Compliance |
| **MFRS** | Financial Reporting Standards | ✅ Full Compliance |
| **IRBM** | Tax/e-Invoicing Requirements | ✅ Full Compliance |
| **Awan Kita** | Sovereign Cloud Deployment | ✅ Full Compliance |
| **SOCSO/EPF** | Statutory Contribution Rules | ✅ Full Compliance |
| **EA Form** | Tax Form Generation | ✅ Full Compliance |

### 5.4 Data Residency & Sovereignty

| Aspect | Implementation |
|--------|----------------|
| **Primary Data Center** | Awan Kita Sovereign Cloud (Malaysia) |
| **Backup Location** | Secondary Awan Kita zone within Malaysia |
| **Encryption Keys** | Managed within Malaysia |
| **Cross-Border Transfer** | Not permitted for production data |
| **Audit Access** | MMF retains right to audit data location |

---

## 6. User Stories by Module

### 6.1 EMS User Stories

#### Fleet Manager Persona
| ID | User Story | Priority |
|----|------------|----------|
| EMS-US-001 | As a Fleet Manager, I want to view all assets by location so that I can optimize equipment allocation | High |
| EMS-US-002 | As a Fleet Manager, I want to see real-time asset locations so that I can respond to equipment requests efficiently | High |
| EMS-US-003 | As a Fleet Manager, I want utilization reports by branch so that I can allocate equipment optimally | High |
| EMS-US-004 | As a Fleet Manager, I want to identify underutilized assets so that I can redeploy or dispose of them | Medium |
| EMS-US-005 | As a Fleet Manager, I want maintenance cost reports so that I can make replacement decisions | High |

#### Technician Persona
| ID | User Story | Priority |
|----|------------|----------|
| EMS-US-006 | As a Technician, I want to scan an asset QR code so that I can quickly access its history and specifications | High |
| EMS-US-007 | As a Technician, I want to update maintenance records via mobile so that I can work anywhere | High |
| EMS-US-008 | As a Technician, I want to receive maintenance alerts on my mobile device so that I can prepare in advance | High |
| EMS-US-009 | As a Technician, I want offline capability so that I can work in areas with poor connectivity | Medium |
| EMS-US-010 | As a Technician, I want a simple interface so that I can log repairs quickly without extensive training | High |

#### Maintenance Supervisor Persona
| ID | User Story | Priority |
|----|------------|----------|
| EMS-US-011 | As a Maintenance Supervisor, I want to view the weekly maintenance schedule so that I can allocate technician resources | High |
| EMS-US-012 | As a Maintenance Supervisor, I want to see overdue maintenance items so that I can prioritize urgent repairs | High |
| EMS-US-013 | As a Maintenance Supervisor, I want to view repair history for an asset so that I can identify recurring issues | Medium |
| EMS-US-014 | As a Maintenance Supervisor, I want resource allocation tools so that I can assign technicians and bays efficiently | Medium |

### 6.2 PS User Stories

#### Procurement Officer Persona
| ID | User Story | Priority |
|----|------------|----------|
| PS-US-001 | As a Procurement Officer, I want auto PO generation so that I can reduce manual work | High |
| PS-US-002 | As a Procurement Officer, I want vendor scorecards so that I can make informed sourcing decisions | High |
| PS-US-003 | As a Procurement Officer, I want quotation comparison so that I can select the best vendor | High |
| PS-US-004 | As a Procurement Officer, I want to receive POs electronically so that I can process orders faster | High |
| PS-US-005 | As a Procurement Officer, I want parts consumption reports so that I can negotiate better contracts | Medium |

#### Department Head Persona
| ID | User Story | Priority |
|----|------------|----------|
| PS-US-006 | As a Department Head, I want to submit PRs online so that I can avoid paper forms | High |
| PS-US-007 | As a Department Head, I want real-time budget checking so that I can prevent overspend | High |
| PS-US-008 | As a Department Head, I want to track my PR status so that I can plan accordingly | Medium |
| PS-US-009 | As a Department Head, I want mobile approval so that I can approve requests while traveling | Medium |

#### Finance Manager Persona
| ID | User Story | Priority |
|----|------------|----------|
| PS-US-010 | As a Finance Manager, I want automated 3-way matching so that I can ensure payment accuracy | High |
| PS-US-011 | As a Finance Manager, I want discrepancy alerts so that I can control payments | High |
| PS-US-012 | As a Finance Manager, I want spend analysis so that I can control costs | High |
| PS-US-013 | As a Finance Manager, I want budget utilization reports so that I can enforce budget discipline | Medium |

### 6.3 HRMS User Stories

#### Employee Persona
| ID | User Story | Priority |
|----|------------|----------|
| HR-US-001 | As an Employee, I want to view my payslip online so that I can access my pay history | High |
| HR-US-002 | As an Employee, I want to apply for leave online so that I can avoid paper forms | High |
| HR-US-003 | As an Employee, I want to submit claims online so that I can submit expenses easily | High |
| HR-US-004 | As an Employee, I want to clock in via mobile so that I can work at different locations | High |
| HR-US-005 | As an Employee, I want a chatbot so that I can get HR answers quickly | Medium |
| HR-US-006 | As an Employee, I want training recommendations so that I can develop my skills | Medium |

#### HR Manager Persona
| ID | User Story | Priority |
|----|------------|----------|
| HR-US-007 | As an HR Manager, I want employee profiles so that I can manage personnel data | High |
| HR-US-008 | As an HR Manager, I want automated payroll so that I can ensure accurate and timely payment | High |
| HR-US-009 | As an HR Manager, I want org charts so that I can understand reporting lines | Medium |
| HR-US-010 | As an HR Manager, I want attendance reports so that I can process payroll accurately | High |
| HR-US-011 | As an HR Manager, I want attrition predictions so that I can intervene early | Medium |
| HR-US-012 | As an HR Manager, I want HR dashboards so that I can monitor workforce metrics | Medium |

#### Manager Persona
| ID | User Story | Priority |
|----|------------|----------|
| HR-US-013 | As a Manager, I want to approve leave requests online so that I can manage team availability | High |
| HR-US-014 | As a Manager, I want to approve expense claims so that I can control team spending | High |
| HR-US-015 | As a Manager, I want performance review tools so that I can provide feedback | Medium |
| HR-US-016 | As a Manager, I want to view team attendance so that I can track productivity | Medium |
| HR-US-017 | As a Manager, I want mobile approvals so that I can approve requests on the go | Medium |

---

## 7. Technical Stack

### 7.1 Application Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | React.js | 18.x | Web application UI |
| **Mobile** | React Native / PWA | Latest | Cross-platform mobile |
| **Backend API** | Node.js / Express | 20.x | REST API services |
| **Alternative** | Java Spring Boot | 3.x | Enterprise backend option |
| **Message Queue** | RabbitMQ | 3.12.x | Async processing |
| **Cache** | Redis | 7.x | Session & data caching |
| **Search** | Elasticsearch | 8.x | Full-text search |

### 7.2 Data Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Primary Database** | PostgreSQL | 16.x | Transactional data |
| **High Availability** | Patroni + etcd | Latest | DB failover cluster |
| **Document Store** | MongoDB | 7.x | Unstructured data |
| **File Storage** | MinIO / S3 | Latest | Document storage |
| **Data Warehouse** | Apache Druid / ClickHouse | Latest | Analytics & reporting |
| **ETL** | Apache Airflow | 2.x | Data pipeline orchestration |

### 7.3 Infrastructure Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Container Orchestration** | Kubernetes | Application deployment |
| **Service Mesh** | Istio | Traffic management |
| **API Gateway** | Kong / Ambassador | API management |
| **Monitoring** | Prometheus + Grafana | Metrics & dashboards |
| **Logging** | ELK Stack (Elasticsearch, Logstash, Kibana) | Centralized logging |
| **APM** | Jaeger / Zipkin | Distributed tracing |
| **Secrets Management** | HashiCorp Vault | Credential management |

### 7.4 Security Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **WAF** | Cloudflare / ModSecurity | Web application firewall |
| **Vulnerability Scanning** | Trivy / Snyk | Container & code scanning |
| **SAST/DAST** | SonarQube / OWASP ZAP | Code security analysis |
| **Secrets Scanning** | GitLeaks / TruffleHog | Prevent secret leakage |
| **Certificate Management** | cert-manager | TLS certificate automation |

### 7.5 DevOps Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **CI/CD** | GitLab CI / GitHub Actions | Build & deployment pipeline |
| **GitOps** | ArgoCD / Flux | Kubernetes deployment |
| **IaC** | Terraform / Pulumi | Infrastructure provisioning |
| **Configuration** | Ansible | Server configuration |

---

## 8. Deployment Model

### 8.1 Branch Deployment Matrix

| Branch | Location | EMS | PS | HRMS | Users | Go-Live |
|--------|----------|-----|-----|------|-------|---------|
| **HQ** | Headquarters | ✅ | ✅ | ✅ | 150 | Phase 1 |
| **GLD** | Global Logistics Dept | ✅ | ✅ | ✅ | 100 | Phase 1 |
| **PK** | Port Klang | ✅ | ✅ | ✅ | 120 | Phase 2 |
| **PGD** | Pasir Gudang | ✅ | ✅ | ✅ | 80 | Phase 2 |
| **BTW** | Butterworth | ✅ | ✅ | ✅ | 30 | Phase 3 |
| **PB** | Padang Besar | ✅ | ✅ | ✅ | 20 | Phase 3 |
| **TOTAL** | | **6** | **6** | **6** | **500+** | **18 weeks** |

### 8.2 Deployment Phases

```
Phase 1: Foundation (Weeks 1-6)
├─ HQ & GLD Deployment
├─ Core System Setup
├─ Data Migration
└─ Initial Training

Phase 2: Expansion (Weeks 7-12)
├─ PK & PGD Deployment
├─ Process Refinement
├─ Advanced Training
└─ Integration Optimization

Phase 3: Completion (Weeks 13-18)
├─ BTW & PB Deployment
├─ Full System Integration
├─ Go-Live Support
└─ Project Handover
```

### 8.3 Environment Strategy

| Environment | Purpose | Infrastructure |
|-------------|---------|----------------|
| **Development** | Feature development | Single instance |
| **Testing** | QA & UAT | Production-like |
| **Staging** | Pre-production validation | Mirror production |
| **Production** | Live operations | Full HA cluster |
| **DR** | Disaster recovery | Warm standby |

### 8.4 Awan Kita Deployment

```
┌─────────────────────────────────────────────────────────────────┐
│                    AWAN KITA SOVEREIGN CLOUD                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Compute Layer                         │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │  App Nodes  │ │  App Nodes  │ │  App Nodes  │       │   │
│  │  │   (Zone A)  │ │   (Zone B)  │ │   (Zone C)  │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Data Layer                            │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │         PostgreSQL HA Cluster (Patroni)          │    │   │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐          │    │   │
│  │  │  │ Primary │  │ Replica │  │ Replica │          │    │   │
│  │  │  │(Zone A) │  │(Zone B) │  │(Zone C) │          │    │   │
│  │  │  └─────────┘  └─────────┘  └─────────┘          │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Network Layer                         │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │
│  │  │   Load      │  │     VPN     │  │   Private   │      │   │
│  │  │  Balancer   │  │   Gateway   │  │   Link      │      │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Success Metrics

### 9.1 KPI Framework

| Category | KPI | Target | Measurement Frequency |
|----------|-----|--------|----------------------|
| **System Performance** | Uptime | 99.9% | Real-time |
| **System Performance** | Response Time | <2 seconds | Continuous |
| **System Performance** | Error Rate | <0.1% | Daily |
| **User Adoption** | Active Users | 90% of licensed | Weekly |
| **User Adoption** | Feature Utilization | 80% of features | Monthly |
| **User Adoption** | Login Frequency | 5x per week avg | Weekly |
| **Process Efficiency** | PR Approval Time | <2 days | Weekly |
| **Process Efficiency** | Claims Processing | 3 days | Weekly |
| **Process Efficiency** | Payroll Processing | 1 day | Monthly |
| **Business Value** | Procurement Savings | 8-12% | Quarterly |
| **Business Value** | Maintenance Cost Reduction | 15-20% | Quarterly |
| **Business Value** | Inventory Reduction | 25-30% | Quarterly |

### 9.2 Success Criteria by Module

#### EMS Success Metrics

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Asset Tracking Accuracy | - | 99% | Physical vs system reconciliation |
| Maintenance Schedule Adherence | - | 95% | On-time completion rate |
| Unplanned Downtime | - | -40% | Hours lost to breakdowns |
| Parts Stock Availability | - | 99% | Fill rate metric |
| TCO Visibility | - | 100% | Assets with TCO data |

#### PS Success Metrics

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Procurement Cycle Time | - | -40% | PR to PO time |
| 3-Way Match Automation | - | 85% | Auto-matched invoices |
| Budget Compliance | - | 95% | Within-budget purchases |
| Vendor Performance Visibility | - | 100% | Vendors with scorecards |
| Spend Under Management | - | 90% | Tracked vs maverick spend |

#### HRMS Success Metrics

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Payroll Accuracy | - | 99.9% | Error-free payslips |
| Self-Service Adoption | - | 80% | Employee direct usage |
| Leave Processing Time | - | <1 day | Approval cycle time |
| Claims Processing Time | - | 3 days | Submission to reimbursement |
| Employee Satisfaction | - | 4.0/5.0 | System usability survey |

### 9.3 Reporting Cadence

| Report | Frequency | Audience |
|--------|-----------|----------|
| System Availability Report | Daily | IT Operations |
| User Adoption Dashboard | Weekly | Project Steering |
| Process Metrics Report | Weekly | Department Heads |
| Business Value Report | Monthly | Executive Sponsor |
| ROI Analysis | Quarterly | CFO / CEO |

---

## 10. Definition of Done

### 10.1 Feature Definition of Done

A feature is considered "Done" when:

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | Code is written and peer-reviewed | Pull request approved |
| 2 | Unit tests written with >80% coverage | Coverage report |
| 3 | Integration tests pass | CI/CD pipeline |
| 4 | Security scan passes (no high/critical) | SAST/DAST report |
| 5 | Code is merged to main branch | Git log |
| 6 | Feature is deployed to staging | Deployment log |
| 7 | UAT scripts executed and passed | Test results |
| 8 | Documentation is updated | Wiki/Confluence |
| 9 | Feature is approved by Product Owner | Sign-off |
| 10 | Feature is deployed to production | Deployment log |

### 10.2 Sprint Definition of Done

A sprint is considered "Done" when:

| # | Criterion |
|---|-----------|
| 1 | All committed features meet Definition of Done |
| 2 | Sprint demo completed with stakeholders |
| 3 | No critical or high defects open |
| 4 | Performance benchmarks met |
| 5 | Security review completed |
| 6 | Sprint retrospective completed |
| 7 | Next sprint planned |

### 10.3 Release Definition of Done

A release is considered "Done" when:

| # | Criterion | Evidence |
|---|-----------|----------|
| 1 | All features for the release are complete | Feature checklist |
| 2 | UAT completed with sign-off | UAT sign-off document |
| 3 | Performance testing passed | Performance report |
| 4 | Security VAPT completed with zero critical/high | VAPT report |
| 5 | Data migration plan tested and ready | Migration test results |
| 6 | Training materials complete | Training docs |
| 7 | User training completed | Attendance records |
| 8 | Runbook and support procedures ready | Runbook document |
| 9 | Rollback plan tested | Rollback test results |
| 10 | Go/No-Go decision made | Meeting minutes |

### 10.4 Project Definition of Done

The project is considered "Done" when:

| # | Criterion | Evidence |
|---|-----------|----------|
| 1 | All 37 features deployed to production | Feature matrix |
| 2 | All 6 branches live and operational | Branch status |
| 3 | All integrations operational | Integration test results |
| 4 | UAT completed for all modules | UAT certificates |
| 5 | User acceptance sign-off obtained | Sign-off documents |
| 6 | Training completed for all users | Training records |
| 7 | Documentation delivered | Documentation repository |
| 8 | Warranty period begins | Warranty certificate |
| 9 | Knowledge transfer completed | KT sign-off |
| 10 | Project closure report approved | Closure document |

---

## Appendix A: Feature Summary Matrix

### A.1 EMS Features (12)

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 1 | Asset Register & Tracking | High | Required |
| 2 | Maintenance Scheduling | High | Required |
| 3 | Repair History & Costs | High | Required |
| 4 | Asset Depreciation Tracking | High | Required |
| 5 | Warranty Management | Medium | Required |
| 6 | Equipment Utilization Reports | High | Required |
| 7 | Spare Parts Inventory | High | Required |
| 8 | Multi-Platform Interface | High | Required |
| 9 | User-Friendly Interface | High | Required |
| 10 | Audit Trail & History | High | Required |
| 11 | Comprehensive Security Features | Critical | Required |
| 12 | Reporting and Enquiries | High | Required |

### A.2 PS Features (13)

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 1 | Purchase Requisition Workflow | High | Required |
| 2 | Vendor Management and Evaluation | High | Required |
| 3 | Quotation Management | High | Required |
| 4 | Purchase Order Processing | High | Required |
| 5 | Goods Receipt and Inspection | High | Required |
| 6 | Three-Way Matching | High | Required |
| 7 | Procurement Analytics | Medium | Required |
| 8 | Budget Control and Tracking | High | Required |
| 9 | Multi-Platform Interface | High | Required |
| 10 | User-Friendly Interface | High | Required |
| 11 | Audit Trail & History | High | Required |
| 12 | Comprehensive Security Features | Critical | Required |
| 13 | Reporting and Enquiries | High | Required |

### A.3 HRMS Features (12)

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 1 | Employee Database Management | High | Required |
| 2 | Attendance and Leave Management | High | Required |
| 3 | Payroll Processing | Critical | Required |
| 4 | Claims and Reimbursement | High | Required |
| 5 | Performance Appraisal | Medium | Required |
| 6 | Training Management | Medium | Required |
| 7 | Recruitment Tracking | Medium | Required |
| 8 | HR Analytics and Reporting | Medium | Required |
| 9 | Multi-Platform Interface | High | Required |
| 10 | User-Friendly Interface | High | Required |
| 11 | Audit Trail & History | High | Required |
| 12 | Comprehensive Security Features | Critical | Required |

---

## Appendix B: Value-Added Services Summary

### Part 1: Software & Innovation (RM 1,550,000)

| No | Service | Value |
|----|---------|-------|
| 1.1 | AI Predictive Maintenance for EMS | RM 250,000 |
| 1.2 | Smart Procurement Analytics | RM 200,000 |
| 1.3 | HR Predictive Analytics (Attrition) | RM 180,000 |
| 1.4 | Vendor Risk Intelligence Module | RM 150,000 |
| 1.5 | Employee Self-Service Chatbot | RM 120,000 |
| 1.6 | Advanced BI & Reporting Suite | RM 180,000 |
| 1.7 | Document OCR for Procurement | RM 100,000 |
| 1.8 | API Developer Portal | RM 100,000 |
| 1.9 | Data Migration Accelerator | RM 150,000 |
| 1.10 | Custom Report Development (15) | RM 120,000 |

### Part 2: Support & Consultative (RM 1,230,000)

| No | Service | Value |
|----|---------|-------|
| 2.1 | Change Management Launch Kit | RM 100,000 |
| 2.2 | Annual Health Checks (3 years) | RM 120,000 |
| 2.3 | 24/7 Premium Support (3 years) | RM 350,000 |
| 2.4 | Quarterly Business Reviews | RM 80,000 |
| 2.5 | Unlimited User Training | RM 180,000 |
| 2.6 | Data Quality Assessment | RM 80,000 |
| 2.7 | Disaster Recovery Drills | RM 100,000 |
| 2.8 | Process Optimization | RM 80,000 |
| 2.9 | Knowledge Transfer | RM 60,000 |
| 2.10 | Strategic HR Analytics | RM 80,000 |

**Total Value-Added Services: RM 2,780,000**

---

## Document Control

| | |
|---|---|
| **Document Title** | TSH-2605 Support IT System - Product Requirements Document |
| **Version** | 1.0 |
| **Date** | 31 January 2026 |
| **Author** | Sinergi Elit Sdn Bhd (SESB) |
| **Classification** | Tender Submission - Confidential |
| **Tender Reference** | MMFSB/TD 02/2026 |
| **Review Cycle** | Quarterly or as required |
| **Next Review Date** | 30 April 2026 |

---

*End of Document*
