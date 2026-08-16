# FinSync Digital Banking Platform — Project Specification & Prompt

You are building or enhancing **FinSync**, a full-stack, enterprise-grade Digital Banking & Wealth Management web platform designed for modern clients and administrators.

---

## 1. Project Overview & Architecture

- **Project Name**: FinSync Digital Banking Platform
- **Application Type**: Multi-Currency Banking, P2P Money Transfers, Expense Analytics & Vault Savings System
- **Architecture**: Separated Full-Stack Architecture (Spring Boot 3 REST API Backend + React 18 SPA Frontend)
- **Database Engine**: Relational MySQL Database (`jdbc:mysql://127.0.0.1:3306/finsync_db?createDatabaseIfNotExist=true`) with embedded H2 fallback.

---

## 2. Technology Stack

### Backend Layer (Java Spring Boot)
- **Language & Framework**: Java 17/21, Spring Boot 3.2.x, Spring Data JPA, Hibernate.
- **Security & Auth**: Spring Security 6, Stateless JWT (JSON Web Tokens) with SHA-256 HMAC signing, BCrypt password hashing.
- **API Standard**: RESTful JSON APIs (`/api/auth`, `/api/accounts`, `/api/transfer`, `/api/expenses`, `/api/savings-goals`).
- **Transaction Safety**: `@Transactional(isolation = Isolation.READ_COMMITTED)` ensuring ACID compliance and double-entry ledger bookkeeping.

### Frontend Layer (React 18 & Vite)
- **UI Library**: React 18, Vite build engine, `react-router-dom` with protected router guards (`<ProtectedRoute>`).
- **Network Client**: Axios HTTP client with request interceptors (injecting `Authorization: Bearer <token>`) and response interceptors (handling 401 session expiration).
- **Design System**: Vanilla CSS glassmorphic UI tokens (`index.css`), Lucide React iconography, dynamic Dark/Light mode theme switching.

---

## 3. Key Modules & Functional Requirements

### 1. Authentication & Role-Based Security Module
- **Registration (`/register`)**:
  - Requires `fullName`, `email`, `phoneNumber`, `password`, and `role` selection (`USER` - Standard Client Account vs `ADMIN` - System Manager).
  - Enforces strict RFC email regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) and minimum 10-digit mobile phone regex.
  - Browser auto-fill disabled (`autoComplete="off"`, `autoComplete="new-password"`).
  - **Post-Registration Flow**: Does **not** auto-login to dashboard; displays a success toast and redirects to `/login` requiring manual sign-in.
- **Login (`/login`)**:
  - Validates email formatting and authenticates credentials against BCrypt hashed database entries.
  - Returns signed JWT token and user profile payload saved in `localStorage`.
- **Sign Out Control**:
  - Sign Out button positioned in the sidebar footer and top header with a confirmation modal overlay.

### 2. Accounts & Virtual Debit Cards Showcase (`/accounts`)
- **3 Cards per Row Grid**: Displays virtual debit cards in a 3-column row grid layout (`grid-3`).
- **ISO 7810 Card Sizing**: Formatted to international card proportions (`aspect-ratio: 1.586 / 1; width: 100%; max-width: 100%`).
- **Distinct Color Themes per Account Type**:
  - `SAVINGS` $\rightarrow$ Emerald Teal Green (`#064e3b` to `#10b981`) with `SAVINGS` badge.
  - `CURRENT` $\rightarrow$ Royal Cobalt Blue (`#1e1b4b` to `#6366f1`) with `CURRENT` badge.
  - `BUSINESS` $\rightarrow$ Dark Obsidian & Gold (`#0f172a` to `#f59e0b`) with `BUSINESS` badge.
  - `INVESTMENT` $\rightarrow$ Deep Cyan Sapphire (`#083344` to `#22d3ee`) with `INVESTMENT` badge.
  - `GOLD` $\rightarrow$ Bronze Gold (`#78350f` to `#f59e0b`) with `GOLD` badge.
- **Account Management**: Open new accounts instantly with zero fees, view live balance toggle (`Eye` / `EyeOff`), execute deposits/withdrawals, and search/filter statement ledgers.

### 3. Financial Ledger & P2P Money Transfers (`/transfer`)
- **Atomic Fund Transfers**:
  - Source account selection, recipient account validation, and instant balance verification.
  - Generates matching `TRANSFER_OUT` (debit) and `TRANSFER_IN` (credit) transaction entries.
  - Renders a digital transaction receipt overlay with reference IDs upon completion.

### 4. Expense Analytics Module (`/expenses`)
- Categorized spending logs (Food, Housing, Utilities, Shopping, Transport).
- Budget threshold progress bars and category breakdown percentages.
- Single-click expense entry deletion.

### 5. Vault Savings Goals Module (`/savings`)
- Dedicated high-yield 5.50% APY savings goals.
- Target progress tracking with animated progress bars and percentage meters.
- Contribution deposit modals and automated `Achieved 🎉` milestone celebration badges.

### 6. Integrated Profile & Workspace Preferences (`/profile`)
- **Full-Width Page Layout**: Spans full content width (`width: 100%`) without centered box boundaries, card borders, or unnecessary whitespace gaps.
- **User Profile Display**: Displays avatar initials, full legal name, email, verified client badge, assigned role (`USER` vs `ADMIN`), account limits (₹5,00,000 daily limit), and dark/light mode toggle.

### 7. Global Notifications & Design System
- **Top-Right Toast Notifications**: Toast alerts fixed at the top-right corner (`top: 24px; right: 24px; z-index: 120`).
- **Bold Typography**: High-contrast text sizes (`font-size: 1rem+`) and bold font weights (`font-weight: 700 / 800`) across form labels, buttons, metrics, and tables.
