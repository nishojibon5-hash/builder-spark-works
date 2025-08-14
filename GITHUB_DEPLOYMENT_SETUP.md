# 🚀 GitHub Auto-Deployment Setup Guide

এই guide অনুসরণ করে আপনি GitHub থেকে cPanel hosting এ automatic deployment setup করতে পারবেন।

## 🔐 GitHub Secrets Setup

GitHub repository এর **Settings > Secrets and variables > Actions** এ যান এবং নিচের secrets গুলো add করুন:

### 📊 cPanel FTP Credentials
```
CPANEL_FTP_HOST=ftp.yourdomain.com
CPANEL_FTP_USER=your_cpanel_username
CPANEL_FTP_PASS=your_cpanel_password
CPANEL_SERVER_DIR=/public_html/
```

### 🗄️ Database Credentials  
```
CPANEL_DB_NAME=yourdomain_loanbondhu
CPANEL_DB_USER=yourdomain_loan
CPANEL_DB_PASS=your_database_password
```

### 🔑 Security Keys
```
JWT_SECRET_KEY=your_super_secret_jwt_key_here_64_characters_long
MIGRATION_TOKEN=your_migration_token_here
BACKUP_TOKEN=your_backup_token_here
```

### 🌐 Site Configuration
```
CPANEL_SITE_URL=https://yourdomain.com
```

### 📨 Notifications (Optional)
```
DISCORD_WEBHOOK=https://discord.com/api/webhooks/your_webhook_url
```

## 🛠️ How It Works

### 🔄 Automatic Trigger
- Code push হলে GitHub Actions automatically trigger হয়
- `main` branch এ push করলেই deployment শুরু হয়

### 📦 Build Process
1. **Dependencies Install** - npm packages install
2. **Build Creation** - Production build তৈরি
3. **Config Update** - Database credentials update
4. **Package Creation** - Deployment package ready

### 🚀 Deployment Process
1. **FTP Upload** - Files cPanel এ upload
2. **Database Migration** - Schema updates run
3. **Health Check** - Site working কিনা verify
4. **Notification** - Success/failure notification

### 📊 Monitoring
- **Health Check**: `/api/health` endpoint
- **Deployment Status**: `/api/deployment/status` 
- **Deployment History**: `/api/deployment/history`

## ⚙️ Manual Configuration

### 🔑 Generate Security Tokens

```bash
# JWT Secret (64 characters)
openssl rand -hex 32

# Migration Token  
echo "migration_secret_$(date +%Y-%m-%d)" | sha256sum

# Backup Token
openssl rand -hex 16
```

### 📂 cPanel FTP Setup

1. cPanel File Manager এ যান
2. `public_html` folder select করুন
3. FTP Account create করুন (যদি নেই)
4. FTP credentials note করুন

### 🗄️ Database Setup

```sql
-- Create database
CREATE DATABASE yourdomain_loanbondhu;

-- Create user
CREATE USER 'yourdomain_loan'@'localhost' IDENTIFIED BY 'strong_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON yourdomain_loanbondhu.* TO 'yourdomain_loan'@'localhost';
FLUSH PRIVILEGES;
```

## 🚦 Deployment Steps

### 1️⃣ First Time Setup
```bash
# 1. Add all GitHub Secrets
# 2. Push code to main branch
git add .
git commit -m "Setup auto-deployment"
git push origin main

# 3. Check GitHub Actions tab for deployment progress
```

### 2️⃣ Regular Updates
```bash
# Simply push to main branch
git add .
git commit -m "Update features"
git push origin main

# Deployment will happen automatically!
```

### 3️⃣ Manual Deployment
- GitHub repository এ যান
- **Actions** tab ক্লিক করুন
- **Deploy to cPanel Hosting** workflow select করুন
- **Run workflow** ক্লিক করুন

## 🔍 Monitoring & Troubleshooting

### ✅ Health Check
```bash
curl https://yourdomain.com/api/health
```

### 📊 Deployment Status
```bash
curl https://yourdomain.com/api/deployment/status
```

### 📜 Deployment History
```bash
curl https://yourdomain.com/api/deployment/history
```

### 🐛 Common Issues

**1. FTP Connection Failed**
- Check FTP credentials
- Verify FTP host address
- Ensure FTP access enabled in cPanel

**2. Database Migration Failed**
- Check database credentials
- Verify database permissions
- Check PHP error logs

**3. Health Check Failed**
- Check file permissions (644 for files, 755 for directories)
- Verify .htaccess is uploaded
- Check PHP version compatibility

**4. Site Not Loading**
- Check .htaccess file
- Verify mod_rewrite enabled
- Check file permissions

## 📈 Benefits

### ✅ **Automatic**
- No manual file upload needed
- Database migrations automatic
- Health checks automatic

### ✅ **Safe**
- Backup system included
- Rollback capability
- Health verification

### ✅ **Monitored**
- Deployment notifications
- Status tracking
- Error logging

### ✅ **Team Friendly**
- Multiple developers can deploy
- Version control maintained
- Deployment history tracked

## 🔄 Rollback Process

If deployment fails or issues occur:

1. **GitHub Actions এ যান**
2. **Previous successful workflow** run করুন
3. **Re-run jobs** ক্লি�� করুন

অথবা manual rollback:

```bash
# Download previous backup
# Upload via FTP
# Run database rollback if needed
```

## 📞 Support

- **Workflow Logs**: GitHub Actions tab এ দেখুন
- **Site Health**: `/api/health` endpoint check করুন
- **Deployment Status**: `/api/deployment/status` দেখুন

---

**🏦 LoanBondhu - Automated Deployment System**

এই setup একবার করলে ভবিষ্যতে শুধু code push করলেই automatic deployment হবে! 🚀
