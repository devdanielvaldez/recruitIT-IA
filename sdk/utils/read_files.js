const fs = require('fs');

function loadTextFiles(folderPath) {
    const files = fs.readdirSync(folderPath);
    const texts = [];
    files.forEach(file => {
      const text = fs.readFileSync(`${folderPath}/${file}`, 'utf-8');
      texts.push(text);
    });
    return texts;
}

module.exports = {loadTextFiles};