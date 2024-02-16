importScripts('../../assets/data/radioArr.js');  // this import: radioStations

//---------- This runs ONE TIME ONLY (unless the user reinstalls your extension)
chrome.runtime.onInstalled.addListener( () => {
    console.log('Background start successfully.......................')

    //add key to locale storage
    chrome.storage.local.set({ 'key': radioStations }) 



    //---add badge
    chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    if (message.action == 'addBadge') {
        await chrome.action.setBadgeText({ text: '♬' })
        await chrome.action.setBadgeBackgroundColor({color: '#9688F1'})
    }
    
    if (message.action == 'removeBadge') {
        await chrome.action.setBadgeText({ text: '' })
        await chrome.action.setBadgeBackgroundColor({color: '#ffff01'})
    }
 

    })
    
    
   //TODO:------------------------------------WARNING ------------------------------------------
    
    //-----------------------(((Play Audio in Background service worker)))-----------------------------------
   /*
    Manifest 3  ,date 15.02.2024
    It's not currently possible to play or capture media directly in service workers because they don't have access to DOM APIs.
   */   


})
  
