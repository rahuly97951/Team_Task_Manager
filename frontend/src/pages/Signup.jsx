import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await signup(name, email, password);
      navigate('/projects');
    } catch (e) {
      setErr(e.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <form className="form card" onSubmit={submit}>
      <h2>Sign Up</h2>
      <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="input" type="password" placeholder="Password (min 6)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
      {err && <div className="error">{err}</div>}
      <button className="btn" type="submit">Create account</button>
      <p style={{ marginTop: 12 }}>Have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}
