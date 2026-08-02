import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({ baseURL: API_BASE_URL });

const Signup = ({ setUser, darkMode }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className={`flex min-h-[85vh] items-center justify-center px-4 py-8 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`w-full max-w-md rounded-[32px] p-8 shadow-2xl ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <h2 className="text-3xl font-semibold">Create account</h2>
        <p className="mt-2 text-sm opacity-80">Join the supportive student wellness community.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input type="text" required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`w-full rounded-2xl border px-4 py-3 outline-none ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`} />
          <input type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`w-full rounded-2xl border px-4 py-3 outline-none ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`} />
          <input type="password" required minLength="6" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={`w-full rounded-2xl border px-4 py-3 outline-none ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-[#1E88E5] to-[#43A047] py-3 font-medium text-white shadow-[0_0_20px_rgba(30,136,229,0.2)]">Sign up</button>
        </form>
        <p className="mt-4 text-sm">Already have an account? <Link to="/login" className="font-semibold text-[#1E88E5]">Login</Link></p>
      </motion.div>
    </div>
  );
};

export default Signup;
