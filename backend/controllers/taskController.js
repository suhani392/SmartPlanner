const db = require('../config/db');
const { generateTimetable } = require('../services/timetableService');

// Helper to update global timetable
const refreshTimetable = async (userId) => {
    try {
        const [tasks] = await db.execute('SELECT * FROM tasks WHERE user_id = ? AND status != "Completed"', [userId]);
        const groupedData = generateTimetable(tasks);
        const jsonData = JSON.stringify(groupedData);

        const [existing] = await db.execute('SELECT id FROM generated_plans WHERE user_id = ?', [userId]);
        if (existing.length > 0) {
            await db.execute('UPDATE generated_plans SET plan_data = ? WHERE user_id = ?', [jsonData, userId]);
        } else {
            await db.execute('INSERT INTO generated_plans (user_id, plan_data) VALUES (?, ?)', [userId, jsonData]);
        }
    } catch (e) {
        console.error("Timetable Refresh Error:", e);
    }
};

exports.getAllTasks = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM tasks');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createTask = async (req, res) => {
    const { title, description, deadline, priority, category, estimated_hours, user_id } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO tasks (title, description, deadline, priority, category, estimated_hours, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, deadline, priority, category, estimated_hours, user_id]
        );

        // Auto-refresh timetable on every task change
        await refreshTimetable(user_id);

        res.status(201).json({ id: result.insertId, message: 'Task created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        // Get user_id first to refresh their timetable
        const [task] = await db.execute('SELECT user_id FROM tasks WHERE id = ?', [id]);

        await db.execute('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);

        if (task.length > 0) await refreshTimetable(task[0].user_id);

        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const [task] = await db.execute('SELECT user_id FROM tasks WHERE id = ?', [id]);

        await db.execute('DELETE FROM tasks WHERE id = ?', [id]);

        if (task.length > 0) await refreshTimetable(task[0].user_id);

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
