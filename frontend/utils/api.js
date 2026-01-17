const API_URL = 'http://localhost:5000/api';

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    return response.json();
};

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return response.json();
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
