import { MEDIA } from "./media.js"; //the data file import

const APP = {
  audio: new Audio(), //the Audio Element that will play every track
  currentTrack: 0, //the integer representing the index in the MEDIA array
  tracks: [], //array of tracks
  init: () => {
    //called when DOMContentLoaded is triggered
    APP.addListeners();
    APP.buildPlaylist();
  },
  addListeners: () => {
    //? DOM events
    document
      .getElementById("btnPlay")
      .addEventListener("click", APP.CheckPlayOrPause);
    //? AUDIO Event Listeners

    APP.audio.addEventListener("durationchange", APP.durationchange);
    APP.audio.addEventListener("timeupdate", APP.currentTime);
    APP.audio.addEventListener("error", APP.errorHandler);

    //? AUDIO Event listeners for future use
    // APP.audio.addEventListener("ended", APP.ended);
    // APP.audio.addEventListener("loadstart", APP.loadstart);
    // APP.audio.addEventListener("loadedmetadata", APP.loadedmetadata);
    // APP.audio.addEventListener("canplay", APP.canplay);
    // APP.audio.addEventListener("play", APP.play);
    // APP.audio.addEventListener("pause", APP.pause);
  },
  buildPlaylist: () => {
    APP.audio.src = `./media/${APP}`;
    let ul = document.getElementById("playlist");
    ul.innerHTML = MEDIA.map((music) => {
      return `<li class="track__item" id="${music.title}">
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

    console.table(MEDIA);

    // read the contents of MEDIA and create the playlist

    MEDIA.forEach((music) => {
      APP.tracks.push(music.track);
    });
    APP.loadCurrentTrack();
  },
  errorHandler: (ev) => {
    let albumArt = document.querySelector(".album_art__image");
    albumArt.src = `./img/error-image.jpeg`;

    let ul = document.getElementById("playlist");
    ul.innerHTML = `<h2 class="error-h2">Unable to reproduce music. There is a problem with the data.</h2>`;
  },
  loadCurrentTrack: () => {
    //load album art
    let albumArt = document.querySelector(".album_art__image");

    albumArt.src = `./img/${MEDIA[APP.currentTrack].large}`;

    //load function in steve's video
    //use the currentTrack value to set the src of the APP.audio element
    APP.audio.src = `./media/${MEDIA[APP.currentTrack].track}`;
    APP.currentTrackDecoration();
  },
  currentTrackDecoration: () => {
    // let trackDecoration = document.querySelectorAll(".track__item");

    const currentArtist = MEDIA.find(
      (artist) => artist.track === APP.tracks[APP.currentTrack]
    ).title;
    document
      .querySelectorAll(".track__item")
      .forEach((artist) =>
        artist.classList.toggle("active-li", artist.id === currentArtist)
      );

    // console.log(trackDecoration);

    // // [APP.currentTrack]

    // // .classList.add("active_li");

    // console.log(trackDecoration);

    // let currentArtist = "";
    // MEDIA.forEach((artist) => {
    //   if (artist.track == APP.tracks[APP.currentTrack]) {
    //     return (currentArtist = artist.title);
    //   }
    // });
    // let artistLi = document.querySelectorAll(".track__item");
    // artistLi.forEach((artist) => {
    //   if (`${artist.id}` == `${currentArtist}`) {
    //     artist.classList.add("active-li");
    //   }
    // });
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
      APP.animateEqualizer();
    } else {
      console.warn("You need to load a track first");
    }
  },
  animateEqualizer: () => {
    //if play, do this
    let stroke = document.querySelectorAll(".stroke");

    stroke.forEach((element) => element.classList.toggle("active"));

    //if pause, do this.
  },
  pause: () => {
    //pause the track loaded into APP.audio playing
    APP.audio && APP.audio.pause();
    APP.animateEqualizer();
  },
  durationchange: (ev) => {
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
    //convert the seconds parameter to `00:00` style display
    let flooredMinutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    let flooredSeconds = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${flooredMinutes}:${flooredSeconds}`;
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
