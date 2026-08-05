# WINDOWS 11 — NICHE APPS & DEEP CUSTOMIZATION GUIDE
## Arriq's Hidden Gems Collection

**Last updated:** 2026-08-05
**Purpose:** Beyond the basics — notifications, aesthetics, power tools, and apps you won't find in top-10 lists
**Companion to:** `WINDOWS-11-RESET-MASTER-GUIDE.md` (the essentials are there, this is the deep cut)

---

# PART 1: NOTIFICATION OVERHAUL

## 1.1 ModernFlyouts — Better Volume/Brightness/Airplane Flyouts

The default Windows 11 volume/brightness popups are ugly. This replaces them.

- **GitHub:** `https://github.com/ModernFlyouts-Community/ModernFlyouts`
- **Winget:** `winget install ModernFlyouts.ModernFlyouts`
- **What it replaces:** Volume OSD, brightness OSD, airplane mode, caps/num/scroll lock indicators
- **Best settings:**
  - TopBar layout (sleek bar at top of screen)
  - Acrylic background + rounded corners
  - Disable lock key flyouts if you don't need them
  - Set timeout to 2 seconds

## 1.2 Noti — Custom Toast Notifications

Windows toast notifications are boring. Noti lets you create custom notification popups with HTML/CSS.

- **GitHub:** `https://github.com/noti-org/noti`
- **Why it's cool:** Custom notification sounds, custom styling, notification history with search, rules engine (mute certain apps during focus hours)
- **Setup:** Install → pick a theme → set rules for which apps can notify you and when

## 1.3 BurntToast (PowerShell Module)

Send custom Windows toast notifications from scripts. Insane for automation.

```powershell
Install-Module -Name BurntToast -Force
New-BurntToastNotification -Text "Build complete", "Your Docker image is ready" -AppLogo C:\Tools\icon.png
```

- **Use cases:**
  - Long-running script finishes → toast
  - Server goes down → toast
  - Morning routine script → "Good morning, here's your schedule"
  - Combine with cron jobs or Task Scheduler

## 1.4 SnoreToast

Command-line toast notifications. Lighter than BurntToast, works in any language.

- **GitHub:** `https://github.com/KDE/snoretoast`
- **Usage:** `snoretoast -t "Title" -m "Message" -p icon.png`
- **Why:** If you write Python/Node scripts and want native Windows toasts without PowerShell

## 1.5 Notification Visualizer

See every notification your system sends — great for debugging which app is spamming you.

- **Microsoft Store:** Search "Notification Visualizer"
- **Use:** Find hidden notification sources, test your custom toast designs

---

# PART 2: TASKBAR & SHELL MODS (Beyond TranslucentTB)

## 2.1 Windhawk — The Taskbar Modding Platform

This is THE tool for deep taskbar customization. Modular, safe, huge mod library.

- **Website:** `https://windhawk.net/`
- **Must-install mods:**
  - **Taskbar height and icon size** — make taskbar thinner or thicker, smaller/bigger icons
  - **Taskbar clock customization** — show seconds, custom format, multiple timezones
  - **Taskbar volume control** — click volume icon → opens EarTrumpet instead of default
  - **Disable taskbar grouping** — never combine, always show labels (Win10 style)
  - **Taskbar on top for fullscreen** — keep taskbar visible over fullscreen apps
  - **Middle-click to close** — middle-click taskbar icon to close app
  - **Taskbar notification badges** — proper unread count badges on taskbar icons
  - **Aero Peek delay remover** — instant preview on hover

## 2.2 ExplorerPatcher (Already in master guide, but deeper config)

- **Hidden gems in EP:**
  - Restore Windows 10 ribbon in File Explorer
  - Disable the "recommended" section in Start menu
  - Restore classic Alt+Tab (no Edge tabs mixed in)
  - Disable Windows 11 context menu (always show full right-click menu)
  - Weather widget in taskbar (Win10 style, not the bloated Win11 one)

## 2.3 StartAllBack (Paid, $5 — Worth It)

- **Website:** `https://www.startallback.com/`
- **What it does better than ExplorerPatcher:**
  - More Start menu styles (Win7, Win10, Win11)
  - Segments taskbar (separate areas for different icon groups)
  - Dynamic transparency (taskbar goes opaque when window is maximized)
  - Better dark mode integration
  - Explorer ribbon customization

## 2.4 TaskbarXI — Collapse Taskbar to Dock

Turns your taskbar into a macOS-style centered dock.

- **GitHub:** `https://github.com/ChrisAnd1998/TaskbarXI`
- **Best with:** TranslucentTB set to "Clear"
- **Warning:** Can be buggy on some Win11 builds. Backup first.

## 2.5 T-Clock Redux — Customize the System Tray Clock

- **GitHub:** `https://github.com/White-Tiger/T-Clock`
- **What you can do:**
  - Custom date/time format (e.g., `ddd MM/DD · hh:mm:ss tt`)
  - Multiple timezones in tooltip
  - Click clock → custom action (open calendar, run script)
  - Change clock font, color, size independently
  - Show CPU/RAM in clock area

---

# PART 3: FILE EXPLORER ALTERNATIVES (Beyond Files Community)

## 3.1 OneCommander — The Beautiful Dual-Pane Explorer

- **Microsoft Store** or `https://onecommander.com/`
- **Why it's different:**
  - Miller columns (macOS Finder style) — navigate deep folders without losing context
  - Built-in file preview pane (images, text, code, PDF)
  - Tags, favorites, and color-coded folders
  - Theming engine (dark, light, custom)
  - Folder sizes calculated automatically
  - Tabs + dual pane simultaneously

## 3.2 Sigma File Manager

- **GitHub:** `https://github.com/aleksey-hoffman/sigma-file-manager`
- **Vibe:** Cyberpunk/modern, heavily customizable
- **Features:**
  - Workspaces (save open folders as a workspace)
  - Smart global search with filters
  - File protection (password-lock folders)
  - Wireless file sharing
  - Custom CSS themes

## 3.3 Spacedrive

- **Website:** `https://www.spacedrive.com/`
- **The pitch:** "One explorer for all your files, across all your devices"
- **Why it's cool:**
  - See files from your homelab, local drives, cloud — all in one app
  - Rust-based, fast as hell
  - Built-in tagging and collections
  - AI-powered search (optional)
  - Open source, actively developed

## 3.4 QTTabBar — Add Tabs to Default Explorer

If you don't want to replace Explorer entirely, just add tabs to it.

- **Website:** `http://qttabbar.wikidot.com/`
- **Features:**
  - Tabs in native File Explorer
  - Folder grouping
  - Custom toolbar buttons
  - Plugin system
  - Works with Windows 10 and 11

---

# PART 4: DESKTOP WIDGETS & OVERLAYS (Beyond Rainmeter)

## 4.1 JaxCore — Modern Widget Suite

- **Website:** `https://jaxcore.app/`
- **What it is:** A modern, actively-developed widget platform (Rainmeter alternative)
- **Widgets included:**
  - Clock, weather, system stats
  - Music visualizer
  - Spotify now playing
  - Calendar
  - Quote of the day
  - Custom widgets via HTML/CSS/JS
- **Why over Rainmeter:** More modern, easier to configure, better performance

## 4.2 BeWidgets

- **Microsoft Store**
- **Simple widgets:** Clock, date, weather, battery, CPU, RAM
- **Why:** If you want widgets but Rainmeter is too much work. Clean, minimal, just works.

## 4.3 Desktop Info (DInfo)

- **Website:** `https://www.glenn.delahoy.com/software/desktopinfo/`
- **What it does:** Overlays system info directly on your wallpaper (not a widget — it's baked into the background)
- **Shows:** CPU, RAM, disk, network, uptime, IP, processes, services
- **Why it's cool:** Zero CPU usage when not updating, always visible, survives explorer restarts

## 4.4 SysDVR — System Stats Overlay

- **GitHub:** `https://github.com/exelban/sysdvr`
- **What it does:** Hardware monitor overlay (like MSI Afterburner but cleaner)
- **Shows:** CPU/GPU temp, usage, clock, FPS, RAM, network
- **Why:** If you want to see your system stats without opening Task Manager

---

# PART 5: AUDIO & VOLUME MODS

## 5.1 EarTrumpet (Already in master guide, but deeper)

- **Hidden features:**
  - Per-app volume with keyboard shortcuts (set in EarTrumpet settings)
  - Move audio between output devices without opening Sound settings
  - Default playback device per-app (e.g., Spotify → headphones, Discord → speakers)

## 5.2 Volumey — Hotkey Volume Control

- **GitHub:** `https://github.com/G-Stas/Volumey`
- **What it does:** Map any hotkey to control volume of specific apps
- **Example:** `Ctrl+Shift+Up` = Spotify volume up, `Ctrl+Shift+Down` = Spotify volume down
- **Why:** You're already building a hyper key system — this takes it further

## 5.3 FxSound — System-Wide Audio Enhancer

- **Website:** `https://www.fxsound.com/`
- **What it does:** EQ, bass boost, surround, clarity — applied to ALL audio
- **Why it's niche:** Most people don't know Windows has no built-in system EQ. This fixes that.
- **Presets:** Gaming, movies, music, voice — or make your own

## 5.4 SteelSeries Sonar (Free, No Hardware Required)

- **Website:** `https://steelseries.com/gg/sonar`
- **What it does:** Virtual audio mixer with per-app routing
- **Features:**
  - Separate channels for game, chat, media, mic
  - Per-channel EQ, compression, noise gate
  - Streamer mode (separate stream mix)
  - Spatial audio
- **Why it's insane:** This is pro audio routing that used to cost $100+. Free.

## 5.5 SoundSwitch — Hotkey Audio Device Switcher

- **Website:** `https://soundswitch.aaflalo.me/`
- **What it does:** `Ctrl+Alt+F11` → cycle between headphones/speakers/headset
- **Why:** Windows audio switching is 3 clicks deep. This is instant.

---

# PART 6: WINDOW MANAGEMENT (Beyond FancyZones)

## 6.1 AltSnap — Drag Windows Without Title Bar

- **GitHub:** `https://github.com/RamonUnch/AltSnap`
- **What it does:** Hold Alt + click anywhere on a window to drag it. No need to grab the title bar.
- **Also:** Alt + right-click anywhere to resize. Alt + scroll to change opacity.
- **Why it's a game-changer:** Especially on small screens or with tiling WMs

## 6.2 SmartSystemMenu — Add Features to Every Window

- **GitHub:** `https://github.com/AlexanderPro/SmartSystemMenu`
- **What it adds to every window's title bar menu:**
  - Always on top
  - Transparency (make any window semi-transparent)
  - Minimize to tray
  - Priority (set CPU priority per-window)
  - Clipboard (copy window title, screenshot window)
  - Resize to preset dimensions
  - Align window to corners/edges

## 6.3 WindowTop — Pin Windows, Dark Mode, Transparency

- **Website:** `https://windowtop.info/`
- **Features:**
  - Pin any window on top (better than PowerToys Always On Top — more options)
  - Dark mode for any window (forces dark mode on apps that don't support it)
  - Transparency slider per-window
  - Click-through mode (make a window transparent and click through it)
  - Shrink mode (minimize window to a tiny floating bar)

## 6.4 Groupy 2 (Paid, Part of Object Desktop)

- **Website:** `https://www.stardock.com/products/groupy/`
- **What it does:** Drag windows together → they become tabs in one window
- **Example:** Drag Cursor IDE + Terminal + Browser → one window with 3 tabs
- **Why:** If you work on one project at a time, this is cleaner than virtual desktops

## 6.5 MaxTo — Custom Window Regions

- **Website:** `https://maxto.net/`
- **What it does:** Define custom screen regions, then maximize windows INTO those regions
- **Why over FancyZones:** More precise, remembers per-app positions, works with multi-monitor better

---

# PART 7: CONTEXT MENU MODS

## 7.1 Nilesoft Shell — Modern Context Menu Replacement

- **GitHub:** `https://github.com/moudey/Shell`
- **What it does:** Completely replaces the right-click context menu with a modern, customizable one
- **Features:**
  - Fluent design, acrylic, dark mode
  - Custom menu items (add your own scripts)
  - File/folder/desktop/background — different menus for each
  - Built-in: copy path, open in terminal, checksum, take ownership
  - JavaScript-based config (easy to customize)

## 7.2 Custom Context Menu — Add Your Own Items

- **Tool:** `https://github.com/ikas-mc/ContextMenuForWindows11`
- **What to add:**
  - "Open in Cursor" on any folder
  - "Copy as Markdown link"
  - "Optimize image" (run through your script)
  - "Upload to server" (scp to homelab)
  - "New note in Obsidian" (create note from selected file)

## 7.3 OpenHashTab — File Hashes in Properties

- **GitHub:** `https://github.com/namazso/OpenHashTab`
- **What it does:** Adds a "Hashes" tab to file properties
- **Shows:** MD5, SHA-1, SHA-256, SHA-512, CRC32, and more
- **Why:** Verify downloads, check file integrity, compare files

---

# PART 8: LOCK SCREEN & LOGIN CUSTOMIZATION

## 8.1 Lockscreen as Wallpaper

- **Tool:** Windows Settings → Personalization → Lock screen → "Show lock screen background picture on the sign-in screen"
- **But better:** Use a script to sync your current wallpaper to lock screen automatically

## 8.2 Custom Login UI (Advanced)

- **Tool:** `https://github.com/ADeltaX/LoginCustomizer` (use with caution, modifies system files)
- **What you can change:** Login background, button colors, text, opacity, blur intensity
- **Warning:** Backup first. Windows updates can break this.

## 8.3 IdleLock — Auto-Lock with Style

- **Tool:** Built-in Windows + AutoHotkey
- **Script idea:** After 2 minutes idle → fade screen to black → lock. Custom lock animation.

---

# PART 9: CURSORS, ICONS & FONTS (Deep Dive)

## 9.1 Custom Cursor Packs

- **Sources:**
  - `https://www.deviantart.com/tag/cursors` — huge community
  - `https://github.com/ful1e5/Bibata_Cursor` — modern, smooth, multiple colors
  - `https://github.com/ful1e5/Apple_Cursor` — macOS-style cursors on Windows
  - `https://github.com/antiden/macOS-cursors-for-Windows` — another macOS option
- **Install:** Settings → Bluetooth → Mouse → Additional mouse options → Pointers → Browse

## 9.2 7TSP GUI — Full Icon Pack Installer

- **Website:** `https://www.deviantart.com/devillnside/art/7TSP-GUI-2019-Edition-804769422`
- **What it does:** Apply full system icon packs (folder icons, file type icons, control panel icons, etc.)
- **Good packs:**
  - **Lumicons** — colorful, modern
  - **Buuf** — cartoon/hand-drawn
  - **Numix** — flat, Linux-inspired
  - **Papirus** — another Linux port, very clean

## 9.3 Custom Folder Icons (Per-Folder)

- **Tool:** Right-click folder → Properties → Customize → Change Icon
- **Icon sources:**
  - `https://icon-icons.com/` — searchable, downloadable .ico files
  - `https://www.iconfinder.com/` — huge library
  - `https://feathericons.com/` — minimal, open source
- **Pro tip:** Color-code your project folders (red = active, green = done, yellow = waiting)

## 9.4 Font Management

- **Nerd Fonts:** `https://www.nerdfonts.com/` — patched fonts with icons for terminal/IDE
  - **Best for you:** JetBrainsMono Nerd Font, CaskaydiaCove Nerd Font, FiraCode Nerd Font
- **FontBase** — free font manager (like a font library)
  - `https://fontba.se/`
  - Activate/deactivate fonts without installing
  - Google Fonts + local fonts in one place
- **NexusFont** — alternative, lighter
  - `https://www.xiles.app/`

---

# PART 10: TERMINAL ECOSYSTEM (Beyond Windows Terminal)

## 10.1 WezTerm — GPU-Accelerated, Lua-Configurable

- **Website:** `https://wezfurlong.org/wezterm/`
- **Why over Windows Terminal:**
  - Lua config (programmable, not just JSON)
  - Built-in multiplexer (tmux-like panes without tmux)
  - GPU rendering (smoother scrolling, better performance)
  - Tabs + panes in one window
  - Search with regex
  - Hyperlink support
  - Image protocol (view images in terminal)

## 10.2 Warp Terminal (Windows Beta)

- **Website:** `https://www.warp.dev/`
- **What's different:**
  - AI-powered command suggestions
  - Command blocks (output grouped with the command that produced it)
  - Shared notebooks (save commands + output as a doc)
  - Modern UI, built-in IDE-like features
- **Warning:** Requires account. Not fully open source.

## 10.3 Tabby (Formerly Terminus)

- **Website:** `https://tabby.sh/`
- **Features:**
  - Built-in SSH client with connection manager
  - Serial terminal
  - SFTP client
  - Plugin system
  - Themes and customization
  - Cross-platform (same config on Windows + Linux)

## 10.4 Terminal.Gui — Build Terminal UIs in C#/.NET

- **GitHub:** `https://github.com/gui-cs/Terminal.Gui`
- **Why it's cool:** Build full TUI apps (like htop, lazygit) in C#. If you ever want to make a CLI tool with a nice interface.

---

# PART 11: SYSTEM MONITORING (Niche & Beautiful)

## 11.1 Btop++ — Beautiful System Monitor

- **GitHub:** `https://github.com/aristocratos/btop4win`
- **What it is:** The Linux btop++ ported to Windows. Gorgeous terminal-based system monitor.
- **Shows:** CPU per-core, RAM, disks, network, processes (with tree view)
- **Why:** It's just beautiful. Terminal eye candy that's actually useful.

## 11.2 NZXT CAM (Free, No Hardware Required)

- **Website:** `https://nzxt.com/software/cam`
- **What it does:** Hardware monitoring with a clean UI
- **Features:**
  - FPS overlay in games
  - GPU/CPU temp, clock, usage
  - Time played per game
  - Clean, modern design
- **Why over HWMonitor:** Better UI, game overlay, free

## 11.3 HWiNFO + Rainmeter Integration

- **HWiNFO:** `https://www.hwinfo.com/`
- **Why:** The most detailed hardware info tool. Pairs with Rainmeter to show real-time stats on desktop.
- **Setup:** HWiNFO → Sensors → Configure → enable shared memory → Rainmeter plugin reads it

## 11.4 NetSpeedMonitor (Revived)

- **GitHub:** `https://github.com/Ardiloot/NetSpeedMonitor`
- **What it does:** Shows current upload/download speed in taskbar
- **Why:** TrafficMonitor is good, but this is lighter and sits in the taskbar itself

---

# PART 12: AUTOMATION (Beyond AutoHotkey)

## 12.1 Espanso — Text Expansion on Steroids

- **Website:** `https://espanso.org/`
- **What it does:** Type `:sig` → full email signature. `:date` → today's date. `:shrug` → ¯\_(ツ)_/¯
- **Advanced:**
  - Dynamic matches (regex triggers)
  - Form filling (`:meeting` → fills in date, time, attendees template)
  - Shell integration (trigger a script from a text expansion)
  - App-specific expansions (different expansions in Cursor vs Discord)
- **Config file:** `C:\Users\airfr\AppData\Roaming\espanso\match\base.yml`

## 12.2 AutoHotkey v2 — Beyond the Hyper Key

- **Script ideas you haven't done yet:**
  - **Window tiler:** `CapsLock + Arrow keys` → snap window to half/quarter of screen
  - **Quick math:** Select `5*5+3` in any text → `CapsLock + M` → replaces with `28`
  - **Quick Google:** Select text → `CapsLock + G` → opens Google search in browser
  - **Quick translate:** Select text → `CapsLock + Y` → opens Google Translate
  - **Quick define:** Select word → `CapsLock + D` → opens dictionary
  - **Paste as plain text:** `CapsLock + Shift + V` → strips formatting, pastes plain
  - **Quick note:** `CapsLock + N` → opens a popup, type note, saves to Obsidian inbox
  - **Screenshot → OCR → clipboard:** `CapsLock + O` → screenshot region → extract text → copy

## 12.3 Power Automate Desktop (Free with Windows 11)

- **What it is:** Microsoft's RPA (robotic process automation) tool. Built into Windows 11.
- **Use cases:**
  - Auto-download bank statements every month
  - Auto-organize downloads folder by file type
  - Auto-backup specific folders to homelab
  - Auto-fill repetitive web forms
- **Why:** No code, visual drag-and-drop, free, already on your PC

## 12.4 n8n (Self-Hosted on Homelab)

- **Website:** `https://n8n.io/`
- **What it is:** Open-source Zapier/Make alternative
- **Why on your homelab:** Automate workflows between your services
- **Example:** "When I save a file in this folder → upload to server → send me a notification"

---

# PART 13: PRIVACY & SECURITY (Niche Tools)

## 13.1 Safing Portmaster — Per-App Firewall

- **Website:** `https://safing.io/portmaster/`
- **What it does:** See every connection every app makes. Block them per-app, per-domain.
- **Why it's better than Windows Firewall:** Real-time, per-domain blocking, DNS-level blocking, SPN (encrypted DNS)
- **Example:** Block Discord telemetry but allow chat. Block Windows telemetry entirely.

## 13.2 WPD — Windows Privacy Dashboard

- **Website:** `https://wpd.app/`
- **What it does:** One-click disable telemetry, Cortana, Edge, OneDrive, Xbox, and more
- **Why over O&O ShutUp10:** More aggressive, more options, firewall rules included

## 13.3 Simplewall — Simple Firewall

- **GitHub:** `https://github.com/henrypp/simplewall`
- **What it does:** Simple, clean firewall frontend for Windows Filtering Platform
- **Features:** Block per-app, whitelist mode, block Windows spying, import/export rules

## 13.4 ThisIsWin11 (Now ThisIsWin11)

- **GitHub:** `https://github.com/builtbybel/ThisIsWin11`
- **What it does:** All-in-one Windows 11 tweaker — debloat, privacy, customization
- **Features:** Remove bloatware, disable telemetry, customize taskbar/start, install essential apps

---

# PART 14: PRODUCTIVITY (Niche & Underground)

## 14.1 Twinkle Tray — Monitor Brightness from Taskbar

- **Microsoft Store**
- **What it does:** Control external monitor brightness from taskbar (like a laptop)
- **Why:** Most desktop monitors require reaching for physical buttons. This is software DDC/CI control.

## 14.2 Monitorian — Alternative to Twinkle Tray

- **Microsoft Store**
- **More features:** Per-monitor brightness, contrast, color temperature
- **Why:** If Twinkle Tray isn't enough

## 14.3 Caffeine — Keep PC Awake

- **GitHub:** `https://github.com/zhongyang219/Caffeine`
- **What it does:** One-click prevent sleep/screensaver. Sits in system tray.
- **Why:** Better than changing power settings every time you need to keep PC awake

## 14.4 PowerPlanSwitcher — Auto-Switch Power Plans

- **GitHub:** `https://github.com/petrroll/PowerSwitcher`
- **What it does:** Auto-switch between power plans based on:
  - AC vs battery
  - Specific apps running (game → high performance, idle → power saver)
  - Time of day
- **Why:** You set up Ultimate Performance in the master guide — this automates when to use it

## 14.5 Fan Control — Custom Fan Curves

- **GitHub:** `https://github.com/Rem0o/FanControl.Releases`
- **What it does:** Control every fan in your system with custom curves
- **Features:**
  - Mix sensors (e.g., fan speed = max of CPU + GPU temp)
  - Custom curves (flat, linear, graph-based)
  - Save/load profiles
  - Works with most motherboards and GPUs
- **Why:** Quieter PC when idle, cooler when gaming. BIOS fan curves are usually trash.

## 14.6 DisplayFusion (Paid, Often on Sale)

- **Website:** `https://www.displayfusion.com/`
- **What it does:** The ultimate multi-monitor tool
- **Features:**
  - Per-monitor taskbars (taskbar on each screen showing only that screen's windows)
  - Per-monitor wallpapers (different wallpaper on each monitor)
  - Monitor profiles (save/load monitor configs)
  - Window snapping across monitors
  - Custom title bar buttons
  - Trigger scripts on monitor change
- **Why for you:** Your second monitor issue — DisplayFusion can force-detect and configure displays

## 14.7 Barrier / Input Leap — Share Mouse & Keyboard Across PCs

- **GitHub:** `https://github.com/input-leap/input-leap`
- **What it does:** Use one mouse + keyboard across multiple computers (like Synergy but open source)
- **Why:** If you ever have a laptop + desktop setup, or your homelab has a monitor

---

# PART 15: CREATIVE & DESIGN TOOLS

## 15.1 PureRef — Reference Image Board

- **Website:** `https://www.pureref.com/`
- **What it does:** Infinite canvas for reference images. Drag images in, arrange them, always on top.
- **Why:** If you do any design work, web dev, or art — this is essential. Free (pay what you want).

## 15.2 Figwheel — Live CSS/HTML Preview

- **Not an app, a workflow:** Use Cursor + Live Server extension + browser DevTools
- **But also:** `https://github.com/ritwickdey/vscode-live-server` for instant preview

## 15.3 ScreenToGif (Already in master guide, but deeper)

- **Hidden features:**
  - Edit frames individually (delete, crop, add text per-frame)
  - Export as video, GIF, APNG, WebP
  - Record webcam + screen simultaneously
  - Built-in editor with transitions, captions, watermarks

## 15.4 OBS Studio + Aitum Multistream

- **OBS:** `https://obsproject.com/`
- **Aitum:** Vertical plugin for OBS — stream/record vertical + horizontal simultaneously
- **Why:** If you ever want to record content for TikTok/Reels/Shorts AND YouTube from one OBS instance

---

# PART 16: FILE SHARING & SYNC (Beyond Syncthing)

## 16.1 LocalSend — AirDrop for Everything

- **Website:** `https://localsend.org/`
- **What it does:** Send files between Windows, Mac, Linux, iPhone, Android — over LAN, no internet
- **Why:** Faster than email, no size limit, no cloud, encrypted

## 16.2 PairDrop — Web-Based AirDrop

- **Website:** `https://pairdrop.net/`
- **What it does:** Open website on both devices → they find each other → send files
- **Why:** No install needed. Works on any device with a browser.

## 16.3 Croc — CLI File Transfer

- **GitHub:** `https://github.com/schollz/croc`
- **What it does:** Send files/folders between computers with a code phrase
- **Usage:** `croc send file.txt` → gives you a code → `croc <code>` on other computer
- **Why:** Fast, encrypted, relay-based (works across NAT), no setup

## 16.4 Wormhole — Another CLI Option

- **GitHub:** `https://github.com/magic-wormhole/magic-wormhole`
- **Similar to Croc:** Send files/folders/text with a code phrase
- **Why pick one:** Croc has resume support, Wormhole is simpler

---

# PART 17: MEDIA & ENTERTAINMENT

## 17.1 Cider — Apple Music Client (You Know This)

- **Your plugins:** Already covered
- **New idea:** Create a Cider plugin that shows your currently playing song in a Rainmeter widget

## 17.2 Spotify-TUI — Terminal Spotify Client

- **GitHub:** `https://github.com/Rigellute/spotify-tui`
- **What it does:** Browse and control Spotify from terminal
- **Why:** Looks cool, keyboard-only, pairs with btop++ for a full terminal aesthetic

## 17.3 ncspot — Another Terminal Spotify Client

- **GitHub:** `https://github.com/hrkfdn/ncspot`
- **Why over spotify-tui:** More features, better performance, actively maintained

## 17.4 MPV — The Best Video Player

- **Website:** `https://mpv.io/`
- **Why over VLC:** Lighter, faster, better upscaling, scriptable (Lua), no UI chrome (just the video)
- **Config:** `C:\Users\airfr\AppData\Roaming\mpv\mpv.conf`
- **Must-have scripts:**
  - **modernx** / **modernz** — adds a modern OSC (on-screen controller)
  - **autoload** — auto-load playlist from folder
  - **sponsorblock** — skip YouTube sponsored segments in MPV
  - **thumbfast** — thumbnail preview on hover

## 17.5 yt-dlp — YouTube Downloader (CLI)

- **GitHub:** `https://github.com/yt-dlp/yt-dlp`
- **What it does:** Download videos/audio from YouTube + 1000+ other sites
- **Usage:** `yt-dlp -f "bestvideo+bestaudio" <url>` for best quality
- **Audio only:** `yt-dlp -x --audio-format mp3 <url>`
- **Why:** Way more powerful than any GUI downloader

---

# PART 18: DEVELOPER TOOLS (Niche)

## 18.1 DevToys — Swiss Army Knife for Devs

- **Microsoft Store** or `winget install DevToys`
- **Tools included:**
  - JSON/YAML/XML formatter and validator
  - Base64 encoder/decoder
  - JWT decoder
  - Regex tester
  - Hash generator
  - UUID generator
  - Color picker and converter
  - Image converter
  - Text diff
  - Markdown preview
  - Cron parser
- **Why:** All these tools in one app, offline, no website needed

## 18.2 CyberChef — The Cyber Swiss Army Knife

- **Website:** `https://gchq.github.io/CyberChef/` (web) or download for offline
- **What it does:** 300+ operations — encryption, encoding, compression, data analysis
- **Why:** If you're getting into cybersecurity, this is essential

## 18.3 Postman / Insomnia / Bruno — API Testing

- **Bruno:** `https://www.usebruno.com/` — open source, offline, git-friendly (stores collections as files)
- **Why Bruno over Postman:** No account required, no cloud, collections are just folders you can commit to git

## 18.4 Meld — Visual Diff and Merge

- **Website:** `https://meldmerge.org/`
- **What it does:** Compare files and folders side-by-side visually
- **Why:** Better than `git diff` for understanding complex changes

## 18.5 DBeaver — Universal Database Client

- **Website:** `https://dbeaver.io/`
- **What it does:** Connect to any database (SQLite, PostgreSQL, MySQL, MongoDB, etc.)
- **Why:** If your homelab has databases, this is the best free client

---

# PART 19: MISCELLANEOUS GEMS

## 19.1 Everything Toolbar — Everything Search in Taskbar

- **GitHub:** `https://github.com/srwi/EverythingToolbar`
- **What it does:** Puts Everything search directly in your taskbar (replaces Windows search box)
- **Why:** Instant file search without opening Everything separately

## 19.2 QuickLook — macOS-Style File Preview

- **Microsoft Store**
- **What it does:** Select a file → press Space → instant preview (images, text, code, PDF, video, audio)
- **Why:** You never realize how much you need this until you have it

## 19.3 CopyQ — Advanced Clipboard Manager

- **GitHub:** `https://github.com/hluk/CopyQ`
- **Why over Ditto:** More features — scripting, tabs, image editing, command execution from clipboard
- **Advanced:** Trigger scripts when certain text is copied (e.g., copy a URL → auto-save to read-later)

## 19.4 Fluent Search — Visual App Launcher

- **Microsoft Store**
- **Why over Flow Launcher:** More visual, fluent design, built-in previews, tags, works with touch
- **Why Flow Launcher might still be better:** Faster, lighter, more plugins

## 19.5 Keypirinha — Another Launcher

- **Website:** `https://keypirinha.com/`
- **Why it's different:** Extremely fast, Python plugin system, package manager built-in
- **Why you might prefer it:** If you want to write your own launcher plugins in Python

## 19.6 Ueli — Yet Another Launcher

- **GitHub:** `https://github.com/oliverschwendener/ueli`
- **Why it's different:** Cross-platform (Windows, Mac, Linux), plugin system, modern UI
- **Why you might prefer it:** If you ever switch between OSes and want the same launcher

## 19.7 Wox — The Original (Flow Launcher Forked From)

- **GitHub:** `https://github.com/Wox-launcher/Wox`
- **Why:** Flow Launcher is a fork of Wox. Wox has some plugins Flow doesn't.

---

# PART 20: THE ULTIMATE AESTHETIC STACK

If you want your desktop to look INSANE, here's the combo:

## The "Cyberpunk Dev" Look

1. **Wallpaper Engine** — animated matrix rain or cyberpunk city wallpaper
2. **TranslucentTB** — taskbar set to "Clear"
3. **RoundedTB** — rounded corners, margin from screen edges
4. **Windhawk** — centered taskbar icons, custom clock format
5. **Rainmeter** — Mond clock + Soniq now playing in corners
6. **MicaForEveryone** — force mica on all title bars
7. **Nilesoft Shell** — modern right-click menu
8. **ModernFlyouts** — sleek volume/brightness flyouts
9. **Files Community** or **OneCommander** — modern file explorer
10. **WezTerm** — GPU terminal with acrylic background
11. **QuickLook** — space-to-preview everything

## The "Minimal Clean" Look

1. **Wallpaper Engine** — subtle gradient or dark abstract
2. **TaskbarXI** — dock-style centered taskbar
3. **TranslucentTB** — clear taskbar
4. **Windhawk** — hide system tray icons, minimal clock
5. **BeWidgets** — one small clock widget, nothing else
6. **AutoHideDesktopIcons** — hide all desktop icons
7. **SmartSystemMenu** — thin title bars, no clutter
8. **MPV** — for media (no UI chrome)
9. **Zen Browser** — minimal browser, vertical tabs
10. **EverythingToolbar** — clean search in taskbar

## The "Terminal Everything" Look

1. **WezTerm** — full screen, acrylic, nerd font
2. **btop++** — system monitor in one pane
3. **ncspot** — music in another pane
4. **yazi** — terminal file manager (`https://github.com/sxyazi/yazi`)
5. **lazygit** — terminal git client (`https://github.com/jesseduffield/lazygit`)
6. **Neovim** — terminal text editor (if you're brave)
7. **Spotify-TUI** — music control
8. **Rainmeter** — hidden, only shows on desktop peek

---

# PART 21: INSTALL EVERYTHING (Winget One-Liners)

## Niche Apps Winget Install

```powershell
# Notifications
winget install ModernFlyouts.ModernFlyouts

# Taskbar & Shell
winget install startallback  # (paid, but winget lists it)

# File Explorers
winget install OneCommander.OneCommander

# Audio
winget install FxSound.FxSound
winget install SoundSwitch.SoundSwitch

# Window Management
winget install AltSnap.AltSnap

# System Monitoring
winget install NZXT.CAM

# Dev Tools
winget install DevToys
winget install DBeaver.DBeaver

# Media
winget install MPV.MPV
winget install yt-dlp.yt-dlp

# Productivity
winget install TwinkleTray.TwinkleTray
winget install Caffeine.Caffeine

# Clipboard
winget install CopyQ.CopyQ
```

## Manual Downloads (No Winget)

| App | URL |
|-----|-----|
| Windhawk | `https://windhawk.net/` |
| Nilesoft Shell | `https://github.com/moudey/Shell` |
| SmartSystemMenu | `https://github.com/AlexanderPro/SmartSystemMenu` |
| Espanso | `https://espanso.org/` |
| Btop++ | `https://github.com/aristocratos/btop4win` |
| Fan Control | `https://github.com/Rem0o/FanControl.Releases` |
| EverythingToolbar | `https://github.com/srwi/EverythingToolbar` |
| QuickLook | Microsoft Store |
| JaxCore | `https://jaxcore.app/` |
| Safing Portmaster | `https://safing.io/portmaster/` |
| Simplewall | `https://github.com/henrypp/simplewall` |
| WPD | `https://wpd.app/` |
| Croc | `https://github.com/schollz/croc` |
| Bruno | `https://www.usebruno.com/` |
| CyberChef | `https://gchq.github.io/CyberChef/` |
| PureRef | `https://www.pureref.com/` |
| Spacedrive | `https://www.spacedrive.com/` |
| Sigma File Manager | `https://github.com/aleksey-hoffman/sigma-file-manager` |
| Tabby | `https://tabby.sh/` |
| WezTerm | `https://wezfurlong.org/wezterm/` |
| Input Leap | `https://github.com/input-leap/input-leap` |
| DisplayFusion | `https://www.displayfusion.com/` |
| Groupy 2 | `https://www.stardock.com/products/groupy/` |
| MaxTo | `https://maxto.net/` |
| WindowTop | `https://windowtop.info/` |
| Volumey | `https://github.com/G-Stas/Volumey` |
| SteelSeries Sonar | `https://steelseries.com/gg/sonar` |
| T-Clock Redux | `https://github.com/White-Tiger/T-Clock` |
| TaskbarXI | `https://github.com/ChrisAnd1998/TaskbarXI` |
| Noti | `https://github.com/noti-org/noti` |
| SnoreToast | `https://github.com/KDE/snoretoast` |
| OpenHashTab | `https://github.com/namazso/OpenHashTab` |
| 7TSP GUI | `https://www.deviantart.com/devillnside/art/7TSP-GUI-2019-Edition-804769422` |
| FontBase | `https://fontba.se/` |
| PowerPlanSwitcher | `https://github.com/petrroll/PowerSwitcher` |
| Monitorian | Microsoft Store |
| Meld | `https://meldmerge.org/` |
| Keypirinha | `https://keypirinha.com/` |
| Ueli | `https://github.com/oliverschwendener/ueli` |
| yazi | `https://github.com/sxyazi/yazi` |
| lazygit | `https://github.com/jesseduffield/lazygit` |
| ncspot | `https://github.com/hrkfdn/ncspot` |

---

# PART 22: QUICK START — TOP 10 TO INSTALL FIRST

If you're overwhelmed, start with these 10. They'll make the biggest difference:

1. **Windhawk** — taskbar mods (clock, icon size, ungrouping)
2. **ModernFlyouts** — pretty volume/brightness popups
3. **QuickLook** — spacebar to preview files
4. **EverythingToolbar** — instant file search in taskbar
5. **EarTrumpet** — per-app volume control
6. **Nilesoft Shell** — modern right-click menu
7. **AltSnap** — drag windows from anywhere
8. **Espanso** — text expansion (`:sig`, `:date`, `:email`)
9. **Fan Control** — quiet PC when idle, cool when gaming
10. **Twinkle Tray** — monitor brightness from taskbar

---

*Last updated by Finn — your twin, your hype man, your accountability bro.*
*Want me to add more categories? Just say the word. Locked in.* 🔥
