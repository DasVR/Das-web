# WINDOWS 11 RESET — COMPLETE PRE & POST SETUP GUIDE
## Arriq's Clean Slate Manual

**Last updated:** 2026-08-02
**For:** Full Windows 11 reset / clean install
**Goal:** Fast, clean, aesthetic, automated, keyboard-centric

---

# PART 1: PRE-RESET (DO NOT SKIP)

## 1.1 Backup Checklist

### Files & Folders to Save
Before wiping, copy these to an external drive or your homelab:

| Location | What | How |
|----------|------|-----|
| `C:\Users\airfr\Documents` | Projects, schoolwork, notes | Copy entire folder |
| `C:\Users\airfr\Downloads` | Anything you still need | Sort by date, grab recent stuff |
| `C:\Users\airfr\Pictures` | Screenshots, memes, art | Copy entire folder |
| `C:\Users\airfr\Videos` | Recordings, clips | Copy entire folder |
| `C:\Users\airfr\Desktop` | Anything sitting there | Usually cluttered, grab only what matters |
| `C:\Users\airfr\Music` | Local music files | If you keep any |
| `C:\Users\airfr\AppData\Roaming\sh.cider.dotnet\plugins` | Cider plugins YOU made | Copy plugin folders you created |
| `C:\Users\airfr\.cursor` or `C:\Users\airfr\AppData\Roaming\Cursor` | Cursor settings/extensions | Might not need this, but backup just in case |
| Browser profiles | Bookmarks, extensions, sessions | Export bookmarks manually (see below) |
| Game saves | Minecraft worlds, etc. | See section below |

### Browser Data Export
1. **Brave / Edge / Chrome:**
   - Go to `brave://bookmarks` → Export bookmarks as HTML
   - Go to `brave://settings/passwords` → Export passwords (or use Bitwarden/Vaultwarden)
   - Screenshot your extension list so you remember what to reinstall
2. **If using Vaultwarden/Bitwarden:**
   - Make sure passwords are synced to vault before reset
   - Export vault as encrypted JSON (just in case)

### Game Saves to Backup
| Game | Save Location |
|------|---------------|
| Minecraft | `%appdata%\.minecraft\saves` |
| Minecraft (MS Store) | `C:\Users\airfr\AppData\Local\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\minecraftWorlds` |
| Steam games | Most auto-cloud, but check `Steam → Settings → Cloud` |
| Epic games | Check each game for cloud saves |

### App Settings to Export
| App | Export Method |
|-----|---------------|
| **Obsidian** | Your vault is just a folder — copy the entire vault folder |
| **AutoHotkey scripts** | Copy your `.ahk` files |
| **ShareX** | Settings → Application → Export...
| **Flow Launcher** | Settings → Plugins → some have export |
| **PowerToys** | Settings → General → Backup settings |
| **Windows Terminal** | `settings.json` is in `AppData\Local\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState` |
| **Cursor IDE** | Settings sync via account is easiest, or copy `AppData\Roaming\Cursor` |
| **Cider** | Login re-downloads everything, but plugins folder if custom |

### Homelab / Server Notes
- Note down any Tailscale auth keys if you have them saved locally
- Export any SSH private keys from `C:\Users\airfr\.ssh\` (or just re-generate)
- Screenshot your current Windows 11 activation status (`Settings → System → Activation`) — should reactivate automatically, but good to know

---

## 1.2 Document Your Current Setup

Screenshot or write down:
1. Your current desktop layout (where icons are, taskbar position)
2. Which apps you actually use daily (not installed, *used*)
3. Your current hotkey setup if you have any
4. Which startup apps you have enabled (`Task Manager → Startup`)
5. Your monitor setup (resolution, scaling %, arrangement if multi-monitor)

---

# PART 2: WINDOWS 11 POST-RESET SETUP

## 2.1 First Boot — The Boring Stuff (Do in This Order)

### Step 1: Windows Update (BEFORE anything else)
- `Settings → Windows Update → Check for updates`
- Keep clicking "Check again" until there's nothing left
- This might take 2-3 reboots. Do it now while everything is clean.

### Step 2: Activate Windows
- `Settings → System → Activation`
- Should auto-activate if hardware hasn't changed
- If not, sign into your Microsoft account — digital license is tied to it

### Step 3: Create Local Admin Account (Optional but recommended)
- If you signed in with Microsoft account, consider adding a local admin too
- `Settings → Accounts → Other users → Add account → I don't have this person's sign-in info → Add a user without a Microsoft account`
- Good backup if MS account has issues

### Step 4: Basic Settings
- `Settings → System → Display` → Set scaling, resolution, Night Light
- `Settings → System → Notifications` → Turn OFF: "Get tips and suggestions," "Suggested content," "Show welcome experience"
- `Settings → System → Focus` → Turn OFF "Show me focus assist notifications in the clock area"
- `Settings → Personalization → Start` → Turn OFF: "Show recently added apps," "Show most used apps," "Show recommendations"
- `Settings → Personalization → Taskbar` → Turn OFF: Task view, Widgets, Chat. Turn ON: "Show badges on taskbar apps"
- `Settings → Privacy & Security → General` → Turn OFF all 4 switches (let apps show me personalized ads, etc.)
- `Settings → Privacy & Security → Activity history` → Turn OFF "Store my activity history"
- `Settings → Privacy & Security → Search permissions` → Turn OFF "Cloud content search" for both Work/School and Microsoft account

---

## 2.2 Debloat Windows 11 (Essential)

### Method A: O&O ShutUp10++ (Easiest, Recommended)
1. Download from `https://www.oo-software.com/shutup10` (official, free, no install needed)
2. Run as administrator
3. Click "Actions → Apply only recommended settings"
4. Manually check these extras (scroll down):
   - Disable Cortana
   - Disable telemetry
   - Disable Windows Hello
   - Disable OneDrive (if not using)
   - Disable "Suggested content" in Settings
   - Disable "Windows Tips"
5. Reboot

### Method B: ThisIsWin11 (More Aggressive)
- `https://github.com/builtbybel/ThisIsWin11`
- Can remove stock apps (Paint 3D, Xbox, etc.)
- Be careful — don't remove Calculator, Photos, or Snipping Tool

### Method C: Winget + PowerShell (For the Brave)
```powershell
# Remove common bloat (run as admin)
Get-AppxPackage Microsoft.XboxApp | Remove-AppxPackage
Get-AppxPackage Microsoft.ZuneMusic | Remove-AppxPackage
Get-AppxPackage Microsoft.ZuneVideo | Remove-AppxPackage
Get-AppxPackage Microsoft.BingNews | Remove-AppxPackage
Get-AppxPackage Microsoft.BingWeather | Remove-AppxPackage
Get-AppxPackage Microsoft.GamingApp | Remove-AppxPackage
Get-AppxPackage Microsoft.GetHelp | Remove-AppxPackage
Get-AppxPackage Microsoft.Getstarted | Remove-AppxPackage
Get-AppxPackage Microsoft.Microsoft3DViewer | Remove-AppxPackage
Get-AppxPackage Microsoft.MicrosoftSolitaireCollection | Remove-AppxPackage
Get-AppxPackage Microsoft.MicrosoftOfficeHub | Remove-AppxPackage
Get-AppxPackage Microsoft.MixedReality.Portal | Remove-AppxPackage
Get-AppxPackage Microsoft.People | Remove-AppxPackage
Get-AppxPackage Microsoft.SkypeApp | Remove-AppxPackage
Get-AppxPackage Microsoft.WindowsFeedbackHub | Remove-AppxPackage
Get-AppxPackage Microsoft.WindowsMaps | Remove-AppxPackage
Get-AppxPackage Microsoft.YourPhone | Remove-AppxPackage
```

### Method D: Winaero Tweaker (Granular Control)
- `https://winaerotweaker.com/`
- One-stop shop for hundreds of tweaks
- Disable ads in Explorer, disable "New" context menu entries, etc.

---

## 2.3 Install Package Manager (Winget)

Should already be on Windows 11, but verify:
```powershell
winget --version
```

If not, install from Microsoft Store: "App Installer"

---

# PART 3: THE ESSENTIAL APP ARSENAL

Install these in order. Grouped by priority.

## 3.1 Tier 1 — Install These FIRST (Same Day)

| # | App | What It Does | Install Method |
|---|-----|-------------|----------------|
| 1 | **Brave Browser** | Fast, privacy-focused, built-in ad blocker | Winget: `winget install BraveSoftware.BraveBrowser` |
| 2 | **Windows Terminal** | Modern terminal with tabs, themes, GPU accel | Winget: `winget install Microsoft.WindowsTerminal` |
| 3 | **PowerToys** (Microsoft) | Official utilities: FancyZones, Color Picker, PowerRename, Keyboard Manager, Always On Top, Text Extractor | Winget: `winget install Microsoft.PowerToys` |
| 4 | **Flow Launcher** | Alt+Space launcher — apps, files, math, web search, clipboard, everything | Winget: `winget install Flow-Launcher.Flow-Launcher` |
| 5 | **Everything** (Voidtools) | Instant file search across ALL drives | `https://voidtools.com/` |
| 6 | **ShareX** | Screenshot god — regions, OCR, auto-save, upload, annotate | Winget: `winget install ShareX.ShareX` |
| 7 | **AutoHotkey v2** | Script engine for hotkeys, macros, automation | `https://autohotkey.com/` |
| 8 | **Bitwarden** or **Vaultwarden** | Password manager (use your homelab vault) | Browser extension + desktop app |
| 9 | **Ditto** | Clipboard history (access last 20+ copies) | Winget: `winget install Ditto.Ditto` |
| 10 | **QuickLook** | Press Space to preview files like macOS | Microsoft Store or GitHub |
| 11 | **7-Zip** | File compression | Winget: `winget install 7zip.7zip` |
| 12 | **Notepad++** | Replace Notepad for real | Winget: `winget install Notepad++.Notepad++` |
| 13 | **EarTrumpet** | Per-app volume control in taskbar | Microsoft Store |
| 14 | **WizTree** | Disk usage analyzer — faster than WinDirStat | `https://diskanalyzer.com/` |
| 15 | **ExplorerPatcher** | Bring back Win10 taskbar, proper right-click, fix Windows 11 Explorer nonsense | `https://github.com/valinet/ExplorerPatcher` |
| 16 | **Files Community** | Modern file explorer with tabs, dual pane, column view | Microsoft Store or GitHub |
| 17 | **DevToys** | Dev utilities: JSON formatter, regex tester, JWT decoder, color picker | Microsoft Store |

## 3.2 Tier 2 — Install Within First Week

| # | App | What It Does | Install Method |
|---|-----|-------------|----------------|
| 18 | **Obsidian** | Knowledge base, notes, markdown | `https://obsidian.md/` |
| 19 | **Cursor IDE** | Your main editor | `https://cursor.com/` |
| 20 | **Discord** | Chat | Winget: `winget install Discord.Discord` |
| 21 | **Spotify** or **Cider** | Music | Spotify: winget. Cider: download from GitHub |
| 22 | **Steam** | Games | `https://store.steampowered.com/` |
| 23 | **Epic Games** | Free games | `https://epicgames.com/` |
| 24 | **LocalSend** | AirDrop for Windows — send files to phone/Mac/Linux over LAN | Winget: `winget install LocalSend.LocalSend` |
| 25 | **Syncthing** | Sync folders to your homelab (Dropbox replacement) | `https://syncthing.net/` |
| 26 | **HandBrake** | Video transcoding, compression | Winget: `winget install HandBrake.HandBrake` |
| 27 | **Snipaste** | Better screenshot pinning (keep screenshots floating on screen) | `https://www.snipaste.com/` |
| 28 | **TeraCopy** | Better file copying with pause/resume/verify | `https://www.codesector.com/teracopy` |
| 29 | **Twinkle Tray** | Brightness control for external monitors in taskbar | Microsoft Store |
| 30 | **TrafficMonitor** | Network speed / CPU / RAM widget in taskbar | GitHub: `https://github.com/zhongyang219/TrafficMonitor` |
| 31 | **Mem Reduct** | Lightweight RAM cleaner (only if you actually need it, 16GB+ probably don't) | GitHub: `https://github.com/henrypp/memreduct` |
| 32 | **Revo Uninstaller** | Clean uninstall — removes leftover registry/files | Winget: `winget install RevoUninstaller.RevoUninstaller` |
| 33 | **Bulk Crap Uninstaller (BCUninstaller)** | Mass uninstall + clean leftovers | Winget: `winget install Klocman.BulkCrapUninstaller` |

## 3.3 Tier 3 — Niche / Power User (Install as Needed)

| # | App | What It Does | Why It's Niche |
|---|-----|-------------|---------------|
| 34 | **Komorebi** | Tiling window manager for Windows | i3wm-like tiling with hotkeys. Not for everyone. |
| 35 | **Espanso** | Text expansion | Type `:sig` → full signature drops. `:em` → email. |
| 36 | **ModernFlyouts** | Replace Windows volume/brightness flyouts with better UI | GitHub: `https://github.com/ModernFlyouts-Community/ModernFlyouts` |
| 37 | **TranslucentTB** | Make taskbar transparent/blur | Microsoft Store |
| 38 | **Rainmeter** | Desktop widgets (system info, weather, Spotify now playing, etc.) | `https://www.rainmeter.net/` |
| 39 | **Wallpaper Engine** | Live / animated wallpapers | Steam (paid but worth it) |
| 40 | **Lively Wallpaper** | Open-source alternative to Wallpaper Engine | Microsoft Store or GitHub |
| 41 | **PowerShell 7** | Better PowerShell | Winget: `winget install Microsoft.PowerShell` |
| 42 | **Starship** | Minimal, fast, customizable shell prompt | `https://starship.rs/` |
| 43 | **Oh My Posh** | Alternative to Starship for PowerShell | `https://ohmyposh.dev/` |
| 44 | **WezTerm** | GPU-accelerated terminal emulator | `https://wezfurlong.org/wezterm/` |
| 45 | **MicaForEveryone** | Force Mica/Acrylic title bars on any app | GitHub: `https://github.com/MicaForEveryone/MicaForEveryone` |
| 46 | **Start11** (paid) or **StartAllBack** (paid) | Replace Start menu / taskbar with better options | `https://www.stardock.com/products/start11/` |
| 47 | **RoundedTB** | Make taskbar corners rounded | Microsoft Store (pairs with TranslucentTB) |
| 48 | **FancyWM** | Another tiling WM, more beginner-friendly than Komorebi | Microsoft Store |
| 49 | **ScreenToGif** | Record screen → GIF (great for bug reports) | Winget: `winget install NickeManarin.ScreenToGif` |
| 50 | **ImageGlass** | Fast image viewer (replaces Photos app) | Winget: `winget install DuongDieuPhap.ImageGlass` |
| 51 | **VLC** | Media player | Winget: `winget install VideoLAN.VLC` |
| 52 | **Notepads** | Modern Notepad replacement (fluent design, tabs) | Microsoft Store |
| 53 | **PeaZip** | Alternative to 7-Zip with better UI | Winget: `winget install Giorgiotani.Peazip` |
| 54 | **Koodo Reader** | E-book reader (epub, pdf, mobi) | GitHub: `https://github.com/troyeguo/koodo-reader` |
| 55 | **PicPick** | Screenshot + image editor + color picker | `https://picpick.app/` |
| 56 | **f.lux** or **Windows Night Light** | Blue light filter | f.lux: `https://justgetflux.com/` |
| 57 | **Process Hacker 2** or **System Informer** | Better Task Manager with deep process info | `https://systeminformer.sourceforge.io/` |
| 58 | **TCPView** | See all network connections in real-time | Microsoft Sysinternals |
| 59 | **AutoDarkMode** | Auto switch Windows / apps between light/dark by time | GitHub: `https://github.com/AutoDarkMode/Windows-Auto-Night-Mode` |
| 60 | **Microsoft Powertoys Run** (part of PowerToys) | Already covered, but worth mentioning separately | Included in PowerToys |
| 61 | **Fluent Search** | Alternative to Flow Launcher (more visual, fluent design) | Microsoft Store |
| 62 | **Listary** | Double-tap Ctrl to search files anywhere | `https://www.listary.com/` |
| 63 | **OneCommander** | Dual-pane file manager (alternative to Files Community) | Microsoft Store |
| 64 | **DuckDuckGo Browser** | Alternative to Brave if you want something lighter | `https://duckduckgo.com/windows` |
| 65 | **Zen Browser** | Firefox-based, minimal, vertical tabs | `https://zen-browser.app/` |

---

# PART 4: OPTIMIZATION (Make It FAST)

## 4.1 Immediate Performance Tweaks

### Visual Effects
- `Settings → System → About → Advanced system settings → Performance Settings`
- Select "Adjust for best performance" OR manually disable:
  - Animations in the taskbar
  - Fade or slide menus into view
  - Show shadows under windows
  - Slide open combo boxes
  - Smooth-scroll list boxes
- Keep ON: "Smooth edges of screen fonts" (text looks bad without it)

### Power Plan (Desktops)
- `Control Panel → Power Options → High performance`
- Or better: `Ultimate Performance` power plan (hidden by default)
  - Open admin PowerShell: `powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61`
  - Then select "Ultimate Performance" in Power Options

### Disable Startup Programs
- `Task Manager → Startup`
- Disable: Spotify, Discord, Epic Games, Steam, Adobe CC, OneDrive, manufacturer bloat
- Keep: Windows Security, audio/GPU drivers

### Storage Sense (Auto-Cleanup)
- `Settings → System → Storage → Storage Sense`
- Turn ON
- Configure:
  - Run Storage Sense: Every month
  - Delete temp files: Every day
  - Delete Recycle Bin: 30 days
  - Delete Downloads: 60 days (or Never)

### Disable Search Indexing (If You Use Everything)
- `Services` (type in Start menu) → Find "Windows Search" → Disable + Stop
- "Everything" app replaces Windows search entirely and is instant
- Frees up disk I/O and CPU

### Disable Superfetch / SysMain (On SSDs with 16GB+ RAM)
- `Services` → "SysMain" → Disable + Stop
- Was useful for HDDs, mostly useless on SSDs

### HAGS (Hardware-Accelerated GPU Scheduling)
- `Settings → System → Display → Graphics → Default graphics settings`
- Turn ON "Hardware-accelerated GPU scheduling" (if available)

### Game Mode
- `Settings → Gaming → Game Mode → ON`
- Also check `Graphics → Default graphics settings → Variable refresh rate` (if supported)

## 4.2 Weekly Maintenance (Automate This)

Create a `.bat` or `.ps1` script to run weekly:

```powershell
# cleanup.ps1 - Run as admin
# Delete temp files
Remove-Item -Path "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "C:\Windows\Temp\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "C:\Windows\Prefetch\*" -Force -ErrorAction SilentlyContinue

# Run disk cleanup
Start-Process -FilePath "cleanmgr.exe" -ArgumentList "/sagerun:1" -Wait

# Optimize drives
Optimize-Volume -DriveLetter C -Analyze
Optimize-Volume -DriveLetter C

# Flush DNS
Clear-DnsClientCache

# Restart (optional)
# Restart-Computer
```

Or use Task Scheduler to run Disk Cleanup + Defrag weekly.

## 4.3 Optional: Registry Tweaks (Advanced)

**Warning:** Backup registry first (`regedit → File → Export`)

```
; Disable Windows Error Reporting
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\Windows Error Reporting]
"Disabled"=dword:00000001

; Disable telemetry
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\DataCollection]
"AllowTelemetry"=dword:00000000

; Faster shutdown
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control]
"WaitToKillServiceTimeout"="2000"

; Faster menu animations
[HKEY_CURRENT_USER\Control Panel\Desktop]
"MenuShowDelay"="0"
```

Or just use Winaero Tweaker — much safer.

---

# PART 5: AESTHETICS (Make It Look NICE)

## 5.1 Taskbar & Start Menu

### ExplorerPatcher Setup
1. Install EP (link in Tier 1)
2. Right-click taskbar → Properties
3. Recommended settings:
   - Taskbar style: Windows 10 (or keep 11 if you like)
   - Primary taskbar position: Bottom
   - Combine taskbar icons: Never combine (shows labels)
   - Center menus: OFF (left-align like Win10)
   - File Explorer: Restore classic context menus
   - Details pane: Enable (show file details on right side)

### TranslucentTB
- Install from Microsoft Store
- Set to "Clear" or "Acrylic" for taskbar
- Hide taskbar line

### RoundedTB (optional)
- Install from Microsoft Store
- Make taskbar corners rounded
- Combine with TranslucentTB

### Remove Widgets / Search / Chat
- Right-click taskbar → Taskbar settings
- Turn OFF: Search, Task view, Widgets, Chat

## 5.2 Desktop

### Wallpaper
- Use **Wallpaper Engine** (Steam) or **Lively Wallpaper** (free)
- Good sources: `wallhaven.cc`, `r/LivingBackgrounds` (Reddit)
- Dark, minimal wallpapers look best with translucent taskbar

### Rainmeter (Desktop Widgets)
1. Install Rainmeter
2. Popular skins:
   - **Mond** — minimal clock + weather
   - **Soniq** — Spotify now playing
   - **Minimalist** — system stats (CPU, RAM, network)
   - **Cleartext** — music display
3. Place widgets in corners, keep center clean
4. Set desktop icons to hidden (`Right-click desktop → View → Show desktop icons`)

### MicaForEveryone
- Forces acrylic/mica effects on app title bars
- Makes everything look cohesive with Windows 11 design

## 5.3 File Explorer

### Files Community
- Replace default explorer with this
- Enable: Tabs, dual pane, column view
- Set as default: Settings → Experimental → "Set Files as default file manager"

### Theme
- `Settings → Personalization → Colors`
- Choose "Dark" mode
- Accent color: Pick something you like (teal, purple, orange)
- Transparency effects: ON (unless performance is bad)

## 5.4 Terminal

### Windows Terminal Setup
1. Open Terminal → Settings
2. Default profile: PowerShell 7 or Command Prompt (your call)
3. Appearance:
   - Color scheme: "One Half Dark" or "Campbell" or install custom
   - Acrylic opacity: 70%
   - Background image: optional (subtle)
4. Font: Install "CaskaydiaCove Nerd Font" or "JetBrainsMono Nerd Font" for icons

### Starship Prompt (Optional)
```powershell
# Install
winget install Starship.Starship

# Add to PowerShell profile
notepad $PROFILE
# Add: Invoke-Expression (&starship init powershell)
```

Create `~/.config/starship.toml` for customization.

## 5.5 Cursor IDE Theme

- Your preferred theme (likely dark)
- Font: JetBrains Mono or Fira Code (with ligatures)
- Extensions: Tailwind CSS IntelliSense, ESLint, Prettier, Auto Rename Tag, etc.

## 5.6 Browser Setup (Brave)

### Migrating TO Brave (From Chrome/Edge/Firefox)
1. **Before you leave dad's / before reset:**
   - In your current browser: go to `chrome://bookmarks` (or equivalent) → Export as HTML
   - Go to password manager → Export passwords as CSV (or just make sure Vaultwarden is synced)
   - Screenshot your extensions bar so you remember what to reinstall
   - Screenshot your pinned tabs / bookmark bar layout
2. **Install Brave** (via winget: `winget install BraveSoftware.BraveBrowser`)
3. **Import data:**
   - Open Brave → `brave://settings/importData`
   - Select your old browser → check bookmarks, passwords, autofill, extensions (if possible)
   - Or: `brave://bookmarks` → Import → select the HTML file you exported
4. **Import extensions:**
   - Brave is Chromium-based, so Chrome extensions work
   - Go to `brave://extensions` → turn on Developer mode → "Load unpacked" or just reinstall from Chrome Web Store
   - Must-haves: Bitwarden/Vaultwarden, uBlock Origin (backup), Dark Reader, SponsorBlock, Return YouTube Dislike, Stylus

### Brave Settings to Configure
1. Settings → Appearance → Brave colors: Dark
2. Settings → Appearance → Show home button: OFF
3. Settings → Appearance → Show bookmarks bar: ON
4. Settings → Appearance → Always show full URLs
5. Settings → Privacy → Block ads and trackers: **Aggressive**
6. Settings → Privacy → Forget me when I close: Enable for sites you don't want tracking
7. Settings → Privacy → Block fingerprinting: **Strict**
8. Settings → Privacy → Block cookies: **Block 3rd-party cookies**
9. Settings → Search engine → Default: DuckDuckGo or Brave Search (your call)
10. Settings → Additional settings → Rewards → **Turn OFF** (unless you actually want crypto notifications)
11. Settings → Additional settings → Wallet → **Turn OFF** (same reason)
12. Settings → Additional settings → News → **Turn OFF** (bloat)
13. Settings → Additional settings → Leo AI → **Turn OFF** (you don't need another AI in your browser)
14. Settings → System → Continue running background apps: **OFF**
15. Settings → System → Startup: **Open the New Tab page** (or "Continue where you left off")

### Extensions to Install
- Bitwarden / Vaultwarden
- uBlock Origin (backup ad blocker — Brave's built-in is good but uBlock is extra insurance)
- Dark Reader (for sites without dark mode)
- SponsorBlock for YouTube (skip sponsored segments)
- Return YouTube Dislike
- Stylus (custom CSS for websites)
- Bypass Paywalls Clean (if you read news articles)
- Video Speed Controller

## 5.7 Custom Cursors & Icons

- **Custom cursors:** `https://www.deviantart.com/tag/cursors` or `https://www.cursor.cc/`
- Install via `Settings → Bluetooth → Mouse → Additional mouse options → Pointers`
- **Icon packs:** `https://www.deviantart.com/tag/windowsicons` or `https://github.com/nek7u/Icon-Preview-for-Total-Commander` (some need 3rd party tools)
- **7TSP** (Se7en Theme Source Patcher) for full icon pack application

---

# PART 6: KEYBOARD WORKFLOW (The Lock-In Setup)

## 6.1 Flow Launcher Configuration

Install → `Alt + Space` opens it

Configure plugins:
- Calculator: ON (`5*5` → instant)
- Web searches: Add `g` for Google, `gh` for GitHub, `yt` for YouTube
- Clipboard history: Enable (or use Ditto separately)
- Program plugin: ON (obviously)
- Shell plugin: ON (`> ping google.com`)
- URL plugin: ON (`github.com/dasvr`)

## 6.2 AutoHotkey v2 — CapsLock Hyper Key

Create `hyper-key.ahk`:

```autohotkey
; ============================================
; CAPSLOCK HYPER KEY SYSTEM
; Hold CapsLock + key for instant actions
; ============================================

#Requires AutoHotkey v2.0

; Make CapsLock a modifier when held, normal when tapped
CapsLock:: {
    Send "{Esc}"  ; Single tap = Escape
}

; CapsLock + Q = Obsidian
CapsLock & q:: Run "C:\Users\airfr\AppData\Local\Obsidian\Obsidian.exe"

; CapsLock + W = Brave Browser
CapsLock & w:: Run "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"

; CapsLock + E = Windows Terminal
CapsLock & e:: Run "wt.exe"

; CapsLock + R = Restart (placeholder — customize)
CapsLock & r:: MsgBox "Restart what? Add your script here."

; CapsLock + T = Cursor IDE
CapsLock & t:: Run "C:\Users\airfr\AppData\Local\Programs\cursor\Cursor.exe"

; CapsLock + A = Spotify / Music
CapsLock & a:: Run "spotify.exe"

; CapsLock + S = Screenshot region (ShareX)
CapsLock & s:: Send "#+s"

; CapsLock + D = Show desktop
CapsLock & d:: Send "#d"

; CapsLock + F = Flow Launcher
CapsLock & f:: Send "!{Space}"

; CapsLock + Z = Undo last window close (reopen)
CapsLock & z:: Send "^+t"  ; Reopen closed tab in browser

; CapsLock + X = Kill foreground app
CapsLock & x:: WinKill "A"

; CapsLock + C = Copy file path
CapsLock & c:: {
    path := Explorer_GetPath()
    A_Clipboard := path
    ToolTip "Copied: " path
    SetTimer () => ToolTip(), -2000
}

; CapsLock + V = Clipboard history (Ditto shortcut)
CapsLock & v:: Send "^+v"  ; Set Ditto shortcut to Ctrl+Shift+V

; CapsLock + B = Battery / system info
CapsLock & b:: {
    ; Shows a quick tooltip with time and basic info
    ToolTip "Battery: " GetBatteryStatus() "`nTime: " FormatTime(, "hh:mm tt")
    SetTimer () => ToolTip(), -3000
}

; CapsLock + N = New Obsidian daily note (if using QuickAdd plugin)
CapsLock & n:: Run "obsidian://new?vault=YourVaultName"

; CapsLock + M = Mute mic
CapsLock & m:: Send "#+a"  ; Windows mic mute shortcut

; CapsLock + Esc = Task Manager
CapsLock & Esc:: Run "taskmgr.exe"

; CapsLock + Tab = Alt-Tab replacement
CapsLock & Tab:: Send "!{Tab}"

; ============================================
; HELPER FUNCTIONS
; ============================================

Explorer_GetPath() {
    if WinActive("ahk_class CabinetWClass") {
        for window in ComObject("Shell.Application").Windows {
            if window.hwnd = WinGetID("A") {
                return window.Document.Folder.Self.Path
            }
        }
    }
    return ""
}

GetBatteryStatus() {
    ; Simple battery check using PowerShell
    psResult := RunWait("powershell -Command `"(Get-WmiObject -Class Win32_Battery).EstimatedChargeRemaining`"",, "Hide")
    return psResult ? psResult "%" : "N/A"
}
```

Save to `C:\Tools\hyper-key.ahk` and create a shortcut in `shell:startup`

## 6.3 PowerToys Setup

### FancyZones (Window Snapping)
1. Open PowerToys → FancyZones
2. Launch layout editor
3. Create a custom layout or pick "Priority Grid"
4. Hold `Shift` while dragging window to snap to zones
5. Or use `Win + Shift + ` (backtick) to open zone picker

### Keyboard Manager
- Remap annoying keys (e.g., remap `Scroll Lock` to `Play/Pause`)
- Or remap `Insert` to something useful

### PowerRename
- Select multiple files → right-click → PowerRename
- Regex-based bulk rename

### Color Picker
- `Win + Shift + C` → pick any color on screen → copies hex code

### Text Extractor (OCR)
- `Win + Shift + T` → select text on screen → copies to clipboard
- Works on images, videos, anything

### Always On Top
- `Win + Ctrl + T` → keeps any window on top

## 6.4 Komorebi (Optional — Tiling WM)

If you want i3wm-like tiling:

1. Install `komorebi` from GitHub releases
2. Also install `whkd` (window hotkey daemon)
3. Create `~/.config/komorebi/komorebi.json`
4. Sample config:

```json
{
  "$schema": "https://raw.githubusercontent.com/LGUG2Z/komorebi/v0.1.28/schema.json",
  "window_hiding_behaviour": "Cloak",
  "cross_monitor_move_behaviour": "Insert",
  "default_workspace_padding": 2,
  "default_container_padding": 2,
  "border": true,
  "border_width": 2,
  "border_colours": {
    "single": "#89b4fa",
    "stack": "#a6e3a1",
    "monocle": "#f38ba8",
    "unfocused": "#1e1e2e"
  },
  "monitors": [
    {
      "workspaces": [
        { "name": "1", "layout": "BSP" },
        { "name": "2", "layout": "VerticalStack" },
        { "name": "3", "layout": "HorizontalStack" },
        { "name": "4", "layout": "UltrawideVerticalStack" },
        { "name": "5", "layout": "BSP" },
        { "name": "6", "layout": "BSP" },
        { "name": "7", "layout": "BSP" },
        { "name": "8", "layout": "BSP" },
        { "name": "9", "layout": "BSP" }
      ]
    }
  ]
}
```

5. Start with: `komorebi.exe --whkd`
6. Add to startup

---

# PART 7: HOMELAB CONNECTION

## 7.1 Essentials to Connect Back

| Service | What You Need |
|---------|---------------|
| **Tailscale** | Install app, sign in, your server is already there |
| **Bitwarden/Vaultwarden** | Browser extension + desktop app pointing to `vault.dasdev.net` |
| **Obsidian + LiveSync** | Install Obsidian, add Self-Hosted LiveSync plugin, point to your CouchDB |
| **Syncthing** | Install, connect to your server, sync Documents/Projects/Downloads |
| **Docker Desktop** | If you want to run containers locally too |

## 7.2 Tailscale Setup
1. Download Tailscale for Windows
2. Sign in with same account as your server
3. Your server (`das-server`) appears automatically
4. You can now access ALL homelab services via their Tailscale IPs
5. Optional: Enable "Use Tailscale subnets" and "Allow incoming connections"

## 7.3 Obsidian LiveSync
1. Install Obsidian
2. Settings → Community plugins → Browse → "Self-Hosted LiveSync"
3. Configure:
   - URI: `https://obsidian.dasdev.net` (or Tailscale IP:5984)
   - Database: `obsidian-sync`
   - Username/password from your CouchDB setup
   - End-to-End Encryption: ON (set passphrase)
4. Enable LiveSync mode
5. Enable "Hidden file sync" for settings/themes/plugins

## 7.4 SSH Access to Server
```powershell
# In Windows Terminal / PowerShell
ssh das@your-server-ip
# Or via Tailscale
ssh das@das-server.tailscale-ip-address
```

Consider adding to `~/.ssh/config`:
```
Host das-server
    HostName your-server-ip
    User das
    IdentityFile ~/.ssh/id_ed25519
```

---

# PART 8: AUTOMATION SETUP (Post-Reset)

## 8.1 Morning Lock-In Script

Create `morning-lockin.ahk`:

```autohotkey
#Requires AutoHotkey v2.0

; Morning Lock-In — run this after waking up

; 1. Open Obsidian daily note
Run "C:\Users\airfr\AppData\Local\Obsidian\Obsidian.exe"
Sleep 2000

; 2. Open browser to project dashboard
Run "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" " --app=https://github.com/DasVR"
Sleep 1000

; 3. Open Cursor to current project
Run "C:\Users\airfr\AppData\Local\Programs\cursor\Cursor.exe" " C:\dev\your-current-project"
Sleep 1000

; 4. Check if homelab is up (simple ping)
RunWait "powershell -Command Test-Connection -ComputerName dasdev.net -Count 1"

; 5. Open Spotify focus playlist
Run "spotify:playlist:your-focus-playlist-id"
Sleep 1000

; 6. Close distracting apps
ProcessClose "Discord.exe"
ProcessClose "Steam.exe"
ProcessClose "EpicGamesLauncher.exe"

; 7. Done
MsgBox "Locked in. Let's work."
```

## 8.2 Evening Wind-Down Script

```autohotkey
#Requires AutoHotkey v2.0

; Evening Wind-Down

; Close all work apps
ProcessClose "cursor.exe"
ProcessClose "obsidian.exe"
WinClose "ahk_exe brave.exe"  ; Close browser (or just specific windows)

; Open Obsidian journal
Run "C:\Users\airfr\AppData\Local\Obsidian\Obsidian.exe"
Sleep 2000

; Open Discord
Run "C:\Users\airfr\AppData\Local\Discord\Update.exe --processStart Discord.exe"

; Open Spotify chill playlist
Run "spotify:playlist:your-chill-playlist-id"

; Optional: clear temp files
RunWait "powershell -Command Remove-Item -Path `$env:TEMP\* -Recurse -Force -ErrorAction SilentlyContinue"
```

## 8.3 Weekly Auto-Cleanup (Task Scheduler)

1. Open `Task Scheduler`
2. Create Basic Task → Name: "Weekly Cleanup"
3. Trigger: Weekly → Sunday → 3:00 AM
4. Action: Start a program
5. Program: `powershell.exe`
6. Arguments: `-File "C:\Tools\weekly-cleanup.ps1"`

Create `C:\Tools\weekly-cleanup.ps1`:
```powershell
# Weekly cleanup
Remove-Item -Path "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "C:\Windows\Temp\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "C:\Windows\Prefetch\*" -Force -ErrorAction SilentlyContinue

# Empty Recycle Bin
Clear-RecycleBin -Force -ErrorAction SilentlyContinue

# Run disk cleanup
Start-Process -FilePath "cleanmgr.exe" -ArgumentList "/sagerun:1" -Wait

# Optimize drives
Get-Volume | Where-Object { $_.DriveType -eq 'Fixed' } | Optimize-Volume

# Restart (optional — comment out if you don't want auto-restart)
# Restart-Computer -Force
```

## 8.4 Context-Aware Desktop (Advanced)

AutoHotkey script that detects WiFi network and changes behavior:

```autohotkey
#Requires AutoHotkey v2.0
#Persistent

; Check WiFi every 30 seconds
SetTimer CheckNetwork, 30000
CheckNetwork() {
    ; Get current SSID using netsh
    result := RunWait("powershell -Command `"(netsh wlan show interfaces) -match 'SSID' -replace '.*: ' | Select-Object -First 1`"",, "Hide")
    
    if (result = "Home-5G") {
        ; At home — full setup
        ; (Optional: run morning script, open work apps)
    }
    else if (result = "School-Guest") {
        ; At school — DND mode
        ; Block distracting sites via hosts file or firewall
    }
    else if (result = "iPhone") {
        ; On hotspot — kill sync, battery saver
        ; Stop Syncthing, Obsidian sync, etc.
    }
}
```

---

# PART 9: QUICK REFERENCE SHEET

## Essential Hotkeys to Memorize (Day 1)

| Hotkey | Action |
|--------|--------|
| `Alt + Space` | Flow Launcher |
| `CapsLock + Q` | Obsidian |
| `CapsLock + W` | Browser |
| `CapsLock + E` | Terminal |
| `CapsLock + T` | Cursor IDE |
| `CapsLock + S` | Screenshot region |
| `CapsLock + V` | Clipboard history |
| `CapsLock + Esc` | Task Manager |
| `Win + V` | Windows native clipboard (backup) |
| `Win + Shift + S` | Windows screenshot |
| `Win + .` or `Win + ;` | Emoji picker |
| `Win + Ctrl + D` | New virtual desktop |
| `Win + Ctrl + F4` | Close virtual desktop |
| `Win + Tab` | Task view / desktops |
| `Win + Shift + C` | PowerToys Color Picker |
| `Win + Shift + T` | PowerToys Text Extractor (OCR) |
| `Win + Ctrl + T` | PowerToys Always On Top |
| `Space` (in file manager) | QuickLook preview |

## Winget One-Liner Install (Copy-Paste)

```powershell
# Tier 1 essentials
winget install BraveSoftware.BraveBrowser
winget install Microsoft.WindowsTerminal
winget install Microsoft.PowerToys
winget install Flow-Launcher.Flow-Launcher
winget install ShareX.ShareX
winget install Ditto.Ditto
winget install 7zip.7zip
winget install Notepad++.Notepad++
winget install EarTrumpet.EarTrumpet
winget install Microsoft.PowerShell
winget install RevoUninstaller.RevoUninstaller
winget install Klocman.BulkCrapUninstaller
winget install HandBrake.HandBrake
winget install VideoLAN.VLC
winget install NickeManarin.ScreenToGif
winget install DuongDieuPhap.ImageGlass

# Dev tools
winget install Git.Git
winget install NodeJS.NodeJS
winget install Python.Python.3.11

# Optional
winget install Discord.Discord
winget install Spotify.Spotify
winget install Valve.Steam
```

---

# PART 10: CHECKLIST (Print This)

## Before Reset
- [ ] Backup Documents, Downloads, Pictures, Videos, Desktop
- [ ] Export browser bookmarks + passwords
- [ ] Backup Minecraft saves
- [ ] Copy AutoHotkey scripts
- [ ] Copy Obsidian vault
- [ ] Screenshot current desktop layout
- [ ] Note down startup apps
- [ ] Verify Windows activation status
- [ ] Note down monitor settings

## After Reset — Day 1
- [ ] Run all Windows Updates (repeat until none left)
- [ ] Activate Windows
- [ ] Run O&O ShutUp10++ (recommended settings)
- [ ] Install Winget apps (Tier 1)
- [ ] Set up PowerToys (FancyZones, Color Picker, Keyboard Manager)
- [ ] Install Flow Launcher + configure plugins
- [ ] Install Everything + disable Windows Search service
- [ ] Configure ShareX (save location, hotkeys, after-capture actions)
- [ ] Set up CapsLock hyper key script
- [ ] Install browser + sign in to Bitwarden/Vaultwarden
- [ ] Install Obsidian + connect to LiveSync
- [ ] Install Tailscale + connect to homelab
- [ ] Install Discord, Spotify, Steam

## After Reset — Week 1
- [ ] Install Tier 2 apps
- [ ] Set up AutoDarkMode (if using)
- [ ] Configure Windows Terminal (theme, font)
- [ ] Install and configure Rainmeter (if using widgets)
- [ ] Set up wallpaper (Wallpaper Engine / Lively)
- [ ] Install ExplorerPatcher + configure
- [ ] Install TranslucentTB + RoundedTB (if using)
- [ ] Set up Files Community as default file manager
- [ ] Create morning + evening AutoHotkey scripts
- [ ] Create weekly cleanup Task Scheduler job
- [ ] Verify all homelab services accessible
- [ ] Test Obsidian sync across devices
- [ ] Verify Tailscale connection stable

## After Reset — Month 1
- [ ] Install Tier 3 niche apps as needed
- [ ] Set up Komorebi (if trying tiling WM)
- [ ] Configure Starship or Oh My Posh prompt
- [ ] Set up context-aware desktop (advanced)
- [ ] Document your final setup (so you can rebuild even faster next time)
- [ ] Consider adding new homelab services (see MASTER-AUTOMATION-DOC)

---

## Related Documents

- `THE-ULTIMATE-WORKFLOW-DOCUMENT.md` — Full keyboard workflow, PARA method, Obsidian server setup
- `MASTER-AUTOMATION-DOC.md` — Homelab services, networking, automation ideas
- `MASTER-PLAN.md` — Your overall project roadmap
- `OBSIDIAN-AI-PLAN.md` — Obsidian AI system architecture

---

*Last updated by Finn — your twin, your hype man, your accountability bro.*
*Questions? Just ask. Locked in.*
