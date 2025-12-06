# 📱 RealMeet App Icon Setup Guide

## 🎨 Icon Design
Beautiful gradient heart icon with "RealMeet" branding
- Orange to Pink to Purple gradient
- Modern, clean design
- "Find Your Spot" tagline

## 📐 Required Icon Sizes for Android

### Launcher Icons (mipmap folders)
```
android/app/src/main/res/

mipmap-mdpi/       → 48x48 px
mipmap-hdpi/       → 72x72 px
mipmap-xhdpi/      → 96x96 px
mipmap-xxhdpi/     → 144x144 px
mipmap-xxxhdpi/    → 192x192 px
```

### Round Icons (for Android 7.1+)
```
mipmap-mdpi/       → 48x48 px (round)
mipmap-hdpi/       → 72x72 px (round)
mipmap-xhdpi/      → 96x96 px (round)
mipmap-xxhdpi/     → 144x144 px (round)
mipmap-xxxhdpi/    → 192x192 px (round)
```

## 🛠️ Setup Steps

### Option 1: Using Online Tool (Easiest)
1. Go to: https://icon.kitchen/
2. Upload your icon image
3. Select "Android" platform
4. Download generated icons
5. Replace files in `android/app/src/main/res/mipmap-*` folders

### Option 2: Using Android Studio
1. Open Android Studio
2. Right-click `res` folder
3. New → Image Asset
4. Select "Launcher Icons (Adaptive and Legacy)"
5. Upload your icon
6. Click "Next" → "Finish"

### Option 3: Manual (Using provided image)
1. Save the icon image as `icon.png` (1024x1024)
2. Use image editor to resize:
   - 48x48 → mipmap-mdpi
   - 72x72 → mipmap-hdpi
   - 96x96 → mipmap-xhdpi
   - 144x144 → mipmap-xxhdpi
   - 192x192 → mipmap-xxxhdpi

## 📂 File Structure

```
android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png (48x48)
│   └── ic_launcher_round.png (48x48)
├── mipmap-hdpi/
│   ├── ic_launcher.png (72x72)
│   └── ic_launcher_round.png (72x72)
├── mipmap-xhdpi/
│   ├── ic_launcher.png (96x96)
│   └── ic_launcher_round.png (96x96)
├── mipmap-xxhdpi/
│   ├── ic_launcher.png (144x144)
│   └── ic_launcher_round.png (144x144)
└── mipmap-xxxhdpi/
    ├── ic_launcher.png (192x192)
    └── ic_launcher_round.png (192x192)
```

## 🎯 Quick Setup Using Icon Kitchen

1. **Visit**: https://icon.kitchen/
2. **Upload**: Your gradient heart icon
3. **Configure**:
   - Platform: Android
   - Shape: Square (for regular) + Circle (for round)
   - Background: Transparent or Dark Gray
4. **Download**: ZIP file with all sizes
5. **Extract**: To `android/app/src/main/res/`
6. **Rebuild**: APK

## 🔧 After Replacing Icons

### Rebuild APK
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

### Or Quick Build
```bash
npx react-native run-android --variant=release
```

## ✅ Verification

After installation, check:
- [ ] App icon visible on home screen
- [ ] Icon shows gradient heart
- [ ] Icon looks sharp (not pixelated)
- [ ] Round icon works on supported devices

## 📱 Testing

1. Uninstall old app
2. Install new APK with icon
3. Check home screen
4. Check app drawer
5. Check recent apps

## 🎨 Icon Tips

- Use transparent background for PNG
- Keep design simple and recognizable
- Test on different Android versions
- Ensure icon is centered
- Use high-resolution source (1024x1024)

## 🚀 Current Status

- [x] Icon design provided
- [ ] Icons generated for all sizes
- [ ] Icons placed in mipmap folders
- [ ] APK rebuilt
- [ ] Icon tested on device

---

**Next: Generate icons using Icon Kitchen and replace in mipmap folders!**
