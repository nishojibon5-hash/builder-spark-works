import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const sourceDir = path.resolve(projectRoot, 'dist/cpanel');
const packageDir = path.resolve(projectRoot, 'cpanel-package');

// Clean up existing package directory
if (fs.existsSync(packageDir)) {
    fs.rmSync(packageDir, { recursive: true, force: true });
}

// Create package directory
fs.mkdirSync(packageDir, { recursive: true });

console.log('📦 Creating cPanel deployment package...');

// Copy built React app
if (fs.existsSync(sourceDir)) {
    copyDirectory(sourceDir, packageDir);
    console.log('✅ React app copied');
} else {
    console.error('❌ Build directory not found. Run "npm run build:cpanel" first.');
    process.exit(1);
}

// Copy PHP backend
const phpSource = path.resolve(projectRoot, 'cpanel');
copyDirectory(phpSource, packageDir, ['.htaccess']);
console.log('✅ PHP backend copied');

// Copy .htaccess to root
const htaccessSource = path.resolve(phpSource, '.htaccess');
const htaccessDest = path.resolve(packageDir, '.htaccess');
fs.copyFileSync(htaccessSource, htaccessDest);
console.log('✅ .htaccess configured');

// Create deployment instructions
const instructions = `
# 🏦 LoanBondhu cPanel Deployment Instructions

## 📋 Prerequisites
1. cPanel hosting account with PHP 7.4+ and MySQL 5.7+
2. File Manager access or FTP client

## 🚀 Deployment Steps

### 1. Upload Files
- Upload ALL files from this package to your domain's public_html folder
- Make sure .htaccess is in the root directory

### 2. Database Setup
- Go to: http://yourdomain.com/install.php
- Create a MySQL database in cPanel
- Create a database user and assign to the database
- Enter database details in the installation form
- Complete the installation

### 3. File Permissions (if needed)
- Set permissions for PHP files: 644
- Set permissions for directories: 755

### 4. Builder.io Auto-Update Setup (Optional)
- Follow instructions in: BUILDER_WEBHOOK_SETUP.md
- Configure webhook in Builder.io: https://yourdomain.com/api/webhook
- Enable automatic updates when Builder.io content changes

### 5. Configuration
- Update database credentials in: config/database.php (if needed)
- Update domain in .htaccess CORS settings
- Configure webhook secret in: config/webhook-config.php

## 📱 Access Your Application
- Main App: http://yourdomain.com/
- Admin Login: Phone & Password (set during installation)
- API Base: http://yourdomain.com/api/
- Webhook Endpoint: http://yourdomain.com/api/webhook
- Deployment Status: http://yourdomain.com/api/deployment-status

## 🔄 Auto-Update Features
- ✅ Builder.io webhook integration
- ✅ Automatic GitHub code pulling
- ✅ Automatic deployment and backup
- ✅ Rollback capability
- ✅ Status monitoring

## 🔧 Troubleshooting
- Check PHP error logs in cPanel
- Ensure mod_rewrite is enabled
- Verify database connection
- Check file permissions
- Review webhook logs: logs/webhook.log
- Check deployment logs: logs/auto-deploy.log

## 📞 Support
- Documentation: README.md and BUILDER_WEBHOOK_SETUP.md
- Issues: GitHub repository

---
Generated on: ${new Date().toLocaleDateString()}
Package Version: 1.0.0 (with Auto-Update System)
`;

fs.writeFileSync(path.resolve(packageDir, 'DEPLOYMENT_INSTRUCTIONS.txt'), instructions);

// Create a simple index check file
const indexCheck = `<?php
// LoanBondhu - Basic system check
echo "✅ LoanBondhu is running!<br>";
echo "PHP Version: " . PHP_VERSION . "<br>";
echo "Time: " . date('Y-m-d H:i:s') . "<br>";

if (file_exists('config/database.php')) {
    echo "✅ Database config found<br>";
} else {
    echo "⚠️ Database config missing - <a href='/install.php'>Run Installation</a><br>";
}

if (file_exists('.installed')) {
    echo "✅ Installation completed<br>";
    echo "<a href='/'>Go to Application</a>";
} else {
    echo "⚠️ <a href='/install.php'>Complete Installation</a><br>";
}
?>`;

fs.writeFileSync(path.resolve(packageDir, 'check.php'), indexCheck);

console.log('✅ Package created successfully!');
console.log(`📦 Package location: ${packageDir}`);
console.log('');
console.log('🚀 To deploy:');
console.log('1. Upload all files to your cPanel public_html folder');
console.log('2. Visit http://yourdomain.com/install.php');
console.log('3. Complete the database setup');
console.log('4. Access your app at http://yourdomain.com/');

function copyDirectory(source, destination, skipFiles = []) {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    const items = fs.readdirSync(source);

    for (const item of items) {
        if (skipFiles.includes(item)) continue;
        
        const sourcePath = path.join(source, item);
        const destPath = path.join(destination, item);

        if (fs.statSync(sourcePath).isDirectory()) {
            copyDirectory(sourcePath, destPath, skipFiles);
        } else {
            fs.copyFileSync(sourcePath, destPath);
        }
    }
}
