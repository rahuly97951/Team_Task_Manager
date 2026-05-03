import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [err, setErr] = useState('');

  const load = () => api.get('/projects').then((r) => setProjects(r.data));

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await api.post('/projects', { name, description });
      setName(''); setDescription('');
      load();
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="container">
      <h1>My Projects</h1>
      <div className="card">
        <h3>Create New Project</h3>
        <form onSubmit={create}>
          <input className="input" placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} required />
          <textarea className="input" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
          {err && <div className="error">{err}</div>}
          <button className="btn" type="submit">Create</button>
        </form>
      </div>

      {projects.length === 0 ? (
        <p>No projects yet. Create one above.</p>
      ) : (
        projects.map((p) => (
          <div key={p._id} className="card">
            <h3><Link to={`/projects/${p._id}`}>{p.name}</Link></h3>
            <p style={{ color: '#6b7280' }}>{p.description || 'No description'}</p>
            <small>Created by {p.createdBy?.name} · {p.members.length} member(s)</small>
          </div>
        ))
      )}
    </div>
  );
}
