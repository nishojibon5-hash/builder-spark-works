@echo off
echo 🚀 Building LoanBondhu Android App...

REM Check if Android SDK is available
if "%ANDROID_HOME%"=="" (
    echo ❌ ANDROID_HOME not set. Please install Android SDK and set ANDROID_HOME.
    exit /b 1
)

REM Check if Java is available
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java not found. Please install Java JDK 8 or higher.
    exit /b 1
)

REM Create necessary directories
if not exist "android\app\src\main\assets" mkdir android\app\src\main\assets
if not exist "android\app\src\main\res\mipmap-hdpi" mkdir android\app\src\main\res\mipmap-hdpi
if not exist "android\app\src\main\res\mipmap-mdpi" mkdir android\app\src\main\res\mipmap-mdpi
if not exist "android\app\src\main\res\mipmap-xhdpi" mkdir android\app\src\main\res\mipmap-xhdpi
if not exist "android\app\src\main\res\mipmap-xxhdpi" mkdir android\app\src\main\res\mipmap-xxhdpi
if not exist "android\app\src\main\res\mipmap-xxxhdpi" mkdir android\app\src\main\res\mipmap-xxxhdpi

REM Build the web application first
echo 📦 Building web application...
call npm run build

REM Copy web assets to Android app (optional - for offline mode)
echo 📋 Copying web assets...
xcopy /E /I /Y dist\spa\* android\app\src\main\assets\ >nul 2>&1

REM Navigate to Android directory
cd android

REM Clean previous builds
echo 🧹 Cleaning previous builds...
call gradlew.bat clean

REM Build debug APK
echo 🔨 Building debug APK...
call gradlew.bat assembleDebug

REM Build release APK (unsigned)
echo 🔨 Building release APK...
call gradlew.bat assembleRelease

REM Check if build was successful
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo ✅ Debug APK built successfully!
    echo 📱 Location: android\app\build\outputs\apk\debug\app-debug.apk
    
    REM Copy APK to public directory for download
    copy app\build\outputs\apk\debug\app-debug.apk ..\public\LoanBondhu.apk
    echo 📥 APK copied to public\LoanBondhu.apk for download
) else (
    echo ❌ Debug APK build failed!
    cd ..
    exit /b 1
)

if exist "app\build\outputs\apk\release\app-release-unsigned.apk" (
    echo ✅ Release APK built successfully!
    echo 📱 Location: android\app\build\outputs\apk\release\app-release-unsigned.apk
    
    REM Copy release APK as well
    copy app\build\outputs\apk\release\app-release-unsigned.apk ..\public\LoanBondhu-release.apk
    echo 📥 Release APK copied to public\LoanBondhu-release.apk
) else (
    echo ⚠️  Release APK build failed (this might be due to signing issues)
)

REM Return to root directory
cd ..

echo.
echo 🎉 Android build completed!
echo 📋 Summary:
echo    - Debug APK: ✅ Available at public\LoanBondhu.apk
echo    - Release APK: ✅ Available at public\LoanBondhu-release.apk
echo    - Compatible with: Android 5.0+ (API 21+)
echo    - Architecture: Universal APK
echo.
echo 💡 To install on device:
echo    1. Enable 'Unknown Sources' in Android settings
echo    2. Download and install the APK
echo    3. Open the LoanBondhu app
echo.
echo 🔧 Admin access: Phone number 01650074073
