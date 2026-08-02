import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';

const globalStore = globalThis.__mentalHealthStore ??= { users: [] };
let memoryStoreMode = false;

export const setMemoryStoreMode = (value) => {
  memoryStoreMode = value;
};

export const shouldUseMemoryStore = () => memoryStoreMode || mongoose.connection.readyState !== 1;

export const getMemoryStore = () => globalStore;

export const createMemoryUser = ({ name, email, password }) => {
  const user = {
    _id: randomUUID(),
    name,
    email,
    password,
    role: 'student',
    moodHistory: [],
    assessments: [],
    createdAt: new Date()
  };
  globalStore.users.push(user);
  return user;
};

export const findMemoryUserByEmail = (email) =>
  globalStore.users.find((user) => user.email === email);

export const findMemoryUserById = (id) => globalStore.users.find((user) => user._id === id);

export const updateMemoryUser = (id, updater) => {
  const index = globalStore.users.findIndex((user) => user._id === id);
  if (index === -1) return null;

  const current = globalStore.users[index];
  const updated = updater(current);
  globalStore.users[index] = updated;
  return updated;
};

export const serializeMemoryUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  moodHistory: user.moodHistory,
  assessments: user.assessments,
  createdAt: user.createdAt
});
