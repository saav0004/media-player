import { MEDIA } from "./media.js"; //the data file import

const APP = {
  audio: new Audio(), //the Audio Element that will play every track
  currentTrack: 0, //the integer representing the index in the MEDIA array
  tracks: [], //array of tracks
  init: () => {
    APP.addListeners();
    APP.buildPlaylist();
    APP.setupVolumeControl();
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
    document
      .getElementById("btnShuffle")
      .addEventListener("click", APP.shuffleSong);
    document.querySelector("ul").addEventListener("click", APP.playClickedSong);
    document
      .getElementById("volumeIcon")
      .addEventListener("click", APP.muteUnmute);
    //? AUDIO Event Listeners

    APP.audio.addEventListener("durationchange", APP.durationchange);
    APP.audio.addEventListener("timeupdate", APP.currentTimeDisplay);
    APP.audio.addEventListener("error", APP.errorHandler);
    APP.audio.addEventListener("ended", APP.ended);
    //! PROGRESS BAR
    document
      .querySelector(".progress")
      .addEventListener("click", APP.seekClick);
  },
  buildPlaylist: (ev) => {
    APP.audio.src = `./media/${APP.tracks[APP.currentTrack]}`;
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
    APP.audio.src = `./media/${MEDIA[APP.currentTrack].track}`;
    let albumArt = document.querySelector(".album_art__image");
    albumArt.src = `./img/${MEDIA[APP.currentTrack].large}`;
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
  animateEqualizer: (ev) => {
    let albumImage = document.querySelector(".album_art__image");
    let backgroundImageDiv = document.querySelector(".album_art__full");
    let stroke = document.querySelectorAll(".stroke");
    if (ev) {
      stroke.forEach((element) => element.classList.add("active"));
      albumImage.classList.add("active");
      backgroundImageDiv.classList.add("active");
    } else {
      stroke.forEach((element) => element.classList.remove("active"));
      albumImage.classList.remove("active");
      backgroundImageDiv.classList.remove("active");
    }
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
  seekClick: (ev) => {
    let xPos = ev.offsetX;
    let progressBarWidth = document.querySelector(".progress").clientWidth;
    let currentClick = (xPos / progressBarWidth) * APP.audio.duration;
    APP.audio.currentTime = currentClick;
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
    let conversion = APP.convertTimeDisplay(APP.audio.duration);
    totalTime.textContent = conversion;
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
  currentTimeDisplay: () => {
    let totalTime = document.getElementById("current-time");
    let conversion = APP.convertTimeDisplay(APP.audio.currentTime);
    totalTime.textContent = conversion;
    APP.showPercentageComplete();
  },
  showPercentageComplete: () => {
    if (APP.audio.currentTime === 0) {
      let played = document.querySelector(".played");
      played.style.width = `${0}%`;
      return;
    } else {
      let percentageComplete = APP.audio.currentTime / APP.audio.duration;
      let percentageCompleteText = (percentageComplete * 100).toFixed(2);
      let played = document.querySelector(".played");
      played.style.width = `${percentageCompleteText}%`;
    }
  },
  shuffleSong: () => {
    APP.pause();
    let playButton = document.getElementById("btnPlay").firstElementChild;
    playButton.innerHTML = "play_arrow";
    APP.currentTrack = 0;
    MEDIA.shuffle();
    APP.tracks = [];
    APP.buildPlaylist();
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
  setupVolumeControl: () => {
    const volumeSlider = document.getElementById("volumeSlider");
    const volumeIcon = document.getElementById("volumeIcon");

    // Event listener for volume control
    volumeSlider.addEventListener("input", () => {
      // Get the value of the volume slider (between 0 and 1)
      const volume = parseFloat(volumeSlider.value);

      // Set the audio volume to the selected value (replace with your audio element reference)
      APP.audio.volume = volume;

      // Update the volume icon depending on the volume level
      if (volume === 0) {
        volumeIcon.textContent = "volume_off";
      } else if (volume <= 0.25) {
        volumeIcon.textContent = "volume_mute";
      } else if (volume <= 0.5) {
        volumeIcon.textContent = "volume_down";
      } else {
        volumeIcon.textContent = "volume_up";
      }
    });
  },
  muteUnmute: () => {
    const volumeSlider = document.getElementById("volumeSlider");
    const volumeIcon = document.getElementById("volumeIcon");
    if (volumeIcon.textContent === "volume_up") {
      volumeIcon.textContent = "volume_mute";
      volumeSlider.value = 0;
      APP.audio.volume = 0;
    } else {
      volumeIcon.textContent = "volume_up";
      volumeSlider.value = 1;
      APP.audio.volume = 1;
    }
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
