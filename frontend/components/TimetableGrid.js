export default function TimetableGrid({ data }) {
    if (!data || data.length === 0) return <p>No timetable data available. Add some tasks first!</p>;

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
                                {day.Deadline.map((t, i) => <div key={i} className="task-item deadline">• {t}</div>)}
                            </td>
                            <td style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>
                                {day.Exam.map((t, i) => <div key={i} className="task-item exam">• {t}</div>)}
                            </td>
                            <td style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>
                                {day.Internship.map((t, i) => <div key={i} className="task-item internship">• {t}</div>)}
                            </td>
                            <td style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>
                                {day.Project.map((t, i) => <div key={i} className="task-item project">• {t}</div>)}
                            </td>
                            <td style={{ padding: '1rem' }}>
                                {day.College.map((t, i) => <div key={i} className="task-item college">• {t}</div>)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <style jsx>{`
        .task-item {
          font-size: 0.85rem;
          margin-bottom: 4px;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .deadline { background: #fee2e2; color: #b91c1c; }
        .exam { background: #fef3c7; color: #92400e; }
        .internship { background: #dcfce7; color: #15803d; }
        .project { background: #e0e7ff; color: #4338ca; }
        .college { background: #f3f4f6; color: #374151; }
      `}</style>
        </div>
    );
}
