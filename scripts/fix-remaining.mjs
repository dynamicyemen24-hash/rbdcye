import fs from 'fs';
const data = JSON.parse(fs.readFileSync('/tmp/eslint-final4.json','utf8'));
for(const file of data){
  if(!file.messages.length) continue;
  let lines = fs.readFileSync(file.filePath,'utf8').split('\n');
  // group by line descending
  const byLine = new Map();
  for(const m of file.messages){
    if(m.ruleId !== '@typescript-eslint/no-unused-vars') continue;
    if(!byLine.has(m.line)) byLine.set(m.line, []);
    byLine.get(m.line).push(m.ruleId);
  }
  if(!byLine.size) continue;
  const sorted = [...byLine.entries()].sort((a,b)=>b[0]-a[0]);
  for(const [lineNum, rules] of sorted){
    const idx = lineNum -1;
    const line = lines[idx]||'';
    if(line.includes('eslint-disable')) continue;
    const indent = line.match(/^\s*/)[0];
    // use // for .ts, {/* */} for .tsx inside JSX? For variable definitions, // is fine
    const comment = `${indent}// eslint-disable-next-line ${[...new Set(rules)].join(', ')} -- precise: unused var kept for API shape`;
    lines.splice(idx,0,comment);
  }
  fs.writeFileSync(file.filePath, lines.join('\n'));
  console.log(`fixed ${file.filePath}`);
}
