# 🏦 LoanBondhu cPanel Hosting Guide

এই গাইড অনুসরণ করে আপনি LoanBondhu সাইট cPanel hosting এ deploy করতে পারবেন।

## 📋 Requirements | প্রয়োজনীয়তা

- ✅ cPanel hosting account
- ✅ PHP 7.4 বা তার উপরে
- ✅ MySQL 5.7 বা তার উপরে
- ✅ File Manager অথবা FTP access

## 🚀 Deployment Steps | ডিপ্লয়মেন্ট ধাপসমূহ

### ১. Build তৈরি করুন

```bash
npm run build:cpanel
```

এই command চালানোর পর `cpanel-package` ফোল্ডার তৈরি হবে।

### ২. Files Upload করুন

1. cPanel File Manager এ লগইন ��রুন
2. `public_html` ফোল্ডারে যান
3. `cpanel-package` ফোল্ডারের **সব files** upload করুন
4. নিশ্চিত করুন যে `.htaccess` file root directory তে আছে

### ৩. Database Setup

1. cPanel এ MySQL Database তৈরি করুন:
   - Database name: `yourdomain_loanbondhu`
   - Username: `yourdomain_loan`
   - Password: একটি strong password

2. User কে database এ assign করুন

3. Browser এ যান: `http://yourdomain.com/install.php`

4. Database details দিন এবং installation complete করুন

### ৪. Configuration চেক করুন

Installation এর পর visit করুন: `http://yourdomain.com/check.php`

## 📱 Application Access

- **Main Website**: `http://yourdomain.com/`
- **Admin Login**: Installation এ দেওয়া phone ও password
- **API Endpoint**: `http://yourdomain.com/api/`

## ⚙️ Manual Configuration (যদি প্রয়োজন হয়)

### Database Connection Update

`config/database.php` file edit করুন:

```php
private $host = 'localhost';
private $database = 'yourdomain_loanbondhu'; // Your database name
private $username = 'yourdomain_loan';       // Your database username  
private $password = 'your_strong_password';  // Your database password
```

### CORS Configuration

`.htaccess` file এ আপনার domain add করুন:

```apache
SetEnvIf Origin "http(s)?://(www\.)?(yourdomain\.com|localhost)" AccessControlAllowOrigin=$0
```

## 🔧 Common Issues | সাধারণ সমস্যা

### 404 Error
- নিশ্চিত করুন `.htaccess` file upload হয়েছে
- cPanel এ mod_rewrite enable আছে কিনা চেক করুন

### Database Connection Error
- Database credentials সঠিক আছে কিনা চেক করুন
- Database user এর সব permissions আছে কিনা দেখুন

### Permission Issues
- PHP files: 644 permission
- Directories: 755 permission

### API Not Working
- CORS headers সঠিক আছে কিনা চেক করুন
- PHP error logs দেখুন

## 📊 Features Available

### ✅ Frontend Features
- 📱 Responsive Design
- 🌐 Bengali/English Language
- 👥 Member Management
- 💰 Loan Management
- 📊 Financial Reports
- 💾 Local Storage Backup

### ✅ Backend Features  
- 🔐 JWT Authentication
- 📊 MySQL Database
- 🔒 Secure API Endpoints
- 📈 Dashboard Statistics
- 💰 Income/Expense Tracking
- 👷 Worker Salary Management

## 📞 Support

- **Documentation**: README.md
- **GitHub Issues**: Repository issues section
- **Installation Check**: `http://yourdomain.com/check.php`

## 🔄 Updates

নতুন version deploy করতে:

1. নতুন code pull করুন
2. `npm run build:cpanel` চালান  
3. `cpanel-package` ফোল্ডারের files upload করুন
4. Database migration যদি প্রয়োজন হয় চালান

---

**🏦 LoanBondhu - Empowering Financial Communities**

Built with ❤️ in Bangladesh 🇧🇩
