// Settings.js
const soundIcon = document.getElementsByClassName('sound-icon')[0];
const musicIcon = document.getElementsByClassName('music-icon')[0];

let soundOn = true;
let musicOn = true;

const soundInput = document.getElementsByClassName('sound-input')[0];
const musicInpit = document.getElementsByClassName('music-input')[0];

soundIcon.addEventListener('click', () => {
  if (soundOn) {
    soundIcon.style.backgroundImage = 'url(../icons/audioOff.png)';
    soundOn = false;
  }
  else {
    soundOn = true;
    checkAudeo();
  }
});

musicIcon.addEventListener('click', () => {
  if (musicOn) {
    musicIcon.style.backgroundImage = 'url(../icons/musicOff.png)';
    musicOn = false;
  }
  else {
    musicOn = true;
    musicIcon.style.backgroundImage = 'url(../icons/musicOn.png)';
  }
});

soundInput.addEventListener('change', () => {
  soundOn = true;
  clearInterval(timerId);
  checkAudeo();
});

let timerId = 0;
soundInput.addEventListener('focus', () => {
  soundOn = true;
  checkAudeo();
  timerId = setInterval(checkAudeo, 250);
});

musicInpit.addEventListener('focus', () => {
  musicOn = true;
  musicIcon.style.backgroundImage = 'url(../icons/musicOn.png)';
});

function checkAudeo() {
  if (soundOn) {
    const value = soundInput.value;
    if (value <= 33) {
      soundIcon.style.backgroundImage = 'url(../icons/audioOn-1.png)';
    }
    else if (value >= 33 && value <= 66) {
      soundIcon.style.backgroundImage = 'url(../icons/audioOn-2.png)';
    }
    else {
      soundIcon.style.backgroundImage = 'url(../icons/audioOn-3.png)';
    }
  }
}