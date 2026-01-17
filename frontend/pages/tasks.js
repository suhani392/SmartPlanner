import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { fetchTasks, createTask } from '../utils/api';

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await fetchTasks();
            if (Array.isArray(data)) {
                setTasks(data);
            } else {
                setTasks([]);
            }
        } catch (err) {
            console.error("Failed to fetch tasks", err);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (newTask) => {
        try {
            const user_id = localStorage.getItem('userId') || 1;
            const response = await createTask({ ...newTask, user_id });

            if (response && response.message) {
                loadTasks(); // Refresh list on success
            } else {
                alert("Server responded with an error: " + (response.error || "Unknown error"));
            }
        } catch (err) {
            alert("Error adding task. Check backend connection.");
        }
    };

    return (
        <div>
            <Navbar />
            <main className="container">
                <h1>Task Management</h1>
                <div className="grid">
                    <div>
                        <h2>Active Tasks</h2>
                        {loading ? <p>Loading...</p> : <TaskList tasks={tasks} />}
                    </div>
                    <div>
                        <h2>Add New Task</h2>
                        <TaskForm onAdd={handleAddTask} />
                    </div>
                </div>
            </main>
        </div>
    );
}
