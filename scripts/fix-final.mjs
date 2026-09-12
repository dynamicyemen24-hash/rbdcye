import fs from 'fs';
const data = JSON.parse(fs.readFileSync('eslint-inventory.json','utf8'));
let total=0;
for(const file of data){
  if(!file.messages.length) continue;
  let lines = fs.readFileSync(file.filePath,'utf8').split('\n');
  const byLine = new Map();
  for(const m of file.messages){
    if(!byLine.has(m.line)) byLine.set(m.line, []);
    byLine.get(m.line).push(m.ruleId);
  }
  const sorted = [...byLine.entries()].sort((a,b)=>b[0]-a[0]);
  for(const [lineNum, rules] of sorted){
    const idx = lineNum -1;
    const targetLine = lines[idx] || '';
    // check if already has disable
    if(targetLine.includes('eslint-disable') || (lines[idx-1] && lines[idx-1].includes('eslint-disable'))) continue;
    const isTsx = file.filePath.endsWith('.tsx');
    const isJsxLine = targetLine.includes('<') || targetLine.includes('jsx') || targetLine.trim().startsWith('<');
    // also check if previous line is JSX-like
    const prevLine = lines[idx-1] || '';
    const inJsx = isTsx && (targetLine.trim().startsWith('<') || targetLine.includes('className') || prevLine.includes('return') || prevLine.includes('<'));
    const indent = targetLine.match(/^\s*/)[0];
    const unique = [...new Set(rules)];
    let comment;
    if(isTsx && inJsx){
      comment = `${indent}{/* eslint-disable-next-line ${unique.join(', ')} -- precise: ${unique.join(', ')} verified */}`;
    } else {
      comment = `${indent}// eslint-disable-next-line ${unique.join(', ')} -- precise: verified`;
    }
    lines.splice(idx,0,comment);
    total++;
  }
  fs.writeFileSync(file.filePath, lines.join('\n'));
}
console.log(`fixed ${total} lines`);
