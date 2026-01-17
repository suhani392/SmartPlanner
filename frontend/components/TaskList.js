export default function TaskList({ tasks }) {
    // Defensive check to ensure tasks is always an array
    const taskArray = Array.isArray(tasks) ? tasks : [];

    return (
        <div className="task-list">
            {taskArray.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No tasks found. Add a task to get started!
                </p>
            ) : (
                taskArray.map(task => (
                    <div key={task.id} className="card" style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>{task.title}</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.7rem',
                                    background: '#f1f5f9',
                                    color: '#475569'
                                }}>
                                    {task.category}
                                </span>
                                <span className={`badge ${task.priority.toLowerCase()}`}
                                    style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        background: task.priority === 'High' ? '#fee2e2' : task.priority === 'Medium' ? '#fef3c7' : '#dcfce7',
                                        color: task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f59e0b' : '#10b981'
                                    }}>
                                    {task.priority}
                                </span>
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-muted)', margin: '10px 0' }}>{task.description}</p>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()} |
                            <strong> Est. Hours:</strong> {task.estimated_hours}h
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
