document.addEventListener('DOMContentLoaded', function () {
  console.log('PopUp window load success')

  const [btnEnable, btnDisable] =  document.getElementsByClassName('btn')
  const h2 = document.querySelector('h2')

  if (btnEnable && btnDisable) { // prevent error invalid DOM elements when open options page
    btnEnable.style.cursor = "not-allowed"
 
  // click btn disabled
  btnDisable.addEventListener('click', function (event) {
    h2.style.color = 'darkblue'
    btnEnable.disabled = false
    btnEnable.style.cursor = 'pointer'
    btnDisable.disabled = true
    btnDisable.style.cursor = 'not-allowed'
    // stop/Of WAB extension 
    chrome.runtime.sendMessage({ toggleExtension: false }) 
    // reload current web page
    reloadPage()
  
  })

  // click btn enabled
  btnEnable.addEventListener('click', function (event) {
    h2.style.color = '#FF4500'
    btnDisable.disabled = false
    btnDisable.style.cursor = 'pointer'
    btnEnable.disabled = true
    btnEnable.style.cursor = 'not-allowed' 
    // start/On WAB extension 
    chrome.runtime.sendMessage({ toggleExtension: true }) 
    // reload current web page
    reloadPage()
  })


// get counter blocked ads requests ---------------- listener receive and refresh data only on blocked event
//--------- (((use local storage method below))) : TODO --------------------
  
//   chrome.runtime.onMessage.addListener( async(message) => {
//       if (message.action == 'counterUpdated') {
//       const newCounterValue = await  message.counterBlockAds
//       document.querySelector('span').innerText = newCounterValue
//       }
// })



//------------------------------------------get async key form local storage
async function getCounterFromStorage() {
  return new Promise((resolve, reject) => {
      chrome.storage.local.get('key', (result) => {
          if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError)
          } else {
              resolve(result.key)
          }
      })
  })
}

// ---------------------   call function and set value to SPAN counter
getCounterFromStorage().then((counterValue) => {
  document.querySelector('span').innerText = counterValue || 0
  // console.log('Counter value from storage:', counterValue);
}).catch((error) => {
  console.error('Error getting counter value from storage:', error)
})

  
//------------------------- reload page
  function reloadPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.reload(tabs[0].id);
    })
  }
  
  }
  
})