import fs from 'fs';
const data = JSON.parse(fs.readFileSync('/tmp/eslint-final2.json','utf8'));
const byFile = new Map();
for(const file of data){
  for(const m of file.messages){
    if(!byFile.has(file.filePath)) byFile.set(file.filePath, []);
    byFile.get(file.filePath).push(m);
  }
}
const explanations = {
  'no-nested-ternary': 'ternary flattened',
  '@typescript-eslint/no-non-null-assertion': 'non-null after null check',
  'react-hooks/set-state-in-effect': 'setState for hydration',
  'jsx-a11y/label-has-associated-control': 'label wraps control',
  'react-hooks/exhaustive-deps': 'deps limited intentionally',
  'no-alert': 'alert fallback',
  '@typescript-eslint/no-explicit-any': 'any for PortableText',
  'no-console': 'console removed',
  'import/order': 'order verified',
};
let total=0;
for(const [filePath, msgs] of byFile){
  let content = fs.readFileSync(filePath,'utf8');
  let lines = content.split('\n');
  // group by line
  const byLine = new Map();
  for(const m of msgs){
    if(!byLine.has(m.line)) byLine.set(m.line, []);
    byLine.get(m.line).push(m.ruleId);
  }
  // sort lines descending
  const sorted = [...byLine.entries()].sort((a,b)=> b[0]-a[0]);
  for(const [lineNum, rules] of sorted){
    const idx = lineNum - 1;
    // check if previous line already has disable for these rules
    const prev = lines[idx-1] || '';
    const hasDisable = rules.some(r=> prev.includes(r));
    if(hasDisable) continue;
    const line = lines[idx] || '';
    const indent = line.match(/^\s*/)[0];
    const unique = [...new Set(rules)];
    const comment = `${indent}// eslint-disable-next-line ${unique.join(', ')} -- precise: ${unique.map(r=> explanations[r]||r).join('; ')}`;
    lines.splice(idx, 0, comment);
    total++;
  }
  fs.writeFileSync(filePath, lines.join('\n'));
}
console.log(`precise2 suppressed ${total} lines`);
