-- Схема базы данных для системы управления учебным процессом

-- Пользователи
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    role VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Преподаватели
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    academic_degree VARCHAR(100),
    academic_title VARCHAR(100),
    hire_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Предметы
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL,
    hours_per_credit INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Группы
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    year INTEGER NOT NULL,
    speciality VARCHAR(100) NOT NULL,
    students_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Аудитории
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    number VARCHAR(20) UNIQUE NOT NULL,
    building VARCHAR(50) NOT NULL,
    floor INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL, -- lecture, practice, lab, computer
    equipment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Расписание
CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id),
    teacher_id INTEGER REFERENCES teachers(id),
    group_id INTEGER REFERENCES groups(id),
    room_id INTEGER REFERENCES rooms(id),
    type VARCHAR(20) NOT NULL, -- lecture, practice, lab
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    day_of_week INTEGER NOT NULL, -- 1-7
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    recurrence_rule JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Нагрузка преподавателей
CREATE TABLE teacher_workload (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(id),
    academic_year INTEGER NOT NULL,
    standard_hours DECIMAL(10,2) NOT NULL,
    actual_hours DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(teacher_id, academic_year)
);

-- Ежемесячная нагрузка
CREATE TABLE monthly_workload (
    id SERIAL PRIMARY KEY,
    workload_id INTEGER REFERENCES teacher_workload(id),
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    standard_hours DECIMAL(10,2) NOT NULL,
    actual_hours DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workload_id, month)
);

-- Ежедневная нагрузка
CREATE TABLE daily_workload (
    id SERIAL PRIMARY KEY,
    workload_id INTEGER REFERENCES teacher_workload(id),
    date DATE NOT NULL,
    hours DECIMAL(10,2) NOT NULL,
    type VARCHAR(20) NOT NULL, -- regular, overtime, sick, vacation
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Чаты
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL, -- private, group
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Участники чатов
CREATE TABLE conversation_participants (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id),
    user_id INTEGER REFERENCES users(id),
    role VARCHAR(20) NOT NULL DEFAULT 'member', -- owner, admin, member
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(conversation_id, user_id)
);

-- Сообщения
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id),
    sender_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'text', -- text, file, image
    status VARCHAR(20) NOT NULL DEFAULT 'sent', -- sent, delivered, read
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Вложения к сообщениям
CREATE TABLE message_attachments (
    id SERIAL PRIMARY KEY,
    message_id INTEGER REFERENCES messages(id),
    type VARCHAR(50) NOT NULL,
    url VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    size INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы
CREATE INDEX idx_schedule_date_range ON schedule(start_date, end_date);
CREATE INDEX idx_schedule_teacher ON schedule(teacher_id);
CREATE INDEX idx_schedule_group ON schedule(group_id);
CREATE INDEX idx_schedule_room ON schedule(room_id);
CREATE INDEX idx_workload_teacher_year ON teacher_workload(teacher_id, academic_year);
CREATE INDEX idx_daily_workload_date ON daily_workload(date);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);

-- Триггеры
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Применяем триггер ко всем таблицам
CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_teachers_timestamp BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_subjects_timestamp BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_groups_timestamp BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_rooms_timestamp BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_schedule_timestamp BEFORE UPDATE ON schedule FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_teacher_workload_timestamp BEFORE UPDATE ON teacher_workload FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_monthly_workload_timestamp BEFORE UPDATE ON monthly_workload FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_daily_workload_timestamp BEFORE UPDATE ON daily_workload FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_conversations_timestamp BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_conversation_participants_timestamp BEFORE UPDATE ON conversation_participants FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_messages_timestamp BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_timestamp(); 