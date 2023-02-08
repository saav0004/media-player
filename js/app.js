import { MEDIA } from "./media.js"; //the data file import

const APP = {
  audio: new Audio(), //the Audio Element that will play every track
  currentTrack: 0, //the integer representing the index in the MEDIA array
  tracks: [], //array of tracks
  init: () => {
    console.log("llegue a init");
    //called when DOMContentLoaded is triggered
    APP.addListeners();
    APP.buildPlaylist();
  },
  addListeners: () => {
    //? DOM events
    document
      .getElementById("btnPlay")
      .addEventListener("click", APP.CheckPlayOrPause);
    //? Event Listeners AUDIO
    //add event listeners for interface elements
    //add event listeners for APP.audio
    // APP.audio.addEventListener("error", APP.audioError);
    // APP.audio.addEventListener("ended", APP.ended);
    // APP.audio.addEventListener("loadstart", APP.loadstart);
    // APP.audio.addEventListener("loadedmetadata", APP.loadedmetadata);
    // APP.audio.addEventListener("canplay", APP.canplay);
    APP.audio.addEventListener("durationchange", APP.durationchange);
    APP.audio.addEventListener("timeupdate", APP.currentTime);
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
    let playList = MEDIA.map((music) => (music = music.track));
    playList.forEach((music) => {
      APP.tracks.push(music);
    });
    // console.log(APP.tracks);
    APP.loadCurrentTrack();
  },
  loadCurrentTrack: () => {
    //load function in steve's video
    //use the currentTrack value to set the src of the APP.audio element
    APP.audio.src = `./media/${APP.tracks[APP.currentTrack]}`;
    console.log("i am in load current tracks");
    // console.log("Audio has been loaded", APP.audio.src);
  },
  CheckPlayOrPause: () => {
    let playButton = document.getElementById("btnPlay").firstElementChild;
    if (playButton.textContent === "play_arrow") {
      playButton.innerHTML = "pause";
      APP.play();
    } else {
      playButton.innerHTML = "play_arrow";
      APP.pause();
    }
  },
  play: () => {
    if (APP.audio.src) {
      APP.audio.play();
    } else {
      console.warn("You need to load a track first");
    }
    //start the track loaded into APP.audio playing
  },
  pause: () => {
    APP.audio && APP.audio.pause();
    //pause the track loaded into APP.audio playing
  },
  durationchange: (ev) => {
    console.log(ev.type);
    let totalTime = document.getElementById("total-time");
    let convertion = APP.convertTimeDisplay(APP.audio.duration);
    totalTime.textContent = convertion;
  },
  currentTime: () => {
    let totalTime = document.getElementById("current-time");
    let convertion = APP.convertTimeDisplay(APP.audio.currentTime);
    totalTime.textContent = convertion;
  },
  convertTimeDisplay: (seconds) => {
    let flooredMinutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    let flooredSeconds = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${flooredMinutes}:${flooredSeconds}`;

    //convert the seconds parameter to `00:00` style display
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
