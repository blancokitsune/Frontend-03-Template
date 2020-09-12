let names = Object.getOwnPropertyNames(window)
let namesSet = new Set()

const consoleAPI = { name: "console", list: ["console"] }
const domAPI = {
  name: "dom",
  list: [
    "Event",
    "CustomEvent",
    "EventTarget",
    "AbortController",
    "AbortSignal",
    "NodeList",
    "HTMLCollection",
    "MutationObserver",
    "MutationRecord",
    "Node",
    "Document",
    "DOMImplementation",
    "DocumentType",
    "DocumentFragment",
    "ShadowRoot",
    "Element",
    "NamedNodeMap",
    "Attr",
    "CharacterData",
    "Text",
    "CDATASection",
    "ProcessingInstruction",
    "Comment",
    "AbstractRange",
    "StaticRange",
    "Range",
    "NodeIterator",
    "TreeWalker",
    "NodeFilter",
    "DOMTokenList",
    "XPathResult",
    "XPathExpression",
    "XPathEvaluator",
  ],
}
const encodingAPI = {
  name: "encoding",
  list: [
    "TextDecoder",
    "TextEncoder",
    "TextDecoderStream",
    "TextEncoderStream",
  ],
}
const fetchAPI = {
  name: "fetch",
  list: ["fetch", "Headers", "Request", "Response"],
}
const fullscreenAPI = {
  name: "fullscreen",
  list: [],
}
const htmlApi = {
  name: "html",
  list: [
    "HTMLAllCollection",
    "HTMLFormControlsCollection",
    "HTMLOptionsCollection",
    "DOMStringList",
    "Document",
    "DocumentOrShadowRoot",
    "TrackEvent",
    "SubmitEvent",
    "FormDataEvent",
    "ImageBitmapRenderingContext",
    "OffscreenCanvas",
    "CustomElementRegistry",
    "ElementInternals",
    "DataTransfer",
    "DataTransferItemList",
    "DataTransferItem",
    "DragEvent",
    "History",
    "Location",
    "PopStateEvent",
    "HashChangeEvent",
    "PageTransitionEvent",
    "BeforeUnloadEvent",
    "MessageEvent",
    "EventSource",
    "WebSocket",
    "CloseEvent",
    "WorkerGlobalScope",
    "DedicatedWorkerGlobalScope",
    "SharedWorkerGlobalScope",
    "Worker",
    "SharedWorker",
    "WorkerNavigator",
    "WorkerLocation",
    "Storage",
    "StorageEvent",
  ],
}
const notificationAPI = {
  name: "notification",
  list: [
    "Notification",
    "ServiceWorkerRegistration",
    "NotificationEvent",
    "ServiceWorkerGlobalScope",
  ],
}
const storageAPI = { name: "storage", list: ["StorageManager"] }
const streamsAPI = {
  name: "streams",
  list: [
    "ReadableStream",
    "ReadableStreamDefaultReader",
    "ReadableStreamBYOBReader",
    "ReadableStreamDefaultController",
    "ReadableByteStreamController",
    "ReadableStreamBYOBRequest",
    "WritableStream",
    "WritableStreamDefaultWriter",
    "WritableStreamDefaultController",
    "TransformStream",
    "TransformStreamDefaultController",
    "ByteLengthQueuingStrategy",
    "CountQueuingStrategy",
  ],
}
const urlAPI = { name: "url", list: ["URL", "URLSearchParams"] }
const xhrAPI = {
  name: "xhr",
  list: [
    "XMLHttpRequestEventTarget",
    "XMLHttpRequestUpload",
    "XMLHttpRequest",
    "FormData",
    "ProgressEvent",
  ],
}

const whatwgAPI = [
  consoleAPI,
  domAPI,
  encodingAPI,
  fetchAPI,
  fullscreenAPI,
  htmlApi,
  notificationAPI,
  storageAPI,
  streamsAPI,
  urlAPI,
  xhrAPI,
]

function checkoutAPI(target, resourceList) {
  const { name, list } = target
  const lists = new Set()
  const interfaceLists = []
  for (let interface of list) {
    let interfaceList = resourceList.filter((item) => {
      try {
        window[item].prototype instanceof targetInterface
          ? lists.add(item)
          : null
        return window[item].prototype instanceof targetInterface
      } catch (err) {}
    })
    window[interface]
      ? interfaceList.push(interface) && lists.add(interface)
      : null
    interfaceLists.push(interfaceList)
  }
  namesSet = new Set([...namesSet, ...lists])
  return [lists, interfaceLists]
}

function customGroupLog(
  groupName,
  { content = "", hlevel = 0 },
  autoEnd = false
) {
  // const  = opitons
  const level = [
    { size: 14, color: "#000" },
    { size: 30, color: "#f43e06" },
    { size: 16, color: "#1781b5" },
    { size: 14, color: "#80766e" },
  ]
  const style = `font-size: ${level[hlevel]["size"]}px;color: ${level[hlevel]["color"]}`
  console.group(`%c${groupName}`, style)
  content && console.log(content)
  autoEnd && console.groupEnd(`${groupName}`)
}

try {
  for (let api of whatwgAPI) {
    const [apiList, interfaceList] = checkoutAPI(api, names)
    customGroupLog(api.name, { hlevel: 2, content: apiList }, false)
    api.list.forEach((interfaceName, i) => {
      customGroupLog(
        interfaceName,
        { hlevel: 3, content: interfaceList[i] },
        true
      )
    })
    console.groupEnd(api.name)
  }
  customGroupLog("whatwg", { hlevel: 1, content: namesSet }, true)
} catch (err) {}
