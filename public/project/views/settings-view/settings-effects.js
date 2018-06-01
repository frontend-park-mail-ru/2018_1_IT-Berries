// Settings.js
export default function setSettingsEffectsListeners() {
  const soundIcon = document.getElementsByClassName('sound-icon')[0];
  const musicIcon = document.getElementsByClassName('music-icon')[0];

  let soundOn = true;
  let musicOn = true;

  const soundInput = document.getElementsByClassName('sound-input')[0];
  const musicInpit = document.getElementsByClassName('music-input')[0];

  soundIcon.addEventListener('click', () => {
    if (soundOn) {
      soundIcon.style.backgroundImage = 'url(../../../images/audioOff.png)';
      soundOn = false;
    } else {
      soundOn = true;
      checkAudio();
    }
  });

  musicIcon.addEventListener('click', () => {
    if (musicOn) {
      musicIcon.style.backgroundImage = 'url(../../../images/musicOff.png)';
      musicOn = false;
    } else {
      musicOn = true;
      musicIcon.style.backgroundImage = 'url(../../../images/musicOn.png)';
    }
  });

  soundInput.addEventListener('change', () => {
    soundOn = true;
    clearInterval(timerId);
    checkAudio();
  });

  let timerId = 0;
  soundInput.addEventListener('focus', () => {
    soundOn = true;
    checkAudio();
    timerId = setInterval(checkAudio, 250);
  });

  musicInpit.addEventListener('focus', () => {
    musicOn = true;
    musicIcon.style.backgroundImage = 'url(../../../images/musicOn.png)';
  });

  function checkAudio() {
    if (soundOn) {
      const value = soundInput.value;
      if (value <= 33) {
        soundIcon.style.backgroundImage = 'url(../../../images/audioOn-1.png)';
      } else if (value >= 33 && value <= 66) {
        soundIcon.style.backgroundImage = 'url(../../../images/audioOn-2.png)';
      } else {
        soundIcon.style.backgroundImage = 'url(../../../images/audioOn-3.png)';
      }
    }
  }
}