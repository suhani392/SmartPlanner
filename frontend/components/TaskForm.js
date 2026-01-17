import { useState } from 'react';

export default function TaskForm({ onAdd }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        priority: 'Medium',
        category: 'College',
        estimated_hours: 1
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData({ title: '', description: '', deadline: '', priority: 'Medium', category: 'College', estimated_hours: 1 });
    };

    return (
        <div className="card">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label>Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label>Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <label>Deadline</label>
                        <input
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            required
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
                        />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <label>Est. Hours</label>
                        <input
                            type="number"
                            value={formData.estimated_hours}
                            onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                            min="1"
                            required
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label>Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
                    >
                        <option>Deadline</option>
                        <option>Exam</option>
                        <option>Internship</option>
                        <option>Project</option>
                        <option>College</option>
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label>Priority</label>
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
                    >
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                </div>
                <button type="submit" className="btn">Add Task</button>
            </form>
        </div>
    );
}
