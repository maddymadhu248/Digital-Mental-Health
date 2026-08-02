import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import * as THREE from 'three';
import { HeartHandshake, MessageCircle, BookOpen, ShieldAlert, Smile, Frown, Meh } from 'lucide-react';
import axios from 'axios';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({ baseURL: API_BASE_URL });

const moodOptions = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'calm', emoji: '😌', label: 'Calm' },
  { value: 'stressed', emoji: '😟', label: 'Stressed' },
  { value: 'low', emoji: '😔', label: 'Low' }
];

const questions = [
  'I feel overwhelmed by academic pressure.',
  'I have difficulty relaxing or sleeping.',
  'I feel anxious in social or study situations.'
];

const Dashboard = ({ user, darkMode }) => {
  const [mood, setMood] = useState('calm');
  const [note, setNote] = useState('');
  const [history, setHistory] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState(Array(questions.length).fill(0));
  const [message, setMessage] = useState('');
  const mountRef = useRef(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    api.get('/support/profile', { headers: { Authorization: `Bearer ${token}` } }).then((res) => setHistory(res.data.moodHistory || []));
  }, [token]);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(280, 220);
    mountRef.current?.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x1e88e5, emissive: 0x0f4c81, metalness: 0.3, roughness: 0.2 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0.5, 0);
    scene.add(cube);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 24, 24), new THREE.MeshStandardMaterial({ color: 0x43a047, emissive: 0x1b5e20, wireframe: false }));
    sphere.position.set(-1.4, -0.3, 0);
    scene.add(sphere);

    const light = new THREE.PointLight(0xffffff, 22, 50);
    light.position.set(2, 2, 4);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0x9ed9ff, 1.4);
    scene.add(ambient);

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      sphere.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  const handleSaveMood = async () => {
    try {
      const res = await api.post('/support/mood', { mood, note }, { headers: { Authorization: `Bearer ${token}` } });
      setHistory(res.data.moodHistory);
      setMessage('Mood saved. Thank you for checking in with yourself.');
    } catch {
      setMessage('Could not save mood right now.');
    }
  };

  const handleAssessment = async () => {
    const score = answers.reduce((total, value) => total + value, 0);
    let level = 'Low';
    if (score >= 6) level = 'High';
    else if (score >= 3) level = 'Moderate';

    setAssessment({ score, level });
    try {
      await api.post('/support/assessment', { score, level, answers }, { headers: { Authorization: `Bearer ${token}` } });
    } catch {
      // ignore
    }
  };

  const chartData = useMemo(() => ({
    labels: history.slice(-6).map((entry, index) => `Day ${index + 1}`),
    datasets: [{
      label: 'Mood trend',
      data: history.slice(-6).map((entry) => ({ calm: 4, happy: 5, stressed: 2, low: 1 }[entry.mood] || 3)),
      borderColor: '#1E88E5',
      backgroundColor: '#E3F2FD',
      tension: 0.4
    }]
  }), [history]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="rounded-[32px] border border-white/40 bg-white/70 p-6 shadow-[0_10px_30px_rgba(30,136,229,0.12)] backdrop-blur-xl">
        <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1E88E5]">Student wellness portal</p>
            <h1 className="mt-3 text-4xl font-semibold text-[#0f172a] sm:text-5xl">Welcome back, {user?.name || 'student'}.</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">Your calm, supportive space for reflection, self-care, and guidance.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/chat" className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1E88E5] to-[#43A047] px-4 py-2 text-white shadow-[0_0_20px_rgba(30,136,229,0.2)]"><MessageCircle className="h-4 w-4" /> AI Chat</Link>
              <Link to="/resources" className="flex items-center gap-2 rounded-full border border-[#1E88E5]/20 bg-[#E3F2FD] px-4 py-2 text-[#1E88E5]"><BookOpen className="h-4 w-4" /> Resources</Link>
              <Link to="/emergency" className="flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-50 px-4 py-2 text-rose-700"><ShieldAlert className="h-4 w-4" /> Emergency</Link>
            </div>
          </div>
          <div className="rounded-[28px] border border-[#1E88E5]/20 bg-[#F5F5F5] p-4">
            <div ref={mountRef} className="mx-auto flex h-[220px] items-center justify-center" />
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-cyan-200">
              <HeartHandshake className="h-4 w-4" /> Supportive 3D classroom companion
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,0.95fr]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/40 bg-white/80 p-6 shadow-[0_10px_30px_rgba(30,136,229,0.1)] backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-slate-800">Daily Mood Tracker</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {moodOptions.map((option) => (
              <button key={option.value} onClick={() => setMood(option.value)} className={`rounded-2xl border px-4 py-3 transition ${mood === option.value ? 'border-[#1E88E5] bg-[#E3F2FD] text-[#1E88E5] shadow-[0_0_16px_rgba(30,136,229,0.14)]' : 'border-slate-200 bg-white text-slate-600'}`}>
                <span className="mr-2 text-lg">{option.emoji}</span>{option.label}
              </button>
            ))}
          </div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Write a quick note about your day" className="mt-4 w-full rounded-2xl border border-[#1E88E5]/20 bg-white px-4 py-3 text-slate-700 outline-none" />
          <button onClick={handleSaveMood} className="mt-4 rounded-2xl bg-gradient-to-r from-[#1E88E5] to-[#43A047] px-4 py-2 font-medium text-white">Save mood</button>
          {message && <p className="mt-3 text-sm text-[#1E88E5]">{message}</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/40 bg-white/80 p-6 shadow-[0_10px_30px_rgba(30,136,229,0.1)] backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-slate-800">Mood History</h2>
          <div className="mt-4 h-[220px]">
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#334155' } } }, scales: { x: { ticks: { color: '#334155' } }, y: { ticks: { color: '#334155' } } } }} />
          </div>
        </motion.div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,0.95fr]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/40 bg-white/80 p-6 shadow-[0_10px_30px_rgba(30,136,229,0.1)] backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-slate-800">Self-Assessment</h2>
          <div className="mt-4 space-y-4">
            {questions.map((question, index) => (
              <div key={question}>
                <p className="text-sm text-slate-600">{question}</p>
                <select value={answers[index]} onChange={(e) => {
                  const copy = [...answers];
                  copy[index] = Number(e.target.value);
                  setAnswers(copy);
                }} className="mt-2 w-full rounded-2xl border border-[#1E88E5]/20 bg-white px-3 py-2 text-slate-700 outline-none">
                  <option value={0}>Not at all</option>
                  <option value={1}>Sometimes</option>
                  <option value={2}>Often</option>
                </select>
              </div>
            ))}
          </div>
          <button onClick={handleAssessment} className="mt-5 rounded-2xl bg-gradient-to-r from-[#1E88E5] to-[#43A047] px-4 py-2 font-medium text-white">Check result</button>
          {assessment && <div className="mt-4 rounded-2xl border border-[#1E88E5]/20 bg-[#E3F2FD] p-4 text-[#1E88E5]"><strong>Result:</strong> {assessment.level} risk (score {assessment.score})</div>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/40 bg-white/80 p-6 shadow-[0_10px_30px_rgba(30,136,229,0.1)] backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-slate-800">Quick support</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-[#1E88E5]/20 bg-[#E3F2FD] p-4 text-slate-700">Take a 5-minute break and drink some water.</div>
            <div className="rounded-2xl border border-[#43A047]/20 bg-[#E8F5E9] p-4 text-slate-700">Try one calming breath: inhale 4, exhale 6.</div>
            <div className="rounded-2xl border border-slate-200 bg-[#F5F5F5] p-4 text-slate-700">You are not alone—your campus supports you.</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
