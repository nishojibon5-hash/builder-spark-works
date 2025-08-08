# LoanBondhu Android App - Setup & Installation Guide

## 🚀 Building the Android APK

### Prerequisites

1. **Java Development Kit (JDK) 8 or higher**
   ```bash
   java -version
   ```

2. **Android SDK** (if building locally)
   - Download Android Studio or just the command line tools
   - Set `ANDROID_HOME` environment variable
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

3. **Node.js and npm** (for web assets)
   ```bash
   node --version
   npm --version
   ```

### Building the APK

#### Option 1: Using Build Script (Recommended)

**For Linux/Mac:**
```bash
chmod +x build-android.sh
./build-android.sh
```

**For Windows:**
```cmd
build-android.bat
```

#### Option 2: Manual Build

1. Build web application:
   ```bash
   npm run build
   ```

2. Build Android APK:
   ```bash
   cd android
   ./gradlew assembleDebug
   ./gradlew assembleRelease
   ```

3. APK files will be generated at:
   - Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Release: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## 📱 Installing on Android Device

### Step 1: Enable Unknown Sources

1. Open **Settings** on your Android device
2. Go to **Security** or **Privacy & Security**
3. Enable **Unknown Sources** or **Install from Unknown Sources**
4. If prompted, allow your browser or file manager to install apps

### Step 2: Download & Install

1. **From Website**: Click "Download APK" button on the homepage footer
2. **Direct Download**: Download `LoanBondhu.apk` from the server
3. Open the downloaded APK file
4. Tap **Install** when prompted
5. Wait for installation to complete

### Step 3: Grant Permissions

When you first open the app, it may request permissions for:
- **Internet Access**: Required for loan application submission
- **Camera**: For document capture (optional)
- **Storage**: For document uploads (optional)
- **Phone**: For auto-filling phone numbers (optional)

## 🔧 App Features

### User Features
- ✅ Complete loan application form
- ✅ EMI calculator
- ✅ Application status tracking
- ✅ Document upload
- ✅ Multi-language support (Bengali/English)
- ✅ Offline form filling (syncs when online)

### Admin Features
- ✅ Secure admin login (Phone: 01650074073)
- ✅ Application management
- ✅ User management
- ✅ Real-time dashboard
- ✅ Reports and analytics

## 📋 Technical Specifications

- **Minimum Android Version**: 5.0 (API Level 21)
- **Target Android Version**: 14 (API Level 34)
- **Architecture**: Universal APK (supports all architectures)
- **Size**: ~8-15 MB
- **Permissions**: Internet, Camera, Storage (optional)

## 🛠️ Troubleshooting

### "There was a problem parsing the package"

This error typically occurs due to:

1. **Incomplete Download**: Re-download the APK file
2. **Corrupted File**: Clear browser cache and download again
3. **Android Version**: Ensure Android 5.0 or higher
4. **Architecture Mismatch**: Use the universal APK provided

**Solutions:**
```bash
# Check APK integrity
adb install LoanBondhu.apk

# If using Android Studio
./gradlew clean
./gradlew assembleDebug --stacktrace
```

### App Won't Open

1. **Clear App Data**: Settings > Apps > LoanBondhu > Storage > Clear Data
2. **Reinstall App**: Uninstall and reinstall the APK
3. **Check Permissions**: Ensure internet permission is granted
4. **Restart Device**: Sometimes a simple restart helps

### Can't Connect to Server

1. **Check Internet Connection**: Ensure WiFi/mobile data is active
2. **Allow Network Access**: Check if app has internet permission
3. **Server Status**: The app connects to the web server for data

### Admin Panel Issues

1. **Correct Phone Number**: Use exactly `01650074073`
2. **Password**: Use `admin123`
3. **2FA Code**: Use `123456`
4. **Clear Browser Data**: In app settings, clear WebView data

## 🔄 Updates

The app automatically checks for web updates when connected to internet. For APK updates:

1. Download new APK from website
2. Install over existing app (data will be preserved)
3. Or uninstall old version and install new one

## 📞 Support

For technical issues:
- **App Issues**: Check this guide first
- **Server Issues**: Contact development team
- **Installation Problems**: Follow troubleshooting steps above

## 🏗️ Development Notes

The Android app is a WebView wrapper around the React web application with:
- Native Android UI integration
- Offline capability
- Enhanced mobile experience
- Direct admin panel access
- Optimized performance for mobile devices

The app maintains full functionality with both online and offline capabilities, ensuring users can fill loan applications even without internet connection (data syncs when connection is restored).
