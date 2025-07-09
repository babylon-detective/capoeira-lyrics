(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();class f{constructor(){this.data=null,this.authors=new Map,this.songTypes=new Set}async loadData(){try{const t=`?cb=${new Date().getTime()}`,e=await fetch(`/capoeira_lyrics.json${t}`);if(!e.ok)throw new Error(`Failed to load lyrics data: ${e.statusText}`);const a=await e.json();return this.data=a,this.processData(),a}catch(t){throw console.error("Error loading lyrics data:",t),t}}processData(){this.data&&(this.data.songs.forEach(t=>{this.songTypes.add(t.type),this.authors.has(t.author)||this.authors.set(t.author,{id:t.author.toLowerCase().replace(/\s+/g,"-"),name:t.author,albums:[]})}),this.groupSongsByStructure())}groupSongsByStructure(){if(!this.data)return;const t=new Map;this.data.songs.forEach(e=>{t.has(e.author)||t.set(e.author,new Map);const a=t.get(e.author);a.has(e.album)||a.set(e.album,new Map);const r=a.get(e.album);r.has(e.track)||r.set(e.track,[]),r.get(e.track).push(e)}),t.forEach((e,a)=>{const r=this.authors.get(a),s=[];e.forEach((i,c)=>{const h=[];i.forEach((l,n)=>{h.push({id:n.toLowerCase().replace(/\s+/g,"-"),name:n,songs:l})}),s.push({id:c.toLowerCase().replace(/\s+/g,"-"),name:c,tracks:h})}),r.albums=s})}getAuthors(){return Array.from(this.authors.values())}getAuthorById(t){return Array.from(this.authors.values()).find(e=>e.id===t)}getSongsByAuthor(t){return this.data?this.data.songs.filter(e=>e.author===t):[]}getSongTypes(){return Array.from(this.songTypes).sort()}getSongsByType(t){return this.data?this.data.songs.filter(e=>e.type===t):[]}getSupportedLanguages(){return["english","español"]}formatLyrics(t){return t.map((e,a)=>{let r=e;return r.startsWith("^")?(r=r.substring(1),r=r.replace(/\|$/,""),r=`<b>${r}</b><br>`):(r=r.replace(/\*(.*?)\*/g,"<b>$1</b>"),r=r.replace(/\|/g,"<br>")),r}).join("")}getLanguageKey(t){switch(t){case"english":return"english";case"español":return"español";default:return"português"}}}function S(o,t){try{if(t==="português")return Array.isArray(o.lyrics.português)&&o.lyrics.português.length>0;{const e=t;return Array.isArray(o.lyrics.translations[e])&&o.lyrics.translations[e].length>0}}catch(e){return console.error(`Validation failed for song ${o.title.português} in language ${t}:`,e),!1}}class v{constructor(t){this.lyricsService=t}renderLyrics(t,e){if(!t||t.length===0){e.innerHTML=`
        <div class="sticky-header" data-track="Default">
          <div class="song-selector">
            <select id="songSelect-default">
              <option value="" disabled selected>Choose an Author...</option>
              <option value="Author 1">Author 1</option>
            </select>
          </div>
        </div>
        <h2 id="lyrics-track-heading" class="track-heading">Select an Author</h2>
        <p>No lyrics available.</p>
      `;return}const a=this.groupSongsByTrack(t);let r="";r+=`
      <div class="sticky-header">
        <div class="song-selector">
          <select id="songSelect-main">
            <option value="" disabled selected>Choose an Author...</option>
            <option value="Author 1">Author 1</option>
          </select>
        </div>
      </div>
      <h2 id="lyrics-track-heading" class="track-heading">Track 1</h2>
    `,Object.keys(a).sort().forEach((i,c)=>{const h=i.replace(/\s+/g,"-");r+=`
        <div class="track-nest" data-track="${i}" id="lyrics-nest-${h}">
          <!-- Track ${c+1} Content -->
        </div>
      `,a[i].forEach((l,n)=>{const g=`lyrics-song-${n}-${h}`;r+=`
          <div class="song-section" id="${g}">
            <i class="song-type">${l.type}</i><br><br>
            <b>${l.title.português}</b><br><br>
            ${this.lyricsService.formatLyrics(l.lyrics.português)}
          </div>
          <hr>
        `})}),e.innerHTML=r}renderTranslations(t,e,a){if(!t||t.length===0){a.innerHTML=`
        <div class="sticky-header" data-track="Default">
          <div class="song-selector">
            <select id="songSelect-trans-default">
              <option value="" disabled selected>Choose an Author...</option>
              <option value="Author 1">Author 1</option>
            </select>
          </div>
          <div class="language-selector">
            <select id="languageSelect-default" disabled>
              <option value="" disabled selected>Choose language...</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>
        <h2 id="trans-track-heading" class="track-heading">Select a Language</h2>
        <p>No translations available.</p>
      `;return}const r=this.groupSongsByTrack(t);let s="";s+=`
      <div class="sticky-header">
        <div class="song-selector">
          <select id="songSelect-trans">
            <option value="" disabled selected>Choose an Author...</option>
            <option value="Author 1">Author 1</option>
          </select>
        </div>
        <div class="language-selector">
          <select id="languageSelect-main">
            <option value="" disabled selected>Choose language...</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </select>
        </div>
      </div>
      <h2 id="trans-track-heading" class="track-heading">Track 1</h2>
    `,Object.keys(r).sort().forEach((c,h)=>{const l=c.replace(/\s+/g,"-");s+=`
        <div class="track-nest" data-track="${c}" id="trans-nest-${l}">
          <!-- Track ${h+1} Content -->
        </div>
      `,r[c].forEach((n,g)=>{const y=`trans-song-${g}-${l}`;if(!S(n,e)){s+=`
            <div class="translation-section" id="${y}">
              <i class="song-type">${n.type}</i><br>
              <b>${n.title.português}</b><br>
              <p class="error">Translation not available for ${e}</p>
            </div>
            <hr>
          `;return}let u,d;try{if(e==="português")u=n.lyrics.português,d=n.title.português;else{const p=e;u=n.lyrics.translations[p],d=n.title[e]}}catch(p){console.error(`Error processing song ${n.title.português} for language ${e}:`,p),u=["Translation not available"],d=n.title.português}s+=`
          <div class="translation-section" id="${y}">
            <i class="song-type">${n.type}</i><br><br>
            <b>${d}</b><br><br>
            ${this.lyricsService.formatLyrics(u)}
          </div>
          <hr>
        `})}),a.innerHTML=s}groupSongsByTrack(t){const e={};return t.forEach(a=>{e[a.track]||(e[a.track]=[]),e[a.track].push(a)}),e}clearDisplay(t,e){t.innerHTML="",e.innerHTML=""}}class m{constructor(t,e){this.lyricsService=t,this.renderer=e,this.state={selectedAuthor:null,selectedLanguage:"english",isLoading:!1,error:null},this.lyricsContainer=document.querySelector(".lyrics-column .content-container"),this.translationsContainer=document.querySelector(".translation-column .content-container"),this.initializeEventListeners()}initializeEventListeners(){this.lyricsContainer.addEventListener("change",this.handleLyricsContainerChange.bind(this)),this.translationsContainer.addEventListener("change",this.handleTranslationsContainerChange.bind(this))}handleLyricsContainerChange(t){const e=t.target;e.id&&(e.id.startsWith("songSelect-")||e.id==="songSelect-main")&&this.handleAuthorChange(t)}handleTranslationsContainerChange(t){const e=t.target;e.id&&(e.id.startsWith("languageSelect-")||e.id==="languageSelect-main")&&this.handleLanguageChange(t),e.id&&(e.id.startsWith("songSelect-trans")||e.id==="songSelect-trans")&&this.handleAuthorChange(t)}async handleAuthorChange(t){const a=t.target.value;if(!a){this.clearDisplay(),this.updateAllLanguageSelectors(!0);return}this.state.selectedAuthor=a,this.updateAllLanguageSelectors(!1);try{this.setState({isLoading:!0,error:null});const r=this.lyricsService.getSongsByAuthor(a);if(r.length===0){this.setState({error:"No songs found for this author"});return}this.renderer.renderLyrics(r,this.lyricsContainer),this.updateAllLanguageSelectors(!1,"en"),this.renderer.renderTranslations(r,this.state.selectedLanguage,this.translationsContainer),this.notifyContentUpdated(),this.setState({isLoading:!1})}catch(r){console.error("Error in handleAuthorChange:",r),this.setState({isLoading:!1,error:r instanceof Error?r.message:"Unknown error occurred"})}}handleLanguageChange(t){const a=t.target.value;if(!a||!this.state.selectedAuthor)return this.translationsContainer.innerHTML="",Promise.resolve();const r=this.mapLanguageCodeToName(a);this.state.selectedLanguage=r;try{const s=this.lyricsService.getSongsByAuthor(this.state.selectedAuthor);this.renderer.renderTranslations(s,r,this.translationsContainer)}catch(s){this.setState({error:s instanceof Error?s.message:"Error loading translations"})}return Promise.resolve()}clearDisplay(){this.renderer.clearDisplay(this.lyricsContainer,this.translationsContainer)}setState(t){this.state={...this.state,...t},this.updateUI()}updateUI(){this.state.isLoading&&(this.lyricsContainer.innerHTML="<p>Loading...</p>",this.translationsContainer.innerHTML="<p>Loading...</p>"),this.state.error&&(this.lyricsContainer.innerHTML=`<p class="error">Error: ${this.state.error}</p>`,this.translationsContainer.innerHTML=`<p class="error">Error: ${this.state.error}</p>`)}populateAuthorSelect(){this.loadInitialData()}loadInitialData(){this.lyricsService.getAuthors().length>0&&(this.renderer.renderLyrics([],this.lyricsContainer),this.renderer.renderTranslations([],"english",this.translationsContainer))}updateAllLanguageSelectors(t,e){this.translationsContainer.querySelectorAll('select[id^="languageSelect-"]').forEach(r=>{const s=r;s.disabled=t,e&&(s.value=e)})}updateAllAuthorSelectors(t,e){this.lyricsContainer.querySelectorAll('select[id^="songSelect-"]').forEach(s=>{const i=s;i.disabled=t,e&&(i.value=e)}),this.translationsContainer.querySelectorAll('select[id^="songSelect-trans"]').forEach(s=>{const i=s;i.disabled=t,e&&(i.value=e)})}mapLanguageCodeToName(t){switch(t){case"en":return"english";case"es":return"español";default:return"english"}}getLanguageDisplayName(t){switch(t){case"português":return"Portuguese";case"english":return"English";case"español":return"Spanish";default:return t}}getState(){return{...this.state}}notifyContentUpdated(){const t=new CustomEvent("contentUpdated");window.dispatchEvent(t)}}class L{constructor(){this.lyricsContainer=document.querySelector(".lyrics-column .content-container"),this.translationsContainer=document.querySelector(".translation-column .content-container"),this.lyricsHeading=null,this.translationsHeading=null,this.initializeScrollTracking(),window.addEventListener("contentUpdated",()=>{this.refreshTracking()})}initializeScrollTracking(){const t={root:null,rootMargin:"-60px 0px -80% 0px",threshold:.1},e=new IntersectionObserver(a=>{a.forEach(r=>{if(r.isIntersecting){const s=r.target;let i;s.classList.contains("track-marker")||s.classList.contains("track-nest")?i=s.getAttribute("data-track")||"":i=this.extractTrackName(s.textContent||""),this.updateTrackHeadings(i)}})},t);setTimeout(()=>{this.startObserving(e)},500)}startObserving(t){const e=document.querySelectorAll(".track-heading"),a=document.querySelectorAll(".track-marker"),r=document.querySelectorAll(".track-nest");e.forEach(s=>{t.observe(s)}),a.forEach(s=>{t.observe(s)}),r.forEach(s=>{t.observe(s)}),this.updateHeadingReferences()}updateHeadingReferences(){this.lyricsHeading=document.getElementById("lyrics-track-heading"),this.translationsHeading=document.getElementById("trans-track-heading")}extractTrackName(t){const e=t.match(/Track\s+(\d+)/i);return e?`Track ${e[1]}`:t.trim()||"Track 1"}updateTrackHeadings(t){this.lyricsHeading&&(this.lyricsHeading.textContent=t),this.translationsHeading&&(this.translationsHeading.textContent=t)}refreshTracking(){setTimeout(()=>{this.updateHeadingReferences(),this.initializeScrollTracking()},100)}setTrackHeading(t){this.updateTrackHeadings(t)}}function k(){const o=new f,t=["Normal line|","^Chorus line|","Another normal line|","^Another chorus line|"];console.log("Testing lyrics formatting:"),console.log("Input:",t),console.log("Output:",o.formatLyrics(t))}class T{constructor(){this.scrollTracker=null,this.lyricsService=new f,this.renderer=new v(this.lyricsService),this.uiManager=new m(this.lyricsService,this.renderer)}async initialize(){try{console.log("Initializing Lyrics App..."),k(),await this.lyricsService.loadData(),console.log("Lyrics data loaded successfully"),this.uiManager.populateAuthorSelect(),console.log("UI initialized successfully"),this.scrollTracker=new L,console.log("Scroll tracker initialized")}catch(t){console.error("Failed to initialize app:",t),this.showError("Failed to load lyrics data. Please refresh the page.")}}showError(t){const e=document.querySelector(".lyrics-column .content-container"),a=document.querySelector(".translation-column .content-container");e&&(e.innerHTML=`<p class="error">${t}</p>`),a&&(a.innerHTML=`<p class="error">${t}</p>`)}}document.addEventListener("DOMContentLoaded",async()=>{await new T().initialize()});
