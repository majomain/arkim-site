import * as esbuild from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');

const jsxEntries = [
  'arkim-nav.jsx',
  'arkim-footer.jsx',
  'pages/home-sections.jsx',
  'pages/home-app.jsx',
  'pages/product.jsx',
  'pages/about.jsx',
  'pages/resources.jsx',
  'pages/contactus.jsx',
];

const cssFiles = [
  'arkim-type.css',
  'arkim-theme.css',
  'arkim-hero.css',
  'arkim-downtime-animation.css',
  'arkim-nav.css',
  'arkim-footer.css',
];

const jsxBuildOptions = {
  bundle: false,
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  minify: true,
  legalComments: 'none',
  logLevel: 'info',
};

await mkdir(dist, { recursive: true });

await Promise.all(
  jsxEntries.map((entry) => {
    const name = basename(entry, '.jsx');
    return esbuild.build({
      ...jsxBuildOptions,
      entryPoints: [join(root, entry)],
      outfile: join(dist, `${name}.js`),
    });
  })
);

await Promise.all(
  cssFiles.map(async (file) => {
    const src = join(root, file);
    const out = join(dist, file);
    const css = await readFile(src, 'utf8');
    const result = await esbuild.transform(css, {
      loader: 'css',
      minify: true,
    });
    await writeFile(out, result.code);
  })
);

console.log('Built JS → dist/*.js, CSS → dist/*.css');
