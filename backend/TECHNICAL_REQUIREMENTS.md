# Техническое задание на разработку бэкенд-части системы AB.AI

## 1. Общие сведения

### 1.1 Назначение системы
Система представляет собой бэкенд-часть образовательной платформы с интегрированным ИИ-ассистентом для обучения, управления учебным процессом, HR и финансами.

### 1.2 Технический стек
- Язык программирования: TypeScript/Node.js
- Основной фреймворк: NestJS 10+
- База данных: PostgreSQL 15+
- ORM: TypeORM/Prisma
- Кэширование: Redis
- Очереди сообщений: RabbitMQ
- WebSocket: NestJS WebSockets
- Контейнеризация: Docker
- Оркестрация: Kubernetes

## 2. Роли пользователей и права доступа

### 2.1 Основные роли
Система поддерживает следующие роли пользователей с соответствующими правами доступа:

#### Администратор (ADMIN)
- Полный доступ ко всем функциям системы
- Управление пользователями и правами доступа
- Управление финансами и бюджетом
- Управление персоналом
- Доступ к системным настройкам
- Доступ к аналитике и отчетам

#### Преподаватель (TEACHER)
- Доступ к учебному журналу своих классов
- Управление расписанием своих занятий
- Создание и проверка домашних заданий
- Доступ к данным учащихся своих классов
- Управление учебными планами
- Отслеживание своих KPI и нагрузки

#### Студент (STUDENT)
- Просмотр своего расписания
- Просмотр и отправка выполненных домашних заданий
- Просмотр своих оценок и успеваемости
- Доступ к AI-чату (репетитор)
- Управление списком дел

#### Родитель (PARENT)
- Просмотр оценок и успеваемости своего ребенка
- Просмотр расписания и домашних заданий ребенка
- Отслеживание посещаемости
- Управление оплатами и финансами
- Загрузка чеков

### 2.2 Структура навигации по ролям

#### Администратор (ADMIN)
```
- Главная (dashboard)
- Приложения
  - Чат (chat)
  - AI-чат (ai-chat)
  - Календарь (calendar)
  - Список дел (todo)
  - FIZMAT.AI (fizmat-link)
- Учебный процесс
  - Учебный журнал (journal)
  - Расписание (schedule)
  - Домашние задания (homework)
  - Аудитории и секции (classrooms)
  - Учебные планы (plans)
- Студенты
  - Списки учащихся (students-list)
  - Успеваемость (students-performance)
- HR (Персонал)
  - Сотрудники (employees)
  - Нагрузки (workloads)
  - KPI (kpi)
  - Отпуска (vacations)
- Финансы
  - Оплаты и задолженности (payments)
  - Финансовые отчёты (finance-reports)
  - Бюджет и прогноз (budget)
  - Анализ лояльности (loyalty)
  - Управление зарплатой (salaries)
- ERP система
  - Инвентаризация (inventory)
  - Снабжение (supply)
- Настройки
  - Пользователи (users)
  - Права доступа (access)
  - Интеграции (integrations)
  - Брендинг (branding)
  - Система (system)
```

#### Преподаватель (TEACHER)
```
- Главная (dashboard)
- Приложения
  - Чат (chat)
  - AI-чат (ai-chat)
  - NEIRO ABAI (neiro-abai)
  - Календарь (calendar)
  - Список дел (todo)
  - Файлы (files)
- Учебный процесс
  - Мой журнал (my-journal)
  - Моё расписание (my-schedule)
  - Домашние задания (homework)
  - КТП и планы (ktp)
- Студенты
  - Мои классы (my-classes)
  - Успеваемость (students-performance)
- HR
  - Нагрузка (my-workload)
  - Мои KPI (my-kpi)
  - Отпуска (vacations)
```

#### Студент (STUDENT)
```
- Главная (dashboard)
- Приложения
  - Чат (chat)
  - AI-чат (репетитор) (ai-chat)
  - Календарь (calendar)
  - Список дел (todo)
- Учебный процесс
  - Моё расписание (my-schedule)
  - Домашние задания (homework)
  - Мои оценки (my-grades)
- Профиль
  - Мой профиль (student-profile)
```

#### Родитель (PARENT)
```
- Главная (dashboard)
- Приложения
  - Чат (chat)
  - Календарь (calendar)
- Учебный процесс
  - Оценки ребёнка (child-grades)
  - Домашние задания (child-homework)
  - Посещаемость (attendance)
- Финансы
  - Оплаты (payments)
  - Загрузка чеков (upload-receipts)
- Профиль ребёнка
  - Карточка ученика (child-profile)
```

## 3. Архитектура системы

### 3.1 Микросервисная архитектура
Система должна быть разделена на следующие микросервисы:

1. **Auth Service**
   - Аутентификация и авторизация
   - Управление JWT токенами (с @nestjs/jwt)
   - Интеграция с Active Directory
   - RBAC (Role-Based Access Control) с @nestjs/security
   - Управление пользователями и ролями

2. **User Service**
   - Управление профилями пользователей разных типов (Администратор, Преподаватель, Студент, Родитель)
   - История активности пользователей
   - Настройки пользователей

3. **Academic Service**
   - Учебный журнал
   - Расписание занятий
   - Управление домашними заданиями
   - Учебные планы
   - Аудитории и секции

4. **Student Service**
   - Управление списками учащихся
   - Данные профилей студентов
   - Анализ успеваемости
   - Посещаемость

5. **HR Service**
   - Управление сотрудниками
   - Расчет нагрузки преподавателей
   - Отслеживание KPI
   - Управление отпусками

6. **Finance Service**
   - Управление оплатами и задолженностями
   - Финансовая отчетность
   - Бюджетирование
   - Анализ лояльности
   - Управление зарплатами
   - Обработка чеков

7. **Chat Service**
   - Обмен сообщениями
   - Управление чатами и группами
   - Уведомления

8. **AI Integration Service**
   - Интеграция с AI-репетитором
   - Интеграция с NEIRO ABAI
   - Интеграция с FIZMAT.AI

9. **Calendar Service**
   - Управление календарем
   - Управление списком дел (Todo)
   - Напоминания о событиях

10. **ERP Service**
    - Инвентаризация
    - Управление снабжением
    - Управление ресурсами

### 3.2 Общие требования к микросервисам
- REST API с версионированием (префикс /api/v1/)
- Swagger/OpenAPI документация (@nestjs/swagger)
- Единый формат ответов API (с использованием интерсепторов)
- Обработка ошибок по стандарту RFC 7807 (с фильтрами исключений)
- Логирование всех действий (@nestjs/common)
- Метрики для мониторинга (@nestjs/terminus)

## 4. Детальные спецификации API по модулям

### 4.1 Auth Service API

#### 4.1.1 Аутентификация
```typescript
@Controller('api/v1/auth')
export class AuthController {
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string; refreshToken: string }> {}

  @Post('refresh')
  refresh(@Body() refreshDto: RefreshDto): Promise<{ token: string }> {}

  @Post('logout')
  logout(@Body() logoutDto: LogoutDto): Promise<void> {}

  @Get('me')
  getProfile(@Req() request): Promise<UserDto> {}
}
```

#### 4.1.2 Управление пользователями
```typescript
@Controller('api/v1/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  @Get()
  findAll(@Query() paginationDto: PaginationDto): Promise<{ items: UserDto[]; total: number }> {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserDto> {}

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserDto> {}

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {}
}
```

### 4.2 Academic Service API

#### 4.2.1 Учебный журнал
```typescript
@Controller('api/v1/journal')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JournalController {
  // Для администраторов - доступ ко всему журналу
  @Get()
  @Roles('ADMIN')
  findAll(@Query() queryParams: JournalQueryDto): Promise<{ items: JournalEntryDto[]; meta: PaginationMeta }> {}

  // Для преподавателей - только к своим классам
  @Get('my')
  @Roles('TEACHER')
  findTeacherJournal(@Req() req, @Query() queryParams: JournalQueryDto): Promise<{ items: JournalEntryDto[]; meta: PaginationMeta }> {}

  // Добавление оценок
  @Post('grades')
  @Roles('ADMIN', 'TEACHER')
  addGrade(@Body() gradeDto: AddGradeDto): Promise<GradeDto> {}

  // Отметка посещаемости
  @Post('attendance')
  @Roles('ADMIN', 'TEACHER')
  markAttendance(@Body() attendanceDto: AttendanceDto): Promise<AttendanceDto> {}
}
```

#### 4.2.2 Расписание
```typescript
@Controller('api/v1/schedule')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  // Получение общего расписания - для администраторов
  @Get()
  @Roles('ADMIN')
  findAll(@Query() queryParams: ScheduleQueryDto): Promise<{ items: ScheduleDto[]; meta: PaginationMeta }> {}

  // Для преподавателя - только его расписание
  @Get('my')
  @Roles('TEACHER')
  getTeacherSchedule(@Req() req, @Query() queryParams: ScheduleQueryDto): Promise<{ items: ScheduleDto[]; meta: PaginationMeta }> {}

  // Для студента - только его расписание
  @Get('student')
  @Roles('STUDENT')
  getStudentSchedule(@Req() req, @Query() queryParams: ScheduleQueryDto): Promise<{ items: ScheduleDto[]; meta: PaginationMeta }> {}

  // Для родителя - расписание ребенка
  @Get('child/:childId')
  @Roles('PARENT')
  getChildSchedule(@Param('childId') childId: string, @Query() queryParams: ScheduleQueryDto): Promise<{ items: ScheduleDto[]; meta: PaginationMeta }> {}

  // Добавление занятия в расписание - только для администратора
  @Post()
  @Roles('ADMIN')
  create(@Body() createScheduleDto: CreateScheduleDto): Promise<ScheduleDto> {}

  // Обновление занятия - для администратора и учителя
  @Put(':id')
  @Roles('ADMIN', 'TEACHER')
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto): Promise<ScheduleDto> {}
}
```

#### 4.2.3 Домашние задания
```typescript
@Controller('api/v1/homework')
@UseGuards(JwtAuthGuard)
export class HomeworkController {
  // Получение списка заданий - для администраторов
  @Get()
  @Roles('ADMIN')
  findAll(@Query() queryParams: HomeworkQueryDto): Promise<{ items: HomeworkDto[]; meta: PaginationMeta }> {}

  // Для преподавателя - только его задания
  @Get('my')
  @Roles('TEACHER')
  getTeacherHomework(@Req() req, @Query() queryParams: HomeworkQueryDto): Promise<{ items: HomeworkDto[]; meta: PaginationMeta }> {}

  // Для студента - только его задания
  @Get('student')
  @Roles('STUDENT')
  getStudentHomework(@Req() req, @Query() queryParams: HomeworkQueryDto): Promise<{ items: HomeworkDto[]; meta: PaginationMeta }> {}

  // Для родителя - задания ребенка
  @Get('child/:childId')
  @Roles('PARENT')
  getChildHomework(@Param('childId') childId: string, @Query() queryParams: HomeworkQueryDto): Promise<{ items: HomeworkDto[]; meta: PaginationMeta }> {}

  // Создание задания - только для администратора и учителя
  @Post()
  @Roles('ADMIN', 'TEACHER')
  create(@Body() createHomeworkDto: CreateHomeworkDto): Promise<HomeworkDto> {}

  // Студент отправляет выполненное задание
  @Post(':id/submit')
  @Roles('STUDENT')
  submitHomework(@Param('id') id: string, @Body() submitHomeworkDto: SubmitHomeworkDto): Promise<HomeworkDto> {}

  // Оценивание задания
  @Post(':id/grade')
  @Roles('ADMIN', 'TEACHER')
  gradeHomework(@Param('id') id: string, @Body() gradeHomeworkDto: GradeHomeworkDto): Promise<HomeworkDto> {}
}
```

### 4.3 Student Service API

#### 4.3.1 Управление студентами
```typescript
@Controller('api/v1/students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  // Получение списка студентов - для администраторов
  @Get()
  @Roles('ADMIN')
  findAll(@Query() queryParams: StudentQueryDto): Promise<{ items: StudentDto[]; meta: PaginationMeta }> {}

  // Для преподавателя - только его студенты
  @Get('my-classes')
  @Roles('TEACHER')
  getTeacherStudents(@Req() req, @Query() queryParams: StudentQueryDto): Promise<{ items: StudentDto[]; meta: PaginationMeta }> {}

  // Для родителя - только его дети
  @Get('my-children')
  @Roles('PARENT')
  getParentChildren(@Req() req): Promise<StudentDto[]> {}

  // Получение профиля студента
  @Get(':id')
  @Roles('ADMIN', 'TEACHER')
  findOne(@Param('id') id: string): Promise<StudentDto> {}

  // Студент получает свой профиль
  @Get('profile')
  @Roles('STUDENT')
  getProfile(@Req() req): Promise<StudentDto> {}

  // Родитель получает профиль ребенка
  @Get('child/:childId')
  @Roles('PARENT')
  getChildProfile(@Param('childId') childId: string): Promise<StudentDto> {}
}
```

#### 4.3.2 Успеваемость
```typescript
@Controller('api/v1/performance')
@UseGuards(JwtAuthGuard)
export class PerformanceController {
  // Общая статистика - для администраторов
  @Get('statistics')
  @Roles('ADMIN')
  getStatistics(@Query() queryParams: StatisticsQueryDto): Promise<StatisticsDto> {}

  // Для преподавателя - статистика его классов
  @Get('my-classes')
  @Roles('TEACHER')
  getTeacherClassesPerformance(@Req() req, @Query() queryParams: StatisticsQueryDto): Promise<StatisticsDto> {}

  // Для студента - его успеваемость
  @Get('my-grades')
  @Roles('STUDENT')
  getMyGrades(@Req() req, @Query() queryParams: GradesQueryDto): Promise<GradesDto> {}

  // Для родителя - успеваемость ребенка
  @Get('child/:childId')
  @Roles('PARENT')
  getChildGrades(@Param('childId') childId: string, @Query() queryParams: GradesQueryDto): Promise<GradesDto> {}
}
```

### 4.4 Finance Service API

#### 4.4.1 Управление платежами
```typescript
@Controller('api/v1/payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  // Получение всех платежей - для администраторов
  @Get()
  @Roles('ADMIN')
  findAll(@Query() queryParams: PaymentQueryDto): Promise<{ items: PaymentDto[]; meta: PaginationMeta }> {}

  // Для родителя - только его платежи
  @Get('my')
  @Roles('PARENT')
  getParentPayments(@Req() req, @Query() queryParams: PaymentQueryDto): Promise<{ items: PaymentDto[]; meta: PaginationMeta }> {}

  // Создание платежа - только для администратора
  @Post()
  @Roles('ADMIN')
  create(@Body() createPaymentDto: CreatePaymentDto): Promise<PaymentDto> {}

  // Родитель загружает чек
  @Post('upload-receipt')
  @Roles('PARENT')
  uploadReceipt(@Body() uploadReceiptDto: UploadReceiptDto): Promise<PaymentDto> {}
}
```

### 4.5 Chat Service API

#### 4.5.1 Управление чатами
```typescript
@Controller('api/v1/chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  // Получение списка чатов пользователя
  @Get('conversations')
  getConversations(@Req() req): Promise<ConversationDto[]> {}

  // Получение сообщений чата
  @Get('messages/:conversationId')
  getMessages(@Param('conversationId') conversationId: string, @Query() paginationDto: PaginationDto): Promise<{ items: MessageDto[]; meta: PaginationMeta }> {}

  // Отправка сообщения
  @Post('messages')
  sendMessage(@Body() sendMessageDto: SendMessageDto): Promise<MessageDto> {}
}
```

#### 4.5.2 AI-чат
```typescript
@Controller('api/v1/ai-chat')
@UseGuards(JwtAuthGuard)
export class AIChatController {
  // Начать новую сессию
  @Post('sessions')
  createSession(@Body() createSessionDto: CreateSessionDto): Promise<AISessionDto> {}

  // Отправить запрос AI
  @Post('messages')
  sendMessage(@Body() sendAIMessageDto: SendAIMessageDto): Promise<AIMessageDto> {}

  // Получить историю сообщений
  @Get('history/:sessionId')
  getHistory(@Param('sessionId') sessionId: string): Promise<AIMessageDto[]> {}
}
```

## 5. Модели данных

### 5.1 Пользователи и аутентификация

#### 5.1.1 User (Пользователь)
```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // хэшированный пароль

  @Column()
  fullName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT
  })
  role: UserRole; // ADMIN, TEACHER, STUDENT, PARENT

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  status: UserStatus; // ACTIVE, INACTIVE, BLOCKED

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLogin: Date;

  @Column('jsonb', { nullable: true })
  settings: Record<string, any>;
}
```

#### 5.1.2 UserProfile (Профили пользователей)
```typescript
// Профиль преподавателя
@Entity()
export class TeacherProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  speciality: string;

  @Column({ nullable: true })
  education: string;

  @Column({ type: 'int', nullable: true })
  experience: number;

  @Column('jsonb', { nullable: true })
  qualifications: Record<string, any>[];

  @Column('jsonb', { nullable: true })
  documents: Record<string, any>[];
}

// Профиль студента
@Entity()
export class StudentProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  class: string;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  iin: string;

  @Column({ nullable: true })
  nationality: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  parent: User;

  @Column('jsonb', { nullable: true })
  medicalInfo: Record<string, any>;
}
```

// Другие модели будут добавлены поэтапно в следующих секциях ТЗ 

## 6. Детальные спецификации модулей

### 6.1 Модуль чата (ChatPage)

#### 6.1.1 Общее описание
Модуль чата представляет собой систему обмена сообщениями между пользователями платформы. Система поддерживает текстовые сообщения, вложения различных типов, статусы сообщений, индикацию активности пользователей и другие функции современного мессенджера.

#### 6.1.2 Основные возможности
1. Обмен текстовыми сообщениями между пользователями
2. Групповые чаты (для команд учителей, родительских комитетов и т.д.)
3. Поддержка вложений (изображения, файлы)
4. Статусы сообщений (отправлено, доставлено, прочитано)
5. Индикация онлайн-статуса пользователей
6. Индикация набора текста
7. Голосовые сообщения
8. Поиск по чатам и сообщениям

#### 6.1.3 Доступ по ролям

| Роль          | Права доступа                                                            |
|---------------|--------------------------------------------------------------------------|
| ADMIN         | Полный доступ, включая модерацию всех чатов, создание системных чатов    |
| TEACHER       | Доступ к чатам с коллегами, учениками, родителями, групповым чатам       |
| STUDENT       | Доступ к чатам с преподавателями, одноклассниками и учебными группами    |
| PARENT        | Доступ к чатам с преподавателями, родительскими комитетами               |

#### 6.1.4 Модели данных

##### 6.1.4.1 Conversation (Беседа/Чат)
```typescript
@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ 
    type: 'enum', 
    enum: ConversationType,
    default: ConversationType.PRIVATE 
  })
  type: ConversationType; // PRIVATE, GROUP, SYSTEM

  @Column({ default: false })
  isSystemMessage: boolean;

  @ManyToMany(() => User)
  @JoinTable()
  participants: User[];

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Message, message => message.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastMessageAt: Date;
}

export enum ConversationType {
  PRIVATE = 'private',
  GROUP = 'group',
  SYSTEM = 'system'
}
```

##### 6.1.4.2 Message (Сообщение)
```typescript
@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, conversation => conversation.messages)
  conversation: Conversation;

  @ManyToOne(() => User)
  sender: User;

  @Column('text')
  text: string;

  @Column({ 
    type: 'enum', 
    enum: MessageStatus,
    default: MessageStatus.SENT 
  })
  status: MessageStatus; // SENT, DELIVERED, READ

  @OneToMany(() => MessageAttachment, attachment => attachment.message)
  attachments: MessageAttachment[];

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  replyToId: string;

  @ManyToOne(() => Message, { nullable: true })
  replyTo: Message;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read'
}
```

##### 6.1.4.3 MessageAttachment (Вложение)
```typescript
@Entity()
export class MessageAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Message, message => message.attachments)
  message: Message;

  @Column({
    type: 'enum',
    enum: AttachmentType
  })
  type: AttachmentType; // IMAGE, FILE, VOICE, VIDEO

  @Column()
  url: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  size: number;

  @Column({ nullable: true })
  mimeType: string;
  
  @Column({ nullable: true })
  duration: number; // для аудио/видео в секундах

  @CreateDateColumn()
  createdAt: Date;
}

export enum AttachmentType {
  IMAGE = 'image',
  FILE = 'file',
  VOICE = 'voice',
  VIDEO = 'video'
}
```

##### 6.1.4.4 ConversationParticipant (Участник чата)
```typescript
@Entity()
export class ConversationParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation)
  conversation: Conversation;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: 0 })
  unreadCount: number;

  @Column({ nullable: true })
  lastReadMessageId: string;

  @Column({ default: true })
  notifications: boolean;

  @Column({ default: false })
  isTyping: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastTypingAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### 6.1.5 API Endpoints

##### 6.1.5.1 Управление чатами
```typescript
@Controller('api/v1/conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  @Get()
  getConversations(
    @Req() req,
    @Query() query: ConversationQueryDto
  ): Promise<{ items: ConversationDto[]; meta: PaginationMeta }> {}

  @Post()
  createConversation(
    @Req() req,
    @Body() createConversationDto: CreateConversationDto
  ): Promise<ConversationDto> {}

  @Get(':id')
  getConversation(
    @Param('id') id: string,
    @Req() req
  ): Promise<ConversationDto> {}

  @Put(':id')
  updateConversation(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
    @Req() req
  ): Promise<ConversationDto> {}

  @Delete(':id')
  deleteConversation(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Post(':id/participants')
  addParticipants(
    @Param('id') id: string,
    @Body() addParticipantsDto: AddParticipantsDto,
    @Req() req
  ): Promise<ConversationDto> {}

  @Delete(':id/participants/:userId')
  removeParticipant(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Req() req
  ): Promise<void> {}

  @Get('search')
  searchConversations(
    @Query() searchDto: SearchConversationsDto,
    @Req() req
  ): Promise<{ items: ConversationDto[]; meta: PaginationMeta }> {}
}
```

##### 6.1.5.2 Управление сообщениями
```typescript
@Controller('api/v1/messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  @Get('conversation/:conversationId')
  getMessages(
    @Param('conversationId') conversationId: string,
    @Query() query: MessageQueryDto,
    @Req() req
  ): Promise<{ items: MessageDto[]; meta: PaginationMeta }> {}

  @Post()
  sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Req() req
  ): Promise<MessageDto> {}

  @Put(':id/status')
  updateMessageStatus(
    @Param('id') id: string,
    @Body() statusDto: UpdateMessageStatusDto,
    @Req() req
  ): Promise<MessageDto> {}

  @Delete(':id')
  deleteMessage(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Post('attachment')
  uploadAttachment(
    @Body() uploadDto: UploadAttachmentDto,
    @Req() req
  ): Promise<AttachmentDto> {}

  @Get('search')
  searchMessages(
    @Query() searchDto: SearchMessagesDto,
    @Req() req
  ): Promise<{ items: MessageDto[]; meta: PaginationMeta }> {}
}
```

#### 6.1.6 WebSocket события

```typescript
@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Обработка подключения пользователя
  handleConnection(client: Socket, ...args: any[]) {
    // Логика авторизации и подключения
  }

  // Обработка отключения пользователя
  handleDisconnect(client: Socket) {
    // Логика отключения и обновления статусов
  }

  // Пользователь отправляет сообщение
  @SubscribeMessage('message:send')
  handleSendMessage(client: Socket, payload: SendMessagePayload) {
    // Логика обработки и рассылки сообщения
  }

  // Пользователь прочитал сообщение
  @SubscribeMessage('message:read')
  handleReadMessage(client: Socket, payload: ReadMessagePayload) {
    // Обновление статуса сообщения
  }

  // Пользователь печатает сообщение
  @SubscribeMessage('user:typing')
  handleUserTyping(client: Socket, payload: TypingPayload) {
    // Индикация печати
  }

  // Обновление статуса онлайн
  @SubscribeMessage('user:status')
  handleUserStatus(client: Socket, payload: UserStatusPayload) {
    // Обновление и рассылка статуса
  }
}
```

#### 6.1.7 Бизнес-логика

##### 6.1.7.1 Создание и управление чатами
1. Система поддерживает два типа чатов: приватные (между двумя пользователями) и групповые
2. Для приватных чатов проверяется наличие существующего чата между пользователями
3. Для групповых чатов обязательно указание названия и списка участников
4. Администраторы могут создавать системные чаты для рассылки уведомлений

##### 6.1.7.2 Обработка сообщений
1. При отправке сообщения сначала проверяются права доступа отправителя к чату
2. Сообщение сохраняется в базе данных и получает статус "отправлено"
3. Сообщение доставляется получателям через WebSocket соединение
4. При получении сообщения клиентом статус обновляется на "доставлено"
5. При прочтении сообщения клиентом статус обновляется на "прочитано"

##### 6.1.7.3 Управление вложениями
1. Поддерживаются различные типы вложений: изображения, файлы, голосовые сообщения
2. Файлы загружаются на сервер и сохраняются в защищенном хранилище
3. Для каждого типа вложений устанавливаются ограничения по размеру
4. Изображения оптимизируются для быстрой загрузки (создаются превью)

##### 6.1.7.4 Управление статусами пользователей
1. Система отслеживает статусы пользователей (онлайн/оффлайн)
2. При подключении пользователя к WebSocket его статус меняется на "онлайн"
3. При отключении пользователя статус меняется на "оффлайн" с задержкой
4. Система отправляет уведомления об изменении статуса участникам чатов

#### 6.1.8 Интеграции
1. Система хранения файлов (S3 или аналог) для вложений
2. Сервис уведомлений для доставки сообщений в оффлайн
3. Сервис аутентификации для проверки прав доступа
4. Модуль пользователей для получения данных профилей

#### 6.1.9 Требования к производительности
1. Время доставки сообщения: не более 1 секунды
2. Поддержка не менее 1000 одновременных подключений
3. Кэширование часто запрашиваемых данных чатов
4. Историю сообщений загружать с пагинацией по 50 сообщений
5. Оптимизация запросов к базе данных (индексы по полям conversationId, senderId)

#### 6.1.10 Требования к безопасности
1. Шифрование сообщений в базе данных
2. Проверка прав доступа для каждого запроса к API чатов
3. Защита от XSS-атак при отображении сообщений
4. Ограничение размера вложений и проверка типов файлов
5. Защита WebSocket соединений от несанкционированного доступа

#### 6.1.11 Миграции и начальные данные
1. Создание необходимых таблиц в базе данных
2. Создание системных чатов для технической поддержки
3. Настройка индексов для оптимизации запросов
4. Создание временных данных для тестирования

#### 6.1.12 Мониторинг и логирование
1. Логирование всех операций с чатами и сообщениями
2. Мониторинг производительности WebSocket соединений
3. Отслеживание ошибок при доставке сообщений
4. Метрики активности пользователей и нагрузки на систему

### 6.2 Модуль AI-чата (AIChatPage)

#### 6.2.1 Общее описание
Модуль AI-чата представляет собой интерфейс для взаимодействия пользователей с AI-ассистентом через текстовый и голосовой ввод. Система поддерживает потоковый обмен данными в реальном времени, транскрипцию голосового ввода, историю диалогов и контекстные ответы AI.

#### 6.2.2 Основные возможности
1. Текстовый чат с AI-ассистентом
2. Голосовой ввод с транскрипцией в реальном времени
3. Потоковый ответ модели в реальном времени
4. История диалогов с возможностью возвращения к ранее начатым беседам
5. Поддержка различных форматов ответов (текст, код, изображения)
6. Сохранение и управление историей диалогов
7. Настройка поведения модели AI

#### 6.2.3 Доступ по ролям

| Роль          | Права доступа                                                           |
|---------------|-------------------------------------------------------------------------|
| ADMIN         | Полный доступ, специальные настройки модели, аналитика использования    |
| TEACHER       | Доступ к AI-чату для образовательных целей, возможность сохранения ответов для учебных материалов |
| STUDENT       | Доступ к AI-чату как репетитору, с ограничениями по количеству запросов |
| PARENT        | Ограниченный доступ (при необходимости) для помощи с учебным процессом  |

#### 6.2.4 Модели данных

##### 6.2.4.1 AIConversation (AI Диалог)
```typescript
@Entity()
export class AIConversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: AIConversationMode,
    default: AIConversationMode.CHAT
  })
  mode: AIConversationMode; // CHAT, VOICE, HYBRID

  @Column({
    type: 'enum',
    enum: AIModelType,
    default: AIModelType.GPT_4O
  })
  modelType: AIModelType;

  @Column('jsonb', { nullable: true })
  modelSettings: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => AIMessage, message => message.conversation)
  messages: AIMessage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastMessageAt: Date;
}

export enum AIConversationMode {
  CHAT = 'chat',
  VOICE = 'voice',
  HYBRID = 'hybrid'
}

export enum AIModelType {
  GPT_4O = 'gpt-4o',
  GPT_4O_MINI = 'gpt-4o-mini',
  GPT_4O_REALTIME = 'gpt-4o-realtime'
}
```

##### 6.2.4.2 AIMessage (AI Сообщение)
```typescript
@Entity()
export class AIMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AIConversation, conversation => conversation.messages)
  conversation: AIConversation;

  @Column({
    type: 'enum',
    enum: AIMessageRole,
    default: AIMessageRole.USER
  })
  role: AIMessageRole; // USER, ASSISTANT, SYSTEM

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: AIMessageType,
    default: AIMessageType.TEXT
  })
  type: AIMessageType; // TEXT, CODE, IMAGE

  @Column({ nullable: true })
  codeLanguage: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  processingTime: number;

  @Column({ nullable: true })
  tokenCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum AIMessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

export enum AIMessageType {
  TEXT = 'text',
  CODE = 'code',
  IMAGE = 'image'
}
```

##### 6.2.4.3 AIVoiceSession (Голосовая сессия)
```typescript
@Entity()
export class AIVoiceSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AIConversation)
  conversation: AIConversation;

  @Column()
  sessionId: string; // Внешний ID сессии от провайдера API

  @Column({ nullable: true })
  ephemeralToken: string;

  @Column({
    type: 'enum',
    enum: VoiceSessionStatus,
    default: VoiceSessionStatus.INITIALIZED
  })
  status: VoiceSessionStatus;

  @Column({ nullable: true })
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @Column({ default: 0 })
  duration: number; // в секундах

  @Column('jsonb', { nullable: true })
  transcriptionSettings: {
    language: string;
    model: string;
    options?: Record<string, any>;
  };

  @Column('jsonb', { nullable: true })
  metrics: {
    totalTokens?: number;
    audioProcessed?: number; // в секундах
    transcriptWords?: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum VoiceSessionStatus {
  INITIALIZED = 'initialized',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDED = 'ended',
  ERROR = 'error'
}
```

##### 6.2.4.4 AITranscription (Транскрипция голоса)
```typescript
@Entity()
export class AITranscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AIVoiceSession)
  session: AIVoiceSession;

  @Column()
  eventId: string;

  @Column()
  itemId: string;

  @Column({
    type: 'enum',
    enum: TranscriptionType,
    default: TranscriptionType.USER_INPUT
  })
  type: TranscriptionType; // USER_INPUT, AI_RESPONSE

  @Column('text')
  transcript: string;

  @Column({ nullable: true })
  confidence: number;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}

export enum TranscriptionType {
  USER_INPUT = 'user_input',
  AI_RESPONSE = 'ai_response'
}
```

#### 6.2.5 API Endpoints

##### 6.2.5.1 Управление диалогами с AI
```typescript
@Controller('api/v1/ai-chat/conversations')
@UseGuards(JwtAuthGuard)
export class AIConversationsController {
  @Get()
  getConversations(
    @Req() req,
    @Query() query: AIConversationQueryDto
  ): Promise<{ items: AIConversationDto[]; meta: PaginationMeta }> {}

  @Post()
  createConversation(
    @Req() req,
    @Body() createConversationDto: CreateAIConversationDto
  ): Promise<AIConversationDto> {}

  @Get(':id')
  getConversation(
    @Param('id') id: string,
    @Req() req
  ): Promise<AIConversationDto> {}

  @Put(':id')
  updateConversation(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateAIConversationDto,
    @Req() req
  ): Promise<AIConversationDto> {}

  @Delete(':id')
  deleteConversation(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Get(':id/messages')
  getMessages(
    @Param('id') id: string,
    @Query() query: AIMessageQueryDto,
    @Req() req
  ): Promise<{ items: AIMessageDto[]; meta: PaginationMeta }> {}
}
```

##### 6.2.5.2 Отправка сообщений AI
```typescript
@Controller('api/v1/ai-chat/messages')
@UseGuards(JwtAuthGuard)
export class AIMessagesController {
  @Post()
  sendMessage(
    @Body() sendMessageDto: SendAIMessageDto,
    @Req() req
  ): Promise<AIMessageDto> {}

  @Delete(':id')
  deleteMessage(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Get('stats')
  getUsageStats(
    @Query() query: AIStatsQueryDto,
    @Req() req
  ): Promise<AIUsageStatsDto> {}
}
```

##### 6.2.5.3 Управление голосовыми сессиями
```typescript
@Controller('api/v1/ai-chat/voice')
@UseGuards(JwtAuthGuard)
export class AIVoiceController {
  @Post('sessions')
  initVoiceSession(
    @Body() initSessionDto: InitVoiceSessionDto,
    @Req() req
  ): Promise<VoiceSessionDto> {}

  @Put('sessions/:id/status')
  updateSessionStatus(
    @Param('id') id: string,
    @Body() statusDto: UpdateVoiceSessionStatusDto,
    @Req() req
  ): Promise<VoiceSessionDto> {}

  @Get('sessions/:id/transcriptions')
  getTranscriptions(
    @Param('id') id: string,
    @Query() query: TranscriptionQueryDto,
    @Req() req
  ): Promise<{ items: TranscriptionDto[]; meta: PaginationMeta }> {}
}
```

#### 6.2.6 Интеграция с WebRTC и Realtime API

```typescript
@WebSocketGateway({
  namespace: 'ai-chat',
  cors: {
    origin: '*',
  },
})
export class AIChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Обработка подключения пользователя
  handleConnection(client: Socket, ...args: any[]) {
    // Аутентификация и авторизация клиента
  }

  // Обработка отключения пользователя
  handleDisconnect(client: Socket) {
    // Завершение активных сессий
  }

  // Инициализация голосовой сессии
  @SubscribeMessage('voice:init')
  handleVoiceInit(client: Socket, payload: VoiceInitPayload) {
    // Создание сессии с OpenAI Realtime API
  }

  // Создание SDP оффера для WebRTC
  @SubscribeMessage('voice:offer')
  handleVoiceOffer(client: Socket, payload: VoiceOfferPayload) {
    // Создание и отправка SDP предложения
  }

  // Обработка и пересылка событий транскрипции
  @SubscribeMessage('voice:transcription')
  handleTranscription(client: Socket, payload: TranscriptionPayload) {
    // Обработка и сохранение транскрипции
  }

  // Завершение голосовой сессии
  @SubscribeMessage('voice:end')
  handleVoiceEnd(client: Socket, payload: VoiceEndPayload) {
    // Завершение сессии и сохранение результатов
  }
}
```

#### 6.2.7 Бизнес-логика

##### 6.2.7.1 Инициализация сессии с AI
1. Проверка прав доступа пользователя к AI-сервису
2. Проверка лимитов использования (по токенам, запросам и т.д.)
3. Получение эфемерного токена от OpenAI API
4. Сохранение информации о сессии в базе данных
5. Возврат клиенту необходимых данных для установки соединения

##### 6.2.7.2 Обработка текстовых запросов к AI
1. Валидация входящего текстового запроса
2. Сохранение запроса в истории диалога
3. Обогащение контекста дополнительной информацией (роль пользователя, предметная область)
4. Отправка запроса к внешнему API AI-модели
5. Потоковая передача ответа клиенту
6. Сохранение полного ответа в истории диалога

##### 6.2.7.3 Обработка голосовых запросов
1. Инициализация WebRTC соединения для голосового ввода
2. Установка канала данных для обмена событиями
3. Обработка аудиопотока от пользователя
4. Транскрипция речи в текст в реальном времени
5. Отправка транскрибированного текста в AI-модель
6. Потоковая обработка ответа AI-модели
7. Синтез речи из ответа AI-модели
8. Передача синтезированной речи клиенту

##### 6.2.7.4 Управление историей диалогов
1. Автоматическое именование диалогов на основе содержания
2. Периодическое сохранение состояния диалога
3. Возможность продолжить любой ранее начатый диалог
4. Экспорт истории диалогов в различные форматы
5. Возможность удаления диалогов с уведомлением о политике хранения данных

#### 6.2.8 Интеграции
1. OpenAI API для текстовых моделей (GPT-4o, GPT-4o-mini)
2. OpenAI Realtime API для голосовых взаимодействий (GPT-4o-realtime)
3. Системы хранения для логов и метрик использования
4. Системы мониторинга для отслеживания стабильности работы
5. Система прав доступа и отслеживания использования ресурсов

#### 6.2.9 Требования к производительности
1. Время инициализации голосовой сессии: не более 3 секунд
2. Задержка отображения транскрипции: не более 500 мс
3. Время начала ответа на текстовый запрос: не более 1 секунды
4. Пропускная способность системы: не менее 100 одновременных сессий
5. Кэширование часто используемых промптов и ответов

#### 6.2.10 Требования к безопасности
1. Шифрование всех коммуникаций с внешними API
2. Хранение API-ключей в защищенном хранилище секретов
3. Проверка прав доступа для всех операций
4. Фильтрация и валидация всех пользовательских запросов
5. Ограничение скорости запросов (rate limiting) по пользователю
6. Логирование всех действий с сохранением IP и параметров сессии

#### 6.2.11 Управление лимитами и квотами
1. Настройка лимитов по количеству запросов в зависимости от роли
2. Отслеживание использования токенов на уровне пользователя и организации
3. Предупреждения о приближении к лимитам
4. Возможность приоритизации запросов от определенных пользователей
5. Система мониторинга затрат по API-ключам

#### 6.2.12 Мониторинг и логирование
1. Логирование всех запросов к AI-сервисам с уникальными идентификаторами
2. Отслеживание времени ответа и других метрик производительности
3. Мониторинг использования ресурсов (CPU, память) в режиме реального времени
4. Алерты при аномалиях в работе системы
5. Дашборды с ключевыми метриками использования AI-чата

### 6.3 Модуль Календаря (CalendarPage)

#### 6.3.1 Общее описание
Модуль Календаря представляет собой систему управления расписанием и событиями в образовательном учреждении. Он обеспечивает возможность создания, редактирования и просмотра различных типов событий (уроки, встречи, задачи, мероприятия) с учетом участников, аудиторий и временных рамок. Система поддерживает различные представления календаря и фильтрацию событий.

#### 6.3.2 Основные возможности
1. Управление различными типами событий (уроки, встречи, задачи, мероприятия)
2. Планирование занятий с привязкой к классам и аудиториям
3. Различные представления календаря (месяц, неделя, день, список)
4. Фильтрация событий по типу, участникам и классам
5. Перетаскивание событий для изменения даты и времени
6. Проверка доступности аудиторий и преподавателей
7. Уведомления об изменениях в расписании

#### 6.3.3 Доступ по ролям

| Роль          | Права доступа                                                            |
|---------------|--------------------------------------------------------------------------|
| ADMIN         | Полный доступ, создание и редактирование всех типов событий              |
| TEACHER       | Просмотр полного календаря, управление своими занятиями и встречами      |
| STUDENT       | Просмотр расписания своего класса и общешкольных мероприятий             |
| PARENT        | Просмотр расписания занятий ребенка и родительских собраний              |

#### 6.3.4 Модели данных

##### 6.3.4.1 CalendarEvent (Событие календаря)
```typescript
@Entity()
export class CalendarEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'timestamp with time zone' })
  startTime: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  endTime: Date;

  @Column({ default: false })
  allDay: boolean;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.EVENT
  })
  type: EventType; // MEETING, TASK, REMINDER, EVENT, CLASS

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  color: string;

  @ManyToOne(() => Classroom, { nullable: true })
  classroom: Classroom;

  @OneToMany(() => EventParticipant, participant => participant.event)
  participants: EventParticipant[];

  @ManyToOne(() => User)
  creator: User;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ type: 'jsonb', nullable: true })
  recurrenceRule: {
    frequency: string; // DAILY, WEEKLY, MONTHLY, YEARLY
    interval: number;
    endDate?: Date;
    daysOfWeek?: number[]; // 0-6, where 0 is Sunday
    count?: number;
    exceptions?: Date[];
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum EventType {
  MEETING = 'meeting',
  TASK = 'task',
  REMINDER = 'reminder',
  EVENT = 'event',
  CLASS = 'class'
}
```

##### 6.3.4.2 EventParticipant (Участник события)
```typescript
@Entity()
export class EventParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CalendarEvent, event => event.participants)
  event: CalendarEvent;

  @Column({
    type: 'enum',
    enum: ParticipantType,
    default: ParticipantType.OTHER
  })
  type: ParticipantType; // TEACHER, STUDENT, PARENT, STAFF, OTHER

  @Column('text', { array: true, nullable: true })
  groups: string[]; // Классы, например: ["9А", "9Б"]

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @Column({
    type: 'enum',
    enum: ParticipantStatus,
    default: ParticipantStatus.PENDING
  })
  status: ParticipantStatus; // PENDING, CONFIRMED, DECLINED

  @Column({ nullable: true })
  notificationSent: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum ParticipantType {
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
  STAFF = 'staff',
  OTHER = 'other'
}

export enum ParticipantStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DECLINED = 'declined'
}
```

##### 6.3.4.3 Classroom (Аудитория)
```typescript
@Entity()
export class Classroom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  number: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column('text', { array: true, default: [] })
  equipment: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  floor: number;

  @Column({ nullable: true })
  building: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### 6.3.5 API Endpoints

##### 6.3.5.1 Управление событиями календаря
```typescript
@Controller('api/v1/calendar/events')
@UseGuards(JwtAuthGuard)
export class CalendarEventsController {
  @Get()
  getEvents(
    @Query() query: CalendarEventQueryDto,
    @Req() req
  ): Promise<{ items: CalendarEventDto[]; meta: PaginationMeta }> {}

  @Post()
  createEvent(
    @Body() createEventDto: CreateCalendarEventDto,
    @Req() req
  ): Promise<CalendarEventDto> {}

  @Get(':id')
  getEvent(
    @Param('id') id: string,
    @Req() req
  ): Promise<CalendarEventDto> {}

  @Put(':id')
  updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateCalendarEventDto,
    @Req() req
  ): Promise<CalendarEventDto> {}

  @Delete(':id')
  deleteEvent(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Put(':id/reschedule')
  rescheduleEvent(
    @Param('id') id: string,
    @Body() rescheduleDto: RescheduleEventDto,
    @Req() req
  ): Promise<CalendarEventDto> {}

  @Get('conflicts')
  checkConflicts(
    @Query() query: ConflictCheckDto,
    @Req() req
  ): Promise<{ hasConflicts: boolean; conflicts: ConflictDto[] }> {}
}
```

##### 6.3.5.2 Управление участниками событий
```typescript
@Controller('api/v1/calendar/events/:eventId/participants')
@UseGuards(JwtAuthGuard)
export class EventParticipantsController {
  @Get()
  getParticipants(
    @Param('eventId') eventId: string,
    @Req() req
  ): Promise<{ items: EventParticipantDto[]; meta: PaginationMeta }> {}

  @Post()
  addParticipants(
    @Param('eventId') eventId: string,
    @Body() addParticipantsDto: AddParticipantsDto,
    @Req() req
  ): Promise<EventParticipantDto[]> {}

  @Delete(':participantId')
  removeParticipant(
    @Param('eventId') eventId: string,
    @Param('participantId') participantId: string,
    @Req() req
  ): Promise<void> {}

  @Put(':participantId/status')
  updateParticipantStatus(
    @Param('eventId') eventId: string,
    @Param('participantId') participantId: string,
    @Body() updateStatusDto: UpdateParticipantStatusDto,
    @Req() req
  ): Promise<EventParticipantDto> {}

  @Post('notify')
  notifyParticipants(
    @Param('eventId') eventId: string,
    @Body() notifyDto: NotifyParticipantsDto,
    @Req() req
  ): Promise<{ success: boolean; notified: number }> {}
}
```

##### 6.3.5.3 Управление аудиториями
```typescript
@Controller('api/v1/calendar/classrooms')
@UseGuards(JwtAuthGuard)
export class ClassroomsController {
  @Get()
  getClassrooms(
    @Query() query: ClassroomQueryDto,
    @Req() req
  ): Promise<{ items: ClassroomDto[]; meta: PaginationMeta }> {}

  @Post()
  @Roles('ADMIN')
  createClassroom(
    @Body() createClassroomDto: CreateClassroomDto,
    @Req() req
  ): Promise<ClassroomDto> {}

  @Get(':id')
  getClassroom(
    @Param('id') id: string,
    @Req() req
  ): Promise<ClassroomDto> {}

  @Put(':id')
  @Roles('ADMIN')
  updateClassroom(
    @Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
    @Req() req
  ): Promise<ClassroomDto> {}

  @Delete(':id')
  @Roles('ADMIN')
  deleteClassroom(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Get('availability')
  checkAvailability(
    @Query() query: ClassroomAvailabilityDto,
    @Req() req
  ): Promise<{ available: boolean; conflicts: CalendarEventDto[] }> {}
}
```

#### 6.3.6 Бизнес-логика

##### 6.3.6.1 Создание и управление событиями
1. При создании события проверяется доступность аудитории и участников
2. Для повторяющихся событий создаются экземпляры всех будущих дат
3. События классифицируются по типам с соответствующим визуальным оформлением
4. Поддерживаются различные продолжительности (весь день, конкретные часы)
5. Проверяется валидность временных интервалов и корректность заполнения данных

##### 6.3.6.2 Проверка конфликтов
1. Проверка конфликтов по аудитории (одна аудитория не может использоваться одновременно для разных событий)
2. Проверка конфликтов по участникам (один преподаватель не может вести несколько занятий одновременно)
3. Проверка конфликтов по классам (один класс не может иметь несколько занятий одновременно)
4. Предоставление альтернатив при обнаружении конфликтов (другие свободные аудитории, другое время)

##### 6.3.6.3 Управление повторяющимися событиями
1. Поддержка различных шаблонов повторения (ежедневно, еженедельно, ежемесячно)
2. Возможность редактирования как отдельного экземпляра, так и всей серии событий
3. Управление исключениями в повторяющихся событиях
4. Автоматический пересчет серии при изменении правил повторения

##### 6.3.6.4 Уведомления
1. Отправка уведомлений при создании или изменении событий в календаре
2. Уведомления о близких по времени событиях
3. Уведомления об изменениях в расписании
4. Управление подписками на уведомления по типам событий

#### 6.3.7 Интеграции
1. Система пользователей для определения участников и прав доступа
2. Система уведомлений для информирования об изменениях
3. Система экспорта для выгрузки календаря в форматы iCal, Excel
4. Интеграция с внешними календарями (возможность импорта/экспорта)
5. Система хранения файлов для вложений к событиям

#### 6.3.8 Требования к производительности
1. Эффективная обработка большого числа событий (>10000) без замедления
2. Кэширование часто запрашиваемых данных (расписания на текущую неделю)
3. Пагинация и фильтрация на уровне базы данных
4. Оптимизация запросов с индексами по датам, аудиториям и участникам
5. Ограничение выборки событий временными рамками на уровне запроса

#### 6.3.9 Требования к безопасности
1. Проверка прав доступа к событиям календаря
2. Разграничение доступа по ролям для создания и редактирования событий
3. Логирование всех изменений в календаре
4. Валидация входных данных для предотвращения инъекций

#### 6.3.10 Требования к экспорту и импорту
1. Экспорт календаря в формате iCalendar (.ics)
2. Экспорт в Excel для печати расписания
3. Возможность импорта из CSV/Excel шаблонов
4. API для синхронизации с внешними календарями

#### 6.3.11 Расширенные функции для администраторов
1. Массовое создание и редактирование событий
2. Автоматическое распределение аудиторий на основе требований
3. Анализ загруженности помещений и преподавателей
4. Автоматизированное составление расписания на основе заданных параметров

### 6.4 Модуль списка задач (TodoPage)

#### 6.4.1 Общее описание
Модуль списка задач представляет собой систему управления задачами и делами для сотрудников образовательного учреждения. Система обеспечивает возможность создания, редактирования, приоритизации и отслеживания выполнения задач с поддержкой как списочного, так и канбан-представления. Реализована гибкая система тегов, фильтрации, назначения ответственных и наблюдателей за задачами.

#### 6.4.2 Основные возможности
1. Создание и управление задачами различных типов и приоритетов
2. Гибкая система статусов (к выполнению, в работе, на проверке, выполнено)
3. Назначение ответственных исполнителей и наблюдателей за задачами
4. Два режима представления: список и канбан-доска
5. Тегирование задач с возможностью фильтрации
6. Drag-and-drop интерфейс для изменения статуса задач
7. Установка сроков выполнения задач с уведомлениями
8. Отметка важных и срочных задач

#### 6.4.3 Доступ по ролям

| Роль          | Права доступа                                                            |
|---------------|--------------------------------------------------------------------------|
| ADMIN         | Полный доступ, создание и редактирование всех задач, массовые операции   |
| TEACHER       | Управление своими задачами, просмотр назначенных задач                   |
| STUDENT       | Только назначенные им задачи, ограниченные возможности редактирования    |
| PARENT        | Отсутствие доступа к системе задач                                       |

#### 6.4.4 Модели данных

##### 6.4.4.1 Todo (Задача)
```typescript
@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: false })
  important: boolean;

  @Column({ nullable: true })
  dueDate: Date;

  @Column('simple-array')
  tags: string[];

  @Column({
    type: 'enum',
    enum: TodoStatus,
    default: TodoStatus.TODO
  })
  status: TodoStatus;

  @ManyToOne(() => User, { nullable: true })
  assignee: User;

  @Column({
    type: 'enum',
    enum: PriorityLevel,
    default: PriorityLevel.MEDIUM
  })
  priority: PriorityLevel;

  @ManyToMany(() => User)
  @JoinTable()
  watchers: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  creator: User;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  completedBy: string;

  @Column({ default: true })
  isActive: boolean;
}

export enum TodoStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done'
}

export enum PriorityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}
```

##### 6.4.4.2 TodoComment (Комментарий к задаче)
```typescript
@Entity()
export class TodoComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Todo, todo => todo.comments)
  todo: Todo;

  @ManyToOne(() => User)
  author: User;

  @Column('text')
  content: string;

  @OneToMany(() => TodoCommentAttachment, attachment => attachment.comment)
  attachments: TodoCommentAttachment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isEdited: boolean;
}
```

##### 6.4.4.3 TodoCommentAttachment (Вложение к комментарию)
```typescript
@Entity()
export class TodoCommentAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TodoComment, comment => comment.attachments)
  comment: TodoComment;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @Column()
  fileSize: number;

  @Column()
  fileType: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

##### 6.4.4.4 TodoHistory (История изменений задачи)
```typescript
@Entity()
export class TodoHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Todo)
  todo: Todo;

  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'enum',
    enum: TodoHistoryAction
  })
  action: TodoHistoryAction;

  @Column('jsonb', { nullable: true })
  oldValues: Record<string, any>;

  @Column('jsonb', { nullable: true })
  newValues: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}

export enum TodoHistoryAction {
  CREATED = 'created',
  UPDATED = 'updated',
  STATUS_CHANGED = 'status_changed',
  ASSIGNED = 'assigned',
  COMPLETED = 'completed',
  DELETED = 'deleted'
}
```

#### 6.4.5 API Endpoints

##### 6.4.5.1 Управление задачами
```typescript
@Controller('api/v1/todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  @Get()
  getTodos(
    @Query() query: TodoQueryDto,
    @Req() req
  ): Promise<{ items: TodoDto[]; meta: PaginationMeta }> {}

  @Post()
  createTodo(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req
  ): Promise<TodoDto> {}

  @Get(':id')
  getTodo(
    @Param('id') id: string,
    @Req() req
  ): Promise<TodoDto> {}

  @Put(':id')
  updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req
  ): Promise<TodoDto> {}

  @Delete(':id')
  deleteTodo(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() statusDto: UpdateTodoStatusDto,
    @Req() req
  ): Promise<TodoDto> {}

  @Patch(':id/complete')
  completeTodo(
    @Param('id') id: string,
    @Req() req
  ): Promise<TodoDto> {}

  @Patch(':id/important')
  toggleImportant(
    @Param('id') id: string,
    @Req() req
  ): Promise<TodoDto> {}

  @Get('stats')
  getStats(
    @Query() query: TodoStatsQueryDto,
    @Req() req
  ): Promise<TodoStatsDto> {}
}
```

##### 6.4.5.2 Управление комментариями к задачам
```typescript
@Controller('api/v1/todos/:todoId/comments')
@UseGuards(JwtAuthGuard)
export class TodoCommentsController {
  @Get()
  getComments(
    @Param('todoId') todoId: string,
    @Query() query: PaginationDto,
    @Req() req
  ): Promise<{ items: TodoCommentDto[]; meta: PaginationMeta }> {}

  @Post()
  createComment(
    @Param('todoId') todoId: string,
    @Body() createCommentDto: CreateTodoCommentDto,
    @Req() req
  ): Promise<TodoCommentDto> {}

  @Put(':commentId')
  updateComment(
    @Param('todoId') todoId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateTodoCommentDto,
    @Req() req
  ): Promise<TodoCommentDto> {}

  @Delete(':commentId')
  deleteComment(
    @Param('todoId') todoId: string,
    @Param('commentId') commentId: string,
    @Req() req
  ): Promise<void> {}

  @Post(':commentId/attachments')
  addAttachments(
    @Param('todoId') todoId: string,
    @Param('commentId') commentId: string,
    @Body() attachmentsDto: AddAttachmentsDto,
    @Req() req
  ): Promise<TodoCommentAttachmentDto[]> {}
}
```

##### 6.4.5.3 Управление тегами
```typescript
@Controller('api/v1/todos/tags')
@UseGuards(JwtAuthGuard)
export class TodoTagsController {
  @Get()
  getTags(
    @Req() req
  ): Promise<string[]> {}

  @Post()
  createTag(
    @Body() createTagDto: CreateTagDto,
    @Req() req
  ): Promise<{ tag: string }> {}

  @Delete(':tag')
  deleteTag(
    @Param('tag') tag: string,
    @Req() req
  ): Promise<void> {}

  @Get('popular')
  getPopularTags(
    @Query() query: { limit?: number },
    @Req() req
  ): Promise<{ tag: string; count: number }[]> {}
}
```

#### 6.4.6 Бизнес-логика

##### 6.4.6.1 Создание и управление задачами
1. При создании задачи пользователь указывает заголовок, описание, срок выполнения и прочие параметры
2. Система автоматически присваивает задаче статус "к выполнению" (todo)
3. Можно назначить ответственное лицо и наблюдателей за задачей
4. Задачи могут иметь различные приоритеты (низкий, средний, высокий)
5. Важные задачи помечаются для более заметного отображения в интерфейсе

##### 6.4.6.2 Управление статусами задач
1. Задача может находиться в одном из четырех статусов: к выполнению, в работе, на проверке, выполнено
2. Изменение статуса может происходить как через API, так и через drag-and-drop в канбан-представлении
3. При изменении статуса система регистрирует изменение в истории с указанием времени и пользователя
4. Возможность настройки автоматических переходов между статусами при определенных условиях

##### 6.4.6.3 Уведомления и напоминания
1. Система отправляет уведомления о приближающихся сроках выполнения задач
2. Исполнители получают уведомления о новых назначенных им задачах
3. Наблюдатели получают уведомления об изменении статуса задачи
4. Настраиваемые напоминания о задачах, которые скоро должны быть выполнены

##### 6.4.6.4 Аналитика и статистика
1. Сбор статистики по выполнению задач (время выполнения, соблюдение сроков)
2. Анализ эффективности работы сотрудников на основе выполненных задач
3. Отчеты по распределению задач между сотрудниками
4. Визуализация данных о задачах в виде графиков и диаграмм

#### 6.4.7 Интеграции
1. Система уведомлений для отправки напоминаний и оповещений
2. Интеграция с календарем для отображения задач с дедлайнами
3. Система хранения файлов для вложений и комментариев
4. Интеграция с почтовой системой для уведомлений по email

#### 6.4.8 Требования к производительности
1. Быстрая загрузка списка задач с фильтрацией и пагинацией
2. Оптимизированные запросы для канбан-представления
3. Кэширование списков тегов и статистики
4. Оптимизация запросов для быстрого изменения статусов задач

#### 6.4.9 Требования к безопасности
1. Проверка прав доступа к задачам на основе ролей и назначений
2. Логирование всех изменений задач в истории
3. Защита от несанкционированного доступа к задачам других пользователей
4. Валидация входных данных для предотвращения инъекций

#### 6.4.10 Дополнительные функции
1. Массовые операции с задачами (изменение статуса, назначение ответственных)
2. Поиск и фильтрация задач по различным параметрам
3. Экспорт списка задач в различные форматы (Excel, PDF)
4. Шаблоны задач для быстрого создания типовых задач

#### 6.4.11 Мобильные возможности
1. API должен поддерживать мобильные клиенты
2. Оптимизированные запросы для экономии трафика
3. Push-уведомления для мобильных устройств
4. Оффлайн-режим с синхронизацией при восстановлении соединения

### 6.5 Модуль FIZMAT.AI (NeuroAbaiPage)

#### 6.5.1 Общее описание
Модуль FIZMAT.AI представляет собой интеллектуального помощника для преподавателей, основанного на технологиях искусственного интеллекта. Система предназначена для автоматизации различных аспектов работы учителя, включая анализ календарно-тематического планирования (КТП), оптимизацию учебных материалов, создание контрольных работ и обнаружение ошибок в документах. Модуль обеспечивает взаимодействие пользователя с ИИ через текстовый интерфейс и позволяет загружать документы для анализа.

#### 6.5.2 Основные возможности
1. Анализ календарно-тематического планирования (КТП)
2. Улучшение и переформулирование целей уроков
3. Оптимизация учебных заданий для учеников
4. Создание суммативного оценивания раздела/четверти (СОР/СОЧ)
5. Проверка документов на наличие ошибок
6. Загрузка и обработка документов различных форматов
7. Контекстное взаимодействие с пользователем через диалоговый интерфейс

#### 6.5.3 Доступ по ролям

| Роль          | Права доступа                                                              |
|---------------|----------------------------------------------------------------------------|
| ADMIN         | Полный доступ, включая настройку моделей, мониторинг использования         |
| TEACHER       | Полный функциональный доступ ко всем возможностям ИИ-помощника             |
| STUDENT       | Нет доступа к модулю (может использовать AI-чат вместо этого)              |
| PARENT        | Нет доступа к модулю                                                       |

#### 6.5.4 Модели данных

##### 6.5.4.1 AIScenario (Сценарий использования ИИ)
```typescript
@Entity()
export class AIScenario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  @Column('text')
  prompt: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  description: string;

  @Column()
  order: number;

  @ManyToMany(() => Role)
  @JoinTable()
  availableForRoles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

##### 6.5.4.2 AISession (Сессия взаимодействия с ИИ)
```typescript
@Entity()
export class AISession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => AIScenario)
  scenario: AIScenario;

  @Column({ nullable: true })
  title: string;

  @Column({ default: false })
  isArchived: boolean;

  @Column({ nullable: true })
  summary: string;

  @Column({ type: 'decimal', nullable: true })
  tokenUsage: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;
}
```

##### 6.5.4.3 AIMessage (Сообщение в сессии ИИ)
```typescript
@Entity()
export class AIMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AISession, session => session.messages)
  session: AISession;

  @Column({
    type: 'enum',
    enum: MessageRole,
    default: MessageRole.USER
  })
  role: MessageRole;

  @Column('text')
  content: string;

  @Column({ default: 0 })
  tokenCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => AIMessageAttachment, attachment => attachment.message)
  attachments: AIMessageAttachment[];
}

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}
```

##### 6.5.4.4 AIMessageAttachment (Вложение к сообщению ИИ)
```typescript
@Entity()
export class AIMessageAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AIMessage, message => message.attachments)
  message: AIMessage;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @Column()
  fileSize: number;

  @Column()
  mimeType: string;

  @Column({ default: false })
  isProcessed: boolean;

  @Column('text', { nullable: true })
  extractedText: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

##### 6.5.4.5 AIUsageStats (Статистика использования ИИ)
```typescript
@Entity()
export class AIUsageStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => AIScenario, { nullable: true })
  scenario: AIScenario;

  @Column()
  sessionCount: number;

  @Column()
  messageCount: number;

  @Column('decimal')
  totalTokens: number;

  @Column('decimal')
  totalCost: number;

  @Column('date')
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### 6.5.5 API Endpoints

##### 6.5.5.1 Управление сценариями ИИ
```typescript
@Controller('api/v1/neuro-abai/scenarios')
@UseGuards(JwtAuthGuard)
export class AIScenariosController {
  @Get()
  @Roles('ADMIN', 'TEACHER')
  getScenarios(
    @Req() req
  ): Promise<AIScenarioDto[]> {}

  @Post()
  @Roles('ADMIN')
  createScenario(
    @Body() createScenarioDto: CreateAIScenarioDto,
    @Req() req
  ): Promise<AIScenarioDto> {}

  @Get(':id')
  @Roles('ADMIN', 'TEACHER')
  getScenario(
    @Param('id') id: string,
    @Req() req
  ): Promise<AIScenarioDto> {}

  @Put(':id')
  @Roles('ADMIN')
  updateScenario(
    @Param('id') id: string,
    @Body() updateScenarioDto: UpdateAIScenarioDto,
    @Req() req
  ): Promise<AIScenarioDto> {}

  @Delete(':id')
  @Roles('ADMIN')
  deleteScenario(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Patch(':id/order')
  @Roles('ADMIN')
  updateOrder(
    @Param('id') id: string,
    @Body() orderDto: UpdateScenarioOrderDto,
    @Req() req
  ): Promise<AIScenarioDto> {}
}
```

##### 6.5.5.2 Взаимодействие с ИИ
```typescript
@Controller('api/v1/neuro-abai/messages')
@UseGuards(JwtAuthGuard)
export class AIMessagesController {
  @Post()
  @Roles('ADMIN', 'TEACHER')
  sendMessage(
    @Body() sendMessageDto: SendAIMessageDto,
    @Req() req
  ): Promise<AIResponseDto> {}

  @Post('upload')
  @Roles('ADMIN', 'TEACHER')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() uploadDto: UploadFilesDto,
    @Req() req
  ): Promise<AIAttachmentDto[]> {}

  @Get('sessions')
  @Roles('ADMIN', 'TEACHER')
  getSessions(
    @Query() query: AISessionQueryDto,
    @Req() req
  ): Promise<{ items: AISessionDto[]; meta: PaginationMeta }> {}

  @Get('sessions/:id')
  @Roles('ADMIN', 'TEACHER')
  getSession(
    @Param('id') id: string,
    @Req() req
  ): Promise<AISessionDto> {}

  @Get('sessions/:id/messages')
  @Roles('ADMIN', 'TEACHER')
  getSessionMessages(
    @Param('id') id: string,
    @Query() query: PaginationDto,
    @Req() req
  ): Promise<{ items: AIMessageDto[]; meta: PaginationMeta }> {}

  @Delete('sessions/:id')
  @Roles('ADMIN', 'TEACHER')
  deleteSession(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Patch('sessions/:id/archive')
  @Roles('ADMIN', 'TEACHER')
  archiveSession(
    @Param('id') id: string,
    @Body() archiveDto: ArchiveSessionDto,
    @Req() req
  ): Promise<AISessionDto> {}
}
```

##### 6.5.5.3 Статистика использования
```typescript
@Controller('api/v1/neuro-abai/stats')
@UseGuards(JwtAuthGuard)
export class AIStatsController {
  @Get('usage')
  @Roles('ADMIN')
  getUsageStats(
    @Query() query: AIStatsQueryDto
  ): Promise<AIUsageStatsDto> {}

  @Get('user-usage')
  @Roles('ADMIN', 'TEACHER')
  getUserStats(
    @Query() query: AIUserStatsQueryDto,
    @Req() req
  ): Promise<AIUserStatsDto> {}

  @Get('scenarios-usage')
  @Roles('ADMIN')
  getScenariosStats(
    @Query() query: AIScenarioStatsQueryDto
  ): Promise<AIScenarioStatsDto[]> {}

  @Get('daily')
  @Roles('ADMIN')
  getDailyStats(
    @Query() query: AIDailyStatsQueryDto
  ): Promise<AIDailyStatsDto[]> {}
}
```

#### 6.5.6 Бизнес-логика

##### 6.5.6.1 Обработка запросов к ИИ
1. Система принимает запрос пользователя с указанием сценария и опциональными файлами
2. При наличии файлов они загружаются на сервер, обрабатываются и извлекается содержимое
3. Формируется запрос к внешнему API ИИ с учетом выбранного сценария и контента файлов
4. Полученный ответ проходит постобработку для форматирования и преобразования в удобный вид
5. Ответ сохраняется в истории сессии и отправляется пользователю

##### 6.5.6.2 Анализ документов
1. Для каждого типа документов (КТП, планы уроков, контрольные работы) определены специализированные промпты
2. Система извлекает текст из загруженных документов в зависимости от формата (PDF, DOCX, XLSX)
3. В запрос к ИИ добавляются специфические инструкции по анализу данного типа документов
4. Результаты анализа структурируются для удобного восприятия пользователем
5. При необходимости создаются визуализации данных (графики, таблицы) на основе анализа

##### 6.5.6.3 Управление сессиями
1. Каждый диалог с ИИ сохраняется как отдельная сессия
2. Сессии могут быть архивированы, восстановлены или удалены пользователем
3. Для каждой сессии автоматически генерируется заголовок и краткое содержание
4. Сессии группируются по типам сценариев для удобного поиска
5. Поддерживается экспорт результатов сессии в различные форматы (PDF, DOCX)

##### 6.5.6.4 Учет использования ресурсов
1. Система ведет учет использованных токенов для каждого запроса и ответа
2. Собирается статистика по использованию различных сценариев
3. Администраторы имеют доступ к аналитике использования по пользователям и отделам
4. Настраиваются лимиты использования для разных групп пользователей
5. Оптимизация запросов для минимизации расхода токенов

#### 6.5.7 Интеграции
1. Интеграция с внешними API для обработки естественного языка (OpenAI, Anthropic)
2. Система хранения файлов для управления вложениями
3. Модуль пользователей для проверки прав доступа
4. Система уведомлений для информирования о готовности результатов обработки
5. Интеграция с офисными приложениями для работы с документами

#### 6.5.8 Требования к производительности
1. Обработка текстовых запросов до 4096 токенов за время не более 5 секунд
2. Извлечение текста из документов объемом до 100 страниц за время не более 30 секунд
3. Одновременная поддержка до 100 активных сессий
4. Использование кэширования результатов для часто запрашиваемых сценариев
5. Асинхронная обработка тяжелых задач с уведомлением о завершении

#### 6.5.9 Требования к безопасности
1. Шифрование всех данных при передаче и хранении
2. Проверка файлов на вирусы перед обработкой
3. Ограничение доступа к функциям модуля по ролям
4. Логирование всех операций с персональными данными
5. Ограничение доступа к загруженным документам только автору запроса
6. Автоматическое удаление файлов после обработки и сохранения результатов

#### 6.5.10 Требования к обработке файлов
1. Поддержка форматов: PDF, DOCX, XLSX, TXT, RTF, PNG, JPG
2. Извлечение текста из изображений с использованием OCR
3. Сохранение структуры документов при извлечении содержимого
4. Ограничение размера файла до 20 МБ
5. Возможность загрузки до 5 файлов за один запрос

#### 6.5.11 Экспорт и импорт
1. Экспорт результатов анализа в форматы PDF, DOCX
2. Экспорт сессий за выбранный период для архивации
3. Экспорт статистики использования в CSV
4. Возможность импорта шаблонов и примеров документов для обучения системы
5. Экспорт результатов в виде, готовом для вставки в образовательные программы

### 6.6 Модуль электронного журнала (AcademicJournalPage)

#### 6.6.1 Общее описание
Модуль электронного журнала представляет собой систему учета успеваемости и посещаемости учащихся. Функционал включает выставление оценок, отметку посещаемости, просмотр статистики успеваемости, экспорт данных журнала. Система поддерживает различные типы оценок (классная работа, домашняя работа, контрольные), гибкую систему оценивания (по 100-балльной шкале) и разные представления данных для различных ролей пользователей.

#### 6.6.2 Основные возможности
1. Выставление оценок за различные типы работ (классная работа, домашняя работа)
2. Отметка посещаемости с указанием причины отсутствия
3. Автоматический расчет средних оценок
4. Фильтрация данных журнала по предмету, классу, периоду
5. Просмотр статистики успеваемости и посещаемости
6. Экспорт данных журнала в Excel
7. Разграничение доступа в зависимости от роли пользователя
8. Возможность комментирования оценок
9. Просмотр истории изменений оценок

#### 6.6.3 Доступ по ролям

| Роль          | Права доступа                                                            |
|---------------|--------------------------------------------------------------------------|
| ADMIN         | Полный доступ ко всем функциям журнала для всех классов и предметов      |
| TEACHER       | Выставление/редактирование оценок только для своих предметов и классов   |
| STUDENT       | Просмотр только своих оценок без возможности редактирования              |
| PARENT        | Просмотр оценок только своих детей без возможности редактирования        |

#### 6.6.4 Модели данных

##### 6.6.4.1 AcademicClass (Учебный класс)
```typescript
@Entity()
export class AcademicClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  specialization: string;

  @Column()
  academicYear: string;

  @ManyToOne(() => User)
  headTeacher: User;

  @OneToMany(() => Student, student => student.academicClass)
  students: Student[];

  @ManyToMany(() => Subject)
  @JoinTable()
  subjects: Subject[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

##### 6.6.4.2 Subject (Предмет)
```typescript
@Entity()
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  shortName: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => AcademicClass)
  classes: AcademicClass[];

  @ManyToMany(() => User)
  @JoinTable()
  teachers: User[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

##### 6.6.4.3 Lesson (Урок)
```typescript
@Entity()
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Subject)
  subject: Subject;

  @ManyToOne(() => AcademicClass)
  academicClass: AcademicClass;

  @ManyToOne(() => User)
  teacher: User;

  @Column()
  date: Date;

  @Column({ nullable: true })
  topic: string;

  @Column({
    type: 'enum',
    enum: LessonType,
    default: LessonType.LECTURE
  })
  type: LessonType;

  @Column({ nullable: true })
  homeworkAssignment: string;

  @Column({ default: true })
  isCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum LessonType {
  LECTURE = 'lecture',
  PRACTICE = 'practice',
  LAB = 'lab',
  EXAM = 'exam',
  TEST = 'test'
}
```

##### 6.6.4.4 Grade (Оценка)
```typescript
@Entity()
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Lesson)
  lesson: Lesson;

  @Column('decimal', { precision: 5, scale: 2 })
  value: number;

  @Column({
    type: 'enum',
    enum: GradeType,
    default: GradeType.CLASSWORK
  })
  type: GradeType;

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => User)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  editedBy: string;

  @Column({ nullable: true })
  lastEditedAt: Date;
}

export enum GradeType {
  CLASSWORK = 'classwork',
  HOMEWORK = 'homework',
  EXAM = 'exam',
  TEST = 'test',
  PROJECT = 'project',
  QUARTER = 'quarter',
  SEMESTER = 'semester',
  FINAL = 'final'
}
```

##### 6.6.4.5 Attendance (Посещаемость)
```typescript
@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Lesson)
  lesson: Lesson;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT
  })
  status: AttendanceStatus;

  @Column({ nullable: true })
  reason: string;

  @Column({ default: false })
  isExcused: boolean;

  @ManyToOne(() => User)
  recordedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late'
}
```

##### 6.6.4.6 GradeHistory (История изменений оценок)
```typescript
@Entity()
export class GradeHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Grade)
  grade: Grade;

  @Column('decimal', { precision: 5, scale: 2 })
  oldValue: number;

  @Column('decimal', { precision: 5, scale: 2 })
  newValue: number;

  @Column({ nullable: true })
  oldComment: string;

  @Column({ nullable: true })
  newComment: string;

  @ManyToOne(() => User)
  changedBy: User;

  @Column({ nullable: true })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

#### 6.6.5 API Endpoints

##### 6.6.5.1 Управление журналом
```typescript
@Controller('api/v1/academic-journal')
@UseGuards(JwtAuthGuard)
export class AcademicJournalController {
  @Get()
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getJournal(
    @Query() query: JournalQueryDto,
    @Req() req
  ): Promise<{ items: JournalEntryDto[]; meta: PaginationMeta }> {}

  @Get('students')
  @Roles('ADMIN', 'TEACHER')
  getStudents(
    @Query() query: StudentsQueryDto,
    @Req() req
  ): Promise<{ items: StudentDto[]; meta: PaginationMeta }> {}

  @Get('lessons')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getLessons(
    @Query() query: LessonsQueryDto,
    @Req() req
  ): Promise<{ items: LessonDto[]; meta: PaginationMeta }> {}

  @Post('lessons')
  @Roles('ADMIN', 'TEACHER')
  createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @Req() req
  ): Promise<LessonDto> {}

  @Get('classes')
  @Roles('ADMIN', 'TEACHER')
  getClasses(
    @Query() query: ClassesQueryDto,
    @Req() req
  ): Promise<{ items: AcademicClassDto[]; meta: PaginationMeta }> {}

  @Get('subjects')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getSubjects(
    @Req() req
  ): Promise<SubjectDto[]> {}

  @Get('export')
  @Roles('ADMIN', 'TEACHER')
  exportJournal(
    @Query() query: ExportJournalDto,
    @Req() req,
    @Res() res
  ): Promise<void> {}
}
```

##### 6.6.5.2 Управление оценками
```typescript
@Controller('api/v1/academic-journal/grades')
@UseGuards(JwtAuthGuard)
export class GradesController {
  @Post()
  @Roles('ADMIN', 'TEACHER')
  addGrade(
    @Body() addGradeDto: AddGradeDto,
    @Req() req
  ): Promise<GradeDto> {}

  @Put(':id')
  @Roles('ADMIN', 'TEACHER')
  updateGrade(
    @Param('id') id: string,
    @Body() updateGradeDto: UpdateGradeDto,
    @Req() req
  ): Promise<GradeDto> {}

  @Delete(':id')
  @Roles('ADMIN', 'TEACHER')
  deleteGrade(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Get('history/:gradeId')
  @Roles('ADMIN', 'TEACHER')
  getGradeHistory(
    @Param('gradeId') gradeId: string,
    @Req() req
  ): Promise<GradeHistoryDto[]> {}

  @Post('batch')
  @Roles('ADMIN', 'TEACHER')
  addBatchGrades(
    @Body() batchGradesDto: BatchGradesDto,
    @Req() req
  ): Promise<{ successful: number; failed: number }> {}
}
```

##### 6.6.5.3 Управление посещаемостью
```typescript
@Controller('api/v1/academic-journal/attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  @Post()
  @Roles('ADMIN', 'TEACHER')
  recordAttendance(
    @Body() attendanceDto: RecordAttendanceDto,
    @Req() req
  ): Promise<AttendanceDto> {}

  @Put(':id')
  @Roles('ADMIN', 'TEACHER')
  updateAttendance(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
    @Req() req
  ): Promise<AttendanceDto> {}

  @Post('batch')
  @Roles('ADMIN', 'TEACHER')
  recordBatchAttendance(
    @Body() batchAttendanceDto: BatchAttendanceDto,
    @Req() req
  ): Promise<{ successful: number; failed: number }> {}

  @Get('report')
  @Roles('ADMIN', 'TEACHER', 'PARENT')
  getAttendanceReport(
    @Query() query: AttendanceReportQueryDto,
    @Req() req
  ): Promise<AttendanceReportDto> {}
}
```

##### 6.6.5.4 Статистика и отчеты
```typescript
@Controller('api/v1/academic-journal/statistics')
@UseGuards(JwtAuthGuard)
export class StatisticsController {
  @Get()
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getStatistics(
    @Query() query: StatisticsQueryDto,
    @Req() req
  ): Promise<StatisticsDto> {}

  @Get('class-performance')
  @Roles('ADMIN', 'TEACHER')
  getClassPerformance(
    @Query() query: ClassPerformanceQueryDto,
    @Req() req
  ): Promise<ClassPerformanceDto> {}

  @Get('student-progress')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getStudentProgress(
    @Query() query: StudentProgressQueryDto,
    @Req() req
  ): Promise<StudentProgressDto> {}

  @Get('period-summary')
  @Roles('ADMIN', 'TEACHER')
  getPeriodSummary(
    @Query() query: PeriodSummaryQueryDto,
    @Req() req
  ): Promise<PeriodSummaryDto> {}
}
```

#### 6.6.6 Бизнес-логика

##### 6.6.6.1 Выставление и учет оценок
1. Система поддерживает различные типы оценок: за классную работу, домашнюю работу, экзамены, тесты
2. Оценки выставляются по 100-балльной шкале с автоматическим расчетом средних показателей
3. Учитель может оставлять комментарии к оценкам, объясняющие причину выставления
4. При обновлении или удалении оценки сохраняется история изменений с указанием причины
5. Реализована защита от изменения оценки задним числом (более 3 дней) без специальных прав
6. Система поддерживает выставление оценок как индивидуально, так и массово для группы студентов

##### 6.6.6.2 Учет посещаемости
1. Учет посещаемости ведется для каждого занятия по трем статусам: присутствует, отсутствует, опоздал
2. При отметке отсутствия указывается причина (болезнь, уважительная причина, неуважительная причина)
3. Поддерживается массовая отметка посещаемости для группы студентов
4. Автоматический расчет процента посещаемости для студента и класса
5. Система уведомлений при систематических пропусках занятий

##### 6.6.6.3 Расчет итоговых оценок
1. Автоматический расчет средних оценок с учетом веса разных типов работ
2. Формирование четвертных, семестровых и годовых оценок на основе текущих
3. Применение различных алгоритмов расчета в зависимости от предмета и типа оценки
4. Прогнозирование итоговых оценок на основе текущей успеваемости
5. Выявление студентов в зоне риска (с пограничными оценками)

##### 6.6.6.4 Статистика и аналитика
1. Расчет среднего балла по предмету, классу и студенту
2. Анализ динамики успеваемости с визуализацией прогресса
3. Сравнительный анализ успеваемости между классами, группами, периодами
4. Выявление корреляций между посещаемостью и успеваемостью
5. Формирование отчетов для администрации образовательного учреждения

#### 6.6.7 Интеграции
1. Интеграция с системой уведомлений для оповещения родителей об оценках и посещаемости
2. Интеграция с системой расписания для получения информации о занятиях
3. Интеграция с системой управления классами для получения списков студентов
4. Экспорт данных в Excel, PDF для формирования печатных форм журналов
5. Интеграция с системой статистики и отчетности для формирования аналитики

#### 6.6.8 Требования к производительности
1. Загрузка данных журнала не более 2 секунд для класса из 30 учеников
2. Быстрая навигация между различными представлениями журнала
3. Эффективная пагинация и фильтрация для больших массивов данных
4. Оптимизированное хранение истории изменений без ущерба для производительности
5. Кэширование часто запрашиваемых данных (списки классов, предметов) до 1 часа

#### 6.6.9 Требования к безопасности
1. Строгое разграничение доступа по ролям и проверка прав на каждый запрос
2. Логирование всех операций с оценками с указанием кто, когда и какие изменения внес
3. Защита от массового изменения данных без соответствующих прав
4. Криптографическая защита API-вызовов для предотвращения подделки запросов
5. Запрет на изменение оценок за прошедшие периоды без специальных прав

#### 6.6.10 Дополнительные функции
1. Система уведомлений о новых оценках и пропусках
2. Печать журнала в различных форматах
3. Импорт оценок из электронных таблиц
4. Система напоминаний о невыставленных оценках
5. Поддержка различных систем оценивания (буквенная, 5-балльная, 10-балльная, 100-балльная)
6. Возможность сортировки студентов по успеваемости и посещаемости

### 6.7 Модуль расписания (SchedulePage)

#### 6.7.1 Общее описание
Модуль расписания представляет собой систему управления и отображения расписания занятий образовательного учреждения. Функционал включает создание, редактирование и просмотр расписания занятий с учетом преподавателей, предметов, аудиторий и групп студентов. Система предоставляет различные представления расписания (таблица, сетка), возможности фильтрации, импорта/экспорта данных и интеллектуального составления расписания с помощью ИИ.

#### 6.7.2 Основные возможности
1. Создание и управление расписанием занятий
2. Просмотр расписания в виде таблицы или сетки по неделям
3. Фильтрация занятий по дню недели, группе, предмету, преподавателю и аудитории
4. Проверка конфликтов расписания (совпадение аудиторий, преподавателей, групп)
5. Импорт и экспорт расписания в формате Excel
6. Автоматическое составление расписания с использованием алгоритмов ИИ
7. Разграничение доступа в зависимости от роли пользователя
8. Управление аудиториями и их доступностью

#### 6.7.3 Доступ по ролям

| Роль          | Права доступа                                                            |
|---------------|--------------------------------------------------------------------------|
| ADMIN         | Полный доступ к созданию и редактированию расписания, импорту и AI       |
| TEACHER       | Просмотр полного расписания и своих занятий, фильтрация без редактирования |
| STUDENT       | Просмотр расписания своей группы без возможности редактирования          |
| PARENT        | Просмотр расписания группы своего ребенка без возможности редактирования |

#### 6.7.4 Модели данных

##### 6.7.4.1 Schedule (Расписание)
```typescript
@Entity()
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Subject)
  subject: Subject;

  @ManyToOne(() => AcademicClass)
  academicClass: AcademicClass;

  @ManyToOne(() => User)
  teacher: User;

  @ManyToOne(() => Classroom)
  classroom: Classroom;

  @Column({
    type: 'enum',
    enum: WeekDay,
  })
  day: WeekDay;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({
    type: 'enum',
    enum: LessonType,
    default: LessonType.LESSON
  })
  type: LessonType;

  @Column({
    type: 'enum',
    enum: RepeatType,
    default: RepeatType.WEEKLY
  })
  repeat: RepeatType;

  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    default: ScheduleStatus.UPCOMING
  })
  status: ScheduleStatus;

  @Column({ nullable: true })
  comment: string;

  @Column()
  semester: number;

  @Column()
  academicYear: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  updatedBy: User;
}

export enum WeekDay {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}

export enum LessonType {
  LESSON = 'lesson',
  CONSULTATION = 'consultation',
  EXTRA = 'extra',
  EXAM = 'exam',
  TEST = 'test'
}

export enum RepeatType {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  ONCE = 'once'
}

export enum ScheduleStatus {
  UPCOMING = 'upcoming',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

##### 6.7.4.2 Classroom (Аудитория)
```typescript
@Entity()
export class Classroom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  capacity: number;

  @Column({ nullable: true })
  floor: number;

  @Column({ nullable: true })
  building: string;

  @Column('text', { array: true, default: [] })
  equipment: string[];

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => ClassroomUnavailability, unavailability => unavailability.classroom)
  unavailablePeriods: ClassroomUnavailability[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

##### 6.7.4.3 ClassroomUnavailability (Недоступность аудитории)
```typescript
@Entity()
export class ClassroomUnavailability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Classroom, classroom => classroom.unavailablePeriods)
  classroom: Classroom;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ nullable: true })
  reason: string;

  @ManyToOne(() => User)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;
}
```

##### 6.7.4.4 ScheduleChange (Изменение в расписании)
```typescript
@Entity()
export class ScheduleChange {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Schedule)
  schedule: Schedule;

  @Column()
  date: Date;

  @Column({ 
    type: 'enum',
    enum: ChangeType 
  })
  type: ChangeType;

  @Column({ nullable: true })
  newClassroomId: string;

  @Column({ nullable: true })
  newTeacherId: string;

  @Column({ nullable: true })
  newStartTime: string;

  @Column({ nullable: true })
  newEndTime: string;

  @Column({ nullable: true })
  reason: string;

  @Column({ default: false })
  isNotified: boolean;

  @ManyToOne(() => User)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;
}

export enum ChangeType {
  CANCEL = 'cancel',
  RESCHEDULE = 'reschedule',
  ROOM_CHANGE = 'room_change',
  TEACHER_CHANGE = 'teacher_change'
}
```

##### 6.7.4.5 AIScheduleRequest (Запрос ИИ на составление расписания)
```typescript
@Entity()
export class AIScheduleRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  academicYear: string;

  @Column()
  semester: number;

  @ManyToMany(() => AcademicClass)
  @JoinTable()
  classes: AcademicClass[];

  @ManyToMany(() => Subject)
  @JoinTable()
  subjects: Subject[];

  @ManyToMany(() => User)
  @JoinTable()
  teachers: User[];

  @Column({
    type: 'enum',
    enum: AIRequestStatus,
    default: AIRequestStatus.PENDING
  })
  status: AIRequestStatus;

  @Column('jsonb', { nullable: true })
  constraints: Record<string, any>;

  @Column('jsonb', { nullable: true })
  result: Record<string, any>;

  @Column({ nullable: true })
  errorMessage: string;

  @ManyToOne(() => User)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;
}

export enum AIRequestStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}
```

#### 6.7.5 API Endpoints

##### 6.7.5.1 Управление расписанием
```typescript
@Controller('api/v1/schedule')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  @Get()
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getSchedule(
    @Query() query: ScheduleQueryDto,
    @Req() req
  ): Promise<{ items: ScheduleDto[]; meta: PaginationMeta }> {}

  @Post()
  @Roles('ADMIN')
  createSchedule(
    @Body() createScheduleDto: CreateScheduleDto,
    @Req() req
  ): Promise<ScheduleDto> {}

  @Get(':id')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getScheduleItem(
    @Param('id') id: string,
    @Req() req
  ): Promise<ScheduleDto> {}

  @Put(':id')
  @Roles('ADMIN')
  updateSchedule(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @Req() req
  ): Promise<ScheduleDto> {}

  @Delete(':id')
  @Roles('ADMIN')
  deleteSchedule(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Post('batch')
  @Roles('ADMIN')
  createBatchSchedule(
    @Body() batchScheduleDto: BatchScheduleDto,
    @Req() req
  ): Promise<{ successful: number; failed: number }> {}

  @Post('import')
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  importSchedule(
    @UploadedFile() file: Express.Multer.File,
    @Body() importDto: ImportScheduleDto,
    @Req() req
  ): Promise<{ imported: number; errors: string[] }> {}

  @Get('export')
  @Roles('ADMIN', 'TEACHER')
  exportSchedule(
    @Query() query: ExportScheduleDto,
    @Req() req,
    @Res() res
  ): Promise<void> {}

  @Post('check-conflicts')
  @Roles('ADMIN')
  checkConflicts(
    @Body() checkConflictsDto: CheckConflictsDto,
    @Req() req
  ): Promise<{ hasConflicts: boolean; conflicts: ConflictDto[] }> {}
}
```

##### 6.7.5.2 Управление аудиториями
```typescript
@Controller('api/v1/schedule/classrooms')
@UseGuards(JwtAuthGuard)
export class ClassroomsController {
  @Get()
  @Roles('ADMIN', 'TEACHER')
  getClassrooms(
    @Query() query: ClassroomQueryDto,
    @Req() req
  ): Promise<{ items: ClassroomDto[]; meta: PaginationMeta }> {}

  @Post()
  @Roles('ADMIN')
  createClassroom(
    @Body() createClassroomDto: CreateClassroomDto,
    @Req() req
  ): Promise<ClassroomDto> {}

  @Get(':id')
  @Roles('ADMIN', 'TEACHER')
  getClassroom(
    @Param('id') id: string,
    @Req() req
  ): Promise<ClassroomDto> {}

  @Put(':id')
  @Roles('ADMIN')
  updateClassroom(
    @Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
    @Req() req
  ): Promise<ClassroomDto> {}

  @Delete(':id')
  @Roles('ADMIN')
  deleteClassroom(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Get(':id/availability')
  @Roles('ADMIN', 'TEACHER')
  getClassroomAvailability(
    @Param('id') id: string,
    @Query() query: AvailabilityQueryDto,
    @Req() req
  ): Promise<ClassroomAvailabilityDto[]> {}

  @Post(':id/unavailability')
  @Roles('ADMIN')
  addUnavailabilityPeriod(
    @Param('id') id: string,
    @Body() unavailabilityDto: UnavailabilityDto,
    @Req() req
  ): Promise<ClassroomUnavailabilityDto> {}

  @Delete('unavailability/:id')
  @Roles('ADMIN')
  removeUnavailabilityPeriod(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}
}
```

##### 6.7.5.3 Управление изменениями расписания
```typescript
@Controller('api/v1/schedule/changes')
@UseGuards(JwtAuthGuard)
export class ScheduleChangesController {
  @Get()
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getScheduleChanges(
    @Query() query: ScheduleChangesQueryDto,
    @Req() req
  ): Promise<{ items: ScheduleChangeDto[]; meta: PaginationMeta }> {}

  @Post()
  @Roles('ADMIN')
  createScheduleChange(
    @Body() createChangeDto: CreateScheduleChangeDto,
    @Req() req
  ): Promise<ScheduleChangeDto> {}

  @Delete(':id')
  @Roles('ADMIN')
  deleteScheduleChange(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Post('notify')
  @Roles('ADMIN')
  notifyAboutChanges(
    @Body() notifyDto: NotifyChangesDto,
    @Req() req
  ): Promise<{ notified: number }> {}
}
```

##### 6.7.5.4 AI-составление расписания
```typescript
@Controller('api/v1/schedule/ai')
@UseGuards(JwtAuthGuard)
@Roles('ADMIN')
export class AIScheduleController {
  @Post('generate')
  generateSchedule(
    @Body() generateDto: GenerateScheduleDto,
    @Req() req
  ): Promise<{ requestId: string }> {}

  @Get('requests')
  getAIRequests(
    @Query() query: AIRequestsQueryDto,
    @Req() req
  ): Promise<{ items: AIScheduleRequestDto[]; meta: PaginationMeta }> {}

  @Get('requests/:id')
  getAIRequest(
    @Param('id') id: string,
    @Req() req
  ): Promise<AIScheduleRequestDto> {}

  @Post('requests/:id/apply')
  applyAISchedule(
    @Param('id') id: string,
    @Body() applyDto: ApplyAIScheduleDto,
    @Req() req
  ): Promise<{ applied: number }> {}

  @Delete('requests/:id')
  deleteAIRequest(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Get('constraints')
  getAvailableConstraints(
    @Req() req
  ): Promise<ConstraintDto[]> {}
}
```

#### 6.7.6 Бизнес-логика

##### 6.7.6.1 Управление расписанием
1. Создание и редактирование расписания с учетом доступности аудиторий и преподавателей
2. Проверка на конфликты (совпадение времени для аудитории, преподавателя или группы)
3. Поддержка различных типов занятий (уроки, консультации, доп. занятия, экзамены)
4. Поддержка разных периодов повторения (еженедельно, раз в две недели, единожды)
5. Фильтрация расписания по различным параметрам (день, группа, предмет, преподаватель, аудитория)
6. Дифференцированный доступ к расписанию для разных ролей пользователей

##### 6.7.6.2 Обработка изменений в расписании
1. Регистрация изменений в расписании (отмена, перенос, смена аудитории, замена преподавателя)
2. Отправка уведомлений о изменениях всем заинтересованным сторонам
3. Ведение истории изменений с указанием причин и ответственных лиц
4. Возможность массового внесения изменений при форс-мажорных обстоятельствах
5. Автоматическое определение затронутых изменениями участников образовательного процесса

##### 6.7.6.3 Управление аудиториями
1. Регистрация аудиторий с указанием их вместимости, оборудования и местоположения
2. Отметка периодов недоступности аудиторий (ремонт, технические работы)
3. Проверка доступности аудитории при составлении расписания
4. Учет специфических требований к аудиториям для различных предметов
5. Автоматический подбор подходящей аудитории при составлении расписания

##### 6.7.6.4 AI-составление расписания
1. Асинхронное формирование расписания с использованием алгоритмов искусственного интеллекта
2. Учет различных параметров и ограничений (нагрузка преподавателей, предпочтения по времени)
3. Оптимизация расписания для минимизации "окон" и равномерного распределения нагрузки
4. Возможность предварительного просмотра сгенерированного расписания перед применением
5. Интерактивная настройка параметров генерации для получения оптимального результата

#### 6.7.7 Интеграции
1. Интеграция с модулем пользователей для получения информации о преподавателях и группах
2. Интеграция с модулем уведомлений для информирования об изменениях в расписании
3. Интеграция с модулем учебного журнала для связи занятий с оценками
4. Интеграция с календарной системой для отображения расписания в личных календарях
5. API для мобильных приложений с возможностью просмотра расписания оффлайн

#### 6.7.8 Требования к производительности
1. Быстрая загрузка расписания даже при большом количестве занятий (>1000)
2. Оптимизированная фильтрация и поиск для минимизации времени отклика
3. Кэширование часто запрашиваемых данных (расписание на текущую неделю)
4. Асинхронная обработка тяжелых операций (импорт/экспорт, AI-генерация)
5. Эффективная работа системы при одновременном доступе большого числа пользователей

#### 6.7.9 Требования к безопасности
1. Строгое разграничение прав доступа в соответствии с ролями пользователей
2. Логирование всех операций по созданию и изменению расписания
3. Защита от массового несанкционированного изменения расписания
4. Валидация входных данных для предотвращения инъекций
5. Предотвращение конфликтов при параллельном редактировании расписания

#### 6.7.10 Дополнительные функции
1. Экспорт расписания в различные форматы (Excel, PDF, iCal)
2. Печать расписания с возможностью настройки вида и формата
3. Настраиваемые напоминания о предстоящих занятиях
4. Визуализация занятости аудиторий и преподавателей
5. Статистика и аналитика по расписанию (загруженность аудиторий, преподавателей)
6. Сравнение вариантов расписания для выбора оптимального

### 6.8 Модуль домашних заданий (HomeworkPage)

#### 6.8.1 Общее описание
Модуль домашних заданий представляет собой систему управления учебными заданиями в образовательной платформе. Функционал включает создание, публикацию и проверку домашних заданий учителями, выполнение и отправку заданий учениками, просмотр результатов родителями. Система поддерживает различные типы заданий, прикрепление файлов, оценивание работ и обратную связь для учеников.

#### 6.8.2 Основные возможности
1. Создание и публикация домашних заданий учителями
2. Выполнение и отправка заданий учениками
3. Прикрепление файлов к заданиям и ответам
4. Отслеживание сроков выполнения заданий
5. Проверка и оценивание выполненных работ
6. Предоставление обратной связи ученикам
7. Отслеживание статистики выполнения заданий
8. Фильтрация и поиск по заданиям
9. Приоритизация заданий (важные, срочные)

#### 6.8.3 Доступ по ролям

| Роль          | Права доступа                                                            |
|---------------|--------------------------------------------------------------------------|
| ADMIN         | Полный доступ, обзор всех заданий и статистики, управление настройками   |
| TEACHER       | Создание, редактирование и проверка заданий для своих классов            |
| STUDENT       | Просмотр и выполнение назначенных заданий, отправка решений              |
| PARENT        | Просмотр заданий своих детей и результатов выполнения                    |

#### 6.8.4 Модели данных

##### 6.8.4.1 Homework (Домашнее задание)
```typescript
@Entity()
export class Homework {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => Subject)
  subject: Subject;

  @ManyToOne(() => AcademicClass)
  academicClass: AcademicClass;

  @ManyToOne(() => User)
  teacher: User;

  @Column()
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: HomeworkPriority,
    default: HomeworkPriority.MEDIUM
  })
  priority: HomeworkPriority;

  @Column()
  estimatedTime: number; // в минутах

  @Column()
  maxScore: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => HomeworkAttachment, attachment => attachment.homework)
  attachments: HomeworkAttachment[];

  @OneToMany(() => HomeworkSubmission, submission => submission.homework)
  submissions: HomeworkSubmission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  updatedBy: User;
}

export enum HomeworkPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}
```

##### 6.8.4.2 HomeworkAttachment (Вложение к заданию)
```typescript
@Entity()
export class HomeworkAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Homework, homework => homework.attachments)
  homework: Homework;

  @Column()
  fileName: string;

  @Column()
  originalFileName: string;

  @Column()
  fileUrl: string;

  @Column()
  fileSize: number;

  @Column()
  mimeType: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

##### 6.8.4.3 HomeworkSubmission (Ответ на задание)
```typescript
@Entity()
export class HomeworkSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Homework, homework => homework.submissions)
  homework: Homework;

  @ManyToOne(() => User)
  student: User;

  @Column('text', { nullable: true })
  comment: string;

  @OneToMany(() => SubmissionAttachment, attachment => attachment.submission)
  attachments: SubmissionAttachment[];

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.SUBMITTED
  })
  status: SubmissionStatus;

  @Column({ nullable: true })
  grade: number;

  @Column('text', { nullable: true })
  feedback: string;

  @ManyToOne(() => User, { nullable: true })
  checkedBy: User;

  @Column({ nullable: true })
  checkedAt: Date;

  @CreateDateColumn()
  submittedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum SubmissionStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  GRADED = 'graded',
  RETURNED = 'returned',
  RESUBMIT = 'resubmit'
}
```

##### 6.8.4.4 SubmissionAttachment (Вложение к ответу)
```typescript
@Entity()
export class SubmissionAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => HomeworkSubmission, submission => submission.attachments)
  submission: HomeworkSubmission;

  @Column()
  fileName: string;

  @Column()
  originalFileName: string;

  @Column()
  fileUrl: string;

  @Column()
  fileSize: number;

  @Column()
  mimeType: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

##### 6.8.4.5 HomeworkStatus (Статус задания для студента)
```typescript
@Entity()
export class HomeworkStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Homework)
  homework: Homework;

  @ManyToOne(() => User)
  student: User;

  @Column({
    type: 'enum',
    enum: HomeworkStatusType,
    default: HomeworkStatusType.PENDING
  })
  status: HomeworkStatusType;

  @Column({ default: false })
  isViewed: boolean;

  @Column({ nullable: true })
  viewedAt: Date;

  @Column({ nullable: true })
  notifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum HomeworkStatusType {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  OVERDUE = 'overdue'
}
```

#### 6.8.5 API Endpoints

##### 6.8.5.1 Управление домашними заданиями
```typescript
@Controller('api/v1/homeworks')
@UseGuards(JwtAuthGuard)
export class HomeworksController {
  @Get()
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getHomeworks(
    @Query() query: HomeworkQueryDto,
    @Req() req
  ): Promise<{ items: HomeworkDto[]; meta: PaginationMeta }> {}

  @Post()
  @Roles('ADMIN', 'TEACHER')
  createHomework(
    @Body() createHomeworkDto: CreateHomeworkDto,
    @Req() req
  ): Promise<HomeworkDto> {}

  @Get(':id')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getHomework(
    @Param('id') id: string,
    @Req() req
  ): Promise<HomeworkDto> {}

  @Put(':id')
  @Roles('ADMIN', 'TEACHER')
  updateHomework(
    @Param('id') id: string,
    @Body() updateHomeworkDto: UpdateHomeworkDto,
    @Req() req
  ): Promise<HomeworkDto> {}

  @Delete(':id')
  @Roles('ADMIN', 'TEACHER')
  deleteHomework(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Post(':id/mark-viewed')
  @Roles('STUDENT')
  markHomeworkViewed(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Get('subjects')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getSubjects(
    @Req() req
  ): Promise<SubjectDto[]> {}

  @Get('classes')
  @Roles('ADMIN', 'TEACHER')
  getClasses(
    @Req() req
  ): Promise<AcademicClassDto[]> {}

  @Get('statistics')
  @Roles('ADMIN', 'TEACHER')
  getStatistics(
    @Query() query: HomeworkStatsQueryDto,
    @Req() req
  ): Promise<HomeworkStatisticsDto> {}
}
```

##### 6.8.5.2 Управление вложениями
```typescript
@Controller('api/v1/homeworks/:homeworkId/attachments')
@UseGuards(JwtAuthGuard)
export class HomeworkAttachmentsController {
  @Post()
  @Roles('ADMIN', 'TEACHER')
  @UseInterceptors(FilesInterceptor('files'))
  uploadAttachments(
    @Param('homeworkId') homeworkId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req
  ): Promise<HomeworkAttachmentDto[]> {}

  @Delete(':attachmentId')
  @Roles('ADMIN', 'TEACHER')
  deleteAttachment(
    @Param('homeworkId') homeworkId: string,
    @Param('attachmentId') attachmentId: string,
    @Req() req
  ): Promise<void> {}

  @Get('download/:attachmentId')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  downloadAttachment(
    @Param('homeworkId') homeworkId: string,
    @Param('attachmentId') attachmentId: string,
    @Req() req,
    @Res() res
  ): Promise<void> {}
}
```

##### 6.8.5.3 Управление ответами на задания
```typescript
@Controller('api/v1/homeworks/:homeworkId/submissions')
@UseGuards(JwtAuthGuard)
export class HomeworkSubmissionsController {
  @Get()
  @Roles('ADMIN', 'TEACHER')
  getSubmissions(
    @Param('homeworkId') homeworkId: string,
    @Query() query: SubmissionQueryDto,
    @Req() req
  ): Promise<{ items: HomeworkSubmissionDto[]; meta: PaginationMeta }> {}

  @Post()
  @Roles('STUDENT')
  @UseInterceptors(FilesInterceptor('files'))
  submitHomework(
    @Param('homeworkId') homeworkId: string,
    @Body() submitDto: SubmitHomeworkDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req
  ): Promise<HomeworkSubmissionDto> {}

  @Get(':submissionId')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getSubmission(
    @Param('homeworkId') homeworkId: string,
    @Param('submissionId') submissionId: string,
    @Req() req
  ): Promise<HomeworkSubmissionDto> {}

  @Post(':submissionId/grade')
  @Roles('ADMIN', 'TEACHER')
  gradeSubmission(
    @Param('homeworkId') homeworkId: string,
    @Param('submissionId') submissionId: string,
    @Body() gradeDto: GradeSubmissionDto,
    @Req() req
  ): Promise<HomeworkSubmissionDto> {}

  @Put(':submissionId')
  @Roles('STUDENT')
  @UseInterceptors(FilesInterceptor('files'))
  updateSubmission(
    @Param('homeworkId') homeworkId: string,
    @Param('submissionId') submissionId: string,
    @Body() updateDto: UpdateSubmissionDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req
  ): Promise<HomeworkSubmissionDto> {}

  @Get(':submissionId/attachments/:attachmentId/download')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  downloadSubmissionAttachment(
    @Param('homeworkId') homeworkId: string,
    @Param('submissionId') submissionId: string,
    @Param('attachmentId') attachmentId: string,
    @Req() req,
    @Res() res
  ): Promise<void> {}
}
```

#### 6.8.6 Бизнес-логика

##### 6.8.6.1 Создание и управление заданиями
1. Учителя создают задания, указывая название, описание, срок сдачи и максимальный балл
2. Возможность прикрепления файлов и учебных материалов к заданиям
3. Задания публикуются для конкретных классов или групп студентов
4. Поддержка приоритизации заданий (низкий, средний, высокий)
5. Указание предполагаемого времени выполнения задания
6. Возможность создания черновиков заданий и последующей публикации
7. Автоматическое уведомление студентов о новых заданиях

##### 6.8.6.2 Выполнение и сдача заданий
1. Студенты просматривают список назначенных им заданий
2. Поддержка фильтрации по предметам, статусу и срокам выполнения
3. Возможность прикрепления файлов и комментариев при отправке выполненного задания
4. Отслеживание сроков сдачи с уведомлениями о приближающихся дедлайнах
5. Автоматическая пометка заданий как просроченных в случае пропуска дедлайна
6. Возможность повторной отправки задания, если преподаватель вернул его на доработку

##### 6.8.6.3 Проверка и оценивание
1. Учителя видят список отправленных работ по заданию
2. Просмотр содержимого и файлов, прикрепленных студентами
3. Выставление оценок по заданной шкале баллов
4. Предоставление письменной обратной связи или комментариев к работе
5. Возможность возврата работы на доработку с пояснениями
6. Автоматическое уведомление студента о проверке работы

##### 6.8.6.4 Анализ и статистика
1. Отслеживание общей статистики по выполнению заданий в классе
2. Анализ времени сдачи (вовремя, с опозданием, заранее)
3. Расчет средних оценок по заданиям, предметам и классам
4. Выявление проблемных областей на основе результатов выполнения
5. Сравнение производительности между группами и классами
6. Формирование отчетов для администрации и родителей

#### 6.8.7 Интеграции
1. Интеграция с модулем уведомлений для отправки напоминаний о сроках
2. Интеграция с системой хранения файлов для вложений
3. Связь с модулем оценок для учета результатов выполнения заданий
4. Интеграция с календарем для отображения сроков сдачи
5. Связь с модулем пользователей для получения информации о студентах и классах

#### 6.8.8 Требования к производительности
1. Быстрая загрузка списка заданий даже при большом количестве записей
2. Эффективное управление загрузкой и скачиванием файлов больших размеров
3. Оптимизация запросов для быстрого поиска и фильтрации заданий
4. Кэширование часто запрашиваемых данных (списки предметов, классов)
5. Асинхронная обработка загрузки и скачивания файлов для улучшения UX

#### 6.8.9 Требования к безопасности
1. Строгое разграничение доступа к заданиям и ответам по ролям
2. Защита файлов от несанкционированного доступа
3. Валидация всех загружаемых файлов на наличие вирусов и вредоносного кода
4. Логирование всех действий с заданиями и ответами
5. Шифрование чувствительных данных при хранении и передаче

#### 6.8.10 Дополнительные функции
1. Поддержка различных типов заданий (тесты, эссе, проекты)
2. Возможность массового создания заданий для нескольких классов
3. Автоматическая проверка на плагиат при сдаче текстовых работ
4. Система напоминаний о невыполненных заданиях
5. Экспорт списка заданий и результатов в различные форматы
6. Настраиваемые шаблоны заданий для быстрого создания

### 6.9 Модуль аудиторий (ClassroomsPage)

#### 6.9.1 Общее описание
Модуль аудиторий представляет собой систему управления учебными помещениями образовательного учреждения. Функционал включает учет аудиторий различных типов, их оборудования, ответственных лиц, занятости и технического состояния. Система предназначена для эффективного управления помещениями, планирования расписания и контроля материально-технической базы учреждения.

#### 6.9.2 Основные возможности
1. Учет и категоризация аудиторий по типам (лекционные, компьютерные, лаборатории и т.д.)
2. Отслеживание статуса занятости аудиторий (свободна, занята, на ремонте)
3. Управление оборудованием и инвентарем аудиторий
4. Назначение ответственных лиц за конкретные помещения
5. Фильтрация и поиск аудиторий по различным параметрам
6. Учет технического состояния помещений и оборудования
7. Хранение документации, связанной с аудиториями
8. Формирование отчетов по использованию помещений

#### 6.9.3 Доступ по ролям

| Роль          | Права доступа                                                            |
|---------------|--------------------------------------------------------------------------|
| ADMIN         | Полный доступ, включая добавление/удаление аудиторий, назначение ответственных |
| TEACHER       | Просмотр информации об аудиториях, данных об оборудовании                |
| STUDENT       | Ограниченный доступ для просмотра базовой информации об аудиториях       |
| PARENT        | Нет доступа к модулю аудиторий                                           |

#### 6.9.4 Модели данных

##### 6.9.4.1 Classroom (Аудитория)
```typescript
@Entity()
export class Classroom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ClassroomType
  })
  type: ClassroomType;

  @Column()
  capacity: number;

  @Column()
  floor: number;

  @Column({ nullable: true })
  building: string;

  @Column({ nullable: true })
  area: number; // площадь в кв.м

  @Column({
    type: 'enum',
    enum: ClassroomStatus,
    default: ClassroomStatus.FREE
  })
  status: ClassroomStatus;

  @OneToMany(() => ClassroomEquipment, equipment => equipment.classroom)
  equipment: ClassroomEquipment[];

  @OneToMany(() => ClassroomResponsible, responsible => responsible.classroom)
  responsiblePersons: ClassroomResponsible[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  updatedBy: User;
}

export enum ClassroomType {
  LECTURE = 'lecture',
  COMPUTER = 'computer',
  LABORATORY = 'laboratory',
  CONFERENCE = 'conference',
  CABINET = 'cabinet',
  GYM = 'gym',
  LIBRARY = 'library',
  AUDITORIUM = 'auditorium',
  OTHER = 'other'
}

export enum ClassroomStatus {
  FREE = 'free',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  RESERVED = 'reserved',
  UNAVAILABLE = 'unavailable'
}
```

##### 6.9.4.2 ClassroomEquipment (Оборудование аудитории)
```typescript
@Entity()
export class ClassroomEquipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Classroom, classroom => classroom.equipment)
  classroom: Classroom;

  @Column()
  name: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  serialNumber: string;

  @Column({ nullable: true })
  inventoryNumber: string;

  @Column({ nullable: true })
  quantity: number;

  @Column({
    type: 'enum',
    enum: EquipmentStatus,
    default: EquipmentStatus.OPERATIONAL
  })
  status: EquipmentStatus;

  @Column({ nullable: true })
  lastChecked: Date;

  @Column({ nullable: true })
  purchaseDate: Date;

  @Column({ nullable: true })
  warrantyEnd: Date;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum EquipmentStatus {
  OPERATIONAL = 'operational',
  NEEDS_REPAIR = 'needs_repair',
  OUT_OF_ORDER = 'out_of_order',
  IN_REPAIR = 'in_repair',
  DEPRECATED = 'deprecated'
}
```

##### 6.9.4.3 ClassroomResponsible (Ответственное лицо за аудиторию)
```typescript
@Entity()
export class ClassroomResponsible {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Classroom, classroom => classroom.responsiblePersons)
  classroom: Classroom;

  @ManyToOne(() => User)
  person: User;

  @Column({
    type: 'enum',
    enum: ResponsibleRole,
    default: ResponsibleRole.PRIMARY
  })
  role: ResponsibleRole;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum ResponsibleRole {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TECHNICAL = 'technical',
  ADMINISTRATIVE = 'administrative'
}
```

##### 6.9.4.4 ClassroomMaintenance (Техническое обслуживание аудитории)
```typescript
@Entity()
export class ClassroomMaintenance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Classroom)
  classroom: Classroom;

  @Column({
    type: 'enum',
    enum: MaintenanceType
  })
  type: MaintenanceType;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.SCHEDULED
  })
  status: MaintenanceStatus;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  result: string;

  @Column({ nullable: true })
  cost: number;

  @ManyToOne(() => User)
  requestedBy: User;

  @ManyToOne(() => User, { nullable: true })
  performedBy: User;

  @Column({ nullable: true })
  contractor: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum MaintenanceType {
  SCHEDULED = 'scheduled',
  EMERGENCY = 'emergency',
  PREVENTIVE = 'preventive',
  RENOVATION = 'renovation',
  INSPECTION = 'inspection'
}

export enum MaintenanceStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DELAYED = 'delayed'
}
```

##### 6.9.4.5 ClassroomDocument (Документы аудитории)
```typescript
@Entity()
export class ClassroomDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Classroom)
  classroom: Classroom;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: DocumentType
  })
  type: DocumentType;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @Column()
  fileSize: number;

  @Column()
  mimeType: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User)
  uploadedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum DocumentType {
  ACT = 'act',
  MANUAL = 'manual',
  SAFETY = 'safety',
  INSPECTION = 'inspection',
  WARRANTY = 'warranty',
  OTHER = 'other'
}
```

#### 6.9.5 API Endpoints

##### 6.9.5.1 Управление аудиториями
```typescript
@Controller('api/v1/classrooms')
@UseGuards(JwtAuthGuard)
export class ClassroomsController {
  @Get()
  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  getClassrooms(
    @Query() query: ClassroomQueryDto,
    @Req() req
  ): Promise<{ items: ClassroomDto[]; meta: PaginationMeta }> {}

  @Post()
  @Roles('ADMIN')
  createClassroom(
    @Body() createClassroomDto: CreateClassroomDto,
    @Req() req
  ): Promise<ClassroomDto> {}

  @Get(':id')
  @Roles('ADMIN', 'TEACHER', 'STUDENT')
  getClassroom(
    @Param('id') id: string,
    @Req() req
  ): Promise<ClassroomDto> {}

  @Put(':id')
  @Roles('ADMIN')
  updateClassroom(
    @Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
    @Req() req
  ): Promise<ClassroomDto> {}

  @Delete(':id')
  @Roles('ADMIN')
  deleteClassroom(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Patch(':id/status')
  @Roles('ADMIN')
  updateStatus(
    @Param('id') id: string,
    @Body() statusDto: UpdateClassroomStatusDto,
    @Req() req
  ): Promise<ClassroomDto> {}

  @Get('export')
  @Roles('ADMIN', 'TEACHER')
  exportClassrooms(
    @Query() query: ExportClassroomsDto,
    @Req() req,
    @Res() res
  ): Promise<void> {}

  @Get('stats')
  @Roles('ADMIN')
  getClassroomStats(
    @Query() query: ClassroomStatsQueryDto,
    @Req() req
  ): Promise<ClassroomStatsDto> {}
}
```

##### 6.9.5.2 Управление оборудованием
```typescript
@Controller('api/v1/classrooms/:classroomId/equipment')
@UseGuards(JwtAuthGuard)
export class ClassroomEquipmentController {
  @Get()
  @Roles('ADMIN', 'TEACHER')
  getEquipment(
    @Param('classroomId') classroomId: string,
    @Req() req
  ): Promise<ClassroomEquipmentDto[]> {}

  @Post()
  @Roles('ADMIN')
  addEquipment(
    @Param('classroomId') classroomId: string,
    @Body() equipmentDto: AddEquipmentDto,
    @Req() req
  ): Promise<ClassroomEquipmentDto> {}

  @Put(':equipmentId')
  @Roles('ADMIN')
  updateEquipment(
    @Param('classroomId') classroomId: string,
    @Param('equipmentId') equipmentId: string,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
    @Req() req
  ): Promise<ClassroomEquipmentDto> {}

  @Delete(':equipmentId')
  @Roles('ADMIN')
  removeEquipment(
    @Param('classroomId') classroomId: string,
    @Param('equipmentId') equipmentId: string,
    @Req() req
  ): Promise<void> {}

  @Get('inventory-report')
  @Roles('ADMIN')
  getInventoryReport(
    @Param('classroomId') classroomId: string,
    @Req() req,
    @Res() res
  ): Promise<void> {}
}
```

##### 6.9.5.3 Управление ответственными лицами
```typescript
@Controller('api/v1/classrooms/:classroomId/responsible')
@UseGuards(JwtAuthGuard)
@Roles('ADMIN')
export class ClassroomResponsibleController {
  @Get()
  getResponsiblePersons(
    @Param('classroomId') classroomId: string,
    @Req() req
  ): Promise<ClassroomResponsibleDto[]> {}

  @Post()
  assignResponsible(
    @Param('classroomId') classroomId: string,
    @Body() assignDto: AssignResponsibleDto,
    @Req() req
  ): Promise<ClassroomResponsibleDto> {}

  @Put(':responsibleId')
  updateResponsible(
    @Param('classroomId') classroomId: string,
    @Param('responsibleId') responsibleId: string,
    @Body() updateDto: UpdateResponsibleDto,
    @Req() req
  ): Promise<ClassroomResponsibleDto> {}

  @Delete(':responsibleId')
  removeResponsible(
    @Param('classroomId') classroomId: string,
    @Param('responsibleId') responsibleId: string,
    @Req() req
  ): Promise<void> {}
}
```

##### 6.9.5.4 Управление техобслуживанием
```typescript
@Controller('api/v1/classrooms/:classroomId/maintenance')
@UseGuards(JwtAuthGuard)
export class ClassroomMaintenanceController {
  @Get()
  @Roles('ADMIN', 'TEACHER')
  getMaintenanceRecords(
    @Param('classroomId') classroomId: string,
    @Query() query: MaintenanceQueryDto,
    @Req() req
  ): Promise<{ items: ClassroomMaintenanceDto[]; meta: PaginationMeta }> {}

  @Post()
  @Roles('ADMIN')
  createMaintenanceRecord(
    @Param('classroomId') classroomId: string,
    @Body() maintenanceDto: CreateMaintenanceDto,
    @Req() req
  ): Promise<ClassroomMaintenanceDto> {}

  @Put(':maintenanceId')
  @Roles('ADMIN')
  updateMaintenanceRecord(
    @Param('classroomId') classroomId: string,
    @Param('maintenanceId') maintenanceId: string,
    @Body() updateDto: UpdateMaintenanceDto,
    @Req() req
  ): Promise<ClassroomMaintenanceDto> {}

  @Delete(':maintenanceId')
  @Roles('ADMIN')
  deleteMaintenanceRecord(
    @Param('classroomId') classroomId: string,
    @Param('maintenanceId') maintenanceId: string,
    @Req() req
  ): Promise<void> {}

  @Get('schedule')
  @Roles('ADMIN', 'TEACHER')
  getMaintenanceSchedule(
    @Query() query: MaintenanceScheduleQueryDto,
    @Req() req
  ): Promise<MaintenanceScheduleDto[]> {}
}
```

##### 6.9.5.5 Управление документами
```typescript
@Controller('api/v1/classrooms/:classroomId/documents')
@UseGuards(JwtAuthGuard)
export class ClassroomDocumentsController {
  @Get()
  @Roles('ADMIN', 'TEACHER')
  getDocuments(
    @Param('classroomId') classroomId: string,
    @Req() req
  ): Promise<ClassroomDocumentDto[]> {}

  @Post()
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @Param('classroomId') classroomId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() documentDto: UploadDocumentDto,
    @Req() req
  ): Promise<ClassroomDocumentDto> {}

  @Delete(':documentId')
  @Roles('ADMIN')
  deleteDocument(
    @Param('classroomId') classroomId: string,
    @Param('documentId') documentId: string,
    @Req() req
  ): Promise<void> {}

  @Get(':documentId/download')
  @Roles('ADMIN', 'TEACHER')
  downloadDocument(
    @Param('classroomId') classroomId: string,
    @Param('documentId') documentId: string,
    @Req() req,
    @Res() res
  ): Promise<void> {}
}
```

#### 6.9.6 Бизнес-логика

##### 6.9.6.1 Управление аудиториями
1. Регистрация аудиторий с указанием типа, вместимости и прочих характеристик
2. Отслеживание текущего статуса аудитории (свободна, занята, на ремонте)
3. Система автоматического обновления статуса аудитории на основе расписания
4. Поиск и фильтрация аудиторий по различным критериям
5. Учет загруженности и эффективности использования аудиторного фонда

##### 6.9.6.2 Управление оборудованием
1. Инвентаризация и учет оборудования в аудиториях
2. Отслеживание технического состояния оборудования
3. Учет гарантийных сроков и сроков службы оборудования
4. Планирование замены и модернизации оборудования
5. Контроль работоспособности и оперативное выявление неисправностей

##### 6.9.6.3 Работа с ответственными лицами
1. Назначение ответственных лиц за каждую аудиторию
2. Разграничение ответственности между различными ролями
3. Учет периодов ответственности (временная или постоянная)
4. Автоматическое уведомление ответственных при изменении статуса аудитории
5. Отслеживание истории ответственных лиц

##### 6.9.6.4 Планирование и учет техобслуживания
1. Планирование регулярного техобслуживания аудиторий и оборудования
2. Регистрация внеплановых ремонтных работ
3. Учет затрат на обслуживание и ремонт
4. Автоматическое оповещение о необходимости проведения профилактического обслуживания
5. Отслеживание истории обслуживания для прогнозирования будущих работ

#### 6.9.7 Интеграции
1. Интеграция с системой расписания для отображения занятости аудиторий
2. Связь с системой управления активами для учета оборудования
3. Интеграция с системой работы с персоналом для получения данных об ответственных лицах
4. Интеграция с системой уведомлений для оповещения о необходимости техобслуживания
5. Связь с финансовым модулем для учета затрат на ремонт и обслуживание

#### 6.9.8 Требования к производительности
1. Быстрая загрузка списка аудиторий с учетом всех применяемых фильтров
2. Оптимизированные запросы для получения детальной информации об аудитории
3. Эффективное хранение и обработка документов и изображений
4. Кэширование справочной информации для ускорения работы интерфейса
5. Поддержка одновременной работы большого числа пользователей

#### 6.9.9 Требования к безопасности
1. Разграничение доступа к функциональности модуля в соответствии с ролями
2. Логирование всех действий по изменению данных об аудиториях
3. Защита загружаемых и скачиваемых документов
4. Валидация всех входных данных для предотвращения инъекций
5. Контроль целостности данных при импорте и экспорте

#### 6.9.10 Дополнительные функции
1. Визуализация расположения аудиторий на интерактивной карте здания
2. Система QR-кодов для быстрого доступа к информации об аудитории
3. Формирование разнообразных отчетов по использованию аудиторного фонда
4. Модуль аналитики для оптимизации использования аудиторий
5. Система оповещения о событиях, связанных с аудиториями
6. Интерфейс для заявок на бронирование аудиторий

### 6.10 Модуль учебных планов (StudyPlansPage)

#### 6.10.1 Общее описание
Модуль учебных планов представляет собой систему управления календарно-тематическим планированием образовательного учреждения. Функционал включает создание, редактирование и просмотр учебных планов по различным предметам, составление поурочных планов, добавление учебных материалов и интерактивных элементов. Система обеспечивает организацию учебного процесса, контроль выполнения программы и доступ к учебным материалам.

#### 6.10.2 Основные возможности
1. Создание и управление учебными планами по предметам
2. Составление подробных поурочных планов с учебными материалами
3. Отслеживание выполнения учебного плана
4. Добавление учебных материалов (видео, презентации, документы)
5. Создание и управление тестовыми заданиями для уроков
6. Автоматический анализ качества учебных планов с помощью ИИ
7. Фильтрация и поиск планов по различным параметрам
8. Экспорт учебных планов в различные форматы

#### 6.10.3 Доступ по ролям

| Роль          | Права доступа                                                             |
|---------------|---------------------------------------------------------------------------|
| ADMIN         | Полный доступ, включая создание шаблонов планов, аналитика по всем планам |
| TEACHER       | Создание и редактирование своих учебных планов, доступ к шаблонам         |
| STUDENT       | Просмотр текущих учебных планов и материалов своих классов                |
| PARENT        | Просмотр учебных планов и материалов классов своих детей                  |

#### 6.10.4 Модели данных

##### 6.10.4.1 StudyPlan (Учебный план)
```typescript
@Entity()
export class StudyPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(() => Subject)
  subject: Subject;

  @Column()
  grade: number;

  @Column({ nullable: true })
  academicClass: string;

  @Column()
  academicYear: string;

  @Column({
    type: 'enum',
    enum: PlanStatus,
    default: PlanStatus.DRAFT
  })
  status: PlanStatus;

  @Column({ default: 0 })
  totalLessons: number;

  @Column({ default: 0 })
  completedLessons: number;

  @Column({
    type: 'enum',
    enum: CompletionStatus,
    default: CompletionStatus.NOT_STARTED
  })
  completionStatus: CompletionStatus;

  @ManyToOne(() => User)
  teacher: User;

  @OneToMany(() => StudyPlanLesson, lesson => lesson.studyPlan)
  lessons: StudyPlanLesson[];

  @Column({ default: false })
  isTemplate: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  updatedBy: User;
}

export enum PlanStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum CompletionStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue'
}
```

##### 6.10.4.2 StudyPlanLesson (Урок учебного плана)
```typescript
@Entity()
export class StudyPlanLesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StudyPlan, studyPlan => studyPlan.lessons)
  studyPlan: StudyPlan;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  scheduledDate: Date;

  @Column({ default: 45 })
  duration: number; // в минутах

  @Column({ default: 0 })
  order: number;

  @OneToMany(() => LessonMaterial, material => material.lesson)
  materials: LessonMaterial[];

  @OneToMany(() => LessonTest, test => test.lesson)
  tests: LessonTest[];

  @Column({
    type: 'enum',
    enum: LessonStatus,
    default: LessonStatus.PENDING
  })
  status: LessonStatus;

  @Column({ default: false })
  hasVideo: boolean;

  @Column({ default: false })
  hasPresentation: boolean;

  @Column({ default: false })
  hasTest: boolean;

  @ManyToOne(() => User, { nullable: true })
  responsible: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum LessonStatus {
  PENDING = 'pending',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

##### 6.10.4.3 LessonMaterial (Материал урока)
```typescript
@Entity()
export class LessonMaterial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StudyPlanLesson, lesson => lesson.materials)
  lesson: StudyPlanLesson;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: MaterialType
  })
  type: MaterialType;

  @Column()
  url: string;

  @Column({ nullable: true })
  filePath: string;

  @Column({ nullable: true })
  fileSize: number;

  @Column({ nullable: true })
  duration: number; // в секундах для видео

  @Column({ nullable: true })
  externalServiceId: string; // ID на внешних сервисах (YouTube, Vimeo и т.д.)

  @Column({ default: false })
  isPublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  uploadedBy: User;
}

export enum MaterialType {
  VIDEO = 'video',
  PRESENTATION = 'presentation',
  DOCUMENT = 'document',
  LINK = 'link',
  IMAGE = 'image',
  AUDIO = 'audio'
}
```

##### 6.10.4.4 LessonTest (Тест к уроку)
```typescript
@Entity()
export class LessonTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StudyPlanLesson, lesson => lesson.tests)
  lesson: StudyPlanLesson;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ default: 15 })
  duration: number; // в минутах

  @OneToMany(() => TestQuestion, question => question.test)
  questions: TestQuestion[];

  @Column({ default: 0 })
  totalPoints: number;

  @Column({ default: 60 })
  passingScore: number; // процент правильных ответов для успешного прохождения

  @Column({ default: false })
  isRandomOrder: boolean;

  @Column({ default: false })
  showCorrectAnswers: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  createdBy: User;
}
```

##### 6.10.4.5 TestQuestion (Вопрос теста)
```typescript
@Entity()
export class TestQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => LessonTest, test => test.questions)
  test: LessonTest;

  @Column('text')
  text: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.SINGLE
  })
  type: QuestionType;

  @Column('simple-json', { nullable: true })
  options: string[];

  @Column('simple-json')
  correctAnswers: string[];

  @Column({ default: 1 })
  points: number;

  @Column({ default: 0 })
  order: number;

  @Column({ nullable: true })
  explanation: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum QuestionType {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
  TEXT = 'text',
  MATCHING = 'matching',
  ORDERING = 'ordering'
}
```

##### 6.10.4.6 PlanAnalysis (Анализ учебного плана)
```typescript
@Entity()
export class PlanAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StudyPlan)
  studyPlan: StudyPlan;

  @Column('text', { nullable: true })
  strengths: string;

  @Column('text', { nullable: true })
  weaknesses: string;

  @Column('text', { nullable: true })
  recommendations: string;

  @Column('simple-json', { nullable: true })
  metrics: {
    contentCompleteness: number;
    materialsDiversity: number;
    alignmentWithStandards: number;
    overallQuality: number;
  };

  @Column('simple-json')
  issues: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    lessonId?: string;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  reviewedBy: User;
}
```

#### 6.10.5 API Endpoints

##### 6.10.5.1 Управление учебными планами
```typescript
@Controller('api/v1/study-plans')
@UseGuards(JwtAuthGuard)
export class StudyPlansController {
  @Get()
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getStudyPlans(
    @Query() query: StudyPlanQueryDto,
    @Req() req
  ): Promise<{ items: StudyPlanDto[]; meta: PaginationMeta }> {}

  @Post()
  @Roles('ADMIN', 'TEACHER')
  createStudyPlan(
    @Body() createStudyPlanDto: CreateStudyPlanDto,
    @Req() req
  ): Promise<StudyPlanDto> {}

  @Get(':id')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getStudyPlan(
    @Param('id') id: string,
    @Req() req
  ): Promise<StudyPlanDto> {}

  @Put(':id')
  @Roles('ADMIN', 'TEACHER')
  updateStudyPlan(
    @Param('id') id: string,
    @Body() updateStudyPlanDto: UpdateStudyPlanDto,
    @Req() req
  ): Promise<StudyPlanDto> {}

  @Delete(':id')
  @Roles('ADMIN', 'TEACHER')
  deleteStudyPlan(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Patch(':id/status')
  @Roles('ADMIN', 'TEACHER')
  updateStatus(
    @Param('id') id: string,
    @Body() statusDto: UpdatePlanStatusDto,
    @Req() req
  ): Promise<StudyPlanDto> {}

  @Post(':id/duplicate')
  @Roles('ADMIN', 'TEACHER')
  duplicatePlan(
    @Param('id') id: string,
    @Body() duplicateDto: DuplicatePlanDto,
    @Req() req
  ): Promise<StudyPlanDto> {}

  @Get(':id/export')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  exportPlan(
    @Param('id') id: string,
    @Query() query: ExportPlanDto,
    @Req() req,
    @Res() res
  ): Promise<void> {}

  @Post('import')
  @Roles('ADMIN', 'TEACHER')
  @UseInterceptors(FileInterceptor('file'))
  importPlan(
    @UploadedFile() file: Express.Multer.File,
    @Body() importDto: ImportPlanDto,
    @Req() req
  ): Promise<StudyPlanDto> {}

  @Get('templates')
  @Roles('ADMIN', 'TEACHER')
  getTemplates(
    @Query() query: TemplateQueryDto,
    @Req() req
  ): Promise<{ items: StudyPlanDto[]; meta: PaginationMeta }> {}
}
```

##### 6.10.5.2 Управление уроками
```typescript
@Controller('api/v1/study-plans/:planId/lessons')
@UseGuards(JwtAuthGuard)
export class StudyPlanLessonsController {
  @Get()
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getLessons(
    @Param('planId') planId: string,
    @Query() query: LessonQueryDto,
    @Req() req
  ): Promise<{ items: StudyPlanLessonDto[]; meta: PaginationMeta }> {}

  @Post()
  @Roles('ADMIN', 'TEACHER')
  createLesson(
    @Param('planId') planId: string,
    @Body() createLessonDto: CreateLessonDto,
    @Req() req
  ): Promise<StudyPlanLessonDto> {}

  @Get(':lessonId')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getLesson(
    @Param('planId') planId: string,
    @Param('lessonId') lessonId: string,
    @Req() req
  ): Promise<StudyPlanLessonDto> {}

  @Put(':lessonId')
  @Roles('ADMIN', 'TEACHER')
  updateLesson(
    @Param('planId') planId: string,
    @Param('lessonId') lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @Req() req
  ): Promise<StudyPlanLessonDto> {}

  @Delete(':lessonId')
  @Roles('ADMIN', 'TEACHER')
  deleteLesson(
    @Param('planId') planId: string,
    @Param('lessonId') lessonId: string,
    @Req() req
  ): Promise<void> {}

  @Patch(':lessonId/status')
  @Roles('ADMIN', 'TEACHER')
  updateLessonStatus(
    @Param('planId') planId: string,
    @Param('lessonId') lessonId: string,
    @Body() statusDto: UpdateLessonStatusDto,
    @Req() req
  ): Promise<StudyPlanLessonDto> {}

  @Patch('reorder')
  @Roles('ADMIN', 'TEACHER')
  reorderLessons(
    @Param('planId') planId: string,
    @Body() reorderDto: ReorderLessonsDto,
    @Req() req
  ): Promise<{ success: boolean }> {}
}
```

##### 6.10.5.3 Управление материалами
```typescript
@Controller('api/v1/study-plans/:planId/lessons/:lessonId/materials')
@UseGuards(JwtAuthGuard)
export class LessonMaterialsController {
  @Get()
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getMaterials(
    @Param('planId') planId: string,
    @Param('lessonId') lessonId: string,
    @Req() req
  ): Promise<LessonMaterialDto[]> {}

  @Post()
  @Roles('ADMIN', 'TEACHER')
  @UseInterceptors(FileInterceptor('file'))
  addMaterial(
    @Param('planId') planId: string,
    @Param('lessonId') lessonId: string,
    @Body() addMaterialDto: AddMaterialDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req
  ): Promise<LessonMaterialDto> {}

  @Delete(':materialId')
  @Roles('ADMIN', 'TEACHER')
  deleteMaterial(
    @Param('planId') planId: string,
    @Param('lessonId') lessonId: string,
    @Param('materialId') materialId: string,
    @Req() req
  ): Promise<void> {}

  @Get(':materialId/download')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  downloadMaterial(
    @Param('planId') planId: string,
    @Param('lessonId') lessonId: string,
    @Param('materialId') materialId: string,
    @Req() req,
    @Res() res
  ): Promise<void> {}
}
```

##### 6.10.5.4 Управление тестами
```typescript
@Controller('api/v1/study-plans/:planId/lessons/:lessonId/tests')
@UseGuards(JwtAuthGuard)
export class LessonTestsController {
  @Get()
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getTests(
    @Param('planId') planId: string,
    @Param('lessonId') lessonId: string,
    @Req() req
  ): Promise<LessonTestDto[]> {}

  @Post()
  @Roles('ADMIN', 'TEACHER')
  createTest(
    @Param('planId') planId: string,
    @Param('lessonId') lessonId: string,
    @Body() createTestDto: CreateTestDto,
    @Req() req
  ): Promise<LessonTestDto> {}

  @Get(':testId')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getTest(
    @Param('planId') planId: string,
    @Param('lessonId') lessonId: string,
    @Param('testId') testId: string,
    @Req() req
  ): Promise<LessonTestDto> {}

  @Put(':testId')
  @Roles('ADMIN', 'TEACHER')
  updateTest(
    @Param('planId') planId: string,
    @Param('lessonId') lessonId: string,
    @Param('testId') testId: string,
    @Body() updateTestDto: UpdateTestDto,
    @Req() req
  ): Promise<LessonTestDto> {}

  @Delete(':testId')
  @Roles('ADMIN', 'TEACHER')
  deleteTest(
    @Param('planId') planId: string,
    @Param('lessonId') lessonId: string,
    @Param('testId') testId: string,
    @Req() req
  ): Promise<void> {}

  @Post(':testId/questions')
  @Roles('ADMIN', 'TEACHER')
  addQuestion(
    @Param('planId') planId: string,
    @Param('lessonId') lessonId: string,
    @Param('testId') testId: string,
    @Body() questionDto: CreateQuestionDto,
    @Req() req
  ): Promise<TestQuestionDto> {}

  @Put(':testId/questions/:questionId')
  @Roles('ADMIN', 'TEACHER')
  updateQuestion(
    @Param('planId') planId: string,
    @Param('lessonId') lessonId: string,
    @Param('testId') testId: string,
    @Param('questionId') questionId: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Req() req
  ): Promise<TestQuestionDto> {}

  @Delete(':testId/questions/:questionId')
  @Roles('ADMIN', 'TEACHER')
  deleteQuestion(
    @Param('planId') planId: string,
    @Param('lessonId') lessonId: string,
    @Param('testId') testId: string,
    @Param('questionId') questionId: string,
    @Req() req
  ): Promise<void> {}
}
```

##### 6.10.5.5 Анализ учебных планов
```typescript
@Controller('api/v1/study-plans/:planId/analysis')
@UseGuards(JwtAuthGuard)
export class PlanAnalysisController {
  @Get()
  @Roles('ADMIN', 'TEACHER')
  getAnalysis(
    @Param('planId') planId: string,
    @Req() req
  ): Promise<PlanAnalysisDto> {}

  @Post('generate')
  @Roles('ADMIN', 'TEACHER')
  generateAnalysis(
    @Param('planId') planId: string,
    @Body() generateDto: GenerateAnalysisDto,
    @Req() req
  ): Promise<{ jobId: string }> {}

  @Get('job/:jobId')
  @Roles('ADMIN', 'TEACHER')
  getAnalysisJob(
    @Param('planId') planId: string,
    @Param('jobId') jobId: string,
    @Req() req
  ): Promise<{ status: string; result?: PlanAnalysisDto }> {}

  @Post('review')
  @Roles('ADMIN')
  reviewAnalysis(
    @Param('planId') planId: string,
    @Body() reviewDto: ReviewAnalysisDto,
    @Req() req
  ): Promise<PlanAnalysisDto> {}
}
```

#### 6.10.6 Бизнес-логика

##### 6.10.6.1 Управление учебными планами
1. Создание учебных планов на основе шаблонов или с нуля
2. Проверка соответствия планов образовательным стандартам
3. Отслеживание прогресса выполнения учебного плана
4. Управление статусами планов (черновик, опубликован, архивирован)
5. Дублирование планов для повторного использования в следующих годах
6. Экспорт планов в различные форматы (PDF, Excel, Word)

##### 6.10.6.2 Управление уроками и материалами
1. Создание и редактирование уроков с учебными материалами
2. Загрузка различных типов материалов (видео, презентации, документы)
3. Управление статусами уроков (план, готов к проведению, проведен)
4. Переупорядочивание уроков путем перетаскивания
5. Создание тестов с различными типами вопросов (одиночный выбор, множественный выбор, текст)
6. Привязка материалов и тестов к конкретным урокам

##### 6.10.6.3 ИИ-анализ учебных планов
1. Автоматический анализ качества и полноты учебного плана
2. Выявление недостающих элементов (материалы, тесты, описания)
3. Проверка соответствия образовательным стандартам
4. Формирование рекомендаций по улучшению учебного плана
5. Сравнительный анализ разных версий плана
6. Генерация отчетов о качестве планов для администрации

##### 6.10.6.4 Управление доступом
1. Разграничение прав доступа к учебным планам в зависимости от роли
2. Контроль доступа к материалам по классам и группам
3. Возможность настройки приватных и публичных учебных материалов
4. Отслеживание действий пользователей с учебными планами
5. Совместная работа учителей над общими планами

#### 6.10.7 Интеграции
1. Интеграция с системой хранения файлов для управления учебными материалами
2. Связь с системой тестирования для проведения тестов
3. Интеграция с расписанием для планирования уроков
4. Связь с системой журнала для отслеживания проведенных уроков
5. Интеграция с AI-сервисами для анализа и улучшения планов
6. Связь с системой уведомлений для информирования об изменениях в планах

#### 6.10.8 Требования к производительности
1. Быстрая загрузка списка учебных планов с пагинацией и фильтрацией
2. Эффективное отображение учебных материалов различных типов
3. Оптимизированная работа с большими файлами (видео, презентации)
4. Кэширование часто используемых планов и материалов
5. Асинхронная обработка тяжелых операций (анализ планов, импорт/экспорт)

#### 6.10.9 Требования к безопасности
1. Защита учебных материалов от несанкционированного доступа
2. Проверка прав доступа для всех операций с планами и материалами
3. Валидация загружаемых файлов на безопасность
4. Аудит действий пользователей с учебными планами
5. Резервное копирование важных учебных материалов

#### 6.10.10 Дополнительные функции
1. Система версионности учебных планов
2. Интеллектуальные подсказки при составлении планов
3. Автоматическое создание тестов на основе материалов урока
4. Интеграция с образовательными стандартами
5. Аналитика эффективности учебных планов на основе результатов учеников
6. Система шаблонов для типовых уроков и материалов

### 6.11 Модуль детального просмотра учебного плана (StudyPlanDetailPage)

#### 6.11.1 Общее описание
Модуль детального просмотра учебного плана предоставляет интерфейс для детального просмотра и редактирования конкретного учебного плана, включая управление входящими в него уроками, материалами и тестами. Позволяет учителям создавать новые уроки, добавлять к ним учебные материалы и тесты, а также управлять их последовательностью и расписанием.

#### 6.11.2 Основные возможности
1. Просмотр детальной информации об учебном плане
2. Создание и редактирование уроков в рамках плана
3. Загрузка различных типов материалов (видео, презентации, документы)
4. Создание и управление тестами для уроков
5. Управление расписанием уроков
6. Отслеживание статуса каждого урока
7. Интерактивное взаимодействие с учебными материалами
8. Создание тестов с различными типами вопросов

#### 6.11.3 Доступ по ролям

| Роль          | Права доступа                                                         |
|---------------|-----------------------------------------------------------------------|
| ADMIN         | Полный доступ ко всем учебным планам и их урокам                      |
| TEACHER       | Просмотр и редактирование своих учебных планов, просмотр шаблонов     |
| STUDENT       | Просмотр учебных планов и уроков, доступных для их класса             |
| PARENT        | Просмотр учебных планов и уроков, доступных для классов своих детей   |

#### 6.11.4 API Endpoints

##### 6.11.4.1 Получение детальной информации об учебном плане
```typescript
@Get('/api/v1/study-plans/:planId')
@Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
async getStudyPlanDetails(
  @Param('planId') planId: string,
  @Req() req
): Promise<{
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: number;
  academicYear: string;
  status: PlanStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    name: string;
  };
  lessons: {
    id: string;
    title: string;
    description: string;
    scheduledDate: Date;
    duration: number;
    status: LessonStatus;
    order: number;
    hasVideo: boolean;
    hasPresentation: boolean;
    hasTest: boolean;
  }[];
}> {}
```

##### 6.11.4.2 Обновление учебного плана
```typescript
@Put('/api/v1/study-plans/:planId')
@Roles('ADMIN', 'TEACHER')
async updateStudyPlan(
  @Param('planId') planId: string,
  @Body() updatePlanDto: {
    title: string;
    description: string;
    subject: string;
    grade: number;
    academicYear: string;
    status: PlanStatus;
  },
  @Req() req
): Promise<StudyPlanDto> {}
```

##### 6.11.4.3 Создание урока
```typescript
@Post('/api/v1/study-plans/:planId/lessons')
@Roles('ADMIN', 'TEACHER')
async createLesson(
  @Param('planId') planId: string,
  @Body() createLessonDto: {
    title: string;
    description: string;
    scheduledDate?: Date;
    duration: number;
    hasVideo: boolean;
    hasPresentation: boolean;
    hasTest: boolean;
  },
  @Req() req
): Promise<StudyPlanLessonDto> {}
```

##### 6.11.4.4 Обновление урока
```typescript
@Put('/api/v1/study-plans/:planId/lessons/:lessonId')
@Roles('ADMIN', 'TEACHER')
async updateLesson(
  @Param('planId') planId: string,
  @Param('lessonId') lessonId: string,
  @Body() updateLessonDto: {
    title: string;
    description: string;
    scheduledDate?: Date;
    duration: number;
    hasVideo: boolean;
    hasPresentation: boolean;
    hasTest: boolean;
  },
  @Req() req
): Promise<StudyPlanLessonDto> {}
```

##### 6.11.4.5 Добавление теста к уроку
```typescript
@Post('/api/v1/study-plans/:planId/lessons/:lessonId/tests')
@Roles('ADMIN', 'TEACHER')
async addTest(
  @Param('planId') planId: string,
  @Param('lessonId') lessonId: string,
  @Body() testDto: {
    title: string;
    description?: string;
    duration: number;
    questions: {
      text: string;
      type: QuestionType;
      options?: string[];
      correctAnswers: string[];
      points: number;
    }[];
    passingScore?: number;
    isRandomOrder?: boolean;
    showCorrectAnswers?: boolean;
  },
  @Req() req
): Promise<LessonTestDto> {}
```

#### 6.11.5 Бизнес-логика

##### 6.11.5.1 Управление уроками
1. Создание новых уроков в рамках учебного плана с основной информацией (название, описание, дата)
2. Возможность планирования уроков путём установки даты и времени проведения
3. Привязка уроков к конкретным темам учебного плана
4. Отслеживание статуса урока (готовится, готов, проведен, отменен)
5. Редактирование существующих уроков с обновлением их статуса
6. Переупорядочивание уроков для изменения их последовательности
7. Уведомление всех заинтересованных сторон об изменениях в уроках

##### 6.11.5.2 Управление учебными материалами
1. Загрузка различных типов материалов (видео, презентации, документы)
2. Поддержка как локальных файлов, так и ссылок на внешние ресурсы
3. Проверка загружаемых файлов на соответствие безопасности и допустимым форматам
4. Автоматическое определение метаданных материалов (длительность для видео, количество слайдов для презентаций)
5. Организация материалов по темам и урокам для удобного доступа
6. Обеспечение разграничения доступа к материалам в зависимости от роли пользователя

##### 6.11.5.3 Управление тестами
1. Создание тестов с различными типами вопросов (одиночный выбор, множественный выбор, текстовый ответ)
2. Настройка параметров тестирования (длительность, проходной балл, случайный порядок вопросов)
3. Возможность добавления объяснений к правильным ответам
4. Автоматическая оценка результатов тестирования
5. Анализ эффективности тестовых вопросов на основе статистики ответов
6. Генерация отчетов по результатам тестирования для учителей и администрации

#### 6.11.6 Интеграции
1. Интеграция с системой хранения файлов для управления учебными материалами
2. Интеграция с системой расписания для планирования уроков
3. Связь с системой тестирования для проведения и оценки тестов
4. Интеграция с системой уведомлений для информирования об изменениях
5. Связь с системой электронного журнала для отражения проведенных уроков

#### 6.11.7 Требования к производительности
1. Быстрая загрузка детальной информации об учебном плане, включая список уроков
2. Эффективное отображение различных типов учебных материалов
3. Оптимизированная работа с видеоматериалами, включая потоковое воспроизведение
4. Быстрое создание и редактирование уроков и тестов с минимальной задержкой
5. Поддержка одновременной работы нескольких пользователей с учебным планом

#### 6.11.8 Требования к безопасности
1. Проверка прав доступа для всех операций с учебным планом и его уроками
2. Валидация загружаемых файлов на безопасность
3. Защита учебных материалов от несанкционированного доступа
4. Ограничение размера загружаемых файлов
5. Защита от XSS в описаниях и заданиях
6. Аудит действий пользователей с учебными планами и уроками

#### 6.11.9 Дополнительные функции
1. Автосохранение изменений при редактировании
2. Система версионности для отслеживания изменений в учебном плане
3. Возможность экспорта урока в PDF для печати
4. Поддержка drag-and-drop для переупорядочивания уроков
5. Интерактивный предпросмотр загружаемых материалов
6. Система комментариев для обсуждения учебного плана
7. Интеграция с AI-ассистентом для помощи в составлении планов уроков

### 6.12 Модуль управления студентами (StudentsPage)

#### 6.12.1 Общее описание
Модуль управления студентами предоставляет интерфейс для просмотра, поиска и управления профилями студентов образовательного учреждения. Позволяет администраторам и преподавателям быстро находить студентов, просматривать их личную информацию, контактные данные родителей, а также данные об успеваемости, посещаемости и финансовых обязательствах. Обеспечивает централизованный доступ к полной информации о каждом студенте с различной степенью детализации в зависимости от роли пользователя.

#### 6.12.2 Основные возможности
1. Просмотр списка всех студентов образовательного учреждения
2. Фильтрация студентов по группам/классам
3. Поиск студентов по имени и другим параметрам
4. Просмотр детальной информации о студенте
5. Доступ к контактной информации студента и его родителей
6. Быстрый просмотр ключевых показателей успеваемости
7. Отслеживание статуса оплаты обучения
8. Мониторинг эмоционального состояния и психологического комфорта студентов

#### 6.12.3 Доступ по ролям

| Роль          | Права доступа                                                                |
|---------------|------------------------------------------------------------------------------|
| ADMIN         | Полный доступ ко всей информации о студентах, включая финансовые данные      |
| TEACHER       | Доступ к информации студентов своих групп, без доступа к финансовым данным   |
| STUDENT       | Доступ только к собственному профилю с ограниченным набором данных           |
| PARENT        | Доступ к профилям своих детей и контактам учителей                           |

#### 6.12.4 Модели данных

##### 6.12.4.1 Student (Студент)
```typescript
@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column()
  gender: 'male' | 'female';

  @ManyToOne(() => Group)
  group: Group;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @OneToMany(() => Parent, parent => parent.student)
  parents: Parent[];

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'date', nullable: true })
  enrollmentDate: Date;

  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.ACTIVE
  })
  status: StudentStatus;

  @Column({ nullable: true })
  personalId: string; // Номер удостоверения личности или свидетельства о рождении

  @OneToMany(() => StudentPerformance, performance => performance.student)
  performances: StudentPerformance[];

  @OneToMany(() => Attendance, attendance => attendance.student)
  attendances: Attendance[];

  @OneToMany(() => Payment, payment => payment.student)
  payments: Payment[];

  @OneToMany(() => EmotionalState, state => state.student)
  emotionalStates: EmotionalState[];

  @Column({ type: 'jsonb', nullable: true })
  additionalInfo: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  updatedBy: User;
}

export enum StudentStatus {
  ACTIVE = 'active',
  TRANSFERRED = 'transferred',
  GRADUATED = 'graduated',
  EXPELLED = 'expelled',
  ACADEMIC_LEAVE = 'academic_leave',
  PENDING = 'pending'
}
```

##### 6.12.4.2 Parent (Родитель)
```typescript
@Entity()
export class Parent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column()
  relationship: 'mother' | 'father' | 'guardian' | 'other';

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  workPlace: string;

  @Column({ nullable: true })
  position: string;

  @ManyToOne(() => Student, student => student.parents)
  student: Student;

  @Column({ nullable: true })
  additionalPhone: string;

  @Column({
    type: 'enum',
    enum: ParentStatus,
    default: ParentStatus.ACTIVE
  })
  status: ParentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum ParentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}
```

##### 6.12.4.3 StudentPerformance (Успеваемость студента)
```typescript
@Entity()
export class StudentPerformance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, student => student.performances)
  student: Student;

  @ManyToOne(() => Subject)
  subject: Subject;

  @Column({ type: 'float' })
  averageGrade: number;

  @Column()
  period: 'quarter_1' | 'quarter_2' | 'quarter_3' | 'quarter_4' | 'semester_1' | 'semester_2' | 'year';

  @Column()
  academicYear: string; // Например: "2023-2024"

  @Column({ nullable: true })
  comments: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

##### 6.12.4.4 Attendance (Посещаемость)
```typescript
@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, student => student.attendances)
  student: Student;

  @Column({ type: 'date' })
  date: Date;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT
  })
  status: AttendanceStatus;

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => Lesson, { nullable: true })
  lesson: Lesson;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  markedBy: User;
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused'
}
```

##### 6.12.4.5 Payment (Платеж)
```typescript
@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, student => student.payments)
  student: Student;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  paidDate: Date;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  status: PaymentStatus;

  @Column()
  period: string;

  @Column({ nullable: true })
  comment: string;

  @Column({ nullable: true })
  receiptNumber: string;

  @Column({ nullable: true })
  paymentMethod: PaymentMethod;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  processedBy: User;
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  PARTIALLY_PAID = 'partially_paid',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CARD = 'card',
  ONLINE = 'online',
  OTHER = 'other'
}
```

##### 6.12.4.6 EmotionalState (Эмоциональное состояние)
```typescript
@Entity()
export class EmotionalState {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, student => student.emotionalStates)
  student: Student;

  @Column({ type: 'date' })
  date: Date;

  @Column({
    type: 'enum',
    enum: EmotionalStateType
  })
  state: EmotionalStateType;

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => User)
  observedBy: User;

  @CreateDateColumn()
  createdAt: Date;
}

export enum EmotionalStateType {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  NEUTRAL = 'neutral',
  ANXIOUS = 'anxious',
  UPSET = 'upset',
  DEPRESSED = 'depressed',
  ANGRY = 'angry',
  OTHER = 'other'
}
```

#### 6.12.5 API Endpoints

##### 6.12.5.1 Управление студентами
```typescript
@Controller('api/v1/students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  @Get()
  @Roles('ADMIN', 'TEACHER')
  getStudents(
    @Query() query: StudentQueryDto,
    @Req() req
  ): Promise<{ items: StudentDto[]; meta: PaginationMeta }> {}

  @Post()
  @Roles('ADMIN')
  createStudent(
    @Body() createStudentDto: CreateStudentDto,
    @Req() req
  ): Promise<StudentDto> {}

  @Get(':id')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getStudent(
    @Param('id') id: string,
    @Req() req
  ): Promise<StudentDto> {}

  @Put(':id')
  @Roles('ADMIN')
  updateStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
    @Req() req
  ): Promise<StudentDto> {}

  @Patch(':id/status')
  @Roles('ADMIN')
  updateStatus(
    @Param('id') id: string,
    @Body() statusDto: UpdateStudentStatusDto,
    @Req() req
  ): Promise<StudentDto> {}

  @Delete(':id')
  @Roles('ADMIN')
  deleteStudent(
    @Param('id') id: string,
    @Req() req
  ): Promise<void> {}

  @Post('import')
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  importStudents(
    @UploadedFile() file: Express.Multer.File,
    @Body() importDto: ImportStudentsDto,
    @Req() req
  ): Promise<{ imported: number; errors: any[] }> {}

  @Get('export')
  @Roles('ADMIN')
  exportStudents(
    @Query() query: ExportStudentsDto,
    @Req() req,
    @Res() res
  ): Promise<void> {}

  @Get(':id/performance')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getStudentPerformance(
    @Param('id') id: string,
    @Query() query: PerformanceQueryDto,
    @Req() req
  ): Promise<StudentPerformanceDto[]> {}

  @Get(':id/attendance')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getStudentAttendance(
    @Param('id') id: string,
    @Query() query: AttendanceQueryDto,
    @Req() req
  ): Promise<AttendanceDto[]> {}

  @Get(':id/emotional-state')
  @Roles('ADMIN', 'TEACHER', 'PARENT')
  getStudentEmotionalState(
    @Param('id') id: string,
    @Query() query: EmotionalStateQueryDto,
    @Req() req
  ): Promise<EmotionalStateDto[]> {}

  @Post(':id/emotional-state')
  @Roles('ADMIN', 'TEACHER')
  addEmotionalState(
    @Param('id') id: string,
    @Body() emotionalStateDto: CreateEmotionalStateDto,
    @Req() req
  ): Promise<EmotionalStateDto> {}
}
```

##### 6.12.5.2 Управление родителями
```typescript
@Controller('api/v1/students/:studentId/parents')
@UseGuards(JwtAuthGuard)
export class ParentsController {
  @Get()
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getParents(
    @Param('studentId') studentId: string,
    @Req() req
  ): Promise<ParentDto[]> {}

  @Post()
  @Roles('ADMIN')
  addParent(
    @Param('studentId') studentId: string,
    @Body() createParentDto: CreateParentDto,
    @Req() req
  ): Promise<ParentDto> {}

  @Get(':parentId')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  getParent(
    @Param('studentId') studentId: string,
    @Param('parentId') parentId: string,
    @Req() req
  ): Promise<ParentDto> {}

  @Put(':parentId')
  @Roles('ADMIN')
  updateParent(
    @Param('studentId') studentId: string,
    @Param('parentId') parentId: string,
    @Body() updateParentDto: UpdateParentDto,
    @Req() req
  ): Promise<ParentDto> {}

  @Delete(':parentId')
  @Roles('ADMIN')
  deleteParent(
    @Param('studentId') studentId: string,
    @Param('parentId') parentId: string,
    @Req() req
  ): Promise<void> {}
}
```

##### 6.12.5.3 Управление платежами студентов
```typescript
@Controller('api/v1/students/:studentId/payments')
@UseGuards(JwtAuthGuard)
export class StudentPaymentsController {
  @Get()
  @Roles('ADMIN', 'PARENT')
  getPayments(
    @Param('studentId') studentId: string,
    @Query() query: PaymentQueryDto,
    @Req() req
  ): Promise<PaymentDto[]> {}

  @Post()
  @Roles('ADMIN')
  addPayment(
    @Param('studentId') studentId: string,
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() req
  ): Promise<PaymentDto> {}

  @Get(':paymentId')
  @Roles('ADMIN', 'PARENT')
  getPayment(
    @Param('studentId') studentId: string,
    @Param('paymentId') paymentId: string,
    @Req() req
  ): Promise<PaymentDto> {}

  @Patch(':paymentId/status')
  @Roles('ADMIN')
  updatePaymentStatus(
    @Param('studentId') studentId: string,
    @Param('paymentId') paymentId: string,
    @Body() statusDto: UpdatePaymentStatusDto,
    @Req() req
  ): Promise<PaymentDto> {}

  @Get(':paymentId/receipt')
  @Roles('ADMIN', 'PARENT')
  getReceipt(
    @Param('studentId') studentId: string,
    @Param('paymentId') paymentId: string,
    @Req() req,
    @Res() res
  ): Promise<void> {}
}
```

#### 6.12.6 Бизнес-логика

##### 6.12.6.1 Управление данными студентов
1. Регистрация новых студентов с проверкой уникальности личных данных
2. Распределение студентов по группам/классам с учетом возраста и уровня подготовки
3. Обновление статуса студентов (активный, переведен, выпущен, отчислен)
4. Отслеживание перемещений студентов между группами
5. Ведение полной истории обучения студента в образовательном учреждении
6. Управление документами студента (личные документы, медицинские справки)
7. Синхронизация данных с государственными информационными системами

##### 6.12.6.2 Анализ успеваемости и посещаемости
1. Расчет средних показателей успеваемости по различным периодам
2. Отслеживание динамики успеваемости студента
3. Анализ посещаемости и выявление паттернов отсутствия
4. Формирование отчетов об успеваемости и посещаемости
5. Уведомление родителей и администрации о проблемах с успеваемостью и посещаемостью
6. Сравнительный анализ успеваемости студента относительно группы/класса

##### 6.12.6.3 Управление финансовыми вопросами
1. Расчет и начисление платы за обучение
2. Отслеживание статуса платежей и задолженностей
3. Формирование квитанций и счетов на оплату
4. Учет различных типов платежей и методов оплаты
5. Автоматическое напоминание о предстоящих и просроченных платежах
6. Формирование финансовых отчетов по оплате обучения

##### 6.12.6.4 Мониторинг эмоционального состояния
1. Регулярная фиксация эмоционального состояния студентов
2. Выявление изменений в эмоциональном состоянии
3. Анализ факторов, влияющих на эмоциональное состояние
4. Уведомление психолога и родителей о негативной динамике
5. Формирование рекомендаций по улучшению психологического комфорта
6. Интеграция с системой психологической поддержки

#### 6.12.7 Интеграции
1. Интеграция с системой электронного журнала для получения данных об успеваемости
2. Связь с системой контроля посещаемости
3. Интеграция с финансовым модулем для управления платежами
4. Связь с модулем расписания для отслеживания пропусков занятий
5. Интеграция с системой уведомлений для информирования родителей
6. Связь с системой психологической поддержки для мониторинга эмоционального состояния

#### 6.12.8 Требования к производительности
1. Быстрая загрузка списка студентов с пагинацией и фильтрацией
2. Эффективное отображение детальной информации о студенте
3. Оптимизированная работа с большими объемами данных (история успеваемости, посещаемости)
4. Кэширование часто запрашиваемых данных о студентах
5. Асинхронная обработка тяжелых операций (импорт/экспорт, формирование отчетов)

#### 6.12.9 Требования к безопасности
1. Строгое разграничение доступа к личным данным студентов
2. Шифрование чувствительной информации
3. Аудит всех операций с данными студентов
4. Соблюдение законодательства о защите персональных данных
5. Механизмы предотвращения несанкционированного доступа к финансовой информации
6. Регулярное резервное копирование данных студентов

#### 6.12.10 Дополнительные функции
1. Массовое редактирование данных группы студентов
2. Система оповещения родителей о важных событиях
3. Формирование персонализированных отчетов для родителей
4. Отслеживание прогресса студента по индивидуальным образовательным траекториям
5. Интеграция с системой выявления талантов и способностей
6. Экспорт данных в различные форматы для внешних систем

### 6.13 Модуль детальной информации о студенте (StudentDetailPage)

#### 6.13.1 Общее описание
Модуль детальной информации о студенте предоставляет комплексный интерфейс для просмотра всей информации о конкретном студенте. Выступает как единый центр доступа к персональным данным, академической успеваемости, посещаемости, финансовой информации, психоэмоциональному состоянию, расписанию занятий, результатам экзаменов и внеучебной деятельности. Обеспечивает всесторонний анализ успехов и прогресса студента с помощью интерактивных графиков и визуализаций данных, а также возможность экспорта информации в различные форматы.

#### 6.13.2 Основные возможности
1. Просмотр полной персональной информации о студенте
2. Мониторинг психоэмоционального состояния с отслеживанием тенденций
3. Доступ к контактной информации студента и его родителей
4. Анализ динамики успеваемости по предметам с визуализацией
5. Отслеживание посещаемости с детализацией по причинам отсутствия
6. Управление персональным планом развития студента
7. Мониторинг и управление финансовыми операциями
8. Доступ к индивидуальному расписанию занятий
9. Анализ результатов экзаменов с детализацией по темам
10. Отслеживание внеучебной деятельности и достижений
11. Экспорт отчетов в PDF и другие форматы
12. Прямая коммуникация с родителями и куратором студента

#### 6.13.3 Доступ по ролям

| Роль          | Права доступа                                                                |
|---------------|------------------------------------------------------------------------------|
| ADMIN         | Полный доступ ко всей информации с возможностью редактирования               |
| TEACHER       | Доступ к академической информации и психоэмоциональному состоянию            |
| STUDENT       | Ограниченный доступ к собственным данным без финансовой информации           |
| PARENT        | Доступ к данным своего ребенка, включая финансовую информацию                |

#### 6.13.4 API Endpoints

##### 6.13.4.1 Получение общей информации о студенте
```typescript
@Get('/api/v1/students/:id')
@Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
async getStudentDetails(
  @Param('id') id: string,
  @Req() req
): Promise<{
  id: string;
  fullName: string;
  class: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  parentName: string;
  parentPhone: string;
  photo: string;
  enrollmentDate: string;
  nationality: string;
  iin: string;
  bloodGroup: string;
  medicalInfo: string;
  previousSchool: string;
  achievements: string[];
  documents: {
    type: string;
    date: string;
    link: string;
  }[];
  academicRecords: {
    subject: string;
    grade: number;
    semester: number;
    year: string;
  }[];
}> {}
```

##### 6.13.4.2 Получение информации о психоэмоциональном состоянии
```typescript
@Get('/api/v1/students/:id/emotional-state')
@Roles('ADMIN', 'TEACHER', 'PARENT')
async getEmotionalState(
  @Param('id') id: string,
  @Query() query: { period?: string },
  @Req() req
): Promise<{
  category: string;
  score: number;
  description: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
}[]> {}
```

##### 6.13.4.3 Получение информации о контактах
```typescript
@Get('/api/v1/students/:id/contacts')
@Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
async getContacts(
  @Param('id') id: string,
  @Req() req
): Promise<{
  relation: string;
  name: string;
  phone: string;
  email: string;
  occupation: string;
  workPlace: string;
  address: string;
  id: string;
}[]> {}
```

##### 6.13.4.4 Получение информации об успеваемости
```typescript
@Get('/api/v1/students/:id/performance')
@Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
async getPerformance(
  @Param('id') id: string,
  @Query() query: { period?: string, subject?: string },
  @Req() req
): Promise<{
  subject: string;
  currentGrade: number;
  previousGrade: number;
  averageGrade: number;
  trend: 'up' | 'down' | 'stable';
  teacherName: string;
  lastUpdate: string;
  assignments: {
    type: string;
    grade: number;
    date: string;
    topic: string;
  }[];
}[]> {}
```

##### 6.13.4.5 Получение информации о посещаемости
```typescript
@Get('/api/v1/students/:id/attendance')
@Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
async getAttendance(
  @Param('id') id: string,
  @Query() query: { period?: string, type?: string },
  @Req() req
): Promise<{
  date: string;
  type: 'presence' | 'absence' | 'late' | 'medical' | 'excused';
  subject?: string;
  time?: string;
  reason?: string;
  status?: string;
  approvedBy?: string;
  duration?: string;
  comment?: string;
}[]> {}
```

##### 6.13.4.6 Получение статистики посещаемости
```typescript
@Get('/api/v1/students/:id/attendance/stats')
@Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
async getAttendanceStats(
  @Param('id') id: string,
  @Query() query: { period?: string },
  @Req() req
): Promise<{
  total: {
    present: number;
    absent: number;
    late: number;
    medical: number;
  };
  byMonth: {
    month: string;
    присутствие: number;
    отсутствие: number;
    опоздания: number;
  }[];
  bySubject: {
    subject: string;
    present: number;
    absent: number;
    late: number;
    medical: number;
  }[];
  byClass: {
    class: string;
    present: number;
    absent: number;
    late: number;
    medical: number;
  }[];
}> {}
```

##### 6.13.4.7 Получение информации о персональном плане развития
```typescript
@Get('/api/v1/students/:id/development-plan')
@Roles('ADMIN', 'TEACHER', 'PARENT')
async getDevelopmentPlan(
  @Param('id') id: string,
  @Req() req
): Promise<{
  id: string;
  studentId: string;
  subject: string;          
  grade: number;
  teacherName: string;
  lastUpdate: string;
  assignments: {
    type: string;
    grade: number;
    date: string;
    topic: string;
  }[];
}> {}
```

##### 6.13.4.8 Получение информации о финансовых операциях
```typescript   
@Get('/api/v1/students/:id/financial-operations')
@Roles('ADMIN', 'TEACHER', 'PARENT')
async getFinancialOperations(
  @Param('id') id: string,
  @Req() req
): Promise<{             
  id: string;
  studentId: string;
  amount: number;
  type: string;
  date: string;
  status: string;
  description: string;
  category: string;
  paymentMethod: string;
  receipt: string;
  receiptUrl: string;
  receiptDate: string;
  receiptAmount: number;    
}[]> {}
```

##### 6.13.4.9 Получение информации о расписании занятий
```typescript   
@Get('/api/v1/students/:id/schedule')
@Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
async getSchedule(
  @Param('id') id: string,
  @Req() req
): Promise<{                    
  id: string;
  studentId: string;
  subject: string;
  date: string;
  time: string;
  location: string;
  teacher: string;                    
}[]> {}
```

##### 6.13.4.10 Получение информации о результатах экзаменов
```typescript
@Get('/api/v1/students/:id/exams')
@Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
async getExams(
  @Param('id') id: string,
  @Req() req
): Promise<{    
  id: string;
  studentId: string;                
  subject: string;
  date: string;
  time: string;
  location: string;
  teacher: string;
}[]> {}
```

##### 6.13.4.11 Получение информации о внеучебной деятельности
```typescript       
@Get('/api/v1/students/:id/extra-activities')
@Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
async getExtraActivities(
  @Param('id') id: string,
  @Req() req
): Promise<{                        
  id: string;
  studentId: string;
  activity: string;
  date: string;
  time: string;
  location: string;
  teacher: string;
}[]> {}
```
// ... existing code ...

### 6.14 Модуль анализа успеваемости (PerformancePage)

#### 6.14.1 Общее описание
Модуль анализа успеваемости предоставляет комплексные инструменты для мониторинга и анализа академических показателей учащихся как индивидуально, так и по учебным группам. Система обеспечивает сбор, анализ и визуализацию данных об успеваемости, посещаемости, выполнении заданий и других ключевых показателях образовательного процесса. Модуль предоставляет интерактивные графики, диаграммы и таблицы для наглядного отображения динамики учебных результатов, что позволяет администраторам и преподавателям своевременно выявлять проблемные области и принимать обоснованные педагогические решения.

#### 6.14.2 Основные возможности
1. Аналитические дашборды с ключевыми показателями успеваемости
2. Фильтрация и группировка данных по учебным группам
3. Отслеживание динамики успеваемости по периодам обучения
4. Распределение оценок по предметам и группам
5. Анализ успеваемости по отдельным предметам
6. Мониторинг общих показателей (оценки, посещаемость, активность, выполнение заданий)
7. Выявление студентов с низкой успеваемостью и высоким прогрессом
8. Интерактивные графики и визуализации данных
9. Выгрузка аналитических отчетов в различных форматах

#### 6.14.3 Доступ по ролям

1. **ADMIN** (Администратор):
   - Полный доступ ко всем функциям модуля
   - Настройка параметров аналитических отчетов
   - Просмотр данных по всем группам и студентам
   - Экспорт любых аналитических данных
   - Настройка критериев для выявления проблемных зон

2. **TEACHER** (Преподаватель):
   - Доступ к аналитике по своим предметам и группам
   - Просмотр индивидуальной успеваемости студентов в своих группах
   - Отслеживание динамики успеваемости по преподаваемым предметам
   - Формирование отчетов по своим группам

3. **STUDENT** (Ученик):
   - Доступ только к собственным показателям успеваемости
   - Отслеживание личного прогресса по предметам
   - Просмотр среднего балла и его динамики
   - Сравнение личных результатов со средними по группе (без доступа к данным других студентов)

4. **PARENT** (Родитель):
   - Доступ к показателям успеваемости своих детей
   - Отслеживание динамики успеваемости ребенка
   - Просмотр сравнения результатов ребенка со средними показателями группы

#### 6.14.4 Модели данных

1. **PerformanceMetrics** - основные метрики успеваемости
```typescript
@Entity('performance_metrics')
export class PerformanceMetrics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Class)
  class: Class;

  @ManyToOne(() => Subject)
  subject: Subject;

  @Column({ type: 'float', nullable: true })
  averageGrade: number;

  @Column({ type: 'float', nullable: true })
  attendance: number;

  @Column({ type: 'float', nullable: true })
  assignmentsCompletion: number;

  @Column({ type: 'float', nullable: true })
  participation: number;

  @Column({ type: 'float', nullable: true })
  testsResults: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;

  @Column({ type: 'timestamp' })
  periodStart: Date;

  @Column({ type: 'timestamp' })
  periodEnd: Date;
}
```

2. **PerformanceTrend** - тренды успеваемости
```typescript
@Entity('performance_trends')
export class PerformanceTrend {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, { nullable: true })
  student: Student;

  @ManyToOne(() => Class, { nullable: true })
  class: Class;

  @ManyToOne(() => Subject, { nullable: true })
  subject: Subject;

  @Column({ type: 'timestamp' })
  period: Date;

  @Column({ type: 'float' })
  value: number;

  @Column({ type: 'float', nullable: true })
  change: number;

  @Column({ type: 'enum', enum: ['grade', 'attendance', 'assignments', 'participation', 'tests'] })
  metricType: string;
}
```

3. **GradeDistribution** - распределение оценок
```typescript
@Entity('grade_distributions')
export class GradeDistribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Class)
  class: Class;

  @ManyToOne(() => Subject, { nullable: true })
  subject: Subject;

  @Column({ type: 'timestamp' })
  period: Date;

  @Column({ type: 'integer' })
  grade5Count: number;

  @Column({ type: 'integer' })
  grade4Count: number;

  @Column({ type: 'integer' })
  grade3Count: number;

  @Column({ type: 'integer' })
  grade2Count: number;

  @Column({ type: 'integer' })
  totalStudents: number;
}
```

4. **StudentPerformanceAlert** - уведомления об успеваемости
```typescript
@Entity('student_performance_alerts')
export class StudentPerformanceAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Subject, { nullable: true })
  subject: Subject;

  @Column({ type: 'enum', enum: ['low_performance', 'high_progress', 'attendance_issue', 'missing_assignments'] })
  alertType: string;

  @Column({ type: 'float', nullable: true })
  currentValue: number;

  @Column({ type: 'float', nullable: true })
  changeTrend: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  isResolved: boolean;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;
}
```

#### 6.14.5 API Endpoints

1. **Получение общих метрик успеваемости**
```typescript
@Controller('api/v1/performance')
export class PerformanceController {
  @Get('metrics')
  @Roles('ADMIN', 'TEACHER')
  async getPerformanceMetrics(
    @Query('classId') classId?: string,
    @Query('subjectId') subjectId?: string,
    @Query('period') period?: string
  ): Promise<PerformanceMetricsDto> {
    // Возвращает агрегированные метрики успеваемости по указанному классу 
    // и/или предмету за указанный период
  }

  @Get('metrics/student/:studentId')
  @Roles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT')
  async getStudentPerformanceMetrics(
    @Param('studentId') studentId: string,
    @Query('subjectId') subjectId?: string,
    @Query('period') period?: string
  ): Promise<StudentPerformanceMetricsDto> {
    // Возвращает метрики успеваемости для конкретного студента
  }

  @Get('trends')
  @Roles('ADMIN', 'TEACHER')
  async getPerformanceTrends(
    @Query('classId') classId?: string,
    @Query('subjectId') subjectId?: string,
    @Query('metricType') metricType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<PerformanceTrendDto[]> {
    // Возвращает тренды успеваемости за указанный период
  }

  @Get('distribution')
  @Roles('ADMIN', 'TEACHER')
  async getGradeDistribution(
    @Query('classId') classId?: string,
    @Query('subjectId') subjectId?: string,
    @Query('period') period?: string
  ): Promise<GradeDistributionDto> {
    // Возвращает распределение оценок для анализа
  }

  @Get('alerts')
  @Roles('ADMIN', 'TEACHER')
  async getPerformanceAlerts(
    @Query('classId') classId?: string,
    @Query('alertType') alertType?: string
  ): Promise<StudentPerformanceAlertDto[]> {
    // Возвращает уведомления о проблемах с успеваемостью студентов
  }

  @Get('students/low-performing')
  @Roles('ADMIN', 'TEACHER')
  async getLowPerformingStudents(
    @Query('classId') classId?: string,
    @Query('limit') limit = 10
  ): Promise<LowPerformingStudentDto[]> {
    // Возвращает список студентов с низкой успеваемостью
  }

  @Get('students/high-progress')
  @Roles('ADMIN', 'TEACHER')
  async getHighProgressStudents(
    @Query('classId') classId?: string,
    @Query('limit') limit = 10
  ): Promise<HighProgressStudentDto[]> {
    // Возвращает список студентов с высоким прогрессом
  }

  @Get('subjects/ranking')
  @Roles('ADMIN', 'TEACHER')
  async getSubjectsRanking(
    @Query('classId') classId?: string
  ): Promise<SubjectRankingDto[]> {
    // Возвращает рейтинг предметов по успеваемости
  }

  @Get('export')
  @Roles('ADMIN', 'TEACHER')
  async exportPerformanceReport(
    @Query('classId') classId?: string,
    @Query('period') period?: string,
    @Query('format') format = 'pdf'
  ): Promise<any> {
    // Экспортирует отчет об успеваемости в выбранном формате
  }
}
```

#### 6.14.6 Бизнес-логика

1. **Сбор и агрегация данных об успеваемости**:
   - Сбор данных из различных модулей (электронный журнал, домашние задания, тесты)
   - Расчет средних и интегральных показателей по группам и предметам
   - Нормализация данных для корректного сравнения между группами и периодами

2. **Анализ трендов и распределений**:
   - Отслеживание динамики успеваемости во времени
   - Выявление статистических аномалий и выбросов
   - Расчет корреляций между различными метриками успеваемости

3. **Выявление проблемных областей**:
   - Автоматическое определение студентов с критически низкой успеваемостью
   - Идентификация предметов с наибольшими проблемами по группам
   - Анализ причин снижения успеваемости на основе комплексных метрик

4. **Формирование рекомендаций**:
   - Генерация персонализированных рекомендаций для улучшения результатов
   - Предложения по корректировке учебных планов на основе аналитики
   - Автоматическое создание индивидуальных траекторий для отстающих студентов

5. **Прогнозирование успеваемости**:
   - Построение предиктивных моделей для прогнозирования будущих результатов
   - Раннее выявление рисков академической неуспеваемости
   - Моделирование влияния различных факторов на успеваемость

#### 6.14.7 Интеграции

1. Интеграция с модулем электронного журнала для получения данных об оценках
2. Взаимодействие с модулем домашних заданий для анализа выполнения заданий
3. Интеграция с системой тестирования для учета результатов контрольных работ
4. Взаимодействие с модулем студентов для получения персональных данных
5. Интеграция с системой уведомлений для отправки оповещений о проблемах с успеваемостью
6. Взаимодействие с модулем отчетов для формирования комплексных аналитических отчетов

#### 6.14.8 Требования к производительности

1. Быстрая загрузка интерактивных дашбордов (не более 2 секунд)
2. Оперативный расчет комплексных показателей для больших наборов данных
3. Эффективная фильтрация и группировка данных без задержек
4. Оптимизированное хранение исторических данных для быстрого доступа
5. Асинхронная генерация крупных аналитических отчетов
6. Кэширование часто запрашиваемых метрик и распределений
7. Эффективное обновление визуализаций в реальном времени

#### 6.14.9 Требования к безопасности

1. Строгое разграничение доступа к аналитическим данным согласно ролям
2. Запрет на доступ студентов к данным других студентов
3. Анонимизация данных при формировании общих отчетов
4. Протоколирование всех запросов к аналитическим данным
5. Защита от неавторизованного экспорта персональных данных
6. Соблюдение требований законодательства о защите персональных данных
7. Шифрование чувствительной информации при передаче и хранении

#### 6.14.10 Дополнительные функции

1. Прогностические модели для раннего выявления проблем с успеваемостью
2. Система рекомендаций для повышения эффективности учебного процесса
3. Персонализированные дашборды для различных категорий пользователей
4. API для доступа к аналитическим данным из внешних систем
5. Настраиваемые пороговые значения для мониторинга показателей
6. Сравнительный анализ между группами, курсами и учебными годами
7. Визуализация причинно-следственных связей в академических показателях# # #   6 . 1 5   >4C;L  C?@02;5=8O  ?5@A>=0;><  ( E m p l o y e e s P a g e )  
  
 # # # #   6 . 1 5 . 1   1I55  >?8A0=85 
 >4C;L  C?@02;5=8O  ?5@A>=0;><  ?@54>AB02;O5B  DC=:F8>=0;L=>ABL  4;O  CG5B0,   04<8=8AB@8@>20=8O  8  <>=8B>@8=30  :04@>2>3>  A>AB020  >1@07>20B5;L=>3>  CG@5645=8O.   !8AB5<0  ?>72>;O5B  C?@02;OBL  8=D>@<0F859  >  A>B@C4=8:0E,   >BA;56820BL  8E  AB0BCAK,   :20;8D8:0F8N,   ?@5?>40205<K5  ?@54<5BK,   0  B0:65  E@0=8BL  4>:C<5=BK  8  4>AB865=8O.   >4C;L  >15A?5G8205B  @0745;5=85  A>B@C4=8:>2  =0  HB0B=KE  8  A>2<5AB8B5;59  A  2>7<>6=>ABLN  87<5=5=8O  B8?0  70=OB>AB8.  
  
 # # # #   6 . 1 5 . 2   A=>2=K5  2>7<>6=>AB8 
 1 .   #?@02;5=85  40==K<8  A>B@C4=8:>2  ( ?@5?>4020B5;59  8  04<8=8AB@0B82=>3>  ?5@A>=0;0)  
 2 .    0745;5=85  =0  HB0B=KE  A>B@C4=8:>2  8  A>2<5AB8B5;59 
 3 .   BA;56820=85  AB0BCA>2  A>B@C4=8:>2  ( 0:B825=,   2  >B?CA:5,   =0  1>;L=8G=><,   2  :><0=48@>2:5)  
 4 .   #G5B  :20;8D8:0F8>==KE  :0B53>@89  8  AB060  @01>BK 
 5 .   %@0=5=85  ?5@A>=0;L=KE  40==KE  8  :>=B0:B=>9  8=D>@<0F88 
 6 .   #?@02;5=85  ?@5?>40205<K<8  48AF8?;8=0<8 
 7 .   #G5B  >1@07>20=8O,   A?5F80;870F88  8  ?@>D5AA8>=0;L=KE  4>AB865=89 
 8 .   %@0=5=85  8  >BA;56820=85  4>:C<5=B>2  A>B@C4=8:>2 
 9 .   7<5=5=85  B8?0  70=OB>AB8  8  C?@02;5=85  4>;6=>ABO<8 
 1 0 .   -:A?>@B  40==KE  >  A>B@C4=8:0E  2  @07;8G=KE  D>@<0B0E 
  
 # # # #   6 . 1 5 . 3   >ABC?  ?>  @>;O< 
  
 1 .   * * A D M I N * *   ( 4<8=8AB@0B>@) :  
       -   >;=K9  4>ABC?  :>  2A5<  DC=:F8O<  <>4C;O 
       -   >102;5=85,   @540:B8@>20=85  8  C40;5=85  A>B@C4=8:>2 
       -   7<5=5=85  B8?0  70=OB>AB8  8  AB0BCA>2 
       -   #?@02;5=85  4>:C<5=B0<8  8  ;8G=K<8  45;0<8 
       -   -:A?>@B  ?>;=>9  8=D>@<0F88  >  A>B@C4=8:0E 
  
 2 .   * * H R _ M A N A G E R * *   ( H R - <5=5465@) :  
       -   @>A<>B@  40==KE  2A5E  A>B@C4=8:>2 
       -   3@0=8G5==>5  @540:B8@>20=85  8=D>@<0F88 
       -   BA;56820=85  AB0BCA>2  8  HB0B=>3>  @0A?8A0=8O 
       -   -:A?>@B  >BG5B>2  ?>  :04@>2><C  A>AB02C 
  
 3 .   * * D I R E C T O R * *   ( 8@5:B>@) :  
       -   @>A<>B@  40==KE  2A5E  A>B@C4=8:>2 
       -   #B25@645=85  :04@>2KE  87<5=5=89 
       -   >ABC?  :  0=0;8B8:5  :04@>2>3>  A>AB020 
  
 4 .   * * T E A C H E R * *   ( @5?>4020B5;L) :  
       -   @>A<>B@  B>;L:>  A2>53>  ?@>D8;O 
       -   @>A<>B@  >3@0=8G5==>9  8=D>@<0F88  >  :>;;530E 
       -   1=>2;5=85  A2>8E  ?@>D5AA8>=0;L=KE  4>AB865=89  8  4>:C<5=B>2 
  
 # # # #   6 . 1 5 . 4   >45;8  40==KE 
  
 1 .   * * E m p l o y e e * *   -   A>B@C4=8: 
 ` ` ` t y p e s c r i p t  
 @ E n t i t y ( ' e m p l o y e e s ' )  
 e x p o r t   c l a s s   E m p l o y e e   {  
     @ P r i m a r y G e n e r a t e d C o l u m n ( ' u u i d ' )  
     i d :   s t r i n g ;  
  
     @ C o l u m n ( )  
     n a m e :   s t r i n g ;  
  
     @ C o l u m n ( {   u n i q u e :   t r u e   } )  
     i i n :   s t r i n g ;  
  
     @ C o l u m n ( {   u n i q u e :   t r u e   } )  
     e m a i l :   s t r i n g ;  
  
     @ C o l u m n ( )  
     p o s i t i o n :   s t r i n g ;  
  
     @ C o l u m n ( {   n u l l a b l e :   t r u e   } )  
     c a t e g o r y :   s t r i n g ;  
  
     @ C o l u m n ( {   n u l l a b l e :   t r u e   } )  
     s u b j e c t :   s t r i n g ;  
  
     @ C o l u m n ( {   n u l l a b l e :   t r u e   } )  
     e x p e r i e n c e :   s t r i n g ;  
  
     @ C o l u m n ( {  
         t y p e :   ' e n u m ' ,  
         e n u m :   E m p l o y e e S t a t u s ,  
         d e f a u l t :   E m p l o y e e S t a t u s . A C T I V E  
     } )  
     s t a t u s :   E m p l o y e e S t a t u s ;  
  
     @ C o l u m n ( {  
         t y p e :   ' e n u m ' ,  
         e n u m :   E m p l o y m e n t T y p e ,  
         d e f a u l t :   E m p l o y m e n t T y p e . F U L L T I M E  
     } )  
     e m p l o y m e n t T y p e :   E m p l o y m e n t T y p e ;  
  
     @ C o l u m n ( {   n u l l a b l e :   t r u e   } )  
     p h o n e :   s t r i n g ;  
  
     @ C o l u m n ( {   n u l l a b l e :   t r u e   } )  
     e d u c a t i o n :   s t r i n g ;  
  
     @ C o l u m n ( {   n u l l a b l e :   t r u e   } )  
     s p e c i a l i z a t i o n :   s t r i n g ;  
  
     @ C o l u m n ( {   n u l l a b l e :   t r u e   } )  
     a d d r e s s :   s t r i n g ;  
  
     @ C o l u m n ( {   t y p e :   ' d a t e ' ,   n u l l a b l e :   t r u e   } )  
     h i r e D a t e :   D a t e ;  
  
     @ C o l u m n ( {   t y p e :   ' j s o n b ' ,   n u l l a b l e :   t r u e   } )  
     s u b j e c t s :   {  
         g e n e r a l :   s t r i n g [ ] ;  
         s p e c i a l :   s t r i n g [ ] ;  
     } ;  
  
     @ C o l u m n ( ' t e x t ' ,   {   a r r a y :   t r u e ,   n u l l a b l e :   t r u e   } )  
     a c h i e v e m e n t s :   s t r i n g [ ] ;  
  
     @ O n e T o M a n y ( ( )   = >   E m p l o y e e D o c u m e n t ,   d o c u m e n t   = >   d o c u m e n t . e m p l o y e e )  
     d o c u m e n t s :   E m p l o y e e D o c u m e n t [ ] ;  
  
     @ C r e a t e D a t e C o l u m n ( )  
     c r e a t e d A t :   D a t e ;  
  
     @ U p d a t e D a t e C o l u m n ( )  
     u p d a t e d A t :   D a t e ;  
  
     @ C o l u m n ( {   t y p e :   ' d a t e ' ,   n u l l a b l e :   t r u e   } )  
     b i r t h D a t e :   D a t e ;  
  
     @ C o l u m n ( {   n u l l a b l e :   t r u e   } )  
     p h o t o U r l :   s t r i n g ;  
  
     @ M a n y T o O n e ( ( )   = >   D e p a r t m e n t )  
     d e p a r t m e n t :   D e p a r t m e n t ;  
  
     @ C o l u m n ( {   t y p e :   ' d e c i m a l ' ,   p r e c i s i o n :   1 0 ,   s c a l e :   2 ,   n u l l a b l e :   t r u e   } )  
     s a l a r y :   n u m b e r ;  
  
     @ C o l u m n ( {   n u l l a b l e :   t r u e   } )  
     c o n t r a c t N u m b e r :   s t r i n g ;  
 }  
  
 e x p o r t   e n u m   E m p l o y e e S t a t u s   {  
     A C T I V E   =   ' a c t i v e ' ,  
     V A C A T I O N   =   ' v a c a t i o n ' ,  
     S I C K   =   ' s i c k ' ,  
     B U S I N E S S _ T R I P   =   ' b u s i n e s s _ t r i p ' ,  
     S U S P E N D E D   =   ' s u s p e n d e d ' ,  
     T E R M I N A T E D   =   ' t e r m i n a t e d '  
 }  
  
 e x p o r t   e n u m   E m p l o y m e n t T y p e   {  
     F U L L T I M E   =   ' f u l l t i m e ' ,  
     P A R T T I M E   =   ' p a r t t i m e '  
 }  
 ` ` `  
  
 2 .   * * E m p l o y e e D o c u m e n t * *   -   4>:C<5=BK  A>B@C4=8:0 
 ` ` ` t y p e s c r i p t  
 @ E n t i t y ( ' e m p l o y e e _ d o c u m e n t s ' )  
 e x p o r t   c l a s s   E m p l o y e e D o c u m e n t   {  
     @ P r i m a r y G e n e r a t e d C o l u m n ( ' u u i d ' )  
     i d :   s t r i n g ;  
  
     @ M a n y T o O n e ( ( )   = >   E m p l o y e e ,   e m p l o y e e   = >   e m p l o y e e . d o c u m e n t s )  
     e m p l o y e e :   E m p l o y e e ;  
  
     @ C o l u m n ( )  
     t y p e :   s t r i n g ;  
  
     @ C o l u m n ( )  
     n u m b e r :   s t r i n g ;  
  
     @ C o l u m n ( {   t y p e :   ' d a t e '   } )  
     d a t e :   D a t e ;  
  
     @ C o l u m n ( )  
     n a m e :   s t r i n g ;  
  
     @ C o l u m n ( {  
         t y p e :   ' e n u m ' ,  
         e n u m :   D o c u m e n t S t a t u s ,  
         d e f a u l t :   D o c u m e n t S t a t u s . A C T I V E  
     } )  
     s t a t u s :   D o c u m e n t S t a t u s ;  
  
     @ C o l u m n ( )  
     f i l e U r l :   s t r i n g ;  
  
     @ C o l u m n ( {   n u l l a b l e :   t r u e   } )  
     f i l e S i z e :   n u m b e r ;  
  
     @ C o l u m n ( {   n u l l a b l e :   t r u e   } )  
     m i m e T y p e :   s t r i n g ;  
  
     @ C r e a t e D a t e C o l u m n ( )  
     c r e a t e d A t :   D a t e ;  
  
     @ U p d a t e D a t e C o l u m n ( )  
     u p d a t e d A t :   D a t e ;  
  
     @ C o l u m n ( {   n u l l a b l e :   t r u e   } )  
     e x p i r y D a t e :   D a t e ;  
  
     @ C o l u m n ( {   n u l l a b l e :   t r u e   } )  
     i s s u e d B y :   s t r i n g ;  
 }  
  
 e x p o r t   e n u m   D o c u m e n t S t a t u s   {  
     A C T I V E   =   ' a c t i v e ' ,  
     E X P I R E D   =   ' e x p i r e d ' ,  
     R E V O K E D   =   ' r e v o k e d '  
 }  
 ` ` `  
  
 3 .   * * D e p a r t m e n t * *   -   >B45; 
 ` ` ` t y p e s c r i p t  
 @ E n t i t y ( ' d e p a r t m e n t s ' )  
 e x p o r t   c l a s s   D e p a r t m e n t   {  
     @ P r i m a r y G e n e r a t e d C o l u m n ( ' u u i d ' )  
     i d :   s t r i n g ;  
  
     @ C o l u m n ( )  
     n a m e :   s t r i n g ;  
  
     @ C o l u m n ( {   n u l l a b l e :   t r u e   } )  
     d e s c r i p t i o n :   s t r i n g ;  
  
     @ M a n y T o O n e ( ( )   = >   E m p l o y e e ,   {   n u l l a b l e :   t r u e   } )  
     h e a d :   E m p l o y e e ;  
  
     @ O n e T o M a n y ( ( )   = >   E m p l o y e e ,   e m p l o y e e   = >   e m p l o y e e . d e p a r t m e n t )  
     e m p l o y e e s :   E m p l o y e e [ ] ;  
  
     @ C o l u m n ( {   d e f a u l t :   t r u e   } )  
     i s A c t i v e :   b o o l e a n ;  
  
     @ C r e a t e D a t e C o l u m n ( )  
     c r e a t e d A t :   D a t e ;  
  
     @ U p d a t e D a t e C o l u m n ( )  
     u p d a t e d A t :   D a t e ;  
 }  
 ` ` `  
  
 4 .   * * E m p l o y e e S t a t u s H i s t o r y * *   -   8AB>@8O  87<5=5=8O  AB0BCA0 
 ` ` ` t y p e s c r i p t  
 @ E n t i t y ( ' e m p l o y e e _ s t a t u s _ h i s t o r y ' )  
 e x p o r t   c l a s s   E m p l o y e e S t a t u s H i s t o r y   {  
     @ P r i m a r y G e n e r a t e d C o l u m n ( ' u u i d ' )  
     i d :   s t r i n g ;  
  
     @ M a n y T o O n e ( ( )   = >   E m p l o y e e )  
     e m p l o y e e :   E m p l o y e e ;  
  
     @ C o l u m n ( {  
         t y p e :   ' e n u m ' ,  
         e n u m :   E m p l o y e e S t a t u s  
     } )  
     s t a t u s :   E m p l o y e e S t a t u s ;  
  
     @ C o l u m n ( {   t y p e :   ' d a t e '   } )  
     s t a r t D a t e :   D a t e ;  
  
     @ C o l u m n ( {   t y p e :   ' d a t e ' ,   n u l l a b l e :   t r u e   } )  
     e n d D a t e :   D a t e ;  
  
     @ C o l u m n ( {   n u l l a b l e :   t r u e   } )  
     r e a s o n :   s t r i n g ;  
  
     @ C o l u m n ( {   n u l l a b l e :   t r u e   } )  
     d o c u m e n t N u m b e r :   s t r i n g ;  
  
     @ M a n y T o O n e ( ( )   = >   U s e r )  
     c r e a t e d B y :   U s e r ;  
  
     @ C r e a t e D a t e C o l u m n ( )  
     c r e a t e d A t :   D a t e ;  
 }  
 ` ` `  
  
 # # # #   6 . 1 5 . 5   A P I   E n d p o i n t s  
  
 1 .   * * #?@02;5=85  A>B@C4=8:0<8* *  
 ` ` ` t y p e s c r i p t  
 @ C o n t r o l l e r ( ' a p i / v 1 / e m p l o y e e s ' )  
 @ U s e G u a r d s ( J w t A u t h G u a r d )  
 e x p o r t   c l a s s   E m p l o y e e s C o n t r o l l e r   {  
     @ G e t ( )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' ,   ' D I R E C T O R ' )  
     a s y n c   g e t E m p l o y e e s (  
         @ Q u e r y ( )   q u e r y :   E m p l o y e e Q u e r y D t o  
     ) :   P r o m i s e < {   i t e m s :   E m p l o y e e D t o [ ] ;   m e t a :   P a g i n a t i o n M e t a   } >   {  
         / /   >72@0I05B  A?8A>:  A>B@C4=8:>2  A  ?038=0F859  8  D8;LB@0F859 
         / /   ?>  AB0BCAC,   B8?C  70=OB>AB8,   ?@54<5BC  8  4@.  
     }  
  
     @ P o s t ( )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' )  
     a s y n c   c r e a t e E m p l o y e e (  
         @ B o d y ( )   c r e a t e E m p l o y e e D t o :   C r e a t e E m p l o y e e D t o  
     ) :   P r o m i s e < E m p l o y e e D t o >   {  
         / /   !>7405B  =>2>3>  A>B@C4=8:0 
     }  
  
     @ G e t ( ' : i d ' )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' ,   ' D I R E C T O R ' ,   ' T E A C H E R ' )  
     a s y n c   g e t E m p l o y e e (  
         @ P a r a m ( ' i d ' )   i d :   s t r i n g ,  
         @ R e q ( )   r e q  
     ) :   P r o m i s e < E m p l o y e e D t o >   {  
         / /   >72@0I05B  40==K5  :>=:@5B=>3>  A>B@C4=8:0 
         / /   ;O  CG8B5;59  4>ABC?  >3@0=8G5=  A>1AB25==K<  ?@>D8;5< 
         / /   8;8  107>2>9  8=D>@<0F859  >  :>;;530E 
     }  
  
     @ P u t ( ' : i d ' )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' )  
     a s y n c   u p d a t e E m p l o y e e (  
         @ P a r a m ( ' i d ' )   i d :   s t r i n g ,  
         @ B o d y ( )   u p d a t e E m p l o y e e D t o :   U p d a t e E m p l o y e e D t o  
     ) :   P r o m i s e < E m p l o y e e D t o >   {  
         / /   1=>2;O5B  40==K5  A>B@C4=8:0 
     }  
  
     @ D e l e t e ( ' : i d ' )  
     @ R o l e s ( ' A D M I N ' )  
     a s y n c   d e l e t e E m p l o y e e (  
         @ P a r a m ( ' i d ' )   i d :   s t r i n g  
     ) :   P r o m i s e < v o i d >   {  
         / /   #40;O5B  A>B@C4=8:0 
     }  
  
     @ P a t c h ( ' : i d / s t a t u s ' )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' )  
     a s y n c   u p d a t e S t a t u s (  
         @ P a r a m ( ' i d ' )   i d :   s t r i n g ,  
         @ B o d y ( )   s t a t u s D t o :   U p d a t e S t a t u s D t o  
     ) :   P r o m i s e < E m p l o y e e D t o >   {  
         / /   1=>2;O5B  AB0BCA  A>B@C4=8:0 
     }  
  
     @ P a t c h ( ' : i d / e m p l o y m e n t - t y p e ' )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' )  
     a s y n c   u p d a t e E m p l o y m e n t T y p e (  
         @ P a r a m ( ' i d ' )   i d :   s t r i n g ,  
         @ B o d y ( )   t y p e D t o :   U p d a t e E m p l o y m e n t T y p e D t o  
     ) :   P r o m i s e < E m p l o y e e D t o >   {  
         / /   7<5=O5B  B8?  70=OB>AB8  ( HB0B=K9/ A>2<5AB8B5;L)  
     }  
  
     @ G e t ( ' f u l l t i m e ' )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' ,   ' D I R E C T O R ' )  
     a s y n c   g e t F u l l t i m e E m p l o y e e s (  
         @ Q u e r y ( )   q u e r y :   E m p l o y e e Q u e r y D t o  
     ) :   P r o m i s e < {   i t e m s :   E m p l o y e e D t o [ ] ;   m e t a :   P a g i n a t i o n M e t a   } >   {  
         / /   >72@0I05B  A?8A>:  HB0B=KE  A>B@C4=8:>2 
     }  
  
     @ G e t ( ' p a r t t i m e ' )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' ,   ' D I R E C T O R ' )  
     a s y n c   g e t P a r t t i m e E m p l o y e e s (  
         @ Q u e r y ( )   q u e r y :   E m p l o y e e Q u e r y D t o  
     ) :   P r o m i s e < {   i t e m s :   E m p l o y e e D t o [ ] ;   m e t a :   P a g i n a t i o n M e t a   } >   {  
         / /   >72@0I05B  A?8A>:  A>B@C4=8:>2- A>2<5AB8B5;59 
     }  
  
     @ G e t ( ' e x p o r t ' )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' ,   ' D I R E C T O R ' )  
     a s y n c   e x p o r t E m p l o y e e s (  
         @ Q u e r y ( )   q u e r y :   E x p o r t E m p l o y e e s D t o ,  
         @ R e s ( )   r e s  
     ) :   P r o m i s e < v o i d >   {  
         / /   -:A?>@B  40==KE  A>B@C4=8:>2  2  2K1@0==><  D>@<0B5 
     }  
 }  
 ` ` `  
  
 2 .   * * #?@02;5=85  4>:C<5=B0<8  A>B@C4=8:>2* *  
 ` ` ` t y p e s c r i p t  
 @ C o n t r o l l e r ( ' a p i / v 1 / e m p l o y e e s / : e m p l o y e e I d / d o c u m e n t s ' )  
 @ U s e G u a r d s ( J w t A u t h G u a r d )  
 e x p o r t   c l a s s   E m p l o y e e D o c u m e n t s C o n t r o l l e r   {  
     @ G e t ( )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' ,   ' D I R E C T O R ' ,   ' T E A C H E R ' )  
     a s y n c   g e t D o c u m e n t s (  
         @ P a r a m ( ' e m p l o y e e I d ' )   e m p l o y e e I d :   s t r i n g ,  
         @ R e q ( )   r e q  
     ) :   P r o m i s e < {   i t e m s :   E m p l o y e e D o c u m e n t D t o [ ] ;   m e t a :   P a g i n a t i o n M e t a   } >   {  
         / /   >72@0I05B  A?8A>:  4>:C<5=B>2  A>B@C4=8:0 
     }  
  
     @ P o s t ( )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' )  
     @ U s e I n t e r c e p t o r s ( F i l e I n t e r c e p t o r ( ' f i l e ' ) )  
     a s y n c   a d d D o c u m e n t (  
         @ P a r a m ( ' e m p l o y e e I d ' )   e m p l o y e e I d :   s t r i n g ,  
         @ B o d y ( )   d o c u m e n t D t o :   C r e a t e D o c u m e n t D t o ,  
         @ U p l o a d e d F i l e ( )   f i l e :   E x p r e s s . M u l t e r . F i l e  
     ) :   P r o m i s e < E m p l o y e e D o c u m e n t D t o >   {  
         / /   >102;O5B  =>2K9  4>:C<5=B  A>B@C4=8:C 
     }  
  
     @ G e t ( ' : d o c u m e n t I d ' )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' ,   ' D I R E C T O R ' ,   ' T E A C H E R ' )  
     a s y n c   g e t D o c u m e n t (  
         @ P a r a m ( ' e m p l o y e e I d ' )   e m p l o y e e I d :   s t r i n g ,  
         @ P a r a m ( ' d o c u m e n t I d ' )   d o c u m e n t I d :   s t r i n g ,  
         @ R e q ( )   r e q  
     ) :   P r o m i s e < E m p l o y e e D o c u m e n t D t o >   {  
         / /   >72@0I05B  8=D>@<0F8N  >  :>=:@5B=><  4>:C<5=B5 
     }  
  
     @ D e l e t e ( ' : d o c u m e n t I d ' )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' )  
     a s y n c   d e l e t e D o c u m e n t (  
         @ P a r a m ( ' e m p l o y e e I d ' )   e m p l o y e e I d :   s t r i n g ,  
         @ P a r a m ( ' d o c u m e n t I d ' )   d o c u m e n t I d :   s t r i n g  
     ) :   P r o m i s e < v o i d >   {  
         / /   #40;O5B  4>:C<5=B 
     }  
  
     @ G e t ( ' : d o c u m e n t I d / d o w n l o a d ' )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' ,   ' D I R E C T O R ' ,   ' T E A C H E R ' )  
     a s y n c   d o w n l o a d D o c u m e n t (  
         @ P a r a m ( ' e m p l o y e e I d ' )   e m p l o y e e I d :   s t r i n g ,  
         @ P a r a m ( ' d o c u m e n t I d ' )   d o c u m e n t I d :   s t r i n g ,  
         @ R e q ( )   r e q ,  
         @ R e s ( )   r e s  
     ) :   P r o m i s e < v o i d >   {  
         / /   !:0G820=85  4>:C<5=B0 
     }  
  
     @ P a t c h ( ' : d o c u m e n t I d / s t a t u s ' )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' )  
     a s y n c   u p d a t e D o c u m e n t S t a t u s (  
         @ P a r a m ( ' e m p l o y e e I d ' )   e m p l o y e e I d :   s t r i n g ,  
         @ P a r a m ( ' d o c u m e n t I d ' )   d o c u m e n t I d :   s t r i n g ,  
         @ B o d y ( )   s t a t u s D t o :   U p d a t e D o c u m e n t S t a t u s D t o  
     ) :   P r o m i s e < E m p l o y e e D o c u m e n t D t o >   {  
         / /   1=>2;O5B  AB0BCA  4>:C<5=B0 
     }  
 }  
 ` ` `  
  
 3 .   * * !B0B8AB8:0  8  0=0;8B8:0  ?5@A>=0;0* *  
 ` ` ` t y p e s c r i p t  
 @ C o n t r o l l e r ( ' a p i / v 1 / e m p l o y e e s / s t a t i s t i c s ' )  
 @ U s e G u a r d s ( J w t A u t h G u a r d )  
 e x p o r t   c l a s s   E m p l o y e e S t a t i s t i c s C o n t r o l l e r   {  
     @ G e t ( ' o v e r v i e w ' )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' ,   ' D I R E C T O R ' )  
     a s y n c   g e t O v e r v i e w ( ) :   P r o m i s e < E m p l o y e e S t a t s D t o >   {  
         / /   1I0O  AB0B8AB8:0  ?>  A>B@C4=8:0< 
     }  
  
     @ G e t ( ' b y - s t a t u s ' )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' ,   ' D I R E C T O R ' )  
     a s y n c   g e t S t a t s B y S t a t u s ( ) :   P r o m i s e < S t a t u s S t a t s D t o [ ] >   {  
         / /   !B0B8AB8:0  ?>  AB0BCA0<  A>B@C4=8:>2 
     }  
  
     @ G e t ( ' b y - s u b j e c t ' )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' ,   ' D I R E C T O R ' )  
     a s y n c   g e t S t a t s B y S u b j e c t ( ) :   P r o m i s e < S u b j e c t S t a t s D t o [ ] >   {  
         / /    0A?@545;5=85  ?@5?>4020B5;59  ?>  ?@54<5B0< 
     }  
  
     @ G e t ( ' b y - c a t e g o r y ' )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' ,   ' D I R E C T O R ' )  
     a s y n c   g e t S t a t s B y C a t e g o r y ( ) :   P r o m i s e < C a t e g o r y S t a t s D t o [ ] >   {  
         / /    0A?@545;5=85  ?>  :20;8D8:0F8>==K<  :0B53>@8O< 
     }  
  
     @ G e t ( ' b y - d e p a r t m e n t ' )  
     @ R o l e s ( ' A D M I N ' ,   ' H R _ M A N A G E R ' ,   ' D I R E C T O R ' )  
     a s y n c   g e t S t a t s B y D e p a r t m e n t ( ) :   P r o m i s e < D e p a r t m e n t S t a t s D t o [ ] >   {  
         / /    0A?@545;5=85  ?>  >B45;0< 
     }  
 }  
 ` ` `  
  
 # # # #   6 . 1 5 . 6   87=5A- ;>38:0 
  
 1 .   * * #?@02;5=85  AB0BCA0<8  A>B@C4=8:>2* *  
       -   BA;56820=85  0:B82=KE  A>B@C4=8:>2,   =0E>4OI8EAO  2  >B?CA:5,   =0  1>;L=8G=><  8;8  2  :><0=48@>2:5 
       -   545=85  8AB>@88  87<5=5=8O  AB0BCA>2  A  C:070=85<  ?@8G8=  8  4>:C<5=B>2- >A=>20=89 
       -   2B><0B8G5A:>5  >1=>2;5=85  AB0BCA>2  ?@8  8AB5G5=88  A@>:0  >B?CA:0  8;8  1>;L=8G=>3> 
       -   #G5B  4>ABC?=>AB8  ?@5?>4020B5;O  4;O  A>AB02;5=8O  @0A?8A0=8O  =0  >A=>25  53>  AB0BCA0 
  
 2 .   * * #?@02;5=85  B8?0<8  70=OB>AB8* *  
       -    0745;5=85  A>B@C4=8:>2  =0  HB0B=KE  8  A>2<5AB8B5;59  A  A>>B25BAB2CNI8<8  ?@020<8  8  >1O70==>ABO<8 
       -   @>F54C@0  ?5@52>40  87  >4=>3>  B8?0  70=OB>AB8  2  4@C3>9  A  A>E@0=5=85<  8AB>@88  87<5=5=89 
       -   #G5B  >A>15==>AB59  >D>@<;5=8O  8  =0G8A;5=8O  70@01>B=>9  ?;0BK  2  7028A8<>AB8  >B  B8?0  70=OB>AB8 
       -   =B53@0F8O  A  D8=0=A>2K<  <>4C;5<  4;O  :>@@5:B=>3>  @0AG5B0  70@01>B=>9  ?;0BK 
  
 3 .   * * #?@02;5=85  4>:C<5=B0<8* *  
       -   %@0=5=85  8  >@30=870F8O  4>:C<5=B>2  A>B@C4=8:>2  ( 48?;><K,   A5@B8D8:0BK,   ?@8:07K)  
       -   BA;56820=85  AB0BCA0  4>:C<5=B>2  ( 459AB2CNI89,   ?@>A@>G5==K9)  
       -   !8AB5<0  =0?><8=0=89  >  =5>1E>48<>AB8  >1=>2;5=8O  4>:C<5=B>2  A  8AB5:0NI8<  A@>:><  459AB28O 
       -   $>@<8@>20=85  ;8G=>3>  45;0  A>B@C4=8:0  =0  >A=>25  E@0=OI8EAO  4>:C<5=B>2 
  
 4 .   * * #?@02;5=85  :20;8D8:0F859  8  ?@>D5AA8>=0;L=K<  @0728B85<* *  
       -   #G5B  >1@07>20=8O,   :20;8D8:0F8>==KE  :0B53>@89  8  >?KB0  @01>BK 
       -   BA;56820=85  ?@>D5AA8>=0;L=KE  4>AB865=89  8  ?@>E>645=8O  :C@A>2  ?>2KH5=8O  :20;8D8:0F88 
       -   ;0=8@>20=85  0BB5AB0F89  8  ?>2KH5=8O  :20;8D8:0F88 
       -   =0;87  A>>B25BAB28O  ?@5?>4020B5;59  B@51>20=8O<  >1@07>20B5;L=KE  AB0=40@B>2 
  
 5 .   * * =0;87  :04@>2>3>  A>AB020* *  
       -   $>@<8@>20=85  >BG5B>2  >  B5:CI5<  A>AB>O=88  :04@>2>3>  >15A?5G5=8O 
       -   KO2;5=85  =54>AB0B:0  ?@5?>4020B5;59  ?>  >?@545;5==K<  ?@54<5B0<  8;8  A?5F80;870F8O< 
       -   =0;87  =03@C7:8  =0  ?5@A>=0;  8  @0A?@545;5=8O  ?>  >B45;0<  8  ?@54<5B0< 
       -   @>3=>78@>20=85  ?>B@51=>AB8  2  ?5@A>=0;5  =0  >A=>25  CG51=KE  ?;0=>2 
  
 # # # #   6 . 1 5 . 7   =B53@0F88 
  
 1 .   =B53@0F8O  A  <>4C;5<  @0A?8A0=8O  4;O  CG5B0  4>ABC?=>AB8  ?@5?>4020B5;59 
 2 .   =B53@0F8O  A  D8=0=A>2K<  <>4C;5<  4;O  @0AG5B0  70@01>B=>9  ?;0BK 
 3 .   708<>459AB285  A  <>4C;5<  M;5:B@>==>3>  4>:C<5=B>>1>@>B0 
 4 .   =B53@0F8O  A  A8AB5<>9  C254><;5=89  4;O  >?>25I5=89  >  AB0BCA0E  8  4>:C<5=B0E 
 5 .   !2O7L  A  <>4C;5<  =03@C7:8  4;O  ?;0=8@>20=8O  @01>BK  ?@5?>4020B5;59 
 6 .   =B53@0F8O  A  A8AB5<>9  02B>@870F88  8  @>;52>3>  4>ABC?0 
  
 # # # #   6 . 1 5 . 8   "@51>20=8O  :  ?@>872>48B5;L=>AB8 
  
 1 .   KAB@0O  703@C7:0  A?8A:0  A>B@C4=8:>2  A  ?@8<5=5=85<  D8;LB@>2  8  ?038=0F88 
 2 .   -DD5:B82=K9  ?>8A:  ?>  1075  A>B@C4=8:>2  ?>  @07;8G=K<  ?0@0<5B@0< 
 3 .   ?B8<878@>20==0O  @01>B0  A  4>:C<5=B0<8  1>;LH>3>  @07<5@0 
 4 .   A8=E@>==0O  >1@01>B:0  >?5@0F89  <0AA>2>3>  8<?>@B0/ M:A?>@B0  40==KE 
 5 .   MH8@>20=85  G0AB>  70?@0H8205<KE  40==KE  4;O  C;CGH5=8O  >B:;8:0  A8AB5<K 
 6 .   ?B8<870F8O  70?@>A>2  :  1075  40==KE  ?@8  @01>B5  A  8AB>@8G5A:8<8  40==K<8 
  
 # # # #   6 . 1 5 . 9   "@51>20=8O  :  157>?0A=>AB8 
  
 1 .   !B@>3>5  @073@0=8G5=85  4>ABC?0  :  ?5@A>=0;L=K<  40==K<  A>B@C4=8:>2 
 2 .   (8D@>20=85  GC2AB28B5;L=>9  8=D>@<0F88  ?@8  E@0=5=88  8  ?5@540G5 
 3 .   545=85  6C@=0;0  4>ABC?0  :  ?5@A>=0;L=K<  40==K< 
 4 .   !>1;N45=85  B@51>20=89  70:>=>40B5;LAB20  >  ?5@A>=0;L=KE  40==KE 
 5 .   0I8B0  :>=D845=F80;L=>9  8=D>@<0F88  >  70@01>B=>9  ?;0B5  8  CA;>28OE  B@C40 
 6 .   !8AB5<0  @575@2=>3>  :>?8@>20=8O  40==KE  A>B@C4=8:>2 
  
 # # # #   6 . 1 5 . 1 0   >?>;=8B5;L=K5  DC=:F88 
  
 1 .   0AA>2K9  8<?>@B  40==KE  >  A>B@C4=8:0E  87  E x c e l ,   C S V  
 2 .   2B><0B8G5A:>5  D>@<8@>20=85  HB0B=>3>  @0A?8A0=8O 
 3 .   !8AB5<0  H01;>=>2  4;O  1KAB@>3>  A>740=8O  B8?>2KE  4>:C<5=B>2 
 4 .   5=5@0F8O  A?@02>:  8  >BG5B>2  4;O  3>AC40@AB25==KE  >@30=>2 
 5 .   2B><0B8G5A:>5  >?>25I5=85  >  =5>1E>48<>AB8  ?@>4;5=8O  4>:C<5=B>2 
 6 .   =B53@0F8O  A>  AB>@>==8<8  H R - A8AB5<0<8 
 7 .   $C=:F8O  @0A?>7=020=8O  8  872;5G5=8O  40==KE  87  703@C605<KE  4>:C<5=B>2 
 