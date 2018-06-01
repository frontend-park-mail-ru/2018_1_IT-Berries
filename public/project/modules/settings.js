export default new class Settings {

  constructor() {
    if (localStorage) {
      this.theme = localStorage.getItem('theme');
      this.vpn = localStorage.getItem('vpn');
      this.musicVolume = localStorage.getItem('musicVolume');
      this.soundVolume = localStorage.getItem('soundVolume');
    } else {
      this.theme = '1';
      this.vpn = 'false';
      this.musicVolume = 70;
      this.soundVolume = 70;
    }
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

};
