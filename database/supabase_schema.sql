-- Supabase (PostgreSQL) Schema for Smart Planner

-- Users Table (Optional if using Supabase Auth, but good for profile data)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY, -- Will match Supabase Auth id
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    user_id UUID,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline TIMESTAMP NOT NULL,
    priority VARCHAR(20) DEFAULT 'Medium',
    category VARCHAR(50) DEFAULT 'College',
    estimated_hours INT NULL,
    time_type VARCHAR(50) DEFAULT 'NA', -- 'NA', 'Estimated', 'Fixed'
    start_time TIME NULL,
    end_time TIME NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    user_id UUID,
    project_id INT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    CHECK (priority IN ('Low', 'Medium', 'High')),
    CHECK (category IN ('Deadline', 'Exam', 'Internship', 'Project', 'College')),
    CHECK (status IN ('Pending', 'In-Progress', 'Completed'))
);

-- Daily Availability Table
CREATE TABLE IF NOT EXISTS daily_availability (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    day_of_week VARCHAR(20),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'))
);

-- Timetable Slots
CREATE TABLE IF NOT EXISTS timetable_slots (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    task_id INT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- Saved Weekly Plans
CREATE TABLE IF NOT EXISTS generated_plans (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    plan_data JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
