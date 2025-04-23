# Модуль аутентификации и авторизации

## API Endpoints

### 1. Аутентификация

#### 1.1 Вход в систему
```typescript
POST /api/v1/auth/login
Request:
{
  email: string;
  password: string;
  remember_me?: boolean;
}

Response:
{
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  expires_in: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: "admin" | "teacher" | "student" | "staff";
    permissions: string[];
  }
}
```

#### 1.2 Обновление токена
```typescript
POST /api/v1/auth/refresh
Request:
{
  refresh_token: string;
}

Response:
{
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  expires_in: number;
}
```

#### 1.3 Выход из системы
```typescript
POST /api/v1/auth/logout
Request: {}

Response:
{
  success: boolean;
  message: string;
}
```

### 2. Управление пользователями

#### 2.1 Создание пользователя
```typescript
POST /api/v1/users
Request:
{
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  role: "admin" | "teacher" | "student" | "staff";
  department?: string;
  position?: string;
  group_id?: number;
}

Response:
{
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
}
```

#### 2.2 Изменение пароля
```typescript
PUT /api/v1/users/password
Request:
{
  old_password: string;
  new_password: string;
  confirm_password: string;
}

Response:
{
  success: boolean;
  message: string;
}
```

## Модели данных

```typescript
interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  role: UserRole;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;
}

enum UserRole {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
  STAFF = "staff"
}

enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLOCKED = "blocked"
}

interface UserSession {
  id: number;
  user_id: number;
  refresh_token: string;
  ip_address: string;
  user_agent: string;
  expires_at: Date;
  created_at: Date;
}

interface Permission {
  id: number;
  name: string;
  description: string;
  module: string;
}

interface RolePermission {
  role: UserRole;
  permission_id: number;
}
```

## Интеграции

1. Active Directory / LDAP
```typescript
interface LDAPConfig {
  url: string;
  baseDN: string;
  username: string;
  password: string;
  searchFilter: string;
}
```

2. OAuth 2.0 провайдеры
- Google
- Microsoft
- Telegram

## Требования к безопасности

1. Пароли:
- Минимальная длина: 8 символов
- Обязательные символы: буквы, цифры, спецсимволы
- Хеширование: bcrypt с salt
- История паролей: последние 5
- Срок действия: 90 дней

2. Токены:
- JWT с RSA256
- Access token: 30 минут
- Refresh token: 7 дней
- Ротация refresh токенов

3. Сессии:
- Максимум 5 активных сессий
- Автоматический выход через 12 часов
- IP-привязка
- User-Agent проверка

4. Rate limiting:
- Login: 5 попыток / 15 минут
- API: 100 запросов / минуту
- Refresh: 3 попытки / минуту

5. Безопасность:
- HTTPS only
- Secure cookies
- CSRF защита
- XSS защита
- SQL injection защита
- Logging всех действий

## Стратегия кэширования

1. Пользовательские данные:
- Профиль: 15 минут
- Permissions: 10 минут
- Настройки: 1 час

2. Сессии:
- Активные токены: 1 минута
- Черный список: 24 часа

3. Системные данные:
- Роли и права: 1 час
- Конфигурация: 12 часов

## Дополнительные требования

1. Аудит:
- Логирование всех входов/выходов
- История изменения прав
- Отслеживание подозрительной активности

2. Уведомления:
- Email при входе с нового устройства
- SMS для двухфакторной аутентификации
- Push-уведомления при смене пароля

3. Восстановление:
- Сброс пароля через email
- Временные коды доступа
- Резервные коды

4. Мониторинг:
- Количество активных сессий
- Частота неудачных попыток входа
- Использование устаревших токенов

5. Отчетность:
- Активные пользователи
- История входов
- Изменения прав доступа
- Заблокированные аккаунты 