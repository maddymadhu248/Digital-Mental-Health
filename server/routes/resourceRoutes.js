import express from 'express';

const router = express.Router();

const resources = [
  {
    id: 1,
    title: 'Managing Exam Stress',
    type: 'article',
    category: 'stress',
    summary: 'Practical techniques to stay grounded during high-pressure study periods.'
  },
  {
    id: 2,
    title: 'Anxiety Relief Basics',
    type: 'article',
    category: 'anxiety',
    summary: 'Simple exercises that support calm and better focus.'
  },
  {
    id: 3,
    title: 'Understanding Depression',
    type: 'article',
    category: 'depression',
    summary: 'Helpful ideas to recognize changes and seek support early.'
  },
  {
    id: 4,
    title: 'Mindful Breathing Video',
    type: 'video',
    category: 'stress',
    summary: 'A guided breathing exercise for immediate balance.'
  }
];

router.get('/', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  const filtered = resources.filter((item) => item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));
  res.json(filtered);
});

export default router;
