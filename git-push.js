import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const env = {
  ...process.env,
  PATH: `${process.env.PATH};C:\\Program Files\\Git\\cmd;C:\\Program Files\\Git\\bin;C:\\Windows\\System32;C:\\Windows\\System32\\WindowsPowerShell\\v1.0`
};

const run = (cmd) => {
  console.log(`> ${cmd}`);
  try {
    const output = execSync(cmd, { cwd: __dirname, encoding: 'utf-8', env });
    if (output) console.log(output);
  } catch (err) {
    console.error(`Error executing: ${cmd}`);
    if (err.stdout) console.log(`stdout: ${err.stdout}`);
    if (err.stderr) console.error(`stderr: ${err.stderr}`);
    throw err;
  }
};

try {
  console.log('Staging files...');
  run('git add .');
  
  console.log('Checking status...');
  run('git status');

  console.log('Committing changes...');
  try {
    run('git commit -m "Configure Vercel and Render deployment settings and dynamic API endpoints"');
  } catch (e) {
    console.log('Nothing to commit or commit already recorded.');
  }

  console.log('Pushing to GitHub (origin main)...');
  run('git push origin main');
  
  console.log('🎉 Code successfully pushed to https://github.com/maddymadhu248/Digital-Mental-Health.git');
} catch (err) {
  console.error('Git push script encountered an error.');
}
