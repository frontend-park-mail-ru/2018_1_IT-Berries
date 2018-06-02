import settings from '../../modules/settings';

export default function setSettingsEffectsListeners() {
  const soundIcon = document.getElementsByClassName('sound-icon')[0];
  const musicIcon = document.getElementsByClassName('music-icon')[0];

  let soundOn = true;
  let musicOn = true;

  let timerId = 0;
  let musicId = 0;

  const soundInput = document.getElementsByClassName('sound-input')[0];
  const musicInput = document.getElementsByClassName('music-input')[0];

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
    if (settings.isEnabledMusic()) {
      settings.disableMusic();
      musicIcon.style.backgroundImage = 'url(../../../images/musicOff.png)';
    } else {
      settings.enableMusic();
      musicIcon.style.backgroundImage = 'url(../../../images/musicOn.png)';
    }
  });


  musicInput.addEventListener('change', () => {
    musicOn = true;
    clearInterval(musicId);
    checkMusic();
  });

  soundInput.addEventListener('change', () => {
    soundOn = true;
    clearInterval(timerId);
    checkAudio();
  });

  soundInput.addEventListener('focus', () => {
    soundOn = true;
    checkAudio();
    timerId = setInterval(checkAudio, 250);
  });

  musicInput.addEventListener('focus', () => {
    musicOn = true;
    checkMusic();
    musicId = setInterval(checkMusic, 250);
    settings.enableMusic();
    musicIcon.style.backgroundImage = 'url(../../../images/musicOn.png)';
  });

  function checkMusic() {
    if (musicOn) {
      const value = musicInput.value;
      if (window.musicNode !== undefined && window.musicNode !== null) {
        window.musicNode.gain.value = value / 100;
        if (localStorage) {
          localStorage.setItem('musicVol', window.musicNode.gain.value);
        }
      }
    }
  }

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