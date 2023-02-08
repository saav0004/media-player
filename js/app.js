import { MEDIA } from "./media.js"; //the data file import

const APP = {
  audio: new Audio(), //the Audio Element that will play every track
  currentTrack: 0, //the integer representing the index in the MEDIA array
  tracks: [], //array of tracks
  init: () => {
    console.log("llegue a init");
    //called when DOMContentLoaded is triggered
    APP.loadCurrentTrack();
    APP.addListeners();
    APP.buildPlaylist();
  },
  addListeners: () => {
    //DOM events
    document.getElementById("btnPlay").addEventListener("click", APP.startPlay);
    document.getElementById("btnPause", APP.pausePlay);
    //add event listeners for interface elements
    //add event listeners for APP.audio
    // APP.audio.addEventListener("error", APP.audioError);
    // APP.audio.addEventListener("ended", APP.ended);
    // APP.audio.addEventListener("loadstart", APP.loadstart);
    // APP.audio.addEventListener("loadedmetadata", APP.loadedmetadata);
    // APP.audio.addEventListener("canplay", APP.canplay);
    // APP.audio.addEventListener("durationchange", APP.durationchange);
    // APP.audio.addEventListener("timeupdate", APP.timeupdate);
    // APP.audio.addEventListener("play", APP.play);
    // APP.audio.addEventListener("pause", APP.pause);
  },
  buildPlaylist: () => {
    APP.audio.src = `./media/${APP}`;
    let ul = document.getElementById("playlist");
    ul.innerHTML = MEDIA.map((music) => {
      return `<li class="track__item">
  <div class="track__thumb">
    <img src="./img/${music.thumbnail}" alt="artist album art thumbnail" />
  </div>
  <div class="track__details">
    <p class="track__title">${music.title}</p>
    <p class="track__artist">${music.artist}</p>
  </div>
  <div class="track__time">
    <time datetime="">00:00</time>
  </div>
</li>`;
    }).join("");

    // read the contents of MEDIA and create the playlist
  },
  loadCurrentTrack: () => {
    //use the currentTrack value to set the src of the APP.audio element
    // APP.audio.src = `./media/${APP.tracks[APP.currentTrack]}`;
    // console.log("Audio has been loaded", APP.audio.src);
  },
  play: () => {
    //start the track loaded into APP.audio playing
  },
  pause: () => {
    //pause the track loaded into APP.audio playing
  },
  convertTimeDisplay: (seconds) => {
    //convert the seconds parameter to `00:00` style display
  },
};

document.addEventListener("DOMContentLoaded", APP.init);

/* <li class="track__item">
  <div class="track__thumb">
    <img src="./img/akcent-thumb.png" alt="artist album art thumbnail" />
  </div>
  <div class="track__details">
    <p class="track__title">Przez Twe Oczy Zielone</p>
    <p class="track__artist">Akcent</p>
  </div>
  <div class="track__time">
    <time datetime="">03:41</time>
  </div>
</li>; */
