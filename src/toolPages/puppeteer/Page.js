import {FrameManager} from './FrameManager'
import {Request,Response} from './NetworkManager'
import Target from './Target'
import Dialog from './Dialog'
const {Keyboard, Mouse} = require('./Input');
const EventEmitter = require('events');
import helper from './helper'
import mime  from 'mime'
import defaultOptions from './defaultOptions'
import PubSub from '../../render/pubsub'
import uuid from 'node-uuid'
import LRUCache from 'lru-cache'
const ipc = chrome.ipcRenderer
const set = new Set()
const pagesMap = {}
const beforeRequestCache = new LRUCache(2000)
const requestCache = new LRUCache(2000)
const preloadJsMap = {}


ipc.on('start-dialog',(e,{key,title,message,buttons,tabId,url,type})=>{
  for(let page of set){
    if(page.tabId == tabId){
      page.emit('dialog',new Dialog(type, message,'',tabId))
      return
    }
  }
})

chrome.webNavigation.onBeforeNavigate.addListener(async details=>{
  const scripts = preloadJsMap[details.tabId]
  if(scripts){
    for(let page of set){
      if(page.tabId == tabId){
        for(let script of scripts){
          await page.evaluateExtContext(script)
        }
      }
    }
  }
})

chrome.webNavigation.onDOMContentLoaded.addListener(details=>{
  for(let page of set){
    if(page.tabId == details.tabId){
      page.emit('domcontentloaded')
      return
    }
  }
})

chrome.webNavigation.onCompleted.addListener(details=>{
  for(let page of set){
    if(page.tabId == details.tabId){
      page.emit('load')
      return
    }
  }
})


chrome.webRequest.onBeforeRequest.addListener(details=>{
  for(let page of set){
    if(page.tabId == details.tabId){
      beforeRequestCache.set(details.requestId,details)
      return
    }
  }
})

chrome.webRequest.onBeforeSendHeaders.addListener(details=>{
  for(let page of set){
    if(page.tabId == details.tabId){
      const beforeRequest = beforeRequestCache.get(get.requestId)
      const request = new Request(page, details, beforeRequest)
      requestCache.set(details.requestId,request)

      page.emit('request',request)
      return
    }
  }
})

chrome.webRequest.onErrorOccurred.addListener(details=>{
  for(let page of set){
    if(page.tabId == details.tabId){
      const request = requestCache.get(details.requestId)
      request._failureText = details.error
      page.emit('requestfinished',request)
      return
    }
  }
})

chrome.webRequest.onResponseStarted.addListener(details=>{
  for(let page of set){
    if(page.tabId == details.tabId){
      const request = requestCache.get(details.requestId)
      page.emit('requestfailed',request)
      return
    }
  }
})

chrome.webRequest.onCompleted.addListener(details=>{
  for(let page of set){
    if(page.tabId == details.tabId){
      const request = requestCache.get(details.requestId)
      const response = new Request(page, details, request)
      request._response = response

      page.emit('response',request)
      return
    }
  }
})

class Page extends EventEmitter {
  static get PagesMap(){
    return pagesMap
  }
  // constructor(client, target, frameTree, ignoreHTTPSErrors, screenshotTaskQueue) {
  constructor({tabId,tab,url,active = true,browser}={}){
    super()
    set.add(this)
    return new Promise(r=>{
      const getTab = tab=>{
        this.tabId = tab.id
        Page.PagesMap[tab.id] = this
        this._frameManager = new FrameManager(this.tabId,this)
        this._keyboard = new Keyboard(this.tabId);
        this._mouse = new Mouse(this.tabId, this._keyboard)
        this._browser = browser
        this._target = new Target(this)
        this._defaultNavigationTimeout = defaultOptions.timeout;
        r(this)
      }
      if(tab){
        getTab(tab)
      }
      else if(url){
        chrome.tabs.get(tabId,getTab)
      }
      else{
        chrome.tabs.create({url: url || 'chrome-extension://dckpbojndfoinamcdamhkjhnjnmjkfjd/blank.html', active},getTab)
      }
    })
  }

  /**
   * @return {!Puppeteer.Target}
   */
  target() {
    return this._target;
  }

  /**
   * @return {!Puppeteer.Frame}
   */
  mainFrame() {
    return this._frameManager.mainFrame();
  }

  /**
   * @return {!Keyboard}
   */
  get keyboard() {
    return this._keyboard;
  }

  /**
   * @return {!Touchscreen}
   */
  get touchscreen() {
    return this._touchscreen;
  }

  /**
   * @return {!Coverage}
   */
  get coverage() {
    return this._coverage;
  }

  /**
   * @return {!Tracing}
   */
  get tracing() {
    return this._tracing;
  }

  /**
   * @return {!Array<Puppeteer.Frame>}
   */
  frames() {
    return this._frameManager.frames();
  }

  /**
   * @param {boolean} value
   */
  async setRequestInterception(value) {
    return this._networkManager.setRequestInterception(value);
  }

  /**
   * @param {boolean} enabled
   */
  setOfflineMode(enabled) {
    return this._networkManager.setOfflineMode(enabled);
  }

  /**
   * @param {number} timeout
   */
  setDefaultNavigationTimeout(timeout) {
    this._defaultNavigationTimeout = timeout;
  }

  /**
   * @param {string} selector
   * @return {!Promise<?Puppeteer.ElementHandle>}
   */
  async $(selector) {
    return this.mainFrame().$(selector);
  }

  /**
   * @param {function()|string} pageFunction
   * @param {!Array<*>} args
   * @return {!Promise<!Puppeteer.JSHandle>}
   */
  async evaluateHandle(pageFunction, ...args) {
    const context = await this.mainFrame().executionContext();
    return context.evaluateHandle(pageFunction, ...args);
  }

  /**
   * @param {!Puppeteer.JSHandle} prototypeHandle
   * @return {!Promise<!Puppeteer.JSHandle>}
   */
  async queryObjects(prototypeHandle) {
    const context = await this.mainFrame().executionContext();
    return context.queryObjects(prototypeHandle);
  }

  /**
   * @param {string} selector
   * @param {function()|string} pageFunction
   * @param {!Array<*>} args
   * @return {!Promise<(!Object|undefined)>}
   */
  async $eval(selector, pageFunction, ...args) {
    return this.mainFrame().$eval(selector, pageFunction, ...args);
  }

  /**
   * @param {string} selector
   * @param {Function|string} pageFunction
   * @param {!Array<*>} args
   * @return {!Promise<(!Object|undefined)>}
   */
  async $$eval(selector, pageFunction, ...args) {
    return this.mainFrame().$$eval(selector, pageFunction, ...args);
  }

  /**
   * @param {string} selector
   * @return {!Promise<!Array<!Puppeteer.ElementHandle>>}
   */
  async $$(selector) {
    return this.mainFrame().$$(selector);
  }

  /**
   * @param {string} expression
   * @return {!Promise<!Array<!Puppeteer.ElementHandle>>}
   */
  async $x(expression) {
    return this.mainFrame().$x(expression);
  }

  /**
   * @param {!Array<string>} urls
   * @return {!Promise<!Array<Network.Cookie>>}
   */
  async cookies(...urls) {
    urls =  urls.length ? urls : [this.url()]
    const results =  await Promise.all(urls.map(url=>new Promise(resolve=>chrome.cookies.getAll(item,resolve))))
    return Array.prototype.concat(...results)
  }

  /**
   * @param {Array<Network.CookieParam>} cookies
   */
  async deleteCookie(...cookies) {
    const pageURL = this.url();
    for (const cookie of cookies) {
      const item = Object.assign({}, cookie);
      if (!cookie.url && pageURL.startsWith('http'))
        item.url = pageURL;
      await new Promise(resolve=>chrome.cookies.remove(item,resolve))
    }
  }

  /**
   * @param {Array<Network.CookieParam>} cookies
   */
  async setCookie(...cookies) {
    const pageURL = this.url();
    const startsWithHTTP = pageURL.startsWith('http');
    const items = cookies.map(cookie => {
      const item = Object.assign({}, cookie);
      if (!item.url && startsWithHTTP)
        item.url = pageURL;
      console.assert(
        item.url !== 'about:blank',
        `Blank page can not have cookie "${item.name}"`
      );
      console.assert(
        !String.prototype.startsWith.call(item.url || '', 'data:'),
        `Data URL page can not have cookie "${item.name}"`
      );
      if(item.expires !== void 0){
        item.expirationDate = item.expires
        delete item.expires
      }
      for(let name of ['httpOnly','secure','session']){ // @TODO
        delete item[name]
      }
      return item;
    });
    await this.deleteCookie(...items);
    // if (items.length){
    //   const key = uuid.v4()
    //   ipc.send('set-cookies',key,this.tabId,items)
    //   await new Promise(resolve=>ipc.once(`set-cookies-reply_${key}`,resolve))
    // }

    if (items.length)
      await Promise.all(items.map(item=>new Promise(resolve=>{chrome.cookies.set(item,resolve)})))
  }

  /**
   * @param {Object} options
   * @return {!Promise<!Puppeteer.ElementHandle>}
   */
  async addScriptTag(options) {
    return this.mainFrame().addScriptTag(options);
  }

  /**
   * @param {Object} options
   * @return {!Promise<!Puppeteer.ElementHandle>}
   */
  async addStyleTag(options) {
    return this.mainFrame().addStyleTag(options);
  }

  /**
   * @param {string} name
   * @param {function(?)} puppeteerFunction
   */
  async exposeFunction(name, puppeteerFunction) {
    if (this._pageBindings[name])
      throw new Error(`Failed to add page binding with name ${name}: window['${name}'] already exists!`);
    this._pageBindings[name] = puppeteerFunction;

    const expression = helper.evaluationString(addPageBinding, name);
    await this._client.send('Page.addScriptToEvaluateOnNewDocument', {source: expression});
    await Promise.all(this.frames().map(frame => frame.evaluate(expression).catch(debugError)));

    function addPageBinding(bindingName) {
      window[bindingName] = async(...args) => {
        const me = window[bindingName];
        let callbacks = me['callbacks'];
        if (!callbacks) {
          callbacks = new Map();
          me['callbacks'] = callbacks;
        }
        const seq = (me['lastSeq'] || 0) + 1;
        me['lastSeq'] = seq;
        const promise = new Promise(fulfill => callbacks.set(seq, fulfill));
        // eslint-disable-next-line no-console
        console.debug('driver:page-binding', JSON.stringify({name: bindingName, seq, args}));
        return promise;
      };
    }
  }

  /**
   * @param {?{username: string, password: string}} credentials
   */
  async authenticate(credentials) {
    ipc.send('auto-play-auth',this._tabId,credentials.username,credentials.password)
  }

  /**
   * @param {!Object<string, string>} headers
   */
  async setExtraHTTPHeaders(headers) {
    this._httpHeaderMap = headers
    if(this.httpHeaderListener) return

    const replaceHeader = (details)=>{
      if(details.tabId != this.tabId) return details.requestHeaders
      const newHeaders = []
      for(let [name,value] of Object.entries(this._httpHeaderMap)){
        newHeaders.push({name,value})
      }
      for (let h of details.requestHeaders){
        if(!this._httpHeaderMap.hasOwnProperty(h.name)) newHeaders.push(h)
      }
      return newHeaders
    }

    const listener = function(details) {
      let header_map = { requestHeaders: details.requestHeaders }

      if (details && details.url && details.requestHeaders && details.requestHeaders.length > 0){
        header_map.requestHeaders = replaceHeader(details)
      }
      return header_map
    }
    chrome.webRequest.onBeforeSendHeaders.addListener(listener, {
      "urls": ["http://*/*", "https://*/*"]
    }, ["requestHeaders", "blocking"])

    this.httpHeaderListener = listener
  }

  /**
   * @param {string} userAgent
   */
  async setUserAgent(userAgent) {
    this._userAgent = userAgent
    if(this.userAgentListener) return

    const replaceHeader = (details)=>{
      if(details.tabId != this.tabId) return details.requestHeaders
      const newHeaders = []
      for (let h of details.requestHeaders){
        newHeaders.push(h.name == "User-Agent" ? {name: "User-Agent", value: this._userAgent} : h)
      }
      return newHeaders
    }

    const listener = function(details) {
      let header_map = { requestHeaders: details.requestHeaders }

      if (details && details.url && details.requestHeaders && details.requestHeaders.length > 0){
        header_map.requestHeaders = replaceHeader(details)
      }
      return header_map
    }
    chrome.webRequest.onBeforeSendHeaders.addListener(listener, {
      "urls": ["http://*/*", "https://*/*"]
    }, ["requestHeaders", "blocking"])

    this.userAgentListener = listener
  }

  /**
   * @return {!Promise<!Object>}
   */
  async metrics() {
    const response = await this._client.send('Performance.getMetrics');
    return this._buildMetricsObject(response.metrics);
  }

  /**
   * @return {!string}
   */
  url() {
    return this.mainFrame().url();
  }

  /**
   * @return {!Promise<String>}
   */
  async content() {
    return await this._frameManager.mainFrame().content();
  }

  /**
   * @param {string} html
   */
  async setContent(html) {
    await this._frameManager.mainFrame().setContent(html);
  }

  send(operation,...args){
    ipc.send('auto-play-operation',false,this.tabId,operation,...args)
  }

  /**
   * @param {string} url
   * @param {!Object=} options
   * @return {!Promise<?Puppeteer.Response>}
   */
  async goto(url, options = {}) {
    if(!helper.isNumber(options.timeout)) options.timeout = this._defaultNavigationTimeout
    return new Promise((resolve,reject)=>{
      const timeoutId = setTimeout(_=>reject('Timeout Error'),options.timeout)
      const handleNavigateEvent = details=>{
        if(details.tabId == this.tabId && details.frameId == 0){
          clearTimeout(timeoutId)
          resolve(this) //@TODO response
          chrome.webNavigation.onCompleted.removeListener(handleNavigateEvent)
        }
      }
      chrome.webNavigation.onCompleted.addListener(handleNavigateEvent)
      this.send('loadURL',url)
    })
    //onDOMContentLoaded


  }

  /**
   * @param {!Object=} options
   * @return {!Promise<?Puppeteer.Response>}
   */
  async reload(options) {
    return new Promise(resolve=>helper.simpleIpcFunc('auto-get-async',resolve,this.tabId,'reload'))
  }

  /**
   * @param {!Object=} options
   * @return {!Promise<!Puppeteer.Response>}
   */
  waitForNavigation(options = {}) {
    return new Promise((resolve,reject)=>{
      if(!helper.isNumber(options.timeout)) options.timeout = this._defaultNavigationTimeout
      const token = PubSub.subscribe('onCompleted',(msg,tabId)=>{
        if(this.tabId == tabId){
          resolve(true) //@TOOD
          PubSub.unsubscribe(token)
        }
      })
      setTimeout(_=>{
        PubSub.unsubscribe(token)
        reject('navigation-timeout')
      },options.timeout)
    })
  }

  /**
   * @param {!Object=} options
   * @return {!Promise<?Puppeteer.Response>}
   */
  async goBack(options) {
    return new Promise(resolve=>helper.simpleIpcFunc('auto-get-async',resolve,this.tabId,'back'))
  }

  /**
   * @param {!Object=} options
   * @return {!Promise<?Puppeteer.Response>}
   */
  async goForward(options) {
    return new Promise(resolve=>helper.simpleIpcFunc('auto-get-async',resolve,this.tabId,'forward'))
  }


  bringToFront() {
    return new Promise(resolve=>chrome.tabs.update(this.tabId,{active:true},_=>resolve()))
  }

  /**
   * @param {!Object} options
   */
  async emulate(options) {
    return Promise.all([
      this.setViewport(options.viewport),
      this.setUserAgent(options.userAgent)
    ]);
  }

  /**
   * @param {boolean} enabled
   */
  async setJavaScriptEnabled(enabled) {
    await this._client.send('Emulation.setScriptExecutionDisabled', { value: !enabled });
  }

  /**
   * @param {?string} mediaType
   */
  async emulateMedia(mediaType) {
    console.assert(mediaType === 'screen' || mediaType === 'print' || mediaType === null, 'Unsupported media type: ' + mediaType);
    await this._client.send('Emulation.setEmulatedMedia', {media: mediaType || ''});
  }

  /**
   * @param {!Page.Viewport} viewport
   */
  async setViewport(viewport) {
    const attrs = []
    for(let [k,v] of Object.entries(viewport)){
      if(k == 'width' || k == 'height') attrs.push(`${k}=${v}`)
      else if(k == 'deviceScaleFactor') attrs.push(`initial-scale=${v}`)
    }
    const metalist = document.getElementsByTagName('meta');
    let hasMeta = false;
    for(let i = 0; i < metalist.length; i++) {
      const name = metalist[i].getAttribute('name')
      if(name && name.toLowerCase() === 'viewport') {
        metalist[i].setAttribute('content', attrs.join(','))
        hasMeta = true
        break
      }
    }
    if(!hasMeta) {
      const meta = document.createElement('meta')
      meta.setAttribute('name', 'viewport')
      meta.setAttribute('content', attrs.join(','))
      document.head.appendChild(meta)
    }
  }

  /**
   * @return {!Page.Viewport}
   */
  viewport() {
    return this._viewport;
  }

  /**
   * @param {function()|string} pageFunction
   * @param {!Array<*>} args
   * @return {!Promise<*>}
   */
  async evaluate(pageFunction, ...args) {
    return this._frameManager.mainFrame().evaluate(pageFunction, ...args);
  }

  /**
   * @param {function()|string} pageFunction
   * @param {!Array<*>} args
   */
  async evaluateOnNewDocument(pageFunction, ...args) {
    const source = helper.evaluationString(pageFunction, ...args);
    if(preloadJsMap[this.tabId]){
      preloadJsMap[this.tabId].push(source)
    }
    else{
      preloadJsMap[this.tabId] = [source]
    }
  }

  /**
   * @param {Boolean} enabled
   * @returns {!Promise}
   */
  async setCacheEnabled(enabled = true) {
    await this._client.send('Network.setCacheDisabled', {cacheDisabled: !enabled});
  }

  /**
   * @param {!Object=} options
   * @return {!Promise<!Buffer>}
   */
  async screenshot(options = {}) {
    let screenshotType = null;
    // options.type takes precedence over inferring the type from options.path
    // because it may be a 0-length file with no extension created beforehand (i.e. as a temp file).
    if (options.type) {
      console.assert(options.type === 'png' || options.type === 'jpeg', 'Unknown options.type value: ' + options.type);
      screenshotType = options.type;
    } else if (options.path) {
      const mimeType = mime.getType(options.path);
      if (mimeType === 'image/png')
        screenshotType = 'png';
      else if (mimeType === 'image/jpeg')
        screenshotType = 'jpeg';
      console.assert(screenshotType, 'Unsupported screenshot mime type: ' + mimeType);
    }

    if (!screenshotType)
      screenshotType = 'png';

    if (options.quality) {
      console.assert(screenshotType === 'jpeg', 'options.quality is unsupported for the ' + screenshotType + ' screenshots');
      console.assert(typeof options.quality === 'number', 'Expected options.quality to be a number but found ' + (typeof options.quality));
      console.assert(Number.isInteger(options.quality), 'Expected options.quality to be an integer');
      console.assert(options.quality >= 0 && options.quality <= 100, 'Expected options.quality to be between 0 and 100 (inclusive), got ' + options.quality);
    }
    console.assert(!options.clip || !options.fullPage, 'options.clip and options.fullPage are exclusive');
    if (options.clip) {
      console.assert(typeof options.clip.x === 'number', 'Expected options.clip.x to be a number but found ' + (typeof options.clip.x));
      console.assert(typeof options.clip.y === 'number', 'Expected options.clip.y to be a number but found ' + (typeof options.clip.y));
      console.assert(typeof options.clip.width === 'number', 'Expected options.clip.width to be a number but found ' + (typeof options.clip.width));
      console.assert(typeof options.clip.height === 'number', 'Expected options.clip.height to be a number but found ' + (typeof options.clip.height));
      for(let x of ['x','y','width','height']){
        options.clip[x] = Math.round(options.clip[x])
      }
    }

    ipc.send('screen-shot',{full: options.fullPage,type: options.type == 'jpeg' ? 'JPEG' : 'PNG',
      rect: options.clip, tabId: this.tabId, tabKey: this.tabId, quality: options.quality, savePath: options.path, autoPlay:true })

    return new Promise((resolve,reject)=>{
      ipc.on(`screen-shot-reply_${this.tabId}`,e=>resolve())
    })
  }

  /**
   * @param {!Object=} options
   * @return {!Promise<!Buffer>}
   */
  pdf(options = {}) {
    return new Promise(resolve=>{
      const key = uuid.v4()
      const savePath = options.path
      options = {pageSize:options.format,printBackground:options.printBackground,landscape:options.landscape}
      ipc.send('print-to-pdf',key,this.tabId,savePath,options)
      ipc.once(`print-to-pdf-reply_${key}`,e=>resolve())
    })
  }

  /**
   * @return {!Promise<string>}
   */
  async title() {
    return this.mainFrame().title();
  }

  close() {
    return new Promise(resolve=>chrome.tabs.remove(this.tabId,resolve))
  }

  /**
   * @return {!Mouse}
   */
  get mouse() {
    return this._mouse;
  }

  scrollTo(x,y) {
    return this.mainFrame().scrollTo(x,y);
  }

  /**
   * @param {string} selector
   * @param {!Object=} options
   */
  click(selector, options = {}) {
    return this.mainFrame().click(selector, options);
  }

  /**
   * @param {string} selector
   */
  focus(selector) {
    return this.mainFrame().focus(selector);
  }

  /**
   * @param {string} selector
   */
  hover(selector) {
    return this.mainFrame().hover(selector);
  }

  /**
   * @param {string} selector
   * @param {!Array<string>} values
   * @return {!Promise<!Array<string>>}
   */
  select(selector, ...values) {
    return this.mainFrame().select(selector, ...values);
  }

  /**
   * @param {string} selector
   */
  tap(selector) {
    return this.mainFrame().tap(selector);
  }

  /**
   * @param {string} selector
   * @param {string} text
   * @param {{delay: (number|undefined)}=} options
   */
  type(selector, text, options) {
    return this.mainFrame().type(selector, text, options);
  }

  /**
   * @param {(string|number|Function)} selectorOrFunctionOrTimeout
   * @param {!Object=} options
   * @param {!Array<*>} args
   * @return {!Promise}
   */
  waitFor(selectorOrFunctionOrTimeout, options = {}, ...args) {
    return this.mainFrame().waitFor(selectorOrFunctionOrTimeout, options, ...args);
  }

  /**
   * @param {string} selector
   * @param {!Object=} options
   * @return {!Promise}
   */
  waitForSelector(selector, options = {}) {
    return this.mainFrame().waitForSelector(selector, options);
  }

  /**
   * @param {string} xpath
   * @param {!Object=} options
   * @return {!Promise}
   */
  waitForXPath(xpath, options = {}) {
    return this.mainFrame().waitForXPath(xpath, options);
  }

  /**
   * @param {function()} pageFunction
   * @param {!Object=} options
   * @param {!Array<*>} args
   * @return {!Promise}
   */
  waitForFunction(pageFunction, options = {}, ...args) {
    return this.mainFrame().waitForFunction(pageFunction, options, ...args);
  }
}

/** @type {!Set<string>} */
const supportedMetrics = new Set([
  'Timestamp',
  'Documents',
  'Frames',
  'JSEventListeners',
  'Nodes',
  'LayoutCount',
  'RecalcStyleCount',
  'LayoutDuration',
  'RecalcStyleDuration',
  'ScriptDuration',
  'TaskDuration',
  'JSHeapUsedSize',
  'JSHeapTotalSize',
]);

/** @enum {string} */
Page.PaperFormats = {
  letter: {width: 8.5, height: 11},
  legal: {width: 8.5, height: 14},
  tabloid: {width: 11, height: 17},
  ledger: {width: 17, height: 11},
  a0: {width: 33.1, height: 46.8 },
  a1: {width: 23.4, height: 33.1 },
  a2: {width: 16.5, height: 23.4 },
  a3: {width: 11.7, height: 16.5 },
  a4: {width: 8.27, height: 11.7 },
  a5: {width: 5.83, height: 8.27 },
  a6: {width: 4.13, height: 5.83 },
};

const unitToPixels = {
  'px': 1,
  'in': 96,
  'cm': 37.8,
  'mm': 3.78
};

/**
 * @param {(string|number|undefined)} parameter
 * @return {(number|undefined)}
 */
function convertPrintParameterToInches(parameter) {
  if (typeof parameter === 'undefined')
    return undefined;
  let pixels;
  if (helper.isNumber(parameter)) {
    // Treat numbers as pixel values to be aligned with phantom's paperSize.
    pixels = /** @type {number} */ (parameter);
  } else if (helper.isString(parameter)) {
    const text = /** @type {string} */ (parameter);
    let unit = text.substring(text.length - 2).toLowerCase();
    let valueText = '';
    if (unitToPixels.hasOwnProperty(unit)) {
      valueText = text.substring(0, text.length - 2);
    } else {
      // In case of unknown unit try to parse the whole parameter as number of pixels.
      // This is consistent with phantom's paperSize behavior.
      unit = 'px';
      valueText = text;
    }
    const value = Number(valueText);
    console.assert(!isNaN(value), 'Failed to parse parameter value: ' + text);
    pixels = value * unitToPixels[unit];
  } else {
    throw new Error('page.pdf() Cannot handle parameter type: ' + (typeof parameter));
  }
  return pixels / 96;
}

Page.Events = {
  Close: 'close',
  Console: 'console',
  Dialog: 'dialog',
  DOMContentLoaded: 'domcontentloaded',
  Error: 'error',
  // Can't use just 'error' due to node.js special treatment of error events.
  // @see https://nodejs.org/api/events.html#events_error_events
  PageError: 'pageerror',
  Request: 'request',
  Response: 'response',
  RequestFailed: 'requestfailed',
  RequestFinished: 'requestfinished',
  FrameAttached: 'frameattached',
  FrameDetached: 'framedetached',
  FrameNavigated: 'framenavigated',
  Load: 'load',
  Metrics: 'metrics',
};

/**
 * @typedef {Object} Page.Viewport
 * @property {number} width
 * @property {number} height
 * @property {number=} deviceScaleFactor
 * @property {boolean=} isMobile
 * @property {boolean=} isLandscape
 * @property {boolean=} hasTouch
 */

/**
 * @typedef {Object} Network.Cookie
 * @property {string} name
 * @property {string} value
 * @property {string} domain
 * @property {string} path
 * @property {number} expires
 * @property {number} size
 * @property {boolean} httpOnly
 * @property {boolean} secure
 * @property {boolean} session
 * @property {("Strict"|"Lax")=} sameSite
 */


/**
 * @typedef {Object} Network.CookieParam
 * @property {string} name
 * @property {string=} value
 * @property {string=} url
 * @property {string=} domain
 * @property {string=} path
 * @property {number=} expires
 * @property {boolean=} httpOnly
 * @property {boolean=} secure
 * @property {("Strict"|"Lax")=} sameSite
 */

class ConsoleMessage {
  /**
   * @param {string} type
   * @param {string} text
   * @param {!Array<*>} args
   */
  constructor(type, text, args) {
    this._type = type;
    this._text = text;
    this._args = args;
  }

  /**
   * @return {string}
   */
  type() {
    return this._type;
  }

  /**
   * @return {string}
   */
  text() {
    return this._text;
  }

  /**
   * @return {!Array<string>}
   */
  args() {
    return this._args;
  }
}


module.exports = Page;