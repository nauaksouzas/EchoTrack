import fs from 'fs';
import path from 'path';

function walk(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk('src');
files.forEach(file => {
  if (file.includes('useAuth.tsx') || file.includes('dataService.ts')) return;
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/fetch\((['"`]\/api\/[^'"`]+['"`])(,\s*\{)/g, 'fetch($1, { credentials: "include", ');
  content = content.replace(/fetch\((['"`]\/api\/[^'"`]+['"`])\)/g, 'fetch($1, { credentials: "include" })');
  
  fs.writeFileSync(file, content);
});
console.log('Fixed fetch calls');
