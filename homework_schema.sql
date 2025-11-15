CREATE SCHEMA IF NOT EXISTS homework;

-- ============================================================
-- 1. USERS (ข้อมูลผู้ใช้)
-- ============================================================
CREATE TABLE homework.users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    bio TEXT,
    profile_image TEXT,
    role VARCHAR(20) DEFAULT 'USER',
    theme_preference VARCHAR(20) DEFAULT 'light',
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

COMMENT ON TABLE homework.users IS 'ข้อมูลผู้ใช้ (ไม่มีการเก็บ education_level, institution_name, major แล้ว)';

-- ============================================================
-- 2. EDUCATION LEVELS (ระดับชั้น)
-- ============================================================
CREATE TABLE homework.education_levels (
    level_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES homework.users (user_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- เช่น ม.1, ปี 1
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, name)
);

COMMENT ON TABLE homework.education_levels IS 'ระดับชั้นของผู้ใช้ เช่น ม.1, ม.3, ปี 1';

-- ============================================================
-- 3. SUBJECTS (รายวิชา)
-- ============================================================
CREATE TABLE homework.subjects (
    subject_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES homework.users (user_id) ON DELETE CASCADE,
    level_id INTEGER REFERENCES homework.education_levels (level_id) ON DELETE SET NULL,
    name VARCHAR(120) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    color_tag VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE homework.subjects IS 'รายวิชาของผู้ใช้';

-- ============================================================
-- 4. TASKS (งานหลัก)
-- ============================================================
CREATE TABLE homework.tasks (
    task_id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES homework.subjects (subject_id) ON DELETE CASCADE,
    title VARCHAR(120) NOT NULL,
    description TEXT,
    due_date DATE,
    priority VARCHAR(10) DEFAULT 'MEDIUM',
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE homework.tasks IS 'งานหลักของแต่ละรายวิชา';

-- ============================================================
-- 5. SUBTASKS (งานย่อย ซ้อนกันได้ไม่จำกัด)
-- ============================================================
CREATE TABLE homework.subtasks (
    subtask_id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES homework.tasks (task_id) ON DELETE CASCADE,
    parent_subtask INTEGER REFERENCES homework.subtasks (subtask_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    due_date DATE,
    priority VARCHAR(10) DEFAULT 'MEDIUM',
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE homework.subtasks IS 'งานย่อยของงาน สามารถซ้อนหลายระดับได้ (recursive)';

-- ============================================================
-- 6. EVENTS (เหตุการณ์)
-- ============================================================
CREATE TABLE homework.events (
    event_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES homework.users (user_id) ON DELETE CASCADE,
    level_id INTEGER REFERENCES homework.education_levels (level_id) ON DELETE SET NULL,
    title VARCHAR(120) NOT NULL,
    description TEXT,
    date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE homework.events IS 'เหตุการณ์ เช่น สอบ, Portfolio, โปรเจกต์';

-- ============================================================
-- 7. EVENT TASKS (งานในเหตุการณ์)
-- ============================================================
CREATE TABLE homework.event_tasks (
    event_task_id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES homework.events (event_id) ON DELETE CASCADE,
    parent_event_task INTEGER REFERENCES homework.event_tasks (event_task_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    due_date DATE,
    priority VARCHAR(10) DEFAULT 'MEDIUM',
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE homework.event_tasks IS 'งานย่อยที่ผูกกับ Event รองรับซ้อนกันหลายระดับ';

-- ============================================================
-- 8. LABELS (แท็ก)
-- ============================================================
CREATE TABLE homework.labels (
    label_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES homework.users (user_id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20),
    priority INTEGER DEFAULT 0, -- เพิ่มลำดับความสำคัญแท็ก
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, name)
);

COMMENT ON TABLE homework.labels IS 'แท็กพร้อมระบบจัดลำดับความสำคัญ';

-- ============================================================
-- 9. TASK_LABELS (เชื่อมงาน + แท็ก)
-- ============================================================
CREATE TABLE homework.task_labels (
    task_id INTEGER NOT NULL REFERENCES homework.tasks (task_id) ON DELETE CASCADE,
    label_id INTEGER NOT NULL REFERENCES homework.labels (label_id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, label_id)
);

-- สำหรับ Subtasks ผูกแท็กด้วย
CREATE TABLE homework.subtask_labels (
    subtask_id INTEGER NOT NULL REFERENCES homework.subtasks (subtask_id) ON DELETE CASCADE,
    label_id INTEGER NOT NULL REFERENCES homework.labels (label_id) ON DELETE CASCADE,
    PRIMARY KEY (subtask_id, label_id)
);

-- ============================================================
-- 10. REMINDERS (ตั้งแจ้งเตือนงาน)
-- ============================================================
CREATE TABLE homework.reminders (
    reminder_id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES homework.tasks (task_id) ON DELETE CASCADE,
    subtask_id INTEGER REFERENCES homework.subtasks (subtask_id) ON DELETE CASCADE,
    event_task_id INTEGER REFERENCES homework.event_tasks (event_task_id) ON DELETE CASCADE,
    message TEXT,
    notify_at TIMESTAMP,
    is_sent BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE homework.reminders IS 'แจ้งเตือนงานหลัก / งานย่อย / งานเหตุการณ์';

-- ============================================================
-- 11. SHARE_LINKS (แชร์รายวิชา)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE homework.share_links (
    share_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES homework.users (user_id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES homework.subjects (subject_id) ON DELETE CASCADE,
    token UUID DEFAULT gen_random_uuid (),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_users_email ON homework.users (email);

CREATE INDEX idx_subjects_user ON homework.subjects (user_id);

CREATE INDEX idx_tasks_subject ON homework.tasks (subject_id);

CREATE INDEX idx_subtasks_parent ON homework.subtasks (parent_subtask);

CREATE INDEX idx_event_user ON homework.events (user_id);