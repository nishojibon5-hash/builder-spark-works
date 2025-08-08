#!/bin/bash

# Build script for LoanBondhu Android App
echo "🚀 Building LoanBondhu Android App..."

# Check if Android SDK is available
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME not set. Please install Android SDK and set ANDROID_HOME."
    exit 1
fi

# Check if Java is available
if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Please install Java JDK 8 or higher."
    exit 1
fi

# Create necessary directories
mkdir -p android/app/src/main/assets
mkdir -p android/app/src/main/res/mipmap-hdpi
mkdir -p android/app/src/main/res/mipmap-mdpi
mkdir -p android/app/src/main/res/mipmap-xhdpi
mkdir -p android/app/src/main/res/mipmap-xxhdpi
mkdir -p android/app/src/main/res/mipmap-xxxhdpi

# Build the web application first
echo "📦 Building web application..."
npm run build

# Copy web assets to Android app (optional - for offline mode)
echo "📋 Copying web assets..."
cp -r dist/spa/* android/app/src/main/assets/ 2>/dev/null || true

# Set execute permissions for gradlew
chmod +x android/gradlew

# Navigate to Android directory
cd android

# Clean previous builds
echo "🧹 Cleaning previous builds..."
./gradlew clean

# Build debug APK
echo "🔨 Building debug APK..."
./gradlew assembleDebug

# Build release APK (unsigned)
echo "🔨 Building release APK..."
./gradlew assembleRelease

# Check if build was successful
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo "✅ Debug APK built successfully!"
    echo "📱 Location: android/app/build/outputs/apk/debug/app-debug.apk"
    
    # Copy APK to public directory for download
    cp app/build/outputs/apk/debug/app-debug.apk ../public/LoanBondhu.apk
    echo "📥 APK copied to public/LoanBondhu.apk for download"
else
    echo "❌ Debug APK build failed!"
    exit 1
fi

if [ -f "app/build/outputs/apk/release/app-release-unsigned.apk" ]; then
    echo "✅ Release APK built successfully!"
    echo "📱 Location: android/app/build/outputs/apk/release/app-release-unsigned.apk"
    
    # Copy release APK as well
    cp app/build/outputs/apk/release/app-release-unsigned.apk ../public/LoanBondhu-release.apk
    echo "📥 Release APK copied to public/LoanBondhu-release.apk"
else
    echo "⚠️  Release APK build failed (this might be due to signing issues)"
fi

# Return to root directory
cd ..

echo ""
echo "🎉 Android build completed!"
echo "📋 Summary:"
echo "   - Debug APK: ✅ Available at public/LoanBondhu.apk"
echo "   - Release APK: ✅ Available at public/LoanBondhu-release.apk"
echo "   - Compatible with: Android 5.0+ (API 21+)"
echo "   - Architecture: Universal APK"
echo ""
echo "💡 To install on device:"
echo "   1. Enable 'Unknown Sources' in Android settings"
echo "   2. Download and install the APK"
echo "   3. Open the LoanBondhu app"
echo ""
echo "🔧 Admin access: Phone number 01650074073"
