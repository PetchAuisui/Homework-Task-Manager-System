CREATE SCHEMA IF NOT EXISTS homework;

-- ============================================================
-- 1. USERS (ผู้ใช้ระบบ)
-- ============================================================
CREATE TABLE homework.users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE homework.users IS 'ตารางเก็บข้อมูลผู้ใช้';

COMMENT ON COLUMN homework.users.email IS 'อีเมลใช้เข้าสู่ระบบ (ไม่ซ้ำ)';

-- ============================================================
-- 2. SUBJECTS (รายวิชา)
-- ============================================================
CREATE TABLE homework.subjects (
    subject_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES homework.users (user_id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    color_tag VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE homework.subjects IS 'ตารางเก็บรายวิชาของผู้ใช้';

COMMENT ON COLUMN homework.subjects.user_id IS 'เจ้าของรายวิชา';

-- ============================================================
-- 3. TASKS (งาน / การบ้าน)
-- ============================================================
CREATE TABLE homework.tasks (
    task_id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL REFERENCES homework.subjects (subject_id) ON DELETE CASCADE,
    title VARCHAR(120) NOT NULL,
    description TEXT,
    due_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(10) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH
    created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE homework.tasks IS 'เก็บข้อมูลงานหรือการบ้านในแต่ละรายวิชา';

COMMENT ON COLUMN homework.tasks.priority IS 'ระดับความสำคัญของงาน';

-- ============================================================
-- 4. REMINDERS (ตั้งเวลาแจ้งเตือน)
-- ============================================================
CREATE TABLE homework.reminders (
    reminder_id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES homework.tasks (task_id) ON DELETE CASCADE,
    message TEXT,
    notify_at TIMESTAMP,
    is_sent BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE homework.reminders IS 'ตั้งเวลาแจ้งเตือนงานก่อนถึงกำหนดส่ง';

COMMENT ON COLUMN homework.reminders.notify_at IS 'เวลาที่ต้องแจ้งเตือน';

-- ============================================================
-- 5. SHARE_LINKS (ลิงก์แชร์รายวิชาแบบดูได้อย่างเดียว)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- สำหรับ gen_random_uuid()

CREATE TABLE homework.share_links (
    share_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES homework.users (user_id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES homework.subjects (subject_id) ON DELETE CASCADE,
    token UUID DEFAULT gen_random_uuid (),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE homework.share_links IS 'ลิงก์แชร์รายวิชาให้ผู้อื่นดูแบบ read-only';

COMMENT ON COLUMN homework.share_links.token IS 'UUID สำหรับใช้ใน URL แชร์';

-- ============================================================
-- 6. LABELS (แท็กของผู้ใช้)
-- ============================================================
CREATE TABLE homework.labels (
    label_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES homework.users (user_id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, name)
);

COMMENT ON TABLE homework.labels IS 'ตารางเก็บป้ายกำกับ (แท็ก) ของผู้ใช้';

-- ============================================================
-- 7. TASK_LABELS (M:N งาน <-> แท็ก)
-- ============================================================
CREATE TABLE homework.task_labels (
    task_id INTEGER NOT NULL REFERENCES homework.tasks (task_id) ON DELETE CASCADE,
    label_id INTEGER NOT NULL REFERENCES homework.labels (label_id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, label_id)
);

COMMENT ON TABLE homework.task_labels IS 'ตารางเชื่อมหลายต่อหลายระหว่างงานและแท็ก';

-- ============================================================
-- INDEXES เพื่อเพิ่มความเร็ว
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON homework.subjects (user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_subject_id ON homework.tasks (subject_id);

CREATE INDEX IF NOT EXISTS idx_reminders_task_id ON homework.reminders (task_id);

CREATE INDEX IF NOT EXISTS idx_sharelinks_user_id ON homework.share_links (user_id);

CREATE INDEX IF NOT EXISTS idx_sharelinks_token ON homework.share_links (token);

CREATE INDEX IF NOT EXISTS idx_labels_user_id ON homework.labels (user_id);

CREATE INDEX IF NOT EXISTS idx_tasklabels_task_id ON homework.task_labels (task_id);