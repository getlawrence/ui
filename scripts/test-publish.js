#!/usr/bin/env node

/**
 * Test script for local package publishing
 * This script helps test the package locally before publishing
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing package locally...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found. Run this script from the project root.');
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

console.log(`📦 Package: ${packageJson.name}@${packageJson.version}`);
console.log(`📁 Files to include: ${packageJson.files.join(', ')}\n`);

// Step 1: Clean and build
console.log('1️⃣ Cleaning and building...');
try {
  execSync('rm -rf dist', { stdio: 'inherit' });
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Check build output
console.log('2️⃣ Checking build output...');
const requiredFiles = [
  'dist/index.js',
  'dist/index.esm.js',
  'dist/index.d.ts'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing required file: ${file}`);
    process.exit(1);
  }
  console.log(`✅ Found: ${file}`);
}

// Step 3: Check package size
console.log('\n3️⃣ Checking package size...');
try {
  const { size } = fs.statSync('dist/index.js');
  const sizeKB = Math.round(size / 1024);
  console.log(`📊 Main bundle size: ${sizeKB}KB`);
  
  if (sizeKB > 1000) {
    console.warn('⚠️  Bundle size is quite large. Consider optimization.');
  }
} catch (error) {
  console.warn('⚠️  Could not check bundle size');
}

// Step 4: Validate package.json
console.log('\n4️⃣ Validating package.json...');
const requiredFields = ['name', 'version', 'main', 'module', 'types', 'files'];
const missingFields = requiredFields.filter(field => !packageJson[field]);

if (missingFields.length > 0) {
  console.error(`❌ Missing required fields: ${missingFields.join(', ')}`);
  process.exit(1);
}

if (!packageJson.publishConfig?.registry) {
  console.warn('⚠️  No publishConfig.registry found. Package will publish to npm by default.');
}

console.log('✅ Package.json validation passed');

// Step 5: Test dry run publish
console.log('\n5️⃣ Testing dry run publish...');
try {
  execSync('npm publish --dry-run', { stdio: 'inherit' });
  console.log('✅ Dry run successful');
} catch (error) {
  console.error('❌ Dry run failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 All tests passed! Package is ready for publishing.');
console.log('\n📋 Next steps:');
console.log('1. Commit your changes');
console.log('2. Push to main branch (triggers automatic publishing)');
console.log('3. Or create a tag: git tag v1.0.0 && git push --tags');
console.log('\n💡 To publish manually: npm publish');
