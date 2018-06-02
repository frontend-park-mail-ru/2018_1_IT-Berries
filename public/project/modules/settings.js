export default new class Settings {

  constructor() {
    if (localStorage) {
      this.theme = localStorage.getItem('theme');
      this.vpn = localStorage.getItem('vpn');
      this.musicVolume = localStorage.getItem('musicVolume');
      this.musicIsOn = localStorage.getItem('musicIsOn');
      this.soundVolume = localStorage.getItem('soundVolume');
      this.soundIsOn = localStorage.getItem('soundIsOn');
    } else {
      this.theme = '1';
      this.vpn = 'false';
      this.musicVolume = 100;
      this.musicIsOn = true;
      this.soundIsOn = true;
      this.soundVolume = 100;
    }
    this.audioPlayer = document.getElementById('audioPlayer');
  }

  isCurrentTheme(themeVal) {
    if (localStorage) {
      this.theme = localStorage.getItem('theme');
    }
    return (this.theme && this.theme === themeVal);
  }

  getCurrentTheme() {
    if (localStorage) {
      this.theme = localStorage.getItem('theme');
    }
    return this.theme;
  }

  setCurrentTheme(newThemeVal) {
    this.theme = newThemeVal;
    if (localStorage) {
      localStorage.setItem('theme', newThemeVal);
    }
  }

  isVpnEnabled() {
    if (localStorage) {
      this.vpn = localStorage.getItem('vpn');
    }
    return (this.vpn === 'true');
  }

  setVpn(newVpnValue) {
    this.vpn = (newVpnValue === true) ? 'true' : 'false';
    if (localStorage) {
      localStorage.setItem('vpn', newVpnValue);
    }
  }

  getCurrentThemeOrVpn() {
    if (this.isVpnEnabled()) {
      return 'vpn';
    } else {
      return this.getCurrentTheme();
    }
  }

  getHeader() {
    this.header = (this.isVpnEnabled()) ? 'Catch the Telegram!' : 'Catch the Alien!';
    return this.header;
  }

  isEnabledMusic() {
    if (localStorage) {
      this.musicIsOn = localStorage.getItem('musicIsOn');
    }
    return (this.musicIsOn === 'true');
  }

  enableMusic() {
    this.musicIsOn = 'true';
    if (localStorage) {
      localStorage.setItem('musicIsOn', this.musicIsOn);
    }
    this.audioPlayer.play();
    if (localStorage) {
      localStorage.setItem('musicVol', window.musicNode.gain.value);
    }
    window.musicCtx.resume();
  }

  disableMusic() {
    this.musicIsOn = 'false';
    if (localStorage) {
      localStorage.setItem('musicIsOn', this.musicIsOn);
    }
    this.audioPlayer.pause();
    window.musicCtx.suspend();
  }

};
