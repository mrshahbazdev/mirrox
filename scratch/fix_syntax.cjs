const fs = require('fs');
const path = require('path');

function fixEscapes(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixEscapes(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('\\\\`${import.meta.env')) {
        content = content.replace(/\\\\`\$\{import\.meta\.env/g, '`${import.meta.env');
        fs.writeFileSync(fullPath, content);
        console.log('Fixed escape (type 1) in', fullPath);
      } else if (content.includes('\\`${import.meta.env')) {
        content = content.replace(/\\`\$\{import\.meta\.env/g, '`${import.meta.env');
        fs.writeFileSync(fullPath, content);
        console.log('Fixed escape (type 2) in', fullPath);
      }
    }
  }
}
fixEscapes('./src');
