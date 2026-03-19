# Project: Yoga-Club (Fullstack)

# Strategy: Frontend-Backend Separation (API-First)

## 1. Core Mandate: "Strict Decoupling"

- **Architecture**: The project is split into two independent services: **Next.js (Frontend)** and **NestJS (Backend)**.
- **Data Flow**: The Frontend MUST fetch data ONLY via REST API from `https://yoga-club-back.vercel.app/api`.
- **Strict Prohibition**: It is strictly forbidden to import database drivers (Mongoose, TypeORM) or backend-specific logic into the Next.js project. Use DTOs and interfaces only.
- **Mocking**: Since the backend is under development, all content endpoints must be implemented using **Mock Data** on the frontend side to allow immediate UI and SEO testing.

## 2. Architectural Layers (Next.js App Router + FSD)

The project MUST use **Next.js App Router** (the `src/app/` directory). Usage of the `pages/` directory (Pages Router) is prohibited.

### Directory Structure:

- **src/app/[lang]/**: Root of the application with Paraglide JS localization.
  - **(public)/**: Public SEO-friendly pages (Landing, Directions, About Us).
  - **(auth)/**: Authentication flows (Login, Registration).
  - **(user)/**: Private routes for users (Profile, My Events).
  - **(admin)/**: Management panel (Dashboard, Section Management, Content Editing).
- **src/entities/**: Domain models and RBAC (Role-Based Access Control) logic (`User`, `Section`, `PracticeBenefit`, `YogaDirection`).
- **src/shared/**: Common UI components (Tailwind/Shadcn), API clients, and Paraglide utilities.

## 3. Implementation Rules for AI (Codex)

- **SEO First**: All text content (Hero, Benefits, etc.) MUST be fetched within **Server Components**. No client-side fetching (`useEffect`/`fetch`) is allowed for primary SEO text.
- **Parallel Loading**: Use `Promise.all` in Server Components to fetch multiple sections simultaneously (avoiding request "waterfalls").
- **RBAC (Access Control)**: Implement access levels: `USER`, `ADMIN`, `SUPERADMIN` via Middleware and server-side checks.
- **Validation**: Use **Zod** for all form schemas and API response validation.
- **Composition**: Apply **Vercel Composition Patterns** to ensure component flexibility and eliminate "prop drilling."

## 4. Specific Business Logic & Entities

- **Section Entity**: Must contain `{ name: string, landingIndex: number }`. The landing page layout is built dynamically by sorting these sections by `landingIndex`.
- **User Entity**: Contains `{ email, role, telephone, isSubscribed, ... }`. Authentication requires only Email/Pass; additional info is collected later in the user's personal cabinet.
- **PracticeBenefit**: Contains `{ text: string, slavefield: string }`.
- **Dates**: All dates must be transmitted and stored exclusively as **ISO UTC strings**.

## 5. Communication & Tools

- **Language**: Source code and variables in **English**. Documentation (`tasks.md`) and code comments in **Russian**.
- **Testing**: Use **Playwright (MCP)** for E2E testing of authentication, SEO rendering, and role-based permissions.
- **Deployment**: Target platform is **Vercel**, utilizing `deploy-to-vercel` and `vercel-react-best-practices` skills.
