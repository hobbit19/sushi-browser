const React = require('react')
const ReactDOM = require('react-dom');
const {Component} = React
const ipc = require('electron').ipcRenderer
import { Dropdown } from 'semantic-ui-react';
const {remote} = require('electron')
const {Menu} = remote
const {messages,locale} = require('./localAndMessage')
let [defaultIcons,popups,bgs,titles,texts] = ipc.sendSync('get-sync-main-states',['browserActionDefaultIcons','browserActionPopups','browserActionBgs','browserActionTitles','browserActionTexts'])
const LRUCache = require('lru-cache')
const sharedState = require('./sharedState')

ipc.on('chrome-browser-action-set-ipc-all',(e,extensionId,name,val) => {
  if(val.path !== void 0){
    let _icon = typeof val.path === "object" ? Object.values(val.path)[0] : val.path
    if(_icon.startsWith('chrome-extension://')) _icon = _icon.split("/").slice(3).join("/")
    defaultIcons[extensionId] = _icon
  }
  else if(val.popup !== void 0){
    if(val.popup === ""){
      delete popups[extensionId]
    }
    else{
      popups[extensionId] = val.popup
    }
  }
  else if(val.color !== void 0){
    if(Array.isArray(val.color)){
      val.color = `rgba(${val.color.join(',')})`
    }
    bgs[extensionId] = val.color
  }
  else if(val.text !== void 0){
    texts[extensionId] = val.text
  }
  else if(val.title !== void 0){
    titles[extensionId] = val.title
  }
})

const defaults = {}

// const waitForFrame = () => new Promise(resolve => window.requestAnimationFrame(resolve))
//
// async function forceDrawWebview (webview) {
//   await waitForFrame()
//   webview.style.visibility = 'hidden'
//   await waitForFrame()
//   webview.style.visibility = ''
//   await waitForFrame()
// }


class BrowserActionWebView extends Component {
  constructor(props) {
    super(props)
    this.state = {style:{opacity: 0.01, userSelect: 'none', ...this.props.style}}
    this.close = true
    this.preClose = true

    this.ipcEvent = (e, msg)=> {
      if (msg == 'window-close') {
        this.props.close()
      }
    }
  }


  componentDidUpdate(prevProps, prevState) {
    if(this.close != this.preClose){
      setTimeout(()=>this.componentDidMount(),1)
    }
    this.preClose = this.close
  }

  setPreferredSize(webview, width,height,retry){
    console.log('setPreferredSize',width, height, retry)
    this.setState({style:{width,height, userSelect: 'none'}},()=>{
      webview.executeJavaScript(`(function(){
      const ele = document.scrollingElement
      return [ele.clientWidth, ele.scrollWidth, ele.clientHeight, ele.scrollHeight]
    })()`,(result)=>{
        console.log('setPreferredSize2', result)
        let widthRetry, heightRetry
        if(result[0] == result[1]){
          if(width == result[1] || (width == 800 && result[1] > 800)){
            widthRetry = false
          }
          else{
            widthRetry = result[1]
          }
        }
        else{
          widthRetry = result[1]
        }
        if(result[2] == result[3]){
          if(height == result[3] || (height == 600 && result[3] > 600)){
            heightRetry = false
          }
          else{
            heightRetry = result[3]
          }
        }
        else{
          heightRetry = result[3]
        }
        if((!widthRetry && !heightRetry) || retry > 10){
          this.props.setClassName("")
          ReactDOM.findDOMNode(this).parentNode.parentNode.querySelector(':not(.opacity001).browser-action.nav-menu').style.left = `${200 - width}px`
          this.result = JSON.stringify(result)
          this.size = [width, height]
          this.checkSize(webview, width, height)
        }
        else{
          this.setPreferredSize(webview, widthRetry, heightRetry, ++retry)
        }
      })
    })
  }

  checkSize(webview, width, height){
    this.intervalId = setInterval(()=>{
      webview.executeJavaScript(`(function(){
      const ele = document.scrollingElement
      return [ele.clientWidth, ele.scrollWidth, ele.clientHeight, ele.scrollHeight]
    })()`,(result)=>{
        if(JSON.stringify(result) != this.result){
          clearInterval(this.intervalId)
          this.setPreferredSize(webview, width, height, 0)
        }
      })
    },1000)
  }

  componentDidMount() {
    const webview = this.refs && this.refs.webview
    if(webview){
      ipc.on('send-to-host',this.ipcEvent) //@TODO ELECTRON
      webview.disablewebsecurity  = true
      // webview.partition = 'persist:__chrome_extension'
      if(this.props.url) webview.setAttribute('src', this.props.url)
      // webview.addEventListener('did-attach',this.didAttachEvent );
      // webview.addEventListener('preferred-size-changed',this.preferredSizeEvent)
      setTimeout(()=>{
        this.setPreferredSize(webview, 200, 100, 0)
        ipc.send('chrome-extension-popup-id', webview.getWebContents().id)
      },10)
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  onClose = ()=>{
    this.close = true
  }

  reload = ()=>{
    this.close = false
    this.setState({})
  }

  render(){
    return this.close ? null : <webview ref="webview" name="browserAction" onClick={e=>{
      e.stopPropagation()
      e.preventDefault()
      return false
    }} className="popup" style={this.state.style}/>
  }
}

export default class BrowserActionMenu extends Component{
  constructor(props) {
    super(props)
    const values = props.values
    const icon = `${values.basePath}/${defaultIcons[props.id] ? defaultIcons[props.id] : values.default_icon ? (typeof values.default_icon === "object" ? Object.values(values.default_icon)[0] : values.default_icon) : values.icons ? Object.values(values.icons)[0] : ""}`;
    this.state = {icon,className: 'opacity001', enable: true}
    this.close = ::this.close
    this.updateDates = {}
    this.cache = new LRUCache(100)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.selected
  }

  componentDidMount(){
    this.outerClick = e=>{
      if(!e.srcElement.closest(`.sort-${this.props.id}`)){
        this.close()
      }
    }
    this.iconSet = (e,tabId,val) => {
      const {tab,values} = this.props
      // console.log("icon-get",e,tabId,val)
      if(tabId !== null && (tab.wvId !== tabId || !val.path)) return
      let path = val.path
      if(!path[0]){
        for (let name in path) {
          if (path.hasOwnProperty(name)) {
            path = path[name]
            break
          }
        }
      }
      let _icon = path
      if(_icon.startsWith('chrome-extension://')) _icon = _icon.split("/").slice(3).join("/")
      const icon = `${values.basePath}/${_icon}`
      console.log(`on-icon${val.icon}`)
      this.updateDates.icon = Date.now()
      if(this.state.icon !== icon)  this.setState({icon})
    }
    ipc.on(`chrome-browser-action-set-icon-ipc-${this.props.id}`,this.iconSet)

    this.titleSet = (e,tabId,val) => {
      if(tabId !== null && this.props.tab.wvId !== tabId) return
      console.log(`on-title${val.title}`)
      this.updateDates.title = Date.now()
      if(this.state.title !== val.title) this.setState({title: val.title})
    }
    ipc.on(`chrome-browser-action-set-title-ipc-${this.props.id}`,this.titleSet)

    this.badgeSet = (e,tabId,val) => {
      if(tabId !== null && this.props.tab.wvId !== tabId) return
      console.log(`on-text${val.text}`)
      this.updateDates.text = Date.now()
      if(this.state.text !== val.text) this.setState({text: val.text})
    }
    ipc.on(`chrome-browser-action-set-badge-ipc-${this.props.id}`,this.badgeSet)

    this.backgroundSet = (e,tabId,val) => {
      if(tabId !== null && this.props.tab.wvId !== tabId) return
      if(Array.isArray(val.color)){
        val.color = `rgba(${val.color.join(',')})`
      }
      console.log(`on-color${val.color}`)
      this.updateDates.color = Date.now()
      if(this.state.color !== val.color) this.setState({color: val.color})
    }
    ipc.on(`chrome-browser-action-set-background-ipc-${this.props.id}`,this.backgroundSet)

    this.popupSet = (e,tabId,val) => {
      if(tabId !== null && this.props.tab.wvId !== tabId) return
      this.updateDates.popup = Date.now()
      if(this.state.popup !== val.popup){
        this.setState({popup: val.popup === "" ? null : val.popup})
      }
    }
    ipc.on(`chrome-browser-action-set-popup-ipc-${this.props.id}`,this.popupSet)


    this.getInfo = (e, key, details) => {
      if(details && details.tabId != this.props.tab.wvId) return

      const id = this.props.id
      const values = this.props.values
      let popup = details ? (this.state.popup || popups[id] || values.default_popup) : (popups[id] || values.default_popup)
      if(popup) popup = popup.startsWith('chrome-extension://') ? popup : `chrome-extension://${id}/${popup}`
      const text = details ? (this.state.text || texts[id]) : texts[id]
      const title = details ? (this.state.title || titles[id] || values.name) : (titles[id] || values.name)
      const color = details ? (this.state.color || bgs[id]) : bgs[id]
      ipc.send(`chrome-browser-action-get-info-${this.props.id}-reply_${key}`, {id: this.props.tab.wvId, popup, text, title, color})
    }
    ipc.on(`chrome-browser-action-get-info-${this.props.id}`,this.getInfo)


    this.enable = (e, tabId, enable) => {
      if(tabId != this.props.tab.wvId) return
      this.setState({enable})
    }
    ipc.on(`chrome-browser-action-enable-${this.props.id}`,this.enable)

    this.tokenStartLoading = PubSub.subscribe(`on-load-start_${this.props.tab.key}`,(msg,url)=>{
      const newState = []
      let needUpdate = false
      for(let ele of ['icon','title','text','color','popup']){
        if(this.state[ele]){
          newState.push(ele)
          needUpdate = true
        }
      }
      console.log(`on-load-start_${this.props.tab.key}`)
      if(needUpdate) this.cache.set(url,needUpdate ? {newState,time:Date.now()} : null)
    })

    this.tokenDidNavigate = PubSub.subscribe(`did-navigate_${this.props.tab.key}`,(msg,url)=>{
      const recent = this.cache.get(url)
      const newState = {}
      let needUpdate = false
      if(recent){
        for(let val of recent.newState){
          if(recent.time > this.updateDates[val]){
            newState[val] = null
            needUpdate = true
          }
        }
        if(needUpdate) this.setState(newState)
      }
    })
  }

  componentWillUnmount(){
    document.removeEventListener('mousedown',this.outerClick)
    ipc.removeListener(`chrome-browser-action-set-icon-ipc-${this.props.id}`,this.iconSet)
    ipc.removeListener(`chrome-browser-action-set-title-ipc-${this.props.id}`,this.titleSet)
    ipc.removeListener(`chrome-browser-action-set-badge-ipc-${this.props.id}`,this.badgeSet)
    ipc.removeListener(`chrome-browser-action-set-background-ipc-${this.props.id}`,this.backgroundSet)
    ipc.removeListener(`chrome-browser-action-set-popup-ipc-${this.props.id}`,this.popupSet)
    ipc.removeListener(`chrome-browser-action-get-info-${this.props.id}`,this.getInfo)
    ipc.removeListener(`chrome-browser-action-enable-${this.props.id}`,this.enable)
    PubSub.unsubscribe(this.tokenStartLoading)
    PubSub.unsubscribe(this.tokenDidNavigate)
  }


  setClassName(className){
    this.setState({className})
  }

  handleClick(e){
    if(sharedState.menuSort || document.elementFromPoint(e.clientX, e.clientY).tagName == 'WEBVIEW'){
      return
    }
    console.log(e)
    const extensionId = this.props.id
    const {cont,values} = this.props
    const tabId = cont.id

    if(e.which != 3) {

      let props = {
        x: e.x,
        y: e.y,
        screenX: e.screenX,
        screenY: e.screenY,
        offsetX: e.offsetX,
        offsetY: e.offsetY
      }
      if (this.state.enable && (this.state.popup || popups[extensionId] || values.default_popup)) {
        // console.log('chrome-browser-action-clicked', extensionId, tabId.toString(), "", props)
        // ipc.send('chrome-browser-action-clicked', extensionId, tabId.toString(), "", props);
        return
      }
      else if(values.default_icon){
        console.log('chrome-browserAction-onClicked', extensionId, tabId.toString(), "", props)
        // ipc.send('chrome-browser-action-clicked', extensionId, tabId.toString(), "", props);
        ipc.send('chrome-browserAction-onClicked', extensionId, tabId);
        return
      }
    }

    const menuItems = []
    menuItems.push(({label: values.default_title || values.name, click: _=>cont.hostWebContents2.send('new-tab', tabId, `https://chrome.google.com/webstore/detail/${values.orgId}`)}))
    if(values.optionPage) menuItems.push(({label: locale.translation('9147392381910171771'), click: _=>cont.hostWebContents2.send('new-tab', tabId, `chrome-extension://${extensionId}/${values.optionPage}`)}))
    if(values.background) menuItems.push(({label: locale.translation("4989966318180235467"), click: _=>{
        const url = `chrome-extension://${extensionId}/${values.background}`
        remote.webContents.getAllWebContents().find(x=>x.getURL().startsWith(url)).openDevTools()
      }}))
    menuItems.push({label: locale.translation("6326175484149238433").replace('Chrome','Sushi Browser'),click: _=>ipc.send('delete-extension',extensionId,values.orgId)})
    const menu = Menu.buildFromTemplate(menuItems)
    menu.popup(remote.getCurrentWindow())
  }

  close(){
    // this.refs.popupView && this.refs.popupView.noClose()
    setTimeout(_=>this.refs.dd.close(),10)
  }

  render(){
    let retry = 0
    const id = this.props.id
    const values = this.props.values
    let popup = this.state.popup || popups[id] || values.default_popup
    if(popup) popup = popup.startsWith('chrome-extension://') ? popup : `chrome-extension://${id}/${popup}`
    const text = this.state.text || texts[id]
    const title = this.state.title || titles[id] || values.name
    const color = this.state.color || bgs[id]
    return <Dropdown onMouseDown={::this.handleClick} tabIndex={-1}
                     onOpen={_=>{if(this.refs && this.refs.popupView){this.refs.popupView.reload()}; document.addEventListener('mousedown',this.outerClick)}}
                     onClose={_=>{if(this.refs && this.refs.popupView){this.refs.popupView.onClose()};document.removeEventListener('mousedown',this.outerClick)}}
      // onDragStart={e=>console.log(4342355,e)} onDragEnter={e=>{console.log(4342344,e)}}
                     scrolling className={`draggable-source nav-button sort-${id}`} ref="dd" key={id} trigger={<a href="javascript:void(0)"  title={title} tabIndex="-1">
      <img style={{width:16,height:16,verticalAlign:'middle'}} src={this.state.icon ? `file://${this.state.icon}` : `file://${values.basePath}/${values.default_icon ? (typeof values.default_icon === "object" ? Object.values(values.default_icon)[0] : values.default_icon) : Object.values(values.icons)[0]}`} onError={(e)=>{
        console.log(99854,this.state.icon)
        if(retry++ > 10) return
        e.target.src =  `file://${values.basePath}/${values.default_icon ? (typeof values.default_icon === "object" ? Object.values(values.default_icon)[0] : values.default_icon) : Object.values(values.icons)[0]}`
      }} />
      {text ? <div className="browserActionBadge" style={{backgroundColor: color}}>{text}</div> : null}
    </a>} icon={null}>
      <Dropdown.Menu className={`browser-action nav-menu ${this.state.className}`} >
        {popup ? <BrowserActionWebView ref="popupView" close={this.close} url={popup} setClassName={::this.setClassName}/>: ""}
      </Dropdown.Menu>
    </Dropdown>
  }
}