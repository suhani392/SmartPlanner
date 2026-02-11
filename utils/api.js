import { supabase } from '../lib/supabaseClient';

export const loginUser = async (credentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
    });

    if (error) return { error: error.message };

    // Sync to our public.users table (ensures user exists if tables were reset)
    try {
        await fetch('/api/auth/sync', {
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
        await fetch('/api/auth/sync', {
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

export const fetchTasks = async (userId) => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
    return data;
};

export const createTask = async (taskData) => {
    const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select();

    if (error) {
        console.error("Error creating task:", error);
        return { error: error.message };
    }

    // Trigger timetable refresh after task creation
    try {
        await fetch(`/api/timetable/generate?userId=${taskData.user_id}`);
    } catch (e) {
        console.error("Error generating timetable:", e);
    }

    return { id: data[0].id, message: 'Task created successfully' };
};

export const generateTimetable = async (userId) => {
    const response = await fetch(`/api/timetable/generate?userId=${userId}`);
    return response.json();
};

export const deleteTask = async (taskId) => {
    // Get user_id first to refresh timetable
    const { data: task } = await supabase.from('tasks').select('user_id').eq('id', taskId).single();

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

    if (error) {
        console.error("Error deleting task:", error);
        return { error: error.message };
    }

    if (task) {
        try {
            await fetch(`/api/timetable/generate?userId=${task.user_id}`);
        } catch (e) {
            console.error("Error generating timetable:", e);
        }
    }

    return { message: 'Task deleted successfully' };
};
