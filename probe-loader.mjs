import { pathToFileURL, fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const ROOT = '/Users/tolga/Developer/goldie-boone/';
export async function resolve(spec, ctx, next) {
  if (spec === 'next/image') return { url: pathToFileURL(ROOT + 'probe-img.mjs').href, shortCircuit: true };
  if (spec.startsWith('@/')) {
    for (const ext of ['.ts', '.tsx']) {
      try { return await next(pathToFileURL(ROOT + spec.slice(2) + ext).href, ctx); } catch {}
    }
  }
  return next(spec, ctx);
}
export async function load(url, ctx, next) {
  if (url.endsWith('.tsx') || url.endsWith('.ts')) {
    const src = readFileSync(fileURLToPath(url), 'utf8');
    const out = ts.transpileModule(src, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
      fileName: fileURLToPath(url),
    });
    return { format: 'module', source: out.outputText, shortCircuit: true };
  }
  return next(url, ctx);
}
