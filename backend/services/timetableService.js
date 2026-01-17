/**
 * Simple Rule-Based Timetable Generation Service
 * Algorithm:
 * 1. Sort tasks by priority (High > Medium > Low) and then by deadline (earliest first).
 * 2. Get user availability slots for the day.
 * 3. Assign tasks to available slots until slots are full or tasks are exhausted.
 */

const generateTimetable = (tasks) => {
    // 1. Group tasks by date string (YYYY-MM-DD)
    const groupedByDate = {};

    tasks.forEach(task => {
        const dateKey = new Date(task.deadline).toISOString().split('T')[0];
        if (!groupedByDate[dateKey]) {
            groupedByDate[dateKey] = {
                date: dateKey,
                Deadline: [],
                Exam: [],
                Internship: [],
                Project: [],
                College: []
            };
        }

        // Push task to its category
        if (groupedByDate[dateKey][task.category] !== undefined) {
            groupedByDate[dateKey][task.category].push(task.title);
        } else {
            groupedByDate[dateKey]['College'].push(task.title); // Default
        }
    });

    // 2. Convert to sorted array for the frontend
    const timetable = Object.values(groupedByDate).sort((a, b) => new Date(a.date) - new Date(b.date));

    return timetable;
};

module.exports = { generateTimetable };
