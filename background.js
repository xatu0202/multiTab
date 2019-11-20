let current = []
const loadTabList = () => chrome.storage.local.get(d => console.log(d))
const loadTabs = t => () => {
  chrome.storage.local.get(t, d => {
    for (tabObj of Object.values(d)[0])
      chrome.tabs.create(tabObj)
  })
}
const removeTabs = t => () => {
  chrome.storage.local.remove(t)
  update()
}
const saveTabs = () => {
  chrome.tabs.query({
    "currentWindow": true
  }, tabs => {
    for (tab of tabs) current.push({
      url: tab.url
    })
    let currentTabs = {}
    currentTabs[prompt("タブグループの名前を設定してください")] = current
    chrome.storage.local.set(currentTabs)
    update()
    current = []
  })
}


const update = () => {
  chrome.contextMenus.removeAll()
  chrome.contextMenus.create({
    title: "save Tabs",
    onclick: saveTabs
  })
  const loadContext = chrome.contextMenus.create({
    title: "load Tabsets"
  })
  const removerContext = chrome.contextMenus.create({
    title: "remove Tabsets"
  })
  chrome.storage.local.get(data => {
    for (let title of Object.keys(data)) {
      chrome.contextMenus.create({
        title: title,
        "parentId": loadContext,
        onclick: loadTabs(title)
      })
      chrome.contextMenus.create({
        title: title,
        "parentId": removerContext,
        onclick: removeTabs(title)
      })
    }
  })
}

update()
