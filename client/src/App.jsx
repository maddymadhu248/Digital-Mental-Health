import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Brain, Moon, Sun, MessageCircle, BookOpen, ShieldAlert, UserCircle, Sparkles } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ClassroomScene from './components/ClassroomScene';

const api = axios.create({ baseURL: '/api' });

const AppShell = ({ children, user, setUser, darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-slate-100">
      <ClassroomScene />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(227,242,253,0.68),rgba(232,245,233,0.58))] backdrop-blur-[2px]" />
      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(30,136,229,0.08)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-lg font-semibold tracking-wide text-[#0f172a]">
            <Brain className="h-6 w-6 text-[#1E88E5]" />
            Calm Classroom Wellness
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="rounded-full border border-[#1E88E5]/20 bg-white/70 p-2 text-[#1E88E5] transition hover:shadow-[0_0_16px_rgba(30,136,229,0.18)]">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {user && (
              <button onClick={logout} className="rounded-full bg-gradient-to-r from-[#1E88E5] to-[#43A047] px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(30,136,229,0.2)]">
                Logout
              </button>
            )}
          </div>
        </div>
      </header>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/support/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-lg text-[#1E88E5]">Preparing your calm learning space...</div>;
  }

  return (
    <AppShell user={user} setUser={setUser} darkMode={darkMode} setDarkMode={setDarkMode}>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<Login setUser={setUser} darkMode={darkMode} />} />
        <Route path="/signup" element={<Signup setUser={setUser} darkMode={darkMode} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} darkMode={darkMode} /> : <Navigate to="/login" replace />} />
        <Route path="/chat" element={user ? <ChatPage darkMode={darkMode} /> : <Navigate to="/login" replace />} />
        <Route path="/resources" element={user ? <ResourcesPage darkMode={darkMode} /> : <Navigate to="/login" replace />} />
        <Route path="/emergency" element={user ? <EmergencyPage darkMode={darkMode} /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={user ? <ProfilePage user={user} darkMode={darkMode} /> : <Navigate to="/login" replace />} />
      </Routes>
    </AppShell>
  );
}

const ChatPage = ({ darkMode }) => {
  const [messages, setMessages] = useState([{ from: 'ai', text: 'I am here with you. What feels most important today?' }]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const sendMessage = async () => {
    if (!draft.trim()) return;
    const newMessages = [...messages, { from: 'user', text: draft }];
    setMessages(newMessages);
    setDraft('');
    setLoading(true);
    try {
      const res = await api.post('/support/ai', { message: draft }, { headers: { Authorization: `Bearer ${token}` } });
      setMessages([...newMessages, { from: 'ai', text: res.data.reply }]);
    } catch {
      setMessages([...newMessages, { from: 'ai', text: 'I am sorry, I could not respond right now. Please try again soon.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/40 bg-white/70 p-6 shadow-[0_10px_30px_rgba(30,136,229,0.12)] backdrop-blur-xl">
        <h2 className="text-2xl font-semibold text-[#0f172a]">AI Support Chat</h2>
        <p className="mt-2 text-sm text-slate-600">A calm and encouraging support space for students.</p>
      </motion.div>
      <div className="rounded-[28px] border border-white/40 bg-white/70 p-4 shadow-[0_10px_30px_rgba(30,136,229,0.12)] backdrop-blur-xl">
        <div className="flex h-[400px] flex-col gap-3 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[80%] rounded-2xl border border-white/40 p-3 ${m.from === 'user' ? 'ml-auto bg-gradient-to-r from-[#1E88E5] to-[#43A047] text-white' : 'bg-[#F5F5F5] text-slate-700'}`}>
              {m.text}
            </div>
          ))}
          {loading && <div className="text-sm text-[#1E88E5]">Thinking...</div>}
        </div>
        <div className="mt-4 flex gap-2">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} className="flex-1 rounded-2xl border border-[#1E88E5]/20 bg-white px-4 py-3 text-slate-700 outline-none" placeholder="Share how you're feeling" />
          <button onClick={sendMessage} className="rounded-2xl bg-gradient-to-r from-[#1E88E5] to-[#43A047] px-4 py-3 font-medium text-white shadow-[0_0_20px_rgba(30,136,229,0.2)]">Send</button>
        </div>
      </div>
    </div>
  );
};

const ResourcesPage = ({ darkMode }) => {
  const [query, setQuery] = useState('');
  const [resources, setResources] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    api.get('/resources?q=' + query, { headers: { Authorization: `Bearer ${token}` } }).then((res) => setResources(res.data));
  }, [query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/40 bg-white/70 p-6 shadow-[0_10px_30px_rgba(30,136,229,0.12)] backdrop-blur-xl">
        <h2 className="text-2xl font-semibold text-[#0f172a]">Resource Library</h2>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search stress, anxiety, depression" className="mt-4 w-full rounded-2xl border border-[#1E88E5]/20 bg-white px-4 py-3 text-slate-700 outline-none" />
      </motion.div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {resources.map((item) => (
          <div key={item.id} className="rounded-[24px] border border-white/40 bg-white/80 p-5 shadow-[0_10px_25px_rgba(30,136,229,0.1)] backdrop-blur-xl transition hover:scale-[1.01] hover:shadow-[0_10px_30px_rgba(30,136,229,0.14)]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">{item.title}</h3>
              <span className="rounded-full bg-[#E3F2FD] px-3 py-1 text-xs font-medium text-[#1E88E5]">{item.type}</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmergencyPage = ({ darkMode }) => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/40 bg-white/70 p-6 shadow-[0_10px_30px_rgba(30,136,229,0.12)] backdrop-blur-xl">
        <h2 className="text-2xl font-semibold text-[#0f172a]">Emergency Support</h2>
        <p className="mt-2 text-sm text-slate-600">If you need immediate help, use these contacts right away.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4">
            <h3 className="font-semibold text-rose-700">Crisis Helpline</h3>
            <p className="mt-2 text-sm text-slate-700">Call 0800-123-4567</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4">
            <h3 className="font-semibold text-[#1E88E5]">Campus Wellness Center</h3>
            <p className="mt-2 text-sm text-slate-700">Visit the student services office</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProfilePage = ({ user, darkMode }) => {
  const [profile, setProfile] = useState(user);
  const token = localStorage.getItem('token');

  useEffect(() => {
    api.get('/support/profile', { headers: { Authorization: `Bearer ${token}` } }).then((res) => setProfile(res.data));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/40 bg-white/70 p-6 shadow-[0_10px_30px_rgba(30,136,229,0.12)] backdrop-blur-xl">
        <h2 className="text-2xl font-semibold text-[#0f172a]">Profile</h2>
        <div className="mt-4 rounded-2xl border border-[#1E88E5]/20 bg-[#F5F5F5] p-4 text-slate-700">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Mood Entries:</strong> {profile.moodHistory?.length || 0}</p>
          <p><strong>Assessments:</strong> {profile.assessments?.length || 0}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default App;
