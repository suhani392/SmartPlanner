import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import { fetchTasks, generateTimetable } from '../utils/api';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('User');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.email) setUserName(user.email.split('@')[0]);

        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const data = await fetchTasks();
            // Ensure data is an array before calling slice
            if (Array.isArray(data)) {
                setTasks(data.slice(0, 5));
            } else {
                setTasks([]);
            }
        } catch (err) {
            console.error("Dashboard error:", err);
            setTasks([]);
        } finally {
            setLoading(false);
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
                        {loading ? <p>Loading...</p> : <TaskList tasks={tasks} />}
                    </section>

                    <section className="card" style={{ height: 'fit-content' }}>
                        <h2>Today's Summary</h2>
                        <div style={{ marginBottom: '1rem' }}>
                            <p><strong>Total Pending:</strong> {tasks.length}</p>
                            <p><strong>High Priority:</strong> {tasks.filter(t => t.priority === 'High').length}</p>
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
