const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

async function identifyGuides() {
  for (let i = 1; i <= 3; i++) {
    const filePath = path.join(process.cwd(), 'docs', `guide${i}.pdf`);

    try {
      const dataBuffer = fs.readFileSync(filePath);
      // Handle both default and named exports
      const parser = pdfParse.default || pdfParse;
      const data = await parser(dataBuffer);

      // Get first 1000 characters
      const preview = data.text.substring(0, 1000);

      console.log(`\n${'='.repeat(60)}`);
      console.log(`GUIDE ${i}`);
      console.log(`${'='.repeat(60)}`);
      console.log(`Pages: ${data.numpages}`);
      console.log(`\nFirst 1000 characters:`);
      console.log(preview);
      console.log('\n');

      // Try to identify the title
      const lines = preview.split('\n').filter(l => l.trim().length > 0);
      console.log('First few lines:');
      lines.slice(0, 10).forEach((line, idx) => {
        console.log(`  ${idx + 1}. ${line.substring(0, 100)}`);
      });

    } catch (error) {
      console.error(`Error reading guide${i}.pdf:`, error.message);
    }
  }
}

identifyGuides();
