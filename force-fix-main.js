import { execSync } from 'node:child_process';
import fs from 'node:fs';
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
    return output;
  } catch (err) {
    console.error(`Execution note: ${err.message}`);
    return null;
  }
};

console.log('1. Aborting any paused rebase...');
run('git rebase --abort');

console.log('2. Switching back to main branch...');
run('git checkout main');

console.log('3. Updating client/package.json dependency...');
const clientPkgPath = path.join(__dirname, 'client', 'package.json');
if (fs.existsSync(clientPkgPath)) {
  const content = fs.readFileSync(clientPkgPath, 'utf-8');
  const pkg = JSON.parse(content);
  pkg.dependencies = pkg.dependencies || {};
  pkg.dependencies['react-chartjs-2'] = '^5.2.0';
  fs.writeFileSync(clientPkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
  console.log('✅ Updated react-chartjs-2 to ^5.2.0 in client/package.json');
} else {
  console.error('client/package.json not found!');
}

console.log('4. Creating .npmrc in client and root...');
fs.writeFileSync(path.join(__dirname, 'client', '.npmrc'), 'legacy-peer-deps=true\n', 'utf-8');
fs.writeFileSync(path.join(__dirname, '.npmrc'), 'legacy-peer-deps=true\n', 'utf-8');

console.log('5. Staging files...');
run('git add client/package.json client/.npmrc .npmrc README.md render.yaml');

console.log('6. Committing changes...');
run('git commit -m "Fix react-chartjs-2 peer dependency to ^5.2.0 for Vercel"');

console.log('7. Pushing to origin main...');
run('git push origin main');

console.log('🎉 Done! Check your Vercel build output now.');
