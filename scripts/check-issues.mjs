import fs from 'fs';

const list = JSON.parse(fs.readFileSync('d:/android-projeler/wages-calculations-adsense/scripts/audit-results.json', 'utf-8'));
const issues = [];

list.forEach(item => {
  const errs = [];
  if (item.titleLen < 30 || item.titleLen > 85) errs.push(`titleLen: ${item.titleLen}`);
  if (item.descLen < 110 || item.descLen > 195) errs.push(`descLen: ${item.descLen}`);
  if (item.words < 900) errs.push(`words: ${item.words}`);
  if (item.h2Count < 4) errs.push(`h2Count: ${item.h2Count}`);
  if (item.tables === 0) errs.push(`no tables`);
  if (item.internalLinks < 3) errs.push(`internalLinks: ${item.internalLinks}`);
  if (item.mentions2026 === 0) errs.push(`mentions2026: 0`);
  if (errs.length > 0) {
    issues.push({ file: item.file, errs, title: item.title });
  }
});

console.log('TOTAL_FILES:', list.length);
console.log('ISSUES_COUNT:', issues.length);
console.log('ISSUES_DETAILS:', JSON.stringify(issues, null, 2));
