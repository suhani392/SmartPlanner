const db = require('../config/db');
const { generateTimetable } = require('../services/timetableService');

// Helper to update global timetable
const refreshTimetable = async (userId) => {
    try {
        const [tasks] = await db.execute('SELECT * FROM tasks WHERE user_id = $1 AND status != \'Completed\'', [userId]);
        const groupedData = generateTimetable(tasks);
        const jsonData = JSON.stringify(groupedData);

        const [existing] = await db.execute('SELECT id FROM generated_plans WHERE user_id = $1', [userId]);
        if (existing.length > 0) {
            await db.execute('UPDATE generated_plans SET plan_data = $1 WHERE user_id = $2', [jsonData, userId]);
        } else {
            await db.execute('INSERT INTO generated_plans (user_id, plan_data) VALUES ($1, $2)', [userId, jsonData]);
        }
    } catch (e) {
        console.error("Timetable Refresh Error:", e);
    }
};

exports.getAllTasks = async (req, res) => {
    const { userId } = req.query;
    try {
        let query = 'SELECT * FROM tasks';
        let params = [];

        if (userId) {
            query += ' WHERE user_id = $1';
            params = [userId];
        }

        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createTask = async (req, res) => {
    const { title, description, deadline, priority, category, estimated_hours, time_type, start_time, end_time, user_id } = req.body;
    try {
        const [rows] = await db.execute(
            'INSERT INTO tasks (title, description, deadline, priority, category, estimated_hours, time_type, start_time, end_time, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
            [title, description, deadline, priority, category, estimated_hours || null, time_type || 'NA', start_time || null, end_time || null, user_id]
        );

        // Auto-refresh timetable on every task change
        await refreshTimetable(user_id);

        res.status(201).json({ id: rows[0].id, message: 'Task created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        // Get user_id first to refresh their timetable
        const [task] = await db.execute('SELECT user_id FROM tasks WHERE id = $1', [id]);

        await db.execute('UPDATE tasks SET status = $1 WHERE id = $2', [status, id]);

        if (task.length > 0) await refreshTimetable(task[0].user_id);

        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const [task] = await db.execute('SELECT user_id FROM tasks WHERE id = $1', [id]);

        await db.execute('DELETE FROM tasks WHERE id = $1', [id]);

        if (task.length > 0) await refreshTimetable(task[0].user_id);

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
