import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const docsDir = path.resolve(rootDir, 'docs');

// 1. Rename dist/index.dev.html to dist/index.html
const devHtmlPath = path.join(distDir, 'index.dev.html');
const indexHtmlPath = path.join(distDir, 'index.html');
const notFoundHtmlPath = path.join(distDir, '404.html');
const noJekyllPath = path.join(distDir, '.nojekyll');

if (fs.existsSync(devHtmlPath)) {
  fs.copyFileSync(devHtmlPath, indexHtmlPath);
  fs.copyFileSync(devHtmlPath, notFoundHtmlPath);
  fs.unlinkSync(devHtmlPath);
}

// Ensure .nojekyll in dist
fs.writeFileSync(noJekyllPath, '');

// 2. Helper to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.git') continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 3. Copy dist into frontend/ (root of main branch)
console.log('Copying dist to frontend root for direct GitHub Pages main-branch serving...');
copyDir(distDir, rootDir);

// 4. Also copy dist into frontend/docs (for docs-folder Pages option)
console.log('Copying dist to frontend/docs for docs-folder serving...');
copyDir(distDir, docsDir);

console.log('Postbuild finished successfully! Both root and docs/ now hold production build.');
