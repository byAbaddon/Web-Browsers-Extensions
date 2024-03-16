importScripts('../../assets/data/radioArr.js'); // this import: radioStations

//---global var
let isPopupWindowOpen = false
let popupWindowID  = null

//---------- This runs ONE TIME ONLY (unless the user reinstalls your extension)
chrome.runtime.onInstalled.addListener(() => {
  console.log('Background start successfully.......................')


  //---create new Window
  chrome.action.onClicked.addListener(function (tab) {
    if (!isPopupWindowOpen) {
      createNewWindow()
      isPopupWindowOpen = true
    }
  })

//---check is popup window was killed
chrome.windows.onRemoved.addListener(function(windowId) {
  if (windowId == popupWindowID) {
    isPopupWindowOpen = false
    chrome.action.setBadgeText({text: ''})
    chrome.action.setBadgeBackgroundColor({ color: '#ffff01'})
  }
})



  //---add key to locale storage
  chrome.storage.local.set({
    'key': radioStations
  })


  //---add badge
  chrome.runtime.onMessage.addListener(async function (msg, sender, sendResponse) {

    if (msg.action == 'addBadge') {
      await chrome.action.setBadgeText({text: '♬'})
      await chrome.action.setBadgeBackgroundColor({ color: '#9688F1' })
    }

    if (msg.action == 'removeBadge') {
      await chrome.action.setBadgeText({text: ''})
      await chrome.action.setBadgeBackgroundColor({ color: '#ffff01'})
    }
  })

})



//------------------------------------add new window
function createNewWindow() {
  chrome.windows.getCurrent({
    // populate: true
  }, function (currentWindow) {
    if (chrome.runtime.lastError || !currentWindow) return

    const topPosition = currentWindow.top
    const rightPosition = currentWindow.left + currentWindow.width
    chrome.windows.create({
      url: 'src/html/popup.html',
      type: "popup",
      width: 300,
      height: 725,
      top: topPosition,
      left: rightPosition - 300,
      focused: true,
    
    },
      function (newWindow) {
        popupWindowID = newWindow.id
        chrome.windows.update(popupWindowID, { width: 325,  focused: true})
        
      })
  })
}







