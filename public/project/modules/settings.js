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

  isVpnEnabled() {
    if (localStorage) {
      this.vpn = localStorage.getItem('vpn');
    }
    return (this.vpn === 'true');
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

  getCurrentThemeOrVpn() {
    if (this.isVpnEnabled) {
      return 'vpn';
    } else {
      return this.getCurrentTheme();
    }
  }

};
