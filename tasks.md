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
- [ ] Purge legacy `app/` folder after all route groups are moved into `src/app/[lang]/`.

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

## Data Integrity & Soft Delete

- `GET` requests for users must exclude soft-deleted records by default.
- `ADMIN` can restore content from trash.
- `SUPERADMIN` can toggle "Show Deleted Items" in the content manager.
- `deletedAt` must be the only delete marker used across contracts and API mutations.
- `isActive` remains the visibility toggle for manual admin control.

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
        account/
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
- [ ] Global feedback soft hide/restore flow is implemented end-to-end.
