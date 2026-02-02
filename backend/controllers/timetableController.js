const db = require('../config/db');
const { generateTimetable } = require('../services/timetableService');

exports.generateUserTimetable = async (req, res) => {
    const { userId } = req.params;
    try {
        // 1. Fetch user tasks
        const [tasks] = await db.execute(
            'SELECT * FROM tasks WHERE user_id = $1 AND status != \'Completed\'',
            [userId]
        );

        // 2. Generate timetable data grouped by day
        const groupedData = generateTimetable(tasks);

        // 3. Save to database (Overwrites previous plan for simplicity)
        // Check if plan exists
        const [existing] = await db.execute('SELECT id FROM generated_plans WHERE user_id = $1', [userId]);

        const jsonData = JSON.stringify(groupedData);

        if (existing.length > 0) {
            await db.execute('UPDATE generated_plans SET plan_data = $1 WHERE user_id = $2', [jsonData, userId]);
        } else {
            await db.execute('INSERT INTO generated_plans (user_id, plan_data) VALUES ($1, $2)', [userId, jsonData]);
        }

        res.json({
            user_id: userId,
            slots: groupedData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
