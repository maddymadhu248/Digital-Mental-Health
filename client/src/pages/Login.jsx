import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const api = axios.create({ baseURL: '/api' });

const Login = ({ setUser, darkMode }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className={`flex min-h-[85vh] items-center justify-center px-4 py-8 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`w-full max-w-md rounded-[32px] p-8 shadow-2xl ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <h2 className="text-3xl font-semibold">Welcome back</h2>
        <p className="mt-2 text-sm opacity-80">Sign in to continue your wellness journey.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`w-full rounded-2xl border px-4 py-3 outline-none ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`} />
          <input type="password" required minLength="6" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={`w-full rounded-2xl border px-4 py-3 outline-none ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-[#1E88E5] to-[#43A047] py-3 font-medium text-white shadow-[0_0_20px_rgba(30,136,229,0.2)]">Login</button>
        </form>
        <p className="mt-4 text-sm">No account yet? <Link to="/signup" className="font-semibold text-[#1E88E5]">Create one</Link></p>
      </motion.div>
    </div>
  );
};

export default Login;
