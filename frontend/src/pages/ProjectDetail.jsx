import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const STATUSES = ['To Do', 'In Progress', 'Done'];
const PRIORITIES = ['Low', 'Medium', 'High'];

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [role, setRole] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [memberEmail, setMemberEmail] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', dueDate: '', assignedTo: '' });
  const [err, setErr] = useState('');

  const load = async () => {
    const p = await api.get(`/projects/${id}`);
    setProject(p.data.project); setRole(p.data.role);
    const t = await api.get(`/projects/${id}/tasks`);
    setTasks(t.data);
    const s = await api.get(`/dashboard/${id}`);
    setStats(s.data);
  };

  useEffect(() => { load(); }, [id]);

  const addMember = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await api.post(`/projects/${id}/members`, { email: memberEmail });
      setMemberEmail(''); load();
    } catch (e) { setErr(e.response?.data?.message || 'Failed'); }
  };

  const removeMember = async (uid) => {
    if (!confirm('Remove this member?')) return;
    await api.delete(`/projects/${id}/members/${uid}`); load();
  };

  const createTask = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const payload = { ...newTask };
      if (!payload.assignedTo) delete payload.assignedTo;
      if (!payload.dueDate) delete payload.dueDate;
      await api.post(`/projects/${id}/tasks`, payload);
      setNewTask({ title: '', description: '', priority: 'Medium', dueDate: '', assignedTo: '' });
      load();
    } catch (e) { setErr(e.response?.data?.message || 'Failed'); }
  };

  const updateStatus = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}`, { status }); load();
  };

  const deleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    await api.delete(`/tasks/${taskId}`); load();
  };

  if (!project) return <div className="container">Loading...</div>;
  const isAdmin = role === 'Admin';

  return (
    <div className="container">
      <h1>{project.name}</h1>
      <p style={{ color: '#6b7280' }}>{project.description}</p>
      <span className="badge">{role}</span>

      {stats && (
        <>
          <h2 style={{ marginTop: 24 }}>Dashboard</h2>
          <div className="row">
            <div className="stat col"><div className="num">{stats.total}</div><div>Total Tasks</div></div>
            <div className="stat col"><div className="num">{stats.overdue}</div><div>Overdue</div></div>
            {STATUSES.map((s) => {
              const found = stats.byStatus.find((x) => x._id === s);
              return <div key={s} className="stat col"><div className="num">{found?.count || 0}</div><div>{s}</div></div>;
            })}
          </div>
          {stats.perUser.length > 0 && (
            <div className="card" style={{ marginTop: 16 }}>
              <h3>Tasks per User</h3>
              {stats.perUser.map((u) => (
                <div key={u.userId}>{u.name} ({u.email}): <strong>{u.count}</strong></div>
              ))}
            </div>
          )}
        </>
      )}

      <h2 style={{ marginTop: 24 }}>Members</h2>
      <div className="card">
        {project.members.map((m) => (
          <div key={m.user._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
            <span>{m.user.name} ({m.user.email}) — <em>{m.role}</em></span>
            {isAdmin && m.user._id !== project.createdBy._id && (
              <button className="btn danger" onClick={() => removeMember(m.user._id)}>Remove</button>
            )}
          </div>
        ))}
        {isAdmin && (
          <form onSubmit={addMember} style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <input className="input" placeholder="Add member by email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} style={{ marginBottom: 0 }} />
            <button className="btn" type="submit">Add</button>
          </form>
        )}
      </div>

      <h2 style={{ marginTop: 24 }}>Tasks</h2>
      {isAdmin && (
        <div className="card">
          <h3>Create Task</h3>
          <form onSubmit={createTask}>
            <input className="input" placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
            <textarea className="input" placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
            <div className="row">
              <select className="input col" value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
              <input className="input col" type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
              <select className="input col" value={newTask.assignedTo} onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}>
                <option value="">Unassigned</option>
                {project.members.map((m) => <option key={m.user._id} value={m.user._id}>{m.user.name}</option>)}
              </select>
            </div>
            <button className="btn" type="submit">Create Task</button>
          </form>
        </div>
      )}

      {err && <div className="error">{err}</div>}

      {tasks.map((t) => {
        const overdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done';
        const statusClass = t.status === 'Done' ? 'done' : t.status === 'In Progress' ? 'progress' : 'todo';
        return (
          <div key={t._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ marginBottom: 4 }}>{t.title}</h3>
                <p style={{ color: '#6b7280', margin: '4px 0' }}>{t.description}</p>
                <span className={`badge ${statusClass}`}>{t.status}</span>{' '}
                <span className={`badge ${t.priority.toLowerCase()}`}>{t.priority}</span>{' '}
                {t.dueDate && <small style={{ color: overdue ? '#dc2626' : '#6b7280' }}>Due: {new Date(t.dueDate).toLocaleDateString()}{overdue ? ' (overdue)' : ''}</small>}
                <div style={{ marginTop: 8 }}><small>Assigned: {t.assignedTo?.name || 'Unassigned'}</small></div>
              </div>
              <div>
                <select className="input" value={t.status} onChange={(e) => updateStatus(t._id, e.target.value)} style={{ marginBottom: 8 }}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                {isAdmin && <button className="btn danger" onClick={() => deleteTask(t._id)}>Delete</button>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
