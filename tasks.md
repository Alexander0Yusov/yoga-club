# Yoga Club Refactor Roadmap 2026

## Критический аудит текущего состояния

- В репозитории одновременно существуют `app/` и `src/app/`, что ломает единый App Router-контур и создаёт риск расхождения маршрутов.
- `src/app/[lang]/page.tsx` сейчас является заглушкой, а не серверной композицией SEO-страницы.
- `middleware.ts` занимается только локализацией и не проверяет роли `ADMIN` / `SUPERADMIN`.
- `src/shared/api/client.ts` не передаёт `Accept-Language`, не валидирует ответы через Zod и не поддерживает теги для ISR.
- Доменный контент до сих пор завязан на моках и локальных `app/api/*` маршрутах вместо контрактного REST-слоя от NestJS.
- В кодовой базе нет отдельного слоя `src/modules` для backend-контрактов, DTO и маппинга Page Props.
- Swagger API сейчас покрывает только `App`, `Auth`, `Users`, `Security Devices` и `Testing`; доменные сущности Yoga Club в нём пока отсутствуют.

## Phase 0: Infrastructure Setup

- [ ] Зафиксировать целевую архитектуру: `src/app/[lang]` как единственный runtime для Next.js App Router.
- [ ] Удалить зависимость страниц от legacy `app/` и перенести рабочие маршруты в `src/app/[lang]`.
- [ ] Ввести единый API-клиент с `baseURL = https://yoga-club-back.vercel.app/api`.
- [ ] Добавить проброс `Accept-Language` из текущего Paraglide-роута во все REST-запросы.
- [ ] Добавить Zod-валидацию для всех ответов API и локальных mock-репозиториев.
- [ ] Ввести слой контрактов DTO:
  - `src/shared/types/api.ts`
  - `src/shared/types/session.ts`
  - `src/shared/api/dto.ts`
  - `src/shared/api/adapters/*`
- [ ] Подготовить генерацию TypeScript-интерфейсов из Swagger для frontend-слоя.
- [ ] Ввести `revalidateTag`-совместимую стратегию тегов для всех контентных запросов.
- [ ] Согласовать базовые теги контента:
  - `events`
  - `event`
  - `reviews`
  - `sections`
  - `directions`
  - `benefits`
  - `users`
- [ ] Выделить отдельные mock-репозитории для контента, который ещё не отдан backend'ом.

## Phase 1: Hybrid i18n & Data Strategy

- [ ] Использовать Paraglide только для статических UI-строк и URL-routing.
- [ ] Перенести весь доменный контент на backend `NestJS`:
  - события
  - описания
  - отзывы
  - записи
  - профили
- [ ] Сделать `Accept-Language` обязательным заголовком для всех контентных запросов.
- [ ] Зафиксировать правило: если endpoint не существует в Swagger, фронтенд использует mock-репозиторий.
- [ ] Описать маппинг `DTO -> Page Props` для:
  - `src/app/[lang]/(public)`
  - `src/app/[lang]/(auth)`
  - `src/app/[lang]/(user)`
  - `src/app/[lang]/(admin)`
- [ ] Обновить `src/shared/api/client.ts`, чтобы он поддерживал:
  - `headers`
  - `tags`
  - `next.revalidate`
  - нормализованные ошибки

## Phase 2: Rendering & Admin Overlay Logic

- [ ] Перевести все SEO-критичные тексты на Server Components.
- [ ] Исключить client-side fetching для landing и public content.
- [ ] Внедрить On-Demand ISR:
  - `POST`
  - `PATCH`
  - `DELETE`
  - webhook / server action trigger
- [ ] Определить единый механизм `revalidateTag` после мутаций backend'а.
- [ ] Сделать `AdminWrapper` на сервере:
  - проверить `user.role === "ADMIN"`
  - при успехе отрисовать admin overlay
  - не ломать SSR для гостей
- [ ] Добавить inline "Edit" controls поверх статических карточек для админов.
- [ ] Открытие редактирования выполнять через client-side modal без потери SEO-содержимого.
- [ ] Разделить права:
  - гость видит статический контент
  - админ видит overlay
  - супер-админ видит расширенные панели управления

## Phase 3: Routing & Directory Structure

- [ ] Перенести все публичные страницы в route groups под `src/app/[lang]/(public)`.
- [ ] Перенести auth flow в `src/app/[lang]/(auth)`.
- [ ] Перенести private cabinet в `src/app/[lang]/(user)`.
- [ ] Перенести panel management в `src/app/[lang]/(admin)`.
- [ ] Зафиксировать публичные маршруты:
  - `/`
  - `/events`
  - `/events/[id]`
  - `/events/archive/[id]`
- [ ] Зафиксировать private маршруты:
  - `/account/profile`
  - `/account/reviews`
  - `/account/bookings`
  - `/account/demovideos`
  - `/account/clients`
- [ ] Обновить `middleware.ts`, чтобы он был совместим с RBAC и `AdminWrapper`.
- [ ] Убрать дублирующие legacy-маршруты после миграции.

## Phase 4: Media & SEO 2026

- [ ] Перевести все изображения на `next/image`.
- [ ] Использовать локализованные `alt`-теги из backend DB.
- [ ] Добавить `sizes` для responsive и Retina поведения.
- [ ] Ввести video facades для YouTube:
  - lazy-load по клику
  - без загрузки плеера на первом рендере
- [ ] Автоматически генерировать JSON-LD:
  - `Event`
  - `VideoObject`
- [ ] Поддержать SEO-метаданные на уровне Server Components и route metadata.

## Phase 5: Auth, RBAC & Account Linking

- [ ] Синхронизировать Google / Facebook OAuth с email/password auth.
- [ ] Реализовать account linking на backend, чтобы не плодить дубликаты профилей.
- [ ] Проверить актуальную модель ролей:
  - `USER`
  - `ADMIN`
  - `SUPERADMIN`
- [ ] Описать server-side guards для protected routes.
- [ ] Вынести проверку авторизации из UI в серверный слой.

## Phase 6: Swagger Alignment & Verification

- [ ] Сверить frontend DTO с доступными Swagger схемами:
  - `UserInputDto`
  - `UserViewDto`
  - `PaginatedViewDto`
  - `UpdateUserDto`
  - `MeViewDto`
  - `PasswordRecoveryDto`
  - `ConfirmationCodeDto`
- [ ] Подготовить недостающие DTO для доменных сущностей Yoga Club.
- [ ] Проверить, что все frontend-запросы используют только существующие backend route contracts или mock fallback.
- [ ] Добавить Playwright-проверки:
  - SEO rendering
  - auth flows
  - protected routes
  - admin overlay
  - locale switching
- [ ] Проверить, что `Accept-Language` реально доходит до NestJS API.

## Finalized Directory Tree

```txt
src/
  modules/
    events/
      contracts/
    users/
      contracts/
    sections/
      contracts/
  app/
    [lang]/
      layout.tsx
      page.tsx
      (public)/
        page.tsx
        events/
          page.tsx
          [id]/
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
          profile/
            page.tsx
          reviews/
            page.tsx
          bookings/
            page.tsx
          demovideos/
            page.tsx
          clients/
            page.tsx
      (admin)/
        dashboard/
          page.tsx
        sections/
          page.tsx
        content/
          page.tsx
  entities/
    user/
      model/
      ui/
    section/
      model/
      ui/
    practice-benefit/
      model/
      ui/
    yoga-direction/
      model/
      ui/
  features/
    auth/
    admin-overlay/
    profile-edit/
    content-editing/
    language-switcher/
    event-registration/
  widgets/
    header/
    footer/
    hero/
    landing-sections/
    user-panel/
    admin-panel/
  shared/
    api/
      mocks/
    config/
    lib/
    mock/
    types/
    ui/
    utils/
```

## Swagger / Current Codebase Gaps

- Swagger exposes only:
  - `GET /api`
  - auth endpoints
  - `Users` / `SA users`
  - `Security Devices`
  - `Testing`
- Swagger does not currently expose:
  - `events`
  - `feedbacks`
  - `archive`
  - `content editing`
  - `admin overlay`
  - `revalidation hooks`
  - `account linking`
  - `locale-aware content payloads`
- Current frontend still has local REST routes that are not represented in Swagger:
  - `/api/events`
  - `/api/event`
  - `/api/feedbacks`
  - `/api/myfeedbacks`
  - `/api/user`
  - `/api/userCurrent`
  - `/api/usersAll`
  - `/api/telegram`
- Current frontend still has a placeholder locale page instead of a server-rendered public landing shell.
- Current frontend lacks a verified frontend-to-backend contract layer for domain DTOs and page props.
