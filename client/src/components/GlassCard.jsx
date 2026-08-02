import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '' }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01, boxShadow: '0 0 24px rgba(0,229,255,0.2)' }}
    transition={{ duration: 0.2 }}
    className={`rounded-[24px] border border-white/10 bg-white/10 backdrop-blur-xl ${className}`}
  >
    {children}
  </motion.div>
);

export default GlassCard;
