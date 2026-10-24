# AIRO Database Architecture Specification
**Project:** AIRO Essentials & AIRO Health (Multi-Domain Platform)
**Target Audience:** Senior Database Manager / DBA

---

## 1. Executive Summary
This document outlines the database schema required to power the AIRO ecosystem. The platform serves two distinct web portals from a single unified codebase:
1. **AIRO Essentials** (Retail / E-Commerce / Grocery)
2. **AIRO Health** (Pharmacy / Clinic Bookings / Memberships)

The architecture requires **12 tables** utilizing strong relational integrity, specifically utilizing UUIDs for Primary Keys (PK) and Foreign Keys (FK) with cascading deletes where appropriate.

---

## 2. Table Structures & Constraints

### 2.1 Identity & User Management

**Table: `User`**
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | **PK** | Unique user identifier |
| `email` | VARCHAR | **UNIQUE** | Used for cross-domain SSO |
| `passwordHash` | VARCHAR | | Bcrypt encrypted password |
| `firstName` | VARCHAR | Nullable | |
| `lastName` | VARCHAR | Nullable | |
| `role` | ENUM | Default: `CUSTOMER` | (`CUSTOMER`, `ADMIN`) |

**Table: `Address`**
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | **PK** | |
| `userId` | UUID | **FK** -> `User.id` | Cascade Delete |
| `street`, `city`, `state`, `postalCode`, `country` | VARCHAR | | |
| `isDefault` | BOOLEAN | Default: `false` | |
| `type` | ENUM | Default: `SHIPPING` | (`SHIPPING`, `BILLING`) |

### 2.2 E-Commerce & Retail

**Table: `Category`**
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | **PK** | |
| `name` | VARCHAR | | |
| `slug` | VARCHAR | **UNIQUE** | URL friendly identifier |
| `description` | TEXT | Nullable | |

**Table: `Product`**
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | **PK** | |
| `name`, `description`, `imageUrl` | VARCHAR | | |
| `slug` | VARCHAR | **UNIQUE** | |
| `price` | FLOAT/DECIMAL| | |
| `stockQuantity` | INT | Default: `0` | |
| `categoryId` | UUID | **FK** -> `Category.id` | |
| `domainContext` | ENUM | Default: `BOTH` | (`HEALTH`, `ESSENTIALS`, `BOTH`) filters visibility per site |

**Table: `Order`**
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | **PK** | |
| `userId` | UUID | **FK** -> `User.id` | |
| `status` | ENUM | Default: `PENDING` | (`PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`) |
| `totalAmount` | FLOAT/DECIMAL| | |

**Table: `OrderItem`**
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | **PK** | |
| `orderId` | UUID | **FK** -> `Order.id` | Cascade Delete |
| `productId` | UUID | **FK** -> `Product.id` | |
| `quantity` | INT | | |
| `priceAtPurchase` | FLOAT/DECIMAL| | Locks in price historically |

### 2.3 Full-Scale Enterprise Features

**Table: `Appointment`** (AIRO Health Services)
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | **PK** | |
| `userId` | UUID | **FK** -> `User.id` | Cascade Delete |
| `serviceType` | ENUM | | (`MINUTE_CLINIC`, `HEALTH_CHAIR`, `CONSULTATION`) |
| `date` | DATETIME | | |
| `status` | ENUM | Default: `SCHEDULED`| (`SCHEDULED`, `COMPLETED`, `CANCELLED`) |

**Table: `Subscription`** (AIRO One Membership)
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | **PK** | |
| `userId` | UUID | **FK** -> `User.id` | Cascade Delete |
| `planName` | VARCHAR | | |
| `status` | ENUM | Default: `ACTIVE` | (`ACTIVE`, `PAST_DUE`, `CANCELLED`) |
| `renewalDate` | DATETIME | | |

**Table: `Review`** (Social Proof)
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | **PK** | |
| `userId` | UUID | **FK** -> `User.id` | Cascade Delete |
| `productId` | UUID | **FK** -> `Product.id` | Cascade Delete |
| `rating` | INT | Check `1 <= x <= 5`| |
| `comment` | TEXT | Nullable | |

**Table: `PaymentTransaction`** (Financial Ledger)
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | **PK** | |
| `userId` | UUID | **FK** -> `User.id` | Cascade Delete |
| `orderId` | UUID | **FK** -> `Order.id` | Nullable |
| `subscriptionId` | UUID | **FK** -> `Subscription.id`| Nullable |
| `provider` | VARCHAR | | e.g. "STRIPE", "PAYPAL" |
| `transactionId` | VARCHAR | | Provider receipt ID |
| `amount` | FLOAT/DECIMAL| | |
| `status` | ENUM | Default: `PENDING` | (`PENDING`, `SUCCESS`, `FAILED`, `REFUNDED`) |

### 2.4 Marketing & Analytics

**Table: `Lead`** (CRM System)
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | **PK** | |
| `email` | VARCHAR | | |
| `source` | ENUM | | (`CHATBOT`, `POPUP`, `CONTACT_FORM`) |
| `status` | ENUM | Default: `NEW` | (`NEW`, `CONTACTED`, `CONVERTED`) |

**Table: `PageVisit`** (Telemetry)
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | **PK** | |
| `sessionId` | VARCHAR | | Anonymous tracking |
| `domain` | ENUM | | (`HEALTH`, `ESSENTIALS`) |
| `path` | VARCHAR | | |

---

## 3. Relationships Mapping
- **1:N (One to Many)**
  - `User` has many `Address`
  - `User` has many `Order`
  - `User` has many `Appointment`
  - `User` has many `Subscription`
  - `User` has many `Review`
  - `User` has many `PaymentTransaction`
  - `Order` contains many `OrderItem`
  - `Product` appears in many `OrderItem`
  - `Product` has many `Review`
  - `Category` groups many `Product`
  - `Subscription` renews via many `PaymentTransaction`

- **1:1 or 1:N Optional**
  - `Order` is paid by `PaymentTransaction`

*All tables include implicit `createdAt` and `updatedAt` datetime fields.*
