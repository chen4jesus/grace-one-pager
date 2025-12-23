#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');
const isWindows = process.platform === 'win32';

// Simple port resolution logic
const port = process.env.PORT || 3000;

// Universal detection: Check common build output directories
// We look for 'index.html' as a strong signal of a build output
const candidates = ['dist', 'build', 'out', 'public'];
let serveTarget = '.';

// 1. Try to find a folder with index.html
for (const dir of candidates) {
  const fullPath = path.join(projectRoot, dir);
  if (fs.existsSync(fullPath) && fs.existsSync(path.join(fullPath, 'index.html'))) {
    serveTarget = dir;
    break;
  }
}

// 2. Fallback: If still root, but 'public' exists (even without index.html), prefer public
// This handles cases where index.html might be missing but assets are in public
if (serveTarget === '.' && fs.existsSync(path.join(projectRoot, 'public'))) {
    serveTarget = 'public';
}

console.debug(`🚀 Starting static file server on port ${port}`);
console.debug(`📂 Serving directory: ${serveTarget}`);

const child = spawn(
  'npx',
  ['serve', '-s', serveTarget, '-p', String(port)],
  {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: isWindows,
    env: {
      ...process.env,
      PORT: String(port)
    },
  }
);

child.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
    process.exit(code || 1);
  }
});
