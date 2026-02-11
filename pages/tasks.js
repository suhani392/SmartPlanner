import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { fetchTasks, createTask, deleteTask } from '../utils/api';

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            const data = await fetchTasks(userId);
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
            const user_id = sessionStorage.getItem('userId') || 1;
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

    const handleDeleteTask = async (taskId) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        try {
            const response = await deleteTask(taskId);
            if (response && response.message) {
                loadTasks(); // Refresh list on success
            } else {
                alert("Error deleting task: " + (response.error || "Unknown error"));
            }
        } catch (err) {
            alert("Error deleting task. Check backend connection.");
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
                        {loading ? <p>Loading...</p> : <TaskList tasks={tasks} onDelete={handleDeleteTask} />}
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
