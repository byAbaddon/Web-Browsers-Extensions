importScripts('../../assets/data/radioArr.js'); // this import: radioStations

//---global var
let isPopupWindowOpen = false
let popupWindowID  = null

  //---------- This runs ONE TIME ONLY (unless the user reinstalls your extension)
chrome.runtime.onInstalled.addListener(() => {
  console.log('Background start successfully.......................')


  //---add key to locale storage
  chrome.storage.local.set({
    'key': radioStations
  })


});

//================================================================
  //---create new Window
  chrome.action.onClicked.addListener(function (tab) {
    if (!isPopupWindowOpen) {
      createNewWindow()
      isPopupWindowOpen = true
      //add badge
      chrome.action.setBadgeText({ text: '♬' })
      chrome.action.setBadgeBackgroundColor({ color: '#9688F1' })
    }
  })



function createNewWindow() {
  // check is already have popup.html  window
  if (popupWindowID !== null) {
    return
  }

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
          chrome.windows.update(popupWindowID, { width: 325, focused: true })
        
        })
      
    })
  }



//---check is popup window was killed
  chrome.windows.onRemoved.addListener(function (windowId) {
    if (windowId == popupWindowID) {
      //reset data
      isPopupWindowOpen = false
      popupWindowID = null
      //remove badge
      chrome.action.setBadgeText({ text: '' })
      chrome.action.setBadgeBackgroundColor({ color: '#ffff01' })
    }

  })


