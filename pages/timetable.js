import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TimetableGrid from '../components/TimetableGrid';
import { generateTimetable } from '../utils/api';

export default function Timetable() {
    const [timetableData, setTimetableData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTimetable = async () => {
            try {
                const userId = sessionStorage.getItem('userId');
                if (!userId) {
                    console.error("No userId found in session");
                    setLoading(false);
                    return;
                }
                const result = await generateTimetable(userId);
                setTimetableData(result.slots || []);
            } catch (err) {
                console.error("Failed to load timetable", err);
            } finally {
                setLoading(false);
            }
        };

        loadTimetable();
    }, []);

    return (
        <div>
            <Navbar />
            <main className="container">
                <h1>Weekly Planner</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Automatically generated based on your task categories and deadlines.
                </p>

                {loading ? <p>Generating your planner...</p> : <TimetableGrid data={timetableData} />}
            </main>
        </div>
    );
}
