const {app,Menu,shell,ipcMain,BrowserWindow,session,webContents,clipboard} = require('electron')
const BrowserWindowPlus = require('./BrowserWindowPlus')
const seq = require('./sequence')
const locale = require('../brave/app/locale')
import mainState from './mainState'
import {getFocusedWebContents, getCurrentWindow} from './util'

const isDarwin = process.platform === 'darwin'
const topURL = mainState.newTabMode == 'myHomepage' ? mainState.myHomepage : `chrome-extension://dckpbojndfoinamcdamhkjhnjnmjkfjd/${mainState.newTabMode}.html`

const preferencesMenuItem = () => {
  return {
    label: locale.translation(isDarwin ? 'preferences' : 'settings'),
    accelerator: mainState.keySettings,
    click: (item, focusedWindow) => {
      getFocusedWebContents().then(cont=>{
        cont && cont.hostWebContents.send('new-tab',cont.getId(),'chrome-extension://dckpbojndfoinamcdamhkjhnjnmjkfjd/settings.html')
      })
    }
  }
}

const createFileSubmenu = () => {
  const submenu = [
    {
      label: locale.translation('newTab'),
      accelerator: mainState.keyNewTab,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('new-tab',cont.getId(),"chrome://newtab/",void 0,!mainState.openTabNextLabel)
        })
      }
    },
    {
      label: locale.translation('newPrivateTab'),
      accelerator: mainState.keyNewPrivateTab,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('new-tab',cont.getId(),"chrome://newtab/",true,!mainState.openTabNextLabel)
        })
      }
    },
    {
      label: 'New Tor Tab',
      accelerator: mainState.keyNewTorTab,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('new-tab',cont.getId(),"chrome://newtab/",'persist:tor',!mainState.openTabNextLabel)
        })
      }
    },
    {
      label: locale.translation('newSessionTab'),
      accelerator: mainState.keyNewSessionTab,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('new-tab',cont.getId(),"chrome://newtab/", `persist:${seq()}`,!mainState.openTabNextLabel)
        })
      }
    },
    {
      label: locale.translation('newWindow'),
      accelerator: mainState.keyNewWindow,
      click(item, focusedWindow) {
        BrowserWindowPlus.load({id:focusedWindow.id,sameSize:true})
      }
    },
    { type: 'separator' },
    {
      label: locale.translation('openLocation'),
      accelerator: mainState.keyOpenLocation,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('focus-location-bar',cont.getId())
        })
      }
    },
    { type: 'separator' },
    {
      label: locale.translation('closeTab'),
      accelerator: mainState.keyCloseTab,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events','closeTab',cont.getId())
        })
      }
    },
    {
      // This should be disabled when no windows are active.
      label: locale.translation('closeWindow'),
      accelerator: mainState.keyCloseWindow,
      click(item, focusedWindow) {
        focusedWindow.close()
      }
    },
    {
      label: locale.translation('closeAllTabsMenuLabel'),
      accelerator: mainState.keyClosePanel,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'closePanel', cont.getId())
        })
      }
    },
    {
      label: locale.translation('closeOtherTabs'),
      accelerator: mainState.keyCloseOtherTabs,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events','closeOtherTabs',cont.getId())
        })
      }
    },
    {
      label: locale.translation('closeTabsToLeft'),
      accelerator: mainState.keyCloseTabsToLeft,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events','closeTabsToLeft',cont.getId())
        })
      }
    },
    {
      label: locale.translation('closeTabsToRight'),
      accelerator: mainState.keyCloseTabsToRight,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events','closeTabsToRight',cont.getId())
        })
      }
    },
    { type: 'separator' },
    {
      label: locale.translation('savePageAs'),
      accelerator: mainState.keySavePageAs,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          if(cont){
            ipcMain.emit('need-set-save-filename',null,cont.getURL())
            cont.downloadURL(cont.getURL(), true)
          }
        })
      }
    },
    { type: 'separator' },
    {
      label: locale.translation('print'),
      accelerator: mainState.keyPrint,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.print()
        })
      }
    }
  ]

  if (!isDarwin) {
    submenu.push({ type: 'separator' })
    submenu.push({
      label: 'Restart Browser',
      accelerator: mainState.keyRestart,
      click() { ipcMain.emit('quit-browser',null,'restart') }
    })
    submenu.push({
      label: locale.translation('quitApp').replace('Brave','Sushi Browser'),
      accelerator: mainState.keyQuit,
      click() { ipcMain.emit('quit-browser') }
    })
  }

  return submenu
}


const createEditSubmenu = () => {
  const submenu = [
    {
      label: locale.translation('undo'),
      accelerator: mainState.keyUndo,
      role: 'undo'
    }, {
      label: locale.translation('redo'),
      accelerator: mainState.keyRedo,
      role: 'redo'
    },
    { type: 'separator' },
    {
      label: locale.translation('cut'),
      accelerator: mainState.keyCut,
      role: 'cut'
    }, {
      label: locale.translation('copy'),
      accelerator: mainState.keyCopy,
      role: 'copy'
    }, {
      label: locale.translation('paste'),
      accelerator: mainState.keyPaste,
      role: 'paste'
    }, {
      label: locale.translation('pasteWithoutFormatting'),
      accelerator: mainState.keyPasteWithoutFormatting,
      click(item, focusedWindow) {
        focusedWindow.webContents.pasteAndMatchStyle()
      }
    },
    { type: 'separator' },
    {
      label: locale.translation('delete'),
      accelerator: 'Delete',
      click(item, focusedWindow) {
        focusedWindow.webContents.delete()
      }
    }, {
      label: locale.translation('selectAll'),
      accelerator: mainState.keySelectAll,
      role: 'selectall'
    },
    { type: 'separator' },

    {
      label: locale.translation('findOnPage'),
      accelerator: mainState.keyFindOnPage,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events','findOnPage',cont.getId())
        })
      }
    },
    { type: 'separator' },
    {
      label: locale.translation('clicktabCopyTabUrl').replace('&apos;',"'"),
      accelerator: mainState.keyClicktabCopyTabUrl,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'clicktabCopyTabUrl', cont.getId())
        })
      }
    },
    {
      label: locale.translation('clicktabCopyUrlFromClipboard'),
      accelerator: mainState.keyClicktabCopyUrlFromClipboard,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'clicktabCopyUrlFromClipboard', cont.getId())
        })
      }
    },
    {
      label: 'Paste and Open',
      accelerator: mainState.keyPasteAndOpen,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'pasteAndOpen', cont.getId())
        })
      }
    },
    {
      label: 'Copy Tab Info',
      accelerator: mainState.keyCopyTabInfo,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'copyTabInfo', cont.getId())
        })
      }
    },
    {
      label: 'Copy All Tab Titles',
      accelerator: mainState.keyCopyAllTabTitles,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'copyAllTabTitles', cont.getId())
        })
      }
    },
    {
      label: 'Copy All Tab URLs',
      accelerator: mainState.keyCopyAllTabUrls,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'copyAllTabUrls', cont.getId())
        })
      }
    },
    {
      label: 'Copy All Tab Infos',
      accelerator: mainState.keyCopyAllTabInfos,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'copyAllTabInfos', cont.getId())
        })
      }
    },
    // { type: 'separator' }
    // NOTE: macOS inserts "start dictation" and "emoji and symbols" automatically
  ]

  // console.log('mainState.rectSelection',mainState.rectSelection&&mainState.rectSelection[1])
  // if(mainState.rectSelection){
  //   delete submenu[4].role
  //   submenu[4].click = function(item, focusedWindow) {
  //     console.log('mainState.rectSelection2',mainState.rectSelection[1])
  //     clipboard.writeText(mainState.rectSelection[1])
  //   }
  // }

  if (isDarwin) {
    // delete submenu[4].role
    // submenu[4].click = function(item, focusedWindow) {
    //   getFocusedWebContents(true).then(cont=>{
    //     cont && cont.copy()
    //   })
    // }
  }
  else{
    submenu.push({ type: 'separator' })
    submenu.push(preferencesMenuItem())
  }


  return submenu
}

const createViewSubmenu = () => {
  return [
    {
      label: locale.translation('actualSize'),
      accelerator: mainState.keyActualSize,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.zoomReset()
        })
      }
    }, {
      label: locale.translation('zoomIn'),
      accelerator: mainState.keyZoomIn,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'zoomIn', cont.getId())
        })
      }
    }, {
      label: locale.translation('zoomOut'),
      accelerator: mainState.keyZoomOut,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'zoomOut', cont.getId())
        })
      }
    },
    { type: 'separator' },
    {
      label: locale.translation('stop'),
      accelerator: mainState.keyStop,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.stop()
        })
      }
    },
    {
      label: locale.translation('reloadPage'),
      accelerator: mainState.keyReloadPage,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.reload()
        })
      }
    },
    {
      label: locale.translation('cleanReload'),
      accelerator: mainState.keyCleanReload,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.reloadIgnoringCache()
        })
      }
    },
    {
      label: locale.translation('clicktabReloadtabs'),
      accelerator: mainState.keyClicktabReloadtabs,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'clicktabReloadtabs', cont.getId())
        })
      }
    },
    {
      label: locale.translation('clicktabReloadothertabs'),
      accelerator: mainState.keyClicktabReloadothertabs,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'clicktabReloadothertabs', cont.getId())
        })
      }
    },
    {
      label: locale.translation('clicktabReloadlefttabs'),
      accelerator: mainState.keyClicktabReloadlefttabs,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'clicktabReloadlefttabs', cont.getId())
        })
      }
    },
    {
      label: locale.translation('clicktabReloadrighttabs'),
      accelerator: mainState.keyClicktabReloadrighttabs,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'clicktabReloadrighttabs', cont.getId())
        })
      }
    },
    { type: 'separator' },
    {
      label: locale.translation('3007771295016901659'),
      accelerator: mainState.keyDuplicateTab,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'duplicateTab', cont.getId())
        })
      }
    },
    {
      label: locale.translation('pinTab'),
      accelerator: mainState.keyUnpinTab,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'unpinTab', cont.getId())
        })
      }
    },
    {
      label: locale.translation('muteTab'),
      accelerator: mainState.keyUnmuteTab,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'unmuteTab', cont.getId())
        })
      }
    },    {
      label: locale.translation('freezeTabMenuLabel'),
      accelerator: mainState.keyFreezeTabMenuLabel,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'freezeTabMenuLabel', cont.getId())
        })
      }
    },
    {
      label: locale.translation('protectTabMenuLabel'),
      accelerator: mainState.keyProtectTabMenuLabel,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'protectTabMenuLabel', cont.getId())
        })
      }
    },
    {
      label: locale.translation('lockTabMenuLabel'),
      accelerator: mainState.keyLockTabMenuLabel,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'lockTabMenuLabel', cont.getId())
        })
      }
    },
    { type: 'separator' },
    {
      label: locale.translation('toggleDeveloperTools'),
      accelerator: mainState.keyToggleDeveloperTools,
      click(item) {
        getFocusedWebContents().then(cont=>{
          cont && cont.openDevTools()
        })
      }
    },
    { type: 'separator' },
    {
      label: locale.translation('toggleFullScreenView'),
      accelerator: mainState.keyToggleFullScreenView,
      click(item, focusedWindow) {
        if (focusedWindow) {
          if(isDarwin){
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
          }
          else{
            const isFullScreen = focusedWindow.isFullScreen()
            focusedWindow.webContents.send('switch-fullscreen',!isFullScreen)
            focusedWindow.setFullScreenable(true)
            const menubar = focusedWindow.isMenuBarVisible()
            focusedWindow.setFullScreen(!isFullScreen)
            focusedWindow.setMenuBarVisibility(menubar)
            focusedWindow.setFullScreenable(false)
          }
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Full Page Capture to Clipboard',
      accelerator: mainState.keyScreenShotFullClipBoard,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'screenShotFullClipBoard', cont.getId())
        })
      }
    },
    {
      label: 'Full Page Capture as JPEG',
      accelerator: mainState.keyScreenShotFullJpeg,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'screenShotFullJpeg', cont.getId())
        })
      }
    },
    {
      label: 'Full Page Capture as PNG',
      accelerator: mainState.keyScreenShotFullPng,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'screenShotFullPng', cont.getId())
        })
      }
    },
    {
      label: 'Selection Capture to Clipboard',
      accelerator: mainState.keyScreenShotSelectionClipBoard,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'screenShotSelectionClipBoard', cont.getId())
        })
      }
    },
    {
      label: 'Selection Capture as JPEG',
      accelerator: mainState.keyScreenShotSelectionJpeg,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'screenShotSelectionJpeg', cont.getId())
        })
      }
    },
    {
      label: 'Selection Capture as PNG',
      accelerator: mainState.keyScreenShotSelectionPng,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'screenShotSelectionPng', cont.getId())
        })
      }
    },
  ]
}


const createHistorySubmenu = () => {
  let submenu = [
    {
      label: locale.translation('home'),
      accelerator: mainState.keyHome,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=> {
          cont && cont.hostWebContents.send('menu-or-key-events', 'navigatePage', cont.getId(), "chrome://newtab/")
        })
      }
    },
    {
      label: locale.translation('back'),
      accelerator: mainState.keyBack,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=> {
          cont && cont.hostWebContents.send('go-navigate', cont.getId(), 'back')
        })
      }
    },
    {
      label: locale.translation('forward'),
      accelerator: mainState.keyForward,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=> {
          cont && cont.hostWebContents.send('go-navigate', cont.getId(), 'forward')
        })
      }
    },
    { type: 'separator' },
    {
      label: locale.translation('reopenLastClosedTab'),
      accelerator: mainState.keyReopenLastClosedTab,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'reopenLastClosedTab', cont.getId())
        })
      }
    },
    {
      label: locale.translation('clicktabUcatab'),
      accelerator: mainState.keyClicktabUcatab,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'clicktabUcatab', cont.getId())
        })
      }
    },
    { type: 'separator' },
    {
      label: locale.translation('showAllHistory'),
      accelerator: mainState.keyShowAllHistory,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('new-tab',cont.getId(),'chrome://history/')
        })
      }
    }
  ]

  return submenu
}

const createBookmarksSubmenu = () => {
  let submenu = [
    {
      label: locale.translation('bookmarkPage'),
      accelerator: mainState.keyBookmarkPage,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('add-favorite',cont.getId())
        })
      }
    },
    {
      label: locale.translation('5078638979202084724'),
      accelerator: mainState.keyAddBookmarkAll,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'addBookmarkAll', cont.getId())
        })
      }
    },
    { type: 'separator' },
    {
      label: locale.translation('bookmarksManager'),
      accelerator: mainState.keyBookmarksManager,
      click: (item, focusedWindow) => {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('new-tab',cont.getId(),'chrome://bookmarks/')
        })
      }
    },
    { type: 'separator' },
    {
      label: locale.translation('importBrowserData'),
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          ipcMain.emit("import-browser-data",{sender: cont})
        })
      }
    },
    {
      label: locale.translation('exportBookmarks'),
      click(item, focusedWindow) {
        ipcMain.emit("export-bookmark")
      }
    }
  ]

  return submenu
}

const createWindowSubmenu = () => {
  const submenu = [
    {
      label: locale.translation('minimize'),
      accelerator: mainState.keyMinimize,
      role: 'minimize'
      // "Minimize all" added automatically
    },
    { type: 'separator' },
    {
      label: locale.translation('selectNextTab'),
      accelerator: mainState.keySelectNextTab,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'selectNextTab', cont.getId())
        })
      }
    },
    {
      label: locale.translation('selectPreviousTab'),
      accelerator: mainState.keySelectPreviousTab,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'selectPreviousTab', cont.getId())
        })
      }
    },
    { type: 'separator' },
    {
      label: 'Multi Row Tabs',
      accelerator: mainState.keyMultiRowTabs,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'multiRowTabs', cont.getId())
        })
      }
    },
    {
      label: 'Tab Preview',
      accelerator: mainState.keyTabPreview,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'tabPreview', cont.getId())
        })
      }
    },
    {
      label: 'Toggle MenuBar',
      accelerator: mainState.keyToggleMenuBar,
      click(item, focusedWindow) {
        if (focusedWindow) focusedWindow.webContents.send('toggle-nav')
      }
    },
    {
      label: 'Change Focus Panel',
      accelerator: mainState.keyChangeFocusPanel,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'changeFocusPanel', cont.getId())
        })
      }
    },
    { type: 'separator' },
    {
      label: 'Split Left',
      accelerator: mainState.keySplitLeft,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'splitLeft', cont.getId())
        })
      }
    },
    {
      label: 'Split Right',
      accelerator: mainState.keySplitRight,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'splitRight', cont.getId())
        })
      }
    },
    {
      label: 'Split Top',
      accelerator: mainState.keySplitTop,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'splitTop', cont.getId())
        })
      }
    },
    {
      label: 'Split Bottom',
      accelerator: mainState.keySplitBottom,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'splitBottom', cont.getId())
        })
      }
    },
    {
      label: 'Split left tabs to left',
      accelerator: mainState.keySplitLeftTabs,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'splitLeftTabs', cont.getId())
        })
      }
    },
    {
      label: 'Split right tabs to right',
      accelerator: mainState.keySplitRightTabs,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'splitRightTabs', cont.getId())
        })
      }
    },
    { type: 'separator' },
    {
      label: 'Swap Position',
      accelerator: mainState.keySwapPosition,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'swapPosition', cont.getId())
        })
      }
    },
    {
      label: 'Switch Direction',
      accelerator: mainState.keySwitchDirection,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'switchDirection', cont.getId())
        })
      }
    },
    {
      label: 'Align Horizontal',
      accelerator: mainState.keyAlignHorizontal,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'alignHorizontal', cont.getId())
        })
      }
    },
    {
      label: 'Align Vertical',
      accelerator: mainState.keyAlignVertical,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'alignVertical', cont.getId())
        })
      }
    },
    { type: 'separator' },
    {
      label: 'Switch Sync Scroll',
      accelerator: mainState.keySwitchSyncScroll,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'switchSyncScroll', cont.getId())
        })
      }
    },
    {
      label: 'Open Sidebar',
      accelerator: mainState.keyOpenSidebar,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'openSidebar', cont.getId())
        })
      }
    },
    {
      label: 'Enable Search Highlight',
      accelerator: mainState.keySearchHighlight,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'searchHighlight', cont.getId())
        })
      }
    },
    {
      label: 'Change to Mobile Agent',
      accelerator: mainState.keyChangeMobileAgent,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'changeMobileAgent', cont.getId())
        })
      }
    },
    { type: 'separator' },
    {
      label: 'Detach Panel',
      accelerator: mainState.keyDetachPanel,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('menu-or-key-events', 'detachPanel', cont.getId())
        })
      }
    },
    // {
    //   label: 'Download All',
    //   accelerator: mainState.keyDownloadAll,
    //   click(item, focusedWindow) {
    //     getFocusedWebContents().then(cont=>{
    //       cont && cont.hostWebContents.send('menu-or-key-events', 'downloadAll', cont.getId())
    //     })
    //   }
    // },
    // {
    //   label: locale.translation('2473195200299095979'),
    //   accelerator: mainState.keyPageTranslate,
    //   click(item, focusedWindow) {
    //     getFocusedWebContents().then(cont=>{
    //       cont && cont.hostWebContents.send('menu-or-key-events', 'pageTranslate', cont.getId())
    //     })
    //   }
    // },
    { type: 'separator' },
    {
      label: locale.translation('downloadsManager'),
      accelerator: mainState.keyDownloadsManager,
      click(item, focusedWindow){
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('new-tab',cont.getId(),'chrome-extension://dckpbojndfoinamcdamhkjhnjnmjkfjd/download.html')
        })
      }
    },
    {
      label: 'Open Note',
      accelerator: mainState.keyNote,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('new-tab',cont.getId(),'chrome://note/')
        })
      }
    },
    {
      label: 'Open FileExploler',
      accelerator: mainState.keyFileExploler,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('new-tab',cont.getId(),'chrome://explorer/')
        })
      }
    },
    {
      label: 'Open Terminal',
      accelerator: mainState.keyTerminal,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('new-tab',cont.getId(),'chrome://terminal/')
        })
      }
    },
    {
      label: 'Open Automation',
      accelerator: mainState.keyAutomation,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('new-tab',cont.getId(),'chrome://automation/')
        })
      }
    },
    {
      label: 'Open VideoConverter',
      accelerator: mainState.keyVideoConverter,
      click(item, focusedWindow) {
        getFocusedWebContents().then(cont=>{
          cont && cont.hostWebContents.send('new-tab',cont.getId(),'chrome://converter/')
        })
      }
    }
  ]

  if (isDarwin) {
    submenu.push(
      { type: 'separator' },
      {
        label: locale.translation('bringAllToFront'),
        role: 'front'
      }
    )
  }

  return submenu
}


let appMenu
function getTemplate(){
  const template = [
    { label: locale.translation('file'), submenu: createFileSubmenu() },
    { label: locale.translation('edit'), submenu: createEditSubmenu() },
    { label: locale.translation('view'), submenu: createViewSubmenu() },
    { label: locale.translation('history'), submenu: createHistorySubmenu() },
    { label: locale.translation('bookmarks'), submenu: createBookmarksSubmenu() },
    { label: locale.translation('window'), submenu: createWindowSubmenu(), role: 'window' },
    // { label: locale.translation('help'), submenu: createHelpSubmenu(), role: 'help' }
  ]


  // const t = [
  //   {
  //     label: 'File',
  //     submenu: [
  //       { label: 'New &Window',
  //         accelerator: 'CmdOrCtrl+Alt+N',
  //         click: ()=>{BrowserWindowPlus.load()}
  //       },
  //       {
  //         label: 'Close',
  //         accelerator: 'CmdOrCtrl+W',
  //         role: 'close'
  //       }
  //     ]
  //   },
  //   {
  //     label: 'Edit',
  //     submenu: [
  //       {
  //         label: 'Undo',
  //         accelerator: 'CmdOrCtrl+Z',
  //         role: 'undo'
  //       },
  //       {
  //         label: 'Redo',
  //         accelerator: 'CmdOrCtrl+Y',
  //         role: 'redo'
  //       }
  //     ]
  //   },
  //   {
  //     label: 'View',
  //     submenu: [
  //       {
  //         label: `Toggle MenuBar`,
  //         accelerator: 'CmdOrCtrl+Alt+T',
  //         click(item, focusedWindow) {
  //           if (focusedWindow) focusedWindow.webContents.send('toggle-nav')
  //         }
  //       },
  //       {
  //         label: 'Toggle Full Screen',
  //         accelerator: (function () {
  //           if (process.platform === 'darwin') {
  //             return 'Ctrl+Command+F'
  //           } else {
  //             return 'F11'
  //           }
  //         })(),
  //         click(item, focusedWindow) {
  //           if (focusedWindow) {
  //             focusedWindow.setFullScreenable(true)
  //             const menubar = focusedWindow.isMenuBarVisible()
  //             focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
  //             focusedWindow.setMenuBarVisibility(menubar)
  //             focusedWindow.setFullScreenable(false)
  //           }
  //         }
  //       },
  //       {
  //         label: 'Toggle Developer Tools',
  //         accelerator: (function () {
  //           if (process.platform === 'darwin') {
  //             return 'Alt+Command+I'
  //           } else {
  //             return 'Ctrl+Shift+I'
  //           }
  //         })(),
  //         click(item, focusedWindow) {
  //           if (focusedWindow) focusedWindow.toggleDevTools()
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     label: 'Help',
  //     role: 'help',
  //     submenu: [
  //       {
  //         label: 'Learn More',
  //         click() { shell.openExternal('http://electron.atom.io') }
  //       }
  //     ]
  //   }
  // ]

  if (isDarwin) {
    const name = app.getName()
    template.unshift({
      label: name,
      submenu: [
        // {
        //   label: 'About ' + name,
        //   role: 'about'
        // },
        // {
        //   type: 'separator'
        // },
        preferencesMenuItem(),
        { type: 'separator' },
        {
          label: locale.translation('services'),
          role: 'services'
        },
        {
          label: locale.translation('hideBrave').replace('Brave','Sushi Browser'),
          accelerator: mainState.keyHideBrave,
          role: 'hide'
        },
        {
          label: locale.translation('hideOthers'),
          accelerator: mainState.keyHideOthers,
          role: 'hideothers'
        },
        {
          label: locale.translation('showAll'),
          role: 'unhide'
        },
        { type: 'separator' },
        {
          label: 'Restart Browser',
          accelerator: mainState.keyRestart,
          click() { ipcMain.emit('quit-browser',null,'restart') }
        },
        {
          label: locale.translation('quitApp').replace('Brave','Sushi Browser'),
          accelerator: mainState.keyQuit,
          click() { ipcMain.emit('quit-browser') }
        }
      ]
    })
  }
  return template
}

export default function updateMenu(){
  let oldMenu = appMenu
  appMenu = Menu.buildFromTemplate(getTemplate())
  Menu.setApplicationMenu(appMenu)

  if (oldMenu) {
    oldMenu.destroy()
  }
}

updateMenu()

