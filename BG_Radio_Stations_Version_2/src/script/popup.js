
//---------------------------------------GLOBAL VAR
let audioURL = ''


document.addEventListener('DOMContentLoaded', async function () {
  console.log('PopUp window load success....')

  //--- get data form locale storage
  const radioArray = await getDataFromStorage()
  
  //--- add element with data to HTML
  addElementsToPopupHTML(radioArray)


  //--- get element form HTML
  const html = {
    htmlTag: () => document.querySelector('html'),
    ul: () => document.querySelector('body > ul'),
    pNameArray: () => Array.from(document.querySelectorAll('.radio-name')),
    radioBtnArray: () => Array.from(document.querySelectorAll('.radio-btn')),
    audioPlayer: () => document.querySelector('.audio-player'),
    metaInfo: () => document.querySelector('.meta'),
    fakeBtn: () => document.getElementsByClassName('fake-button'),
    loading: () => document.querySelector('#loading'),
    station: () => document.querySelector('.meta').firstElementChild,
    artist: () => document.querySelector('.meta').children[1],
    song: () => document.querySelector('.meta').lastElementChild,
    

  }

  //--- prevent and disable: drag and drop, select user
  html.htmlTag().addEventListener('dragstart', e => e.preventDefault())
  html.htmlTag().style.userSelect = 'none'


  //--- scroll event to hide opacity header
  document.addEventListener('scroll', () => {
    const elementPosition = document.querySelector('li').getBoundingClientRect().top
    const header = document.querySelector('header')
    if (elementPosition <= header.getBoundingClientRect().bottom) {
      // console.log('touch');
      header.style.background = 'black'
    } else {
      // console.log('no touch');
      header.style.background = 'repeating-radial-gradient(black, transparent 50px)'
    }
  })

  //--- disable manuel window resize
  const width = window.outerWidth
  const height =  window.outerHeight
  window.addEventListener("resize", () => {
    window.resizeTo(width, height)
  })


  //--- add audio controls
  audioPlayerControls()

  //---load data form locale storage
  async function getDataFromStorage() {
    const result = await new Promise((resolve, reject) => {
      chrome.storage.local.get('key', (data) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(data.key)
        }
      })
    })
    return result
  }

  //---add html elements for popup.html
  function addElementsToPopupHTML(radioStations) {
    const ulElement = document.querySelector('ul')
    //fake btn image
    const fakeImg = '../../assets/images/buttons/btnPlay.png'

    radioStations.forEach(stations => {
      const { img, name, url} = stations

      //add li tags for ul (o.k / o.k -  I know, but this is a test project and this is a trusted local file)
      ulElement.innerHTML += `
        <li>
           <img src="/assets/images/radioLogo/${img}.jpg" alt="image">
           <p class="radio-name">${name}</p>
           <div style="display: none;">${url}</div>
           <label>
              <img class="fake-btn" src="${fakeImg}" alt="pic">
              <input class="radio-btn" type="radio" name="station" value="${url}">
           </label>
        </li>
    `;
    })
  }


  //--- check push radio button and play music current station  
  html.radioBtnArray().forEach(btn => {
    btn.addEventListener('click', function (event) {
      // restore meta labels 
      html.station().textContent = 'Station:'
      html.artist().textContent = 'Artist:'
      html.song().textContent ='Song:'

      const radioName = event.target.parentNode.parentNode.children[1].textContent
      const currentRadio = event.target

      // Check if btnStop is active
      const stopButton = document.querySelector('.working')

      
      if (stopButton) {
        // Stop the current audio
        html.audioPlayer().pause()

        equalizer(false)
        
        // Change img button Stop to Play
        stopButton.previousElementSibling.src = '../../assets/images/buttons/btnPlay.png'

        // Remove the 'working' class from the Stop button
        stopButton.classList.remove('working')

        //--- disabled notes animation
        document.querySelector('.note-wrap').style.display = 'none'
      } else {
        
        //restore default on every click
        html.loading().style.display = 'block'
      
        // Add class to current event.target button
        event.target.classList.add("working")

        // Change img button Play to Stop
        currentRadio.previousElementSibling.src = '../../assets/images/buttons/btnStop.png'

        // Restore p color by default
        html.pNameArray().map(x => x.style.color = 'deeppink')
        
        // Set style active p new color
        event.target.parentNode.parentNode.children[1].style.color = 'white'

        // Set radio data url
        audioURL = currentRadio.value
        const audioSource = currentRadio.value
        const audioMetaData = audioSource.match(/.*\//)[0] + '/status.xsl'
   
        // Audio start loading...
        html.audioPlayer().src = audioSource
        html.audioPlayer().load()
       
        
        // check is audio loaded success
        isAudioLoaded(html.audioPlayer(), audioMetaData, radioName, )  
        .then((loaded) => {
            if (loaded) {
              console.log('The audio element is fully charged. 1')
              // play
              html.audioPlayer().play()
              // get meta data
              getCurrentAudioMetaData(audioMetaData, radioName)
    
            }
        })

          
      }
    })
   
   
    // play checked 
    btn.addEventListener('change', function (event) {
      //restore default on every click
      html.loading().style.display = 'block'
     
      const radioName = event.target.parentNode.parentNode.children[1].textContent
      const currentRadio = event.target

      // Add class to current event.target button
      event.target.classList.add("working")

      // Change img button Play to Stop
      currentRadio.previousElementSibling.src = '../../assets/images/buttons/btnStop.png'

      // Restore p color by default
      html.pNameArray().map(x => x.style.color = 'deeppink')

      // Set style active p new color
      event.target.parentNode.parentNode.children[1].style.color = 'white'

      // Set radio data url
      audioURL = currentRadio.value
      const audioSource = currentRadio.value
      const audioMetaData = audioSource.match(/.*\//)[0] + '/status.xsl'
      

      // Audio start play
      if (html.audioPlayer().paused) {
        html.audioPlayer().src = audioSource
        html.audioPlayer().load()
    
        // check is audio loaded success
        isAudioLoaded(html.audioPlayer(), audioMetaData, radioName, )
        .then((loaded) => {
          if (loaded) {
            console.log('The audio element is fully charged. 2')
            // play
            html.audioPlayer().play()
            // get meta data 
            getCurrentAudioMetaData(audioMetaData, radioName)
          }
        })
     
   
      }

    })
      
  })


  //=================================================== audio functions


 //---- check is audio loaded success
  function isAudioLoaded(audioElement, audioMetaData, radioName) {
    return new Promise((resolve) => {                                                                                          
        // success
      audioElement.addEventListener('loadeddata', function () {
              // add equalizer
              equalizer()
            
              //--- hide logo antenna
              document.querySelector('.antenna').style.display = 'none'
              //--- show notes animation
              document.querySelector('.note-wrap').style.display = 'block'
              //--- hide loading label every click
              html.loading().style.display = 'none'
          resolve(true)

        })

        //--------------- fail load audio 
        audioElement.addEventListener('error', function() {        
          resolve(false)
        })
                                                                                                       
    })
}


  //--- audio player custom control
  function audioPlayerControls() {
    const audioPlayer = document.querySelector('.audio-player')
    // hide default audio controls
    audioPlayer.controls = false;

    //---audio will start half volume power
    audioPlayer.volume = 0.5

    const volumeDownButton = document.getElementById('volumeDown')
    const volumeUpButton = document.getElementById('volumeUp')

    //get volume line
    const volumeLine = document.querySelector('.volume-line')
    const slider = document.querySelector('.slider')


    volumeDownButton.addEventListener('click', function () {
      if (!audioPlayer.paused) {
        audioPlayer.volume = Math.max(0, audioPlayer.volume - 0.1)

        //--------------decrease volume line 
        //get current value
        const currentSPx = parseInt(window.getComputedStyle(slider).left, 10)

        //---add red color if sound <= 0.3 sound
        volumeLine.style.background = currentSPx <= 100 ? 'blue' : currentSPx <= 225 ? 'white' : 'red'

        if (currentSPx > 25) {
          slider.style.left = (currentSPx - 25) + 'px'
        }
        slider.style.background = currentSPx <= 40 ? 'red' : null


      }

    })

    volumeUpButton.addEventListener('click', function () {
      if (!audioPlayer.paused) {
        audioPlayer.volume = Math.min(1, audioPlayer.volume + 0.1)

        //--------------decrease volume line 
        //get current value
        const currentSPx = parseInt(window.getComputedStyle(slider).left, 10)

        //---add red color if sound >= 0.3 sound
        volumeLine.style.background = currentSPx >= 175 ? 'red' : currentSPx <= 50 ? 'blue' : 'white'
        if (currentSPx < 265) {
          slider.style.left = (currentSPx + 25) + 'px'
        }
        slider.style.background = currentSPx > 40 ? '#8d12ac' : null
      }
    })
  }


   //---Web Audio API get current music data
 async function getCurrentAudioMetaData(audioMetaData, radioName) {
   await fetch(audioMetaData)
      .then(response => response.text())
      .then(xsl => {
      // console.log('full html code:', xsl)
        
        //--- XSL text  parser
        const parser = new DOMParser()
        const doc = parser.parseFromString(xsl, 'text/html')
        const elements = doc.querySelectorAll('[class^="streamdata"]')
  

        const filteredElements = Array.from(elements).filter(x => x.textContent.includes(radioName))[0]
   
	 if (filteredElements.textContent.includes(radioName)) {
  		const table = filteredElements.closest("table");
  		const rows = Array.from(table.querySelectorAll("tr"));

  		const getRowValue = (label) => {
   		 const row = rows.find(r => r.querySelector("td")?.textContent.trim() === label);
    	return row ? row.querySelector(".streamdata")?.textContent.trim() : "";
 	 };

 	 const streamTitle = getRowValue("Stream Title:");
  	const streamDescription = getRowValue("Stream Description:");
 	 const contentType = getRowValue("Content Type:");
  	const mountStart = getRowValue("Mount Start:");
  	const bitrate = getRowValue("Bitrate:");
  	const streamGenre = getRowValue("Stream Genre:");
  	const currentSong = getRowValue("Current Song:");
  	const currentListeners = getRowValue("Current Listeners:");
  	const peakListeners = getRowValue("Peak Listeners:");

  console.log("Metadata", streamTitle, currentListeners, currentSong);

 	 const metadata = { streamTitle, currentListeners, currentSong };
 	 addMetaDataToPopupHTML(metadata);
}


      })
      .catch(error => {
        // console.error('Error unable to get meta data information!!!:', error)
        // back static information
        html.metaInfo().children[0].textContent = `Station: ${radioName}`
        html.metaInfo().children[1].textContent = `Artist: No info`
        html.metaInfo().children[2].textContent = `Song: No info`
      })

  }

  //prototype custom function titleCase  
  String.prototype.titleCase = function () {
    return this.slice(0, 1).toUpperCase() + this.slice(1).toLowerCase()
  }

  function addMetaDataToPopupHTML(metadata) {
    try {
      const {  streamTitle,  currentListeners,  currentSong} = metadata
      console.log(streamTitle, currentListeners, currentSong);

      html.metaInfo().children[0].textContent = `Station: ${streamTitle}`
      let [artist, song] = currentSong.split(' - ')

      // console.log(streamTitle, artist, song);

      if (song == undefined) {
        artist = 'No Info'
        song = 'No Info'
      }

      //--- prevent to long text
      function truncateText(text, maxLength) {
        if (text.length > maxLength) {
          return text.slice(0, maxLength) + '...'
        }
        return text
      }

      artist = truncateText(artist, 27)
      song = truncateText(song, 27) // 27


      //---add text to html
      html.metaInfo().children[1].textContent = `Artist: ${artist.split(' ').map(x => x.titleCase()).join(' ')}`
      html.metaInfo().children[2].textContent = `Song: ${song.split(' ').map(x => x.titleCase()).join(' ')}`
    } catch (error) {
      console.log('fail to load meta data', error);
    }
  }

 

  //---------add equalizer
  function equalizer(isPlay = Boolean) {
    const container = document.querySelector('.equalizer-container')
    container.style.display = isPlay ? 'flex' : 'none'
  }
  
})
  
