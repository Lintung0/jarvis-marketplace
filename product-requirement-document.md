# PRODUCT REQUIREMENT DOCUMENT (PRD)
## Project Name: Modesy – Marketplace & Classified Ads Platform Optimization
## Target Audience: AI Software Engineer Agents, Senior Developers, QA Engineers
## Software Version Lifecycle: v2.6.4 Baseline
## Author / Project Owner: Lin

---

## 💡 AI AGENT EXECUTION DIRECTIVE (READ THIS FIRST)
> **CRITICAL INSTRUCTION FOR AI AGENTS:** > This document uses strict semantic tokens and strict logical constraints. When parsing this file, you must treat every feature as a loosely coupled but highly cohesive micro-component. Never hallucinate functions or bypass data validation layers specified in the tables below. Maintain cross-device data synchronization state rules and strict hierarchical logic during code generation.

---

## 1. PRODUCT SUMMARY & ARCHITECTURAL SCOPE
Modesy is an enterprise-grade web application architecture combining a multi-vendor marketplace with a dynamic classified ads listing system. The platform allows hot-swapping operational modes via the central Admin Panel without restructuring the underlying global database tables.

### 1.1 Core Modality Definition
1. **Marketplace Mode:** Traditional e-commerce processing with cart management, multi-currency transaction checkout, vendor commission deductions, and integrated escrow/wallet flows.
2. **Classified Ads Mode:** Direct peer-to-peer connection model focusing on optimized listing indexes, custom dynamic metadata fields, and ad space monetization, bypassing the automated cart checkout engine.

---

## 2. SYSTEM INVENTORY & LOGICAL REQUIREMENTS MAP

### 2.1 Core Platform & E-commerce Transaction Engine

| Feature Token | Core Requirement Description | Strict Validation Rules & AI Constraints (Anti-Error Boundary) |
| :--- | :--- | :--- |
| `FEAT-CORE-001` | **Dynamic Product Options**<br>Unlimited multidimensional variations (Size, Color, Material, etc.) with custom prices, stock metrics, and dependencies. | **Edge Case:** AI must inject an inventory-check transaction lock. Do NOT allow customer checkouts for a variation combo if stock level <= 0 unless `backorder_allowed = true`. |
| `FEAT-CORE-002` | **Hierarchical Commission System**<br>Layered revenue deduction matrix: Product-level override > Vendor-level override > Category-level default > Global System Fallback. | **Precision Rule:** All commission calculations must use decimal point matching (`BCMath` library in PHP) to prevent floating-point calculation leakage. |
| `FEAT-CORE-003` | **AI Content Generation Engine**<br>Seamless integration with OpenAI API to generate structural SEO product copy, meta descriptions, blog text, and localized variations. | **Fallback Logic:** Implement asynchronous queue workers with rate-limit wrappers. If OpenAI fails (Timeout/HTTP 429), fall back smoothly to manual input forms without killing frontend UI rendering. |
| `FEAT-CORE-004` | **Database-Driven Cart Continuity**<br>Shopping cart architecture persistent via persistent user session model inside the database tables. | **Sync Rule:** When a guest user logs in, the active session cart must auto-merge with their existing database account cart without overriding duplicate items (accumulate quantities instead). |
| `FEAT-CORE-005` | **Alternative Selling (Bidding System)**<br>"Request a Quote" negotiation channel for premium/industrial assets instead of instant payment. | **State Matrix:** Transition lifecycle states must strictly follow: `Draft` -> `Quote Requested` -> `Counter-Offer` -> `Approved By Both` -> `Unlocked for Checkout`. |
| `FEAT-CORE-006` | **Affiliate Link Program**<br>Unique ambassador referral URL tracking with automated cookie tracking (30-day window baseline). | **Security Rule:** Prevent self-referral fraud by validating that the checkout customer account ID != affiliate ambassador link owner ID. |

### 2.2 Vendor Hub & Marketplace Ecosystem
* **Isolated Vendor Dashboard (`FEAT-VND-001`):** A dedicated administrative perimeter protecting individual shop operational workflows. Vendors can only read/write telemetry belonging to their specific merchant ID filter.
* **Centralized Brand Library (`FEAT-VND-002`):** Central library managed by Super Admin. Vendors cannot create loose strings for brands; they must map product listings to pre-approved system taxonomy nodes to maintain clean faceted search filtering.
* **Earning & Payout Protocol (`FEAT-VND-003`):** Payout requests via standard institutional gateways (PayPal, IBAN, SWIFT). Balance release calculations must verify that the corresponding customer order has cleared the `Refund Grace Window` (configured in admin).

---

## 3. TECH STACK, SCALABILITY, & PERFORMANCE SPECIFICATIONS

JUST FOR INFORMATION :
jadi aku udah sempet untuk membuat cloning website marketplace modesy ini bro bisa kamu cross cek secara menyeluruh dan secara maksimal setelah itu kamu tinggal lanjutkan dan memaksimalkan progress nya ya. dan kalau bisa buat file todo juga jadi setiap progress kita biar ada catatan nya nanti misal mengerjakan apa jika berhasil di centang gitu.

 iya bro. gini bro jadi tuh aku ngerasa modesy-clone ku tuh kurang banget dari segi desain trus waktu aku liat punya temen ku desain nya lumayan sih jadi nya aku minta prompt nya dia kan  
   nah akan ku kasih tau ke kamu ya prompt temen ku bagaimana @/home/kirek/Downloads/Telegram\ Desktop/promt\ 1.odt aku ingin desain UI yang modern interaktif dan aku ingin ada kesan neon   
   nya gitu bro jadi kesan nya kyk street city punk gimana bisa ngga kamu ngelanjutin fitur dan memaksimalkan desain UI nya juga?                                                             
