//https://stackoverflow.com/questions/63789613/declarativenetrequest-update-rules
// Web filter
let filterList = [
    'example.com',
    'adchemy.com',
    'addthis.com',
    'addthisedge.com',
    'admob.com',
    'advertising.com',
    'aquantive.com',
    'atdmt.com',
    'channelintelligence.com',
    'cmcore.com',
    'coremetrics.com',
    'crowdscience.com',
    'decdna.net',
    'doubleclick.com',
    'doubleclick.net',
    'gravity.com',
    'imrworldwide.com',
    'insightexpress.com',
    'insightexpressai.com',
    'intellitxt.com',
    'invitemedia.com',
    'leadback.com',
    'media.fastclick.net',
    'nielsen-online.com',
    'quantcast.com',
    'quantserve.com',
    'realmedia.com',
    'revsci.net',
    'rightmedia.com',
    'rmxads.com',
    'ru4.com',
    'rubiconproject.com',
    'samsungadhub.com',
    'scorecardresearch.com',
    'sharethis.com',
    'shopthetv.com',
    'targetingmarketplace.com',
    'themig.com',
    'trendnetcloud.com',
    'yieldmanager.com',
    'yieldmanager.net',
    'yldmgrimg.net',
    'yumenetworks.com',
    'ads.samsung.com',
    'partner.googleadservices.com',
    'googlesyndication.com',
    'google-analytics.com',
    'creative.ak.fbcdn.net',
    'adbrite.com',
    'exponential.com',
]
let trustedSitesList = ['startpage.com', 'duckduckgo.com',]

let newRules;
let counterBlockAds = 0
// ---extension working  by default
let extensionOnOF = true
let currentSiteDomain;


//---------- This runs ONE TIME ONLY (unless the user reinstalls your extension)
chrome.runtime.onInstalled.addListener(() => {
    console.log('Background start successfully.......................')
    //-------- clear local storage
    chrome.storage.local.remove('key', () => console.log('Value "key" has been removed from local storage.'))
    //----- call function to generate filter rules  
    filterRulesCreator() 
    //------------ get and apply NewRules
    setFilterRules() 
})


//----------------- Set Block Filters
function filterRulesCreator() {
    newRules = filterList.map((url, index) => ({
        id: index + 1,
        priority: 1,
        action: {
            type: 'block'
        },
        condition: {
            urlFilter: `*://*.${url}/*`
        }
    }))

}

//------------------ Set Filter Rules
function setFilterRules() {
    chrome.declarativeNetRequest.getDynamicRules(previousRules => {
        const previousRuleIds = previousRules.map(rule => rule.id)
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: previousRuleIds,
            addRules: newRules
        })
    })
}


// ----------------------Watch and Get Visited site to put filter
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        try {
            const domain = new URL(tab.url).hostname.replace(/^www\./, '')
            //---add current site domain
            currentSiteDomain = domain
    
            //--- prevent duplicate filter , and add to filterList
            if (!filterList.includes(domain) &&  !trustedSitesList.includes(domain)) {
                filterList.unshift(domain)
            }
            //call functions to update data filters
            filterRulesCreator() 
            setFilterRules() 

            // console.log('Current tab Domain:', domain)
        } catch (error) {
            // console.error('Error extracting domain:', error.message)
        }
    })
})

//--------------------- check blocked client request  and add to counter
chrome.webRequest.onErrorOccurred.addListener(async(details) => {
    counterBlockAds++
    //---save counter in local storage
    chrome.storage.local.set({ 'key': counterBlockAds })    
    //---update badge new counter value
    setBadge()
    //---call function to send message to frontend
    // increaseCounter()
    // console.error('Error occurred for block request:', details)
}, { urls: ["<all_urls>"] })


//------------------- send message new value counter  ------delay send  (((used above local storage method))) :TODO
// async function increaseCounter() {
//     await chrome.runtime.sendMessage({ action: 'counterUpdated', counterBlockAds })
// }


//---------------------set badge
function setBadge() {
    // set a badge
    chrome.action.setBadgeText({ text: counterBlockAds.toString()})
    // set badge color
    chrome.action.setBadgeBackgroundColor({color: '#9688F1'})
}


// get message form popup.js FrontEnd and switch button ON/OFF
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const extensionState = request.toggleExtension
    if (extensionState) { //----------------- extension ON
        console.log('Extension turned ON')
        //remove form  trustedSitesList
        trustedSitesList = trustedSitesList.filter(x => x != currentSiteDomain)
        //add to filterList
        filterList.unshift(currentSiteDomain) 
    } else { //------------------------------- extension OF
        console.log('Extension turned OFF');
        //add to trustedSitesList
        trustedSitesList.push(currentSiteDomain)
        //remove form  filterList
        filterList = filterList.filter(x => x != currentSiteDomain)
    }
    //----- call function to generate filter rules  
    filterRulesCreator() 
    //------------ get and apply NewRules
    setFilterRules() 

    // Response
    // sendResponse({ extensionState: extensionState });
})

  



// =========================================  Prevent service worker

//     //Clear the SW
//     function removeSW(url) {
//         return chrome.browsingData.remove({
//             origins: [new URL(url).origin],
//         }, {
//             cacheStorage: true,
//             serviceWorkers: true,
//         });
//     }


//     // If you add an iframe element in DOM:
//     async function addIframe(url, parent = document.body) {
//         await removeSW(url);
//         const el = document.createElement('iframe');
//         parent.appendChild(el);
//         el.src = url;
//         return el;
//     }

//     // If you open an extension page with an <iframe> element in its HTML:
// async function openPage(url) {
//     await removeSW('https://example.com/');
//     console.log(url);
//     return chrome.tabs.create({  url});
// }



//------------------------------------------------------------------------------------