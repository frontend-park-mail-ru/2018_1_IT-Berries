const menuSection = document.getElementsByClassName("menu-section")[0];
const settingsSection = document.getElementsByClassName("settings-section")[0];
const homeButton = document.getElementsByClassName('home')[0];
const tittle = document.getElementsByClassName('tittle')[0];

let link = document.querySelectorAll('link[rel="import"]');
let importConent= link[0].import;
const menuContent = importConent.getElementsByClassName('content')[0];
importConent = link[1].import;
const settingsContent = importConent.getElementsByClassName('content')[0];

menuSection.appendChild(menuContent);
settingsSection.appendChild(settingsContent);

menuSection.hidden = false;
settingsSection.hidden = true;
homeButton.hidden = true;

const settingsButton = document.getElementsByClassName('settings-button')[0];

homeButton.addEventListener('click', () => {
  homeButton.hidden = true;
  menuSection.hidden = false;
  settingsSection.hidden = true;
  tittle.innerHTML = "Catch the Alien!";
});

settingsButton.addEventListener('click', () => {
  homeButton.hidden = false;
  menuSection.hidden = true;
  settingsSection.hidden = false;
  tittle.innerHTML = "Settings";
});


// Settings.js
const soundIcon = document.getElementsByClassName('sound-icon')[0];
const musicIcon = document.getElementsByClassName('music-icon')[0];

let soundOn = true;
let musicOn = true;

const soundInput = document.getElementsByClassName('sound-input')[0];
const musicInpit = document.getElementsByClassName('music-input')[0];

soundIcon.addEventListener('click', () => {
  if (soundOn) {
    soundIcon.style.backgroundImage = 'url(./settings/icons/audioOff.png)';
    soundOn = false;
  }
  else {
    soundOn = true;
    checkAudeo();
  }
});

musicIcon.addEventListener('click', () => {
  if (musicOn) {
    musicIcon.style.backgroundImage = 'url(./settings/icons/musicOff.png)';
    musicOn = false;
  }
  else {
    musicOn = true;
    musicIcon.style.backgroundImage = 'url(./settings/icons/musicOn.png)';
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
  musicIcon.style.backgroundImage = 'url(./settings/icons/musicOn.png)';
});

function checkAudeo() {
  if (soundOn) {
    const value = soundInput.value;
    if (value <= 33) {
      soundIcon.style.backgroundImage = 'url(./settings/icons/audioOn-1.png)';
    }
    else if (value >= 33 && value <= 66) {
      soundIcon.style.backgroundImage = 'url(./settings/icons/audioOn-2.png)';
    }
    else {
      soundIcon.style.backgroundImage = 'url(./settings/icons/audioOn-3.png)';
    }
  }
}