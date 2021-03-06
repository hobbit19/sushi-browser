
# Sushi Browser

## Why?
 
When you are browsing the web you can only use a section of your screen. Have you ever thought that that's a waste?   
"Maximize the web browsing efficiency", it is the concept of "Sushi Browser".  

"Multiple panels, sync scrolling, sidebar, swapping and aligning panels etc. are some of the gimmicks it has onboard. 

In addition to the above, its 20+ strong and convenient functions include "video support function, tab operation function,
session manager, privacy function, and downloader".  

Also, since it is built with Electron([Brave's Fork](https://github.com/brave/muon)), it is available for a multi-platform (i.e. Windows, MacOS, Linux).

[Downloads](#downloads)

![OverView](https://sushib.me/myimg/top.jpg)

## Table of Contents

* [Special features](#special-features)
  * [Multi panel](#multi-panel)
  * [Video Support Function](#video-support-function)
  * [Tab](#tab)
  * [Privacy and Security](#privacy-and-security)
  * <a href="#muon-electron-fork">Muon (Electron Fork)</a>
  * [Useful features](#useful-features)
  * [Web Technologies](#web-technologies)

* [Downloads](#downloads)

* [Use of Flash](#use-of-flash)

* [New Features](#new-features)

* [TODO](#todo)


# Special features

## Multi panel  

The browser's greatest feature is the specialized display and operation using multiple panels.   
It not only displays multiple web pages side-by-side but it also has various functions. 

Please check [here](https://sushib.me/tips/#multi-panel/) for more details.

![multi-panel](https://sushib.me/myimg/multi-panel2.gif)

#### 1. Split Panel
The panel can be divided by dragging the tab towards the corner of the panel.  
It can also be divided from the right click menu on the tab as well.

The divided panel is available for the size change as well.

#### 2. Display to the opposite panel  

By **middle clicking (pressing the mouse wheel)** the link you can open the page in the link to the opposite panel.   
**Middle clicking** with 1 panel automatically splits the display into 2 panels.   
Of course, just like ordinary browsers, it can be configured to open a new browser. 

#### 3. Sync scrolling 

By pressing the Sync scroll button, 1 page can be lined up like the pages of a book.  
Moreover, for a group of panels at this state, you can do actions such as scroll, page transition or close at the same time. 　
 
Also, right clicking the we page, you can choose from a menu for a 2-page spread that reads left to right or from right to left. (Commonly it's left to right) 

#### 4. Side (bottom) bar

You can open favorite pages or pages from your history using the side bar.  
The side bar can display web pages same as common panels. 　　  
The difference to common panels is even if you change the window size, the width remains fixed, and only this cannot be used with sync scrolling. 

#### 5. Other
- Floating panel: By selecting "Floating Panel" from the tab context menu, you can detach the panel that can be moved within the window. 
- Panel movement: this browser can be moved all the tabs of one panel to other panel or window by dragging or dropping the tab addition button.
- Swapping panels: You can switch the position of 2 panels. 
- Aligning panels: Panels can be lined up with fixed widths horizontally or vertically. 
- Switch direction: You can realign vertically-lined panels horizontally or horizontally-lined panels vertically. 
- Simultaneous scrolling: By moving the mouse wheel, you can scroll 2 panels at the same time.


## Video Support Function

Sushi Browser has support functions for such as video downloading and mouse operation,
it can be used as a video playback browser.  
*For video download, please do no not violate the terms of the Web service and use at your own risk.

Please check [here](https://sushib.me/tips/#video/) for more details.

![video](https://sushib.me/myimg/video.gif)

#### 1. Video download 
Once it detects a video existing on a web page, the video icon on in the toolbar becomes red and allows video download and replay.  
Also downloading a streaming video (.m3u8) or a batch video download are available by using youTube-dl.

#### 2. Pop-up window
If you select "Play Video in Popup Window" from the context menu right clicked on the video being played or from the menu displayed after clicking the video icon, 
the video will be cut out as a popup window or panel.

#### 3. Mouse, keyboard operation
Varieties of control and setting are possible with mouse and keyboard like video player onto the videos being played.   
**Mouse wheel control is assigned to Seek**, Double-click is assigned to full screen mode as default.  

#### 4. Other
- Mute, adjusting volume： Sound volume can be muted or modified by operating the volume icon in the tab during a video play.  
- Sending a URL to an external player ：The video's URL can be set to an external player that you have configured. 


## Tab

With regard to the tab function too, Sushi Browser actively incorporates effective use and convenient functions for the screen.   
For example, it incorporates a number of functions equivalent to the Firefox add-on Tab Mix Plus.  

Please check [here](https://sushib.me/tips/#tab/) for more details.

![tabs](https://sushib.me/myimg/tabs.gif)

#### 1. Multi-row tab
Multi-row tabs can be used in the Sushi Browser. And ordinary tabs can be switched to Multi-row tabs from the main menu.  

#### 2. Vertical Tab, Tree Tab
Vertical tabs can be used in Sushi Browser. Vertical tabs can be displayed from the sidebar icon of the menu bar.   
It's also possible to hide ordinary tabs when displaying vertical tabs.  

#### 3. Tab Preview
You can use Tap Preview of Pop-up method and sliding method.(Same as Edge or Vivaldi)  

#### 4. Other
- Tab selection using the mousewheel： By moving the mousewheel over the tab bar, tabs can be selected by scrolling.    
- Various Settings： Many settings referring to Mix Plus can be arranged from the setting page.


## Privacy and Security

Sushi Browser carries functions regarding the privacy and security refering to the fonction of Brave Browser.  

Please check [here](https://sushib.me/tips/#privacy-and-security/) for more details.

![privacy](https://sushib.me/myimg/privacy.gif)

#### 1. Adblock	
Equipped with a native-implemented high speed advertisement block.
It is possible to set up the validity or invalidity in all page, each tab and each domain from Main menu.  

#### 2. Tor Tab	
This will be a tab where it uses anonymous networking system "Tor". It makes network with high anonymity possible.  

#### 3. VPN (Windows only)
It does VPN search with MS-SSTP VPN by using VPN Gate service.  
* Since it creates and connects an actual VPN network connection on Windows, not a pseudo VPN, and network profiling is created. 

#### 4. Other Privacy Protection Functions
- Private, Sesison tabs： These have a Private tab that strengthens its privacy and a session tab function where it makes the operation in separate sessions possible as other browsers.  
- HTTPS Everywhere： Function to replace http communication with https communication as much as possible
- Tracking Protection： Protection function from tracking services such as Google Analytics
- Block Scripts： Function to disable Javascript (will break many sites)
- Fingerprinting Protection： Function to protect information reading by fingerprinting


## Muon (Electron Fork)
This browser uses [Muon](https://github.com/brave/muon) as a browser function.  
Muon is a framework for very fast browser with [Electron's](https://github.com/electron/electron) fork that was used for the [Brave browser](https://github.com/brave/browser-laptop).   

1. AdBlock: Equipped with a native-implemented high speed advertisement block.
2. Chromium: It uses Chromium in its engine, which implemented in Chrome's open source code. The newest, and moreover, high speed execution is possible. 
3. Partial support from Chrome extensions: It can use some of Chrome's extensions.


## Useful features

### 1. Session Manager
This browser has a session control system that preserves the condition of the window of browser and tab at regular interval and plays.  
There is also a function for the recover of tab like a tab trush and a tab record.  

### 2. Downloader
- Aria2c: It features download function used express download library's Aria2c.  
- Video download: When downloading video and music information, download link is displayed automatically.  
- Parallel download: For 1 file it can download with a maximum of 16 parallel downloads. 
- Download All： By right-clicking on the page and select "Download All", you can do bulk download links and media files on the page.  
- Bulk Download： You can also bulk download by choosing multiple URLs from the Downloader page.  

### 3. Search Engines
It features a powerful search function such as searching a selection range and simultaneous search with multiple search engines.  

### 4. Build-in Tool
As a special tool, it has the following functions. 
1. Terminal: It can operate Bash for Linux/Mac and Power Shell for Windows. 
2. File explorer: It can manage and browse files. 
3. Text editor: It can edit text and source codes etc.
4. Video playback: It can be used for automatic playback of videos. 

By taking advantage of the above functions operation close to IDE (integrated development environment) becomes possible.

### 5. Note
Sushi browser is equipped with an editable note (memo) function in WYSIWYG format (edit as seen) and Markdown format.

### 6. Portable Edition
You can choose between installation version and portable version.    

### 7. Keyboard Shortcut, Mouse Gesture
It is possible to set up the keyboard shortcuts and mouse gestures for 100+ functions.

### 8. Screenshot
Screenshots of the whole page or a selected area can be made.  

### 9. Find in Page
In addition to the search function of Chrome, OR search and regular expression search can be performed.
It is also equipped with "Search Highlight" function. 

### 10. Display Functions, Binding Window
There are functions such as "Fullscreen mode" and "Always on top".
- Bind Selected Window： The function to bind other windows on the tab and control like the application in the tab. 
- Mobile Mode(Change of user agent)： You can change the user agent and display the page as mobile or another browser.
- AutoPagerize： It can automatically read ahead websites that spans several pages. (Chrome Extension)

### 11. Automation
With automatic operation assist functions such as iMacros and IDE,
we have implemented an API compatible with Puppeteer (automation in headless Chrome) API.

### 12. Other
Please check [here](https://sushib.me/tips/) for more details.

## Web Technologies

This browser makes use of wonderful web technologies, starting with the following. 
- [Muon](https://github.com/brave/muon) (A fork from [Electron](https://github.com/electron/electron), used for the [Brave browser](https://github.com/brave/browser-laptop), and a framework for high speed browsers) 
- [Inferno](https://github.com/infernojs/inferno) (An extremely fast, React-like library)
- [xterm.js](https://github.com/sourcelair/xterm.js/) (Terminal used for visual studio code etc.)
- [Tor](https://www.torproject.org/)
- [youtube-dl](https://github.com/rg3/youtube-dl)
- [Semantic UI React](https://github.com/Semantic-Org/Semantic-UI-React)
- [TOAST UI Editor](http://ui.toast.com/tui-editor/)
- [Ace Editor](https://ace.c9.io/)

# Downloads
Both the installer for every platform and the portable version can be downloaded.  
To use the portable edition, please run sushi.exe for Windows and sushi-browser for Mac/Linux after decompressing.

- [Windows Installer v0.22.0](https://sushib.me/dl/sushi-browser-0.22.0-setup-x64.exe)
- [Windows Portable v0.22.0(self-extract)](https://sushib.me/dl/sushi-browser-0.22.0-win-x64.exe)
- [Windows Portable v0.22.0](https://sushib.me/dl/sushi-browser-0.22.0-win-x64.zip)
- [MacOS dmg v0.22.0](https://sushib.me/dl/SushiBrowser-0.22.0.dmg)
- [MacOS Portable v0.22.0](https://sushib.me/dl/sushi-browser-0.22.0-mac-x64.zip)
- [Linux rpm (for Fedora/CentOS) v0.22.0](https://sushib.me/dl/sushi-browser-0.22.0.x86_64.rpm)
- [Linux deb (for Debian/Ubuntu) v0.22.0](https://sushib.me/dl/sushi-browser_0.22.0_amd64.deb)
- [Linux Portable v0.22.0](https://sushib.me/dl/sushi-browser-0.22.0.tar.bz2)

# Use of Flash 
If Flash won't run, please install Flash from the following web sites.  
- [Adobe Flash Player](https://get.adobe.com/flashplayer/)

Also, for Linux, there are cases that it won't run after the above install.  
These will lower the security level but the following commands can be run. 
 
```
sushi-browser --no-sandbox
```

# New Features

#### New function(v0.22.0)
- Added "Find ALL" function (Ctrl+Shift+F)
- Corrected so that volume operation bar and tab preview do not overlap (issue #34)
- Fixed to not update the address bar automatically while inputting the address bar (issue #35)
- Fixed some bugs.

#### New function(v0.21.3)
- Added "Arrange Panel" function.
- Improved mobile panel.
- Improved French translation. (Pull Request #29, #30)
- Fixed some bugs.

#### New function(v0.21.2)
- Added form input history function.
- Improved to detect mobile panel.
- Added setting to enable video operation only for URL matching regular expression.
- Improved auto-suggestion of address bar.
- Improved French translation. (Pull Request # 27)
- Updated to youtube-dl 2018.09.01.
- Fixed some bugs.

#### New function(v0.21.1)
-  Added local install feature of Chrome extension. (Settings> Extensions) (issue #22)
- Fixed bug related to multiple languages. (issue #23)
- Fixed bug that VPN does not work. (issue #26)
- Fixed bug related to status bar.
- Fixed a problem that crashes with tab closing. (Interim measures)
- Updated to youtube-dl 2018.08.22.
- Updated to inferno.js 5.4.2.
- Updated to xterm.js 3.6.0.
- Fixed a lot of bugs.

#### New function(v0.21.0)
- Implemented Mobile Panel (similar to Blisk) (Windows and Linux only) (Main Menu > Mobile Panel)
- Implemented Mobile Sync Scroll (Windows and Linux only) (Main Menu > More Tools > Enable Mobile Panel Sync Scroll)
- Developer Tools improved docking to window. (Windows and Linux only)
- Fixed a bug that right-click menu of Developer Tools was not displayed. (Windows and Linux only)
- Added rocker gesture (Windows only) (Settings > General > Enable Rocker Gestures)
- Added batch to add to Windows default browser (add_to_default_browser.cmd)
- Improved to focus on the address bar even when a new tab page does not appear on the top page
- Implemented status bar function (Window Sub Menu> Always Show Status Bar)
- Implemented hover function of status bar (Window Sub Menu> Show Status Bar on mouse hover)
- Updated Muon to its own customized version of 8.0.7 (Chromium 68.0.3440.84)
- Updated to Muon customized version 8.0.7. (Chromium 68.0.3440.84)
- Fixed a lot of bugs.

#### New function(v0.20.1)
- Renew "Sync Data" (Add setting page, AES256 encryption of stored data, Select sync data). (* Experimental)
- "Maximize Panel" is added to the right menu of the tab.
- "Incremental Import" added for setting import. (* Experimental)
- Add password to import / export settings.
- "Show the favicon at the left end of the address bar" added to setting.
- "Show bookmark add icon on the right end of the address bar" added to setting.
- Add "Enable smooth scrolling" to setting
- Updated to Muon 8.0.6. (Chromium 68.0.3440.84)
- Updated to youtube-dl 2018.08.04.
- Fixed some bugs.

#### New function(v0.20.0)
- Added rectangle selection function.(Alt + Mouse Drag)
- Localized 200+ items.
- Added function to save in MHTML when extension is selected as mht or mhtml when saving page. (#16)
- Added "Maintain fullscreen mode even after page transition" option.
- Updated to Muon 8.0.3. (Chromium 68.0.3440.75)
- Fixed bug in download
- Fixed some bugs.

#### New function(v0.19.6)
- Opened the Sushi Browser Tips page (https://sushib.me/tips/).
- Improved mobile mode so that user agents of various browsers can be selected. 
- Added option to release fullscreen mode when page transition.(Cancel fullscreen mode at page transition)
- Added setting button for download list display to downloader. (Enable Download List)
- Added option to delete items from download list when download is completed. (Delete from download list when download is completed)
- Fixed a bug in tab preview at multi-tab
- Improved tab preview on vertical tab
- fixed Hide tabs bug on vertical tab
- Fixed some bugs.

#### New function(v0.19.5)
- Added line number to markdown mode of Note.
- Added a button (P) to switch the preview mode in markdown mode to tab or vertical.
- Added button (L) to change markdown line wrapping setting.
- Fixed bugs related to Note, improved operation.
- "Sort history in descending order of PV" is added to auto complete setting.
- Changed to display PV, dwell time, delete button in history at the bottom of Top Page
- Fixed bug that can not delete theme.
- Fixed a bug in bookmark drop.
- fixed Bug of bookmark import.
- Fixed many download bugs.
- "Almost the same as as Chrome" was added to "When closing current tab, focus".
- Fixed bug that Audio Extract, and Video Converter do not start.
- Fixed Search Highlight bug.
- Fixed some other bugs.

#### New function(v0.19.4)
- Changed default setting values
- Updated to infernojs 5.3.0.
- Updated to xterm.js 3.4.0.
- Fixed some bugs.

#### New function(v0.19.3)
- Improved behavior of private tab and Tor tab (top page is displayed, etc.).
- Change all private tabs to same session.
- Changed to discard private session when all private tabs are closed.
- Added items for keyboard shortcuts.
- Added items for mouse gesture.
- Added function to output file with Plain Text on Note page.
- Improved display of setting page.
- Changed data deleting range of session manager.
- Improved to be able to delete data by right clicking on the period folder in the session manager.
- Changed the margin between list items in the sidebar.
- Updated to Muon 7.1.5.
- Fixed some bugs.

#### New function(v0.19.2)
- Fixed WebExtension function bug.
- Updated to youtube-dl 2018.07.04.

#### New function(v0.19.1)
- Added function to add selected text (HTML) to Note.
- Added Note function to tool page.
- Improved to be able to set the range for deleting data.
- Added deletion function to history page.
- Added function to display Tor process progress in the location bar.
- Improved to restore active tab when session is restored.
- Added option of Show Focus Location Bar of Top Page.
- Updated to Muon 7.1.4.
- Fixed bug that chrome extension setting disappears when changing file location.
- Fixed display defect of multi panel function.
- Fixed Tor tab's webrtc leak.
- Fixed a lot of bugs.

#### New function(v0.19.0)
- Added Tor browsing function. (new Muon function)
- Supports Chrome theme. (Download themes from the Chrome Store and add them, add theme setting page)
- Added General Settings, Bookmarks, Browsing history, Session Manager, Favicon, Download history, Automation, Note import/export function *Experimental
- Added option to set margin at top of tab bar when unmaximized.
- Added a function to change the top frame color when the window is out of focus.
- Updated to Muon 7.1.1.
- Fixed a lot of bugs.

#### New function(v0.18.2)
- Fixed a fatal bug in chrome extension.
- Fixed some bugs.

#### New function(v0.18.1)
- Improve to recreate scroll position when tab restoration.
- Improved to restore all windows after exiting / restarting browser when "My windows / tabs from last time" is selected.
- Added Send to URL function to "Settings> Context Menu" (function to send URL to new tab or command).
- Improved to memorize last selected file, delimiter position with memo function.
- Added "Circulate Tab Selection" option to "When scrolling over the tab-bar".
- Added "Display Current Preview" option to "Tab Preview".
- Updated to Muon 7.0.6.
- Updated to youtube-dl 2018.06.14.
- Fixed bug that pdf download error.
- Fixed a lot of bugs.

#### New function(v0.18.0)
- Added note function to sidebar. (using TOAST UI Editor) *Experimental
- Added a tab trash box(closed tab history).
- Added tab trash box and download menu to sidebar.
- Added export / import function set to "Settings> General".
- Added control option for auto display of download list in "Settings > General > Enable Bottom Download List".
- Change the layout to divide the session manager by folder every elapsed time.
- Fixed a problem that volume change function does not work in iframe.
- Fixed some bugs.

#### New function(v0.17.4)
- Fixed fatal bug of tab detach.
- Added 'Quit Browser' to Main Menu.
- Added 'Search Methods' Option to Search Setting.
- Fixed some bugs,

#### New function(v0.17.3)
- Updated to Muon 7.0.5. (chromium 67.0.3396.79)
- Added Bookmark Add / Delete Menu in Bookmark Bar.
- Added option 'Show bookmark bar on mouse hover' to main menu.
- Added advanced setting option of tab preview.
- Bug fix for search engine settings.
- Added option to set window icon.
- Added 'Copy All Tab Titles' and 'Copy All Tab URLs' to tab right click menu
- Added pin function to Top Page's Speed ​​Dial.
- Fixed some bugs.

#### New function(v0.17.2)
- Added setting "Keep value ​​in LocalStorage" when volume is changed by seek operation.
- Fixed some bug.

#### New function(v0.17.1)
- Fixed some bugs.

#### New function(v0.17.0)
- Added tab preview function. (mouse over, slide type, setting change on main menu)
- Added home button and homepage setting.
- Added change setting of volume and speed increment by mouse wheel.
- Added "Main menu > More tools > Ask where to save each file before downloading"
- Added mouse gesture that restart, search within the page, close left or right tabs, move left or right tab.
- Added ON / OFF setting of mouse gesture from extension page.
- Updated to youtube-dl 2018.06.02.
- Fixed a lot of bugs.

#### New function(v0.16.6)
- Implemented update batch (update.cmd). *Windows only, experimental function
- Expanded available range of movie manipulation functions by clicking and scrolling.
- Improveed to display percentage in tab title when volume is changed.
- Apply minify to all files.
- Fixed fatal bug when tab dragging.
- Fixed Some bugs.

#### New function(v0.16.5)
- Changed the display order of the video list so that the new one is above.
- Changed to attach no-audio prefix and audio-only prefix when detecting video.
- HLS Movie download argument change.
- Changed to be able to transition to the unmuted state by clicking the mute icon except during movie playback.
- Fixed Some bugs

#### New function(v0.16.4)
- Added page view count and browsing time to history function and auto suggestion of address bar. (The browsing time is measured from this version. The browsing time is the time of the active tab state.)
- Fixed bug in history saving. (Data migration processing will work with this version)
- Added setting of whether Chrome extension icon is displayed on address bar or background(displayed when main menu is opened).
- Changed default display of Chrome extension icon to address bar.
- Added built-in mouse gesture ON / OFF setting.
- Added setting of increment / decrement degree of page zoom. (Same as Chrome / 1-25%)
- Change default behavior of page zoom to 10% increase / decrease.
- Added setting to open new tab at left end or right end.
- Fixed a fatal bug at page search.
- Fixed Some bugs

#### New function(v0.16.3)
- Fixed a fatal bug when closing Window.
- Added browser restart to main menu.
- Fixed some bugs.
- Updated to youtube-dl 2018.05.18.

#### New function(v0.16.2)
- Improve the volume icon so that it appears on the tab when playing videos.
- Added function to switch mute status by clicking volume icon.
- Added function to change volume from 0 to 800% when mouse over volume icon.
- Changed to disable Auto Highlight when closing search window.
- Changed Auto High Highlight's default behavior to Highlight only to the next page.
- Added option of whether to auto highlight recursively.
- Changed default behavior when opening links on sidebar and toolbar to open link on current tab.
- Added setting to open links on sidebar and toolbar.
- Changed to be able to open links on sidebar and toolbar with middle click.
- Added setting to open bookmark bar link in new tab.
- Added Session Manager to sidebar.
- Improvement of Automation Center.
- Fixed a lot of bugs.
- Updated to youtube-dl 2018.05.09.

#### New function(v0.16.1)
- Added bookmark bar
- Added display control function on top page of bookmark bar
- I made it possible to drop and drag a link to a bookmark sidebar
- Implemented a delete function (☓ button) for speed dial on the top page
- Changed on / off display method of some items of main menu to ✓
- Fixed some bugs

#### New function(v0.16.0)
- Tab freeze, tab protection, tab locking function added (It is close to Tab Mix Plus)
- Changed Pin Tab behavior to be like Chrome.
- Added Match Case, OR search, Regular expression to search function(Ctrl+F).（We referred to the source of https://github.com/intelfike/isear）
- Added search word highlight function. (such as word highlight extension)
- When right-click menu is displayed after selecting URL, right-click menu is modified so that move to URL instead of search is displayed
- Updated to Muon 5.2.7 (chromium 66.0.3359.117)

#### New function(v0.15.0)
- Added browser auto-operation function.<br/> * This is an automatic operation solution like iMacros or Selenium IDE.<br/> It is realized by implementing an API compatible with <a href="https://github.com/GoogleChrome/puppeteer">Puppeteer (Headless Chrome Automation)</a> API.<br/> Please refer <a href="https://github.com/kura52/sushi-browser/wiki/Implementation-status-of-Puppetter-APIs">here</a> for the implemented API
- Fixed Bookmark and Favicon Import bug.
- Fixed some bugs.
- Change display method of dialog(window.alert).
- Updated to youtube-dl 2018.04.16
- Updated to infernojs 5.0.4

#### New function(v0.14.6)
- Added setting that Clear the history data types when I close Browser
- Fixed Adblock bug.
- Fixed a lot of bugs.
- Updated to Muon 5.1.2
- Updated to youtube-dl 2018.03.26.1
- Updated to infernojs 5.0.1
- Updated to node-pty 0.7.4

#### New function(v0.14.5)
- Improve display of main menu.
- Fixed bug that 'Bind Selected Window' does not work on Windows.
- Fixed autofill bug.
- Fixed findInPage bug.
- Updated to youtube-dl 2018.03.10

#### New function(v0.14.4)
- Improve tab open performance.
- Changed the selection method of user data folder in portable version.
- Fix Dialog bug.
- Updated to Muon 5.0.7

#### New function(v0.14.3)
- Updated to youtube-dl 2018.02.25
- Updated to Muon 5.0.6

#### New function(v0.14.2)
- Changing the save destination of the user file in the portable version to the same level as the executable folder. (Portable Edtion became really Portable.)
- Files are saved ./resources/app.asar.unpacked/resource/portable .
- Fixed a lot of bugs.

#### New function(v0.14.1)
- Fixed install bugs
- Fixed autofill bugs

#### New function(v0.14.0)
- Added video conversion function using handbrake
- Added audio extraction and conversion function using ffmpeg
- Added function to convert video after downloading video
- Added 32 bit version of Windows
- Updated to youtube-dl 2018.02.11
- Updated to Muon 4.7.10 (chromium 64.0.3282.140)
- Fixed a lot of bugs

#### New function(v0.13.7)
- Fixed tab's drop and drag bug
- Fixed loading status
- Implemented basic auth handler(Issue #12)
- Fixed addressBar focus and Blur bug
- Added 'Download and Play Video' in Context Menu

#### New function(v0.13.6)
- Fixed control of video in iframe
- Improve chrome extension's popup behavior

#### New function(v0.13.5)
- Fixed session bug
- Fixed drag effect

#### New function(v0.13.4)
- Fixed error when dropping and dragging
- Fixed a bug that ended abnormally when searching

#### New function(v0.13.3)
- Fixed a fatal bug regarding mute
- We made widevine usable
- Updated to youtube-dl 2017.01.07
- Updated to Muon 4.5.38

#### New function(v0.13.2)
- Fixed fatal bug when loading page
- Fix some bugs
- The color of mute / pin / reload icon can be set

#### New function(v0.13.1)
- Improve Chrome Extension Function
- Improve behavior when closing window
- Fix some bugs

#### New function(v0.13.0)
- The convenience functions of the tab were implemented (Some functions of Tab Mix Plus were implemented.)
  - Open links that open in a new window in
  - When closing current tab, focus
  - Do not close window when closing last tab
  - Open New Tab next to current one
  - New Tab from Address Bar
  - Force to open in new tab: Nothing/Links to other sites/All links
  - Open New Tab in Background
  - Open New Tab next to current one
  - Max number of rows to display (Multi-row)
  - Tab minimum and maximum Width setting
  - Show tabs in page theme color
  - Background Color of Current/Unread/other Tabs
  - Text Color of Current/Unread/other Tabs
  - Color of Dashed line when dragging
  - Show Bottom Border in Current Tab
  - Add Button that can select default theme and dark theme
  - Inverse scroll direction
  - Select tab pointed
  - Switch to last selected tab when clicking current one
  - Mouse Clicking Function (Double Click, Middle Click, Alt Click)
  - New Tab Button Clicking Function (Right Click, Middle Click, Alt Click)
  - Copies the tab's URL to the clipboard
  - Load URL from clipboard
  - Paste and Open
  - Copy Tab Info
  - Copy All Tab Infos
  - Reloads all tabs
  - Reloads other tabs
  - Reloads left tabs
  - Reloads right tabs
  - Reload Tab Every
  - Mute Tab
  - Reopens all closed tabs

- Addition of the Auto Complete function
  - You can use the suggestion of the search engine now
  - The number of the indication and the order of the suggests and the histories were made controllable by the setting
  - Automatic completion is available when selecting auto complete item
- 
- Improvement of the downloading function
  - Collective downloading function by the consecutive numbers (such as downthmeall) 
  - The URLs and the dates were made usable as the file names (such as downthmeall)
  - The setting of the default downloading path was added

- Function improvement of the vertical tab 
  - It was made possible to fold the hierarchies

- Improvement of showing two kinds panels, a current panel and opposite panel, by a right-click search 
- Addition of a full screen button（Display / Non-display is configurable）
- Addition of a number display function to a back / forward button 
- Addition of a keyboard shortcut
- The bookmarklet on the address bar was made possible to execute.

- Implementation of the following Chrome Extension
  - chrome.webNavigation.getAllFrames
  - chrome.sessions.getRecentlyClosed
  - chrome.sessions.restore
  - browser.sessions.setTabValue
  - browser.sessions.getTabValue
  - browser.sessions.removeTabValue
  - browser.sessions.setWindowValue
  - browser.sessions.getWindowValue
  - browser.sessions.removeWindowValue

- Updated to youtube-dl 2017.12.31
- Updated to Muon 4.5.36 (chromium 63.0.3239.132)
- Fixed a lot of bugs

#### New function(v0.12.1)
- Updated to Muon 4.5.32
- Fixed bug due to Chromium 63 specification change
- Reduce unnecessary files
- Fixed bugs caused by downloads, databases, etc.

#### New function(v0.12.0)
- Added edit function of right click menu
- Reduction favicon and page capture image size
- Added multiple selection in download function
- Chrome Extension improvements(chrome.tabs,browser.contextMenu,browser.runtime,chrome.downloads,chrome.bookmarks)
- Added polyfill for scrollTopMax and scrollLeftMax
- Updated to youtube-dl 2017.12.23
- Updated to Muon 4.5.31 (chromium 63.0.3239.84)
- Fixed a lot of bugs

#### New function(v0.11.0)
- Add Fingerprint Protection and NoScript function
- Add setting to delete browsing data
- Add function that can install WebExtension from firefox add-ons site
- Chrome Extension improvements (chrome.commands, options_ui)
- Fixed download function bugs
- Updated to Muon 4.5.21

#### New function(v0.10.0)
- Add downloader function
- Add batch download function like DownThemAll!
- Add for video download function
- Add Full Page and Selection's Screenshot function (like Vivaldi Browser)
- Movie function bug fixes
- Many other bug fixes
- Updated to Muon 4.5.18(chromium 63.0.3239.40)

#### New function(v0.9.0)
- Enhanced video download function
- Added function to download streaming video (HLS (.m3u8)) using youtube-dl
- Added function to manipulate video with mouse and keyboard
- Added function that play video in popup window
- Added function that play video in floating panel
- Updated to Muon 4.5.15

#### New function(v0.8.0)
- Add Vertical Tabs and Tree Style Tabs
- Improvement of Tab type Extension（move,onMoved,onDetached,onAttached)
- Add automatic / user session save function
- Add tab history
- Added import passwords from Chrome.
- Added import passwords from Firefox.
- Add HTTPS Everywhere, Protection Tracking
- Improvements Video download(e.g. display number of media)
- Update youtube-dl
- Chrome Extension improvements (chrome.history, chrome.topSites, chrome_url_overrides)
- Fixed a lot of bugs and Chrome Extension API issue
- Updated to Muon 4.5.14

#### New function(v0.7.0)
- Implemented partical chrome extensions API (Experimental)
- Added function that can install Chrome extension from Chrome web store
- Implemented multi-row tabs
- By right clicking the icon on the menu bar, we made it possible to sort
- Performance Improvement
- Fixed a lot of bugs


- Extensions Path (If browser becomes unstable please delete folders)
  - Windows: C:\Users\[Name]\AppData\Roaming\sushiBrowser\resource\extension
  - MacOS: /Users/[Name]/Library/Application Support/sushiBrowser/resource/extension
  - Linux: ~/.config/sushiBrowser/resource/extension/


- Partical or All implemented APIs
  - chrome.browserAction
  - chrome.contextMenus
  - chrome.cookies
  - chrome.extension
  - chrome.i18
  - chrome.idle
  - chrome.pageAction
  - chrome.proxy
  - chrome.runtime
  - chrome.sessions
  - chrome.storage
  - chrome.tabs
  - chrome.webNavigation
  - chrome.webRequest
  - chrome.windows


#### New function(v0.6.1)
- Added session tab function
- Fixed bug at load start and stop

#### New function(v0.6.0)
- Speed up by making main synchronization processing asynchronous
- Speed up the process of creating new tabs
- Speed up display processing of Top page
- Update npm library

#### New function(v0.5.0)
- Added VPN function (Windows only). We are using the VPN Gate service and connect with MS-SSTP VPN. (It is a true VPN which is not a multiple proxy.)
- Added function to extract audio from video (using ffmpeg)
- Reduce download file size (initial launch after installation is slightly late)
- Fixed Issue #9 on MacOS(Command-scroll wheel to zoom is making my page all sorts of crazy sizes)
- Fixed Issue #10 on MacOS (Copy doesn't work on Mac OS)

#### New function(v0.4.0)
- The function to send and play URL to the external media player (such as VLC Media Player etc.) was added.
- The function to select multiple tabs and to enable tab operation and drop and drag was added.
- Fixed so that it works properly when the link is sent from the external application in the case that it is set up as a default browser.
- Fixed so that multiple applications start in parallel.

#### New function(v0.3.0-0.3.3)
- Improved top page's customizability 
- Fixed bug that does not start on Windows
- Added control of AdBlock by domain
- Added option page for extensions
- Performance improvement of the top menu history
- Add page translation function that use Simultaneous page transition to right click menu
- Reduced the number of files using asar archive
- Addition of update information notification
- Add the latest history information to the top page
- Improved performance when new window is opened
- Able bind other windows to the panel (Only for Windows and Linux )  
  Note:  Please install wmctrl when using on Linux. (apt-get install wmctrl or yum(dnf) install wmctrl)
- Multiple search at the same time by right-clicked menu
- Drop and drag to divide the panel
- Download function is changed to Aria2's wrapper. It has better performance and stability. The limit of the maximum of parallel download will be changed to 16(Aria2's maximum).
- Improvement of the sidebar bookmark and the history function.
- Improvement of the top menu bookmark and the history function.
- Mouse gesture for special pages like Top Page
- Improvement of the behavior of the private tab
- Introducing the full text search in history function (Experimental)
- Deleting unnecessary data (Reducing some download size)


#### New Function (v0.2.0-v0.2.1)
- Search engines can be selected.
- Multiple simultaneous search function, (For example, if you input "g4 word" in the address bar, you can search in multiple panels with different conditions simultaneously.)
- Partial localize.
- Addition of the setting pages.
- Addition of the keyboard shortcuts and the setting page for the key bind.
- Add a function to convert 1 window with multiple panels to multiple windows
- Improve performance with MacOS
- Add function of horizontal scrolling by using triple clicks
- Add comic pdf viewer
- Improve right click menu line order
- Changing the action of the mouse's middle click by pressing for a long time and clicking only. (For normal clicking, the opposite panel will be opened as link. When pressing for a long time, the same panel will be open in the background as link. )


# TODO

- Addition of build method in the Readme
- Refactoring
- Add test code
- Auto Update
- New features  
