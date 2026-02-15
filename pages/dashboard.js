import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import { fetchTasks, deleteTask } from '../utils/api';

export default function Dashboard() {
    const [allTasks, setAllTasks] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [pastTasks, setPastTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('User');

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        const rawName = user.username || (user.email ? user.email.split('@')[0] : 'User');
        const displayName = rawName.split(/[\._ ]/)[0];
        const capitalized = displayName.charAt(0).toUpperCase() + displayName.slice(1).toLowerCase();
        setUserName(capitalized);
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            const data = await fetchTasks(userId);
            if (Array.isArray(data)) {
                setAllTasks(data);

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const sorted = [...data].sort((a, b) => {
                    const dateA = new Date(a.deadline);
                    const dateB = new Date(b.deadline);
                    if (dateA - dateB !== 0) return dateA - dateB;
                    const timeA = a.start_time || '23:59';
                    const timeB = b.start_time || '23:59';
                    return timeA.localeCompare(timeB);
                });

                const upcoming = sorted.filter(t => new Date(t.deadline) >= today);
                const past = sorted.filter(t => new Date(t.deadline) < today).reverse();

                setUpcomingTasks(upcoming.slice(0, 5));
                setPastTasks(past.slice(0, 5));
            } else {
                setAllTasks([]);
                setUpcomingTasks([]);
                setPastTasks([]);
            }
        } catch (err) {
            console.error("Dashboard error:", err);
            setAllTasks([]);
            setUpcomingTasks([]);
            setPastTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            const response = await deleteTask(taskId);
            if (response && response.message) {
                loadDashboardData();
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
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <h2 style={{ marginBottom: '1.5rem' }}>Upcoming Tasks</h2>
                            {loading ? <p>Loading...</p> : <TaskList tasks={upcomingTasks} onDelete={handleDeleteTask} />}
                        </div>

                        {pastTasks.length > 0 && (
                            <div>
                                <h2 style={{ marginBottom: '1.5rem', opacity: 0.7 }}>Past Tasks</h2>
                                <div style={{ opacity: 0.8 }}>
                                    <TaskList tasks={pastTasks} onDelete={handleDeleteTask} />
                                </div>
                            </div>
                        )}
                    </section>

                    <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="card" style={{ height: 'fit-content' }}>
                            <h2 style={{ marginTop: 0 }}>Planner's Summary</h2>
                            <div style={{ marginBottom: '1rem' }}>
                                <p><strong>Total Tasks:</strong> {upcomingTasks.length}</p>
                                <p><strong>High Priority:</strong> {upcomingTasks.filter(t => t.priority === 'High').length}</p>
                            </div>
                            <button
                                className="btn"
                                style={{ width: '100%', marginTop: '1rem' }}
                                onClick={() => window.location.href = '/timetable'}
                            >
                                View Full Planner
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
