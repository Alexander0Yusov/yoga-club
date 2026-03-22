# Frontend Migration Plan

## Цель

Перенести фронтенд в единое новое дерево маленькими безопасными шагами, не теряя рабочее состояние на каждом этапе.

Источники истины:
- текущий проект `yoga-club`
- резервный репозиторий `reserve`

Текущий чекпоинт:
- [x] Auth feature slice перенесен в `src/features/auth/ui`
- [x] Проверка типов пройдена: `npx tsc --noEmit`
- [x] Account shell slice перенесен в `src/app/[lang]/(user)/account` и связан с `src/features/account/ui`
- [x] Account slice проверен повторно после переноса: `npx tsc --noEmit`
- [x] Public landing shell slice сведен к `src/widgets/landing-sections/LandingSections` и использует мост в `app/[lang]/page.tsx`
- [x] Feedback публичный slice сведен к `src/features/feedback/ui/FeedbackSection` и canonical `src/widgets/landing-sections/FeedbackSlider`
- [x] Events public slice сведен к `src/features/events/ui/EventsGallery` и `src/features/events/ui/EventsItem`, legacy pages стали мостами
- [x] Events root cleanup завершен: `app/[lang]/events/*` больше не содержит self-redirects, `upcoming` и `archive` рендерят реальные публичные страницы
- [x] Root auth component duplicates удалены, канонические формы и shell остались только в `src/features/auth/ui`
- [x] Account entrypoints переведены на `/${lang}/account`: auth redirects и header profile link теперь ведут в новый кабинет
- [x] Legacy profile deep links сведены к редиректам на `/${lang}/account` и `/${lang}/events/upcoming`, чтобы старые tab routes не ломали миграцию
- [x] Legacy profile layout очищен до нейтрального wrapper-а без старого UI, чтобы не мигал профильный shell поверх account
- [x] Старые profile-UI компоненты `LinksProfilePage` и `UserBlock` удалены как dead code
- [x] Legacy profile subpages удалены, root `app/[lang]/profile` остался только как bridge на account
- [x] Legacy `/profile` bridge удален полностью, канонический кабинет окончательно закреплен за `/account`
- [x] Auth route pages перенесены в `src/app/[lang]/(auth)` и root `signin/signup` удалены как route duplicates
- [x] Root landing page duplicate `app/[lang]/page.tsx` удален, canonical home остался в `src/app/[lang]/page.tsx`
- [x] Root `app/[lang]/events` удален полностью, canonical events routes перенесены в `src/app/[lang]/(public)/events`
- [x] `app/[lang]/i18n.ts` перенесен в `src/app/[lang]/i18n.ts`, чтобы canonical layout provider imports остались рабочими после удаления root `[lang]`
- [x] `.next` очищен после удаления profile subpages, `npx tsc --noEmit` снова проходит
- [x] Canonical events routes живут в `src/app/[lang]/(public)/events`, root `app/[lang]/events` удален полностью
- [x] API boundary cleanup slice: current user, user list, profile update, signup, and header hydration now use `src/shared/api/client.ts`
- [x] API boundary cleanup slice extended to feedback/events galleries, feedback form, event form, and event delete actions via `src/shared/api/client.ts`
- [x] External/server fetch cases consolidated: telegram contact form plus public feedback/events server loaders now use shared API helpers
- [x] Shared UI slice started: canonical `ModalWindow`, `Portal`, `BackButton`, and `IconClose` live in `src/shared/ui`, and new public/event views import them
- [x] Legacy root UI duplicates removed: old feedback/events/contact/admin wrappers and shared `0_ui` modal/back/button/portal/arrow components deleted after shared UI migration
- [x] Account form slice completed: `ProfileForm` moved into `src/features/account/ui`, and the root `components/ProfileForm` duplicate removed
- [x] Event form slice completed: `FormCreateEvent` moved into `src/features/events/ui`, and the root `components/FormCreateEvent` duplicate removed
- [x] Tiny legacy component cleanup: root `ButtonOpenFormFeedback`, `DateTimePicker`, `ImagesUrlList`, `SwitchInput`, `FeedbacksItem`, and `MyFeedbacksItem` removed after canonical copies had already moved into `src/features/*`

Правило:
- `reserve` используем как опорную базу для сверки и переноса проверенных фрагментов.
- текущий проект считаем рабочим контуром, который нужно мигрировать без поломки auth, SSR и публичных страниц.

## Базовые правила миграции

- Мигрируем только одну фичу или один изолированный слой за раз.
- После каждого шага обязательно запускаем `npx tsc --noEmit`.
- Если типы не сошлись, шаг считается не завершенным.
- Если `tsc` упал, возвращаемся на checkpoint-коммит перед шагом и не идем дальше.
- Пока шаг не подтвержден, старую реализацию не удаляем.
- Если реальная UI-часть еще не готова, ставим простую HTML + Tailwind-заглушку, чтобы сохранить размеры, отступы и ритм страницы.
- Каждый шаг завершается только после успешной проверки типов и отдельного коммита.
- После каждого успешного шага обновляем этот документ, чтобы при отключении света было видно, на чем остановились.

## Протокол одного шага

1. Сверить текущий slice с `reserve`.
2. Сделать checkpoint-коммит перед миграцией шага.
3. Перенести только заявленный slice.
4. Если нужно, временно поставить заглушки вместо сложной логики.
5. Запустить `npx tsc --noEmit`.
6. Если проверки прошли, сделать финальный коммит шага.
7. Если проверки не прошли, откатиться на checkpoint-коммит и зафиксировать проблему отдельно.

## Формат коммитов

- `chore: checkpoint before <feature>`
- `chore: complete <feature> migration`

Пример:
- `chore: checkpoint before signin migration`
- `chore: complete signin migration`

## Очередность миграции

### 0. Синхронизация с резервным репозиторием

Цель:
- Зафиксировать, какие части уже готовы в `reserve`.
- Определить актуальные slices для переноса.
- Не тащить старый код без проверки на соответствие новой архитектуре.

Что делаем:
- сравниваем структуру каталогов
- сверяем готовые фичи
- отмечаем расхождения в плане
- переносим только проверенные блоки

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before reserve sync`
- После шага: `chore: complete reserve sync`

---

### 1. Базовый каркас приложения

Цель:
- Перенести самые нижние и общие точки входа.
- Стабилизировать layout, провайдеры, шапку, футер и общую оболочку.

Что мигрируем:
- `src/app/layout.tsx`
- `src/app/[lang]/layout.tsx`
- общие провайдеры
- общий shell страницы

Заглушки:
- Если часть шапки или футера еще не готова, использовать простой нейтральный блок с Tailwind.

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before app shell migration`
- После шага: `chore: complete app shell migration`

---

### 2. Страницы аутентификации

Цель:
- Перенести `signin` и `signup` без потери формы и без поломки центрирования.

Что мигрируем:
- `app/[lang]/signin/page.tsx`
- `app/[lang]/signup/page.tsx`
- связанные формы входа и регистрации

Заглушки:
- Если часть формы еще не готова, оставить упрощенный panel-card с теми же размерами и базовыми полями.

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before auth pages migration`
- После шага: `chore: complete auth pages migration`

---

### 3. Авторизационная логика и auth shell

Цель:
- Убедиться, что вход, выход и сессия работают без фликера.

Что мигрируем:
- `PanelSignForm`
- `SigninForm`
- `SignupForm`
- `SignOutButton`
- server/client guards для auth-страниц

Заглушки:
- Если часть защищенной логики еще не перенесена, временно показывать простой placeholder вместо сложного состояния.

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before auth logic migration`
- После шага: `chore: complete auth logic migration`

---

### 4. Личный кабинет пользователя

Цель:
- Перенести личный кабинет и связанные вкладки.
- Сохранить работу профиля, view mode и базовых данных пользователя.

Что мигрируем:
- `src/app/[lang]/(user)/account/page.tsx`
- профильные формы
- табы кабинета
- блоки личных данных

Заглушки:
- Если часть табов еще не готова, показывать простую карточку-заглушку с названием вкладки и базовым текстом.

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before account migration`
- После шага: `chore: complete account migration`

---

### 5. Публичные страницы лендинга

Цель:
- Перенести главную страницу и публичные SEO-блоки.

Что мигрируем:
- hero
- about
- services
- benefits
- feedbacks
- любые публичные секции landing page

Заглушки:
- Для неготовых секций использовать простой Tailwind-блок с заголовком, коротким текстом и фиксированной высотой.

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before landing migration`
- После шага: `chore: complete landing migration`

---

### 6. Отзывы и слайдеры

Цель:
- Перенести отзывы без поломки ширины, высоты и автопрокрутки.

Что мигрируем:
- feedback slider
- feedback list
- modals для текста отзыва
- рейтинг и аватары

Заглушки:
- Если данные или слайдер еще не готовы, оставить простой список отзывов в карточках.

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before feedback migration`
- После шага: `chore: complete feedback migration`

---

### 7. События и галереи

Цель:
- Перенести события, архив и карточки событий.

Что мигрируем:
- public events pages
- gallery
- detail page
- admin controls для событий

Заглушки:
- Если сложная часть галереи еще не готова, ставить простой grid из карточек с title, date и badge status.

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before events migration`
- После шага: `chore: complete events migration`

---

### 8. Общие UI-компоненты

Цель:
- Унести в новое дерево все компоненты, от которых зависят страницы выше.

Что мигрируем:
- кнопки
- инпуты
- тумблеры
- модалки
- карточки
- базовые layout components

Заглушки:
- Если компонент зависит от неготового data-flow, сделать минимальную версию с тем же API пропсов.

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before shared ui migration`
- После шага: `chore: complete shared ui migration`

---

### 9. API boundary cleanup

Цель:
- Убрать прямые зависимости фронтенда от старого дерева там, где уже есть новое.

Что мигрируем:
- вызовы API
- shared client
- DTO / contracts
- адаптеры данных

Заглушки:
- Если endpoint еще не готов, использовать mock response на фронтенде, но без ломки интерфейса.

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before api boundary cleanup`
- После шага: `chore: complete api boundary cleanup`

---

### 10. Финальная зачистка legacy-слоя

Цель:
- Удалить старые дубли и зафиксировать единый фронтенд-контур.

Что проверяем:
- нет дублирующихся страниц
- нет старых импортов на legacy-реализации
- все активные маршруты живут в одном месте

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before legacy cleanup`
- После шага: `chore: complete legacy cleanup`

## Правило фиксации прогресса

- Галочку `[] -> [x]` ставим только после успешного `npx tsc --noEmit`.
- Если шаг прошел частично, оставляем чекбокс пустым.
- Если шаг откатился, checkpoint-коммит сохраняем как точку возврата.

## Рабочий порядок принятия решений

1. Сначала синхронизируемся с `reserve`.
2. Потом переносим каркас.
3. Потом auth.
4. Потом кабинет.
5. Потом лендинг и публичные страницы.
6. Потом отзывы и события.
7. Потом общие UI-компоненты.
8. Потом API boundary.
9. В конце чистим legacy.

## Примечание

Этот документ служит рабочей картой миграции. Он нужен, чтобы каждый шаг был маленьким, проверяемым и откатываемым без потери прогресса.
















