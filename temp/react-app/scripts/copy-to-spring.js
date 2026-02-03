const fs = require('fs');
const path = require('path');

const srcDist = path.resolve(__dirname, '..', 'dist');
const targetStatic = path.resolve(__dirname, '..', 'app-api', 'src', 'main', 'resources', 'static');

async function exists(p) {
  try { await fs.promises.access(p); return true; } catch { return false; }
}

async function rmrf(p) {
  await fs.promises.rm(p, { recursive: true, force: true });
}

async function copyDir(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const e of entries) {
    const srcPath = path.join(src, e.name);
    const destPath = path.join(dest, e.name);
    if (e.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (e.isFile()) {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

(async () => {
  // If `dist` exists, copy from it. Otherwise, check whether Vite already wrote to the Spring static folder.
  if (await exists(srcDist)) {
    console.log(`Found dist at ${srcDist} — copying to Spring static folder.`);
    await rmrf(targetStatic);
    await copyDir(srcDist, targetStatic);
    console.log('Copy complete.');
    process.exit(0);
  }

  // No dist — maybe Vite.outDir is already configured to the Spring static folder
  if (await exists(targetStatic)) {
    console.log(`No dist directory found; detected existing Spring static folder at ${targetStatic}. Assuming build wrote directly to it.`);
    process.exit(0);
  }

  console.warn('Neither `dist` nor Spring static folder were found. Did the build succeed?');
  process.exit(2);
})();