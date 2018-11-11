'use strict'

const {ipcRenderer,webFrame} = require('electron')
ipcRenderer.setMaxListeners(0)

module.exports = function(isExtensionPage, isBackgroundPage){

// Check whether pattern matches.
// https://developer.chrome.com/extensions/match_patterns
  const matchesPattern = function (pattern) {
    if (pattern === '<all_urls>') return true
    const regexp = new RegExp(`^${pattern.replace(/[-[\]{}()^$|+?.\\/\s]/g, '\\$&').replace(/\*/g, '.*')}$`)
    console.log('matchesPattern',pattern,regexp)
    const url = `${location.protocol}//${location.host}${location.pathname}`
    return url.match(regexp)
  }

  const matchesGlob = function (pattern) {
    if (pattern === '<all_urls>') return true
    const regexp = new RegExp(`^${pattern.replace(/[-[\]{}()^$|+.\\/\s]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.?')}$`)
    console.log('matchesGlob',pattern,regexp)
    const url = `${location.protocol}//${location.host}${location.pathname}`
    return url.match(regexp)
  }

// Run the code with chrome API integrated.
  let seq = 0, seqMap = {}
  const runContentScript = function (extensionId, name, url, code) {
    const context = {}
    require('@electron/internal/renderer/chrome-api').injectTo(extensionId, false, isExtensionPage, context)
    const wrapper = `((chrome) => { console.log(1);\n ${code}\n  })`
    let worldId = seqMap[extensionId]
    if(!worldId){
      worldId = ++seq
      seqMap[extensionId] = worldId
    }

    webFrame.setIsolatedWorldHumanReadableName(worldId, name)

    return function(){
      webFrame.executeJavaScriptInIsolatedWorld(worldId, [{code: wrapper}], false, compiledWrapper => {
        compiledWrapper.call(this, context.chrome)
      })
      console.log('runInThisContext')
    }

    // const compiledWrapper = runInThisContext(wrapper, {
    //   filename: url,
    //   lineOffset: 1,
    //   displayErrors: true
    // })
    // return compiledWrapper.call(this, context.chrome)
  }

  const runAllContentScript = function (scripts, extensionId, name) {
    let _url, _code = []
    for (const { url, code } of scripts) {
      _url = url
      _code.push(code)
    }
    return runContentScript.call(window, extensionId, name, _url, _code.join("\n;\n"))
  }

  const runStylesheet = function (extensionId, name, url, code) {
    const wrapper = `((code) => {
    function init() {
      const styleElement = document.createElement('style');
      styleElement.textContent = code;
      document.head.append(styleElement);
    }
    document.addEventListener('DOMContentLoaded', init);
  })`

    let worldId = seqMap[extensionId]
    if(!worldId){
      worldId = ++seq
      seqMap[extensionId] = worldId
    }
    webFrame.setIsolatedWorldHumanReadableName(worldId, name)

    return function(){
      webFrame.executeJavaScriptInIsolatedWorld(worldId, [{code: wrapper}], false, compiledWrapper => {
        compiledWrapper.call(this, code)
      })
    }
  }

  const runAllStylesheet = function (css, extensionId, name) {
    for (const { url, code } of css) {
      return runStylesheet.call(window, extensionId, name, url, code)
    }
  }

// Run injected scripts.
// https://developer.chrome.com/extensions/content_scripts
  const injectContentScript = function (extensionId, name, script) {
    if (!script.matches.some(matchesPattern)) return
    if (script.include_globs && !script.include_globs.some(matchesGlob)) return
    if (script.exclude_matches && script.exclude_matches.some(matchesPattern)) return
    if (script.exclude_globs && script.exclude_globs.some(matchesGlob)) return


    if (script.js) {
      const fire = runAllContentScript.bind(window, script.js, extensionId, name)()
      if (script.runAt === 'document_start') {
        process.once('document-start', fire)
      } else if (script.runAt === 'document_end') {
        process.once('document-end', fire)
      } else {
        document.addEventListener('DOMContentLoaded', fire)
      }
    }

    if (script.css) {
      const fire = runAllStylesheet.bind(window, script.css, extensionId, name)()
      if(!fire){}
      else if (script.runAt === 'document_start') {
        process.once('document-start', fire)
      } else if (script.runAt === 'document_end') {
        process.once('document-end', fire)
      } else {
        document.addEventListener('DOMContentLoaded', fire)
      }
    }
  }

// Handle the request of chrome.tabs.executeJavaScript.
  ipcRenderer.on('CHROME_TABS_EXECUTESCRIPT', function (event, senderWebContentsId, requestId, extensionId, url, code) {
    const result = runContentScript.call(window, extensionId, url, code)
    ipcRenderer.sendToAll(senderWebContentsId, `CHROME_TABS_EXECUTESCRIPT_RESULT_${requestId}`, result)
  })

// Read the renderer process preferences.
  const preferences = ipcRenderer.sendSync('get-render-process-preferences')
  if (preferences) {
    for (const pref of preferences) {
      if (pref.contentScripts) {
        for (const script of pref.contentScripts) {
          console.log(pref.extensionId, isExtensionPage, window.location.href, script)
          if(isExtensionPage && !pref.admin) continue
          // if((isExtensionPage && !pref.admin) ||
          //   (isBackgroundPage && !window.location.href.startsWith(`chrome-extension://${pref.extensionId}`))) continue
          injectContentScript(pref.extensionId, pref.name, script)
        }
      }
    }
  }

}