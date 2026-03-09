# 1. Общая информация

`Yoga-Club` - fullstack-проект сайта йога-клуба на `Next.js 14` с личным кабинетом, мультиязычным интерфейсом, аутентификацией, публикацией событий, отзывами и интеграциями с внешними сервисами.

Документ описывает:
- текущее состояние проекта;
- целевую модель продукта;
- нормализованную целевую API-спецификацию;
- технический долг относительно архитектурного манифеста из [AGENTS.md](c:/_MY_DATA_/development/yoga-club/AGENTS.md).

Принцип чтения документа:
- `Реализовано` - подтверждено текущим кодом;
- `Запланировано` - целевое поведение, которое должно быть доведено до production-качества.

# 2. Назначение продукта

Сайт предназначен для трёх основных сценариев:
- привлечение новых посетителей через публичный лендинг;
- работа с действующими пользователями через личный кабинет;
- управление событиями, отзывами и коммуникациями со стороны администратора.

Схема продукта:

```text
Публичный сайт
├─ знакомит с тренером и направлениями йоги
├─ показывает преимущества, демо-видео и отзывы
├─ публикует анонсы и архив событий
└─ принимает заявки на занятие / связь с тренером

Личный кабинет
├─ хранит профиль пользователя
├─ управляет согласием на email-рассылку
├─ позволяет оставлять и редактировать свои отзывы
└─ предоставляет административные функции по роли

Интеграции
├─ Google OAuth
├─ Telegram Bot API
├─ MongoDB / Mongoose
└─ Cloudinary для изображений профиля
```

# 3. Фронтенд-блоки и пользовательская ценность

## 3.1. Главная страница

Реализовано в [app/[lang]/page.tsx](c:/_MY_DATA_/development/yoga-club/app/[lang]/page.tsx).

Структура:

```text
Главная страница
├─ Hero
├─ Benefits
├─ About Instructor
├─ Advantages
├─ Yoga Directions
├─ Events Entry Point
├─ Demo Videos
├─ Contact / Booking Form
└─ Feedbacks
```

Что узнаёт пользователь:
- в блоке `Hero` - основное позиционирование проекта и призыв записаться;
- в блоке `Benefits` - какую пользу дают занятия;
- в блоке `About Instructor` - кто ведёт занятия;
- в блоке `Advantages` - сильные стороны клуба;
- в блоке `Directions` - какие направления йоги доступны;
- в блоке `Events` - какие события доступны сейчас и что ушло в архив;
- в блоке `Demo Videos` - как выглядят занятия;
- в блоке `Contact / Booking` - как оставить заявку тренеру;
- в блоке `Feedbacks` - социальное подтверждение качества занятий.

## 3.2. Каталог событий

Реализовано в:
- [app/[lang]/events/page.tsx](c:/_MY_DATA_/development/yoga-club/app/[lang]/events/page.tsx)
- [app/[lang]/events/archive/page.tsx](c:/_MY_DATA_/development/yoga-club/app/[lang]/events/archive/page.tsx)
- [app/[lang]/events/[id]/page.tsx](c:/_MY_DATA_/development/yoga-club/app/[lang]/events/[id]/page.tsx)

Пользователь получает:
- список актуальных анонсов;
- архив прошлых событий;
- карточку конкретного события с датой, описанием и изображениями.

## 3.3. Аутентификация

Реализовано:
- страница входа [app/[lang]/signin/page.tsx](c:/_MY_DATA_/development/yoga-club/app/[lang]/signin/page.tsx);
- страница регистрации [app/[lang]/signup/page.tsx](c:/_MY_DATA_/development/yoga-club/app/[lang]/signup/page.tsx);
- `Google OAuth` и `email/password` в [configs/auth.ts](c:/_MY_DATA_/development/yoga-club/configs/auth.ts).

Запланировано:
- `Facebook OAuth`;
- единая страница провайдеров входа;
- хеширование паролей и безопасный lifecycle учётных данных;
- выделенные DTO и Zod-схемы вместо неформализованных payload.

## 3.4. Личный кабинет

Реализовано в маршрутах:
- [app/[lang]/profile/page.tsx](c:/_MY_DATA_/development/yoga-club/app/[lang]/profile/page.tsx)
- [app/[lang]/profile/myfeedbacks/page.tsx](c:/_MY_DATA_/development/yoga-club/app/[lang]/profile/myfeedbacks/page.tsx)
- [app/[lang]/profile/feedbacks/page.tsx](c:/_MY_DATA_/development/yoga-club/app/[lang]/profile/feedbacks/page.tsx)
- [app/[lang]/profile/users/page.tsx](c:/_MY_DATA_/development/yoga-club/app/[lang]/profile/users/page.tsx)
- [app/[lang]/profile/demovideos/page.tsx](c:/_MY_DATA_/development/yoga-club/app/[lang]/profile/demovideos/page.tsx)
- [app/[lang]/profile/statistics/page.tsx](c:/_MY_DATA_/development/yoga-club/app/[lang]/profile/statistics/page.tsx)

Пользователь в кабинете должен:
- редактировать имя, телефон и аватар;
- видеть email как системный идентификатор;
- управлять согласием на email-рассылку;
- просматривать и редактировать свои отзывы;
- переходить к административным разделам при наличии роли.

# 4. Реализованные и запланированные функции

## 4.1. Аутентификация

Реализовано:
- вход через Google;
- вход через `email/password`;
- регистрация нового пользователя;
- хранение сессии через `next-auth`.

Запланировано:
- вход через Facebook;
- восстановление пароля;
- подтверждение email;
- ролевые claims в сессии;
- вынесение авторизации в application/use-case слой.

## 4.2. Интеграция с Telegram

Реализовано:
- отправка заявки из формы в Telegram через [app/api/telegram/route.ts](c:/_MY_DATA_/development/yoga-club/app/api/telegram/route.ts);
- форма связи находится в [components/ContactUsForm/ContactUsForm.tsx](c:/_MY_DATA_/development/yoga-club/components/ContactUsForm/ContactUsForm.tsx).

Целевая модель:

```text
Пользователь
→ заполняет форму заявки
→ выбирает событие или общий интерес к занятию
→ отправляет запрос
→ backend валидирует DTO
→ backend формирует структурированное сообщение
→ Telegram Bot API доставляет сообщение тренеру
→ заявка получает статус delivery/sent/failed
```

Запланировано:
- отдельный сценарий `записаться на занятие` через фронтенд-форму;
- режимы:
  - общая заявка на консультацию;
  - заявка на конкретное событие;
  - запрос обратной связи;
- отправка в Telegram структурированного сообщения с полями:
  - имя;
  - телефон;
  - email;
  - язык интерфейса;
  - идентификатор события;
  - дата/время события;
  - комментарий;
  - источник заявки;
  - UTC timestamp;
- сохранение копии заявки в backend для аналитики и повторной отправки;
- защита от спама.

## 4.3. Отзывы

Реализовано:
- создание отзыва;
- получение списка отзывов;
- получение своих отзывов;
- редактирование своего отзыва;
- удаление отзыва через API.

Файлы:
- [app/api/feedbacks/route.ts](c:/_MY_DATA_/development/yoga-club/app/api/feedbacks/route.ts)
- [app/api/myfeedbacks/route.ts](c:/_MY_DATA_/development/yoga-club/app/api/myfeedbacks/route.ts)
- [mongoose/models/Feedback.ts](c:/_MY_DATA_/development/yoga-club/mongoose/models/Feedback.ts)

Запланировано:
- модерация отзывов;
- статус отзыва: `pending | published | hidden | deleted`;
- причина скрытия/удаления;
- аудит действий администратора;
- фильтрация оскорбительных материалов.

## 4.4. События

Реализовано:
- создание события;
- список событий;
- просмотр одного события;
- редактирование события;
- удаление события.

Файлы:
- [app/api/events/route.ts](c:/_MY_DATA_/development/yoga-club/app/api/events/route.ts)
- [app/api/event/route.ts](c:/_MY_DATA_/development/yoga-club/app/api/event/route.ts)
- [mongoose/models/Events.ts](c:/_MY_DATA_/development/yoga-club/mongoose/models/Events.ts)

Запланировано:
- явное разделение на `анонс`, `архив`, `черновик`;
- автор события;
- публикация / снятие с публикации;
- лимиты мест;
- привязка заявок пользователей к событию;
- email- и Telegram-уведомления подписчикам.

## 4.5. Выбор языка

Реализовано:
- локали `uk`, `en`, `de`;
- middleware-маршрутизация по языку;
- переключатели языка.

Файлы:
- [i18nConfig.ts](c:/_MY_DATA_/development/yoga-club/i18nConfig.ts)
- [middleware.ts](c:/_MY_DATA_/development/yoga-club/middleware.ts)
- [locales/uk/homePage.json](c:/_MY_DATA_/development/yoga-club/locales/uk/homePage.json)
- [locales/en/homePage.json](c:/_MY_DATA_/development/yoga-club/locales/en/homePage.json)
- [locales/de/homePage.json](c:/_MY_DATA_/development/yoga-club/locales/de/homePage.json)

Запланировано:
- локализация всех страниц кабинета и админ-панели;
- локализация backend-ошибок и transactional-сообщений;
- хранение выбранного языка в профиле.

## 4.6. Профиль пользователя

Реализовано:
- редактирование `nickname`;
- редактирование телефона;
- загрузка/обновление аватара;
- флаг согласия на рассылку `isSubscribed`.

Файлы:
- [components/ProfileForm/ProfileForm.tsx](c:/_MY_DATA_/development/yoga-club/components/ProfileForm/ProfileForm.tsx)
- [app/api/user/route.ts](c:/_MY_DATA_/development/yoga-club/app/api/user/route.ts)
- [app/api/userCurrent/route.ts](c:/_MY_DATA_/development/yoga-club/app/api/userCurrent/route.ts)
- [mongoose/models/UserInfo.ts](c:/_MY_DATA_/development/yoga-club/mongoose/models/UserInfo.ts)

Запланировано:
- отдельная сущность профиля в domain;
- история изменений профиля;
- настройки уведомлений по каналам;
- управление языком и timezone;
- отдельная настройка маркетинговой и событийной рассылки.

## 4.7. Email-рассылка событий

Реализовано:
- только флаг согласия пользователя `isSubscribed`.

Запланировано:
- полноценная подписка на анонсы событий;
- письмо пользователю при публикации нового события;
- выбор типа писем:
  - все события;
  - только события конкретного автора;
  - только важные анонсы;
- журнал рассылок;
- отписка по ссылке;
- double opt-in при необходимости.

Целевая схема:

```text
Администратор публикует событие
→ событие получает статус published
→ backend выбирает подписчиков с активным consent
→ формирует EmailCampaign
→ отправляет письма
→ пишет DeliveryLog
→ пользователь может отписаться
```

# 5. Личный кабинет и модель полномочий

Ниже приведена целевая модель полномочий.

## 5.1. Роли

```text
Guest
├─ просмотр публичных страниц
├─ просмотр событий и отзывов
└─ отправка заявки через форму связи

User
├─ всё, что доступно Guest
├─ редактирование профиля
├─ управление согласием на email-рассылку
├─ создание отзывов
├─ редактирование своих отзывов
└─ просмотр своих заявок / записей

Admin
├─ всё, что доступно User
├─ добавление событий
├─ редактирование событий
├─ удаление событий
├─ удаление оскорбительных отзывов
├─ скрытие/модерация отзывов
├─ просмотр списка пользователей
├─ управление статусами пользователей
└─ запуск и контроль рассылок
```

## 5.2. Разделы кабинета

```text
/profile
├─ Личные данные
├─ Мои отзывы
├─ Все отзывы
├─ Демо-видео
├─ Пользователи
└─ Статистика
```

Назначение разделов:
- `Личные данные` - редактирование профиля и согласий;
- `Мои отзывы` - управление своими отзывами;
- `Все отзывы` - просмотр общей ленты и модерация для администратора;
- `Демо-видео` - внутренние материалы и контент для участников;
- `Пользователи` - список пользователей и административные действия;
- `Статистика` - метрики событий, заявок, отзывов и рассылок.

# 6. Сценарий записи на занятие через Telegram

Этот сценарий частично намечен текущей формой связи, но в целевом виде должен выглядеть так.

## 6.1. Пользовательский сценарий

```text
Публичная страница / карточка события
→ кнопка "Записаться"
→ форма записи
→ валидация обязательных полей
→ подтверждение согласия на обработку данных
→ отправка
→ сообщение уходит тренеру в Telegram
→ пользователь получает статус "Заявка принята"
```

## 6.2. Обязательные поля формы

- `name`
- `phone`
- `email` или другой канал связи
- `eventId` или `null` для общей заявки
- `comment`
- `agreement`
- `locale`
- `submittedAt` в `ISO UTC`

## 6.3. Целевое Telegram-сообщение

```text
Новая заявка с сайта
Тип: booking
Событие: Yoga Weekend / eventId
Имя: ...
Телефон: ...
Email: ...
Язык: uk
Комментарий: ...
Отправлено: 2026-03-09T18:00:00.000Z
```

## 6.4. Что нужно довести до production

- связать форму с конкретным событием;
- ввести отдельный backend-ресурс бронирования;
- хранить заявку в базе;
- валидировать payload через `Zod`;
- логировать успешную/неуспешную доставку в Telegram;
- закрыть персональные данные от утечки в логах;
- уведомлять пользователя об ошибке и давать повторную отправку.

# 7. Дерево каталогов проекта

Сокращённое дерево по основным директориям.

```text
yoga-club/
├─ app/
│  ├─ api/
│  │  ├─ auth/[...nextauth]/route.ts
│  │  ├─ event/route.ts
│  │  ├─ events/route.ts
│  │  ├─ feedbacks/route.ts
│  │  ├─ myfeedbacks/route.ts
│  │  ├─ telegram/route.ts
│  │  ├─ user/route.ts
│  │  ├─ userCurrent/route.ts
│  │  └─ usersAll/route.ts
│  └─ [lang]/
│     ├─ events/
│     ├─ profile/
│     ├─ signin/
│     ├─ signup/
│     ├─ globals.css
│     ├─ i18n.ts
│     ├─ layout.tsx
│     └─ page.tsx
├─ components/
│  ├─ 0_ui/
│  ├─ ContactUsForm/
│  ├─ FeedbacksForm/
│  ├─ FormCreateEvent/
│  ├─ GoogleButton/
│  ├─ LanguageChanger/
│  ├─ LanguageChanger2/
│  ├─ MySessionProvider/
│  ├─ ProfileForm/
│  ├─ SigninForm/
│  ├─ SignupForm/
│  ├─ UsersGallery/
│  └─ ...
├─ configs/
│  └─ auth.ts
├─ locales/
│  ├─ de/
│  ├─ en/
│  └─ uk/
├─ mongoDbAdapter/
│  └─ MongoDbClient.ts
├─ mongoose/
│  └─ models/
│     ├─ Events.ts
│     ├─ Feedback.ts
│     ├─ User.ts
│     └─ UserInfo.ts
├─ store/
│  ├─ a_store.ts
│  ├─ feedbacksSlice.ts
│  ├─ toggleFormSlice.ts
│  └─ userSlice.ts
├─ i18nConfig.ts
├─ middleware.ts
└─ package.json
```

# 8. Дерево роутов

## 8.1. Frontend routes

```text
/:lang
├─ /
├─ /signin
├─ /signup
├─ /events
│  ├─ /archive
│  └─ /:id
└─ /profile
   ├─ /myfeedbacks
   ├─ /feedbacks
   ├─ /demovideos
   ├─ /statistics
   └─ /users
```

## 8.2. Backend routes

```text
/api
├─ /auth/[...nextauth]
├─ /event
├─ /events
├─ /feedbacks
├─ /myfeedbacks
├─ /telegram
├─ /user
├─ /userCurrent
└─ /usersAll
```

# 9. Нормализованная целевая API-спецификация

Ниже описана целевая, а не текущая спецификация. DTO должны валидироваться через `Zod`, даты должны передаваться как `ISO UTC string`.

## 9.1. Auth

### `POST /api/auth/signup`

Request DTO:

```json
{
  "name": "Ivan Ivanov",
  "email": "ivan@example.com",
  "password": "strongPassword123",
  "locale": "uk"
}
```

Response DTO:

```json
{
  "user": {
    "id": "usr_123",
    "name": "Ivan Ivanov",
    "email": "ivan@example.com",
    "role": "user",
    "locale": "uk",
    "createdAt": "2026-03-09T18:00:00.000Z"
  }
}
```

### `POST /api/auth/signin`

Request DTO:

```json
{
  "provider": "credentials",
  "email": "ivan@example.com",
  "password": "strongPassword123"
}
```

Response DTO:

```json
{
  "session": {
    "accessToken": "jwt-or-session-id",
    "expiresAt": "2026-03-10T18:00:00.000Z"
  },
  "user": {
    "id": "usr_123",
    "email": "ivan@example.com",
    "role": "user"
  }
}
```

### `POST /api/auth/oauth/google`

Назначение:
- запуск OAuth flow для Google.

### `POST /api/auth/oauth/facebook`

Назначение:
- запуск OAuth flow для Facebook.
- статус проекта: `запланировано`.

## 9.2. Current User

### `GET /api/userCurrent`

Response DTO:

```json
{
  "id": "usr_123",
  "name": "Ivan Ivanov",
  "email": "ivan@example.com",
  "nickname": "Iva",
  "phone": "+380991234567",
  "portrait": "https://cdn.example.com/avatar.jpg",
  "locale": "uk",
  "role": "user",
  "isSubscribedToEvents": true,
  "isSubscribedToAuthorEvents": false,
  "createdAt": "2026-03-09T18:00:00.000Z",
  "updatedAt": "2026-03-09T18:10:00.000Z"
}
```

### `PATCH /api/user`

Request DTO:

```json
{
  "nickname": "Iva",
  "phone": "+380991234567",
  "locale": "en",
  "isSubscribedToEvents": true,
  "isSubscribedToAuthorEvents": true
}
```

Response DTO:

```json
{
  "user": {
    "id": "usr_123",
    "nickname": "Iva",
    "phone": "+380991234567",
    "locale": "en",
    "isSubscribedToEvents": true,
    "isSubscribedToAuthorEvents": true,
    "updatedAt": "2026-03-09T18:15:00.000Z"
  }
}
```

### `PATCH /api/user/avatar`

Request DTO:
- `multipart/form-data`
- поле `file`

Response DTO:

```json
{
  "avatarUrl": "https://cdn.example.com/avatar.jpg",
  "updatedAt": "2026-03-09T18:15:00.000Z"
}
```

## 9.3. Users Administration

### `GET /api/usersAll`

Access:
- `admin`

Response DTO:

```json
{
  "items": [
    {
      "id": "usr_123",
      "email": "ivan@example.com",
      "name": "Ivan Ivanov",
      "role": "user",
      "isInBlacklist": false,
      "createdAt": "2026-03-09T18:00:00.000Z"
    }
  ]
}
```

### `PATCH /api/usersAll`

Request DTO:

```json
{
  "userId": "usr_123",
  "isInBlacklist": true
}
```

Response DTO:

```json
{
  "user": {
    "id": "usr_123",
    "isInBlacklist": true,
    "updatedAt": "2026-03-09T18:20:00.000Z"
  }
}
```

## 9.4. Events

### `GET /api/events`

Query params:
- `status=published|draft|archived`
- `authorId`
- `locale`

Response DTO:

```json
{
  "items": [
    {
      "id": "evt_123",
      "title": "Yoga Weekend",
      "description": "Two-day retreat",
      "status": "published",
      "startsAt": "2026-03-20T09:00:00.000Z",
      "endsAt": "2026-03-20T11:00:00.000Z",
      "author": {
        "id": "usr_admin",
        "name": "Coach"
      },
      "images": [
        {
          "url": "https://cdn.example.com/event-1.jpg",
          "isCover": true
        }
      ],
      "capacity": 20,
      "availableSeats": 12
    }
  ]
}
```

### `POST /api/events`

Access:
- `admin`

Request DTO:

```json
{
  "title": "Yoga Weekend",
  "description": "Two-day retreat",
  "startsAt": "2026-03-20T09:00:00.000Z",
  "endsAt": "2026-03-20T11:00:00.000Z",
  "status": "draft",
  "images": [
    {
      "url": "https://cdn.example.com/event-1.jpg",
      "isCover": true
    }
  ],
  "capacity": 20,
  "locale": "uk"
}
```

Response DTO:

```json
{
  "event": {
    "id": "evt_123",
    "status": "draft",
    "createdAt": "2026-03-09T18:30:00.000Z"
  }
}
```

### `GET /api/event?id=:id`

Response DTO:

```json
{
  "event": {
    "id": "evt_123",
    "title": "Yoga Weekend",
    "description": "Two-day retreat",
    "startsAt": "2026-03-20T09:00:00.000Z",
    "endsAt": "2026-03-20T11:00:00.000Z",
    "status": "published",
    "images": [
      {
        "url": "https://cdn.example.com/event-1.jpg",
        "isCover": true
      }
    ],
    "authorId": "usr_admin"
  }
}
```

### `PATCH /api/event`

Access:
- `admin`

Request DTO:

```json
{
  "id": "evt_123",
  "title": "Yoga Weekend Updated",
  "description": "Updated description",
  "startsAt": "2026-03-20T09:00:00.000Z",
  "endsAt": "2026-03-20T11:00:00.000Z",
  "status": "published",
  "capacity": 24
}
```

Response DTO:

```json
{
  "event": {
    "id": "evt_123",
    "updatedAt": "2026-03-09T18:40:00.000Z"
  }
}
```

### `DELETE /api/event`

Access:
- `admin`

Request DTO:

```json
{
  "id": "evt_123"
}
```

Response DTO:

```json
{
  "deleted": true,
  "id": "evt_123"
}
```

## 9.5. Feedbacks

### `GET /api/feedbacks`

Query params:
- `status=published`
- `page`
- `limit`

Response DTO:

```json
{
  "items": [
    {
      "id": "fb_123",
      "text": "Great class",
      "status": "published",
      "author": {
        "id": "usr_123",
        "name": "Ivan Ivanov",
        "nickname": "Iva",
        "portrait": "https://cdn.example.com/avatar.jpg"
      },
      "createdAt": "2026-03-09T18:50:00.000Z"
    }
  ]
}
```

### `POST /api/feedbacks`

Access:
- `user`

Request DTO:

```json
{
  "text": "Great class"
}
```

Response DTO:

```json
{
  "feedback": {
    "id": "fb_123",
    "status": "pending",
    "createdAt": "2026-03-09T18:50:00.000Z"
  }
}
```

### `DELETE /api/feedbacks`

Access:
- `admin`

Request DTO:

```json
{
  "id": "fb_123",
  "reason": "abusive_language"
}
```

Response DTO:

```json
{
  "deleted": true,
  "id": "fb_123",
  "reason": "abusive_language"
}
```

### `GET /api/myfeedbacks`

Access:
- `user`

Response DTO:

```json
{
  "items": [
    {
      "id": "fb_123",
      "text": "Great class",
      "status": "published",
      "createdAt": "2026-03-09T18:50:00.000Z",
      "updatedAt": "2026-03-09T19:00:00.000Z"
    }
  ]
}
```

### `PATCH /api/myfeedbacks`

Access:
- `user`

Request DTO:

```json
{
  "id": "fb_123",
  "text": "Updated feedback"
}
```

Response DTO:

```json
{
  "feedback": {
    "id": "fb_123",
    "text": "Updated feedback",
    "updatedAt": "2026-03-09T19:00:00.000Z"
  }
}
```

## 9.6. Bookings and Telegram Requests

### `POST /api/bookings`

Назначение:
- запись на занятие;
- уведомление тренера в Telegram;
- сохранение заявки в хранилище.

Request DTO:

```json
{
  "eventId": "evt_123",
  "name": "Ivan Ivanov",
  "phone": "+380991234567",
  "email": "ivan@example.com",
  "comment": "Need beginner group",
  "locale": "uk",
  "agreement": true,
  "submittedAt": "2026-03-09T19:10:00.000Z"
}
```

Response DTO:

```json
{
  "booking": {
    "id": "bk_123",
    "status": "sent_to_telegram",
    "eventId": "evt_123",
    "createdAt": "2026-03-09T19:10:00.000Z"
  }
}
```

### `POST /api/telegram`

Назначение:
- технический adapter endpoint для Bot API;
- рекомендуется использовать как внутренний инфраструктурный слой, а не как основной публичный business endpoint.

## 9.7. Email Subscriptions

### `POST /api/subscriptions`

Request DTO:

```json
{
  "email": "ivan@example.com",
  "userId": "usr_123",
  "subscriptionType": "events",
  "authorId": "usr_admin",
  "locale": "uk",
  "consent": true
}
```

Response DTO:

```json
{
  "subscription": {
    "id": "sub_123",
    "status": "active",
    "createdAt": "2026-03-09T19:20:00.000Z"
  }
}
```

### `DELETE /api/subscriptions`

Request DTO:

```json
{
  "subscriptionId": "sub_123"
}
```

Response DTO:

```json
{
  "deleted": true,
  "id": "sub_123"
}
```

# 10. Доменные сущности и целевая структура backend

В соответствии с манифестом из [AGENTS.md](c:/_MY_DATA_/development/yoga-club/AGENTS.md), проект должен двигаться к backend-agnostic hexagonal DDD.

Целевая структура:

```text
src/core/
├─ domain/
│  ├─ entities/
│  │  ├─ User.ts
│  │  ├─ UserProfile.ts
│  │  ├─ Event.ts
│  │  ├─ Feedback.ts
│  │  ├─ Booking.ts
│  │  └─ Subscription.ts
│  └─ interfaces/
│     ├─ IUserRepository.ts
│     ├─ IEventRepository.ts
│     ├─ IFeedbackRepository.ts
│     ├─ IBookingRepository.ts
│     ├─ ISubscriptionRepository.ts
│     ├─ IAuthService.ts
│     ├─ IEmailService.ts
│     └─ ITelegramService.ts
├─ application/
│  ├─ dto/
│  ├─ schemas/
│  └─ use-cases/
│     ├─ SignUp.service.ts
│     ├─ SignIn.service.ts
│     ├─ UpdateProfile.service.ts
│     ├─ CreateEvent.service.ts
│     ├─ PublishEvent.service.ts
│     ├─ SubmitFeedback.service.ts
│     ├─ ModerateFeedback.service.ts
│     ├─ CreateBooking.service.ts
│     └─ ManageSubscription.service.ts
└─ infrastructure/
   ├─ persistence/
   │  ├─ mongoose/
   │  └─ mongodb/
   ├─ adapters/
   │  ├─ telegram/
   │  ├─ auth/
   │  ├─ cloudinary/
   │  └─ email/
   └─ validation/
```

# 11. Технологии проекта

Подтверждено по [package.json](c:/_MY_DATA_/development/yoga-club/package.json).

## 11.1. Frontend

- `Next.js 14`
- `React 18`
- `TypeScript`
- `Tailwind CSS`
- `Swiper`
- `react-hook-form`
- `yup`
- `react-hot-toast`
- `react-day-picker`
- `zustand`

## 11.2. Authentication and i18n

- `next-auth`
- `@auth/mongodb-adapter`
- `i18next`
- `react-i18next`
- `next-i18n-router`
- `i18nexus-cli`

## 11.3. Backend and storage

- `MongoDB`
- `Mongoose`
- `Cloudinary`
- `Telegram Bot API`

## 11.4. Tooling

- `ESLint`
- `PostCSS`
- `Autoprefixer`

# 12. Известные ограничения и технический долг

Ниже перечислены основные расхождения между текущим кодом и целевой архитектурой.

## 12.1. Архитектурные расхождения

- отсутствует `src/core` с явным разделением на `domain / application / infrastructure`;
- `app/api/*` работает напрямую с `Mongoose`, без use-case слоя;
- UI и страницы местами завязаны на детали backend-реализации;
- серверные страницы импортируют route handlers напрямую вместо обращения через application service или repository abstraction;
- DTO не формализованы через `Zod`;
- бизнес-правила распределены по компонентам, route handlers и моделям без единой доменной модели.

## 12.2. Безопасность и консистентность

- пароль пользователя в [mongoose/models/User.ts](c:/_MY_DATA_/development/yoga-club/mongoose/models/User.ts) хранится без хеширования;
- авторизация админа в операциях с событиями и отзывами не доведена до строгого enforcement;
- удаление отзывов и управление пользователями требуют более жёсткой проверки роли;
- даты событий сейчас не приведены к единому формату `ISO UTC`;
- отсутствует единый error contract;
- нет audit trail для административных действий.

## 12.3. Функциональные пробелы

- запись на занятие не выделена в самостоятельный ресурс бронирования;
- email-рассылка описана флагом подписки, но не реализована как бизнес-процесс;
- Facebook login пока не включён;
- статусы событий, заявок и отзывов не нормализованы;
- страницы статистики и demo videos пока скорее заготовки, чем завершённые модули.

## 12.4. Рекомендуемые мероприятия

```text
Этап 1. Выделить домен
├─ создать src/core/domain
├─ описать сущности User, Event, Feedback, Booking, Subscription
└─ описать repository interfaces

Этап 2. Выделить application слой
├─ описать Zod DTO
├─ перенести бизнес-правила в use-cases
└─ стандартизировать response/error contracts

Этап 3. Изолировать infrastructure
├─ вынести Mongoose-репозитории
├─ вынести Telegram adapter
├─ вынести Email adapter
└─ вынести Cloudinary adapter

Этап 4. Навести порядок в auth и ACL
├─ захешировать пароли
├─ ввести role-based access control
├─ добавить guards/policies
└─ передавать роль через session/token

Этап 5. Реализовать бизнес-функции
├─ booking flow
├─ subscription flow
├─ moderation flow
└─ event publication flow
```

# 13. Итоговое состояние проекта

Проект уже покрывает ядро публичного сайта, аутентификацию, профиль, отзывы, события, мультиязычность и базовую Telegram-интеграцию. Целевое направление развития - превратить текущий fullstack-код в backend-agnostic систему с выделенным доменным слоем, нормализованными DTO, строгими ролями и полноценными процессами бронирования, модерации и email-рассылок.
