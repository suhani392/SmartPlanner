import { supabase } from './supabase';

const API_URL = 'http://localhost:5000/api';

export const loginUser = async (credentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
    });

    if (error) return { error: error.message };

    // Sync to our public.users table (ensures user exists if tables were reset)
    try {
        await fetch(`${API_URL}/auth/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: data.user.id,
                email: data.user.email,
                username: data.user.user_metadata?.username || data.user.email.split('@')[0]
            }),
        });
    } catch (e) {
        console.error("Sync error during login:", e);
    }

    return {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username || data.user.email.split('@')[0]
    };
};

export const registerUser = async (userData) => {
    const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
            data: {
                username: userData.username,
            }
        }
    });

    if (error) return { error: error.message };

    // Sync to our public.users table (optional but recommended for internal relations)
    try {
        await fetch(`${API_URL}/auth/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: data.user.id,
                email: data.user.email,
                username: userData.username
            }),
        });
    } catch (e) {
        console.error("Sync error:", e);
    }

    return { id: data.user.id, message: 'User registered successfully' };
};

export const fetchTasks = async () => {
    const response = await fetch(`${API_URL}/tasks`);
    return response.json();
};

export const createTask = async (taskData) => {
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    });
    return response.json();
};

export const generateTimetable = async (userId) => {
    const response = await fetch(`${API_URL}/timetable/generate/${userId}`);
    return response.json();
};

export const deleteTask = async (taskId) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
    });
    return response.json();
};
