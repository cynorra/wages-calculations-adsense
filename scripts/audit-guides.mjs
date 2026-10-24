import fs from 'fs';
import path from 'path';

const dir = 'd:/android-projeler/wages-calculations-adsense/src/content/guides';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

const audit = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf-8');
  let title = '', desc = '', tool = '', published = '';

  if (content.startsWith('---')) {
    const end = content.indexOf('\n---', 3);
    const yaml = content.slice(3, end);
    yaml.split('\n').forEach(l => {
      const trimmed = l.trim();
      if (trimmed.startsWith('title:')) title = trimmed.replace('title:', '').trim().replace(/^["']|["']$/g, '');
      if (trimmed.startsWith('description:')) desc = trimmed.replace('description:', '').trim().replace(/^["']|["']$/g, '');
      if (trimmed.startsWith('tool:')) tool = trimmed.replace('tool:', '').trim().replace(/^["']|["']$/g, '');
      if (trimmed.startsWith('published:')) published = trimmed.replace('published:', '').trim().replace(/^["']|["']$/g, '');
    });
  }

  const words = content.split(/\s+/).length;
  const h2Matches = content.match(/^##\s+(.*$)/gm) || [];
  const h3Matches = content.match(/^###\s+(.*$)/gm) || [];
  const tableMatches = content.match(/\| :---/gm) || [];
  const internalLinks = content.match(/\[.*?\]\(\/guides\/[a-z0-9-]+\/?\)/gm) || [];
  const mathMatches = content.match(/\$\$/g) || [];
  const mentions2026 = (content.match(/2026/g) || []).length;
  const mentionsFLSA = (content.match(/FLSA/g) || []).length;
  const mentionsIRS = (content.match(/IRS/g) || []).length;

  audit.push({
    file,
    title,
    titleLen: title.length,
    descLen: desc.length,
    words,
    h2Count: h2Matches.length,
    h3Count: h3Matches.length,
    tables: tableMatches.length,
    internalLinks: internalLinks.length,
    mathEquations: Math.floor(mathMatches.length / 2),
    mentions2026,
    mentionsFLSA,
    mentionsIRS,
    tool
  });
});

fs.writeFileSync('d:/android-projeler/wages-calculations-adsense/scripts/audit-results.json', JSON.stringify(audit, null, 2));
console.log('AUDIT_COMPLETE: Analyzed ' + audit.length + ' guides.');
