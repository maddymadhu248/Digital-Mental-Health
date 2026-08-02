import User from '../models/User.js';
import { findMemoryUserById, shouldUseMemoryStore, updateMemoryUser } from '../utils/fallbackStore.js';

export const saveMood = async (req, res) => {
  try {
    const { mood, note } = req.body;
    const validMoods = ['happy', 'calm', 'stressed', 'low'];
    if (!validMoods.includes(mood)) {
      return res.status(400).json({ message: 'Please choose a valid mood' });
    }

    if (shouldUseMemoryStore()) {
      const user = findMemoryUserById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const updated = updateMemoryUser(req.user.id, (current) => {
        current.moodHistory.push({ mood, note: String(note || '').trim(), date: new Date() });
        return current;
      });
      return res.json({ message: 'Mood saved', moodHistory: updated.moodHistory });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.moodHistory.push({ mood, note: String(note || '').trim(), date: new Date() });
    await user.save();
    res.json({ message: 'Mood saved', moodHistory: user.moodHistory });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save mood', error: error.message });
  }
};

export const saveAssessment = async (req, res) => {
  try {
    const { score, level, answers } = req.body;
    if (shouldUseMemoryStore()) {
      const user = findMemoryUserById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const updated = updateMemoryUser(req.user.id, (current) => {
        current.assessments.push({ score, level, answers, date: new Date() });
        return current;
      });
      return res.json({ message: 'Assessment saved', assessments: updated.assessments });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (typeof score !== 'number' || !Array.isArray(answers) || !['Low', 'Moderate', 'High'].includes(level)) {
      return res.status(400).json({ message: 'Assessment data is invalid' });
    }

    user.assessments.push({ score, level, answers, date: new Date() });
    await user.save();
    res.json({ message: 'Assessment saved', assessments: user.assessments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save assessment', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    if (shouldUseMemoryStore()) {
      const user = findMemoryUserById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        moodHistory: user.moodHistory,
        assessments: user.assessments,
        createdAt: user.createdAt
      });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load profile', error: error.message });
  }
};

export const aiSupport = async (req, res) => {
  try {
    const { message } = req.body;
    const lower = String(message || '').trim().toLowerCase();
    let reply = 'Thank you for sharing that with me. Take one slow breath and tell me what feels most overwhelming right now.';

    if (lower.includes('stress')) {
      reply = 'Stress can feel heavy, but small steps help. Try a 5-minute walk, a glass of water, and one calming breath.';
    } else if (lower.includes('anxiety')) {
      reply = 'Anxiety often settles when we slow things down. Try grounding with the 5-4-3-2-1 method and keep your focus on the present.';
    } else if (lower.includes('sad')) {
      reply = 'It is okay to feel down. Reach out to someone you trust and consider taking a gentle break from pressure.';
    } else if (lower.includes('panic')) {
      reply = 'Panic can feel intense. Sit down, loosen your shoulders, and breathe in for 4 seconds and out for 6 seconds.';
    }

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: 'AI support failed', error: error.message });
  }
};
