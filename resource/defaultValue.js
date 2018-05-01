const isDarwin = process.platform === 'darwin'
const isLinux = process.platform === 'linux'

const settingDefault =  {
  toggleNav: 0,
  adBlockEnable: true,
  httpsEverywhereEnable: false,
  trackingProtectionEnable: false,
  noScript: false,
  blockCanvasFingerprinting: false,
  pdfMode: 'normal',
  oppositeGlobal: true,
  alwaysOnTop: false,
  downloadNum: 1,
  concurrentDownload: 10,
  searchEngine: 'Google',
  myHomepage: 'https://sushib.me/',
  startsWith: 'newTab',
  newTabMode: 'top',
  language: 'default',
  enableFlash: true,
  sideBarDirection: 'left',
  doubleShift: false,
  tripleClick: true,
  longPressMiddle: true,
  historyBadget: true,
  syncScrollMargin: 30,
  contextMenuSearchEngines: ["Google","google past year and normal","google multi search"],
  downloadPath: '',
  enableWidevine: true,

  bindMarginFrame: isLinux ? 6 : 0,
  bindMarginTitle: isLinux ? 24  : 0,

  checkedVersion: '0.00',
  checkDefaultBrowser: true,
  disableExtensions: [],
  adBlockDisableSite: {},
  disableContextMenus: [],
  disableTabContextMenus: ['closeTab','reload','Split Left','Split Top','cleanReload','Split right tabs to right','Split left tabs to left','Align Vertical','closeTabsToLeft','bookmarkPage','clicktabCopyTabUrl','clicktabCopyUrlFromClipboard','Copy Tab Info','clicktabReloadtabs','clicktabReloadothertabs','clicktabReloadlefttabs','clicktabReloadrighttabs','clicktabUcatab','protectTabMenuLabel','lockTabMenuLabel'],
  priorityContextMenus: {},
  priorityTabContextMenus: {},

  sendToVideo: isLinux ? 'vlc' : isDarwin ? '"quicktime player"' : 'wmplayer',
  vpnNames: [],
  navbarItems: {
    left: ['back','forward','reload'],
    right: ['sync','sidebar','mobile','screenshot','favorite','history','savedState','video'],
    backSide: ['syncReplace','tabHistory','opposite','download','folder','terminal'],
  },
  verticalTab: false,
  verticalTabWidth: 200,
  tabBarHide: false,
  verticalTabPosition: 'none',
  verticalTabTree: true,
  autoSaveInterval: 60,
  orderOfAutoComplete: 'suggestionToHistory',
  numOfSuggestion: 0,
  numOfHistory: 15,
  displayFullIcon: true,
  notLoadTabUntilSelected: false,
  searchWordHighlight: false,
  bookmarkBar: false,
  bookmarkBarTopPage: true,

  //privacy
  clearHistoryOnClose: false,
  clearDownloadOnClose: false,
  clearCacheOnClose: false,
  clearStorageDataOnClose: false,
  clearAutocompleteDataOnClose: false,
  clearAutofillDataOnClose: false,
  clearPasswordOnClose: false,
  clearGeneralSettingsOnClose: false,
  clearFavoriteOnClose: false,

  //tab
  reloadIntervals: [60,120,300,900,1800],
  openTabNextLabel: false,
  generalWindowOpenLabel: 'linkTargetWindow',
  keepWindowLabel31 : false,
  closeTabBehavior: 'focusTabRightTab',
  multistageTabs: false,
  maxrowLabel: 0,
  scrollTab: true,
  reverseScrollTab: false,
  tabMinWidth: 150,
  tabMaxWidth: 200,
  mouseHoverSelectLabelBegin: false,
  mouseHoverSelectLabelBeginDelay: 250,
  tabFlipLabel: false,
  doubleClickTab: 'reload',
  middleClickTab: 'closeTab',
  altClickTab: 'clicktabNothing',
  rightClickTabAdd: 'Paste and Open',
  middleClickTabAdd: 'newPrivateTab',
  altClickTabAdd: 'clicktabNothing',

  colorNormalText: '#222',
  colorNormalBackground: '#d0d0d0',
  colorActiveText: '#222',
  colorActiveBackground: '#f2f2f2',
  colorTabDot: '#777',
  colorUnreadText: '#9f0000',
  colorUnreadBackground: '#d0d0d0',
  colorTabMode: '#37a9fd',

  showBorderActiveTab: false,
  enableColorOfNoSelect: false,
  themeColorChange: false,

  alwaysOpenLinkNewTab: 'speLinkNone',
  alwaysOpenLinkBackground: false,
  addressBarNewTab: false,

  //video convert
  defaultVideoPreset: 'Fast 1080p30',
  defaultPopupSelect: 'video',

  //keyboard shortcut default
  keyQuit: 'CmdOrCtrl+Q',
  keyNewTab: 'CmdOrCtrl+T',
  keyNewPrivateTab: 'Shift+CmdOrCtrl+P',
  keyNewSessionTab: 'Shift+CmdOrCtrl+S',
  keyNewWindow: 'CmdOrCtrl+N',
  keyOpenLocation: 'CmdOrCtrl+L',
  keyCloseTab: 'CmdOrCtrl+W',
  keyCloseWindow: 'CmdOrCtrl+Shift+W',
  keyClosePanel: 'CmdOrCtrl+Alt+C',
  keyCloseOtherTabs: 'Shift+CmdOrCtrl+O',
  keyCloseTabsToLeft: '',
  keyCloseTabsToRight: '',
  keySavePageAs: 'CmdOrCtrl+S',
  keyPrint: 'CmdOrCtrl+P',

  keyUndo: 'CmdOrCtrl+Z',
  keyRedo: 'CmdOrCtrl+Y',
  keyCut: 'CmdOrCtrl+X',
  keyCopy: 'CmdOrCtrl+C',
  keyPaste: 'CmdOrCtrl+V',
  keyPasteWithoutFormatting: 'Shift+CmdOrCtrl+V',
  keySelectAll: 'CmdOrCtrl+A',

  keyFindOnPage: 'CmdOrCtrl+F',
  keySettings: 'CmdOrCtrl+,',

  keyActualSize: 'CmdOrCtrl+0',
  keyZoomIn: 'CmdOrCtrl+=',
  keyZoomOut: 'CmdOrCtrl+-',
  keyStop: isDarwin ? 'Cmd+.' : 'Esc',
  keyReloadPage: 'CmdOrCtrl+R',
  keyCleanReload: 'CmdOrCtrl+Shift+R',

  keyClicktabReloadtabs: 'CmdOrCtrl+Alt+R',
  keyClicktabReloadothertabs: 'CmdOrCtrl+Alt+O',
  keyClicktabReloadlefttabs: 'CmdOrCtrl+Alt+L',
  keyClicktabReloadrighttabs: 'CmdOrCtrl+Alt+I',

  keyToggleDeveloperTools: isDarwin ? 'Cmd+Alt+I' : 'Ctrl+Shift+I',
  keyToggleFullScreenView: isDarwin ? 'Ctrl+Cmd+F' : 'F11',

  keyHome: 'CmdOrCtrl+Shift+H',
  keyBack: 'CmdOrCtrl+[',
  keyForward: 'CmdOrCtrl+]',
  keyReopenLastClosedTab: 'Shift+CmdOrCtrl+T',
  keyClicktabUcatab: 'Shift+CmdOrCtrl+A',
  keyShowAllHistory: 'CmdOrCtrl+Y',

  keyBookmarkPage: 'CmdOrCtrl+D',
  keyAddBookmarkAll: 'Shift+CmdOrCtrl+B',
  keyBookmarksManager: isDarwin ? 'CmdOrCtrl+Alt+B' : 'Ctrl+Shift+O',

  keyMinimize: 'CmdOrCtrl+M',
  keySelectNextTab: 'Ctrl+Tab',
  keySelectPreviousTab: 'Ctrl+Shift+Tab',

  keyDownloadsManager: isDarwin ? 'CmdOrCtrl+Shift+J' : 'Ctrl+J',
  keyHideBrave: 'Command+H',
  keyHideOthers: 'Command+Alt+H',

  //Orginal key binding
  keyToggleMenuBar: 'CmdOrCtrl+Alt+T',
  keyChangeFocusPanel: 'CmdOrCtrl+Alt+Space',

  keySplitLeft: 'CmdOrCtrl+Alt+Left',
  keySplitRight: 'CmdOrCtrl+Alt+Right',
  keySplitTop: 'CmdOrCtrl+Alt+Up',
  keySplitBottom: 'CmdOrCtrl+Alt+Down',
  keySplitLeftTabs: '',
  keySplitRightTabs: '',

  keySwapPosition: 'CmdOrCtrl+Alt+P',
  keySwitchDirection: 'CmdOrCtrl+Alt+D',

  keyAlignHorizontal: 'CmdOrCtrl+Alt+H',
  keyAlignVertical: 'CmdOrCtrl+Alt+V',

  keySwitchSyncScroll: 'CmdOrCtrl+Alt+S',
  keyOpenSidebar: 'CmdOrCtrl+Alt+B',
  keyChangeMobileAgent: 'CmdOrCtrl+Alt+M',

  keyDetachPanel: 'CmdOrCtrl+Alt+E',

  // keyDownloadAll: 'Shift+CmdOrCtrl+D',
  // keyPageTranslate: 'CmdOrCtrl+Alt+A',

  //clipboard
  keyClicktabCopyTabUrl: '',
  keyClicktabCopyUrlFromClipboard: 'CmdOrCtrl+Alt+U',
  keyPasteAndOpen: 'CmdOrCtrl+Alt+N',
  keyCopyTabInfo: '',
  keyCopyAllTabInfos: '',

  //util
  keyDuplicateTab: '',
  keyUnpinTab: '',
  keyUnmuteTab: 'Shift+CmdOrCtrl+M',
  keyFreezeTabMenuLabel: '',
  keyProtectTabMenuLabel: '',
  keyLockTabMenuLabel: '',

  //localshortcut
  keyFindOnPage_1: 'F6',
  keySelectNextTab_1: 'CmdOrCtrl+Shift+]',
  keySelectNextTab_2: 'Ctrl+PageDown',
  keySelectPreviousTab_1: 'CmdOrCtrl+Shift+[',
  keySelectPreviousTab_2: 'Ctrl+PageUp',
  keyLastTab: 'CmdOrCtrl+9',
  keyFindNext: 'CmdOrCtrl+G',
  keyFindPrevious: 'CmdOrCtrl+Shift+G',
  keyToggleDeveloperTools_1: 'CmdOrCtrl+Alt+J',
  keyZoomIn_1: 'CmdOrCtrl+Shift+=',
  keyZoomOut_1: 'CmdOrCtrl+Shift+-',
  keyReloadPage_1: 'F5',
  keyCleanReload_1: 'Ctrl+F5',
  keyCloseWindow_1: 'Ctrl+F4',
  keyOpenLocation_1: 'Alt+D',
  keyBack_1: 'Alt+Left',
  keyForward_1: 'Alt+Right',
  keyViewPageSource: isDarwin ? 'Cmd+Alt+U' : 'Ctrl+U',
  keyTab1: 'CmdOrCtrl+1',
  keyTab2: 'CmdOrCtrl+2',
  keyTab3: 'CmdOrCtrl+3',
  keyTab4: 'CmdOrCtrl+4',
  keyTab5: 'CmdOrCtrl+5',
  keyTab6: 'CmdOrCtrl+6',
  keyTab7: 'CmdOrCtrl+7',
  keyTab8: 'CmdOrCtrl+8',


  enableKeyDownVideo: false,
  reverseWheelVideo: false,
  blackListVideo: [],

  mediaSeek1Video: 5,
  mediaSeek2Video: 10,
  mediaSeek3Video: 60,

  clickVideo: '',
  dbClickVideo: 'fullscreen',

  wheelMinusVideo: 'rewind1',
  shiftWheelMinusVideo:'decSpeed',
  ctrlWheelMinusVideo: 'decreaseVolume',
  shiftCtrlWheelMinusVideo: 'frameBackStep',

  keyVideoPlayOrPause: ['MediaPlayPause','Space','k'],
  keyVideoFrameStep: ['.'],
  keyVideoFrameBackStep: [','],
  keyVideoRewind1: ['Left', 'Ctrl+Shift+B'],
  keyVideoRewind2: ['j'],
  keyVideoRewind3: ['PageDown'],
  keyVideoForward1: ['Right', 'Ctrl+Shift+F'],
  keyVideoForward2: ['l'],
  keyVideoForward3: ['PageUp'],
  keyVideoNormalSpeed: ['Backspace'],
  keyVideoHalveSpeed: ['{'],
  keyVideoDoubleSpeed: ['}'],
  keyVideoDecSpeed: ['['],
  keyVideoIncSpeed: [']'],
  keyVideoFullscreen: ['F', 'Ctrl+T'],
  keyVideoExitFullscreen: ['Esc'],
  keyVideoMute: ['M', 'VolumeMute'],
  keyVideoDecreaseVolume: ['/', 'VolumeDown'],
  keyVideoIncreaseVolume: ['*', 'VolumeUp'],
  keyVideoPlRepeat: ['R'],

  //automation
  autoMousedown: true,
  autoMouseup: true,
  autoClick: true,
  autoDblclick: true,
  autoKeydown: true,
  autoInput: true,
  autoChange: true,
  autoSelect: false,
  autoSubmit: false,
  autoScroll: false,
  autoMousemove: true,
  autoFocusin: false,
  autoFocusout: false,
  autoCut: true,
  autoCopy: true,
  autoPaste: true,
  autoBack: true,
  autoForward: true,
  autoGoIndex: true,
  autoNavigate: true,
  autoTabCreate: true,
  autoTabRemoved: true,
  autoTabSelected: true,
  autoMousemoveTime: 3,
  autoHighlight: true,
  autoPlaySpeed: 0,
  puppeteer: '',
  automationHistory: [],
}


module.exports = {
  settingDefault
}