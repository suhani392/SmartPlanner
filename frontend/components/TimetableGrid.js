export default function TimetableGrid({ data }) {
    if (!data || data.length === 0) return <p>No timetable data available. Add some tasks first!</p>;

    const getPriorityClass = (task) => {
        if (typeof task === 'string') return ''; // Fallback for old data
        const p = task.priority?.toLowerCase();
        if (p === 'high') return 'priority-high';
        if (p === 'medium') return 'priority-medium';
        if (p === 'low') return 'priority-low';
        return '';
    };

    const renderTask = (task) => {
        const title = typeof task === 'string' ? task : task.title;
        return `• ${title}`;
    };

    return (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead style={{ background: '#f1f5f9', borderBottom: '2px solid var(--border)' }}>
                    <tr>
                        <th style={{ padding: '1rem', textAlign: 'left', borderRight: '1px solid var(--border)' }}>Day & Date</th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderRight: '1px solid var(--border)' }}>Deadlines</th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderRight: '1px solid var(--border)' }}>Exams</th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderRight: '1px solid var(--border)' }}>Internship Tasks</th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderRight: '1px solid var(--border)' }}>Project Tasks</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>College Tasks</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((day, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '1rem', fontWeight: 'bold', background: '#f8fafc', borderRight: '1px solid var(--border)' }}>
                                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </td>
                            <td style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>
                                {day.Deadline.map((t, i) => <div key={i} className={`task-item ${getPriorityClass(t)}`}>{renderTask(t)}</div>)}
                            </td>
                            <td style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>
                                {day.Exam.map((t, i) => <div key={i} className={`task-item ${getPriorityClass(t)}`}>{renderTask(t)}</div>)}
                            </td>
                            <td style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>
                                {day.Internship.map((t, i) => <div key={i} className={`task-item ${getPriorityClass(t)}`}>{renderTask(t)}</div>)}
                            </td>
                            <td style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>
                                {day.Project.map((t, i) => <div key={i} className={`task-item ${getPriorityClass(t)}`}>{renderTask(t)}</div>)}
                            </td>
                            <td style={{ padding: '1rem' }}>
                                {day.College.map((t, i) => <div key={i} className={`task-item ${getPriorityClass(t)}`}>{renderTask(t)}</div>)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <style jsx>{`
        .task-item {
          font-size: 0.85rem;
          margin-bottom: 4px;
          padding: 2px 8px;
          border-radius: 4px;
          background: #f3f4f6;
          color: #374151;
        }
        .priority-high { background: #fee2e2; color: #b91c1c; border-left: 4px solid #ef4444; }
        .priority-medium { background: #fef3c7; color: #92400e; border-left: 4px solid #f59e0b; }
        .priority-low { background: #dcfce7; color: #15803d; border-left: 4px solid #10b981; }
      `}</style>
        </div>
    );
}
