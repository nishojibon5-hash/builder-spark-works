# 🏦 LoanBondhu - লোনবন্ধু

**সমিতি ব্যবস্থাপনা সিস্টেম | Society Management System**

[![Deploy to GitHub Pages](https://github.com/nishojibon5-hash/builder-spark-works/actions/workflows/deploy.yml/badge.svg)](https://github.com/nishojibon5-hash/builder-spark-works/actions/workflows/deploy.yml)
[![Build Android APK](https://github.com/nishojibon5-hash/builder-spark-works/actions/workflows/android-build.yml/badge.svg)](https://github.com/nishojibon5-hash/builder-spark-works/actions/workflows/android-build.yml)

## 🌟 Live Demo

🌐 **Website:** [https://nishojibon5-hash.github.io/builder-spark-works/](https://nishojibon5-hash.github.io/builder-spark-works/)

📱 **Android APK:** [Download Latest Release](https://github.com/nishojibon5-hash/builder-spark-works/releases/latest)

## 📱 Features | ফিচারসমূহ

### 🏛️ Core Features

- **🏦 Loan Management** - ঋণ ব্যবস্থাপনা
- **👥 Member Management** - সদস্য ব্যবস্থাপনা
- **💰 Daily Collection** - দৈনিক কালেকশন
- **📊 Financial Reports** - আর্থিক প্রতিবেদন
- **🏢 Society Management** - সমিতি ব্যবস্থাপনা
- **👷 Worker Management** - কর্মী ব্যবস্থাপনা

### 💼 Society Manager Features

- **📈 Dashboard** - ড্যাশবোর্ড
- **👨‍💼 Worker Management** - কর্মী ব্যবস���থাপনা
- **👥 Member Registration** - সদস্য নিবন্ধন
- **💵 Collection Tracking** - কালেকশন ট্র্যাকিং
- **📋 Income/Expense Management** - আয়-ব্যয় ব্যবস্থাপনা
- **💰 Salary Management** - বেতন ব্যবস্থাপনা
- **📄 PDF Reports** - পিডিএফ রিপোর্ট
- **📅 Collection Calendar** - কালেকশন ক্যালেন্ডার

### 🔐 Admin Features

- **🛡️ Admin Dashboard** - অ্যাডমিন ড্যাশবোর্ড
- **📝 Application Review** - আবেদন পর্যালোচনা
- **👤 User Profile Management** - ব্যবহারকারী প্রোফাইল ব্যবস্থাপনা
- **🔍 KYC Verification** - কেওয়াইসি যাচাইকরণ
- **📊 Comprehensive Reports** - বিস্তৃত প্রতিবেদন

### 📱 Mobile Features

- **📷 NID Scanner** - এনআইডি স্ক্যানার
- **📊 Loan Calculator** - ঋণ ক্যালকুলেটর
- **🔒 Secure Authentication** - নিরাপদ প্রমাণীকরণ
- **🌐 Responsive Design** - রেসপন্সিভ ডিজাইন
- **🇧🇩 Bengali Language Support** - ���াংলা ভাষা সাপোর্ট

## 🚀 Quick Start

### 🌐 Web Application

Visit: [https://nishojibon5-hash.github.io/loanbondhu/](https://nishojibon5-hash.github.io/loanbondhu/)

### 📱 Android Installation

1. **Download APK:**

   - Go to [Releases](https://github.com/nishojibon5-hash/loanbondhu/releases/latest)
   - Download `LoanBondhu-release.apk`

2. **Install:**

   - Enable "Unknown Sources" in Android settings
   - Install the downloaded APK
   - Open LoanBondhu app

3. **Admin Access:**
   - Phone: `01650074073`
   - Password: `admin123`

## 🛠️ Development

### Prerequisites

- Node.js 20+
- npm or yarn
- Android SDK (for Android build)
- Java JDK 17+ (for Android build)

### Installation

```bash
# Clone repository
git clone https://github.com/nishojibon5-hash/loanbondhu.git
cd loanbondhu

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build Commands

```bash
# Build web application
npm run build

# Build Android APK
npm run build:android

# Build for production
npm run build:client
npm run build:server
```

## 📱 Android Build

### Automatic Build (GitHub Actions)

- Android APKs are automatically built on every push to main branch
- Download from [GitHub Releases](https://github.com/nishojibon5-hash/loanbondhu/releases)
- Both Debug and Release APKs are available

### Manual Build

```bash
# Ensure Android SDK is installed
export ANDROID_HOME=/path/to/android-sdk

# Build APK
npm run build:android

# APK will be available in:
# - public/LoanBondhu.apk (Debug)
# - public/LoanBondhu-release.apk (Release)
```

## 🏗️ Architecture

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **React Router** for navigation
- **Shadcn/UI** components

### Backend

- **Express.js** API server
- **Local Storage** for data persistence
- **JWT** authentication
- **Serverless** deployment ready

### Mobile

- **Android WebView** wrapper
- **Offline capability**
- **Native Android features**

## 📊 Data Management

### Storage

- **LocalStorage** for web application
- **Persistent data** across sessions
- **Export/Import** functionality
- **PDF generation** for reports

### Security

- **Admin-only data deletion**
- **Strong password protection**
- **Session management**
- **Data backup system**

## 🔧 Configuration

### Environment Variables

```env
# Server configuration
PORT=8080
NODE_ENV=production

# Admin settings
ADMIN_PHONE=01650074073
ADMIN_PASSWORD=admin123
```

### Android Configuration

```gradle
// android/app/build.gradle
android {
    compileSdkVersion 34
    defaultConfig {
        applicationId "com.loanbondhu.app"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

## 📋 Usage Guide

### For Society Members

1. **Registration:** Apply through the main form
2. **Profile:** View member dashboard
3. **Loans:** Apply for loans and track repayments
4. **Collections:** Track daily savings and installments

### For Society Workers

1. **Login:** Access worker panel
2. **Collections:** Record daily member collections
3. **Reports:** Generate area-wise reports
4. **Member Management:** Add and manage area members

### For Administrators

1. **Dashboard:** Monitor society performance
2. **Applications:** Review and approve member applications
3. **Reports:** Generate comprehensive reports
4. **Settings:** Configure society parameters

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues:** [GitHub Issues](https://github.com/nishojibon5-hash/loanbondhu/issues)
- **Discussions:** [GitHub Discussions](https://github.com/nishojibon5-hash/loanbondhu/discussions)
- **Email:** support@loanbondhu.com

## 📞 Contact

- **Developer:** Nishojib Team
- **Email:** nishojibon5@gmail.com
- **Phone:** +880 1650-074073

---

<div align="center">

**🏦 LoanBondhu - Empowering Financial Communities | আর্থিক সম্প্রদায়ের ক্ষমতায়ন**

Made with ❤️ in Bangladesh 🇧🇩

</div>
