import fs from 'fs';
import path from 'path';

const files = [];
async function walk(dir){
  for(const e of await fs.promises.readdir(dir,{withFileTypes:true})){
    const p = path.join(dir,e.name);
    if(e.isDirectory()){
      if(['node_modules','dist','.git'].includes(e.name)) continue;
      await walk(p);
    } else if(p.endsWith('.ts')||p.endsWith('.tsx')||p.endsWith('.js')){
      files.push(p);
    }
  }
}
await walk('src');
let fixed=0;
for(const f of files){
  let c = fs.readFileSync(f,'utf8');
  let orig=c;
  // Replace console.log/info/debug not allowed (keep warn/error)
  c = c.replace(/^\s*console\.(log|info|debug)\s*\(.*?\);\s*$/gm, (m)=>{
    // keep line but comment and add precise guard
    return m.replace(/console\.(log|info|debug)/, '// console.$1');
  });
  // Also handle if (import.meta.env.DEV) console.log -> keep but ensure allowed
  if(c!==orig){ fs.writeFileSync(f,c); fixed++; }
}
console.log(`fixed console in ${fixed} files`);
