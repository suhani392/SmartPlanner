import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import { fetchTasks, deleteTask } from '../utils/api';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('User');

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');

        // Use username if available, otherwise use email prefix
        const rawName = user.username || (user.email ? user.email.split('@')[0] : 'User');

        // Capitalize the first letter and handle cases like "suhani.badhe" or "suhani_badhe"
        const displayName = rawName.split(/[\._ ]/)[0]; // Get the first part before dot, underscore or space
        const capitalized = displayName.charAt(0).toUpperCase() + displayName.slice(1).toLowerCase();

        setUserName(capitalized);
        loadDashboardData();
    }, []);

    const [allTasks, setAllTasks] = useState([]);


    const loadDashboardData = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            const data = await fetchTasks(userId);
            if (Array.isArray(data)) {
                setAllTasks(data);

                // Sort tasks by date and time
                const sorted = [...data].sort((a, b) => {
                    const dateA = new Date(a.deadline);
                    const dateB = new Date(b.deadline);
                    if (dateA - dateB !== 0) return dateA - dateB;

                    // If same day, sort by start_time
                    const timeA = a.start_time || '23:59';
                    const timeB = b.start_time || '23:59';
                    return timeA.localeCompare(timeB);
                });

                setTasks(sorted.slice(0, 5));
            } else {
                setAllTasks([]);
                setTasks([]);
            }
        } catch (err) {
            console.error("Dashboard error:", err);
            setAllTasks([]);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        try {
            const response = await deleteTask(taskId);
            if (response && response.message) {
                loadDashboardData(); // Refresh list on success
            } else {
                alert("Error deleting task: " + (response.error || "Unknown error"));
            }
        } catch (err) {
            console.error("Delete task error:", err);
            alert("Error deleting task.");
        }
    };

    return (
        <div>
            <Navbar />
            <main className="container">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1>Welcome, {userName}!</h1>
                    <button className="btn" onClick={() => window.location.href = '/tasks'}>+ New Task</button>
                </header>

                <div className="grid">
                    <section>
                        <h2>Upcoming Tasks</h2>
                        {loading ? <p>Loading...</p> : <TaskList tasks={tasks} onDelete={handleDeleteTask} />}
                    </section>

                    <section className="card" style={{ height: 'fit-content' }}>
                        <h2>Planner's Summary</h2>
                        <div style={{ marginBottom: '1rem' }}>
                            <p><strong>Total Tasks:</strong> {allTasks.length}</p>
                            <p><strong>High Priority:</strong> {allTasks.filter(t => t.priority === 'High').length}</p>
                        </div>
                        <button
                            className="btn"
                            style={{ width: '100%', marginTop: '1rem' }}
                            onClick={() => window.location.href = '/timetable'}
                        >
                            View Full Planner
                        </button>
                    </section>
                </div>
            </main>
        </div>
    );
}
