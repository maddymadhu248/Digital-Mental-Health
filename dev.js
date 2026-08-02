import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const runProcess = (name, command, args, cwd) => {
  const child = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, PATH: `${process.env.PATH};C:\\Windows\\System32;C:\\Windows\\System32\\WindowsPowerShell\\v1.0` }
  });

  child.on('error', (err) => {
    console.error(`[${name}] Failed to start:`, err);
  });

  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.log(`[${name}] Exited with code ${code}`);
    }
  });

  return child;
};

console.log('🚀 Launching Mental Health App (Server + Client)...\n');

const serverProc = runProcess('Server', 'npm', ['run', 'dev'], path.join(__dirname, 'server'));
const clientProc = runProcess('Client', 'npm', ['run', 'dev'], path.join(__dirname, 'client'));

const cleanup = () => {
  console.log('\nShutting down dev servers...');
  serverProc.kill();
  clientProc.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
