export default function TaskList({ tasks, onDelete }) {
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
                    <div key={task.id} className="card" style={{ marginBottom: '1rem', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>{task.title}</h3>
                                <p style={{ color: 'var(--text-muted)', margin: '10px 0' }}>{task.description}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
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
                                <button
                                    onClick={() => onDelete(task.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        transition: 'background 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = '#fee2e2'}
                                    onMouseOut={(e) => e.target.style.background = 'none'}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()} |
                            {task.time_type === 'NA' && <span> No specific time</span>}
                            {task.time_type === 'Estimated' && <span> {task.start_time?.substring(0, 5)} ({task.estimated_hours}h)</span>}
                            {task.time_type === 'Fixed' && <span> {task.start_time?.substring(0, 5)} - {task.end_time?.substring(0, 5)}</span>}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
