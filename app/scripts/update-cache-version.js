#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate a version string based on current timestamp
const version = Date.now();

// Files to update
const files = [
  path.join(__dirname, '../public/examples/standalone-example.html'),
  path.join(__dirname, '../public/examples/webcomponents-example.html')
];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`Skipping ${file} (not found)`);
    return;
  }

  let content = fs.readFileSync(file, 'utf8');
  
  // Replace version query parameters
  // Matches: .css?v=anything or .js?v=anything
  content = content.replace(
    /\.(css|js)\?v=[^"']*/g,
    `.$1?v=${version}`
  );
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${path.basename(file)} with version ${version}`);
});

console.log('Cache busting version updated successfully!');

