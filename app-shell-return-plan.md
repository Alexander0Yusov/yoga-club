# План возврата root App Router

## Цель

Вернуть Next.js router shell в корневой `app/`, не трогая backend surface в `app/api/` и не ломая уже собранное ядро в `src/`.

Это план обратного переноса роутера маленькими безопасными шагами, чтобы:
- убрать конфликт двух App Router root-слоёв;
- восстановить предсказуемые маршруты;
- сохранить рабочий backend boundary;
- не потерять прогресс, уже собранный в `src/`.

## Источники истины

- текущий проект `yoga-club`
- локальный резервный репозиторий `reserve`
- готовые UI / logic slices в `src/features`, `src/shared`, `src/entities`, `src/modules`

## Что показала базовая сверка

Сейчас состояние такое:
- в корневом `app/` лежат только `api/` и `favicon.ico`
- в `src/app/` уже есть canonical frontend shell, routes и layout-слои
- `src/app/api/` полностью дублирует backend surface
- root `app/` как router shell сейчас отсутствует

Вывод сверки:
- backend surface `app/api/` сохраняем;
- UI и route shell нужно вернуть в root `app/`;
- `src/` оставляем как место для feature / shared / entity / module code.

## Архитектурная договоренность

- `app/api/` остаётся временным backend surface и не удаляется в рамках этого плана.
- `src/` остаётся местом для canonical UI, shared code, contracts, adapters и feature slices.
- `app/` снова должен стать единственным активным App Router root для страниц и layouts.
- `src/app/` на время возврата роутера рассматривается как источник кода и временная зона сверки, а не как активный route tree.

## Правила

- Возвращаем только router layer.
- Backend API не переносим и не переименовываем без отдельного плана.
- Двигаемся одной фичей или одним route slice за раз.
- После каждого шага запускаем `npx tsc --noEmit`.
- Если типы не сошлись, шаг считается незавершенным.
- Если проверка упала, откатываемся только на checkpoint-коммит перед этим шагом.
- Пока шаг не подтвержден, старую реализацию не удаляем.
- Если route slice еще не готов, используем простой HTML + Tailwind stub, чтобы маршрут оставался живым.
- После каждого успешного шага обновляем этот документ.

## Формат коммитов

- `chore: checkpoint before <route-or-slice>`
- `chore: complete <route-or-slice> return`

Пример:
- `chore: checkpoint before root app shell return`
- `chore: complete root app shell return`

## Рабочий протокол одного шага

1. Сверить текущий slice с `reserve` и с существующим кодом в `src/`.
2. Сделать checkpoint-коммит перед переносом.
3. Создать или восстановить нужный route shell в root `app/`.
4. Если нужно, временно поставить stub вместо сложной части.
5. Проверить `npx tsc --noEmit`.
6. Если проверка прошла, зафиксировать финальный коммит шага.
7. Если проверка не прошла, откатиться на checkpoint и не продолжать дальше.

## Что не трогаем без отдельного решения

- `app/api/*`
- `src/features/*`
- `src/shared/*`
- `src/entities/*`
- `src/modules/*`
- DTO / contracts / shared API client

## Техническая последовательность обратного переноса роутера

### 0. Базовая сверка

Статус:
- [x] завершено

Что уже зафиксировано:
- root `app/` сейчас содержит только `api/` и `favicon.ico`
- canonical frontend routes уже находятся в `src/app/`
- backend mirror `src/app/api/` существует
- root router shell нужно возвращать обратно в `app/`

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before router baseline audit`
- После шага: `chore: complete router baseline audit`

---

### 1. Root app shell

Статус:
- [x] завершено

Цель:
- Сделать root `app/` активным App Router shell.
- Вернуть `app/layout.tsx`, `app/page.tsx` и базовую i18n-обвязку.

Что восстанавливаем:
- `app/layout.tsx`
- `app/page.tsx`
- `app/[lang]/layout.tsx`
- `app/[lang]/page.tsx`
- `app/[lang]/i18n.ts`
- route groups для auth / user / public

Заглушки:
- Если часть шапки или футера еще не собрана, использовать нейтральный wrapper.

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before root app shell return`
- После шага: `chore: complete root app shell return`

---

### 2. Auth routes

Цель:
- Вернуть `signin` и `signup` в root router без поломки форм и редиректов.

Что восстанавливаем:
- `app/[lang]/(auth)/signin/page.tsx`
- `app/[lang]/(auth)/signup/page.tsx`

Что используем:
- canonical UI из `src/features/auth/ui`

Заглушки:
- Если форма еще не собрана полностью, показывать простую panel-card заглушку с тем же размером.

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before auth routes return`
- После шага: `chore: complete auth routes return`

---

### 3. Account routes

Цель:
- Вернуть личный кабинет в root router и сохранить tab-based UX.

Что восстанавливаем:
- `app/[lang]/(user)/account/page.tsx`
- связанные tab routes, если они нужны

Что используем:
- canonical UI из `src/features/account/ui`

Заглушки:
- Если часть вкладок еще не готова, оставить простой placeholder с названием вкладки.

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before account routes return`
- После шага: `chore: complete account routes return`

---

### 4. Public landing routes

Цель:
- Вернуть публичный landing shell в root router.

Что восстанавливаем:
- `app/[lang]/page.tsx`
- route groups для публичных секций

Что используем:
- canonical blocks из `src/widgets/landing-sections`
- public feature slices из `src/features`

Заглушки:
- Если секция не готова, использовать простой Tailwind блок с фиксированной высотой.

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before landing routes return`
- После шага: `chore: complete landing routes return`

---

### 5. Events routes

Цель:
- Вернуть events, archive, upcoming и detail pages в root router.

Что восстанавливаем:
- `app/[lang]/(public)/events/page.tsx`
- `app/[lang]/(public)/events/upcoming/page.tsx`
- `app/[lang]/(public)/events/archive/page.tsx`
- `app/[lang]/(public)/events/[id]/page.tsx`

Что используем:
- canonical UI из `src/features/events/ui`
- shared UI из `src/shared/ui`

Заглушки:
- Если карточки или detail page не готовы, использовать простой grid / detail stub.

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before events routes return`
- После шага: `chore: complete events routes return`

---

### 6. Feedback routes

Цель:
- Вернуть публичный и кабинетный слой отзывов в root router.

Что восстанавливаем:
- публичный slider / section entrypoint
- кабинетный feedback manager
- модалки и list views, если они нужны для страниц

Что используем:
- canonical UI из `src/features/feedback/ui`
- canonical data loaders из `src/shared/api/client.ts`

Заглушки:
- Если текста или layout еще не хватает, использовать простой review card shell.

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before feedback routes return`
- После шага: `chore: complete feedback routes return`

---

### 7. Shared route dependencies

Цель:
- Подключить оставшиеся shared atoms и wrappers к root route tree.

Что проверяем:
- модалки
- кнопки
- базовые иконки
- portal / overlay utilities
- shared nav / back button

Заглушки:
- Если атом еще не перенесен, использовать временный plain HTML элемент с тем же API.

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before shared route dependency return`
- После шага: `chore: complete shared route dependency return`

---

### 8. Route cleanup in `src/app`

Цель:
- После того как root `app/` полностью собран, убрать дубли из `src/app/` route tree.

Что удаляем:
- маршруты, которые уже канонически живут в root `app/`
- route bridges, которые больше не нужны

Что оставляем:
- `src/features`
- `src/shared`
- `src/entities`
- `src/modules`

Проверка:
- `npx tsc --noEmit`

Чекпоинты:
- Перед шагом: `chore: checkpoint before src app route cleanup`
- После шага: `chore: complete src app route cleanup`

---

### 9. Финальная валидация

Цель:
- Убедиться, что root `app/` теперь единственный активный router shell.
- Проверить, что backend surface в `app/api/` не сломан.
- Проверить, что все основные маршруты открываются без 404.

Что делаем:
- прогоняем `npx tsc --noEmit`
- открываем ключевые маршруты в браузере
- проверяем middleware / i18n / auth redirects
- проверяем, что API endpoints доступны как раньше

Чекпоинты:
- Перед шагом: `chore: checkpoint before final router validation`
- После шага: `chore: complete final router validation`

## Правило фиксации прогресса

- Чекбокс `[ ]` меняем на `[x]` только после успешного `npx tsc --noEmit`.
- Если шаг прошел частично, чекбокс не ставим.
- Если шаг откатился, checkpoint-коммит остается как точка возврата.
- После каждого успешного шага записываем короткую заметку, что именно стало canonical.

## Приоритет принятия решений

1. Сначала вернуть root shell.
2. Потом auth.
3. Потом account.
4. Потом public landing.
5. Потом events.
6. Потом feedback.
7. Потом shared dependencies.
8. Потом убрать `src/app` route duplicates.
9. В конце провести финальную валидацию.

## Примечание

Этот документ нужен для безопасного обратного переноса роутера без потери backend surface и без повторного появления 404.
