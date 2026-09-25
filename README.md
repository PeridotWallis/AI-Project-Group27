# Jukebox

Jukebox lets you make playlists from YouTube, Spotify, and Bandcamp links. An internet connection is needed to play music. Playlists are saved on this device in the app.

## Install on Mac

1. Download the disk image for your Mac:
   - **Apple silicon:** `Jukebox-1.0.0-arm64.dmg`
   - **Intel:** `Jukebox-1.0.0.dmg`
2. Open the downloaded `.dmg` file.
3. Drag **Jukebox** into the **Applications** folder shown in the window.
4. Eject the Jukebox disk image, then open Jukebox from Applications.

The app is not signed or notarized yet. If macOS blocks the first launch, Control-click Jukebox in Applications, choose **Open**, then confirm.

## Install on Windows

1. Download `Jukebox Setup 1.0.0.exe`.
2. Open the installer and follow the instructions.
3. Start Jukebox from the Start menu.

The installer is not code-signed. If Windows SmartScreen appears, check that you downloaded the installer from a trusted source before choosing **More info** and **Run anyway**.

## Change the app icon

The desktop builds currently use Electron's default icon. To use your own image:

1. Create square artwork, ideally 1024 × 1024 pixels.
2. Export it as `build/icon.icns` for Mac and `build/icon.ico` for Windows. The Windows icon should include a 256 × 256 image. Most icon editors can export both formats from the same artwork.
3. Add an `icon` entry to each platform section in `package.json`:

   ```json
   "mac": {
     "icon": "build/icon.icns"
   },
   "win": {
     "icon": "build/icon.ico"
   }
   ```

   Keep the other settings already inside those sections; add the `icon` line alongside them.
4. Rebuild the installers with `npm run dist:mac` and `npm run dist:win`.

The rebuilt app and installer will show the new icon. No custom artwork is included yet, so the default icon remains until these image files are added.