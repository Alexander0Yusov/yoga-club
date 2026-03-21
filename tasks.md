# Yoga Club Refactor Roadmap 2026

## Critical Audit

- `app/` and `src/app/` still coexist, so the App Router source of truth is split.
- `src/app/[lang]/page.tsx` is still a placeholder instead of a server-rendered SEO entry.
- `middleware.ts` only handles locale routing and does not enforce RBAC.
- `src/shared/api/client.ts` did not yet support locale headers, atomic mutations, or soft delete.
- Domain contracts were missing lifecycle fields, so `isActive` and `deletedAt` were not part of the source of truth.
- Legacy `app/` routes and old dashboard splits are incompatible with the new flat dashboard strategy.

## Phase 0: Infrastructure Setup

- [x] Create `src/modules/_shared/contracts/isoUtcDateTime.ts`.
- [x] Create `src/modules/_shared/contracts/entityLifecycle.ts`.
- [x] Update all domain contracts in `src/modules/*/contracts/` to include:
  - `isActive: boolean`
  - `deletedAt: isoUtcDateTime | null`
- [x] Update `UserSchema` to include `viewMode?: "USER" | "ADMIN" | "SUPERADMIN"`.
- [x] Add `AboutMe` side-by-side contract with `left` / `right` pair logic.
- [x] Refactor `src/shared/api/client.ts` into an atomic API layer.
- [x] Add independent mutation methods:
  - `updateSection`
  - `updateAboutPair`
  - `updateEvent`
- [x] Replace hard delete flows with `softDelete` methods that patch `deletedAt`.
- [x] Ensure every request sends `Accept-Language`.
- [x] Filter `GET /users` requests by `deletedAt=null` by default.
- [PAUSED] Purge legacy `app/` folder after all route groups are moved into `src/app/[lang]/`.

## 🏗 Architecture Rule: The Strangler Pattern (Active)

- Backend Strategy: Keep the functional API surface in the root `app/api/`. New endpoints (like for `About Me`) must be added here to maintain SSR/Routing stability.
- Frontend Strategy: All UI, Components, and Modules must be strictly in `src/`.
- Phase-Out: The root `app/` directory will remain until the final transition to the external backend. No aggressive migrations to `src/app/api/` are allowed for now.
- Goal: Stability and speed of feature delivery.
- Policy signed: Active by Codex on 2026-03-21.

## Contract Rules

- All contracts must remain TypeScript-first and Zod-validated.
- No imports from `entities/` or `models/` are allowed inside contract files.
- `src/modules/*/contracts` is the source of truth for backend, frontend, and admin flows.
- Temporal fields must always use `isoUtcDateTime`.
- No `any` types are allowed in contract definitions.

## Routing & i18n Foundation

- Move all routes to `src/app/[lang]/`.
- Keep Paraglide-js for URL-based language routing and static UI labels only.
- Add a global language switcher in the header.
- Remove language persistence from profile/DB logic.
- Public routing:
  - `/events/upcoming`
  - `/events/archive`
  - `/events/[id]`
- Private routing:
  - `/account`
  - `?tab=general`
  - `?tab=bookings`
  - `?tab=reviews`
- Admin routing:
  - flat CRUD tables
  - independent modals
  - trash / restore toggle for superadmins

## Data Integrity & Feedback Lifecycle (Refactored)

- **Three-Tier Filtering (GET /api/feedbacks):**
  - `USER`: Returns only records where `isActive: true` AND `deletedAt: null`.
  - `ADMIN`: Returns all records where `deletedAt: null` (can view hidden `isActive: false` content).
  - `SUPERADMIN`: Returns all records including the trash, provided the "Show Trash" toggle is enabled.

- **Action Permissions & RBAC:**
  - `ADMIN` / `SUPERADMIN`: Authorized to toggle `isActive` (moderation) and execute `softDelete` (move to trash).
  - `ADMIN` / `SUPERADMIN`: Authorized to restore content from trash (resetting `deletedAt` to `null`).
  - **HARD DELETE (Permanent):** Physical database deletion is EXCLUSIVELY restricted to the user with email `yusovsky2@gmail.com`, and only for records already residing in the trash.

- **State & Markers:**
  - `deletedAt`: The sole deletion marker (`isoUtcDateTime | null`). If populated, the object is considered "trashed."
  - `isActive`: The sole visibility marker for the public landing page (`boolean`). Allows for hiding feedback without removing it from the main list.
  - **Persistence:** The current `viewMode` (USER/ADMIN/SUPERADMIN) must always synchronize with `localStorage` to ensure state persistence after a page refresh.

- **Mock Integrity:**
  - Seed data (Mocks) must represent all 4 state combinations (`Active`, `Hidden`, `Trashed`, `Legacy`) to validate API filtering accuracy and UI conditional rendering.

## Events Lifecycle & Management

- [x] Three-tier filtering for `GET /api/events` is implemented for `USER`, `ADMIN`, and `SUPERADMIN`.
- [x] `softDelete` and `restore` on events are protected by RBAC.
- [x] Hard delete for events is restricted to `yusovsky2@gmail.com`.
- [x] Events gallery and item components are integrated with lifecycle controls.
- [x] Ten diverse event mocks can be seeded with placeholder visuals.

## Finalized Directory Tree

```txt
src/
  app/
    [lang]/
      layout.tsx
      (public)/
        events/
          upcoming/
            page.tsx
          archive/
            page.tsx
          [id]/
            page.tsx
      (auth)/
        signin/
          page.tsx
        signup/
          page.tsx
      (user)/
        profile/
          page.tsx
          events/
            page.tsx
          myfeedbacks/
            page.tsx
          feedbacks/
            page.tsx
          demovideos/
            page.tsx
          users/
            page.tsx
      (admin)/
        dashboard/
          page.tsx
        content/
          page.tsx
  modules/
    _shared/
      contracts/
        isoUtcDateTime.ts
        entityLifecycle.ts
    users/
      contracts/
    sections/
      contracts/
    events/
      contracts/
    about-me/
      contracts/
    club-contact/
      contracts/
    my-event/
      contracts/
    yoga-direction/
      contracts/
    our-service/
      contracts/
    feedback/
      contracts/
    practice-benefit/
      contracts/
    demo-video/
      contracts/
    hero-intro/
      contracts/
  shared/
    api/
      client.ts
      mocks/
    config/
    lib/
    types/
    ui/
    utils/
  entities/
    user/
    section/
    practice-benefit/
    yoga-direction/
  features/
    admin-overlay/
    content-editing/
    language-switcher/
  widgets/
    header/
    footer/
    landing-sections/
```

## Swagger / Codebase Gaps

- Swagger currently only exposes auth/users/security/testing flows.
- Domain endpoints for events, feedback, content editing, restore flows, and account linking are still missing.
- Local `app/api/*` routes are legacy and should be removed once backend contracts are wired everywhere.
- `AdminWrapper` and the flat dashboard still need to be implemented on top of the new contracts.

## Rollback Reality Sync

- [ ] Admin Checkbox ("Assign Admin") in users list is implemented and bound to role mutation.
- [ ] Entity editing modals in `features/` or `shared/ui/` are restored.
- [x] Global feedback soft hide/restore flow is implemented end-to-end.
