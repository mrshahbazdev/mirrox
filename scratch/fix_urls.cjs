const fs = require('fs');
const path = require('path');
function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('http://localhost:3000')) {
        // Replace 'http://localhost:3000...' with import.meta.env.VITE_API_URL + '...'
        content = content.replace(/'http:\/\/localhost:3000/g, "import.meta.env.VITE_API_URL + '");
        
        // Handle backtick templates: `http://localhost:3000/api...` to `${import.meta.env.VITE_API_URL}/api...`
        content = content.replace(/\`http:\/\/localhost:3000/g, "\\`${import.meta.env.VITE_API_URL}");
        
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', fullPath);
      }
    }
  }
}
replaceInDir('./src');
