import { useState } from 'react';

export default function TaskForm({ onAdd }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        priority: 'Medium',
        category: 'College',
        time_type: 'NA', // NA, Estimated, Fixed
        estimated_hours: 1,
        start_time: '',
        end_time: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData({
            title: '', description: '', deadline: '', priority: 'Medium',
            category: 'College', time_type: 'NA', estimated_hours: 1,
            start_time: '', end_time: ''
        });
    };

    return (
        <div className="card">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        placeholder="What needs to be done?"
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Add more details..."
                        rows="3"
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label>Deadline</label>
                        <input
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label>Time Scheduling</label>
                        <select
                            value={formData.time_type}
                            onChange={(e) => setFormData({ ...formData, time_type: e.target.value })}
                        >
                            <option value="NA">Not Applicable</option>
                            <option value="Estimated">Estimated Duration + Start</option>
                            <option value="Fixed">Specific Start & End Time</option>
                        </select>
                    </div>
                </div>

                {formData.time_type !== 'NA' && (
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                        {formData.time_type === 'Estimated' && (
                            <>
                                <div style={{ flex: 1 }}>
                                    <label>Start Time</label>
                                    <input
                                        type="time"
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                        required
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>Duration (Hours)</label>
                                    <input
                                        type="number"
                                        value={formData.estimated_hours}
                                        onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                                        min="1"
                                        required
                                    />
                                </div>
                            </>
                        )}
                        {formData.time_type === 'Fixed' && (
                            <>
                                <div style={{ flex: 1 }}>
                                    <label>Start Time</label>
                                    <input
                                        type="time"
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                        required
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>End Time</label>
                                    <input
                                        type="time"
                                        value={formData.end_time}
                                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                        required
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label>Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option>Deadline</option>
                            <option>Exam</option>
                            <option>Internship</option>
                            <option>Project</option>
                            <option>College</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Priority</label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn" style={{ marginTop: '0.5rem' }}>Add Task</button>
            </form>
        </div>
    );
}
