import { MEDIA } from "./media.js"; //the data file import

const APP = {
  audio: new Audio(), //the Audio Element that will play every track
  currentTrack: 0, //the integer representing the index in the MEDIA array
  tracks: [], //array of tracks
  init: () => {
    APP.addListeners();
    APP.buildPlaylist();
  },
  addListeners: () => {
    //? DOM events
    document
      .getElementById("btnPlay")
      .addEventListener("click", APP.CheckPlayOrPause);
    document
      .getElementById("btnNext")
      .addEventListener("click", APP.nextButton);
    document
      .getElementById("btnPrev")
      .addEventListener("click", APP.previousButton);
    document.querySelector("ul").addEventListener("click", APP.playClickedSong);
    //? AUDIO Event Listeners

    APP.audio.addEventListener("durationchange", APP.durationchange);
    APP.audio.addEventListener("timeupdate", APP.currentTime);
    APP.audio.addEventListener("error", APP.errorHandler);

    //? AUDIO Event listeners for future use
    APP.audio.addEventListener("ended", APP.ended);
    // APP.audio.addEventListener("play", APP.play);
    // APP.audio.addEventListener("pause", APP.pause);
  },
  buildPlaylist: () => {
    APP.audio.src = `./media/${APP}`;
    let ul = document.getElementById("playlist");
    ul.innerHTML = MEDIA.map((music) => {
      return `<li class="track__item" id="${music.title}" data-track="${music.track}">
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

    MEDIA.forEach((music) => {
      APP.tracks.push(music.track);
    });
    APP.loadCurrentTrack();
    APP.displayTrackDurations();
  },
  errorHandler: (ev) => {
    let albumArt = document.querySelector(".album_art__image");
    albumArt.src = `./img/error-image.jpeg`;

    let ul = document.getElementById("playlist");
    ul.innerHTML = `<h2 class="error-h2">Unable to reproduce music. There is a problem with the data.</h2>`;
  },
  loadCurrentTrack: () => {
    //load image and track
    let albumArt = document.querySelector(".album_art__image");
    albumArt.src = `./img/${MEDIA[APP.currentTrack].large}`;
    APP.audio.src = `./media/${MEDIA[APP.currentTrack].track}`;
    APP.currentTrackDecoration();
  },
  currentTrackDecoration: () => {
    const trackDecoration = MEDIA.find(
      (item) => item.track === APP.tracks[APP.currentTrack]
    ).title;

    let currentTrackItem = document.querySelectorAll(".track__item");
    currentTrackItem.forEach((artist) => {
      if (artist.id === trackDecoration) {
        artist.classList.add("active-li");
      } else {
        artist.classList.remove("active-li");
      }
    });
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
      APP.animateEqualizer(true);
    } else {
      console.warn("You need to load a track first");
    }
  },
  playClickedSong: (event) => {
    if (event.target.closest("li") == null) {
      return;
    } else {
      APP.pause();
      let clickedLi = event.target.closest("li").getAttribute("data-track");
      let index = MEDIA.findIndex((item) => item.track === clickedLi);
      APP.currentTrack = index;
      APP.loadCurrentTrack();

      let playButton = document.getElementById("btnPlay").firstElementChild;
      playButton.innerHTML = "pause";
      APP.play();
    }
  },
  nextButton: () => {
    APP.pause();
    APP.currentTrack++;
    if (APP.currentTrack >= MEDIA.length) {
      APP.currentTrack = 0;
    }
    APP.loadCurrentTrack();
    APP.play();
    let playButton = document.getElementById("btnPlay").firstElementChild;
    playButton.innerHTML = "pause";
  },
  previousButton: () => {
    APP.pause();
    APP.currentTrack--;
    if (APP.currentTrack < 0) {
      APP.currentTrack = MEDIA.length - 1;
    }
    APP.loadCurrentTrack();
    APP.play();
    let playButton = document.getElementById("btnPlay").firstElementChild;
    playButton.innerHTML = "pause";
  },
  animateEqualizer: (ev) => {
    let stroke = document.querySelectorAll(".stroke");
    if (ev) {
      stroke.forEach((element) => element.classList.add("active"));
    } else {
      stroke.forEach((element) => element.classList.remove("active"));
    }
  },
  pause: () => {
    //pause the track loaded into APP.audio playing
    APP.audio && APP.audio.pause();
    APP.animateEqualizer(false);
  },
  ended: () => {
    APP.nextButton();
  },
  durationchange: (ev) => {
    let totalTime = document.getElementById("total-time");
    let convertion = APP.convertTimeDisplay(APP.audio.duration);
    totalTime.textContent = convertion;
  },
  displayTrackDurations: () => {
    MEDIA.forEach((track) => {
      //create a temporary audio element to open the audio file
      let tempAudio = new Audio(`./media/${track.track}`);

      //listen for the event
      tempAudio.addEventListener("durationchange", (ev) => {
        let duration = ev.target.duration;
        track["duration"] = duration;
        //update the display by finding the playlist item with the matching img src
        //or track title or track id...
        let trackLi = document.querySelectorAll(".track__item");
        trackLi.forEach((li) => {
          if (li.id.includes(track.title)) {
            //convert the duration in seconds to a 00:00 string
            let timeString = APP.convertTimeDisplay(duration);
            //update the playlist display for the matching item
            li.querySelector("time").textContent = timeString;
          }
        });
      });
    });
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
