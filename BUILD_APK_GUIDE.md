# 📱 RealMeet - Android APK Build Guide

## 🚀 Quick Build Commands

### Option 1: Release APK (Recommended)
```bash
cd android
./gradlew assembleRelease
```

**APK Location:**
```
android/app/build/outputs/apk/release/app-release.apk
```

### Option 2: Debug APK (For Testing)
```bash
cd android
./gradlew assembleDebug
```

**APK Location:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📋 Prerequisites

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Check Android Setup
```bash
npx react-native doctor
```

---

## 🔧 Build Steps

### Step 1: Clean Previous Builds
```bash
cd android
./gradlew clean
```

### Step 2: Build Release APK
```bash
./gradlew assembleRelease
```

### Step 3: Find Your APK
```
📁 android/app/build/outputs/apk/release/
   └── app-release.apk  ✅ (This is your APK!)
```

---

## 🔐 Signing APK (Optional - For Play Store)

### Generate Keystore
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore realmeet-release-key.keystore -alias realmeet-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### Update `android/gradle.properties`
```properties
MYAPP_RELEASE_STORE_FILE=realmeet-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=realmeet-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your_password
MYAPP_RELEASE_KEY_PASSWORD=your_password
```

### Update `android/app/build.gradle`
```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

---

## 🐛 Troubleshooting

### Error: "SDK location not found"
**Solution:** Create `android/local.properties`
```properties
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

### Error: "Execution failed for task ':app:lintVitalRelease'"
**Solution:** Disable lint in `android/app/build.gradle`
```gradle
android {
    lintOptions {
        checkReleaseBuilds false
        abortOnError false
    }
}
```

### Error: "Out of memory"
**Solution:** Increase heap size in `android/gradle.properties`
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
```

---

## 📦 APK Size Optimization

### Enable ProGuard (Minification)
In `android/app/build.gradle`:
```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### Enable App Bundle (AAB)
```bash
./gradlew bundleRelease
```
**Output:** `android/app/build/outputs/bundle/release/app-release.aab`

---

## 📲 Install APK on Device

### Via USB
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Via File Transfer
1. Copy APK to phone
2. Open file manager
3. Tap APK file
4. Allow "Install from Unknown Sources"
5. Install

---

## ✅ Build Checklist

- [ ] All dependencies installed (`npm install`)
- [ ] Android SDK configured
- [ ] Gradle wrapper present (`android/gradlew`)
- [ ] Clean build (`./gradlew clean`)
- [ ] Build APK (`./gradlew assembleRelease`)
- [ ] APK found in `outputs/apk/release/`
- [ ] Test APK on device

---

## 🎯 Current Build Status

**App Name:** RealMeet  
**Package:** com.realmeet  
**Version:** 1.0.0  
**Build Type:** Release  
**Target SDK:** 34  
**Min SDK:** 21  

---

## 📱 App Features

✅ Registration & Login Flow  
✅ Profile Management  
✅ Matches Screen  
✅ Likes You Screen  
✅ Visitors Screen  
✅ Messages & Chat  
✅ Search Filters  
✅ Profile Details  
✅ Edit Profile  
✅ Sidebar Navigation  

---

## 🚀 Next Steps

1. **Test APK** on real device
2. **Sign APK** for production
3. **Upload to Play Store** (optional)
4. **Share APK** with testers

---

## 📞 Support

If you encounter any issues:
1. Check error logs
2. Run `./gradlew clean`
3. Rebuild APK
4. Check Android SDK version

---

**Happy Building! 🎉**
